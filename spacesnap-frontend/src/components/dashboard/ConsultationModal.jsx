// src/components/dashboard/ConsultationModal.jsx

import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { X, Loader2, Send } from 'lucide-react';

const ConsultationModal = ({ isOpen, onClose }) => {
  // State for the list of designers
  const [designers, setDesigners] = useState([]);
  const [isLoadingDesigners, setIsLoadingDesigners] = useState(true);
  
  // State for the form fields
  const [selectedDesigner, setSelectedDesigner] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  // State for UI feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch the list of designers when the modal opens
  useEffect(() => {
    if (isOpen) {
      // Reset state every time modal opens
      setError('');
      setSuccess('');
      setIsLoadingDesigners(true);

      const fetchDesigners = async () => {
        try {
          const res = await api.get('/users/designers');
          setDesigners(res.data);
        } catch (err) {
          setError('Could not load designer list. Please try again later.');
          console.error("Failed to fetch designers:", err);
        } finally {
          setIsLoadingDesigners(false);
        }
      };
      fetchDesigners();
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDesigner || !subject || !message) {
      setError('All fields are required.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        designerId: selectedDesigner,
        subject,
        message,
      };
      await api.post('/consultations', payload);
      setSuccess('Your consultation request has been sent successfully!');
      
      // Clear form after a short delay to show success message
      setTimeout(() => {
        setSelectedDesigner('');
        setSubject('');
        setMessage('');
        onClose(); // Close the modal on success
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to send request. Please try again.');
      console.error("Booking failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };


  // Don't render anything if the modal is not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg relative animate-fade-in-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>
        
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Book a Consultation</h2>
        
        {/* Error and Success Messages */}
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4">{error}</div>}
        {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md mb-4">{success}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="designer" className="block text-sm font-medium text-gray-700 mb-1">Select a Designer</label>
            <select
              id="designer"
              value={selectedDesigner}
              onChange={(e) => setSelectedDesigner(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoadingDesigners || isSubmitting}
            >
              <option value="">-- Choose a Designer --</option>
              {isLoadingDesigners ? (
                <option>Loading designers...</option>
              ) : (
                designers.map(designer => (
                  <option key={designer._id} value={designer._id}>
                    {designer.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Living Room Design Help"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
            <textarea
              id="message"
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe your design needs, what you're struggling with, etc."
              disabled={isSubmitting}
            ></textarea>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              disabled={isSubmitting || isLoadingDesigners || !designers.length}
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : <Send size={16} />}
              Send Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConsultationModal;