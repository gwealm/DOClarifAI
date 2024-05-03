"""
  Template routes.
"""
from typing import Any
from fastapi import APIRouter, HTTPException

from common.crud.postgres import templates as crud_templates
from common.models.templates import (Template, TemplateCreate, TemplateIn)
from common.deps import PostgresDB, CurrentUser

from sqlmodel import select

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
  # TODO: less verbose way of doing this
  template_create = TemplateCreate.model_construct(**template_in.model_dump(),
                                                   user_id=current_user.id)
  template_create = Template.model_validate(template_create)
  template = crud_templates.create_template(session=session,
                                            template=template_create)
  return template


@router.get("/")
def get_templates(session: PostgresDB, user_only: bool | None,
                  current_user: CurrentUser) -> list[Template]:
  """
  Get templates.
  """
  #TODO: add option to filter query by user templates
  #TODO: Paginate Results
  if user_only:
    return current_user.templates
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
