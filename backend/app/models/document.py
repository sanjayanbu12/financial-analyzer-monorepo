from pydantic import BaseModel, Field
from datetime import datetime

class Document(BaseModel):
    id: str = Field(alias="_id")
    filename: str = Field(...)
    content_type: str = Field(...)
    upload_date: datetime = Field(default_factory=datetime.utcnow)
    file_id: str = Field(...)  # GridFS file ID
    owner_id: str = Field(...)
    analysis_task_id: str | None = None
