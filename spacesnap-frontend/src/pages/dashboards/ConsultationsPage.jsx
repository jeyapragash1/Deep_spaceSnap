// src/pages/dashboards/ConsultationsPage.jsx

import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { Link } from 'react-router-dom';
import { Loader2, MessageSquare, Calendar, ChevronsRight } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const baseClasses = "px-3 py-1 text-xs font-bold rounded-full";
  const statusClasses = {
    Pending: "bg-yellow-100 text-yellow-800",
    Accepted: "bg-blue-100 text-blue-800",
    Completed: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
  };
  return <span className={`${baseClasses} ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>{status}</span>;
};

const ConsultationsPage = () => {
    const [consultations, setConsultations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConsultations = async () => {
            try {
                const res = await api.get('/consultations/my-consultations');
                setConsultations(res.data);
            } catch (error) {
                console.error("Failed to fetch consultations:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchConsultations();
    }, []);

    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-blue-600" size={48} />
        </div>
      );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">My Consultations</h1>
                <Link 
                    to="/user/designers" 
                    className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
                >
                    Book a New Designer
                </Link>
            </div>

            {consultations.length === 0 ? (
                <div className="bg-white p-12 rounded-lg shadow-md text-center border">
                    <MessageSquare className="text-5xl text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700">No Consultation History</h3>
                    <p className="text-gray-500 mt-2">
                        Your past and upcoming consultations with designers will appear here.
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-md border overflow-hidden">
                  <ul className="divide-y divide-gray-200">
                    {consultations.map(con => (
                      <li key={con._id}>
                        {/* --- THIS IS THE FIX: Each item is a link to the detail page --- */}
                        <Link to={`/user/consultations/${con._id}`} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-4">
                            <img src={con.designer.avatar} alt={con.designer.name} className="w-12 h-12 rounded-full" />
                            <div>
                              <p className="font-bold text-gray-800">{con.designer.name}</p>
                              <p className="text-sm text-gray-600">
                                Subject: {con.subject}
                              </p>
                              <p className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                                <Calendar size={12}/> Requested on: {new Date(con.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <StatusBadge status={con.status} />
                            <ChevronsRight className="text-gray-400" />
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
            )}
        </div>
    );
};

export default ConsultationsPage;