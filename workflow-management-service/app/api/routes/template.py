"""
  Template routes.
"""
from typing import Any
from fastapi import APIRouter, HTTPException

from common.crud.postgres import templates as crud_templates
from common.models.templates import (Template, TemplateCreate)
from common.deps import PostgresDB, CurrentUser

from sqlmodel import select

router = APIRouter()


@router.post("/")
def create_template(
    *,
    session: PostgresDB,
    template_in: TemplateCreate,
) -> Any:
  """
  Create a new template.
  """
  template_in = TemplateCreate.model_validate(template_in)
  template = crud_templates.create_template(session=session,
                                            template=template_in)
  return template


@router.get("/")
def get_templates(session: PostgresDB) -> list[Template]:
  """
  Get templates.
  """
  #TODO: add option to filter query by user templates
  #TODO: Paginate Results
  return session.exec(select(Template)).fetchall()


@router.delete("/{template_id}")
def delete_template(session: PostgresDB, current_user: CurrentUser,
                    template_id: int) -> Any:
  """
  Delete the template with the provided ID.
  """
  # TODO: What to do with deleted templates
  template = session.get(Template, template_id)
  if not template:
    raise HTTPException(status_code=404, detail="Tempalte not found")
  elif template.user != current_user:
    raise HTTPException(status_code=403,
                        detail="The user doesn't have enough privileges")

  session.delete(template)
  session.commit()
  return {"message": "Template deleted successfully"}
