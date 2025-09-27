Enterprise-Grade Financial Document AnalyzerProject OverviewThis is a full-stack, enterprise-grade application designed for the intelligent analysis of financial documents. The system uses a sophisticated AI crew, powered by Google's Gemini models via CrewAI, to process uploaded financial reports (in PDF format), perform a multi-faceted analysis, and present the results to the user.This project was built to address a complex challenge: to transform an intentionally broken and flawed prototype into a production-ready system. The final application is architecturally sound, secure, and fully functional, demonstrating best practices in full-stack development, AI integration, and system design.Tech StackCategoryTechnologyFrontendReact, Tailwind CSS, Axios, Lucide IconsBackendFastAPI, Python 3.11, UvicornAI EngineCrewAI, LangChain, Google Gemini ProDatabaseMongoDB (with Motor for asynchronous access)SecurityJWT (JSON Web Tokens), Passlib, Argon2Core FeaturesSecure User Authentication: Full registration and login system using JWT for session management. Passwords are securely hashed using the modern argon2 algorithm.Full-Stack Architecture: A clear separation between the React frontend and the high-performance, asynchronous FastAPI backend.PDF Document Upload: Users can upload financial documents directly through a responsive web interface.Sophisticated AI Analysis Crew: The backend utilizes a multi-agent AI crew to analyze documents from different perspectives:Senior Financial Analyst: Extracts and summarizes key financial metrics from the document.Market Research Analyst: Uses web search to provide broader market context.Investment Advisor: Synthesizes the findings to provide reasoned investment advice.Risk Assessor: Identifies and categorizes potential risks.Asynchronous Task Processing: AI analysis is run as a background task, allowing the UI to remain responsive.Real-time Status Updates: The frontend polls the backend to provide users with live updates on the status of their analysis (e.g., "in_progress", "completed", "failed").Analysis History: All analysis requests and their results are stored in a MongoDB database, linked to the user who made the request.Robust Error Handling: The system gracefully handles errors, from invalid user credentials and expired sessions to API failures.PrerequisitesBefore you begin, ensure you have the following installed on your system:Python 3.11.xNode.js v18.x or later (which includes npm)MongoDB (running either locally or accessible via a cloud instance like MongoDB Atlas)Setup & InstallationFollow these steps to set up and run the project locally.1. Clone the Repositorygit clone <your-repository-url>
cd financial-analyzer-monorepo
2. Backend SetupFirst, navigate to the backend directory.cd backend
a. Create and Activate a Virtual Environment:# Create the environment
python3 -m venv venv

# Activate it (on macOS/Linux)
source venv/bin/activate

# Or activate it (on Windows)
.\venv\Scripts\activate
b. Install Dependencies:pip install -r requirements.txt
c. Configure Environment Variables:Rename the .env.example file to .env.Open the .env file and fill in the required API keys and secrets. See the guide below for instructions on how to get these keys.# Gemini API Key for LLM
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# Serper API Key for web search tool
SERPER_API_KEY="YOUR_SERPER_API_KEY"

# MongoDB Connection String
MONGO_URI="mongodb://localhost:27017/financial_analyzer"

# JWT Secret Key - Generate with: openssl rand -hex 32
SECRET_KEY="YOUR_SUPER_SECRET_KEY"

# Dummy key to satisfy a dependency, will not be used
OPENAI_API_KEY="NA"
GEMINI_API_KEY: Get from Google AI Studio. Ensure the Vertex AI API is enabled in your Google Cloud project.SERPER_API_KEY: Get from Serper.dev.SECRET_KEY: Generate a secure key by running openssl rand -hex 32 in your terminal.3. Frontend SetupIn a new terminal window, navigate to the frontend directory.cd frontend
a. Install Dependencies:npm install
Running the ApplicationYou will need two separate terminal windows to run both the backend and frontend servers.1. Start the Backend ServerMake sure you are in the backend directory and your virtual environment (venv) is active.Run the following command:python -m uvicorn main:app --reload
The backend API will be running at http://localhost:8000.2. Start the Frontend ServerMake sure you are in the frontend directory.Run the following command:npm start
The React application will open in your browser at http://localhost:3000.You can now register an account, log in, and start analyzing financial documents!