// src/pages/dashboards/MyContentPage.jsx

import React, { useState, useEffect } from 'react'; // <-- THIS LINE IS NOW CORRECT
import api from '../../api/axiosConfig';
import { Link } from 'react-router-dom';
import { Plus, Trash, Edit, ImageOff, Loader2 } from 'lucide-react';

// A single card representing a saved design template
const ContentCard = ({ design, onDelete }) => (
    <div className="bg-white rounded-xl shadow border overflow-hidden group transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <Link to={`/visualizer/${design._id}`} className="block">
            {design.thumbnail ? (
                <img 
                    src={design.thumbnail} 
                    alt={design.name} 
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" 
                />
            ) : (
                <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
                    <ImageOff className="text-gray-400" size={40} />
                </div>
            )}
        </Link>
        <div className="p-4">
            <h3 className="font-bold text-gray-800 truncate">{design.name}</h3>
            <p className="text-sm text-gray-500">
                Created on: {new Date(design.createdAt).toLocaleDateString()}
            </p>
            <div className="flex justify-end gap-2 mt-4">
                <Link 
                    to={`/visualizer/${design._id}`}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    title="Edit Content"
                >
                    <Edit size={16} />
                </Link>
                <button 
                    onClick={() => onDelete(design._id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title="Delete Content"
                >
                    <Trash size={16} />
                </button>
            </div>
        </div>
    </div>
);

const MyContentPage = () => {
    const [content, setContent] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchContent = async () => {
        try {
            // Use the specific route for fetching a designer's creations
            const res = await api.get('/designs/designer/my-creations');
            setContent(res.data);
        } catch (err) {
            console.error("Failed to fetch designer content:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContent();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to permanently delete this content?')) {
            try {
                setContent(prevContent => prevContent.filter(c => c._id !== id));
                // We need to add a DELETE route to our designs.js file
                await api.delete(`/designs/${id}`);
            } catch (err) {
                alert('Failed to delete content. Refreshing the page.');
                fetchContent();
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-blue-600" size={48} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">My Content</h1>
                <Link 
                    to="/visualizer" 
                    className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
                >
                    <Plus size={20} /> Create New Content
                </Link>
            </div>
            
            {content.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {content.map(item => (
                        <ContentCard key={item._id} design={item} onDelete={handleDelete} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-xl shadow border">
                    <h2 className="text-2xl font-semibold text-gray-700">Your portfolio is empty.</h2>
                    <p className="text-gray-500 mt-2 mb-6">Create and save designs to build your content library.</p>
                    <Link 
                        to="/visualizer"
                        className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors mx-auto w-fit"
                    >
                        <Plus /> Create First Content
                    </Link>
                </div>
            )}
        </div>
    );
};

export default MyContentPage;