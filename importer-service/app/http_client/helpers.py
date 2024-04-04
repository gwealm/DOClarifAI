def make_url(base, extension) -> str:
    if base.endswith('/'):
        base = base[:-1]
    if not extension.startswith('/'):
        extension = '/' + extension
    return base + extension


def make_oauth_url(auth_url) -> str:
    if auth_url.endswith('/'):
        auth_url = auth_url[:-1]
    if auth_url.endswith('/oauth/token'):
        return auth_url
    return make_url(auth_url, '/oauth/token')

