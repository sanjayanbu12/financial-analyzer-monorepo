from pydantic import BaseModel
from datetime import datetime

class DocumentResponse(BaseModel):
    id: str
    filename: str
    content_type: str
    upload_date: datetime
    analysis_task_id: str | None

class DocumentUploadResponse(BaseModel):
    message: str
    document_id: str
    task_id: str
