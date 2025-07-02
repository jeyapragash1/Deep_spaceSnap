// src/components/dashboard/StatCard.jsx
import React from 'react';

const StatCard = ({ title, value, icon, change, color, textColor }) => {
    return (
        <div className={`p-4 rounded-lg shadow-sm ${color}`}>
            <p className="text-sm text-gray-600">{title}</p>
            <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
            <div className="flex items-center text-xs mt-1">
                <span className={`flex items-center gap-1 ${textColor}`}>
                    {icon} {change}
                </span>
                <span className="text-gray-500 ml-2">vs Last Month</span>
            </div>
        </div>
    );
};

export default StatCard;