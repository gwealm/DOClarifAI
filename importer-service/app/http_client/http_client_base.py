import json
import logging
import asyncio
import httpx
from .constants import API_STATUS_FIELD, MIN_POLLING_INTERVAL, FAILED_STATUSES, SUCCEEDED_STATUSES
from .exceptions import ApiException, ClientException, FailedAsynchronousOperationException, \
    PollingTimeoutException, ServerException, UnauthorizedException, MissingTokenError, TokenExpiredError
from .helpers import  make_url, make_oauth_url
import logging
import time

class CommonClient:
    def __init__(self,
                 base_url,
                 client_id,
                 client_secret,
                 uaa_url,
                 polling_sleep=5,
                 polling_max_attempts=120,
                 url_path_prefix='',
                 logger_name='CommonClient',
                 logging_level=logging.WARNING):

        self.common_logger = logging.getLogger('CommonClient')
        self.common_logger.setLevel(logging_level)
        self.logger = logging.getLogger(logger_name)
        self.logger.setLevel(logging_level)

        if polling_sleep < MIN_POLLING_INTERVAL:
            self.logger.warning('The polling interval of {} is too small, the number was set to minimal '
                                'allowed amount of {}'.format(polling_sleep, MIN_POLLING_INTERVAL))
            polling_sleep = MIN_POLLING_INTERVAL

        self.base_url = make_url(base_url, url_path_prefix)
        self.polling_max_attempts = polling_max_attempts
        self.polling_sleep = polling_sleep
        self.client_id = client_id
        self.client_secret = client_secret
        self.uaa_url = uaa_url
        self._session = None

    @property
    async def session(self):
        if self._session is None:
            self._session = await self._get_oauth_session()
        return self._session

    async def _get_oauth_session(self):
        if not (self.uaa_url and self.client_id and self.client_secret):
            raise ClientException('Authentication is missing')
        
        session = httpx.AsyncClient()
        return await self._fetch_session_token(session)

    async def _fetch_session_token(self, session):
        tries, i = 2, 0
        for i in range(tries):
            try:
                response = await session.post(
                    url=make_oauth_url(self.uaa_url),
                    data={
                        'client_id': self.client_id,
                        'client_secret': self.client_secret,
                        'grant_type': 'client_credentials'
                    }
                )
                response_params = response.json()
                if 'access_token' not in response_params:
                    raise MissingTokenError(description="Missing access token parameter.")
                self.token = response_params["access_token"]
                self._expires_at = time.time() + response_params["expires_in"]
                return session
            
            except MissingTokenError as e:
                if i < tries - 1:
                    await asyncio.sleep(5)
                    continue
                else:
                    raise ApiException(f'Unable to fetch the Bearer Token after {tries} tries') from e

    async def _request(self, request_func, path: str, validate: bool, log_msg_before=None, log_msg_after=None, **kwargs):
        headers = kwargs.get('headers', {})
        headers['Authorization'] = f'Bearer {self.token}'
        kwargs['headers'] = headers
                
        if log_msg_before is not None:
            self.logger.debug(log_msg_before)
        
        
        try:
            if self._expires_at and self._expires_at < time.time():
                raise TokenExpiredError()

            response = await request_func(self.path_to_url(path), **kwargs)
        except TokenExpiredError:
            self.logger.warning("OAuth token expired, fetching new token")
            await self._fetch_session_token(self.session)
            response = await request_func(self.path_to_url(path), **kwargs)
        

        if validate:
            self.raise_for_status_with_logging(response)
        if log_msg_after is not None:
            self.logger.info(log_msg_after)
        return response


    async def _poll_for_url(self,
                      path,
                      check_json_status=True,
                      success_status=200,
                      wait_status=None,
                      sleep_interval=None,
                      get_status=lambda r: r[API_STATUS_FIELD],
                      log_msg_before=None,
                      log_msg_after=None,
                      **kwargs):
        if not sleep_interval:
            sleep_interval = self.polling_sleep

        if log_msg_before is not None:
            self.logger.debug(log_msg_before)

        response = None
        for _ in range(self.polling_max_attempts):
            response = await self.get(path, validate=False, **kwargs)

            if (wait_status is not None) and response.status_code == wait_status:
                await asyncio.sleep(sleep_interval)
            elif response.status_code == success_status:
                if check_json_status:
                    response_status = get_status(response.json())
                    if response_status in SUCCEEDED_STATUSES:
                        if log_msg_after is not None:
                            self.logger.info(log_msg_after)
                        return response
                    elif response_status in FAILED_STATUSES:
                        raise FailedAsynchronousOperationException("Asynchronous job with URL '{}' failed".format(
                            self.path_to_url(path)), response=response)
                    else:
                        await asyncio.sleep(sleep_interval)
                else:
                    if log_msg_after is not None:
                        self.logger.info(log_msg_after)
                    return response
            else:
                self.raise_for_status_with_logging(response)
        raise PollingTimeoutException("Polling for URL '{}' timed out after {} seconds".format(
            self.path_to_url(path), sleep_interval * self.polling_max_attempts), response=response)

    def path_to_url(self, path):
        return make_url(self.base_url, path)

    async def get(self, path: str, validate=True, **kwargs):
        return await self._request((await self.session).get, path, validate, **kwargs)

    async def post(self, path: str, validate=True, **kwargs):
        return await self._request((await self.session).post, path, validate, **kwargs)

    async def delete(self, path: str, validate=True, **kwargs):
        return await self._request((await self.session).delete, path, validate, **kwargs)

    async def put(self, path: str, validate=True, **kwargs):
        return await self._request((await self.session).put, path, validate, **kwargs)

    def raise_for_status_with_logging(self, response):
        e = None
        if response.status_code == 401:
            e = UnauthorizedException('Missing authorization for this service', response, status_code=401)
        elif 400 <= response.status_code < 500:
            try:
                msg = str(response.json())
            except json.JSONDecodeError:
                msg = response.text
            e = ClientException(msg, response=response, status_code=response.status_code)
        elif 500 <= response.status_code < 600:
            e = ServerException(response.text, response=response, status_code=response.status_code)

        if e is not None:
            self.common_logger.warning(f'{response.request.method} request to URL {response.url} failed '
                                       f'with body: {response.text}')
            raise e
