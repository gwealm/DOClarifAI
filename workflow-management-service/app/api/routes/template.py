"""
  Template routes.
"""
from typing import Any
from fastapi import APIRouter, HTTPException

from common.crud.postgres import templates as crud_templates
from common.crud.postgres import schemas as crud_schemas
from common.crud.postgres import document_types as crud_document_types
from common.models.templates import (Template, TemplateCreate, TemplateUpdate, TemplateIn)
from common.deps import PostgresDB, CurrentUser, DoxClient


router = APIRouter(prefix="/template")


@router.post("/")
async def create_template(
    session: PostgresDB,
    template_in: TemplateIn,
    current_user: CurrentUser,
    dox_client: DoxClient
) -> Template:
  """
  Create a new template.
  """

  already_existing_template = crud_templates.get_user_template_by_name(session=session,
                                                                       user_id=current_user.id,
                                                                       template_name=template_in.name)
  if already_existing_template is not None:
    raise HTTPException(status_code=400, detail="Template with provided name already exists")


  document_type = crud_document_types.get_document_type_by_id(session=session, document_type_id=template_in.document_type_id)
  schema = crud_schemas.get_schema_by_id(session=session,schema_id=template_in.schema_id)

  if not document_type:
    raise HTTPException(status_code=404, detail="Document type not found")
  if not schema:
    raise HTTPException(status_code=404, detail="Schema not found")
  if schema.user!=current_user:
    raise HTTPException(status_code=403,
                        detail="The user doesn't have enough privileges")
  if schema.document_type != document_type:
    raise HTTPException(status_code=400,
                    detail="The schema document type doesn't match with the template document type")
  if not schema.active:
    raise HTTPException(status_code=400,
                    detail="The provided schema is not active")

  payload = {
    "name": f"{current_user.username}_{template_in.name}",
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


@router.put("/{template_id}")
async def update_template(
    session: PostgresDB,
    template_in: TemplateIn,
    current_user: CurrentUser,
    dox_client: DoxClient,
    template_id:int
) -> Template:

  """
  Update a template.
  """

  template = crud_templates.get_template_by_id(session=session,template_id=template_id)
  if not template:
    raise HTTPException(status_code=404, detail="Template not found")
  elif template.user != current_user:
    raise HTTPException(status_code=403,
                        detail="The user doesn't have enough privileges")
  elif template.active:
    raise HTTPException(status_code=400,
                    detail="Can't edit active templates")

  document_type = crud_document_types.get_document_type_by_id(session=session, document_type_id=template_in.document_type_id)
  schema = crud_schemas.get_schema_by_id(session=session,schema_id=template_in.schema_id)

  if not document_type:
    raise HTTPException(status_code=404, detail="Document type not found")
  if not schema:
    raise HTTPException(status_code=404, detail="Schema not found")
  if schema.user!=current_user:
    raise HTTPException(status_code=403,
                        detail="The user doesn't have enough privileges")
  if schema.document_type != document_type:
    raise HTTPException(status_code=400,
                    detail="The schema document type doesn't match with the template document type")
  if not schema.active:
    raise HTTPException(status_code=400,
                    detail="The provided schema is not active")
  payload = {
    "name": f"{current_user.username}_{template_in.name}",
    "description":template_in.description,
    "clientId":"default",
    "schemaId":schema.schema_id_dox,
    "id": template.template_id_dox,
    "schemaVersion":"1"
  }

  # Create the template in the Dox API
  try:
      dox_response = await dox_client.create_template(payload)
  except Exception as e:
      raise HTTPException(status_code=500, detail="Failed to update template in the Dox API") from e


  template_id_dox = dox_response.get("id")


  template_update = TemplateUpdate.model_construct(
    **template_in.model_dump(),
    template_id_dox=template_id_dox
  )

  template = crud_templates.update_template(session=session,
                                            template_id=template_id,
                                            template_in=template_update)
  return template


@router.post("/{template_id}/activate")
async def activate_template(
    session: PostgresDB,
    current_user: CurrentUser,
    dox_client: DoxClient,
    template_id:int):

  template = crud_templates.get_template_by_id(session=session,template_id=template_id)
  if not template:
    raise HTTPException(status_code=404, detail="Template not found")
  elif template.user != current_user:
    raise HTTPException(status_code=403,
                        detail="The user doesn't have enough privileges")
  elif template.active:
    raise HTTPException(status_code=400,
                    detail="The template is already active")

  await dox_client.activate_template(template.template_id_dox)
  template.active = True
  session.commit()
  return {"message": "Template activated succesfully"}


@router.post("/{template_id}/deactivate")
async def deactivate_template(
    session: PostgresDB,
    current_user: CurrentUser,
    dox_client: DoxClient,
    template_id:int):

  template = crud_templates.get_template_by_id(session=session,template_id=template_id)
  if not template:
    raise HTTPException(status_code=404, detail="Template not found.")
  elif template.user != current_user:
    raise HTTPException(status_code=403,
                        detail="The user doesn't have enough privileges.")
  elif not template.active:
    raise HTTPException(status_code=400,
                    detail="The template is already inactive.")
  elif len(template.workflows)>0:
    raise HTTPException(status_code=400,
                    detail="The template is being used by at least one workflow.")

  await dox_client.deactivate_template(template.template_id_dox)
  template.active = False
  session.commit()
  return {"message": "Template deactivated succesfully"}


@router.get("/{template_id}")
def get_template(session: PostgresDB, current_user: CurrentUser,
                 template_id: int) -> Template:
  """
  Get the template with the provided ID.
  """
  template = session.get(Template, template_id)
  if not template:
    raise HTTPException(status_code=404, detail="Template not found")
  elif template.user != current_user:
    raise HTTPException(status_code=403,
                        detail="The user doesn't have enough privileges")
  return template


@router.get("/")
def get_templates(current_user: CurrentUser) -> list[Template]:
  """
  Get user templates.
  """
  return current_user.templates

