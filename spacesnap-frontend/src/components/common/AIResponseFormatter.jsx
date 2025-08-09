import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaChevronUp, FaPalette, FaHome, FaLightbulb, FaCog, FaList, FaStar, FaTools } from 'react-icons/fa';

const AIResponseFormatter = ({ response }) => {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  // Simple formatter that just handles the most common formatting issues
  const simpleFormat = (text) => {
    if (!text) return '';
    
    // Replace **text** with bold HTML (more comprehensive)
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>');
    
    // Split by paragraphs and handle bullet points
    const paragraphs = formatted.split('\n\n');
    
    return paragraphs.map((paragraph, pIndex) => {
      const lines = paragraph.split('\n');
      
      return (
        <div key={pIndex} className="mb-6">
          {lines.map((line, lIndex) => {
            const trimmedLine = line.trim();
            if (!trimmedLine) return null;
            
            // Handle bullet points
            if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-')) {
              const bulletText = trimmedLine.replace(/^[•-]\s*/, '');
              return (
                <div key={lIndex} className="flex items-start mb-2 ml-4">
                  <span className="text-teal-600 mr-3 mt-1 text-lg">•</span>
                  <div className="text-gray-700 leading-relaxed" 
                       dangerouslySetInnerHTML={{ __html: bulletText }} />
                </div>
              );
            }
            
            // Regular paragraph
            return (
              <div key={lIndex} className="text-gray-700 leading-relaxed mb-3" 
                   dangerouslySetInnerHTML={{ __html: trimmedLine }} />
            );
          }).filter(Boolean)}
        </div>
      );
    });
  };

  // If the response doesn't have clear sections, just format it simply
  if (!response.includes('**') || response.split('**').length < 4) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
        <div className="prose prose-lg max-w-none">
          {simpleFormat(response)}
        </div>
      </div>
    );
  }

  // Parse the AI response into structured sections
  const parseResponse = (text) => {
    const sections = [];
    const lines = text.split('\n');
    let currentSection = null;
    let currentContent = [];

    const getSectionIcon = (title) => {
      const titleLower = title.toLowerCase();
      if (titleLower.includes('style') || titleLower.includes('analysis')) return FaStar;
      if (titleLower.includes('color') || titleLower.includes('palette')) return FaPalette;
      if (titleLower.includes('material') || titleLower.includes('texture')) return FaCog;
      if (titleLower.includes('furniture') || titleLower.includes('layout')) return FaHome;
      if (titleLower.includes('room') || titleLower.includes('application')) return FaHome;
      if (titleLower.includes('styling') || titleLower.includes('accessories')) return FaStar;
      if (titleLower.includes('implementation') || titleLower.includes('guide')) return FaTools;
      if (titleLower.includes('tips')) return FaLightbulb;
      return FaList;
    };

    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      // Check for multiple section header formats
      const sectionMatch = trimmedLine.match(/^\*\*([^*]+):\*\*(.*)$/) || 
                           trimmedLine.match(/^([A-Z][^:]+):\s*(.*)$/) ||
                           trimmedLine.match(/^\*\*([^*]+)\*\*(.*)$/);
      
      if (sectionMatch) {
        // Save previous section if exists
        if (currentSection) {
          sections.push({
            ...currentSection,
            content: currentContent.join('\n').trim()
          });
        }
        
        // Start new section
        const sectionTitle = sectionMatch[1].trim();
        const afterColon = sectionMatch[2] ? sectionMatch[2].trim() : '';
        
        currentSection = {
          title: sectionTitle,
          icon: getSectionIcon(sectionTitle),
          key: sectionTitle.toLowerCase().replace(/\s+/g, '-')
        };
        currentContent = afterColon ? [afterColon] : [];
      } else if (currentSection && trimmedLine) {
        currentContent.push(trimmedLine);
      } else if (!currentSection && trimmedLine) {
        // Handle content before any sections
        if (!sections.length) {
          sections.push({
            title: 'Overview',
            icon: FaStar,
            key: 'overview',
            content: ''
          });
          currentSection = sections[0];
        }
        currentContent.push(trimmedLine);
      }
    });

    // Add the last section
    if (currentSection) {
      sections.push({
        ...currentSection,
        content: currentContent.join('\n').trim()
      });
    }

    return sections;
  };

  // Format content with better styling
  const formatContent = (content) => {
    // Split content into paragraphs and lists
    const parts = content.split('\n').filter(line => line.trim());
    
    return parts.map((part, index) => {
      let trimmedPart = part.trim();
      
      // Handle bullet points (various formats)
      if (trimmedPart.startsWith('- ') || trimmedPart.startsWith('• ') || trimmedPart.startsWith('•')) {
        // Remove the bullet marker
        let bulletText = trimmedPart.replace(/^[-•]\s*/, '');
        
        // Handle bold text within bullet points
        bulletText = bulletText.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-800">$1</strong>');
        
        return (
          <div key={index} className="flex items-start mb-3 pl-4">
            <span className="text-teal-500 mr-3 mt-1 text-lg">•</span>
            <div className="text-gray-700 leading-relaxed flex-1" 
                 dangerouslySetInnerHTML={{ __html: bulletText }} />
          </div>
        );
      }
      
      // Handle bold text within paragraphs - multiple patterns
      let formattedText = trimmedPart
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-800">$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em class="italic text-gray-700">$1</em>');
      
      // Skip empty paragraphs
      if (!formattedText.trim()) return null;
      
      return (
        <div key={index} className="text-gray-700 leading-relaxed mb-4" 
           dangerouslySetInnerHTML={{ __html: formattedText }} />
      );
    }).filter(Boolean); // Remove null entries
  };

  const sections = parseResponse(response);

  return (
    <div className="space-y-4">
      {sections.map((section, index) => {
        const isExpanded = expandedSections[section.key] !== false; // Default to expanded
        const IconComponent = section.icon;
        
        return (
          <motion.div
            key={section.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
          >
            <button
              onClick={() => toggleSection(section.key)}
              className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-teal-50 to-blue-50 hover:from-teal-100 hover:to-blue-100 transition-all duration-200"
            >
              <div className="flex items-center space-x-3">
                <IconComponent className="text-teal-600 text-lg" />
                <h3 className="text-lg font-semibold text-gray-800 text-left">{section.title}</h3>
              </div>
              {isExpanded ? (
                <FaChevronUp className="text-gray-500" />
              ) : (
                <FaChevronDown className="text-gray-500" />
              )}
            </button>
            
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 py-4 bg-white">
                    {formatContent(section.content)}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
};

export default AIResponseFormatter;