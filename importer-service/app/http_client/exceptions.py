class ApiException(Exception):
    def __init__(self, message, response=None, status_code=None):
        super(ApiException, self).__init__(message)
        self.response = response
        self.status_code = status_code


class PollingTimeoutException(ApiException):
    pass


class FailedAsynchronousOperationException(ApiException):
    pass


class ClientException(ApiException):
    pass


class ServerException(ApiException):
    pass


class UnauthorizedException(ClientException):
    pass

class TokenExpiredError(ClientException):
    pass

class MissingTokenError(ClientException):
    pass