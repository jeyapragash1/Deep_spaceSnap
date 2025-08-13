// spacesnap-frontend/src/pages/dashboards/admin/PortfolioManagement.jsx

import React, { useState, useEffect } from 'react';
import api from '../../../api/axiosConfig';
import { Loader2, Trash2, PlusCircle } from 'lucide-react';

const PortfolioManagement = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    
    const [newItem, setNewItem] = useState({
        title: '',
        designer: '',
        style: 'modern',
        description: '',
        details: '', // Comma-separated string
        image: null
    });

    const fetchItems = async () => {
        try {
            // --- THIS IS THE FIX ---
            // Removed the extra '/api' from the path
            const { data } = await api.get('/portfolio');
            setItems(data);
        } catch (err) {
            setError('Failed to fetch portfolio items.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewItem(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setNewItem(prev => ({ ...prev, image: e.target.files[0] }));
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                // --- THIS IS THE FIX ---
                await api.delete(`/portfolio/${id}`);
                setItems(items.filter(item => item._id !== id));
            } catch (err) {
                alert('Failed to delete item.');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        const formData = new FormData();
        Object.keys(newItem).forEach(key => {
            formData.append(key, newItem[key]);
        });

        try {
            // --- THIS IS THE FIX ---
            const { data } = await api.post('/portfolio', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setItems([data, ...items]);
            setNewItem({ title: '', designer: '', style: 'modern', description: '', details: '', image: null });
            e.target.reset();
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to add item.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading && items.length === 0) {
        return <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin" size={48} /></div>;
    }
    
    // Display error message if fetching fails
    if (error && items.length === 0) {
        return <p className="text-red-500 font-semibold">{error}</p>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Manage Portfolio</h1>
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Add New Portfolio Item</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input name="title" value={newItem.title} onChange={handleInputChange} placeholder="Title" required className="p-2 border rounded" />
                        <input name="designer" value={newItem.designer} onChange={handleInputChange} placeholder="Designer Name" required className="p-2 border rounded" />
                    </div>
                    <select name="style" value={newItem.style} onChange={handleInputChange} className="w-full p-2 border rounded">
                        <option value="modern">Modern</option>
                        <option value="bohemian">Bohemian</option>
                        <option value="minimalist">Minimalist</option>
                        <option value="industrial">Industrial</option>
                        <option value="rustic">Rustic</option>
                        <option value="scandinavian">Scandinavian</option>
                        <option value="eclectic">Eclectic</option>
                    </select>
                    <textarea name="description" value={newItem.description} onChange={handleInputChange} placeholder="Description" required className="w-full p-2 border rounded"></textarea>
                    <input name="details" value={newItem.details} onChange={handleInputChange} placeholder="Details (comma-separated, e.g., Oak Wood, LED)" required className="w-full p-2 border rounded" />
                    <input type="file" name="image" onChange={handleFileChange} required className="w-full p-2 border rounded" />
                    <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400 flex items-center gap-2">
                        {isSubmitting ? <Loader2 className="animate-spin" /> : <PlusCircle size={18} />}
                        {isSubmitting ? 'Adding...' : 'Add Item'}
                    </button>
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                </form>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Existing Items</h2>
                <div className="space-y-4">
                    {items.map(item => (
                        <div key={item._id} className="flex items-center justify-between p-3 border rounded">
                            <div className="flex items-center gap-4">
                                <img src={item.image.url} alt={item.title} className="w-16 h-16 object-cover rounded" />
                                <div>
                                    <p className="font-bold">{item.title}</p>
                                    <p className="text-sm text-gray-500">{item.designer} - <span className="capitalize">{item.style}</span></p>
                                </div>
                            </div>
                            <button onClick={() => handleDelete(item._id)} className="text-red-500 hover:text-red-700 p-2">
                                <Trash2 />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PortfolioManagement;