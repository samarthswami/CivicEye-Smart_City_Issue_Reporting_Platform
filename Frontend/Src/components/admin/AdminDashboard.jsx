import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../ui/Sidebar';
import AdminHome from './AdminHome';
import AdminUsers from './AdminUsers';
import AdminInvites from './AdminInvites';

const navItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊', end: true },
    { path: '/admin/users', label: 'User Management', icon: '👥' },
    { path: '/admin/invites', label: 'Invite Links', icon: '🔗' },
];

export default function AdminDashboard() {
    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
            <Sidebar navItems={navItems} title="Admin Panel" />
            <main className="flex-1 overflow-auto p-6 lg:p-8 pt-16 lg:pt-8">
                <Routes>
                    <Route index element={<AdminHome />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="invites" element={<AdminInvites />} />
                    <Route path="*" element={<Navigate to="/admin" replace />} />
                </Routes>
            </main>
        </div>
    );
}
