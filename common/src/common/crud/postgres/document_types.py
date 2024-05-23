from common.document_information_extraction_client.dox_api_client import DoxApiClient
from sqlmodel import Session,select
from common.models.document_types import DocumentType,DocumentTypeCreate

async def add_document_types(*, session:Session,dox_client:DoxApiClient):
  document_type_names = await dox_client.get_document_types()
  for document_type_name in document_type_names:
    existing_document_type = get_document_type_by_name(session=session, name=document_type_name)
    if not existing_document_type:
      document_type = DocumentTypeCreate(name=document_type_name)
      create_document_type(session=session,document_type=document_type)  
    
def get_document_type_by_name(*, session:Session, name:str):
  statement = select(DocumentType).where(DocumentType.name == name)
  document_type = session.exec(statement).first()
  return document_type

def create_document_type(*, session:Session, document_type:DocumentTypeCreate):
  db_obj = DocumentType.model_validate(document_type)
  session.add(db_obj)
  session.commit()
  session.refresh(db_obj)
  
def get_document_type_by_id(*, session:Session, document_type_id:int) -> DocumentType:
  statement = select(DocumentType).where(DocumentType.id == document_type_id)
  document_type = session.exec(statement).first()
  return document_type

def get_document_types(*, session:Session) -> list[DocumentType]:
    return session.query(DocumentType).all()
    