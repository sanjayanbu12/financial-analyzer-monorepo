from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.routers.auth import auth_router
from app.api.v1.routers.documents import documents_router
from app.core.config import settings
from app.db.database import connect_to_mongo, close_mongo_connection

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Add event handlers
app.add_event_handler("startup", connect_to_mongo)
app.add_event_handler("shutdown", close_mongo_connection)

# Set up CORS
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin).strip() for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

@app.get("/", tags=["Health Check"])
async def root():
    """Health check endpoint."""
    return {"message": "Financial Document Analyzer API is running"}


app.include_router(auth_router, prefix=settings.API_V1_STR, tags=["Authentication"])
app.include_router(documents_router, prefix=settings.API_V1_STR, tags=["Documents & Analysis"])

