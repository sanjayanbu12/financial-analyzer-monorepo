from crewai import Agent
from langchain_google_genai import ChatGoogleGenerativeAI
from app.core.config import settings
from .tools import DocumentTools

# Initialize the LLM
llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash-latest",
    verbose=True,
    temperature=0.2,
    google_api_key=settings.GOOGLE_API_KEY
)

class FinancialAnalysisAgents:
    def document_triage_agent(self):
        return Agent(
            role="Document Triage Specialist",
            goal="Accurately determine if an uploaded document is a financial report. If not, identify what type of document it is.",
            backstory=(
                "You are a meticulous analyst with a knack for quickly classifying documents. "
                "Your primary function is to act as the first line of defense, ensuring that only relevant "
                "financial documents proceed for in-depth analysis. You are eagle-eyed and can spot an "
                "invoice, a marketing brochure, or a legal contract from a mile away, separating them from "
                "10-K filings, annual reports, or income statements."
            ),
            verbose=True,
            llm=llm,
            allow_delegation=False
        )

    def data_extraction_agent(self):
        return Agent(
            role="Financial Data Extractor",
            goal="Precisely extract key financial figures, tables, and management commentary from a financial document.",
            backstory=(
                "You are an AI-powered extraction expert, trained on millions of financial documents. "
                "You can parse complex tables, identify key performance indicators (KPIs), and pull out "
                "crucial statements from the Management's Discussion and Analysis (MD&A) section. "
                "Your work is the foundation upon which all subsequent analysis is built, so accuracy is paramount."
            ),
            tools=[DocumentTools.read_document_tool()],
            verbose=True,
            llm=llm,
            allow_delegation=False,
        )

    def financial_analysis_agent(self):
        return Agent(
            role="Senior Financial Analyst",
            goal="Conduct a thorough analysis of the extracted financial data to identify trends, strengths, weaknesses, and key insights.",
            backstory=(
                "You are a seasoned financial analyst with 20 years of experience on Wall Street. You've seen it all, "
                "from dot-com bubbles to financial crises. Your expertise lies in ratio analysis, trend identification, "
                "and contextualizing financial data within the broader economic landscape. You provide clear, "
                "unbiased insights into the company's performance, profitability, liquidity, and solvency."
            ),
            verbose=True,
            llm=llm,
            allow_delegation=False,
        )

    def report_writer_agent(self):
        return Agent(
            role="Financial Report Writer",
            goal="Synthesize the analysis into a clear, concise, and well-structured investment report in Markdown format.",
            backstory=(
                "You are a skilled communicator who can translate complex financial analysis into an easily digestible report. "
                "You structure your reports with clear headings, bullet points, and summaries. The final output is professional, "
                "catering to an audience of investors and stakeholders who need to make informed decisions quickly."
            ),
            verbose=True,
            llm=llm,
            allow_delegation=False,
        )

