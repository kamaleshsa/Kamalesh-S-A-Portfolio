'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface ClientProjectCardProps {
  project: {
    title: string;
    description: string;
    stack: string[];
  };
  idx: number;
}

export function ClientProjectCard({ project, idx }: ClientProjectCardProps) {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true });

  return (
    <motion.div
      ref={cardRef}
      className="group relative bg-[#0a0a0a] border border-white/10 hover:border-white/20 transition-all duration-500 rounded-none overflow-hidden cursor-pointer"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: idx * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
    >
      {/* Hover Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Animated border gradient */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-xl" />
      </div>

      {/* Top Bar */}
      <div className="relative p-4 md:p-5 lg:p-6 border-b border-white/5 flex items-center justify-between">
        <span className="font-mono text-[10px] md:text-xs text-blue-400 tracking-widest">
          0{idx + 1}
        </span>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
          <span className="font-mono text-[9px] md:text-[10px] text-gray-500 uppercase">
            Deployed / V1.0
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="relative p-6 md:p-6 lg:p-8 h-auto md:h-[260px] lg:h-[280px] flex flex-col justify-between gap-6 md:gap-4 lg:gap-0">
        <div>
          <h4 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4 group-hover:text-blue-400 transition-colors duration-300">
            {project.title}
          </h4>
          <p className="text-gray-400 font-light leading-relaxed text-sm">
            {project.description}
          </p>
        </div>

        <div className="pt-6 md:pt-6 lg:pt-8 border-t border-white/5 mt-auto">
          <span className="text-[10px] font-mono text-gray-600 uppercase block mb-3">
            Technology Stack
          </span>
          <div className="flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="text-[10px] md:text-xs text-gray-300 bg-white/5 px-2 py-1 hover:bg-white/10 transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20"></div>
    </motion.div>
  );
}
