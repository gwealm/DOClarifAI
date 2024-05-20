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
  statement = select(File).where(File.workflow_id == workflow_id).order_by(File.uploaded_at.desc())
  # TODO: Paginate Results
  files = session.exec(statement).all()
  return files

def get_file_by_id(*, session: Session,
                             file_id: int) -> File:
  statement = select(File).where(File.id == file_id)
  file = session.exec(statement).first()
  return file
