import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { StatCard, StatusBadge, CategoryIcon, Skeleton, EmptyState } from '../ui/UIComponents';

export default function CitizenHome() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [recentIssues, setRecentIssues] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, issuesRes] = await Promise.all([
                    api.get('/issues/stats'),
                    api.get('/issues/my-complaints?limit=5')
                ]);
                setStats(statsRes.data);
                setRecentIssues(issuesRes.data.issues);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const levelBadges = {
        Newcomer: { color: 'bg-gray-100 text-gray-700', icon: '🌱' },
        Active: { color: 'bg-blue-100 text-blue-700', icon: '⭐' },
        Advanced: { color: 'bg-purple-100 text-purple-700', icon: '💫' },
        Expert: { color: 'bg-amber-100 text-amber-700', icon: '🏅' },
        Champion: { color: 'bg-rose-100 text-rose-700', icon: '🏆' },
    };
    const levelInfo = levelBadges[user?.level] || levelBadges.Newcomer;

    const nextLevelPoints = { Newcomer: 50, Active: 200, Advanced: 500, Expert: 1000, Champion: Infinity };
    const pointsNeeded = nextLevelPoints[user?.level] - (user?.points || 0);

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Welcome header */}
            <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-purple-700 rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                <div className="relative">
                    <div className="flex items-start justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="text-3xl font-extrabold mb-2">Welcome back, {user?.fullName?.split(' ')[0]}! 👋</h1>
                            <p className="text-primary-100 text-lg">Your civic engagement makes a real difference!</p>
                        </div>
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl font-bold ${levelInfo.color}`}>
                            {levelInfo.icon} {user?.level || 'Newcomer'}
                        </div>
                    </div>

                    {/* Points bar */}
                    <div className="mt-6">
                        <div className="flex justify-between text-sm text-primary-100 mb-2">
                            <span>🏆 {user?.points || 0} points earned</span>
                            {user?.level !== 'Champion' && (
                                <span>{pointsNeeded} more to next level</span>
                            )}
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                            <div
                                className="bg-white rounded-full h-2 transition-all duration-1000"
                                style={{
                                    width: `${Math.min(100, ((user?.points || 0) / nextLevelPoints[user?.level || 'Newcomer']) * 100)}%`
                                }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {loading ? (
                    Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-24" />)
                ) : (
                    <>
                        <StatCard icon="📋" label="Total Complaints" value={stats?.total || 0} color="primary" />
                        <StatCard icon="🔴" label="Reported" value={stats?.reported || 0} color="orange" />
                        <StatCard icon="🔄" label="In Progress" value={stats?.inProgress || 0} color="purple" />
                        <StatCard icon="✅" label="Resolved" value={stats?.resolved || 0} color="green" />
                    </>
                )}
            </div>

            {/* Recent issues + Quick actions */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent Issues */}
                <div className="lg:col-span-2 card">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Complaints</h2>
                        <Link to="/citizen/complaints" className="text-primary-600 dark:text-primary-400 text-sm font-semibold hover:underline">
                            View all →
                        </Link>
                    </div>

                    {loading ? (
                        <div className="space-y-3">
                            {Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-16" />)}
                        </div>
                    ) : recentIssues.length === 0 ? (
                        <EmptyState icon="📭" title="No complaints yet" desc="Report your first civic issue!" />
                    ) : (
                        <div className="space-y-3">
                            {recentIssues.map(issue => (
                                <div key={issue._id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                    <div className="text-2xl shrink-0">
                                        <CategoryIcon category={issue.category} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-900 dark:text-white truncate">{issue.title}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(issue.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                        </p>
                                    </div>
                                    <StatusBadge status={issue.status} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="card">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Quick Actions</h2>
                    <div className="space-y-3">
                        <Link to="/citizen/report" className="flex items-center gap-4 p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800 rounded-xl hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors group">
                            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white text-xl shrink-0 group-hover:scale-110 transition-transform">📢</div>
                            <div>
                                <p className="font-semibold text-primary-700 dark:text-primary-300">Report Issue</p>
                                <p className="text-xs text-primary-500">+10 points</p>
                            </div>
                        </Link>
                        <Link to="/citizen/complaints" className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group">
                            <div className="w-10 h-10 bg-gray-600 rounded-xl flex items-center justify-center text-white text-xl shrink-0 group-hover:scale-110 transition-transform">📋</div>
                            <div>
                                <p className="font-semibold text-gray-700 dark:text-gray-300">Track Issues</p>
                                <p className="text-xs text-gray-500">View status</p>
                            </div>
                        </Link>
                        <Link to="/citizen/leaderboard" className="flex items-center gap-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-xl hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors group">
                            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white text-xl shrink-0 group-hover:scale-110 transition-transform">🏆</div>
                            <div>
                                <p className="font-semibold text-amber-700 dark:text-amber-300">Leaderboard</p>
                                <p className="text-xs text-amber-500">See rankings</p>
                            </div>
                        </Link>
                    </div>

                    {/* Category breakdown */}
                    {stats?.categoryStats?.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Categories</h3>
                            <div className="space-y-2">
                                {stats.categoryStats.slice(0, 4).map(cat => (
                                    <div key={cat._id} className="flex items-center gap-2">
                                        <CategoryIcon category={cat._id} />
                                        <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                                            <div
                                                className="bg-primary-500 rounded-full h-2 transition-all"
                                                style={{ width: `${(cat.count / (stats.total || 1)) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-xs text-gray-500 w-6">{cat.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
