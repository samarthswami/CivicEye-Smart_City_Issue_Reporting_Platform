import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Auth Pages
import LandingPage from './components/pages/LandingPage';
import LoginPage from './components/auth/LoginPage';
import CitizenSignup from './components/auth/CitizenSignup';
import GovernmentSignup from './components/auth/GovernmentSignup';

// Dashboards
import CitizenDashboard from './components/citizen/CitizenDashboard';
import GovernmentDashboard from './components/government/GovernmentDashboard';
import AdminDashboard from './components/admin/AdminDashboard';

// Loading screen
const LoadingScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-primary-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-white font-semibold text-lg">Loading CivicEye...</p>
        </div>
    </div>
);

// Protected route component
const ProtectedRoute = ({ children, roles }) => {
    const { user, loading } = useAuth();
    if (loading) return <LoadingScreen />;
    if (!user) return <Navigate to="/login" replace />;
    if (roles && !roles.includes(user.role)) {
        const redirectMap = { citizen: '/citizen', government: '/government', admin: '/admin' };
        return <Navigate to={redirectMap[user.role] || '/login'} replace />;
    }
    return children;
};

// Auto-redirect logged-in users
const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <LoadingScreen />;
    if (user) {
        const redirectMap = { citizen: '/citizen', government: '/government', admin: '/admin' };
        return <Navigate to={redirectMap[user.role] || '/login'} replace />;
    }
    return children;
};

function AppRoutes() {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/register/citizen" element={<PublicRoute><CitizenSignup /></PublicRoute>} />
            <Route path="/register/government" element={<GovernmentSignup />} />

            {/* Protected: Citizen */}
            <Route path="/citizen/*" element={
                <ProtectedRoute roles={['citizen']}>
                    <CitizenDashboard />
                </ProtectedRoute>
            } />

            {/* Protected: Government */}
            <Route path="/government/*" element={
                <ProtectedRoute roles={['government']}>
                    <GovernmentDashboard />
                </ProtectedRoute>
            } />

            {/* Protected: Admin */}
            <Route path="/admin/*" element={
                <ProtectedRoute roles={['admin']}>
                    <AdminDashboard />
                </ProtectedRoute>
            } />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <ThemeProvider>
                <AuthProvider>
                    <AppRoutes />
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 4000,
                            style: {
                                borderRadius: '12px',
                                fontFamily: 'Inter, sans-serif',
                                fontSize: '14px',
                                fontWeight: '500',
                            },
                            success: {
                                style: { background: '#065f46', color: '#d1fae5' }
                            },
                            error: {
                                style: { background: '#7f1d1d', color: '#fecaca' }
                            }
                        }}
                    />
                </AuthProvider>
            </ThemeProvider>
        </BrowserRouter>
    );
}
