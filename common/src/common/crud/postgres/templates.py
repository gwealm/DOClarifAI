"""
  This module contains the CRUD operations for the Template ORM.
"""
from sqlmodel import Session, select
from common.models.templates import Template, TemplateCreate


def create_template(*, session: Session, template: TemplateCreate) -> Template:
  """
  Create a new template.
  Args:
    session: PostgresDB session
    template: New template information
  Returns:
    template: The created template
  """
  db_obj = template.model_validate(template)
  session.add(db_obj)
  session.commit()
  session.refresh(db_obj)
  return db_obj


def get_templates(*, session: Session) -> list[Template]:
  """
    List Available templates.
    Args:
      session: PostgresDB session
    Returns:
      list[template]: available templates
  """
  statement = select(Template)
  # TODO: Paginate Results
  templates = session.exec(statement).all()
  return templates
