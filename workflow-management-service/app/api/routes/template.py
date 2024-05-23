"""
  Template routes.
"""
from typing import Any
from fastapi import APIRouter, HTTPException

from common.crud.postgres import templates as crud_templates
from common.crud.postgres import schemas as crud_schemas
from common.crud.postgres import document_types as crud_document_types
from common.models.templates import (Template, TemplateCreate, TemplateIn)
from common.deps import PostgresDB, CurrentUser, DoxClient


router = APIRouter(prefix="/template")


@router.post("/")
async def create_template(
    *,
    session: PostgresDB,
    template_in: TemplateIn,
    current_user: CurrentUser,
    dox_client: DoxClient
) -> Any:
  """
  Create a new template.
  """
  
  document_type = crud_document_types.get_document_type_by_id(session=session, document_type_id=template_in.document_type_id)
  schema = crud_schemas.get_schema_by_id(session=session,schema_id=template_in.schema_id)

  if not document_type:
    raise HTTPException(status_code=404, detail="document type not found")
  if not schema:
    raise HTTPException(status_code=404, detail="schema not found")
  if schema.user!=current_user:
    raise HTTPException(status_code=403,
                        detail="The user doesn't have enough privileges")
  if schema.document_type != document_type:
    raise HTTPException(status_code=400,
                    detail="The schema document type doesn't match with the template document type")
  payload = {
    "name":template_in.name,
    "description":template_in.description,
    "clientId":"default",
    "schemaId":schema.schema_id_dox,
    "schemaVersion":"1"
  }  
  
  # Create the template in the Dox API
  try:
      dox_response = await dox_client.create_template(payload)
  except Exception as e:
      raise HTTPException(status_code=500, detail="Failed to create template in the Dox API") from e

  
  template_id_dox = dox_response.get("id")

  
  template_create = TemplateCreate.model_construct(
    **template_in.model_dump(),
    template_id_dox=template_id_dox,
    user_id=current_user.id
  )
  
  template = crud_templates.create_template(session=session,
                                            template=template_create)
  return template


@router.get("/")
def get_templates(current_user: CurrentUser) -> list[Template]:
  """
  Get user templates.
  """
  return current_user.templates


@router.delete("/{template_id}")
def delete_template(session: PostgresDB, current_user: CurrentUser,
                    template_id: int) -> Any:
  """
  Delete the template with the provided ID.
  """
  template = session.get(Template, template_id)
  if not template:
    raise HTTPException(status_code=404, detail="Template not found")
  elif template.user != current_user:
    raise HTTPException(status_code=403,
                        detail="The user doesn't have enough privileges")

  session.delete(template)
  session.commit()
  return {"message": "Template deleted successfully"}
