from crewai import Task
from textwrap import dedent

class FinancialAnalysisTasks:
    def document_triage_task(self, agent, document_path):
        return Task(
            description=dedent(f"""
                Analyze the document located at the path: '{document_path}'.

                Your task is to determine if this document is a financial report (e.g., 10-K, 10-Q, Annual Report, Quarterly Earnings Report).

                If it IS a financial report, confirm this and briefly state the type of report.
                If it is NOT a financial report, clearly state that and identify what kind of document it appears to be (e.g., marketing material, legal contract, etc.).

                Your final output must be a simple confirmation or rejection.
            """),
            expected_output="A clear, one-sentence conclusion: either 'This document is a [type] financial report.' or 'This document is not a financial report; it appears to be a [document type].'",
            agent=agent
        )

    def data_extraction_task(self, agent, document_path, context):
        return Task(
            description=dedent(f"""
                Based on the confirmation from the triage specialist, read the financial document located at '{document_path}'.

                Your task is to extract the following key information:
                - Company Name
                - Report Period (e.g., Q2 2025)
                - Total Revenue
                - Net Income (or Loss)
                - Earnings Per Share (EPS)
                - Key highlights from the management's discussion or summary section.

                Present the extracted data in a clear, structured format.
            """),
            expected_output="A structured summary of the extracted financial data, including all the requested key points.",
            agent=agent,
            context=context,
            tools=[agent.tools[0]] # Explicitly pass the tool to the task
        )

    def financial_analysis_task(self, agent, context):
        return Task(
            description=dedent("""
                Analyze the extracted financial data provided by the Data Extractor.
                
                Perform a comprehensive analysis focusing on:
                1.  **Profitability**: Is the company making money? How are the margins (e.g., operating margin)?
                2.  **Growth**: Are revenues and profits growing or shrinking year-over-year (YoY)?
                3.  **Key Trends**: Identify any significant positive or negative trends mentioned in the report (e.g., new product launches, market challenges).
                4.  **Red Flags**: Note any potential risks or concerns highlighted in the report (e.g., rising debt, declining cash flow).

                Provide a balanced view of the company's financial health.
            """),
            expected_output="A detailed analysis covering profitability, growth, key trends, and potential red flags, presented as a series of bullet points for each category.",
            agent=agent,
            context=context
        )

    def reporting_task(self, agent, context):
        return Task(
            description=dedent("""
                Compile all the information from the previous steps into a final, comprehensive report in Markdown format.
                
                The report must have the following sections:
                - **## Executive Summary**: A brief, high-level overview of the company's performance for the quarter.
                - **## Key Financial Metrics**: A table or list of the core extracted data (Revenue, Net Income, EPS).
                - **## Detailed Analysis**: The full analysis of profitability, growth, and trends.
                - **## Potential Risks**: A summary of the identified red flags.
                - **## Concluding Remarks**: A final, neutral summary of the findings.

                Ensure the report is well-organized, professional, and easy to read.
            """),
            expected_output="A complete financial report in Markdown format with all the specified sections.",
            agent=agent,
            context=context
        )

