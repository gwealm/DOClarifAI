"""
  Template routes.
"""
from typing import Any
from fastapi import APIRouter, HTTPException

from common.crud.postgres import templates as crud_templates
from common.models.templates import (Template, TemplateCreate, TemplateIn)
from common.deps import PostgresDB, CurrentUser


router = APIRouter(prefix="/template")


@router.post("/")
def create_template(
    *,
    session: PostgresDB,
    template_in: TemplateIn,
    current_user: CurrentUser,
) -> Any:
  """
  Create a new template.
  """
  template_create = TemplateCreate.model_construct(**template_in.model_dump(),
                                                   user_id=current_user.id
                                                   #TODO: template_id_dox=...

                                                  )
  template_create = Template.model_validate(template_create)
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
