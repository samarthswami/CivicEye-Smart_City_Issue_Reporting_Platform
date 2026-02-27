import { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ROLES = ['all', 'citizen', 'government', 'admin'];
const STATUSES = ['all', 'active', 'pending', 'rejected'];

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [acting, setActing] = useState(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (roleFilter !== 'all') params.append('role', roleFilter);
            if (statusFilter !== 'all') params.append('status', statusFilter);
            const { data } = await api.get(`/admin/users?${params}`);
            setUsers(data.users);
        } catch (err) { }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchUsers(); }, [roleFilter, statusFilter]);

    const handleAction = async (userId, action, name) => {
        setActing(userId);
        try {
            await api.post(`/admin/users/${userId}/${action}`);
            toast.success(`${name} ${action}d`);
            fetchUsers();
        } catch (err) {
            toast.error('Action failed');
        } finally { setActing(null); }
    };

    const roleColors = {
        citizen: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
        government: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
        admin: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    };
    const statusIcons = { active: '✅', pending: '⏳', rejected: '❌' };

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">👥 User Management</h1>
                <p className="text-gray-500 dark:text-gray-400">{users.length} users found</p>
            </div>

            {/* Filters */}
            <div className="card flex flex-wrap gap-4">
                <div>
                    <label className="label text-xs">Role</label>
                    <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="input-field py-2 text-sm">
                        {ROLES.map(r => <option key={r} value={r}>{r === 'all' ? 'All Roles' : r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                    </select>
                </div>
                <div>
                    <label className="label text-xs">Status</label>
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input-field py-2 text-sm">
                        {STATUSES.map(s => <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                </div>
            </div>

            {/* Users table */}
            <div className="card overflow-x-auto">
                {loading ? (
                    <div className="space-y-3">
                        {Array(5).fill(0).map((_, i) => (
                            <div key={i} className="h-14 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"></div>
                        ))}
                    </div>
                ) : users.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-5xl mb-3">👥</div>
                        <p className="font-semibold text-gray-600 dark:text-gray-400">No users found</p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left border-b border-gray-100 dark:border-gray-800">
                                <th className="pb-3 font-semibold text-gray-500 dark:text-gray-400">User</th>
                                <th className="pb-3 font-semibold text-gray-500 dark:text-gray-400">Role</th>
                                <th className="pb-3 font-semibold text-gray-500 dark:text-gray-400">Status</th>
                                <th className="pb-3 font-semibold text-gray-500 dark:text-gray-400">Dept/Points</th>
                                <th className="pb-3 font-semibold text-gray-500 dark:text-gray-400">Joined</th>
                                <th className="pb-3 font-semibold text-gray-500 dark:text-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                            {users.map(user => (
                                <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="py-3 pr-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0">
                                                {user.fullName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-white">{user.fullName}</p>
                                                <p className="text-gray-400 text-xs">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 pr-4">
                                        <span className={`badge ${roleColors[user.role]}`}>{user.role}</span>
                                    </td>
                                    <td className="py-3 pr-4">
                                        <span className="text-sm">
                                            {statusIcons[user.status]} {user.status}
                                        </span>
                                    </td>
                                    <td className="py-3 pr-4 text-gray-500 dark:text-gray-400">
                                        {user.role === 'citizen' ? `${user.points || 0} pts` : user.department || '—'}
                                    </td>
                                    <td className="py-3 pr-4 text-gray-400 text-xs">
                                        {new Date(user.createdAt).toLocaleDateString('en-IN')}
                                    </td>
                                    <td className="py-3">
                                        {user.role === 'government' && user.status === 'pending' && (
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => handleAction(user._id, 'approve', user.fullName)}
                                                    disabled={acting === user._id}
                                                    className="text-xs bg-emerald-600 text-white px-2 py-1 rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                                                >
                                                    {acting === user._id ? '...' : '✓ Approve'}
                                                </button>
                                                <button
                                                    onClick={() => handleAction(user._id, 'reject', user.fullName)}
                                                    disabled={acting === user._id}
                                                    className="text-xs bg-red-600 text-white px-2 py-1 rounded-lg hover:bg-red-700 disabled:opacity-50"
                                                >
                                                    ✗ Reject
                                                </button>
                                            </div>
                                        )}
                                        {user.status === 'active' && user.role === 'government' && (
                                            <span className="text-xs text-emerald-600 font-medium">✅ Active</span>
                                        )}
                                        {user.status === 'rejected' && (
                                            <span className="text-xs text-red-500 font-medium">❌ Rejected</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
