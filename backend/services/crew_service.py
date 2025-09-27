import os
from datetime import datetime
from crewai import Crew, Process
from crew.agents import FinancialAnalysisAgents
from crew.tasks import FinancialAnalysisTasks
from db.database import get_database
from bson import ObjectId

async def run_analysis_crew(request_id: ObjectId, file_path: str, query: str):
    """
    Runs the financial analysis crew and updates the database with the result.
    This function is designed to be run in the background.
    """
    db = await get_database()
    
    try:
        # Update status to 'in_progress'
        await db["analysis_requests"].update_one(
            {"_id": request_id},
            {"$set": {"status": "in_progress", "updated_at": datetime.utcnow()}}
        )

        # Initialize agents and tasks
        agents = FinancialAnalysisAgents()
        tasks = FinancialAnalysisTasks()

        financial_analyst = agents.financial_analyst()
        research_analyst = agents.research_analyst()
        investment_advisor = agents.investment_advisor()
        risk_assessor = agents.risk_assessor()

        # Define the tasks
        analysis_task = tasks.financial_analysis(financial_analyst, file_path, query)
        research_task = tasks.market_research(research_analyst, query)
        investment_task = tasks.investment_advisory(investment_advisor)
        risk_task = tasks.risk_assessment(risk_assessor)

        # Form the crew
        financial_crew = Crew(
            agents=[financial_analyst, research_analyst, investment_advisor, risk_assessor],
            tasks=[analysis_task, research_task, investment_task, risk_task],
            process=Process.sequential,
            verbose=2
        )

        # Kick off the crew's work
        result = financial_crew.kickoff()
        
        # Update status to 'completed' and save the result
        await db["analysis_requests"].update_one(
            {"_id": request_id},
            {"$set": {"status": "completed", "result": result, "updated_at": datetime.utcnow()}}
        )

    except Exception as e:
        # Log the error
        print(f"Error during crew execution for request {request_id}: {e}")
        # Update status to 'failed' and save the error message
        await db["analysis_requests"].update_one(
            {"_id": request_id},
            {"$set": {"status": "failed", "result": str(e), "updated_at": datetime.utcnow()}}
        )
    finally:
        # Clean up the uploaded file
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
            except OSError as e:
                print(f"Error removing file {file_path}: {e}")
