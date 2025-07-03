// src/components/dashboard/ConsultationModal.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const ConsultationModal = ({ isOpen, onClose }) => {
    const [designers, setDesigners] = useState([]);
    const [formData, setFormData] = useState({
        designerId: '',
        subject: '',
        message: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    // Fetch the list of designers when the modal opens
    useEffect(() => {
        // Only fetch if the modal is open and the designer list is empty
        if (isOpen && designers.length === 0) {
            const fetchDesigners = async () => {
                try {
                    const res = await axios.get('http://localhost:5000/api/designers');
                    setDesigners(res.data);
                } catch (err) {
                    setError('Could not load designer list. Please try again later.');
                    console.error("Failed to fetch designers:", err);
                }
            };
            fetchDesigners();
        }
    }, [isOpen, designers.length]);

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            await axios.post('http://localhost:5000/api/consultations', formData);
            setSuccess('Your consultation request has been sent successfully!');
            // Clear form and close modal after a delay
            setTimeout(() => {
                onClose(); // Call the parent's function to close the modal
                // Reset state for next time
                setFormData({ designerId: '', subject: '', message: '' });
                setSuccess('');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to send request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Use AnimatePresence to handle the exit animation
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 50 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-lg relative"
                    >
                        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 text-2xl">×</button>
                        <h2 className="text-2xl font-bold text-neutral-dark mb-6">Book a Consultation</h2>
                        
                        {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</p>}
                        {success && <p className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm">{success}</p>}
                        
                        <form onSubmit={onSubmit}>
                            <div className="mb-4">
                                <label htmlFor="designerId" className="block text-sm font-medium text-gray-700 mb-1">Select a Designer</label>
                                <select id="designerId" name="designerId" value={formData.designerId} onChange={onChange} required className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-teal focus:border-primary-teal">
                                    <option value="" disabled>-- Choose a Designer --</option>
                                    {designers.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                <input type="text" id="subject" name="subject" value={formData.subject} onChange={onChange} required placeholder="e.g., Living Room Design Help" className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-teal focus:border-primary-teal" />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
                                <textarea id="message" name="message" rows="4" value={formData.message} onChange={onChange} required placeholder="Describe your design needs, what you're struggling with, etc." className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-teal focus:border-primary-teal"></textarea>
                            </div>
                            <div className="text-right">
                                <button type="button" onClick={onClose} className="mr-4 text-gray-600 font-semibold hover:text-gray-900">Cancel</button>
                                <button type="submit" disabled={loading} className="bg-primary-teal text-white font-bold py-2 px-6 rounded-lg hover:bg-opacity-90 disabled:bg-gray-400">
                                    {loading ? 'Sending...' : 'Send Request'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ConsultationModal;