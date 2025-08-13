// src/pages/ContactPage.jsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';

import MainLayout from '../components/layout/MainLayout';
import Button from '../components/common/Button';
import contactImage from '../assets/images/19.jpg'; // in case you want to use this later for visual content

const ContactPage = () => {
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('Sending...');
    setTimeout(() => {
      setStatus('Your message has been sent successfully!');
      e.target.reset();
    }, 2000);
  };

  return (
   
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-neutral-light"
      >
        <div className="container mx-auto px-4 py-20">
          {/* --- Heading --- */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-extrabold text-neutral-dark mb-4">Contact Us</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Have a question, a suggestion, or a project in mind? We'd love to hear from you.
            </p>
          </div>

          {/* --- Grid Content --- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* --- Contact Info --- */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-4 space-y-6"
            >
              {/* Email */}
              <div className="bg-white p-6 rounded-lg shadow-md flex items-start gap-4">
                <FaEnvelope className="text-primary-teal text-3xl mt-1" />
                <div>
                  <h3 className="text-xl font-semibold">Email</h3>
                  <p className="text-gray-600">Our inbox is always open.</p>
                  <a href="mailto:contact@spacesnap.com" className="text-primary-teal hover:underline font-medium">
                    contact@spacesnap.com
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="bg-white p-6 rounded-lg shadow-md flex items-start gap-4">
                <FaPhone className="text-primary-teal text-3xl mt-1" />
                <div>
                  <h3 className="text-xl font-semibold">Phone</h3>
                  <p className="text-gray-600">Give us a call.</p>
                  <p className="font-medium text-neutral-dark">+94 77 123 4567</p>
                </div>
              </div>

              {/* Location */}
              <div className="bg-white p-6 rounded-lg shadow-md flex items-start gap-4">
                <FaMapMarkerAlt className="text-primary-teal text-3xl mt-1" />
                <div>
                  <h3 className="text-xl font-semibold">Office</h3>
                  <p className="text-gray-600">Find us here.</p>
                  <p className="font-medium text-neutral-dark">Clombo 02, Sri Lanka</p>
                </div>
              </div>
            </motion.div>

            {/* --- Contact Form --- */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="lg:col-span-8 bg-white p-8 rounded-lg shadow-xl"
            >
              <h2 className="text-3xl font-bold text-neutral-dark mb-6">Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Subject"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                />
                <textarea
                  placeholder="Your Message"
                  rows="6"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                ></textarea>

                <Button type="submit" className="w-full py-3 text-lg flex items-center justify-center gap-2">
                  <FaPaperPlane />
                  {status === 'Sending...' ? 'Sending...' : 'Send Message'}
                </Button>

                {status && status !== 'Sending...' && (
                  <p className="text-center text-green-600 mt-4 font-semibold">{status}</p>
                )}
              </form>
            </motion.div>
          </div>
        </div>
      </motion.div>
   
  );
};

export default ContactPage;
