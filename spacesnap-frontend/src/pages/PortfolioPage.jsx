// src/pages/PortfolioPage.jsx

import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { portfolioItems, portfolioCategories } from '../data/portfolioData';

// --- Reusable Filter Button Component ---
const FilterButton = ({ category, activeCategory, setActiveCategory }) => (
    <button
        onClick={() => setActiveCategory(category)}
        className={`px-6 py-2 text-sm font-semibold rounded-full transition-colors duration-300
            ${activeCategory === category 
                ? 'bg-primary-teal text-white shadow-md' 
                : 'bg-white text-gray-700 hover:bg-gray-200'
            }`
        }
    >
        {category}
    </button>
);


// --- Main Portfolio Page Component ---
const PortfolioPage = () => {
    const [activeCategory, setActiveCategory] = useState('All');
    const [filteredItems, setFilteredItems] = useState(portfolioItems);

    useEffect(() => {
        if (activeCategory === 'All') {
            setFilteredItems(portfolioItems);
        } else {
            const newItems = portfolioItems.filter(item => 
                item.style.toLowerCase() === activeCategory.toLowerCase()
            );
            setFilteredItems(newItems);
        }
    }, [activeCategory]);

    return (
        <MainLayout>
            <div className="bg-white">
                <div className="container mx-auto px-4 py-16">

                    {/* --- HEADER SECTION --- */}
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
                            Get inspired by a curated collection of stunning interior designs from our professional community. Find a style that speaks to you.
                        </p>
                    </motion.div>

                    {/* --- FILTER BUTTONS --- */}
                    <div className="flex justify-center flex-wrap gap-4 mb-12">
                        {portfolioCategories.map(category => (
                            <FilterButton 
                                key={category}
                                category={category}
                                activeCategory={activeCategory}
                                setActiveCategory={setActiveCategory}
                            />
                        ))}
                    </div>

                    {/* --- PORTFOLIO GRID --- */}
                    {/* The motion.div with layout prop enables the smooth re-shuffling animation */}
                    <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* AnimatePresence handles the enter/exit animations of grid items */}
                        <AnimatePresence>
                            {filteredItems.map(item => (
                                <motion.div
                                    layout
                                    key={item.id}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.4 }}
                                    className="bg-white rounded-lg shadow-lg overflow-hidden group cursor-pointer"
                                >
                                    <div className="relative overflow-hidden">
                                        <img src={item.image} alt={item.title} className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-300" />
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
                    
                    {/* --- LOAD MORE BUTTON --- */}
                    <div className="text-center mt-16">
                        <button className="bg-neutral-dark text-white font-bold px-8 py-3 rounded-lg hover:bg-neutral-700 transition-colors">
                            Load More Designs
                        </button>
                    </div>

                </div>
            </div>
        </MainLayout>
    );
};

export default PortfolioPage;