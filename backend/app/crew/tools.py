from crewai_tools import BaseTool
from langchain_community.document_loaders import PyPDFLoader

class DocumentTools:
    @staticmethod
    def read_document_tool() -> BaseTool:
        class PDFReaderTool(BaseTool):
            name: str = "PDF Reader Tool"
            description: str = "Reads the content of a PDF file and returns it as a single text block."

            def _run(self, file_path: str) -> str:
                try:
                    loader = PyPDFLoader(file_path)
                    pages = loader.load_and_split()
                    full_text = "\n".join(page.page_content for page in pages)
                    return full_text
                except Exception as e:
                    return f"Error reading PDF file: {e}"
        
        return PDFReaderTool()

