import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

const CATEGORIES = [
    { value: 'pothole', label: '🕳️ Pothole', desc: 'Damaged road surface' },
    { value: 'garbage', label: '🗑️ Garbage', desc: 'Waste disposal issues' },
    { value: 'streetlight', label: '💡 Streetlight', desc: 'Lighting problems' },
    { value: 'water', label: '💧 Water', desc: 'Water supply issues' },
    { value: 'sewage', label: '🚰 Sewage', desc: 'Drainage problems' },
    { value: 'electricity', label: '⚡ Electricity', desc: 'Power issues' },
    { value: 'road', label: '🚧 Road Damage', desc: 'Road infrastructure' },
    { value: 'park', label: '🌳 Park', desc: 'Public space issues' },
    { value: 'noise', label: '📢 Noise', desc: 'Noise complaints' },
    { value: 'other', label: '📋 Other', desc: 'Other issues' },
];

const SEVERITIES = [
    { value: 'low', label: '🟦 Low', desc: 'Minor inconvenience', color: 'border-sky-300 bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300' },
    { value: 'medium', label: '🟨 Medium', desc: 'Affects daily life', color: 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300' },
    { value: 'high', label: '🟧 High', desc: 'Urgent attention needed', color: 'border-orange-300 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300' },
    { value: 'critical', label: '🔴 Critical', desc: 'Immediate danger', color: 'border-red-300 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300' },
];

export default function ReportIssue() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [form, setForm] = useState({
        title: '', description: '', category: '', severity: 'medium',
        address: '', city: '', area: '', latitude: '', longitude: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [gettingLocation, setGettingLocation] = useState(false);
    const [step, setStep] = useState(1); // 1: category, 2: details, 3: location/photo

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image must be less than 5MB');
            return;
        }
        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
    };

    const getLocation = () => {
        if (!navigator.geolocation) {
            toast.error('Geolocation not supported by your browser');
            return;
        }
        setGettingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setForm(prev => ({
                    ...prev,
                    latitude: pos.coords.latitude.toFixed(6),
                    longitude: pos.coords.longitude.toFixed(6)
                }));
                toast.success('📍 Location captured!');
                setGettingLocation(false);
            },
            (err) => {
                toast.error('Could not get location: ' + err.message);
                setGettingLocation(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.category) return toast.error('Please select a category');
        if (!form.title.trim()) return toast.error('Please enter a title');
        if (!form.description.trim()) return toast.error('Please enter a description');

        setLoading(true);
        try {
            const formData = new FormData();
            Object.entries(form).forEach(([key, value]) => {
                if (value) formData.append(key, value);
            });
            if (imageFile) formData.append('image', imageFile);

            const { data } = await api.post('/issues/report', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success('🎉 Issue reported! You earned 10 points!', { duration: 5000 });
            navigate('/citizen/complaints');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to report issue');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Report an Issue 📢</h1>
                <p className="text-gray-500 dark:text-gray-400">Help improve your city by reporting civic issues. Earn <strong className="text-primary-600">10 points</strong> per report!</p>
            </div>

            {/* Progress steps */}
            <div className="flex items-center gap-2 mb-8">
                {['Category', 'Details', 'Location & Photo'].map((s, i) => (
                    <div key={i} className="flex items-center gap-2 flex-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step > i + 1 ? 'bg-emerald-500 text-white' : step === i + 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                            }`}>
                            {step > i + 1 ? '✓' : i + 1}
                        </div>
                        <span className={`text-sm font-medium hidden sm:block ${step === i + 1 ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400'}`}>{s}</span>
                        {i < 2 && <div className={`flex-1 h-0.5 mx-1 ${step > i + 1 ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-700'}`}></div>}
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit}>
                {/* Step 1: Category */}
                {step === 1 && (
                    <div className="card space-y-4 animate-slide-up">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Select Category</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat.value}
                                    type="button"
                                    onClick={() => setForm({ ...form, category: cat.value })}
                                    className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 hover:shadow-md ${form.category === cat.value
                                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 shadow-md'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                                        }`}
                                >
                                    <div className="text-2xl mb-1">{cat.label.split(' ')[0]}</div>
                                    <div className={`font-semibold text-sm ${form.category === cat.value ? 'text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>
                                        {cat.label.split(' ').slice(1).join(' ')}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-0.5">{cat.desc}</div>
                                </button>
                            ))}
                        </div>
                        <button
                            type="button"
                            disabled={!form.category}
                            onClick={() => setStep(2)}
                            className="btn-primary w-full mt-4"
                        >
                            Next: Add Details →
                        </button>
                    </div>
                )}

                {/* Step 2: Details */}
                {step === 2 && (
                    <div className="card space-y-5 animate-slide-up">
                        <div className="flex items-center gap-3">
                            <button type="button" onClick={() => setStep(1)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">←</button>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Issue Details</h2>
                        </div>

                        <div>
                            <label className="label">Issue Title *</label>
                            <input
                                id="issue-title"
                                type="text"
                                name="title"
                                className="input-field"
                                placeholder="e.g., Large pothole on Main Street near Signal"
                                value={form.title}
                                onChange={handleChange}
                                required
                                maxLength={200}
                            />
                        </div>

                        <div>
                            <label className="label">Description *</label>
                            <textarea
                                id="issue-description"
                                name="description"
                                className="input-field resize-none"
                                rows={4}
                                placeholder="Describe the issue in detail: How severe is it? How long has it been there? Any safety risk?"
                                value={form.description}
                                onChange={handleChange}
                                required
                                maxLength={2000}
                            />
                            <p className="text-xs text-gray-400 mt-1 text-right">{form.description.length}/2000</p>
                        </div>

                        <div>
                            <label className="label">Severity Level *</label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {SEVERITIES.map(sev => (
                                    <button
                                        key={sev.value}
                                        type="button"
                                        onClick={() => setForm({ ...form, severity: sev.value })}
                                        className={`p-3 rounded-xl border-2 text-center transition-all duration-200 ${form.severity === sev.value ? sev.color + ' border-opacity-80' : 'border-gray-200 dark:border-gray-700'
                                            }`}
                                    >
                                        <div className="font-bold text-sm">{sev.label}</div>
                                        <div className="text-xs text-gray-500 mt-0.5 hidden sm:block">{sev.desc}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button type="button" onClick={() => setStep(3)} className="btn-primary w-full">
                            Next: Location & Photo →
                        </button>
                    </div>
                )}

                {/* Step 3: Location & Photo */}
                {step === 3 && (
                    <div className="card space-y-5 animate-slide-up">
                        <div className="flex items-center gap-3">
                            <button type="button" onClick={() => setStep(2)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">←</button>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Location & Photo</h2>
                        </div>

                        {/* GPS */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="label mb-0">GPS Location</label>
                                <button
                                    type="button"
                                    onClick={getLocation}
                                    disabled={gettingLocation}
                                    className="flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 font-semibold hover:underline"
                                    id="get-location-btn"
                                >
                                    {gettingLocation ? (
                                        <><div className="w-3 h-3 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div> Getting...</>
                                    ) : '📍 Auto-detect'}
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <input id="issue-lat" type="text" name="latitude" className="input-field" placeholder="Latitude" value={form.latitude} onChange={handleChange} readOnly />
                                <input id="issue-lng" type="text" name="longitude" className="input-field" placeholder="Longitude" value={form.longitude} onChange={handleChange} readOnly />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="label">City</label>
                                <input id="issue-city" type="text" name="city" className="input-field" placeholder="Mumbai" value={form.city} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="label">Area</label>
                                <input id="issue-area" type="text" name="area" className="input-field" placeholder="Andheri East" value={form.area} onChange={handleChange} />
                            </div>
                        </div>

                        <div>
                            <label className="label">Full Address</label>
                            <input id="issue-address" type="text" name="address" className="input-field" placeholder="Lane 5, Near School, Ward 15" value={form.address} onChange={handleChange} />
                        </div>

                        {/* Image upload */}
                        <div>
                            <label className="label">Upload Photo <span className="text-xs font-normal text-gray-400">(required, max 5MB)</span></label>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className={`border-2 border-dashed rounded-2xl p-6 cursor-pointer transition-all duration-200 text-center ${imagePreview
                                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                        : 'border-gray-200 dark:border-gray-700 hover:border-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                                    }`}
                            >
                                {imagePreview ? (
                                    <div className="space-y-2">
                                        <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded-xl object-cover" />
                                        <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">✓ Image selected — click to change</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <div className="text-4xl">📷</div>
                                        <p className="font-semibold text-gray-600 dark:text-gray-300">Click to upload photo</p>
                                        <p className="text-sm text-gray-400">JPEG, PNG, GIF up to 5MB</p>
                                    </div>
                                )}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    id="issue-image"
                                />
                            </div>
                        </div>

                        {/* Summary card */}
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 text-sm space-y-2">
                            <p className="font-semibold text-gray-700 dark:text-gray-300">📋 Summary</p>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                <span className="text-gray-500">Category:</span>
                                <span className="font-medium dark:text-gray-300 capitalize">{form.category || '—'}</span>
                                <span className="text-gray-500">Severity:</span>
                                <span className="font-medium dark:text-gray-300 capitalize">{form.severity}</span>
                                <span className="text-gray-500">Title:</span>
                                <span className="font-medium dark:text-gray-300 truncate">{form.title || '—'}</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !imageFile}
                            className="btn-primary w-full text-lg py-3"
                            id="submit-issue-btn"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Submitting...
                                </span>
                            ) : '🚀 Submit Report (+10 pts)'}
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
}
