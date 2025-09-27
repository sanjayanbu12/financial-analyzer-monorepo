import os
import shutil
import uuid
from fastapi import APIRouter, File, UploadFile, Form, Depends, HTTPException, BackgroundTasks
from core.security import get_current_user
from models.user import UserInDB
from models.analysis import AnalysisRequest
from services.crew_service import run_analysis_crew
from db.database import get_database
from bson import ObjectId


router = APIRouter()
UPLOAD_DIRECTORY = "uploads"


@router.post("/upload")
async def analyze_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    query: str = Form("Provide a comprehensive analysis of this financial document, including investment recommendations and a risk assessment."),
    current_user: UserInDB = Depends(get_current_user),
    db = Depends(get_database)
):
    """
    Handles file upload, saves it, creates an analysis request in the DB,
    and triggers the background task for AI analysis.
    """
    if not file.content_type == "application/pdf":
        raise HTTPException(status_code=400, detail="Invalid file type. Only PDFs are accepted.")

    try:
        # Sanitize filename
        safe_filename = f"{uuid.uuid4()}_{os.path.basename(file.filename)}"
        file_path = os.path.join(UPLOAD_DIRECTORY, safe_filename)

        # Save the file securely
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Create analysis request object
        analysis_request = AnalysisRequest(
            user_id=current_user.username,
            filename=file.filename,
            file_path=file_path,
            query=query
        )
        
        # Insert into database
        result = await db["analysis_requests"].insert_one(analysis_request.dict(by_alias=True))
        request_id = result.inserted_id

        # Add the analysis task to the background
        background_tasks.add_task(run_analysis_crew, request_id, file_path, query)

        return {
            "status": "success",
            "message": "File uploaded successfully. Analysis is in progress.",
            "request_id": str(request_id)
        }
    except Exception as e:
        # Log the exception
        print(f"Error during file upload: {e}")
        raise HTTPException(status_code=500, detail="An error occurred during file processing.")


@router.get("/status/{request_id}")
async def get_analysis_status(request_id: str, current_user: UserInDB = Depends(get_current_user), db = Depends(get_database)):
    """
    Retrieves the status and result of an analysis request.
    """
    try:
        obj_id = ObjectId(request_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid request ID format.")
        
    analysis_doc = await db["analysis_requests"].find_one({"_id": obj_id})

    if not analysis_doc:
        raise HTTPException(status_code=404, detail="Analysis request not found.")

    # Ensure the user is authorized to view this analysis
    if analysis_doc["user_id"] != current_user.username:
        raise HTTPException(status_code=403, detail="Not authorized to view this analysis.")

    return {
        "request_id": request_id,
        "status": analysis_doc.get("status"),
        "result": analysis_doc.get("result"),
        "filename": analysis_doc.get("filename"),
        "query": analysis_doc.get("query"),
        "created_at": analysis_doc.get("created_at"),
    }

@router.get("/history")
async def get_user_history(current_user: UserInDB = Depends(get_current_user), db = Depends(get_database)):
    """
    Retrieves all analysis requests for the current user.
    """
    cursor = db["analysis_requests"].find({"user_id": current_user.username})
    history = []
    async for document in cursor:
        document["_id"] = str(document["_id"])
        history.append(document)
    
    return history
