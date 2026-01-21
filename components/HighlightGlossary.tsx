import React from 'react';
import { GLOSSARY } from '../constants';

interface HighlightGlossaryProps {
  text: string;
  className?: string; // Permit custom styling inheritance
}

const HighlightGlossary: React.FC<HighlightGlossaryProps> = ({ text, className = "" }) => {
  // 1. Sort glossary keys by length (descending) to match "EDR" before "ED" if exists, and "SIEM" before "SI".
  const sortedTerms = Object.keys(GLOSSARY).sort((a, b) => b.length - a.length);

  // 2. Create a regex safely
  // We use word boundaries \b to avoid matching "SOC" in "Association"
  const pattern = new RegExp(`\\b(${sortedTerms.join('|')})\\b`, 'gi');

  // 3. Split parts
  const parts = text.split(pattern);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        // Check if this part is a glossary term (case insensitive check)
        const termKey = sortedTerms.find(term => term.toLowerCase() === part.toLowerCase());
        
        if (termKey) {
          const definition = GLOSSARY[termKey];
          return (
            <span key={index} className="group relative inline-block cursor-help border-b-2 border-dotted border-indigo-400 dark:border-indigo-500">
              <span className="font-semibold text-indigo-700 dark:text-indigo-300">{part}</span>
              
              {/* Tooltip Content */}
              <span className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl z-50 pointer-events-none text-center">
                 <strong className="block text-indigo-300 mb-1 border-b border-gray-700 pb-1">{termKey}</strong>
                 {definition}
                 {/* Little arrow */}
                 <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></span>
              </span>
            </span>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
};

export default HighlightGlossary;
