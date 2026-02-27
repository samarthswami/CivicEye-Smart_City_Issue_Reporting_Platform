import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { EmptyState } from '../ui/UIComponents';

const MEDAL_COLORS = ['🥇', '🥈', '🥉'];

export default function Leaderboard() {
    const { user } = useAuth();
    const [leaders, setLeaders] = useState([]);
    const [currentRank, setCurrentRank] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const { data } = await api.get('/leaderboard');
                setLeaders(data.leaderboard);
                setCurrentRank(data.currentUserRank);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    const levelColors = {
        Newcomer: 'text-gray-500 bg-gray-100',
        Active: 'text-blue-600 bg-blue-100',
        Advanced: 'text-purple-600 bg-purple-100',
        Expert: 'text-amber-600 bg-amber-100',
        Champion: 'text-rose-600 bg-rose-100',
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">🏆 Leaderboard</h1>
                <p className="text-gray-500 dark:text-gray-400">Top civic champions in your city</p>
            </div>

            {/* Current user rank card */}
            {currentRank && (
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white">
                    <p className="text-amber-100 text-sm font-medium mb-1">Your Current Ranking</p>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl font-black">
                                #{currentRank}
                            </div>
                            <div>
                                <p className="font-bold text-xl">{user?.fullName}</p>
                                <p className="text-amber-100">{user?.points || 0} points • {user?.level}</p>
                            </div>
                        </div>
                        <div className="text-5xl">🏆</div>
                    </div>
                </div>
            )}

            {/* Top 3 podium */}
            {!loading && leaders.length >= 3 && (
                <div className="grid grid-cols-3 gap-3">
                    {[1, 0, 2].map((idx) => {
                        const leader = leaders[idx];
                        const positions = [1, 0, 2];
                        const ranks = [2, 1, 3];
                        const heights = ['h-28', 'h-36', 'h-24'];
                        const i = positions.indexOf(idx);
                        return (
                            <div key={leader._id} className="flex flex-col items-center">
                                <div className={`w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-sm mb-2 ${idx === 0 ? 'ring-4 ring-amber-400' : ''}`}>
                                    {leader.fullName.charAt(0)}
                                </div>
                                <p className="text-xs font-bold text-gray-700 dark:text-gray-300 text-center truncate w-full">{leader.fullName}</p>
                                <p className="text-xs text-gray-500">{leader.points} pts</p>
                                <div className={`w-full ${heights[i]} bg-gradient-to-t ${idx === 0 ? 'from-amber-400 to-amber-300' : idx === 1 ? 'from-gray-300 to-gray-200' : 'from-orange-300 to-orange-200'} dark:from-gray-700 dark:to-gray-600 rounded-t-xl mt-2 flex items-start justify-center pt-2`}>
                                    <span className="text-xl font-black text-white/80">{MEDAL_COLORS[ranks[i] - 1]}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Full list */}
            <div className="card">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">All Rankings</h2>
                {loading ? (
                    <div className="space-y-3">
                        {Array(8).fill(0).map((_, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl animate-pulse">
                                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                                    <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/4"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : leaders.length === 0 ? (
                    <EmptyState icon="🏆" title="No rankings yet" desc="Be the first to report issues and earn points!" />
                ) : (
                    <div className="space-y-2">
                        {leaders.map((leader, idx) => (
                            <div
                                key={leader._id}
                                className={`flex items-center gap-4 p-3 rounded-xl transition-colors ${leader._id === user?._id
                                        ? 'bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800'
                                        : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                                    }`}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${idx < 3 ? 'text-2xl' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                    }`}>
                                    {idx < 3 ? MEDAL_COLORS[idx] : idx + 1}
                                </div>

                                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0">
                                    {leader.fullName.charAt(0)}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className={`font-semibold truncate ${leader._id === user?._id ? 'text-primary-700 dark:text-primary-300' : 'text-gray-900 dark:text-white'}`}>
                                            {leader.fullName} {leader._id === user?._id && '(You)'}
                                        </p>
                                        {leader.level && (
                                            <span className={`badge ${levelColors[leader.level] || ''} text-xs`}>{leader.level}</span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{leader.city || 'Citizen'}</p>
                                </div>

                                <div className="text-right shrink-0">
                                    <p className="font-bold text-gray-900 dark:text-white">{leader.points}</p>
                                    <p className="text-xs text-gray-400">points</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
