import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function CitizenSignup() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        fullName: '', email: '', password: '', phone: '', city: '', ward: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password.length < 6) {
            return toast.error('Password must be at least 6 characters');
        }
        setLoading(true);
        try {
            const { data } = await api.post('/auth/citizen/signup', form);
            login(data.user, data.token);
            toast.success('Welcome to CivicEye! 🎉 You earn 0 points to start.');
            navigate('/citizen');
        } catch (err) {
            const errors = err.response?.data?.errors;
            if (errors?.length) {
                toast.error(errors[0].msg);
            } else {
                toast.error(err.response?.data?.message || 'Registration failed');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-gray-900 flex items-center justify-center px-4 py-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>

            <div className="w-full max-w-md animate-slide-up">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 mb-4">
                        <img src="/img/logo.png" alt="CivicEye Logo" className="h-10 w-10 object-contain" />
                        <span className="font-bold text-2xl text-white">CivicEye</span>
                    </Link>
                    <h1 className="text-3xl font-extrabold text-white mb-2">Create Account</h1>
                    <p className="text-white/60">Join as a citizen and start making a difference</p>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="label">Full Name *</label>
                            <input id="signup-name" type="text" name="fullName" className="input-field" placeholder="John Doe" value={form.fullName} onChange={handleChange} required />
                        </div>
                        <div>
                            <label className="label">Email Address *</label>
                            <input id="signup-email" type="email" name="email" className="input-field" placeholder="john@example.com" value={form.email} onChange={handleChange} required />
                        </div>
                        <div>
                            <label className="label">Password * <span className="text-xs font-normal text-gray-400">(min 6 chars)</span></label>
                            <input id="signup-password" type="password" name="password" className="input-field" placeholder="••••••••" value={form.password} onChange={handleChange} required />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="label">Phone</label>
                                <input id="signup-phone" type="tel" name="phone" className="input-field" placeholder="+91 98765 43210" value={form.phone} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="label">City</label>
                                <input id="signup-city" type="text" name="city" className="input-field" placeholder="Mumbai" value={form.city} onChange={handleChange} />
                            </div>
                        </div>
                        <div>
                            <label className="label">Ward / Area</label>
                            <input id="signup-ward" type="text" name="ward" className="input-field" placeholder="Ward 15, Andheri East" value={form.ward} onChange={handleChange} />
                        </div>

                        <button type="submit" disabled={loading} className="btn-primary w-full mt-2" id="signup-submit" style={{ background: 'linear-gradient(135deg, #059669, #0d9488)' }}>
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Creating Account...
                                </span>
                            ) : 'Create Account 🚀'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5">
                        Already have an account?{' '}
                        <Link to="/login" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">Sign in</Link>
                    </p>
                </div>

                <p className="text-center text-white/50 text-xs mt-4">
                    By registering, you agree to help make your city better 🏙️
                </p>
            </div>
        </div>
    );
}
