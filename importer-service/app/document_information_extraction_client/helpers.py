from .constants import API_FIELD_CLIENT_ID, API_FIELD_DOCUMENT_TYPE, API_FIELD_ENRICHMENT, API_FIELD_TEMPLATE_ID, \
    API_FIELD_EXTRACTED_HEADER_FIELDS, API_FIELD_EXTRACTED_LINE_ITEM_FIELDS, API_FIELD_SCHEMA_ID, \
    API_REQUEST_FIELD_EXTRACTED_FIELDS

def create_document_options(client_id, document_type, header_fields=None, line_item_fields=None, template_id=None,
                            schema_id=None, received_date=None, enrichment=None):
    options = {
        API_FIELD_CLIENT_ID: client_id,
        API_FIELD_DOCUMENT_TYPE: document_type,
    }

    if schema_id is not None:
        options[API_FIELD_SCHEMA_ID] = schema_id
    else:
        options[API_REQUEST_FIELD_EXTRACTED_FIELDS] = {}
        try:
            header_fields = _convert_string_to_list(header_fields)
        except TypeError:
            raise TypeError(f'Input variable \'header_fields\' has wrong type: {type(header_fields)}. Should be a '
                            f'string of comma separated values or a list of strings')
        options[API_REQUEST_FIELD_EXTRACTED_FIELDS][API_FIELD_EXTRACTED_HEADER_FIELDS] = header_fields

        try:
            line_item_fields = _convert_string_to_list(line_item_fields)
        except TypeError:
            raise TypeError(f'Input variable \'line_item_fields\' has wrong type: {type(line_item_fields)}. Should be '
                            f'a string of comma separated values or a list of strings')

        options[API_REQUEST_FIELD_EXTRACTED_FIELDS][API_FIELD_EXTRACTED_LINE_ITEM_FIELDS] = line_item_fields

    if template_id is not None:
        options[API_FIELD_TEMPLATE_ID] = template_id

    if received_date is not None:
        options[API_REQUEST_FIELD_RECEIVED_DATE] = received_date

    if enrichment is not None:
        options[API_FIELD_ENRICHMENT] = enrichment

    return options


def _convert_string_to_list(parameter) -> list:
    if parameter is None:
        parameter = []
    elif isinstance(parameter, str):
        parameter = [s.strip() for s in parameter.split(',')]
    elif not isinstance(parameter, list):
        raise TypeError
    return parameter
