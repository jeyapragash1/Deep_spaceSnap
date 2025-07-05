// src/pages/dashboards/admin/ContentModeration.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';

const ContentModeration = () => {
    const [designs, setDesigns] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const fetchDesigns = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/designs');
            setDesigns(res.data);
        } catch (err) { console.error(err); } 
        finally { setLoading(false); }
    };
    useEffect(() => { fetchDesigns(); }, []);

    const handleDelete = async (designId) => {
        if (window.confirm('Delete this design permanently?')) {
            try {
                await axios.delete(`http://localhost:5000/api/admin/designs/${designId}`);
                fetchDesigns();
            } catch (err) { alert('Failed to delete design.'); }
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Content Moderation (Saved Designs)</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <table className="w-full text-left">
                    <thead><tr className="border-b"><th className="p-4">Preview</th><th className="p-4">Design Name</th><th className="p-4">Created By</th><th className="p-4 text-center">Actions</th></tr></thead>
                    <tbody>
                        {loading ? <tr><td colSpan="4" className="p-8 text-center">Loading...</td></tr> :
                            designs.map(design => (
                                <tr key={design._id} className="border-b">
                                    <td className="p-2"><img src={design.thumbnail} alt="thumbnail" className="w-24 h-16 object-cover rounded" /></td>
                                    <td className="p-4">{design.name}</td>
                                    <td className="p-4 text-gray-600">{design.user?.name || 'N/A'}</td>
                                    <td className="p-4 text-center"><button onClick={() => handleDelete(design._id)} className="text-red-500"><FaTrash /></button></td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default ContentModeration;