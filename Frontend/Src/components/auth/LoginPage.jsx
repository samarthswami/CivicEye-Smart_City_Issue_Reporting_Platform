import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

const roles = [
    { id: 'citizen', label: 'Citizen', icon: '👤', desc: 'Report civic issues' },
    { id: 'government', label: 'Government', icon: '🏛️', desc: 'Manage & resolve issues' },
    { id: 'admin', label: 'Admin', icon: '⚙️', desc: 'System administration' },
];

export default function LoginPage() {
    const { login } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [role, setRole] = useState('citizen');
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const endpoint = `/auth/${role}/login`;
            const { data } = await api.post(endpoint, form);
            login(data.user, data.token);
            toast.success(`Welcome back, ${data.user.fullName}! 🎉`);
            const redirectMap = { citizen: '/citizen', government: '/government', admin: '/admin' };
            navigate(redirectMap[data.user.role] || '/');
        } catch (err) {
            const msg = err.response?.data?.message || 'Login failed. Please try again.';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-900 via-purple-900 to-gray-900 flex items-center justify-center px-4">
            {/* BG blobs */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>

            <div className="w-full max-w-md animate-slide-up">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 mb-6">
                        <img src="/img/logo.png" alt="CivicEye Logo" className="h-10 w-10 object-contain" />
                        <span className="font-bold text-2xl text-white">CivicEye</span>
                    </Link>
                    <h1 className="text-3xl font-extrabold text-white mb-2">Welcome Back</h1>
                    <p className="text-white/60">Sign in to your account to continue</p>
                </div>

                {/* Card */}
                <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8">
                    {/* Role selector */}
                    <div className="grid grid-cols-3 gap-2 mb-6">
                        {roles.map((r) => (
                            <button
                                key={r.id}
                                type="button"
                                onClick={() => setRole(r.id)}
                                className={`p-3 rounded-xl border-2 transition-all duration-200 text-center ${role === r.id
                                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                                    }`}
                            >
                                <div className="text-2xl mb-1">{r.icon}</div>
                                <div className={`text-xs font-semibold ${role === r.id ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400'}`}>
                                    {r.label}
                                </div>
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="label">Email Address</label>
                            <input
                                type="email"
                                className="input-field"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                required
                                id="login-email"
                            />
                        </div>
                        <div>
                            <label className="label">Password</label>
                            <input
                                type="password"
                                className="input-field"
                                placeholder="••••••••"
                                value={form.password}
                                onChange={e => setForm({ ...form, password: e.target.value })}
                                required
                                id="login-password"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full mt-6"
                            id="login-submit"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Signing in...
                                </span>
                            ) : (
                                `Sign in as ${roles.find(r => r.id === role)?.label}`
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center space-y-3">
                        {role === 'citizen' && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                New citizen?{' '}
                                <Link to="/register/citizen" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
                                    Create an account
                                </Link>
                            </p>
                        )}
                        {role === 'government' && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Have an invite?{' '}
                                <Link to="/register/government" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
                                    Register here
                                </Link>
                            </p>
                        )}
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <Link to="/" className="text-white/60 hover:text-white text-sm transition-colors">← Back to Home</Link>
                </div>
            </div>

            {/* Theme toggle */}
            <button onClick={toggleTheme} className="fixed top-4 right-4 p-2 bg-white/10 backdrop-blur-sm rounded-lg text-white hover:bg-white/20 transition-colors">
                {isDark ? '☀️' : '🌙'}
            </button>
        </div>
    );
}
