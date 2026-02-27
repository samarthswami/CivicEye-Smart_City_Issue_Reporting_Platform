import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../ui/Sidebar';
import GovHome from './GovHome';
import GovIssues from './GovIssues';
import GovMap from './GovMap';

const navItems = [
    { path: '/government', label: 'Dashboard', icon: '📊', end: true },
    { path: '/government/issues', label: 'All Issues', icon: '📋' },
    { path: '/government/map', label: 'Map View', icon: '🗺️' },
];

export default function GovernmentDashboard() {
    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
            <Sidebar navItems={navItems} title="Government Portal" />
            <main className="flex-1 overflow-auto p-6 lg:p-8 pt-16 lg:pt-8">
                <Routes>
                    <Route index element={<GovHome />} />
                    <Route path="issues" element={<GovIssues />} />
                    <Route path="map" element={<GovMap />} />
                    <Route path="*" element={<Navigate to="/government" replace />} />
                </Routes>
            </main>
        </div>
    );
}
