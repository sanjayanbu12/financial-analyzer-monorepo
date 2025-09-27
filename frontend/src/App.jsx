import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { LogIn, UserPlus, Upload, FileText, Clock, CheckCircle, XCircle, LogOut, Loader, Inbox, BrainCircuit, Search } from 'lucide-react';

const API_URL = 'http://localhost:8000';

// Axios instance for authenticated requests
const authAxios = axios.create({
    baseURL: API_URL,
});

authAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


// --- Reusable UI Components ---

const Card = ({ children, className = '' }) => (
    <div className={`bg-white shadow-lg rounded-xl p-6 sm:p-8 ${className}`}>
        {children}
    </div>
);

const Button = ({ children, onClick, type = 'button', variant = 'primary', disabled = false }) => {
    const baseClasses = 'w-full flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';
    const variantClasses = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
    };
    const disabledClasses = 'opacity-50 cursor-not-allowed';

    return (
        <button
            onClick={onClick}
            type={type}
            disabled={disabled}
            className={`${baseClasses} ${variantClasses[variant]} ${disabled ? disabledClasses : ''}`}
        >
            {children}
        </button>
    );
};

const Input = ({ id, type, placeholder, value, onChange }) => (
    <input
        id={id}
        name={id}
        type={type}
        required
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2.5 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
    />
);


// --- Authentication Components ---

const AuthForm = ({ isLogin, onAuthSuccess }) => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '', fullName: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            if (isLogin) {
                // --- Login Logic ---
                const url = `${API_URL}/auth/token`;
                const params = new URLSearchParams();
                params.append('username', formData.username);
                params.append('password', formData.password);
                const response = await axios.post(url, params);
                localStorage.setItem('token', response.data.access_token);
                onAuthSuccess();
            } else {
                // --- Registration Logic ---
                const registerUrl = `${API_URL}/auth/register`;
                await axios.post(registerUrl, {
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    full_name: formData.fullName
                });
                
                // Automatically log the new user in to get a token
                const tokenUrl = `${API_URL}/auth/token`;
                const params = new URLSearchParams();
                params.append('username', formData.username);
                params.append('password', formData.password);
                const tokenResponse = await axios.post(tokenUrl, params);
                localStorage.setItem('token', tokenResponse.data.access_token);
                onAuthSuccess();
            }
        } catch (err) {
            setError(err.response?.data?.detail || `An error occurred during ${isLogin ? 'login' : 'registration'}.`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-2xl font-bold text-center text-gray-800">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            {!isLogin && (
                <>
                    <Input id="username" type="text" placeholder="Username" value={formData.username} onChange={handleChange} />
                    <Input id="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} />
                    <Input id="fullName" type="text" placeholder="Full Name" value={formData.fullName} onChange={handleChange} />
                </>
            )}
            {isLogin && <Input id="username" type="text" placeholder="Username" value={formData.username} onChange={handleChange} />}
            <Input id="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} />
            
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader className="animate-spin" size={20} />}
                {isLogin ? 'Login' : 'Register'}
            </Button>
        </form>
    );
};

const AuthPage = ({ onAuthSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md px-4">
                <Card>
                    <AuthForm isLogin={isLogin} onAuthSuccess={onAuthSuccess} />
                    <p className="mt-6 text-center text-sm text-gray-600">
                        {isLogin ? "Don't have an an account?" : 'Already have an account?'}
                        <button onClick={() => setIsLogin(!isLogin)} className="ml-1 font-semibold text-blue-600 hover:underline">
                            {isLogin ? 'Register' : 'Login'}
                        </button>
                    </p>
                </Card>
            </div>
        </div>
    );
};


// --- Dashboard Components ---

const UploadForm = ({ onAnalysisStart }) => {
    const [file, setFile] = useState(null);
    const [query, setQuery] = useState('Provide a comprehensive analysis of this financial document, highlighting key performance indicators, investment potential, and major risks.');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
            setError('');
        } else {
            setFile(null);
            setError('Please select a valid PDF file.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please select a file to upload.');
            return;
        }
        setIsLoading(true);
        setError('');
        setUploadProgress(0);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('query', query);

        try {
            const response = await authAxios.post('/analysis/upload', formData, {
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                }
            });
            onAnalysisStart(response.data.request_id);
        } catch (err) {
            const errDetail = err.response?.data?.detail;
            if (errDetail && typeof errDetail === 'string' && errDetail.toLowerCase().includes('auth')) {
                setError('Not authenticated. Please log out and log back in.');
            } else {
                setError(errDetail || 'An error occurred during upload.');
            }
        } finally {
            setIsLoading(false);
            setFile(null);
            if(e.target.reset) e.target.reset();
        }
    };

    return (
        <Card>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center">
                    <BrainCircuit size={48} className="mx-auto text-blue-600" />
                    <h2 className="mt-2 text-2xl font-bold text-gray-800">Analyze Financial Document</h2>
                    <p className="mt-1 text-gray-500">Upload a PDF to get an AI-powered analysis.</p>
                </div>
                
                <div>
                    <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-1">PDF Document</label>
                    <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                        <div className="space-y-1 text-center">
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-gray-600">
                                <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:text-blue-500">
                                    <span>Upload a file</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf" />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">{file ? file.name : 'PDF up to 10MB'}</p>
                        </div>
                    </div>
                </div>

                <div>
                    <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-1">Analysis Goal</label>
                    <textarea
                        id="query"
                        rows={3}
                        className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
                
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                
                {isLoading && (
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                )}
                
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Uploading...' : 'Analyze Now'}
                </Button>
            </form>
        </Card>
    );
};

const AnalysisResult = ({ analysis }) => {
    if (!analysis) return null;

    const renderStatus = () => {
        switch (analysis.status) {
            case 'pending':
            case 'in_progress':
                return <div className="flex items-center gap-2 text-yellow-600"><Clock size={18} /> In Progress</div>;
            case 'completed':
                return <div className="flex items-center gap-2 text-green-600"><CheckCircle size={18} /> Completed</div>;
            case 'failed':
                return <div className="flex items-center gap-2 text-red-600"><XCircle size={18} /> Failed</div>;
            default:
                return null;
        }
    };

    const formatResult = (text) => {
      if (!text) return null;
      // This is a simplified formatter. A more robust solution might use a markdown parser.
      return text.split('\n').map((line, index) => {
        if (line.startsWith('**') && line.endsWith('**')) {
          return <h3 key={index} className="text-lg font-bold mt-4 mb-2">{line.replace(/\*\*/g, '')}</h3>
        }
        if (line.startsWith('* ')) {
          return <li key={index} className="ml-5 list-disc">{line.substring(2)}</li>
        }
        return <p key={index} className="mb-2">{line}</p>;
      });
    };

    return (
        <Card className="mt-8">
            <div className="border-b pb-4 mb-4">
                <h3 className="text-xl font-bold text-gray-800">Analysis Result</h3>
                <div className="flex justify-between items-start mt-2 text-sm text-gray-500">
                    <div>
                        <p><strong className="font-semibold text-gray-600">File:</strong> {analysis.filename}</p>
                        <p><strong className="font-semibold text-gray-600">Query:</strong> {analysis.query}</p>
                    </div>
                    <div className="font-semibold text-right">
                        {renderStatus()}
                    </div>
                </div>
            </div>

            {(analysis.status === 'pending' || analysis.status === 'in_progress') && (
                <div className="text-center py-10">
                    <Loader className="mx-auto animate-spin text-blue-600" size={40} />
                    <p className="mt-4 text-gray-600">AI analysis is in progress. This may take a few moments...</p>
                </div>
            )}
            
            {analysis.status === 'completed' && (
                <div className="prose max-w-none text-gray-700">
                  {formatResult(analysis.result)}
                </div>
            )}

            {analysis.status === 'failed' && (
                <div className="text-center py-10 text-red-600">
                    <XCircle size={40} className="mx-auto" />
                    <p className="mt-4 font-semibold">Analysis Failed</p>
                    <p className="text-sm">{analysis.result || 'An unknown error occurred.'}</p>
                </div>
            )}
        </Card>
    );
};

const HistoryPanel = ({ onSelectAnalysis }) => {
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Using useCallback to prevent re-creation of fetchHistory on every render
    const fetchHistory = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await authAxios.get('/analysis/history');
            setHistory(response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
        } catch (error) {
            console.error("Failed to fetch history:", error);
            // Error handling is now managed by the global interceptor
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    const StatusIcon = ({ status }) => {
        switch (status) {
            case 'completed': return <CheckCircle className="text-green-500" size={18} />;
            case 'in_progress': return <Clock className="text-yellow-500" size={18} />;
            case 'failed': return <XCircle className="text-red-500" size={18} />;
            default: return <FileText className="text-gray-500" size={18} />;
        }
    };
    
    return (
        <Card className="h-full">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2"><Inbox size={24}/> Analysis History</h2>
            {isLoading ? (
                <div className="text-center py-10"><Loader className="animate-spin text-blue-600" /></div>
            ) : history.length === 0 ? (
                <p className="text-gray-500 text-center py-10">No analyses yet.</p>
            ) : (
                <ul className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                    {history.map(item => (
                        <li key={item._id} onClick={() => onSelectAnalysis(item._id)} className="cursor-pointer p-3 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <StatusIcon status={item.status} />
                                    <div>
                                        <p className="font-semibold text-gray-800 truncate" title={item.filename}>{item.filename}</p>
                                        <p className="text-xs text-gray-500">{new Date(item.created_at).toLocaleString()}</p>
                                    </div>
                                </div>
                                <Search size={16} className="text-gray-400" />
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </Card>
    );
};


const Dashboard = ({ onLogout }) => {
    const [currentAnalysis, setCurrentAnalysis] = useState(null);
    const [pollingInterval, setPollingInterval] = useState(null);

    const stopPolling = () => {
        if (pollingInterval) {
            clearInterval(pollingInterval);
            setPollingInterval(null);
        }
    };
    
    const fetchAnalysisStatus = useCallback(async (requestId) => {
        try {
            const response = await authAxios.get(`/analysis/status/${requestId}`);
            setCurrentAnalysis(response.data);
            if (response.data.status === 'completed' || response.data.status === 'failed') {
                stopPolling();
            }
        } catch (error) {
            console.error("Failed to fetch status:", error);
            stopPolling();
        }
    }, []);

    const handleAnalysisStart = (requestId) => {
        stopPolling();
        setCurrentAnalysis({ request_id: requestId, status: 'pending' });
        fetchAnalysisStatus(requestId); // Fetch immediately once
        const interval = setInterval(() => {
            fetchAnalysisStatus(requestId);
        }, 3000); // Poll every 3 seconds
        setPollingInterval(interval);
    };
    
    const handleSelectAnalysis = (requestId) => {
      stopPolling();
      fetchAnalysisStatus(requestId);
    }

    useEffect(() => {
        return () => stopPolling(); // Cleanup on component unmount
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2"><BrainCircuit /> Enterprise Financial Analyzer</h1>
                    <Button onClick={onLogout} variant="secondary">
                        <LogOut size={16} /> Logout
                    </Button>
                </div>
            </header>
            <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <HistoryPanel onSelectAnalysis={handleSelectAnalysis}/>
                    </div>
                    <div className="lg:col-span-2">
                        <UploadForm onAnalysisStart={handleAnalysisStart} />
                        {currentAnalysis && <AnalysisResult analysis={currentAnalysis} />}
                    </div>
                </div>
            </main>
        </div>
    );
};


// --- Main App Component ---

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const handleLogout = useCallback(() => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
    }, []);

    const handleAuthSuccess = () => {
        setIsAuthenticated(true);
    };
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        }
        setIsLoading(false);

        // --- THIS IS THE NEW PART ---
        // Setup a global error handler for all authenticated requests
        const interceptor = authAxios.interceptors.response.use(
            (response) => response, // Do nothing on successful responses
            (error) => {
                // If the error is a 401 Unauthorized, log the user out
                if (error.response && error.response.status === 401) {
                    handleLogout();
                }
                return Promise.reject(error);
            }
        );

        // Cleanup interceptor on component unmount
        return () => {
            authAxios.interceptors.response.eject(interceptor);
        };
        // ------------------------------------
    }, [handleLogout]);

    if (isLoading) {
        return <div className="flex min-h-screen items-center justify-center"><Loader className="animate-spin" size={48} /></div>
    }

    return isAuthenticated ? <Dashboard onLogout={handleLogout} /> : <AuthPage onAuthSuccess={handleAuthSuccess} />;
}

export default App;