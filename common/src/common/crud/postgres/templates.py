"""
  This module contains the CRUD operations for the Template ORM.
"""
from sqlmodel import Session, select
from common.models.templates import Template, TemplateCreate, TemplateUpdate
from common.models.workflows import Workflow

def create_template(*, session: Session, template: TemplateCreate) -> Template:
  """
  Create a new template.
  Args:
    session: PostgresDB session
    template: New template information
  Returns:
    template: The created template
  """

  db_obj = Template(
      name=template.name,
      description=template.description,
      template_id_dox=template.template_id_dox,
      schema_id=template.schema_id,
      user_id=template.user_id,
      document_type_id=template.document_type_id
  )
  session.add(db_obj)
  session.commit()
  session.refresh(db_obj)
  return db_obj

def update_template(*, session:Session, template_id:int, template_in: TemplateUpdate) -> Template:
  db_obj:Template = session.query(Template).filter(Template.id == template_id).first()
  if not db_obj:
    return None
  db_obj.name = template_in.name
  db_obj.description = template_in.description
  db_obj.schema_id = template_in.schema_id
  db_obj.document_type_id = template_in.document_type_id
  db_obj.template_id_dox = template_in.template_id_dox
  session.commit()
  session.refresh(db_obj)
  return db_obj


def get_template_by_id(*, session:Session, template_id:int) -> Template:
  statement = select(Template).where(Template.id == template_id)
  template = session.exec(statement).first()
  return template

def get_user_active_templates(*, session:Session, user_id:int) -> list[Template]:
  statement =  select(Template)\
              .filter(Template.user_id == user_id)\
              .filter(Template.active == True)
  active_templates = session.exec(statement).all()
  return active_templates
