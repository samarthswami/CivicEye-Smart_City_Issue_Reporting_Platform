import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import toast from 'react-hot-toast';

export default function Sidebar({ navItems, title, accentColor = 'primary' }) {
    const { user, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        navigate('/login');
    };

    const levelColors = {
        Newcomer: 'text-gray-500',
        Active: 'text-blue-500',
        Advanced: 'text-purple-500',
        Expert: 'text-amber-500',
        Champion: 'text-rose-500',
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className={`flex items-center gap-3 p-4 border-b border-gray-100 dark:border-gray-800 ${collapsed ? 'justify-center' : ''}`}>
                <img src="/img/logo.png" alt="CivicEye Logo" className="h-8 w-8 object-contain shrink-0" />
                {!collapsed && <span className="font-bold text-lg gradient-text">CivicEye</span>}
            </div>

            {/* User info */}
            {!collapsed && (
                <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0">
                            {user?.fullName?.charAt(0)?.toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{user?.fullName}</p>
                            <p className={`text-xs font-medium ${levelColors[user?.level] || 'text-gray-500'}`}>
                                {user?.role === 'citizen' ? `${user?.level || 'Newcomer'} • ${user?.points || 0} pts` : user?.department || user?.role}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.end}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 font-medium text-sm ${isActive
                                ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                            } ${collapsed ? 'justify-center' : ''}`
                        }
                        onClick={() => setMobileOpen(false)}
                    >
                        <span className="text-lg shrink-0">{item.icon}</span>
                        {!collapsed && <span>{item.label}</span>}
                    </NavLink>
                ))}
            </nav>

            {/* Bottom actions */}
            <div className={`p-3 border-t border-gray-100 dark:border-gray-800 space-y-1 ${collapsed ? 'items-center flex flex-col' : ''}`}>
                <button
                    onClick={toggleTheme}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-150 font-medium text-sm"
                >
                    <span className="text-lg">{isDark ? '☀️' : '🌙'}</span>
                    {!collapsed && <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>}
                </button>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-150 font-medium text-sm"
                    id="logout-btn"
                >
                    <span className="text-lg">🚪</span>
                    {!collapsed && <span>Logout</span>}
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile toggle button */}
            <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
            >
                <span className="text-xl">{mobileOpen ? '✕' : '☰'}</span>
            </button>

            {/* Mobile overlay */}
            {mobileOpen && (
                <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setMobileOpen(false)} />
            )}

            {/* Mobile sidebar */}
            <aside className={`lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-white dark:bg-gray-900 shadow-2xl z-50 transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <SidebarContent />
            </aside>

            {/* Desktop sidebar */}
            <aside className={`hidden lg:flex flex-col ${collapsed ? 'w-16' : 'w-64'} bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 shrink-0 transition-all duration-300 relative`}>
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-3 top-20 w-6 h-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center text-xs shadow-md hover:shadow-lg transition-all z-10"
                >
                    {collapsed ? '›' : '‹'}
                </button>
                <SidebarContent />
            </aside>
        </>
    );
}
