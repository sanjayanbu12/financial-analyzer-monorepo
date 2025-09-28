from crewai_tools import SerperDevTool, PDFSearchTool
from core.config import settings

# Initialize web search tool with API authentication
SerperSearchTool = SerperDevTool(api_key=settings.SERPER_API_KEY)

# Initialize PDF search tool (no API key required)
# File path will be provided during task execution
PDFSearchTool = PDFSearchTool()