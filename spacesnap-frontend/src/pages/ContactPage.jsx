// src/pages/ContactPage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import ContactUsSection from '../features/landing/ContactUsSection';
import Card from '../components/ui/Card';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const ContactPage = () => {
  return (
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
          We'd love to hear from you! ...
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="flex flex-col items-center p-6">
            <FaEnvelope className="text-accent-gold text-4xl mb-3" />
            <h3 className="text-xl font-semibold text-neutral-dark mb-2">Email Us</h3>
            <a href="mailto:info@spacesnap.com" className="text-primary-teal hover:underline mt-2">info@spacesnap.com</a>
          </Card>
          {/* ... other cards ... */}
        </div>
      </section>
      <section className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-semibold text-neutral-dark text-center mb-8">Send Us a Message</h2>
        <ContactUsSection />
      </section>
    </motion.div>
  );
};
export default ContactPage;