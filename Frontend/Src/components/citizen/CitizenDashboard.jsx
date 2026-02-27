import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../ui/Sidebar';
import CitizenHome from './CitizenHome';
import ReportIssue from './ReportIssue';
import MyComplaints from './MyComplaints';
import Leaderboard from './Leaderboard';
import CitizenProfile from './CitizenProfile';

const navItems = [
    { path: '/citizen', label: 'Dashboard', icon: '📊', end: true },
    { path: '/citizen/report', label: 'Report Issue', icon: '📢' },
    { path: '/citizen/complaints', label: 'My Complaints', icon: '📋' },
    { path: '/citizen/leaderboard', label: 'Leaderboard', icon: '🏆' },
    { path: '/citizen/profile', label: 'My Profile', icon: '👤' },
];

export default function CitizenDashboard() {
    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
            <Sidebar navItems={navItems} title="Citizen Portal" />
            <main className="flex-1 overflow-auto p-6 lg:p-8 pt-16 lg:pt-8">
                <Routes>
                    <Route index element={<CitizenHome />} />
                    <Route path="report" element={<ReportIssue />} />
                    <Route path="complaints" element={<MyComplaints />} />
                    <Route path="leaderboard" element={<Leaderboard />} />
                    <Route path="profile" element={<CitizenProfile />} />
                    <Route path="*" element={<Navigate to="/citizen" replace />} />
                </Routes>
            </main>
        </div>
    );
}
