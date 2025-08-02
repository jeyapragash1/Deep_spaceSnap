// src/pages/dashboards/admin/ContentModeration.jsx

import React, { useState, useEffect } from 'react';
import api from '../../../api/axiosConfig';
import { Loader2, Trash, ImageOff } from 'lucide-react';

const ContentModeration = () => {
    const [designs, setDesigns] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDesigns = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/designs');
            setDesigns(res.data);
        } catch (err) {
            console.error("Failed to fetch designs:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDesigns();
    }, []);

    const handleDelete = async (designId) => {
        if (window.confirm('Are you sure you want to permanently delete this design?')) {
            try {
                await api.delete(`/admin/designs/${designId}`);
                setDesigns(prev => prev.filter(design => design._id !== designId));
            } catch (err) {
                alert('Failed to delete design.');
                console.error(err);
            }
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-blue-600" size={48} /></div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Content Moderation</h1>
            <div className="bg-white rounded-lg shadow-md border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-4 font-semibold text-gray-600">Preview</th>
                                <th className="p-4 font-semibold text-gray-600">Design Name</th>
                                <th className="p-4 font-semibold text-gray-600">Created By</th>
                                <th className="p-4 font-semibold text-gray-600">Date</th>
                                <th className="p-4 font-semibold text-gray-600 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {designs.map(design => (
                                <tr key={design._id}>
                                    <td className="p-2">
                                        {design.thumbnail ? (
                                            <img src={design.thumbnail} alt={design.name} className="w-24 h-16 object-cover rounded-md" />
                                        ) : (
                                            <div className="w-24 h-16 bg-gray-100 flex items-center justify-center rounded-md">
                                                <ImageOff className="text-gray-400" />
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-4 font-medium text-gray-800">{design.name}</td>
                                    <td className="p-4 text-gray-600">{design.user?.name || 'N/A'}</td>
                                    <td className="p-4 text-gray-600">{new Date(design.createdAt).toLocaleDateString()}</td>
                                    <td className="p-4 text-center">
                                         <button 
                                            onClick={() => handleDelete(design._id)}
                                            className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition-colors"
                                            title="Delete Design"
                                        >
                                            <Trash size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ContentModeration;