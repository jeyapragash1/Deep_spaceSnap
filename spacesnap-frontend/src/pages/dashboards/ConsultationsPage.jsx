// src/pages/dashboards/ConsultationsPage.jsx
import React from 'react';
import { FaComments } from 'react-icons/fa';

const ConsultationsPage = () => {
    // This page will fetch and display consultation history from the backend.
    return (
        <div>
            <h1 className="text-3xl font-bold text-neutral-dark mb-6">My Consultations</h1>
            <div className="bg-white p-12 rounded-lg shadow-md text-center">
                <FaComments className="text-5xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-neutral-dark">No Consultation History</h3>
                <p className="text-gray-500 mt-2">
                    Your past and upcoming consultations with designers will appear here.
                </p>
            </div>
        </div>
    );
};

export default ConsultationsPage;