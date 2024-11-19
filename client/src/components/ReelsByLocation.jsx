import React, { useState } from 'react';
import axios from 'axios';

const ReelsByLocation = () => {
    const [locationName, setLocationName] = useState('');
    const [reels, setReels] = useState([]);
    const [error, setError] = useState('');

    const fetchReels = async () => {
        setError('');
        setReels([]);
        try {
            const response = await axios.get('http://localhost:5000/api/reels', {
                params: { locationName },
            });
            setReels(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Error fetching reels');
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Find Reels by Location</h1>
            <input
                type="text"
                className="border rounded p-2 w-full mb-4"
                placeholder="Enter Location Name"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
            />
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={fetchReels}
            >
                Fetch Reels
            </button>

            {error && <p className="text-red-500 mt-4">{error}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {reels.map((reel) => (
                    <div key={reel.id} className="bg-gray-100 p-4 rounded">
                        <video
                            src={reel.media_url}
                            controls
                            className="w-full rounded"
                        />
                        <p className="mt-2 text-sm">{reel.caption || 'No caption'}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReelsByLocation;
