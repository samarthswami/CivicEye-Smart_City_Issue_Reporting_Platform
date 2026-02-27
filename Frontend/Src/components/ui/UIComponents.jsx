export const StatusBadge = ({ status }) => {
    const labels = {
        reported: '🔴 Reported',
        assigned: '🔵 Assigned',
        in_progress: '🟣 In Progress',
        resolved: '🟢 Resolved',
        closed: '⚫ Closed',
    };
    return (
        <span className={`badge status-${status}`}>
            {labels[status] || status}
        </span>
    );
};

export const SeverityBadge = ({ severity }) => {
    const labels = {
        low: '🟦 Low',
        medium: '🟨 Medium',
        high: '🟧 High',
        critical: '🔴 Critical',
    };
    return (
        <span className={`badge severity-${severity}`}>
            {labels[severity] || severity}
        </span>
    );
};

export const CategoryIcon = ({ category }) => {
    const icons = {
        pothole: '🕳️',
        garbage: '🗑️',
        streetlight: '💡',
        water: '💧',
        sewage: '🚰',
        electricity: '⚡',
        road: '🚧',
        park: '🌳',
        noise: '📢',
        other: '📋',
    };
    return <span title={category}>{icons[category] || '📋'}</span>;
};

export const Skeleton = ({ className = '' }) => (
    <div className={`skeleton rounded-xl ${className}`}></div>
);

export const StatCard = ({ icon, label, value, color = 'primary', trend }) => {
    const colors = {
        primary: 'from-primary-500 to-primary-600',
        green: 'from-emerald-500 to-emerald-600',
        orange: 'from-orange-500 to-orange-600',
        purple: 'from-purple-500 to-purple-600',
        red: 'from-red-500 to-red-600',
        blue: 'from-blue-500 to-blue-600',
    };

    return (
        <div className="stat-card">
            <div className={`w-12 h-12 bg-gradient-to-br ${colors[color]} rounded-2xl flex items-center justify-center text-white text-2xl shrink-0 shadow-lg`}>
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{label}</p>
                <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{value}</p>
                {trend && <p className="text-xs text-emerald-500 font-medium">{trend}</p>}
            </div>
        </div>
    );
};

export const EmptyState = ({ icon = '📭', title = 'Nothing here yet', desc = '' }) => (
    <div className="text-center py-16 space-y-3">
        <div className="text-6xl">{icon}</div>
        <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300">{title}</h3>
        {desc && <p className="text-gray-500 dark:text-gray-400">{desc}</p>}
    </div>
);
