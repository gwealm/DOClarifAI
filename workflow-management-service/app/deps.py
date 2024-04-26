"""
  Dependencies for FastAPI endpoints
"""
from typing import Annotated

from fastapi import Depends, HTTPException, status


from common.models.workflows import Workflow
from common.deps import CurrentUser


def get_path_workflow(workflow_id: int, current_user: CurrentUser) -> Workflow:
    pass


PathWorkflow =  Annotated[Workflow,Depends(get_path_workflow)]
