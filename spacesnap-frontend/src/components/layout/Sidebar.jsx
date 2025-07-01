// src/components/layout/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../../assets/images/logo.jpg';
import { FaTachometerAlt, FaUsers, FaPalette, FaBriefcase, FaCog, FaSignOutAlt, FaUser, FaHistory, FaGem, FaRocket } from 'react-icons/fa';

// The links shown in the sidebar will depend on the user's role.
// We pass the user's role as a prop to this component.
const Sidebar = ({ userRole }) => {
    
    const baseLinkClasses = "flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-primary-teal hover:text-white transition-colors";
    const activeLinkClasses = "bg-primary-teal text-white";

    const getLinksByRole = () => {
        switch (userRole) {
            case 'admin':
                return [
                    { path: "/admin-dashboard", icon: <FaTachometerAlt />, name: "Dashboard" },
                    { path: "/admin/users", icon: <FaUsers />, name: "User Management" },
                    { path: "/admin/designers", icon: <FaBriefcase />, name: "Designer Approvals" },
                    { path: "/admin/content", icon: <FaPalette />, name: "Content Moderation" },
                    { path: "/admin/settings", icon: <FaCog />, name: "System Settings" },
                ];
            case 'designer':
                return [
                    { path: "/designer-dashboard", icon: <FaTachometerAlt />, name: "Dashboard" },
                    { path: "/designer/profile", icon: <FaUser />, name: "My Profile" },
                    { path: "/designer/templates", icon: <FaPalette />, name: "My Templates" },
                    { path: "/designer/consultations", icon: <FaBriefcase />, name: "Consultations" },
                ];
            default: // For 'premium' and 'registered' users
                return [
                    { path: "/dashboard", icon: <FaUser />, name: "My Profile" },
                    { path: "/dashboard/designs", icon: <FaPalette />, name: "Saved Designs" },
                    { path: "/dashboard/history", icon: <FaHistory />, name: "Consultation History" },
                    { path: "/dashboard/billing", icon: <FaGem />, name: "Billing" },
                    userRole !== 'premium' && { path: "/upgrade", icon: <FaRocket />, name: "Upgrade" },
                ].filter(Boolean); // Filter out false values like the upgrade link for premium users
        }
    };

    const links = getLinksByRole();

    return (
        <aside className="w-64 bg-white flex-shrink-0 p-4 border-r border-gray-200 flex flex-col">
            <div className="flex items-center gap-2 mb-8 px-4">
                <img src={logo} alt="SpaceSnap Logo" className="h-10" />
                <span className="text-2xl font-bold text-neutral-dark">SpaceSnap</span>
            </div>
            <nav className="flex-grow">
                <ul>
                    {links.map(link => (
                        <li key={link.path} className="mb-2">
                            <NavLink to={link.path} className={({isActive}) => `${baseLinkClasses} ${isActive ? activeLinkClasses : ''}`}>
                                {link.icon}
                                <span className="font-medium">{link.name}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="mt-auto">
                <NavLink to="/logout" className={baseLinkClasses}>
                    <FaSignOutAlt />
                    <span className="font-medium">Logout</span>
                </NavLink>
            </div>
        </aside>
    );
};

export default Sidebar;