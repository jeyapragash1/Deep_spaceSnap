// src/pages/dashboards/MyDesignsPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// --- A New Modal for Uploading Designs ---
const UploadDesignModal = ({ isOpen, onClose, onUploadSuccess }) => {
    const [formData, setFormData] = useState({ name: '', description: '', style: 'modern' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // We simulate the upload by just providing a random image URL for the thumbnail
            const body = { 
                ...formData, 
                thumbnail: `https://source.unsplash.com/random/400x300?${formData.style},interior` 
            };
            await axios.post('http://localhost:5000/api/designs', body);
            onUploadSuccess(); // Tell the parent page to refresh the design list
            onClose(); // Close the modal
        } catch (err) {
            alert('Failed to upload design.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-lg relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">×</button>
                <h2 className="text-2xl font-bold mb-6">Upload New Design Template</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Design Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="w-full p-2 border rounded mb-4"/>
                    <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required className="w-full p-2 border rounded mb-4" rows="3"></textarea>
                    <select value={formData.style} onChange={e => setFormData({...formData, style: e.target.value})} className="w-full p-2 border rounded mb-6">
                        <option value="modern">Modern</option>
                        <option value="bohemian">Bohemian</option>
                        <option value="minimalist">Minimalist</option>
                    </select>
                    <div className="text-right">
                        <button type="submit" disabled={loading} className="bg-primary-teal text-white font-bold py-2 px-6 rounded-lg">{loading ? 'Uploading...' : 'Upload'}</button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};


// --- The Main MyDesignsPage Component ---
const MyDesignsPage = () => {
    const [designs, setDesigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchDesigns = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:5000/api/designs/my-designs');
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
        if (window.confirm('Are you sure you want to delete this design?')) {
            try {
                await axios.delete(`http://localhost:5000/api/designs/${id}`);
                fetchDesigns(); // Re-fetch to update the list
            } catch (err) {
                alert('Failed to delete design.');
            }
        }
    };

    return (
        <div>
            <UploadDesignModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onUploadSuccess={fetchDesigns} />

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-neutral-dark">My Design Templates</h1>
                <button onClick={() => setIsModalOpen(true)} className="bg-primary-teal text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-opacity-90">
                    <FaPlus /> Upload New Design
                </button>
            </div>
            
            {loading ? <p>Loading designs...</p> : 
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <AnimatePresence>
                        {designs.map(design => (
                            <motion.div
                                layout
                                key={design._id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="bg-white rounded-lg shadow-md overflow-hidden group"
                            >
                                <img src={design.thumbnail} alt={design.name} className="w-full h-48 object-cover" />
                                <div className="p-4">
                                    <h3 className="font-semibold truncate">{design.name}</h3>
                                    <div className="flex justify-end gap-2 mt-4">
                                        <button className="text-gray-400 hover:text-blue-500"><FaEdit /></button>
                                        <button onClick={() => handleDelete(design._id)} className="text-gray-400 hover:text-red-500"><FaTrash /></button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            }
        </div>
    );
};

export default MyDesignsPage;