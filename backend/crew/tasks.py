from crewai import Task
from .tools import PDFSearchTool, SerperSearchTool

class FinancialAnalysisTasks:
    """Task definitions for the financial analysis workflow"""
    
    def financial_analysis(self, agent, file_path, query):
        """Creates task for analyzing financial documents using PDF search"""
        return Task(
            description=f"""
                Analyze the financial document located at '{file_path}'. Your primary focus
                is to dissect the company's financial performance as presented in the report.
                Extract and summarize key data points, including but not limited to:
                - Revenue and Profitability trends
                - Balance Sheet health (Assets, Liabilities, Equity)
                - Cash Flow statements
                - Key Financial Ratios (e.g., P/E, Debt-to-Equity)
                
                User's specific query to guide your focus: "{query}"
                
                Your final output must be a concise yet comprehensive summary of the company's
                financial standing based strictly on the provided document.
            """,
            expected_output="""
                A detailed, structured report containing the following sections:
                1. **Executive Summary:** A brief overview of the company's financial health.
                2. **Key Financial Metrics:** A bulleted list of important financial data and ratios.
                3. **Profitability Analysis:** An assessment of revenue, net income, and margins.
                4. **Balance Sheet Analysis:** An evaluation of the company's assets and liabilities.
                5. **Cash Flow Analysis:** A summary of cash from operating, investing, and financing activities.
            """,
            agent=agent,
            tools=[PDFSearchTool]
        )

    def market_research(self, agent, query):
        """Creates task for market research using web search capabilities"""
        return Task(
            description=f"""
                Conduct a thorough market research analysis based on the context provided by
                the initial financial document analysis. Your goal is to provide a broader
                market perspective. Focus on:
                - The company's industry and key competitors.
                - Recent news and developments related to the company or its industry.
                - Broader economic trends that might affect the company.
                
                The user's original query for context: "{query}"
            """,
            expected_output="""
                A market research report with these sections:
                1. **Industry Overview:** A brief description of the industry landscape.
                2. **Competitive Landscape:** Identification of key competitors and their market position.
                3. **Recent Developments:** A summary of recent news or events impacting the company or industry.
                4. **Macroeconomic Factors:** An analysis of economic trends (e.g., interest rates, inflation)
                   that could influence the company's performance.
            """,
            agent=agent,
            tools=[SerperSearchTool],
            context=[]  # Depends on financial_analysis task output
        )

    def investment_advisory(self, agent):
        """Creates task for generating investment recommendations based on prior analyses"""
        return Task(
            description="""
                Synthesize the insights from the Financial Analysis and Market Research reports.
                Based on this comprehensive understanding, develop a set of investment
                recommendations. Your advice must be well-reasoned and directly tied to the
                data and risks identified.
            """,
            expected_output="""
                A clear, actionable investment advisory report including:
                1. **Investment Thesis:** A summary of why this company is or is not an attractive investment.
                2. **Recommendation:** A clear "Buy," "Hold," or "Sell" rating.
                3. **Strategies for Different Risk Profiles:**
                   - **Conservative:** Recommendations focused on capital preservation.
                   - **Moderate:** A balanced approach to growth and risk.
                   - **Aggressive:** Strategies for investors with a high tolerance for risk.
                4. **Supporting Rationale:** A detailed explanation for your recommendations, citing specific data
                   points from the previous analyses.
            """,
            agent=agent,
            context=[]  # Depends on previous task outputs
        )

    def risk_assessment(self, agent):
        """Creates task for comprehensive risk evaluation and assessment"""
        return Task(
            description="""
                Based on the financial analysis and market research, conduct a comprehensive
                risk assessment. Identify potential risks and evaluate their potential impact on
                the company.
            """,
            expected_output="""
                A structured risk assessment report detailing:
                1. **Financial Risks:** Risks related to debt, liquidity, and profitability.
                2. **Market Risks:** Risks from competition, market volatility, and changing consumer behavior.
                3. **Operational Risks:** Internal risks related to the company's operations.
                4. **Regulatory Risks:** Potential impacts from changes in laws and regulations.
                5. **Overall Risk Rating:** A concluding summary of the company's overall risk profile (e.g., Low, Medium, High).
            """,
            agent=agent,
            context=[]  # Depends on financial analysis and market research tasks
        )