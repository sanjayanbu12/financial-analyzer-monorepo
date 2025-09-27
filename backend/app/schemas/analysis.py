from pydantic import BaseModel
from typing import Optional

class AnalysisStatusResponse(BaseModel):
    task_id: str
    status: str
    result: Optional[str] = None
    error: Optional[str] = None
