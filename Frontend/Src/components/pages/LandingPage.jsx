import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

const features = [
    { icon: '📍', title: 'GPS Issue Reporting', desc: 'Report civic issues with exact GPS location and photo evidence instantly.' },
    { icon: '🗺️', title: 'Interactive Map', desc: 'Visualize all reported issues on an interactive city map in real-time.' },
    { icon: '🏆', title: 'Gamification', desc: 'Earn points, unlock badges, and climb the leaderboard as an active citizen.' },
    { icon: '📊', title: 'Live Analytics', desc: 'Track resolution rates, category breakdowns, and city-wide statistics.' },
    { icon: '🔐', title: 'Role-Based Access', desc: 'Citizen, Government Official, and Admin roles with appropriate permissions.' },
    { icon: '🌓', title: 'Dark Mode', desc: 'Beautiful dark and light themes with smooth transitions for comfort.' },
];

const categories = [
    { icon: '🕳️', name: 'Potholes' },
    { icon: '🗑️', name: 'Garbage' },
    { icon: '💡', name: 'Streetlights' },
    { icon: '💧', name: 'Water Issues' },
    { icon: '🚧', name: 'Road Damage' },
    { icon: '⚡', name: 'Electricity' },
    { icon: '🌳', name: 'Parks' },
    { icon: '📢', name: 'Noise' },
];

export default function LandingPage() {
    const { isDark, toggleTheme } = useTheme();

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
                    <div className="flex items-center gap-2">
                        <img src="/img/logo.png" alt="CivicEye Logo" className="h-8 w-8 object-contain" />
                        <span className="font-bold text-xl gradient-text">CivicEye</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">Features</a>
                        <a href="#how-it-works" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">How It Works</a>
                        <a href="#categories" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">Categories</a>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={toggleTheme} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            {isDark ? '☀️' : '🌙'}
                        </button>
                        <Link to="/login" className="text-gray-700 dark:text-gray-300 font-semibold hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Login</Link>
                        <Link to="/register/citizen" className="btn-primary text-sm py-2 px-4">Get Started</Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-purple-900 to-gray-900 dark:from-gray-950 dark:via-primary-950 dark:to-gray-950"></div>
                {/* Animated blobs */}
                <div className="absolute top-20 -left-20 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
                <div className="absolute bottom-20 -right-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center animate-fade-in">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                        <span className="text-white/80 text-sm font-medium">Smart City Platform • Real-time Issue Tracking</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                        Transform Your City <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 via-purple-300 to-pink-300">
                            One Report at a Time
                        </span>
                    </h1>

                    <p className="text-xl text-white/70 max-w-3xl mx-auto mb-10 leading-relaxed">
                        CivicEye bridges the gap between citizens and municipal authorities. Report issues, track progress,
                        and earn rewards for making your city better. Join thousands of active citizens today!
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link to="/register/citizen" className="inline-flex items-center gap-2 bg-white text-primary-700 font-bold py-4 px-8 rounded-2xl hover:bg-primary-50 transition-all duration-200 shadow-2xl hover:shadow-primary-500/25 hover:-translate-y-1 text-lg">
                            🚀 Start Reporting
                        </Link>
                        <Link to="/login" className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold py-4 px-8 rounded-2xl hover:bg-white/20 transition-all duration-200 text-lg">
                            🔐 Sign In
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                        {[
                            { value: '10K+', label: 'Issues Reported' },
                            { value: '85%', label: 'Resolution Rate' },
                            { value: '500+', label: 'Active Citizens' },
                            { value: '24h', label: 'Avg. Response' },
                        ].map((stat) => (
                            <div key={stat.label} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
                                <div className="text-3xl font-extrabold text-white">{stat.value}</div>
                                <div className="text-white/60 text-sm font-medium mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-gray-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
                            Powerful <span className="gradient-text">Features</span>
                        </h2>
                        <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                            Everything you need to make your city smarter and more responsive.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, idx) => (
                            <div key={idx} className="card-hover group">
                                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">{feature.icon}</div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-24 bg-white dark:bg-gray-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
                            How It <span className="gradient-text">Works</span>
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { step: '01', icon: '📸', title: 'Report an Issue', desc: 'Take a photo, add location, describe the problem, and submit your complaint in seconds.' },
                            { step: '02', icon: '🔔', title: 'Government Notified', desc: 'The relevant department is instantly notified and assigns the issue for resolution.' },
                            { step: '03', icon: '✅', title: 'Issue Resolved', desc: 'Track real-time status updates and earn points when your issue gets resolved.' },
                        ].map((step) => (
                            <div key={step.step} className="text-center relative">
                                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary-500/30 text-3xl">
                                    {step.icon}
                                </div>
                                <div className="absolute top-0 right-8 text-7xl font-black text-gray-100 dark:text-gray-800 -z-10 leading-none">{step.step}</div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{step.title}</h3>
                                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Issue Categories */}
            <section id="categories" className="py-24 bg-gradient-to-br from-primary-50 to-purple-50 dark:from-gray-900 dark:to-gray-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
                            Issue <span className="gradient-text">Categories</span>
                        </h2>
                        <p className="text-xl text-gray-500 dark:text-gray-400">Report any type of civic problem in your area</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {categories.map((cat) => (
                            <div key={cat.name} className="card-hover text-center cursor-pointer group">
                                <div className="text-4xl mb-3 group-hover:scale-125 transition-transform duration-200">{cat.icon}</div>
                                <p className="font-semibold text-gray-700 dark:text-gray-300">{cat.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gradient-to-br from-primary-600 via-primary-700 to-purple-800">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
                        Ready to Make Your City Better?
                    </h2>
                    <p className="text-xl text-primary-100 mb-10">
                        Join thousands of citizens who are actively improving their communities.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link to="/register/citizen" className="bg-white text-primary-700 font-bold py-4 px-10 rounded-2xl hover:bg-primary-50 transition-all duration-200 shadow-2xl text-lg">
                            Join as Citizen 🏃
                        </Link>
                        <Link to="/login" className="bg-white/20 backdrop-blur-sm border border-white/30 text-white font-bold py-4 px-10 rounded-2xl hover:bg-white/30 transition-all duration-200 text-lg">
                            Government Portal 🏛️
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 dark:bg-gray-950 text-gray-400 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <img src="/img/logo.png" alt="CivicEye Logo" className="h-8 w-8 object-contain" />
                        <span className="font-bold text-xl text-white">CivicEye</span>
                    </div>
                    <p className="text-sm">Built with ❤️ for Smart Cities • Made with React, Node.js & MongoDB</p>
                    <p className="text-xs mt-2 text-gray-600">© 2026 CivicEye. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
