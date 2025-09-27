from celery import Celery
from app.core.config import settings
from app.db.database import connect_to_mongo, close_mongo_connection
import asyncio

celery_app = Celery(
    "tasks",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
    include=['app.tasks.crew_kicker']
)

celery_app.conf.update(
    task_track_started=True,
)

# Celery event handlers to manage database connections for worker processes
from celery.signals import worker_process_init, worker_process_shutdown

@worker_process_init.connect
def init_worker(**kwargs):
    """Initializes DB connection for the worker process."""
    print("Initializing worker DB connection...")
    asyncio.get_event_loop().run_until_complete(connect_to_mongo())
    print("Worker DB connection initialized.")


@worker_process_shutdown.connect
def shutdown_worker(**kwargs):
    """Closes DB connection for the worker process."""
    print("Closing worker DB connection...")
    asyncio.get_event_loop().run_until_complete(close_mongo_connection())
    print("Worker DB connection closed.")

