import { useEffect, useState } from 'react';
import api from '../../services/api';
import { StatusBadge, SeverityBadge, CategoryIcon, EmptyState } from '../ui/UIComponents';

const STATUS_FILTERS = ['all', 'reported', 'assigned', 'in_progress', 'resolved'];

export default function MyComplaints() {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [total, setTotal] = useState(0);

    const fetchIssues = async (status) => {
        setLoading(true);
        try {
            const params = status !== 'all' ? `?status=${status}` : '';
            const { data } = await api.get(`/issues/my-complaints${params}`);
            setIssues(data.issues);
            setTotal(data.total);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIssues(statusFilter);
    }, [statusFilter]);

    const handleUpvote = async (issueId) => {
        try {
            const { data } = await api.post(`/issues/${issueId}/upvote`);
            setIssues(prev => prev.map(i => i._id === issueId ? { ...i, upvotes: data.upvotes } : i));
        } catch (err) { }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">My Complaints 📋</h1>
                <p className="text-gray-500 dark:text-gray-400">{total} total complaints filed</p>
            </div>

            {/* Status filter tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1">
                {STATUS_FILTERS.map(s => (
                    <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${statusFilter === s
                                ? 'bg-primary-600 text-white shadow-md'
                                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                            }`}
                    >
                        {s === 'all' ? 'All' : s.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                    </button>
                ))}
            </div>

            {/* Issues list */}
            {loading ? (
                <div className="space-y-4">
                    {Array(3).fill(0).map((_, i) => (
                        <div key={i} className="card animate-pulse">
                            <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                            <div className="h-4 w-1/2 bg-gray-100 dark:bg-gray-800 rounded"></div>
                        </div>
                    ))}
                </div>
            ) : issues.length === 0 ? (
                <EmptyState
                    icon="📭"
                    title="No complaints found"
                    desc={statusFilter !== 'all' ? `No ${statusFilter.replace('_', ' ')} complaints` : 'Start by reporting your first civic issue!'}
                />
            ) : (
                <div className="space-y-4">
                    {issues.map(issue => (
                        <div
                            key={issue._id}
                            onClick={() => setSelectedIssue(selectedIssue?._id === issue._id ? null : issue)}
                            className="card-hover cursor-pointer"
                        >
                            <div className="flex items-start gap-4">
                                {/* Image */}
                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
                                    {issue.imageUrl ? (
                                        <img src={issue.imageUrl} alt={issue.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-2xl">
                                            <CategoryIcon category={issue.category} />
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 flex-wrap">
                                        <h3 className="font-bold text-gray-900 dark:text-white">{issue.title}</h3>
                                        <StatusBadge status={issue.status} />
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">{issue.description}</p>
                                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                                        <SeverityBadge severity={issue.severity} />
                                        <span className="text-xs text-gray-400 capitalize">{issue.category}</span>
                                        <span className="text-xs text-gray-400">
                                            {new Date(issue.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </span>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleUpvote(issue._id); }}
                                            className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary-600 transition-colors"
                                        >
                                            👍 {issue.upvotes || 0}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Expanded detail */}
                            {selectedIssue?._id === issue._id && (
                                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3 animate-fade-in">
                                    {issue.location?.address && (
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            📍 {[issue.location.address, issue.location.area, issue.location.city].filter(Boolean).join(', ')}
                                        </p>
                                    )}
                                    {issue.location?.latitude && (
                                        <p className="text-xs text-gray-400 font-mono">
                                            GPS: {issue.location.latitude}, {issue.location.longitude}
                                        </p>
                                    )}
                                    {issue.assignedTo && (
                                        <p className="text-sm text-blue-600 dark:text-blue-400">
                                            🏛️ Assigned to: {issue.assignedTo.fullName} ({issue.assignedTo.department})
                                        </p>
                                    )}
                                    {issue.resolvedAt && (
                                        <p className="text-sm text-emerald-600 dark:text-emerald-400">
                                            ✅ Resolved on {new Date(issue.resolvedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </p>
                                    )}
                                    {issue.imageUrl && (
                                        <img src={issue.imageUrl} alt="Issue" className="max-h-64 rounded-xl object-cover" />
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
