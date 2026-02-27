import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function CitizenProfile() {
    const { user, updateUser } = useAuth();
    const [form, setForm] = useState({
        fullName: user?.fullName || '',
        phone: user?.phone || '',
        city: user?.city || '',
        ward: user?.ward || '',
        address: user?.address || '',
    });
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.put('/auth/profile', form);
            updateUser(data.user);
            toast.success('Profile updated!');
            setEditing(false);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    const levelColors = {
        Newcomer: 'from-gray-400 to-gray-500',
        Active: 'from-blue-400 to-blue-500',
        Advanced: 'from-purple-500 to-purple-600',
        Expert: 'from-amber-400 to-amber-500',
        Champion: 'from-rose-500 to-rose-600',
    };

    const nextLevelPoints = { Newcomer: 50, Active: 200, Advanced: 500, Expert: 1000, Champion: 1000 };

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">My Profile 👤</h1>

            {/* Profile hero */}
            <div className={`bg-gradient-to-br ${levelColors[user?.level] || levelColors.Newcomer} rounded-3xl p-8 text-white relative overflow-hidden`}>
                <div className="absolute -bottom-8 -right-8 w-36 h-36 bg-white/10 rounded-full"></div>
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-white/10 rounded-full"></div>
                <div className="relative flex items-center gap-6">
                    <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center text-5xl font-black border-4 border-white/30">
                        {user?.fullName?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-2xl font-extrabold">{user?.fullName}</h2>
                        <p className="text-white/80">{user?.email}</p>
                        <div className="flex items-center gap-3 mt-2">
                            <span className="bg-white/20 rounded-full px-3 py-1 text-sm font-bold">
                                {user?.level || 'Newcomer'}
                            </span>
                            <span className="text-white/80 text-sm">🏆 {user?.points || 0} points</span>
                            <span className="text-white/80 text-sm capitalize">👑 {user?.role}</span>
                        </div>
                    </div>
                </div>

                {/* Level progress */}
                <div className="mt-6 relative">
                    <div className="flex justify-between text-sm text-white/70 mb-1">
                        <span>{user?.level}</span>
                        {user?.level !== 'Champion' && <span>{nextLevelPoints[user?.level]} pts for next level</span>}
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                        <div
                            className="bg-white rounded-full h-2 transition-all duration-1000"
                            style={{ width: `${Math.min(100, ((user?.points || 0) / nextLevelPoints[user?.level || 'Newcomer']) * 100)}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Profile form */}
            <div className="card">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Profile Information</h2>
                    {!editing ? (
                        <button onClick={() => setEditing(true)} className="btn-secondary text-sm py-2">
                            ✏️ Edit Profile
                        </button>
                    ) : (
                        <button onClick={() => setEditing(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-sm">
                            Cancel
                        </button>
                    )}
                </div>

                {editing ? (
                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <label className="label">Full Name</label>
                            <input type="text" className="input-field" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} />
                        </div>
                        <div>
                            <label className="label">Phone</label>
                            <input type="tel" className="input-field" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="label">City</label>
                                <input type="text" className="input-field" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="Mumbai" />
                            </div>
                            <div>
                                <label className="label">Ward</label>
                                <input type="text" className="input-field" value={form.ward} onChange={e => setForm({ ...form, ward: e.target.value })} placeholder="Ward 15" />
                            </div>
                        </div>
                        <div>
                            <label className="label">Address</label>
                            <input type="text" className="input-field" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="123, Main St" />
                        </div>
                        <button type="submit" disabled={loading} className="btn-primary">
                            {loading ? 'Saving...' : '💾 Save Changes'}
                        </button>
                    </form>
                ) : (
                    <div className="space-y-3">
                        {[
                            { label: 'Full Name', value: user?.fullName, icon: '👤' },
                            { label: 'Email', value: user?.email, icon: '📧' },
                            { label: 'Phone', value: user?.phone || 'Not provided', icon: '📱' },
                            { label: 'City', value: user?.city || 'Not provided', icon: '🏙️' },
                            { label: 'Ward', value: user?.ward || 'Not provided', icon: '🗺️' },
                            { label: 'Member Since', value: new Date(user?.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }), icon: '📅' },
                        ].map(item => (
                            <div key={item.label} className="flex items-center gap-3 py-3 border-b border-gray-50 dark:border-gray-800 last:border-0">
                                <span className="text-xl w-8">{item.icon}</span>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">{item.label}</p>
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
