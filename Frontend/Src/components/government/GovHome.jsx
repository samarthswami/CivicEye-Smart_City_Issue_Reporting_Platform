import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { StatCard, StatusBadge, CategoryIcon } from '../ui/UIComponents';

export default function GovHome() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [recentIssues, setRecentIssues] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, issuesRes] = await Promise.all([
                    api.get('/issues/stats'),
                    api.get('/issues/all?limit=5')
                ]);
                setStats(statsRes.data);
                setRecentIssues(issuesRes.data.issues);
            } catch (err) { }
            finally { setLoading(false); }
        };
        fetchData();
    }, []);

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative">
                    <h1 className="text-3xl font-extrabold mb-2">Government Dashboard 🏛️</h1>
                    <p className="text-blue-100 text-lg">Welcome, {user?.fullName}</p>
                    <div className="flex items-center gap-3 mt-3">
                        <span className="bg-white/20 rounded-full px-3 py-1 text-sm font-bold">{user?.department}</span>
                        {user?.assignedArea && <span className="bg-white/20 rounded-full px-3 py-1 text-sm">📍 {user?.assignedArea}</span>}
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon="📋" label="Total Issues" value={loading ? '...' : stats?.total || 0} color="blue" />
                <StatCard icon="🔴" label="Reported" value={loading ? '...' : stats?.reported || 0} color="orange" />
                <StatCard icon="🔄" label="In Progress" value={loading ? '...' : stats?.inProgress || 0} color="purple" />
                <StatCard icon="✅" label="Resolved" value={loading ? '...' : stats?.resolved || 0} color="green" />
            </div>

            {/* Recent Issues */}
            <div className="card">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Issues</h2>
                    <Link to="/government/issues" className="text-primary-600 dark:text-primary-400 text-sm font-semibold hover:underline">
                        View all →
                    </Link>
                </div>
                <div className="space-y-3">
                    {loading ? (
                        Array(4).fill(0).map((_, i) => (
                            <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"></div>
                        ))
                    ) : recentIssues.map(issue => (
                        <div key={issue._id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                            <div className="text-2xl"><CategoryIcon category={issue.category} /></div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 dark:text-white truncate">{issue.title}</p>
                                <p className="text-sm text-gray-500">{issue.reportedBy?.fullName} • {issue.location?.city || 'Unknown'}</p>
                            </div>
                            <StatusBadge status={issue.status} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
