import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function GovernmentSignup() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [form, setForm] = useState({
        fullName: '', email: '', password: '', phone: '',
        inviteToken: searchParams.get('token') || ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/auth/government/signup', form);
            toast.success('Registration submitted! Await admin approval.', { duration: 6000 });
            navigate('/login');
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
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-gray-900 flex items-center justify-center px-4 py-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>

            <div className="w-full max-w-md animate-slide-up">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 mb-4">
                        <img src="/img/logo.png" alt="CivicEye Logo" className="h-10 w-10 object-contain" />
                        <span className="font-bold text-2xl text-white">CivicEye</span>
                    </Link>
                    <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-4">
                        <span className="text-xl">🏛️</span>
                        <span className="text-white font-semibold text-sm">Government Official Registration</span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-white mb-2">Government Portal</h1>
                    <p className="text-white/60 text-sm">Registration requires a valid invite token from admin</p>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8">
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3 mb-6">
                        <p className="text-blue-700 dark:text-blue-300 text-sm font-medium">
                            ℹ️ Your account will require admin approval before you can log in.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="label">Invite Token *</label>
                            <input
                                id="gov-invite-token"
                                type="text"
                                name="inviteToken"
                                className="input-field font-mono text-sm"
                                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                                value={form.inviteToken}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label className="label">Full Name *</label>
                            <input id="gov-name" type="text" name="fullName" className="input-field" placeholder="Dr. Jane Smith" value={form.fullName} onChange={handleChange} required />
                        </div>
                        <div>
                            <label className="label">Official Email *</label>
                            <input id="gov-email" type="email" name="email" className="input-field" placeholder="jane.smith@gov.in" value={form.email} onChange={handleChange} required />
                        </div>
                        <div>
                            <label className="label">Password *</label>
                            <input id="gov-password" type="password" name="password" className="input-field" placeholder="••••••••" value={form.password} onChange={handleChange} required />
                        </div>
                        <div>
                            <label className="label">Phone</label>
                            <input id="gov-phone" type="tel" name="phone" className="input-field" placeholder="+91 98765 43210" value={form.phone} onChange={handleChange} />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full mt-2"
                            id="gov-signup-submit"
                            style={{ background: 'linear-gradient(135deg, #1e40af, #4338ca)' }}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Submitting...
                                </span>
                            ) : 'Submit Registration 🏛️'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                        Already registered?{' '}
                        <Link to="/login" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
