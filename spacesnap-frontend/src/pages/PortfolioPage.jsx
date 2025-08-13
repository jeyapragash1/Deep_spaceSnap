// spacesnap-frontend/src/pages/PortfolioPage.jsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axiosConfig';
import PortfolioModal from '../components/ui/PortfolioModal';
import { Loader2 } from 'lucide-react';

const portfolioCategories = [
    'All', 'Modern', 'Bohemian', 'Minimalist', 'Industrial', 'Rustic', 'Scandinavian', 'Eclectic'
];

const FilterButton = ({ category, activeCategory, setActiveCategory }) => (
    <button
        onClick={() => setActiveCategory(category)}
        className={`px-6 py-2 text-sm font-semibold rounded-full transition-colors duration-300
            ${activeCategory === category 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-white text-gray-700 hover:bg-gray-200 border'
            }`
        }
    >
        {category}
    </button>
);

const PortfolioPage = () => {
    const [activeCategory, setActiveCategory] = useState('All');
    const [allItems, setAllItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPortfolioItems = async () => {
            try {
                // --- THIS IS THE FIX ---
                // Removed the extra '/api' from the path
                const { data } = await api.get('/portfolio');
                setAllItems(data);
                setFilteredItems(data);
            } catch (err) {
                setError('Could not load portfolio items. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchPortfolioItems();
    }, []);

    useEffect(() => {
        if (activeCategory === 'All') {
            setFilteredItems(allItems);
        } else {
            setFilteredItems(allItems.filter(item => item.style === activeCategory.toLowerCase()));
        }
    }, [activeCategory, allItems]);

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen"><Loader2 className="animate-spin text-blue-600" size={48} /></div>;
    }

    if (error) {
        return <div className="text-center text-red-500 min-h-screen flex items-center justify-center">{error}</div>;
    }
    
    return (
        <>
            <PortfolioModal item={selectedItem} onClose={() => setSelectedItem(null)} />
            <div className="bg-white">
                <div className="container mx-auto px-4 py-16">
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h1 className="text-4xl md:text-6xl font-extrabold text-neutral-dark mb-4">
                            Designer Portfolios
                        </h1>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Get inspired by a curated collection of stunning interior designs from our professional community.
                        </p>
                    </motion.div>
                    <div className="flex justify-center flex-wrap gap-4 mb-12">
                        {portfolioCategories.map(category => (
                            <FilterButton key={category} category={category} activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
                        ))}
                    </div>
                    <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        <AnimatePresence>
                            {filteredItems.map(item => (
                                <motion.div
                                    layout
                                    key={item._id}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.4 }}
                                    onClick={() => setSelectedItem(item)}
                                    className="bg-white rounded-lg shadow-lg overflow-hidden group cursor-pointer"
                                >
                                    <div className="relative overflow-hidden">
                                        <img src={item.image.url} alt={item.title} className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-300" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
                                        <div className="absolute bottom-0 left-0 p-4 text-white">
                                            <h3 className="text-xl font-bold">{item.title}</h3>
                                            <p className="text-sm opacity-90">by {item.designer}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default PortfolioPage;