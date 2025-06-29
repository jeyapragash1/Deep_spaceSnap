// src/pages/ContactUsPage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

// We need our reusable components
import MainLayout from '../components/layout/MainLayout';
import Card from '../components/ui/Card'; 

// This is the Contact Form Section from your code.
// We are placing it inside this file to keep it simple and avoid more import errors.
const ContactForm = () => {
    // For now, this is a placeholder. You can add the full form logic later.
    return (
        <div className="bg-neutral-light p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold text-neutral-dark mb-4 text-center">Send a Message</h3>
            <p className="text-center text-gray-600">Form will go here.</p>
        </div>
    );
};


const ContactUsPage = () => {
  return (
    // Every page component will be wrapped in our MainLayout
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-primary-teal text-center mb-10">
          Contact Us
        </h1>

        <section className="mb-12 max-w-4xl mx-auto text-center">
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            We'd love to hear from you! Whether you have a question about features, pricing, or anything else, our team is ready to answer all your questions.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="flex flex-col items-center p-6">
              <FaEnvelope className="text-accent-gold text-4xl mb-3" />
              <h3 className="text-xl font-semibold text-neutral-dark mb-2">Email Us</h3>
              <p className="text-gray-700">info@spacesnap.com</p>
              <a href="mailto:info@spacesnap.com" className="text-primary-teal hover:underline mt-2">Send an Email</a>
            </Card>
            <Card className="flex flex-col items-center p-6">
              <FaPhone className="text-accent-gold text-4xl mb-3" />
              <h3 className="text-xl font-semibold text-neutral-dark mb-2">Call Us</h3>
              <p className="text-gray-700">+94 77 123 4567</p>
              <p className="text-gray-600 text-sm mt-1">Mon-Fri, 9am-5pm LKT</p>
            </Card>
            <Card className="flex flex-col items-center p-6">
              <FaMapMarkerAlt className="text-accent-gold text-4xl mb-3" />
              <h3 className="text-xl font-semibold text-neutral-dark mb-2">Our Office</h3>
              <p className="text-gray-700">Uva Wellassa University</p>
              <p className="text-gray-600 text-sm">Badulla, Sri Lanka</p>
            </Card>
          </div>
        </section>

        <section className="max-w-3xl mx-auto">
          {/* We use the simple form component defined above */}
          <ContactForm />
        </section>
      </motion.div>
    </MainLayout>
  );
};

export default ContactUsPage;