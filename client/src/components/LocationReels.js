import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LocationReels = () => {
    const [videos, setVideos] = useState([]);
    const [locationId, setLocationId] = useState('');

    const fetchVideos = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/location-media', {
                params: { locationId },
            });
            setVideos(response.data);
        } catch (error) {
            console.error('Error fetching videos:', error.message);
        }
    };

    useEffect(() => {
        if (locationId) {
            fetchVideos();
        }
    }, [locationId]);

    return (
        <div className="p-6">
            <input
                type="text"
                className="border rounded p-2 w-full mb-4"
                placeholder="Enter Location ID"
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
            />
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={fetchVideos}
            >
                Fetch Videos
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {videos.map((video) => (
                    <div key={video.id} className="bg-gray-100 p-4 rounded">
                        <video
                            src={video.media_url}
                            controls
                            className="w-full rounded"
                        />
                        <p className="mt-2 text-sm">{video.caption || 'No caption'}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LocationReels;
