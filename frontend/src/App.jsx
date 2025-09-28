import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Upload, FileText, Clock, CheckCircle, XCircle, LogOut, Loader, Inbox, BrainCircuit, ArrowRight, Shield, Zap, TrendingUp, BarChart3, Users, Star, ChevronRight, Menu, X } from 'lucide-react';

const API_URL = 'http://localhost:8000';

// === API CONFIGURATION ===
// Create axios instance with automatic token injection for authenticated requests
const authAxios = axios.create({
    baseURL: API_URL,
});

// Automatically add Bearer token to all requests
authAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// === REUSABLE UI COMPONENTS ===

const Card = ({ children, className = '', hover = false }) => (
    <div className={`bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl border border-white/20 ${hover ? 'hover:shadow-2xl hover:scale-105 transition-all duration-300' : ''} ${className}`}>
        {children}
    </div>
);

const Button = ({ children, onClick, type = 'button', variant = 'primary', disabled = false, size = 'md', className = '' }) => {
    const baseClasses = 'flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:scale-105 active:scale-95';
    const sizeClasses = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg'
    };
    const variantClasses = {
        primary: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 focus:ring-blue-500 shadow-lg hover:shadow-xl',
        secondary: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 hover:from-gray-200 hover:to-gray-300 focus:ring-gray-400 border border-gray-300',
        ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-400',
        success: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 focus:ring-green-500',
    };
    const disabledClasses = 'opacity-50 cursor-not-allowed transform-none hover:scale-100';

    return (
        <button
            onClick={onClick}
            type={type}
            disabled={disabled}
            className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabled ? disabledClasses : ''} ${className}`}
        >
            {children}
        </button>
    );
};

const Input = ({ id, type, placeholder, value, onChange, icon: Icon }) => (
    <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />}
        <input
            id={id}
            name={id}
            type={type}
            required
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={`w-full rounded-xl border-2 border-gray-200 bg-white/50 backdrop-blur-sm px-4 py-3 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 focus:bg-white transition-all duration-300 ${Icon ? 'pl-12' : ''}`}
        />
    </div>
);

// === LANDING PAGE COMPONENT ===
// Marketing page with hero section, features, testimonials and call-to-action
const LandingPage = ({ onGetStarted }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Static data for marketing content
    const features = [
        {
            icon: BrainCircuit,
            title: "AI-Powered Analysis",
            description: "Advanced machine learning algorithms analyze your financial documents with unprecedented accuracy and insight."
        },
        {
            icon: Shield,
            title: "Enterprise Security",
            description: "Bank-grade encryption and security protocols ensure your sensitive financial data remains protected."
        },
        {
            icon: Zap,
            title: "Lightning Fast",
            description: "Get comprehensive financial analysis in minutes, not hours. Streamline your workflow with instant results."
        },
        {
            icon: TrendingUp,
            title: "Smart Insights",
            description: "Discover hidden patterns, risks, and opportunities with our intelligent financial analysis engine."
        }
    ];

    const testimonials = [
        {
            name: "Sarah Chen",
            role: "CFO, TechCorp",
            content: "This tool has revolutionized how we analyze financial documents. The AI insights are incredibly accurate.",
            rating: 5
        },
        {
            name: "Michael Rodriguez",
            role: "Investment Analyst",
            content: "The speed and depth of analysis is remarkable. It's like having a team of financial experts at your fingertips.",
            rating: 5
        },
        {
            name: "Emily Watson",
            role: "Financial Director",
            content: "Security and accuracy are top-notch. We've integrated this into our entire financial review process.",
            rating: 5
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Animated background elements for visual appeal */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            {/* Navigation Bar */}
            <nav className="relative z-10 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white">
                        <BrainCircuit size={32} className="text-blue-400" />
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            FinanceAI Pro
                        </span>
                    </div>
                    
                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
                        <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Testimonials</a>
                        <Button onClick={onGetStarted} size="sm">
                            Get Started <ArrowRight size={16} />
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-white"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 right-0 bg-black/90 backdrop-blur-lg border-t border-gray-800">
                        <div className="px-6 py-4 space-y-4">
                            <a href="#features" className="block text-gray-300 hover:text-white transition-colors">Features</a>
                            <a href="#testimonials" className="block text-gray-300 hover:text-white transition-colors">Testimonials</a>
                            <Button onClick={onGetStarted} className="w-full">
                                Get Started <ArrowRight size={16} />
                            </Button>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section - Main value proposition */}
            <section className="relative z-10 px-6 py-20 text-center">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                        Transform Your
                        <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent block">
                            Financial Analysis
                        </span>
                    </h1>
                    <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                        Harness the power of AI to analyze financial documents with unprecedented speed, 
                        accuracy, and insight. Make smarter decisions faster.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button onClick={onGetStarted} size="lg">
                            Start Free Analysis <ArrowRight size={20} />
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="relative z-10 px-6 py-20">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold text-center text-white mb-16">
                        Powerful Features for
                        <span className="text-blue-400"> Modern Finance</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <Card key={index} hover className="p-8 text-center">
                                <feature.icon size={48} className="text-blue-500 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section - Social proof with numbers */}
            <section className="relative z-10 px-6 py-16">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="text-white">
                            <div className="text-4xl font-bold text-blue-400 mb-2">10,000+</div>
                            <div className="text-gray-300">Documents Analyzed</div>
                        </div>
                        <div className="text-white">
                            <div className="text-4xl font-bold text-purple-400 mb-2">99.9%</div>
                            <div className="text-gray-300">Accuracy Rate</div>
                        </div>
                        <div className="text-white">
                            <div className="text-4xl font-bold text-pink-400 mb-2">5 min</div>
                            <div className="text-gray-300">Average Analysis Time</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="relative z-10 px-6 py-20">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold text-center text-white mb-16">
                        Trusted by
                        <span className="text-purple-400"> Finance Leaders</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <Card key={index} hover className="p-8">
                                <div className="flex gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} size={20} className="text-yellow-400 fill-current" />
                                    ))}
                                </div>
                                <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.content}"</p>
                                <div>
                                    <div className="font-bold text-gray-800">{testimonial.name}</div>
                                    <div className="text-gray-600 text-sm">{testimonial.role}</div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final Call-to-Action Section */}
            <section className="relative z-10 px-6 py-20">
                <div className="max-w-4xl mx-auto text-center">
                    <Card className="p-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">
                            Ready to revolutionize your financial analysis?
                        </h2>
                        <p className="text-gray-600 mb-8 text-lg">
                            Join thousands of finance professionals who trust our AI-powered platform.
                        </p>
                        <Button onClick={onGetStarted} size="lg">
                            Get Started Now <ArrowRight size={20} />
                        </Button>
                    </Card>
                </div>
            </section>
        </div>
    );
};

// === AUTHENTICATION COMPONENTS ===

// Login/Register form with validation and error handling
const AuthForm = ({ isLogin, onAuthSuccess, onToggleMode }) => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '', fullName: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission for both login and registration
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            if (isLogin) {
                // Login flow - get access token
                const url = `${API_URL}/auth/token`;
                const params = new URLSearchParams();
                params.append('username', formData.username);
                params.append('password', formData.password);
                const response = await axios.post(url, params);
                localStorage.setItem('token', response.data.access_token);
                onAuthSuccess();
            } else {
                // Registration flow - create account then login
                const registerUrl = `${API_URL}/auth/register`;
                await axios.post(registerUrl, {
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    full_name: formData.fullName
                });
                
                // Automatically login after registration
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
        <div className="space-y-8">
            {/* Header Section */}
            <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <BrainCircuit size={40} className="text-blue-500" />
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        FinanceAI Pro
                    </span>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    {isLogin ? 'Welcome Back!' : 'Join FinanceAI Pro'}
                </h2>
                <p className="text-gray-600">
                    {isLogin ? 'Sign in to access your financial analysis dashboard' : 'Create your account and start analyzing documents'}
                </p>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input 
                            id="fullName" 
                            type="text" 
                            placeholder="Full Name" 
                            value={formData.fullName} 
                            onChange={handleChange} 
                            icon={Users}
                        />
                        <Input 
                            id="username" 
                            type="text" 
                            placeholder="Username" 
                            value={formData.username} 
                            onChange={handleChange} 
                            icon={Users}
                        />
                    </div>
                )}
                
                {isLogin && (
                    <Input 
                        id="username" 
                        type="text" 
                        placeholder="Username" 
                        value={formData.username} 
                        onChange={handleChange} 
                        icon={Users}
                    />
                )}
                
                {!isLogin && (
                    <Input 
                        id="email" 
                        type="email" 
                        placeholder="Email Address" 
                        value={formData.email} 
                        onChange={handleChange} 
                    />
                )}
                
                <Input 
                    id="password" 
                    type="password" 
                    placeholder="Password" 
                    value={formData.password} 
                    onChange={handleChange} 
                />
                
                {/* Error Display */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <p className="text-red-600 text-sm text-center">{error}</p>
                    </div>
                )}

                <Button type="submit" disabled={isLoading} size="lg" className="w-full">
                    {isLoading && <Loader className="animate-spin" size={20} />}
                    {isLogin ? 'Sign In' : 'Create Account'}
                    {!isLoading && <ArrowRight size={20} />}
                </Button>
            </form>

            {/* Toggle between login/register */}
            <div className="text-center">
                <p className="text-gray-600">
                    {isLogin ? "Don't have an account?" : 'Already have an account?'}
                    <button 
                        onClick={onToggleMode} 
                        className="ml-2 font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                    >
                        {isLogin ? 'Sign up' : 'Sign in'}
                    </button>
                </p>
            </div>
        </div>
    );
};

// Authentication page wrapper with background
const AuthPage = ({ onAuthSuccess, onBackToLanding }) => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            </div>
            
            <div className="relative z-10 w-full max-w-md">
                <Card className="p-8">
                    <AuthForm 
                        isLogin={isLogin} 
                        onAuthSuccess={onAuthSuccess} 
                        onToggleMode={() => setIsLogin(!isLogin)}
                    />
                </Card>
                
                <div className="text-center mt-6">
                    <button 
                        onClick={onBackToLanding}
                        className="text-gray-300 hover:text-white transition-colors text-sm flex items-center justify-center gap-2 mx-auto"
                    >
                        ← Back to home
                    </button>
                </div>
            </div>
        </div>
    );
};

// === DASHBOARD COMPONENTS ===

// File upload form with drag-and-drop and progress tracking
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

    // Submit file for analysis with progress tracking
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
            setFile(null);
            if(e.target.reset) e.target.reset();
        } catch (err) {
            const errDetail = err.response?.data?.detail;
            if (errDetail && typeof errDetail === 'string' && errDetail.toLowerCase().includes('auth')) {
                setError('Not authenticated. Please log out and log back in.');
            } else {
                setError(errDetail || 'An error occurred during upload.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                        <BrainCircuit size={40} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Analyze Financial Document</h2>
                    <p className="text-gray-600">Upload a PDF document to get comprehensive AI-powered financial analysis</p>
                </div>
                
                {/* File Upload Zone */}
                <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Document Upload</label>
                    <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${file ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'}`}>
                        <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            onChange={handleFileChange}
                            accept=".pdf"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                            <div className="space-y-4">
                                <div className={`mx-auto rounded-full p-3 w-16 h-16 flex items-center justify-center ${file ? 'bg-green-500' : 'bg-gray-400'}`}>
                                    {file ? <CheckCircle className="text-white" size={32} /> : <Upload className="text-white" size={32} />}
                                </div>
                                <div>
                                    <p className="text-lg font-semibold text-gray-700">
                                        {file ? file.name : 'Click to upload or drag and drop'}
                                    </p>
                                    <p className="text-gray-500">PDF files up to 10MB</p>
                                </div>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Analysis Query Input */}
                <div className="space-y-4">
                    <label htmlFor="query" className="block text-sm font-semibold text-gray-700">Analysis Focus</label>
                    <textarea
                        id="query"
                        rows={4}
                        className="w-full rounded-xl border-2 border-gray-200 bg-white/50 backdrop-blur-sm px-4 py-3 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 focus:bg-white transition-all duration-300 resize-none"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Describe what aspects of the financial document you'd like the AI to focus on..."
                    />
                </div>
                
                {/* Error and Progress Display */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <p className="text-red-600 text-sm text-center">{error}</p>
                    </div>
                )}
                
                {isLoading && (
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Uploading...</span>
                            <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                                className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300" 
                                style={{ width: `${uploadProgress}%` }}
                            ></div>
                        </div>
                    </div>
                )}
                
                <Button type="submit" disabled={isLoading || !file} size="lg" className="w-full">
                    {isLoading ? (
                        <>
                            <Loader className="animate-spin" size={20} />
                            Processing...
                        </>
                    ) : (
                        <>
                            <Zap size={20} />
                            Start Analysis
                        </>
                    )}
                </Button>
            </form>
        </Card>
    );
};

// Display analysis results with formatted content and status indicators
const AnalysisResult = ({ analysis }) => {
    if (!analysis) return null;

    // Status indicator component
    const renderStatus = () => {
        switch (analysis.status) {
            case 'pending':
            case 'in_progress':
                return (
                    <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
                        <Clock size={18} />
                        <span className="font-medium">Processing</span>
                    </div>
                );
            case 'completed':
                return (
                    <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full">
                        <CheckCircle size={18} />
                        <span className="font-medium">Completed</span>
                    </div>
                );
            case 'failed':
                return (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-1 rounded-full">
                        <XCircle size={18} />
                        <span className="font-medium">Failed</span>
                    </div>
                );
            default:
                return null;
        }
    };

    // Format analysis text with proper styling and structure
    const formatResult = (text) => {
        if (!text) return null;
        
        const lines = text.split('\n');
        const elements = [];
        let currentSection = null;
        let currentSubSection = null;
        
        // Handle inline formatting like **bold text**
        const parseInlineFormatting = (text) => {
            const parts = text.split(/(\*\*[^*]+\*\*)/);
            return parts.map((part, idx) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={idx} className="font-semibold text-gray-800">{part.slice(2, -2)}</strong>;
                }
                return part;
            });
        };
        
        // Parse text line by line to create structured content
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Skip empty lines
            if (line === '') continue;
            
            // Handle numbered main sections (1. Financial Risks:)
            if (/^\d+\.\s+[^:]*:/.test(line)) {
                // Finish previous section
                if (currentSection) {
                    elements.push(currentSection);
                }
                
                const match = line.match(/^(\d+)\.\s+([^:]*):?(.*)$/);
                const number = match[1];
                const title = match[2];
                const remainder = match[3]?.trim();
                
                currentSection = (
                    <div key={`section-${i}`} className="mb-8">
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border-l-4 border-blue-500 mb-4">
                            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                    {number}
                                </div>
                                {title}
                            </h3>
                            {remainder && (
                                <p className="text-gray-700 leading-relaxed mt-2">{parseInlineFormatting(remainder)}</p>
                            )}
                        </div>
                        <div className="space-y-4 pl-4">
                            {/* Content will be added here */}
                        </div>
                    </div>
                );
                currentSubSection = [];
                continue;
            }
            
            // Handle subsection headers (**Header:** content)
            if (line.includes('**') && line.includes(':')) {
                const match = line.match(/^\*\*([^*]+)\*\*:?\s*(.*)$/);
                if (match) {
                    const header = match[1];
                    const content = match[2]?.trim();
                    
                    const subSectionElement = (
                        <div key={`subsection-${i}`} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                            <h4 className="font-bold text-gray-800 text-lg mb-2 flex items-center gap-2">
                                <div className="w-1 h-5 bg-gradient-to-b from-blue-400 to-purple-400 rounded"></div>
                                {header}
                            </h4>
                            {content && (
                                <p className="text-gray-700 leading-relaxed mb-2">{parseInlineFormatting(content)}</p>
                            )}
                        </div>
                    );
                    
                    if (currentSection && currentSubSection) {
                        currentSubSection.push(subSectionElement);
                    } else {
                        elements.push(subSectionElement);
                    }
                    continue;
                }
            }
            
            // Handle standalone bold headers
            if (line.startsWith('**') && line.endsWith('**') && !line.includes(':')) {
                const header = line.replace(/\*\*/g, '');
                const headerElement = (
                    <div key={`header-${i}`} className="mb-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-3 pb-2 border-b-2 border-blue-100 flex items-center gap-2">
                            <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded"></div>
                            {header}
                        </h3>
                    </div>
                );
                
                if (currentSection && currentSubSection) {
                    currentSubSection.push(headerElement);
                } else {
                    elements.push(headerElement);
                }
                continue;
            }
            
            // Handle bullet points
            if (line.startsWith('* ') || line.startsWith('- ')) {
                const content = line.substring(2);
                const bulletElement = (
                    <div key={`bullet-${i}`} className="flex items-start gap-3 mb-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 leading-relaxed">{parseInlineFormatting(content)}</span>
                    </div>
                );
                
                if (currentSection && currentSubSection) {
                    currentSubSection.push(bulletElement);
                } else {
                    elements.push(bulletElement);
                }
                continue;
            }
            
            // Handle regular paragraphs
            const paragraphElement = (
                <div key={`paragraph-${i}`} className="mb-4">
                    <p className="text-gray-700 leading-relaxed text-justify">
                        {parseInlineFormatting(line)}
                    </p>
                </div>
            );
            
            if (currentSection && currentSubSection) {
                currentSubSection.push(paragraphElement);
            } else {
                elements.push(paragraphElement);
            }
        }
        
        // Add any remaining section
        if (currentSection && currentSubSection) {
            // Clone the section and add the subsection content
            const sectionClone = React.cloneElement(currentSection, {
                children: [
                    currentSection.props.children[0], // Keep the header
                    <div key="content" className="space-y-4 pl-4">
                        {currentSubSection}
                    </div>
                ]
            });
            elements.push(sectionClone);
        }
        
        return elements;
    };

    return (
        <Card className="mt-8 p-8">
            {/* Analysis Header with metadata */}
            <div className="border-b border-gray-200 pb-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <BarChart3 className="text-blue-500" />
                        Analysis Results
                    </h3>
                    {renderStatus()}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <span className="font-semibold text-gray-600">Document:</span>
                        <p className="text-gray-800 mt-1">{analysis.filename}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <span className="font-semibold text-gray-600">Analysis Focus:</span>
                        <p className="text-gray-800 mt-1">{analysis.query}</p>
                    </div>
                </div>
            </div>

            {/* Processing State */}
            {(analysis.status === 'pending' || analysis.status === 'in_progress') && (
                <div className="text-center py-16">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                        <Loader className="animate-spin text-white" size={40} />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">AI Analysis in Progress</h4>
                    <p className="text-gray-600">Our advanced algorithms are analyzing your document. This typically takes 2-5 minutes.</p>
                </div>
            )}
            
            {/* Completed Analysis */}
            {analysis.status === 'completed' && (
                <div className="space-y-6">
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 mb-6 border border-green-200">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-green-500 rounded-full p-1">
                                <CheckCircle className="text-white" size={20} />
                            </div>
                            <h4 className="text-lg font-semibold text-gray-800">Analysis Complete</h4>
                        </div>
                        <p className="text-gray-600">Your financial document has been thoroughly analyzed. Review the comprehensive insights below.</p>
                    </div>
                    
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                        <div className="p-8">
                            <div className="prose prose-lg max-w-none">
                                {formatResult(analysis.result)}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Failed Analysis */}
            {analysis.status === 'failed' && (
                <div className="text-center py-16">
                    <div className="bg-red-500 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                        <XCircle size={40} className="text-white" />
                    </div>
                    <h4 className="text-xl font-semibold text-red-600 mb-2">Analysis Failed</h4>
                    <p className="text-gray-600 mb-4">{analysis.result || 'An unexpected error occurred during analysis.'}</p>
                    <Button variant="secondary">
                        Try Again
                    </Button>
                </div>
            )}
        </Card>
    );
};

// Sidebar component showing analysis history with status indicators
const HistoryPanel = ({ onSelectAnalysis }) => {
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Fetch user's analysis history from API
    const fetchHistory = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await authAxios.get('/analysis/history');
            setHistory(response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
        } catch (error) {
            console.error("Failed to fetch history:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    // Status icon based on analysis state
    const StatusIcon = ({ status }) => {
        switch (status) {
            case 'completed': return <CheckCircle className="text-green-500" size={20} />;
            case 'in_progress': return <Clock className="text-yellow-500" size={20} />;
            case 'failed': return <XCircle className="text-red-500" size={20} />;
            default: return <FileText className="text-gray-500" size={20} />;
        }
    };
    
    return (
        <Card className="h-fit max-h-[calc(100vh-12rem)] p-6 w-full">
            <div className="flex items-center gap-2 mb-6">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-2">
                    <Inbox size={24} className="text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">History</h2>
            </div>
            
            {/* Loading State */}
            {isLoading ? (
                <div className="text-center py-12">
                    <Loader className="animate-spin text-blue-600 mx-auto mb-4" size={32} />
                    <p className="text-gray-500">Loading history...</p>
                </div>
            ) : history.length === 0 ? (
                // Empty State
                <div className="text-center py-12">
                    <div className="bg-gray-100 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                        <FileText className="text-gray-400" size={32} />
                    </div>
                    <p className="text-gray-500 font-medium mb-2">No analyses yet</p>
                    <p className="text-gray-400 text-sm">Upload your first document to get started</p>
                </div>
            ) : (
                // History List
                <div className="space-y-3 overflow-y-auto max-h-[50vh]">
                    {history.map(item => (
                        <div 
                            key={item._id} 
                            onClick={() => onSelectAnalysis(item._id)} 
                            className="cursor-pointer p-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-purple-50 hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-blue-300"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex-shrink-0">
                                    <StatusIcon status={item.status} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="font-semibold text-gray-800 text-sm truncate pr-2" title={item.filename}>
                                            {item.filename}
                                        </p>
                                        <ChevronRight size={14} className="text-gray-400 flex-shrink-0" />
                                    </div>
                                    <p className="text-xs text-gray-500 mb-1">
                                        {new Date(item.created_at).toLocaleString()}
                                    </p>
                                    <p className="text-xs text-gray-600 line-clamp-2 leading-tight">
                                        {item.query?.substring(0, 60)}...
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
};

// Main dashboard layout with real-time polling for analysis status
const Dashboard = ({ onLogout }) => {
    const [currentAnalysis, setCurrentAnalysis] = useState(null);
    const [pollingInterval, setPollingInterval] = useState(null);

    // Stop polling for analysis updates
    const stopPolling = () => {
        if (pollingInterval) {
            clearInterval(pollingInterval);
            setPollingInterval(null);
        }
    };
    
    // Fetch current analysis status from API
    const fetchAnalysisStatus = useCallback(async (requestId) => {
        try {
            const response = await authAxios.get(`/analysis/status/${requestId}`);
            setCurrentAnalysis(response.data);
            // Stop polling when analysis is complete or failed
            if (response.data.status === 'completed' || response.data.status === 'failed') {
                stopPolling();
            }
        } catch (error) {
            console.error("Failed to fetch status:", error);
            stopPolling();
        }
    }, []);

    // Start new analysis and begin polling for updates
    const handleAnalysisStart = (requestId) => {
        stopPolling();
        setCurrentAnalysis({ request_id: requestId, status: 'pending' });
        fetchAnalysisStatus(requestId);
        // Poll every 3 seconds for status updates
        const interval = setInterval(() => {
            fetchAnalysisStatus(requestId);
        }, 3000);
        setPollingInterval(interval);
    };
    
    // Handle selection from history panel
    const handleSelectAnalysis = (requestId) => {
        stopPolling();
        fetchAnalysisStatus(requestId);
    };

    // Cleanup polling on component unmount
    useEffect(() => {
        return () => stopPolling();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
            {/* Header with branding and logout */}
            <header className="bg-white/80 backdrop-blur-lg shadow-xl border-b border-white/20 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-2">
                                <BrainCircuit className="text-white" size={32} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    FinanceAI Pro
                                </h1>
                                <p className="text-sm text-gray-500">Enterprise Financial Analysis</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <div className="hidden sm:flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                Online
                            </div>
                            <Button onClick={onLogout} variant="secondary" size="sm">
                                <LogOut size={16} />
                                Sign Out
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Dashboard Layout */}
            <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* History Sidebar */}
                    <div className="lg:col-span-3 xl:col-span-3">
                        <div className="lg:sticky lg:top-24">
                            <HistoryPanel onSelectAnalysis={handleSelectAnalysis} />
                        </div>
                    </div>
                    
                    {/* Main Content Area */}
                    <div className="lg:col-span-9 xl:col-span-9 space-y-8">
                        {/* Welcome Banner */}
                        <Card className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">Welcome to FinanceAI Pro</h2>
                                    <p className="text-blue-100">Analyze financial documents with AI-powered insights in minutes</p>
                                </div>
                                <div className="hidden sm:block">
                                    <TrendingUp size={48} className="text-blue-200" />
                                </div>
                            </div>
                        </Card>

                        {/* Upload Form */}
                        <UploadForm onAnalysisStart={handleAnalysisStart} />
                        
                        {/* Analysis Results */}
                        {currentAnalysis && <AnalysisResult analysis={currentAnalysis} />}
                    </div>
                </div>
            </main>
        </div>
    );
};

// === MAIN APPLICATION COMPONENT ===
// Root component managing application state and routing between views

function App() {
    const [currentView, setCurrentView] = useState('landing'); // 'landing', 'auth', 'dashboard'
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Handle user logout - clear token and redirect to landing
    const handleLogout = useCallback(() => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setCurrentView('landing');
    }, []);

    // Handle successful authentication
    const handleAuthSuccess = () => {
        setIsAuthenticated(true);
        setCurrentView('dashboard');
    };

    // Navigation handlers
    const handleGetStarted = () => {
        setCurrentView('auth');
    };

    const handleBackToLanding = () => {
        setCurrentView('landing');
    };
    
    // Check for existing authentication on app load
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
            setCurrentView('dashboard');
        }
        setIsLoading(false);

        // Global error handler for 401 responses - auto logout on auth failure
        const interceptor = authAxios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && error.response.status === 401) {
                    handleLogout();
                }
                return Promise.reject(error);
            }
        );

        return () => {
            authAxios.interceptors.response.eject(interceptor);
        };
    }, [handleLogout]);

    // Loading screen while checking authentication
    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                <div className="text-center">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                        <Loader className="animate-spin text-white" size={32} />
                    </div>
                    <p className="text-white font-medium">Loading FinanceAI Pro...</p>
                </div>
            </div>
        );
    }

    // Route to appropriate view based on current state
    switch (currentView) {
        case 'landing':
            return <LandingPage onGetStarted={handleGetStarted} />;
        case 'auth':
            return <AuthPage onAuthSuccess={handleAuthSuccess} onBackToLanding={handleBackToLanding} />;
        case 'dashboard':
            return <Dashboard onLogout={handleLogout} />;
        default:
            return <LandingPage onGetStarted={handleGetStarted} />;
    }
}

export default App;