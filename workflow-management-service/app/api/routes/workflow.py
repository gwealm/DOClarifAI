"""
  Workflow routes.
"""
from typing import Any
from fastapi import APIRouter, HTTPException
from common.crud.postgres import workflows as crud_workflows
from common.deps import (
    CurrentUser,
    PostgresDB,
)
from common.models.workflows import (Workflow, WorkflowIn, WorkflowCreate)

router = APIRouter()


@router.post("/", response_model=Workflow)
def create_workflow(*, session: PostgresDB, current_user: CurrentUser,
                    workflow_in: WorkflowIn) -> Any:
  """
  Create a new workflow.
  """
  # TODO: less verbose way of doing this
  workflow_create = WorkflowCreate.model_construct(**workflow_in.model_dump(),
                                                   user_id=current_user.id)
  workflow_create = WorkflowCreate.model_validate(workflow_create)
  workflow = crud_workflows.create_workflow(session=session,
                                            workflow=workflow_create)
  return workflow


@router.get("/")
def get_user_workflows(current_user: CurrentUser) -> list[Workflow]:
  #TODO: Paginate Results
  """
  Get current user's workflows.
  """
  return current_user.workflows


@router.delete("/{workflow_id}")
def delete_workflow(session: PostgresDB, current_user: CurrentUser,
                    workflow_id: int) -> Any:
  """
  Delete the workflow with the provided ID.
  """
  # TODO: What to do with deleted files
  # Maybe make the user consume the processed files before deleting workflow
  # Or on delete return all files
  workflow = session.get(Workflow, workflow_id)
  if not workflow:
    raise HTTPException(status_code=404, detail="Workflow not found")
  elif workflow.user != current_user:
    raise HTTPException(status_code=403,
                        detail="The user doesn't have enough privileges")

  #TODO: Delete all  data related with the user (workflows, documents, etc)
  session.delete(workflow)
  session.commit()
  return {"message": "Workflow deleted successfully"}
