// src/components/ui/TabSwitcher.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const TabSwitcher = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          {tabs.map((tab, index) => (
            <button
              key={tab.title}
              onClick={() => setActiveTab(index)}
              className={`${
                activeTab === index
                  ? 'border-primary-teal text-primary-teal'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
            >
              {tab.title}
            </button>
          ))}
        </nav>
      </div>
      <div className="mt-4">
        {tabs.map((tab, index) => (
          <div key={tab.title} className={activeTab === index ? 'block' : 'hidden'}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {tab.content}
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabSwitcher;