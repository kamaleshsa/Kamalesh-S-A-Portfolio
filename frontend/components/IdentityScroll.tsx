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

            {/* STAGE 2: THE ARCHITECT (Editorial Style - RIGHT) */}
            <motion.div 
                style={{ opacity: opacity2, y: y2 }}
                className="absolute inset-0 flex items-end justify-center md:justify-end px-8 md:px-32 pb-32"
            >
                <div className="relative text-right">
                    {/* Vertical Line Decoration */}
                    <div className="absolute -right-8 top-0 bottom-0 w-[1px] bg-white/30"></div>
                    
                    <div className="flex flex-col gap-2 items-end">
                        <div className="flex items-center gap-3">
                             <span className="font-mono text-xs text-gray-400 tracking-[0.3em] uppercase">Core Skills</span>
                             <div className="h-[1px] w-12 bg-white/50"></div>
                        </div>
                        
                        <h2 className="text-5xl md:text-8xl font-serif text-white leading-[0.9] tracking-tighter mix-blend-difference">
                            Backend <br/>
                            <span className="italic font-light text-gray-300">Development.</span>
                        </h2>
                        
                        <p className="max-w-md mt-6 text-sm md:text-lg text-gray-400 font-light leading-relaxed">
                            Building strategies systems that are secure and scalable. I focus on clean logic, database efficiency, and API performance.
                            <span className="block text-xs font-mono text-gray-500 mt-2 tracking-widest">
                                /// PYTHON • FASTAPI • POSTGRESQL
                            </span>
                        </p>
                    </div>

                    {/* Subtle Coordinate System */}
                    <div className="absolute -left-20 top-0 font-mono text-[9px] text-gray-600 flex flex-col gap-1 items-start opacity-50">
                        <span>X: 45.902</span>
                        <span>Y: 12.004</span>
                        <span>Z: 00.110</span>
                    </div>
                </div>
            </motion.div>

            {/* STAGE 3: THE ALCHEMIST (Editorial Style - LEFT) */}
            <motion.div 
                style={{ opacity: opacity3, y: y3 }}
                className="absolute inset-0 flex items-start justify-center md:justify-start px-8 md:px-32 pt-40"
            >
                 <div className="relative text-left group">
                    {/* Soft Radial Glow */}
                    <div className="absolute -inset-20 bg-purple-500/5 blur-[100px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

                    <div className="flex flex-col items-start gap-2 relative z-10">
                        <div className="flex items-center gap-3">
                             <div className="h-[1px] w-12 bg-white/50"></div>
                             <span className="font-mono text-xs text-gray-400 tracking-[0.3em] uppercase">User Experience</span>
                        </div>
                        
                        <h2 className="text-5xl md:text-8xl font-serif text-white leading-[0.9] tracking-tighter">
                            Frontend <br/>
                            <span className="italic font-light text-purple-200">Engineering.</span>
                        </h2>

                        <p className="max-w-md mt-6 text-sm md:text-lg text-gray-300 font-light leading-relaxed">
                            Crafting responsive, smooth web applications. I care about details, accessibility, and making things feel great to use.
                        </p>

                        {/* Ticker Tape Tech Stack */}
                        <div className="mt-8 overflow-hidden w-64 border-t border-b border-white/10 py-2">
                             <div className="flex whitespace-nowrap animate-marquee font-mono text-xs text-gray-500">
                                 <span className="mx-4">REACT</span>
                                 <span className="mx-4">NEXT.JS</span>
                                 <span className="mx-4">TYPESCRIPT</span>
                                 <span className="mx-4">THREE.JS</span>
                                 <span className="mx-4">SUPABASE</span>
                             </div>
                        </div>
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

