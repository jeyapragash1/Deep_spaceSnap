// src/components/dashboard/StatCard.jsx
import React from 'react';

const StatCard = ({ title, value, icon, color }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <p className="text-3xl font-bold text-neutral-dark">{value}</p>
            </div>
            <div className={`p-4 rounded-full ${color}`}>
                {icon}
            </div>
        </div>
    );
};

export default StatCard;