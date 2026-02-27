import { useEffect, useState } from 'react';
import api from '../../services/api';
import { StatusBadge, SeverityBadge, CategoryIcon, EmptyState } from '../ui/UIComponents';
import toast from 'react-hot-toast';

const CATEGORIES = ['all', 'pothole', 'garbage', 'streetlight', 'water', 'sewage', 'electricity', 'road', 'park', 'noise', 'other'];
const STATUSES = ['all', 'reported', 'assigned', 'in_progress', 'resolved', 'closed'];

export default function GovIssues() {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [updating, setUpdating] = useState(null);
    const [comment, setComment] = useState('');

    const fetchIssues = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (categoryFilter !== 'all') params.append('category', categoryFilter);
            if (statusFilter !== 'all') params.append('status', statusFilter);
            const { data } = await api.get(`/issues/all?${params}`);
            setIssues(data.issues);
        } catch (err) { }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchIssues(); }, [categoryFilter, statusFilter]);

    const handleStatusChange = async (issueId, newStatus) => {
        setUpdating(issueId);
        try {
            await api.put(`/issues/${issueId}/status`, { status: newStatus });
            toast.success(`Status updated to ${newStatus.replace('_', ' ')}`);
            setIssues(prev => prev.map(i => i._id === issueId ? { ...i, status: newStatus } : i));
            if (selectedIssue?._id === issueId) {
                setSelectedIssue(prev => ({ ...prev, status: newStatus }));
            }
        } catch (err) {
            toast.error('Failed to update status');
        } finally {
            setUpdating(null);
        }
    };

    const handleResolve = async (issueId) => {
        setUpdating(issueId);
        try {
            await api.post(`/issues/${issueId}/resolve`);
            toast.success('Issue resolved! Citizen awarded 25 bonus points 🎉');
            fetchIssues();
            setSelectedIssue(null);
        } catch (err) {
            toast.error('Failed to resolve');
        } finally {
            setUpdating(null);
        }
    };

    const handleComment = async (issueId) => {
        if (!comment.trim()) return;
        try {
            await api.post(`/issues/${issueId}/comment`, { comment });
            toast.success('Comment added');
            setComment('');
        } catch (err) { }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">All Issues 📋</h1>
                <p className="text-gray-500 dark:text-gray-400">{issues.length} issues found</p>
            </div>

            {/* Filters */}
            <div className="card flex flex-wrap gap-4">
                <div>
                    <label className="label text-xs">Category</label>
                    <select
                        value={categoryFilter}
                        onChange={e => setCategoryFilter(e.target.value)}
                        className="input-field py-2 text-sm"
                    >
                        {CATEGORIES.map(c => (
                            <option key={c} value={c}>{c === 'all' ? 'All Categories' : c.replace(/\b\w/g, ch => ch.toUpperCase())}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="label text-xs">Status</label>
                    <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        className="input-field py-2 text-sm"
                    >
                        {STATUSES.map(s => (
                            <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Issues grid */}
            {loading ? (
                <div className="grid gap-4">
                    {Array(4).fill(0).map((_, i) => (
                        <div key={i} className="card animate-pulse">
                            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-3"></div>
                            <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            ) : issues.length === 0 ? (
                <EmptyState icon="📭" title="No issues found" desc="Try adjusting your filters" />
            ) : (
                <div className="space-y-4">
                    {issues.map(issue => (
                        <div key={issue._id} className="card">
                            <div
                                className="flex items-start gap-4 cursor-pointer"
                                onClick={() => setSelectedIssue(selectedIssue?._id === issue._id ? null : issue)}
                            >
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
                                        <div className="flex items-center gap-2">
                                            <SeverityBadge severity={issue.severity} />
                                            <StatusBadge status={issue.status} />
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{issue.description}</p>
                                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                                        <span>👤 {issue.reportedBy?.fullName}</span>
                                        <span>📅 {new Date(issue.createdAt).toLocaleDateString('en-IN')}</span>
                                        {issue.location?.city && <span>📍 {issue.location.city}</span>}
                                        <span>👍 {issue.upvotes || 0}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions row */}
                            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex-wrap">
                                <span className="text-xs text-gray-500 font-medium">Update status:</span>
                                {['assigned', 'in_progress', 'resolved'].map(s => (
                                    <button
                                        key={s}
                                        disabled={updating === issue._id || issue.status === s}
                                        onClick={() => s === 'resolved' ? handleResolve(issue._id) : handleStatusChange(issue._id, s)}
                                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${issue.status === s
                                                ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-default'
                                                : s === 'resolved'
                                                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                                    : 'bg-primary-600 text-white hover:bg-primary-700'
                                            } disabled:opacity-50`}
                                    >
                                        {updating === issue._id ? '...' : s.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                                    </button>
                                ))}
                            </div>

                            {/* Expanded details */}
                            {selectedIssue?._id === issue._id && (
                                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 space-y-4 animate-fade-in">
                                    {issue.imageUrl && (
                                        <img src={issue.imageUrl} alt="Issue" className="max-h-64 rounded-xl object-cover w-full" />
                                    )}
                                    {issue.location?.address && (
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            📍 {[issue.location.address, issue.location.area, issue.location.city].filter(Boolean).join(', ')}
                                        </p>
                                    )}
                                    {issue.location?.latitude && (
                                        <p className="text-xs text-gray-400 font-mono">GPS: {issue.location.latitude}, {issue.location.longitude}</p>
                                    )}

                                    {/* Comment input */}
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            className="input-field flex-1 py-2 text-sm"
                                            placeholder="Add a comment..."
                                            value={comment}
                                            onChange={e => setComment(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && handleComment(issue._id)}
                                        />
                                        <button
                                            onClick={() => handleComment(issue._id)}
                                            className="btn-primary py-2 px-4 text-sm"
                                        >
                                            Post
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
