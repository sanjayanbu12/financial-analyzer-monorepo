from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum

class TaskStatus(str, Enum):
    PENDING = "PENDING"
    STARTED = "STARTED"
    SUCCESS = "SUCCESS"
    FAILURE = "FAILURE"

class AnalysisResult(BaseModel):
    task_id: str = Field(...)
    document_id: str = Field(...)
    status: TaskStatus = Field(default=TaskStatus.PENDING)
    result: Optional[str] = None
    error: Optional[str] = None
