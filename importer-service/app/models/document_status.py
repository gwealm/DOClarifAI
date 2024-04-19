"""
  Model representing the status of a document.
"""

from pydantic import BaseModel, Field


class DocumentStatus(BaseModel):
  """
    Model representing the status of a document.
  """
  id: str = Field(description="Unique identifier for the document status")
  status: str = Field(description="Current status of the document processing",
                      example="PENDING")
  processedTime: str = Field(
      description="Timestamp indicating when the document was processed",
      example="2020-03-26T17:00:00.000000+00:00")
