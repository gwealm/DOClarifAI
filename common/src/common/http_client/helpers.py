"""
This snippet is from the helper module of the HTTP client in the importer-service.
"""

def make_url(base: str, extension: str) -> str:
  """
    Concatenates a base URL and an extension to form a complete URL.

    Args:
        base (str): The base URL.
        extension (str): The extension to append to the base URL.

    Returns:
        str: The concatenated URL.

    Examples:
        >>> make_url("https://example.com", "api/v1")
        'https://example.com/api/v1'
    """
  if base.endswith('/'):
    base = base[:-1]
  if not extension.startswith('/'):
    extension = '/' + extension
  return base + extension


def make_oauth_url(auth_url: str) -> str:
  """
    Constructs the OAuth URL for token authentication.

    Args:
        auth_url (str): The base authentication URL.

    Returns:
        str: The constructed OAuth URL.

    Examples:
        >>> make_oauth_url("https://example.com")
        'https://example.com/oauth/token'
    """
  if auth_url.endswith('/'):
    auth_url = auth_url[:-1]
  if auth_url.endswith('/oauth/token'):
    return auth_url
  return make_url(auth_url, '/oauth/token')
