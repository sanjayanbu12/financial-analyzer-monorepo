from crewai_tools import SerperDevTool, PDFSearchTool
from core.config import settings

# Initialize tools with API keys from settings
SerperSearchTool = SerperDevTool(api_key=settings.SERPER_API_KEY)

# The PDFSearchTool doesn't require an API key but needs to be instantiated.
# We will create an instance here that can be imported and used.
# The actual file path will be passed during task execution.
PDFSearchTool = PDFSearchTool()
