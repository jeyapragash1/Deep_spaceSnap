// src/pages/admin/ContentModerationPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminDashboardLayout from '../../components/layout/AdminDashboardLayout';

const ContentModerationPage = () => {
    const [content, setContent] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchContent = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('spaceSnapToken');
            const res = await axios.get('http://localhost:5000/api/admin/content/pending', {
                headers: { 'x-auth-token': token }
            });
            setContent(res.data);
        } catch (err) { console.error(err); } 
        finally { setLoading(false); }
    };

    useEffect(() => {
        fetchContent();
    }, []);

    // Placeholder actions
    const handleApprove = (id) => alert(`Approving content ${id}`);
    const handleReject = (id) => alert(`Rejecting content ${id}`);

    return (
        <AdminDashboardLayout>
             <div>
                <h1 className="text-3xl font-bold text-neutral-dark mb-6">Content Moderation</h1>
                <div className="bg-white p-6 rounded-lg shadow-md">
                {loading ? <p>Loading content...</p> : content.map(item => (
                    <div key={item._id} className="flex justify-between items-center p-4 border-b">
                        <div>
                            <p className="font-semibold">{item.type}</p>
                            <p className="text-sm text-gray-500">by {item.author}</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => handleApprove(item._id)} className="bg-green-500 text-white text-xs px-3 py-1 rounded-full">Approve</button>
                            <button onClick={() => handleReject(item._id)} className="bg-red-500 text-white text-xs px-3 py-1 rounded-full">Reject</button>
                        </div>
                    </div>
                ))}
                </div>
            </div>
        </AdminDashboardLayout>
    );
};

export default ContentModerationPage;