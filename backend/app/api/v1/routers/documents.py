from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase, AsyncIOMotorGridFSBucket
from bson import ObjectId
import gridfs
from typing import List

from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.schemas.document import DocumentUploadResponse, DocumentResponse
from app.schemas.analysis import AnalysisStatusResponse
from app.db.database import get_gridfs_bucket
# CHANGE 1: Import the celery_app instance directly
from app.tasks.worker import celery_app

documents_router = APIRouter()

@documents_router.post("/documents/upload", response_model=DocumentUploadResponse, status_code=status.HTTP_202_ACCEPTED)
async def upload_document(
    file: UploadFile = File(...),
    db: AsyncIOMotorDatabase = Depends(get_db),
    fs: AsyncIOMotorGridFSBucket = Depends(get_gridfs_bucket),
    current_user: User = Depends(get_current_user)
):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    try:
        file_id = await fs.upload_from_stream(
            file.filename,
            file.file,
            metadata={"contentType": file.content_type, "owner_id": current_user.id}
        )
    except Exception as e:
         raise HTTPException(status_code=500, detail=f"Could not save file: {e}")

    document_data = {
        "filename": file.filename,
        "content_type": file.content_type,
        "file_id": str(file_id),
        "owner_id": current_user.id
    }

    result = await db["documents"].insert_one(document_data)
    document_id = str(result.inserted_id)

    # CHANGE 2: Use send_task with the task's string name
    task = celery_app.send_task(
        'app.tasks.crew_kicker.run_financial_analysis_task',
        args=[document_id, str(file_id)]
    )
    
    await db["documents"].update_one(
        {"_id": ObjectId(document_id)},
        {"$set": {"analysis_task_id": task.id}}
    )

    return {
        "message": "File uploaded and analysis started.",
        "document_id": document_id,
        "task_id": task.id
    }

@documents_router.get("/documents", response_model=List[DocumentResponse])
async def get_user_documents(
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    docs = []
    cursor = db["documents"].find({"owner_id": current_user.id})
    async for doc in cursor:
        docs.append(DocumentResponse(id=str(doc['_id']), **doc))
    return docs


@documents_router.get("/analysis/{task_id}", response_model=AnalysisStatusResponse)
async def get_analysis_status(task_id: str):
    task_result = celery_app.AsyncResult(task_id)
    
    response_data = {
        "task_id": task_id,
        "status": task_result.status,
    }

    if task_result.successful():
        response_data["result"] = task_result.result
    elif task_result.failed():
        response_data["error"] = str(task_result.result)
    
    return response_data