import React, { useState, useEffect, createContext, useContext, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Markdown from 'react-markdown';
import './index.css';

const API_URL = 'http://localhost:8000/api/v1';

// --- Axios API Setup ---
const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));


// --- Authentication Context ---
const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const logout = () => {
        setUser(null);
        localStorage.removeItem('accessToken');
        delete api.defaults.headers.common['Authorization'];
        setLoading(false);
    };

    const fetchUser = async () => {
        try {
            const response = await api.get('/users/me');
            setUser(response.data);
        } catch (error) {
            console.error("Failed to fetch user", error);
            logout();
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 > Date.now()) {
                    fetchUser();
                } else {
                    logout();
                }
            } catch (error) {
                console.error("Invalid token:", error);
                logout();
            }
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);

        const response = await api.post('/auth/token', formData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
        localStorage.setItem('accessToken', response.data.access_token);
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
        await fetchUser();
    };

    const register = async (email, fullName, password) => {
        await api.post('/auth/register', { email, full_name: fullName, password });
    };

    const value = useMemo(() => ({
        user,
        loading,
        login,
        logout,
        register,
    }), [user, loading]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => useContext(AuthContext);

// --- Protected Route Component ---
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div className="flex justify-center items-center h-screen text-white"><div>Loading...</div></div>;
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};


// --- UI Components ---
const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="bg-white dark:bg-gray-800 shadow-md">
            <nav className="container mx-auto px-6 py-3">
                <div className="flex items-center justify-between">
                    <Link to="/" className="text-xl font-semibold text-gray-700 dark:text-white">
                        Financial Analyzer
                    </Link>
                    <div>
                        {user ? (
                            <div className="flex items-center">
                                <span className="text-gray-700 dark:text-gray-200 mr-4">Welcome, {user.full_name}</span>
                                <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div>
                                <Link to="/login" className="px-4 py-2 text-gray-700 dark:text-white">Login</Link>
                                <Link to="/register" className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Register</Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
};

const Card = ({ children, className }) => (
    <div className={`bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 md:p-8 ${className}`}>
        {children}
    </div>
);

// --- Page Components ---

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate(from, { replace: true });
        } catch (err) {
            setError('Failed to login. Please check your credentials.');
            console.error(err);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <Card className="w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">Login</h2>
                <form onSubmit={handleSubmit}>
                    {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</p>}
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="email">Email</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600" required />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="password">Password</label>
                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600" required />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors">Login</button>
                </form>
                <p className="text-center mt-4 text-gray-600 dark:text-gray-400">
                    Don't have an account? <Link to="/register" className="text-blue-500 hover:underline">Register here</Link>
                </p>
            </Card>
        </div>
    );
};

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register, login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await register(email, fullName, password);
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError('Failed to register. The email might already be in use.');
            console.error(err);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <Card className="w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">Register</h2>
                <form onSubmit={handleSubmit}>
                    {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</p>}
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="fullName">Full Name</label>
                        <input type="text" id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="email">Email</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600" required />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="password">Password</label>
                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600" required />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors">Register</button>
                </form>
                <p className="text-center mt-4 text-gray-600 dark:text-gray-400">
                    Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login here</Link>
                </p>
            </Card>
        </div>
    );
};

const AnalysisResult = ({ taskId }) => {
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState('PENDING');

    useEffect(() => {
        if (!taskId) return;

        setStatus('PENDING');
        setResult(null);
        setError(null);
        
        const pollStatus = async () => {
            try {
                const response = await api.get(`/analysis/${taskId}`);
                const { status: newStatus, result: newResult, error: newError } = response.data;
                
                if (newStatus !== status) {
                    setStatus(newStatus);
                }

                if (newStatus === 'SUCCESS') {
                    setResult(newResult);
                    clearInterval(intervalId);
                } else if (newStatus === 'FAILURE') {
                    setError(newError || 'Analysis failed for an unknown reason.');
                    clearInterval(intervalId);
                }
            } catch (err) {
                console.error("Polling failed", err);
                setError("Could not fetch analysis status.");
                clearInterval(intervalId);
            }
        };

        const intervalId = setInterval(pollStatus, 3000);
        pollStatus();

        return () => clearInterval(intervalId);
    }, [taskId]);

    const getStatusChip = () => {
        switch(status) {
            case 'SUCCESS': return <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-200 rounded-full">Completed</span>;
            case 'FAILURE': return <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-200 rounded-full">Failed</span>;
            case 'STARTED': return <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-200 rounded-full animate-pulse">In Progress</span>;
            default: return <span className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-200 rounded-full">Pending</span>;
        }
    };

    return (
        <div className="mt-4">
            <div className="flex items-center gap-2">
                <h4 className="font-semibold text-gray-700 dark:text-gray-300">Analysis Status:</h4>
                {getStatusChip()}
            </div>
            {result && (
                 <Card className="mt-4 prose dark:prose-invert max-w-none">
                    <Markdown>{result}</Markdown>
                </Card>
            )}
            {error && (
                <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-md">
                    <p className="font-bold">An Error Occurred:</p>
                    <pre className="whitespace-pre-wrap">{error}</pre>
                </div>
            )}
        </div>
    );
};


const DashboardPage = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState('');
    const [documents, setDocuments] = useState([]);
    const [selectedDocumentId, setSelectedDocumentId] = useState(null);

    const fetchDocuments = async () => {
        try {
            const response = await api.get('/documents');
            setDocuments(response.data);
            if (response.data.length > 0 && !selectedDocumentId) {
                setSelectedDocumentId(response.data[0].id);
            }
        } catch (err) {
            console.error("Failed to fetch documents", err);
            setError('Could not load previous documents.');
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);
    
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a file first.');
            return;
        }
        setError('');
        setUploading(true);
        setUploadProgress(0);
        setSelectedDocumentId(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post('/documents/upload', formData, {
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                }
            });
            await fetchDocuments();
            setSelectedDocumentId(response.data.document_id);
            setFile(null); 
        } catch (err) {
            setError(err.response?.data?.detail || 'File upload failed.');
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    const selectedDocument = documents.find(doc => doc.id === selectedDocumentId);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <Card>
                        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Upload New Document</h3>
                        {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</p>}
                        <div className="mb-4">
                            <input type="file" onChange={handleFileChange} accept=".pdf" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                        </div>
                        <button onClick={handleUpload} disabled={uploading || !file} className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400 transition-colors">
                            {uploading ? `Uploading... ${uploadProgress}%` : 'Upload & Analyze'}
                        </button>
                        {uploading && (
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                            </div>
                        )}
                    </Card>

                    <Card className="mt-8">
                         <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Analysis History</h3>
                         <ul className="space-y-2">
                            {documents.length > 0 ? documents.map(doc => (
                                <li key={doc.id} onClick={() => setSelectedDocumentId(doc.id)}
                                    className={`p-3 rounded-md cursor-pointer transition-colors ${selectedDocumentId === doc.id ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                                    <p className="font-medium text-gray-800 dark:text-gray-200 truncate">{doc.filename}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(doc.upload_date).toLocaleString()}
                                    </p>
                                </li>
                            )) : <p className="text-gray-500 dark:text-gray-400">No documents uploaded yet.</p>}
                         </ul>
                    </Card>
                </div>

                <div className="md:col-span-2">
                     <Card>
                        {selectedDocument ? (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{selectedDocument.filename}</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Uploaded on: {new Date(selectedDocument.upload_date).toLocaleString()}</p>
                                <AnalysisResult taskId={selectedDocument.analysis_task_id} />
                            </div>
                        ) : (
                             <div className="text-center py-16">
                                <h2 className="text-xl font-medium text-gray-600 dark:text-gray-300">Select a document to view its analysis</h2>
                                <p className="text-gray-500 mt-2">Or upload a new financial document to get started.</p>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};


function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen flex flex-col">
                     <Header />
                    <main className="flex-grow">
                        <Routes>
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route
                                path="/"
                                element={
                                    <ProtectedRoute>
                                        <DashboardPage />
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>
                    </main>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;

