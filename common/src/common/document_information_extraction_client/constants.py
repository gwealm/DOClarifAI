"""
This module contains constants used in the document_information_extraction_client module.
"""

API_FIELD_CLIENT_ID = 'clientId'
API_FIELD_CLIENT_LIMIT = 'limit'
API_FIELD_CLIENT_NAME = 'clientName'
API_FIELD_DOCUMENT_TYPE = 'documentType'
API_FIELD_DOCUMENT_TYPE_DESCRIPTION = 'documentTypeDescription'
API_FIELD_ENRICHMENT = 'enrichment'
API_FIELD_EXTRACTED_HEADER_FIELDS = 'headerFields'
API_FIELD_EXTRACTED_LINE_ITEM_FIELDS = 'lineItemFields'
API_FIELD_EXTRACTED_VALUES = 'extractedValues'
API_FIELD_FILE_TYPE = 'fileType'
API_FIELD_ID = 'id'
API_FIELD_PREDEFINED = 'predefined'
API_FIELD_RESULTS = 'results'
API_FIELD_RETURN_NULL = 'returnNullValues'
API_FIELD_SCHEMA_ID = 'schemaId'
API_FIELD_NAME = 'name'
API_FIELD_DESCRIPTION = 'description'
API_FIELD_DATATYPE = 'datatype'
API_FIELD_LABEL = 'label'
API_FIELD_FIELD_NAME = 'fieldName'
API_FIELD_FORMATTING = 'formatting'
API_FIELD_FORMATTING_TYPE = 'formattingType'
API_FIELD_FORMATTING_TYPE_VERSION = 'formattingTypeVersion'
API_FIELD_PRIORITY = 'priority'
API_FIELD_SETUP = 'setup'
API_FIELD_SETUP_TYPE = 'setupType'
API_FIELD_SETUP_TYPE_VERSION = 'setupTypeVersion'
API_FIELD_STATIC = 'static'
API_FIELD_DEFAULT_EXTRACTOR = 'defaultExtractor'
API_FIELD_SCHEMA_DESCRIPTION = 'schemaDescription'
API_FIELD_STATUS = 'status'
API_FIELD_TEMPLATE_ID = 'templateId'
API_FIELD_TYPE = 'type'
API_FIELD_VALUE = 'value'
API_FIELD_DATA_FOR_RETRAINING = 'dataForRetraining'

API_REQUEST_FIELD_CLIENT_START_WITH = 'clientIdStartsWith'
API_REQUEST_FIELD_EXTRACTED_FIELDS = 'extraction'
API_REQUEST_FIELD_FILE = 'file'
API_REQUEST_FIELD_LIMIT = 'limit'
API_REQUEST_FIELD_OFFSET = 'offset'
API_REQUEST_FIELD_OPTIONS = 'options'
API_REQUEST_FIELD_ORDER = 'order'
API_REQUEST_FIELD_PAYLOAD = 'payload'
API_REQUEST_FIELD_RECEIVED_DATE = 'receivedDate'

API_REQUEST_FIELD_ENRICHMENT_COMPANYCODE = 'companyCode'
API_REQUEST_FIELD_ENRICHMENT_ID = 'id'
API_REQUEST_FIELD_ENRICHMENT_SUBTYPE = 'subtype'
API_REQUEST_FIELD_ENRICHMENT_SYSTEM = 'system'
API_REQUEST_FIELD_ENRICHMENT_TYPE = 'type'

API_HEADER_ACCEPT = 'accept'

CONTENT_TYPE_JPEG = 'image/jpeg'
CONTENT_TYPE_PDF = 'application/pdf'
CONTENT_TYPE_PNG = 'image/png'
CONTENT_TYPE_TIFF = 'image/tiff'
CONTENT_TYPE_UNKNOWN = 'unknown'
DATA_TYPE_BUSINESS_ENTITY = 'businessEntity'
DOCUMENT_TYPE_ADVICE = 'paymentAdvice'
FILE_TYPE_EXCEL = 'Excel'

MODEL_TYPE_DEFAULT = 'defaultWorkflow'
MODEL_TYPE_LLM = 'llmWorkflow'
MODEL_TYPE_TEMPLATE = 'templateWorkflow'

SCHEMAS_ENDPOINT = '/schemas'
SCHEMAS_UPDATE_ENDPOINT = SCHEMAS_ENDPOINT + '/{schemaId}'
SCHEMAS_CAPABILITIES = SCHEMAS_ENDPOINT + '/capabilities'
SCHEMAS_VERSIONS_ENDPOINT = SCHEMAS_UPDATE_ENDPOINT + '/versions'
SCHEMAS_VERSION_UUID_ENDPOINT = SCHEMAS_VERSIONS_ENDPOINT + '/{versionId}'
SCHEMAS_VERSION_FIELDS_ENDPOINT = SCHEMAS_VERSION_UUID_ENDPOINT + '/fields'
SCHEMAS_VERSION_ACTIVATE_ENDPOINT = SCHEMAS_VERSION_UUID_ENDPOINT + '/activate'
SCHEMAS_VERSION_DEACTIVATE_ENDPOINT = SCHEMAS_VERSION_UUID_ENDPOINT + '/deactivate'

SETUP_TYPE_VERSION_1 = '1.0.0'
SETUP_TYPE_VERSION_2 = '2.0.0'
SETUP_TYPE_AUTO = 'auto'
SETUP_TYPE_MANUAL = 'manual'
SETUP_TYPE_PRIORITY = 1

SUPPORTED_MODEL_TYPES = [
    MODEL_TYPE_DEFAULT, MODEL_TYPE_LLM, MODEL_TYPE_TEMPLATE
]
