"""
  Workflow routes.
"""
from typing import Any
from fastapi import APIRouter, HTTPException
from common.crud.postgres import workflows as crud_workflows
from common.crud.postgres import templates as crud_templates
from common.deps import (
    CurrentUser,
    PostgresDB,
)
from common.models.workflows import (Workflow, WorkflowIn, WorkflowCreate)
from common.models.templates import Template

router = APIRouter()


@router.post("/", response_model=Workflow)
def create_workflow(*, session: PostgresDB, current_user: CurrentUser,
                    workflow_in: WorkflowIn) -> Any:
  """
  Create a new workflow.
  """
  template:Template = crud_templates.get_template_by_id(session=session,template_id=workflow_in.template_id)
  if not template:
    raise HTTPException(status_code=404, detail="Template not found")
  if template.user!=current_user:
    raise HTTPException(status_code=403,
                        detail="The user doesn't have enough privileges")
  if not template.active:
    raise HTTPException(status_code=400,
                    detail="The provided template is not active")
  
  workflow_create = WorkflowCreate.model_construct(**workflow_in.model_dump(),
                                                   user_id=current_user.id)
  workflow_create = WorkflowCreate.model_validate(workflow_create)
  workflow = crud_workflows.create_workflow(session=session,
                                            workflow=workflow_create)
  return workflow

@router.put("/{workflow_id}",response_model=Workflow)
def update_workflow(*, session:PostgresDB, current_user:CurrentUser, workflow_id:int, workflow_in:WorkflowIn):
  """
  Updates a workflow.
  """

  workflow:Workflow = crud_workflows.get_workflow_by_id(session=session,workflow_id=workflow_id)
  if not workflow:
    raise HTTPException(status_code=404, detail="Workflow not found")
  elif workflow.user != current_user:
    raise HTTPException(status_code=403,
                        detail="The user doesn't have enough privileges")

  template:Template = crud_templates.get_template_by_id(session=session,template_id=workflow_update.template_id)
  if not template:
    raise HTTPException(status_code=404, detail="Template not found")
  if template.user!=current_user:
    raise HTTPException(status_code=403,
                        detail="The user doesn't have enough privileges")
  if not template.active:
    raise HTTPException(status_code=400,
                    detail="The provided template is not active")
  
  workflow_update = WorkflowCreate.model_construct(**workflow_in.model_dump(),
                                                   user_id=current_user.id)
  workflow_update = WorkflowCreate.model_validate(workflow_update)
  workflow = crud_workflows.update_workflow(session=session,
                                            workflow_id=workflow_id,
                                            workflow=workflow_update)
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
  workflow = session.get(Workflow, workflow_id)
  if not workflow:
    raise HTTPException(status_code=404, detail="Workflow not found")
  elif workflow.user != current_user:
    raise HTTPException(status_code=403,
                        detail="The user doesn't have enough privileges")

  #Delete all of the workflow's files
  for file in workflow.files:
    session.delete(file)
  
  session.delete(workflow)
  session.commit()
  return {"message": "Workflow deleted successfully"}

@router.get("/{workflow_id}")
def get_workflow(session: PostgresDB, current_user: CurrentUser,
                 workflow_id: int) -> Any:
  """
  Get the workflow with the provided ID.
  """
  workflow = session.get(Workflow, workflow_id)
  if not workflow:
    raise HTTPException(status_code=404, detail="Workflow not found")
  elif workflow.user != current_user:
    raise HTTPException(status_code=403,
                        detail="The user doesn't have enough privileges")
  return workflow