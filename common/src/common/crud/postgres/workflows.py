"""
  This module contains the CRUD operations for the Workflow ORM.
"""
from sqlmodel import Session, select
from common.models.workflows import Workflow, WorkflowCreate


def create_workflow(*, session: Session, workflow: WorkflowCreate) -> Workflow:
  """
  Create a new workflow.
  Args:
    session: PostgresDB session
    workflow: New workflow information
  Returns:
    Workflow: The created workflow
  """
  db_obj = Workflow.model_validate(workflow, update={"email": ""})
  session.add(db_obj)
  session.commit()
  session.refresh(db_obj)
  return db_obj


def get_workflows_by_id(*, session: Session, user_id: int) -> list[Workflow]:
  """
    Get a user by username.
    Args:
      session: PostgresDB session
      user_id: The user_id to search
    Returns:
      list[Workflow]: The User Workflows
  """
  statement = select(Workflow).where(Workflow.user_id == user_id)
  # TODO: Paginate Results
  workflows = session.exec(statement).all()
  return workflows
