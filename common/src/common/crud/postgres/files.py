"""
  This module contains the CRUD operations for the File ORM.
"""
from sqlmodel import Session, select
from common.models.files import File, FileCreate


def create_file(*, session: Session, file: FileCreate) -> File:
  """
  Create a new file.
  Args:
    session: PostgresDB session
    file: New file information
  Returns:
    File: The created file
  """
  db_obj = File.model_validate(file)
  session.add(db_obj)
  session.commit()
  session.refresh(db_obj)
  return db_obj


def get_files_by_workflow_id(*, session: Session,
                             workflow_id: int) -> list[File]:
  """
    Get files by workflow id.
    Args:
      session: PostgresDB session
      workflow id: The workflow id
    Returns:
      list[File]: The Files related to the workflow id
  """
  statement = select(File).where(File.workflow_id == workflow_id)
  # TODO: Paginate Results
  files = session.exec(statement).all()
  return files
