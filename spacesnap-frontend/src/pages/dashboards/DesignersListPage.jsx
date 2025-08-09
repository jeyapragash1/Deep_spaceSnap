// src/pages/dashboards/DesignersListPage.jsx

import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { Loader2, Calendar } from 'lucide-react';
import ConsultationModal from '../../components/dashboard/ConsultationModal';

const DesignerCard = ({ designer, onBook }) => {
  return (
    <div className="bg-white rounded-xl shadow border p-6 flex flex-col items-center text-center transition-all hover:shadow-lg hover:-translate-y-1">
      <img src={designer.avatar || `https://i.pravatar.cc/150?u=${designer._id}`} alt={designer.name} className="w-24 h-24 rounded-full mb-4 border-4 border-gray-200" />
      <h3 className="text-xl font-bold text-gray-800">{designer.name}</h3>
      <p className="text-sm text-blue-600 font-semibold mb-3">Interior Designer</p>
      <p className="text-gray-600 text-sm mb-6 flex-grow">
        {designer.bio || 'Specializing in modern and minimalist home designs. Let\'s create a space you love!'}
      </p>
      <button 
        onClick={() => onBook(designer)}
        className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
      >
        <Calendar size={16} /> Book Consultation
      </button>
    </div>
  );
};

const DesignersListPage = () => {
  const [designers, setDesigners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDesigner, setSelectedDesigner] = useState(null);

  useEffect(() => {
    const fetchDesigners = async () => {
      try {
        const res = await api.get('/users/designers');
        setDesigners(res.data);
      } catch (error) {
        console.error("Failed to fetch designers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDesigners();
  }, []);

  const handleOpenModal = (designer) => {
    setSelectedDesigner(designer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDesigner(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ConsultationModal isOpen={isModalOpen} onClose={handleCloseModal} preselectedDesigner={selectedDesigner} />
      <h1 className="text-3xl font-bold text-gray-800">Meet Our Designers</h1>
      <p className="text-gray-600">Find the perfect expert to help bring your vision to life.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {designers.map(designer => (
          <DesignerCard key={designer._id} designer={designer} onBook={handleOpenModal} />
        ))}
      </div>
    </div>
  );
};

export default DesignersListPage;