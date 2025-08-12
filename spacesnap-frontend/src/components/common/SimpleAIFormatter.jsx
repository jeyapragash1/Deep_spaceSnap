import React from 'react';

const SimpleAIFormatter = ({ response }) => {
  if (!response) return null;

  // Function to format text with proper bold and bullet handling
  const formatText = (text) => {
    // First, handle the ** formatting by converting to HTML bold
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>');
    
    // Split into lines for processing
    const lines = formatted.split('\n');
    const processedLines = [];
    
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (!trimmed) return;
      
      // Handle bullet points (various formats)
      if (trimmed.startsWith('•') || trimmed.startsWith('- ') || trimmed.match(/^[•·-]\s+/)) {
        const bulletText = trimmed.replace(/^[•·-]\s*/, '');
        processedLines.push(
          <div key={`bullet-${index}`} className="flex items-start mb-3">
            <span className="text-teal-600 mr-3 mt-1 flex-shrink-0">•</span>
            <div 
              className="text-gray-700 leading-relaxed" 
              dangerouslySetInnerHTML={{ __html: bulletText }}
            />
          </div>
        );
      } else {
        // Regular paragraph
        processedLines.push(
          <div 
            key={`para-${index}`}
            className="text-gray-700 leading-relaxed mb-4" 
            dangerouslySetInnerHTML={{ __html: trimmed }}
          />
        );
      }
    });
    
    return processedLines;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-teal-50 to-blue-50 px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <span className="mr-2">✨</span>
          Your Personalized Design Recommendations
        </h3>
      </div>
      
      <div className="p-8">
        <div className="prose prose-lg max-w-none">
          {formatText(response)}
        </div>
      </div>
    </div>
  );
};

export default SimpleAIFormatter;