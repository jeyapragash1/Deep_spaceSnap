// src/pages/dashboards/MyDesignsPage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Plus, Trash, Edit, ImageOff, Loader } from 'lucide-react';

// A single card representing a saved design
const DesignCard = ({ design, onDelete }) => (
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
                    title="Edit Design"
                >
                    <Edit size={16} />
                </Link>
                <button 
                    onClick={() => onDelete(design._id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title="Delete Design"
                >
                    <Trash size={16} />
                </button>
            </div>
        </div>
    </div>
);

const MyDesignsPage = () => {
    const [designs, setDesigns] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDesigns = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/designs/mydesigns');
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

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to permanently delete this design?')) {
            try {
                setDesigns(prevDesigns => prevDesigns.filter(d => d._id !== id));
                await axios.delete(`http://localhost:5000/api/designs/${id}`);
            } catch (err) {
                alert('Failed to delete design. Refreshing the page.');
                fetchDesigns();
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader className="animate-spin text-blue-600" size={48} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">My Designs</h1>
                <Link 
                    to="/visualizer" 
                    className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
                >
                    <Plus size={20} /> Create New Design
                </Link>
            </div>
            
            {designs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {designs.map(design => (
                        <DesignCard key={design._id} design={design} onDelete={handleDelete} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-xl shadow border">
                    <h2 className="text-2xl font-semibold text-gray-700">Your design canvas is empty.</h2>
                    <p className="text-gray-500 mt-2 mb-6">Let's create something beautiful!</p>
                    <Link 
                        to="/visualizer"
                        className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors mx-auto w-fit"
                    >
                        <Plus /> Start First Design
                    </Link>
                </div>
            )}
        </div>
    );
};

export default MyDesignsPage;