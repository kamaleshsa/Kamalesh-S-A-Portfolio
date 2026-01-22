'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
import { useState } from 'react';

export function ProjectModal({ 
  isOpen, 
  onClose, 
  project 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  project: { title: string; link: string } | null;
}) {
  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 bg-neutral-900 rounded-2xl z-50 overflow-hidden border border-white/10 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/50">
              <h3 className="text-lg font-semibold text-white">{project.title}</h3>
              <div className="flex gap-2">
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                  title="Open in new tab"
                >
                  <ExternalLink size={20} />
                </a>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            {/* Iframe */}
            <div className="flex-1 relative">
              <iframe
                src={project.link}
                className="absolute inset-0 w-full h-full"
                title={project.title}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
