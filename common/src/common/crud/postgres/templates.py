"""
  This module contains the CRUD operations for the Template ORM.
"""
from sqlmodel import Session, select
from common.models.templates import Template, TemplateCreate
from common.models.users import User


def create_template(*, session: Session, template: TemplateCreate) -> Template:
  """
  Create a new template.
  Args:
    session: PostgresDB session
    template: New template information
  Returns:
    template: The created template
  """
  db_obj = Template.model_validate(template)
  session.add(db_obj)
  session.commit()
  session.refresh(db_obj)

  if template.user_id:
    statement = select(User).where(User.id == template.user_id)
    # Don't know why This has to be done.
    # While creating a template normally, if it had directly the user_id this
    # would be set to None after calling session.refresh()
    user = session.exec(statement).one()
    if not user:
      return None
    db_obj.user = user
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
