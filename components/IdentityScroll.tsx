'use client';

import { useScroll, useTransform, useMotionValueEvent, type MotionValue } from 'framer-motion';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useImagePreloader } from '@/hooks/useImagePreloader';
// cn unused removed for now
import { motion } from 'framer-motion';

export default function IdentityScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { images, isLoaded, loadedCount, total } = useImagePreloader();
  
  // Track scroll progress of the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Map scroll (0-1) to frame index (0-240)
  const frameIndex = useTransform(scrollYProgress, [0, 1], [1, 240]);
  
  const [currentFrame, setCurrentFrame] = useState(1);

  // Draw frame to canvas - wrapped in useCallback
  const drawImage = useCallback((index: number) => {
    const canvas = canvasRef.current;
    // Memoize context if performance needed, but getContext is cheap usually
    const ctx = canvas?.getContext('2d');
    const img = images[index];

    if (!canvas || !ctx || !img || !img.complete || img.naturalWidth === 0) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const imgRatio = img.width / img.height;
    const canvasRatio = canvasWidth / canvasHeight;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (imgRatio > canvasRatio) {
      drawHeight = canvasHeight;
      drawWidth = drawHeight * imgRatio;
      offsetY = 0;
      offsetX = (canvasWidth - drawWidth) / 2;
    } else {
      drawWidth = canvasWidth;
      drawHeight = drawWidth / imgRatio;
      offsetX = 0;
      offsetY = (canvasHeight - drawHeight) / 2;
    }

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }, [images]);

  // Sync scroll to frame
  useMotionValueEvent(frameIndex, "change", (latest) => {
    const index = Math.round(latest);
    if (index !== currentFrame && index <= 240) {
      setCurrentFrame(index);
      if (isLoaded) {
          requestAnimationFrame(() => drawImage(index));
      }
    }
  });

  // Handle Resize
  useEffect(() => {
     const handleResize = () => {
         if (canvasRef.current) {
             canvasRef.current.width = window.innerWidth;
             canvasRef.current.height = window.innerHeight;
             // Redraw current
             drawImage(currentFrame);
         }
     };
     window.addEventListener('resize', handleResize);
     handleResize(); // Init
     return () => window.removeEventListener('resize', handleResize);
  }, [currentFrame, isLoaded, drawImage]);

  // Initial draw when loaded
  useEffect(() => {
      if (isLoaded) {
          drawImage(currentFrame);
      }
  }, [isLoaded, currentFrame, drawImage]);

  // Canvas styles for the smooth exit transition
  const canvasBlur = useTransform(scrollYProgress, [0.85, 1], ["blur(0px)", "blur(20px)"]);
  const canvasOpacity = useTransform(scrollYProgress, [0.9, 1], [1, 0]);

  return (
    <div ref={containerRef} className="relative z-10 h-[400vh]">
      {!isLoaded && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0a] text-white">
              <div className="font-mono text-xs tracking-widest opacity-50">
                  INITIALIZING SYSTEM... {Math.round((loadedCount / total) * 100)}%
              </div>
          </div>
      )}
      
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <motion.div 
            style={{ filter: canvasBlur, opacity: canvasOpacity }}
            className="absolute inset-0 w-full h-full"
        >
            <canvas 
                ref={canvasRef}
                className="absolute inset-0 h-full w-full object-cover"
            />
            {/* Cinematic Vignette to Hide Watermark & Add Depth */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_75%,#0a0a0a_100%)] pointer-events-none" />
            
            {/* Targeted Corner Mask for Watermark - ONLY Right Corner */}
            <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-[radial-gradient(circle_at_bottom_right,#0a0a0a_20%,transparent_70%)] pointer-events-none" />
        </motion.div>
        
        <OverlaySystem scrollProgress={scrollYProgress} />
      </div>
    </div>
  );
}

function OverlaySystem({ scrollProgress }: { scrollProgress: MotionValue<number> }) {

    // Opacity transforms for each section
    // 0%: Identity
    const opacity1 = useTransform(scrollProgress, [0, 0.1, 0.2], [1, 1, 0]);
    const y1 = useTransform(scrollProgress, [0, 0.2], [0, -50]);

    // 30%: Skills Breakdown
    const opacity2 = useTransform(scrollProgress, [0.2, 0.3, 0.4, 0.5], [0, 1, 1, 0]);
    const y2 = useTransform(scrollProgress, [0.2, 0.3, 0.5], [50, 0, -50]);

    // 60%: Experience
    const opacity3 = useTransform(scrollProgress, [0.5, 0.6, 0.7, 0.8], [0, 1, 1, 0]);
    const y3 = useTransform(scrollProgress, [0.5, 0.6, 0.8], [50, 0, -50]);

    // 90%: Reassembly
    // Modified to fade out at the very end (0.95 -> 1) for smooth transition
    const opacity4 = useTransform(scrollProgress, [0.8, 0.9, 0.95, 1], [0, 1, 1, 0]);
    const y4 = useTransform(scrollProgress, [0.8, 0.9], [50, 0]);

    return (
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-center">
            {/* STAGE 1: IDENTITY */}
            <motion.div 
                style={{ opacity: opacity1, y: y1 }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center mt-20 md:mt-60"
            >
                <div>
                  <h1 className="text-3xl md:text-[7rem] font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/50 mb-2 md:mb-6">
                    KAMALESH S A
                  </h1>
                   <div className="flex items-center justify-center gap-2 md:gap-4">
                      <div className="h-[1px] w-8 md:w-24 bg-gradient-to-r from-transparent to-white/50"></div>
                      <p className="text-xs md:text-xl text-gray-400 font-mono tracking-[0.2em] md:tracking-[0.3em] uppercase whitespace-nowrap">
                          Full Stack Developer
                      </p>
                      <div className="h-[1px] w-8 md:w-24 bg-gradient-to-l from-transparent to-white/50"></div>
                   </div>
                </div>
            </motion.div>

            {/* STAGE 2: SKILLS BREAKDOWN (Glass Card moved to RIGHT) */}
            <motion.div 
                style={{ opacity: opacity2, y: y2 }}
                className="absolute inset-0 flex items-center justify-center md:justify-end px-4 md:px-24"
            >
                <div className="w-full max-w-sm md:max-w-lg bg-black/10 md:bg-black/40 backdrop-blur-xl border border-white/10 p-6 md:p-10 rounded-3xl shadow-2xl md:text-right relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center justify-between md:justify-end gap-3 mb-6">
                            <span className="text-[10px] md:text-xs font-mono text-blue-400 uppercase tracking-widest border border-blue-500/30 px-2 py-1 rounded">Development Core</span>
                            <div className="relative">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <div className="absolute inset-0 w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                            </div>
                        </div>
                        
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 md:mb-8 leading-tight tracking-tight text-left md:text-right">
                            Engineering <br/> 
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                                Excellence.
                            </span>
                        </h2>
                        
                        <div className="grid grid-cols-2 gap-2 md:gap-3">
                            {['Clean Architecture', 'API Development', 'DB Optimization', 'Security First'].map((item) => (
                               <div key={item} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 md:px-4 md:py-3 text-[10px] md:text-xs text-gray-200 font-mono hover:bg-white/10 transition-colors text-center">
                                   {item}
                               </div> 
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* STAGE 3: EXPERIENCE (Glass Card moved to LEFT) */}
            <motion.div 
                style={{ opacity: opacity3, y: y3 }}
                className="absolute inset-0 flex items-center justify-center md:justify-start px-4 md:px-24"
            >
                 <div className="w-full max-w-sm md:max-w-lg bg-black/20 backdrop-blur-md border border-white/10 p-6 md:p-10 rounded-2xl shadow-2xl">
                    <div className="flex items-center justify-between md:justify-start gap-2 mb-6">
                         <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                            <span className="text-[10px] md:text-xs font-mono text-purple-400 uppercase tracking-widest">Tech Stack</span>
                         </div>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                        Full Stack <br/> <span className="text-gray-500">Mastery.</span>
                    </h2>
                     <div className="flex flex-wrap gap-2">
                        {['React', 'FastAPI', 'PostgreSQL', 'Docker'].map((item) => (
                           <div key={item} className="bg-white/5 border border-white/5 rounded px-3 py-2 text-[10px] md:text-xs text-gray-300 font-mono">
                               {item}
                           </div> 
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* STAGE 4: REASSEMBLY (Premium Center) */}
            <motion.div 
                 style={{ opacity: opacity4, y: y4 }}
                 className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
            >
                <div className="bg-gradient-to-b from-white/[0.05] to-transparent backdrop-blur-sm border border-white/10 px-6 py-10 md:px-12 md:py-16 rounded-3xl w-full max-w-sm md:max-w-none mx-4 md:mx-0">
                    <h2 className="text-3xl md:text-7xl font-bold text-white mb-4 md:mb-6 tracking-tighter">
                        Build The <br/> Unimaginable
                    </h2>
                    <p className="text-gray-400 font-light tracking-widest uppercase text-xs md:text-sm">
                        Ready for deployment
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

// Add import at the top (already there, removing this line)

