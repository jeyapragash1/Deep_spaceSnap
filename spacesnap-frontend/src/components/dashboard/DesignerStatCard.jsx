// src/components/dashboard/DesignerStatCard.jsx
import React from 'react';

const DesignerStatCard = ({ title, value, icon, change, color = 'bg-white' }) => {
    return (
        <div className={`p-4 rounded-lg shadow-md flex items-center gap-4 ${color}`}>
            {icon && icon}
            <div>
                <p className="text-sm">{title}</p>
                <p className="text-2xl font-bold">{value}</p>
                {change && <p className="text-xs text-green-500">{change} increase compare to last week</p>}
            </div>
        </div>
    );
};
export default DesignerStatCard;