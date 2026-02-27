import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { StatCard } from '../ui/UIComponents';
import toast from 'react-hot-toast';

export default function AdminHome() {
    const [stats, setStats] = useState(null);
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [approving, setApproving] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [statsRes, pendingRes] = await Promise.all([
                api.get('/admin/stats'),
                api.get('/admin/users/pending')
            ]);
            setStats(statsRes.data.stats);
            setPendingUsers(pendingRes.data.users);
        } catch (err) { }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleApprove = async (userId, userName) => {
        setApproving(userId + '-approve');
        try {
            await api.post(`/admin/users/${userId}/approve`);
            toast.success(`✅ ${userName} approved!`);
            fetchData();
        } catch (err) {
            toast.error('Failed to approve');
        } finally { setApproving(null); }
    };

    const handleReject = async (userId, userName) => {
        setApproving(userId + '-reject');
        try {
            await api.post(`/admin/users/${userId}/reject`);
            toast.success(`❌ ${userName} rejected`);
            fetchData();
        } catch (err) {
            toast.error('Failed to reject');
        } finally { setApproving(null); }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-900/40 to-purple-900/40"></div>
                <div className="relative">
                    <h1 className="text-3xl font-extrabold mb-2">⚙️ Admin Control Center</h1>
                    <p className="text-gray-300">Manage CivicEye platform users, approvals, and system health</p>
                </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon="👥" label="Total Users" value={loading ? '...' : stats?.totalUsers || 0} color="primary" />
                <StatCard icon="👤" label="Citizens" value={loading ? '...' : stats?.totalCitizens || 0} color="blue" />
                <StatCard icon="🏛️" label="Gov Officials" value={loading ? '...' : stats?.totalGovt || 0} color="purple" />
                <StatCard icon="⏳" label="Pending Approvals" value={loading ? '...' : stats?.pendingApprovals || 0} color="orange" />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard icon="📋" label="Total Issues" value={loading ? '...' : stats?.totalIssues || 0} color="primary" />
                <StatCard icon="✅" label="Resolved" value={loading ? '...' : stats?.resolvedIssues || 0} color="green" />
                <StatCard icon="📈" label="Resolution Rate" value={loading ? '...' : `${stats?.resolutionRate || 0}%`} color="green" />
            </div>

            {/* Pending Approvals */}
            <div className="card">
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Pending Approvals</h2>
                        <p className="text-sm text-gray-500">{pendingUsers.length} government users waiting</p>
                    </div>
                    <Link to="/admin/users" className="btn-secondary text-sm py-2">View All Users</Link>
                </div>

                {loading ? (
                    <div className="space-y-3">
                        {Array(3).fill(0).map((_, i) => (
                            <div key={i} className="h-20 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"></div>
                        ))}
                    </div>
                ) : pendingUsers.length === 0 ? (
                    <div className="text-center py-8 space-y-2">
                        <div className="text-4xl">✅</div>
                        <p className="font-semibold text-gray-700 dark:text-gray-300">All caught up!</p>
                        <p className="text-sm text-gray-500">No pending government user approvals</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {pendingUsers.map(user => (
                            <div key={user._id} className="flex items-center gap-4 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-2xl">
                                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shrink-0">
                                    {user.fullName.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-gray-900 dark:text-white">{user.fullName}</p>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                    <div className="flex items-center gap-3 mt-1">
                                        {user.department && <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full font-medium">{user.department}</span>}
                                        {user.assignedArea && <span className="text-xs text-gray-400">📍 {user.assignedArea}</span>}
                                        <span className="text-xs text-gray-400">Joined {new Date(user.createdAt).toLocaleDateString('en-IN')}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={() => handleApprove(user._id, user.fullName)}
                                        disabled={approving === user._id + '-approve'}
                                        className="btn-success py-1.5 px-4 text-sm"
                                        id={`approve-${user._id}`}
                                    >
                                        {approving === user._id + '-approve' ? '...' : '✓ Approve'}
                                    </button>
                                    <button
                                        onClick={() => handleReject(user._id, user.fullName)}
                                        disabled={approving === user._id + '-reject'}
                                        className="btn-danger py-1.5 px-4 text-sm"
                                        id={`reject-${user._id}`}
                                    >
                                        {approving === user._id + '-reject' ? '...' : '✗ Reject'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
