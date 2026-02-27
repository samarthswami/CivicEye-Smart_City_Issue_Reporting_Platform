import { useEffect, useState, lazy, Suspense } from 'react';
import api from '../../services/api';

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = lazy(() => import('react-leaflet').then(m => ({ default: m.MapContainer })));
const TileLayer = lazy(() => import('react-leaflet').then(m => ({ default: m.TileLayer })));
const Marker = lazy(() => import('react-leaflet').then(m => ({ default: m.Marker })));
const Popup = lazy(() => import('react-leaflet').then(m => ({ default: m.Popup })));

const severityColors = {
    low: '#0ea5e9',
    medium: '#eab308',
    high: '#f97316',
    critical: '#ef4444',
};

export default function GovMap() {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const { data } = await api.get('/issues/all?limit=100');
                setIssues(data.issues.filter(i => i.location?.latitude && i.location?.longitude));
            } catch (err) { }
            finally { setLoading(false); }
        };
        fetch();
    }, []);

    const geoIssues = issues.filter(i => i.location?.latitude);

    // Calculate center
    const center = geoIssues.length > 0
        ? [geoIssues[0].location.latitude, geoIssues[0].location.longitude]
        : [19.0760, 72.8777]; // Mumbai default

    return (
        <div className="space-y-4 animate-fade-in">
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">Map View 🗺️</h1>
                <p className="text-gray-500 dark:text-gray-400">{geoIssues.length} issues with GPS location</p>
            </div>

            {/* Legend */}
            <div className="card flex items-center gap-6 flex-wrap">
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Severity:</p>
                {Object.entries(severityColors).map(([s, c]) => (
                    <div key={s} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ background: c }}></div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{s}</span>
                    </div>
                ))}
            </div>

            {/* Map */}
            <div className="card p-0 overflow-hidden" style={{ height: '500px' }}>
                {loading ? (
                    <div className="h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                        <div className="text-center space-y-3">
                            <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                            <p className="text-gray-500">Loading map...</p>
                        </div>
                    </div>
                ) : (
                    <Suspense fallback={
                        <div className="h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                            <p className="text-gray-500">Loading map component...</p>
                        </div>
                    }>
                        <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%', borderRadius: '1rem' }}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {geoIssues.map(issue => (
                                <Marker key={issue._id} position={[issue.location.latitude, issue.location.longitude]}>
                                    <Popup>
                                        <div className="text-sm max-w-48">
                                            <p className="font-bold">{issue.title}</p>
                                            <p className="text-gray-600 mt-1">{issue.description?.slice(0, 80)}...</p>
                                            <div className="flex gap-2 mt-2">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold`} style={{ background: severityColors[issue.severity], color: 'white' }}>
                                                    {issue.severity}
                                                </span>
                                                <span className="bg-gray-100 px-2 py-0.5 rounded-full text-xs">{issue.status}</span>
                                            </div>
                                            {issue.reportedBy && <p className="text-gray-500 mt-1 text-xs">By: {issue.reportedBy.fullName}</p>}
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </Suspense>
                )}
            </div>

            {/* Issues list below map */}
            {!loading && geoIssues.length === 0 && (
                <div className="card text-center py-12">
                    <div className="text-5xl mb-3">🗺️</div>
                    <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300">No GPS data yet</h3>
                    <p className="text-gray-500">Issues will appear here when citizens add GPS location</p>
                </div>
            )}
        </div>
    );
}
