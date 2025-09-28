import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, analysis
from db.database import connect_to_mongo, close_mongo_connection

# Ensure uploads directory exists for file handling
os.makedirs("uploads", exist_ok=True)

# Initialize FastAPI application with metadata
app = FastAPI(
    title="Enterprise Financial Document Analyzer",
    description="A production-grade system for analyzing financial documents using AI.",
    version="1.0.0"
)

# Configure CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Application lifecycle events
@app.on_event("startup")
async def startup_event():
    """Initialize database connection on application startup"""
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_event():
    """Clean up database connection on application shutdown"""
    await close_mongo_connection()

# Health check endpoint
@app.get("/", tags=["Health Check"])
async def root():
    """A simple health check endpoint to confirm the API is running."""
    return {"status": "ok", "message": "Financial Analyzer API is running"}

# Register route modules
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(analysis.router, prefix="/analysis", tags=["Analysis"])

# Global exception handler for unhandled errors
@app.exception_handler(Exception)
async def generic_exception_handler(request, exc):
    """Handle unexpected server errors gracefully"""
    return HTTPException(status_code=500, detail="An unexpected internal server error occurred.")