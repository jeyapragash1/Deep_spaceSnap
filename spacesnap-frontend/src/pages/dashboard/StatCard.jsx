// src/components/dashboard/StatCard.jsx
import React from 'react';

const StatCard = ({ title, value, icon, color }) => {
    return (
        <div className={`p-6 rounded-lg shadow-md flex items-center justify-between ${color}`}>
            <div>
                <p className="text-lg text-white font-semibold">{title}</p>
                <p className="text-3xl text-white font-bold">{value}</p>
            </div>
            <div className="text-4xl opacity-70">
                {icon}
            </div>
        </div>
    );
};

export default StatCard;