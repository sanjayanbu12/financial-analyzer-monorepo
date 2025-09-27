🚀 Enterprise Financial Analyzer 🚀<div align="center">From a broken prototype to a production-ready, full-stack AI system. This project transforms complex financial documents into actionable insights.</div>✨ Core FeaturesThis application was re-architected from the ground up to be a robust, scalable, and secure platform for AI-powered financial analysis.🔐 Secure Authentication: Enterprise-grade JWT authentication with modern argon2 password hashing ensures all user data is secure.🏗️ Full-Stack Architecture: A clean, decoupled system with a React & Tailwind CSS frontend and a high-performance FastAPI backend.📄 PDF Document Processing: Seamlessly upload and manage financial reports through a sleek, responsive user interface.🤖 Sophisticated AI Crew: A multi-agent system powered by Google Gemini & CrewAI work in concert to deliver deep analysis:🕵️‍♂️ Financial Analyst: Extracts and summarizes key financial metrics.🌐 Market Researcher: Scours the web for industry news and economic trends.📈 Investment Advisor: Synthesizes data to provide reasoned, risk-assessed advice.🛡️ Risk Assessor: Identifies and categorizes financial, market, and operational risks.⚡ Asynchronous & Real-Time: AI analysis runs as a background task, while the frontend polls for live status updates, ensuring a non-blocking, responsive user experience.🗂️ Persistent History: All analysis requests and results are stored securely in a MongoDB database, linked to the user's account.🛠️ Technology StackCategoryTechnologyFrontendBackendAI EngineDatabaseSecuritypasslib & argon2🏁 Getting StartedFollow these steps to set up and run the project locally.PrerequisitesPython 3.11.xNode.js v18.x or laterMongoDB (running locally or on a service like Atlas)⚙️ Environment SetupClone the Repository:git clone <your-repository-url>
cd financial-analyzer-monorepo
Configure Backend Environment:Navigate to the backend directory.Rename .env.example to .env.Open the .env file and add your secret keys and database URI.<details><summary>Click here for details on getting your API keys.</summary>GEMINI_API_KEY: Get from Google AI Studio. Crucially, ensure the Vertex AI API is enabled in your Google Cloud project.SERPER_API_KEY: Get a free key from Serper.dev.SECRET_KEY: Generate a secure key by running openssl rand -hex 32 in your terminal.</details>🚀 Running the ApplicationYou will need two separate terminals to run the application.<div style="display: flex; gap: 2rem;"><div style="flex: 1;">Terminal 1: Start the Backend# Navigate to the backend directory
cd backend

# Create and activate a virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python -m uvicorn main:app --reload
The backend will be live at http://localhost:8000</div><div style="flex: 1;">Terminal 2: Start the Frontend# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Run the development server
npm start
The frontend will open in your browser at http://localhost:3000</div></div>🎯 The Challenge: Mission AccomplishedThis project was the successful result of a comprehensive debugging and re-architecting challenge. The initial mission was to take a prototype riddled with bugs across every layer of the stack—from frontend integration and inefficient AI prompts to critical security flaws and dependency conflicts—and transform it into an enterprise-ready system.Every category of issue was identified, addressed, and resolved. The final application stands as a testament to a deep, full-stack debugging process and robust software architecture.
