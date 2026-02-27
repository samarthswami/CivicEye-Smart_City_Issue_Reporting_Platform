import { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminInvites() {
    const [invites, setInvites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [form, setForm] = useState({
        email: '', department: '', position: '', assignedArea: ''
    });
    const [lastInviteLink, setLastInviteLink] = useState(null);
    const [copied, setCopied] = useState(false);

    const fetchInvites = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/admin/invite/list');
            setInvites(data.invites);
        } catch (err) { }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchInvites(); }, []);

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!form.email || !form.department) {
            return toast.error('Email and department are required');
        }
        setGenerating(true);
        try {
            const { data } = await api.post('/admin/invite/generate', form);
            setLastInviteLink(data.inviteLink);
            toast.success('Invite generated!');
            setForm({ email: '', department: '', position: '', assignedArea: '' });
            fetchInvites();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to generate invite');
        } finally { setGenerating(false); }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            toast.success('Link copied to clipboard!');
        });
    };

    const DEPARTMENTS = [
        'Road & Infrastructure', 'Water Supply', 'Electricity', 'Sanitation',
        'Parks & Recreation', 'Street Lighting', 'Traffic Management', 'Public Safety', 'Other'
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">🔗 Invite Links</h1>
                <p className="text-gray-500 dark:text-gray-400">Generate invite links for government officials</p>
            </div>

            {/* Generate invite form */}
            <div className="card">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Generate New Invite</h2>
                <form onSubmit={handleGenerate} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="label">Official Email *</label>
                            <input
                                id="invite-email"
                                type="email"
                                className="input-field"
                                placeholder="official@gov.in"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="label">Department *</label>
                            <select
                                id="invite-dept"
                                className="input-field"
                                value={form.department}
                                onChange={e => setForm({ ...form, department: e.target.value })}
                                required
                            >
                                <option value="">Select Department</option>
                                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="label">Position</label>
                            <input
                                id="invite-position"
                                type="text"
                                className="input-field"
                                placeholder="e.g., Junior Engineer"
                                value={form.position}
                                onChange={e => setForm({ ...form, position: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="label">Assigned Area</label>
                            <input
                                id="invite-area"
                                type="text"
                                className="input-field"
                                placeholder="e.g., Ward 15-20, Andheri"
                                value={form.assignedArea}
                                onChange={e => setForm({ ...form, assignedArea: e.target.value })}
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={generating}
                        className="btn-primary"
                        id="generate-invite-btn"
                    >
                        {generating ? (
                            <span className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Generating...
                            </span>
                        ) : '+ Generate Invite Link'}
                    </button>
                </form>

                {lastInviteLink && (
                    <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl space-y-2 animate-fade-in">
                        <p className="font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                            <span>✅</span> Invite link generated successfully!
                        </p>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                readOnly
                                value={lastInviteLink}
                                className="input-field flex-1 font-mono text-sm"
                            />
                            <button
                                onClick={() => copyToClipboard(lastInviteLink)}
                                className="btn-primary whitespace-nowrap"
                            >
                                {copied ? '✓ Copied' : '📋 Copy'}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Invites table */}
            <div className="card overflow-x-auto">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Previous Invites</h2>
                {loading ? (
                    <div className="space-y-3">
                        {Array(5).fill(0).map((_, i) => (
                            <div key={i} className="h-14 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"></div>
                        ))}
                    </div>
                ) : invites.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-5xl mb-3">🔗</div>
                        <p className="font-semibold text-gray-600 dark:text-gray-400">No invites generated yet</p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left border-b border-gray-100 dark:border-gray-800">
                                <th className="pb-3 font-semibold text-gray-500 dark:text-gray-400">Email</th>
                                <th className="pb-3 font-semibold text-gray-500 dark:text-gray-400">Department</th>
                                <th className="pb-3 font-semibold text-gray-500 dark:text-gray-400">Status</th>
                                <th className="pb-3 font-semibold text-gray-500 dark:text-gray-400">Generated</th>
                                <th className="pb-3 font-semibold text-gray-500 dark:text-gray-400">Used By</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                            {invites.map(inv => {
                                const isExpired = new Date(inv.expiresAt) < new Date();
                                return (
                                    <tr key={inv._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">{inv.email}</td>
                                        <td className="py-3 pr-4 text-gray-600 dark:text-gray-400">{inv.department}</td>
                                        <td className="py-3 pr-4">
                                            {inv.isUsed ? (
                                                <span className="badge bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">Used</span>
                                            ) : isExpired ? (
                                                <span className="badge bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">Expired</span>
                                            ) : (
                                                <span className="badge bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">Active</span>
                                            )}
                                        </td>
                                        <td className="py-3 pr-4 text-gray-500 dark:text-gray-400 text-xs">
                                            {new Date(inv.createdAt).toLocaleDateString('en-IN')}
                                        </td>
                                        <td className="py-3 pr-4 text-gray-600 dark:text-gray-400">
                                            {inv.usedBy?.fullName || '—'}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
