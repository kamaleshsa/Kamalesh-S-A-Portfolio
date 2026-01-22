'use client';

import { BentoGrid, BentoGridItem } from "./ui/bento-grid";
import { ProjectModal } from "./ProjectModal";
import { useState } from "react";

export function ContentSections() {
  const [modalProject, setModalProject] = useState<{ title: string; link: string } | null>(null);

  return (
    <div className="relative z-0 -mt-[100vh] bg-[#0a0a0a] text-white">
      
      {/* About Me Section */}
      <section className="py-24 px-8 md:px-24 border-t border-white/10">
        <h3 className="text-sm font-light tracking-[0.2em] uppercase text-gray-400 mb-12">Who Am I</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="text-2xl md:text-3xl font-light leading-relaxed text-gray-200">
                Passionate Web Developer at <span className="text-white font-medium">Francium Tech</span>. 
                I specialize in crafting innovative solutions using <span className="text-white">ReactJS</span>, <span className="text-white">Python</span>, <span className="text-white">FastAPI</span>, and <span className="text-white">Flask</span>.
                My focus is always on clean code and scalable architectures.
            </div>
            <div className="text-gray-400 font-mono text-sm leading-loose">
                Currently working as a Solution Consultant, I bridge the gap between complex requirements and elegant technical implementations. 
                From internal tools to client-facing products, I bring a system-first approach to every project.
            </div>
        </div>
      </section>

      {/* Experience Section with Timeline */}
      <section className="py-24 px-8 md:px-24 border-t border-white/10">
        <h3 className="text-sm font-light tracking-[0.2em] uppercase text-gray-400 mb-12">Experience</h3>
        
        <div className="max-w-5xl mx-auto">
          {/* Timeline Container */}
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
            
            {/* Experience Item */}
            <div className="relative mb-16 md:mb-0">
              <div className="md:flex md:items-center">
                {/* Left Side (Desktop) / Top (Mobile) */}
                <div className="md:w-1/2 md:pr-12 mb-8 md:mb-0 md:text-right">
                  <div className="inline-block">
                    <div className="text-sm font-mono text-gray-500 mb-2">July 2024 - Present</div>
                    <h4 className="text-3xl md:text-4xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      Solution Consultant
                    </h4>
                    <p className="text-xl text-gray-400 font-light">Francium Tech</p>
                  </div>
                </div>
                
                {/* Center Dot */}
                <div className="absolute left-0 md:left-1/2 -translate-x-1/2 w-4 h-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full border-4 border-black shadow-lg shadow-blue-500/50"></div>
                
                {/* Right Side (Desktop) / Bottom (Mobile) */}
                <div className="md:w-1/2 md:pl-12 ml-8 md:ml-0">
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:border-white/20 transition-all duration-300 group">
                    <ul className="space-y-3 text-gray-300 font-light">
                      <li className="flex items-start gap-3 group-hover:translate-x-1 transition-transform duration-300">
                        <span className="text-blue-400 mt-1">▹</span>
                        <span>Spearheading internal & external development using ReactJS, Python, FastAPI and Flask</span>
                      </li>
                      <li className="flex items-start gap-3 group-hover:translate-x-1 transition-transform duration-300">
                        <span className="text-purple-400 mt-1">▹</span>
                        <span>Architecting scalable UI/UX with Aceternity UI, Shadcn/UI, and Material UI</span>
                      </li>
                      <li className="flex items-start gap-3 group-hover:translate-x-1 transition-transform duration-300">
                        <span className="text-pink-400 mt-1">▹</span>
                        <span>Optimization of backend systems for high-load environments</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section - Technical Grid System */}
      <section className="py-20 md:py-24 lg:py-24 px-4 md:px-12 lg:px-24 border-t border-white/10">
        <h3 className="text-xs md:text-sm font-light tracking-[0.2em] uppercase text-gray-400 mb-12">System Mastery</h3>
        
        {/* Main Grid Container - Architectural Look */}
        <div className="max-w-7xl mx-auto border border-white/15 bg-white/[0.02] backdrop-blur-sm">
          <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-white/15">
            
            {/* Frontend Module */}
            <div className="group relative p-6 md:p-8 lg:p-10 hover:bg-white/[0.02] transition-colors duration-500">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="flex items-center justify-between mb-6 md:mb-8">
                <h4 className="text-xl md:text-2xl font-bold text-white tracking-tight">FRONTEND</h4>
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-mono text-gray-500 border border-white/10 px-2 py-1 rounded-sm">V.2.0</span>
                </div>
              </div>
              
              <div className="space-y-4 md:space-y-6">
                <div>
                  <span className="text-xs font-mono text-blue-400/50 block mb-2 tracking-wider">CORE</span>
                  <p className="text-gray-300 font-light text-base md:text-lg">ReactJS, TypeScript, Tailwind</p>
                </div>
                <div>
                  <span className="text-xs font-mono text-blue-400/50 block mb-2 tracking-wider">INTERFACE</span>
                  <p className="text-gray-300 font-light text-base md:text-lg">Framer Motion, Shadcn/UI</p>
                </div>
                <div>
                  <span className="text-xs font-mono text-blue-400/50 block mb-2 tracking-wider">LIBRARY</span>
                  <p className="text-gray-300 font-light text-base md:text-lg">HeroUI, Material UI, Aceternity UI</p>
                </div>
              </div>
            </div>

            {/* Backend Module */}
            <div className="group relative p-6 md:p-8 lg:p-10 hover:bg-white/[0.02] transition-colors duration-500">
               <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="flex items-center justify-between mb-6 md:mb-8">
                <h4 className="text-xl md:text-2xl font-bold text-white tracking-tight">BACKEND</h4>
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-mono text-gray-500 border border-white/10 px-2 py-1 rounded-sm">SYS.D</span>
                </div>
              </div>
              
              <div className="space-y-4 md:space-y-6">
                 <div>
                  <span className="text-xs font-mono text-purple-400/50 block mb-2 tracking-wider">RUNTIME</span>
                  <p className="text-gray-300 font-light text-base md:text-lg">Python, Flask, FastAPI</p>
                </div>
                <div>
                  <span className="text-xs font-mono text-purple-400/50 block mb-2 tracking-wider">DATA</span>
                  <p className="text-gray-300 font-light text-base md:text-lg">PostgreSQL, MySQL</p>
                </div>
                <div>
                  <span className="text-xs font-mono text-purple-400/50 block mb-2 tracking-wider">ARCH</span>
                  <p className="text-gray-300 font-light text-base md:text-lg">System Design, Microservices</p>
                </div>
              </div>
            </div>

            {/* DevOps Module */}
            <div className="group relative p-6 md:p-8 lg:p-10 hover:bg-white/[0.02] transition-colors duration-500">
               <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="flex items-center justify-between mb-6 md:mb-8">
                <h4 className="text-xl md:text-2xl font-bold text-white tracking-tight">DEVOPS</h4>
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-mono text-gray-500 border border-white/10 px-2 py-1 rounded-sm">OPS.X</span>
                </div>
              </div>
              
              <div className="space-y-4 md:space-y-6">
                <div>
                  <span className="text-xs font-mono text-pink-400/50 block mb-2 tracking-wider">VCS</span>
                  <p className="text-gray-300 font-light text-base md:text-lg">Git</p>
                </div>
                <div>
                  <span className="text-xs font-mono text-pink-400/50 block mb-2 tracking-wider">CONTAINER</span>
                  <p className="text-gray-300 font-light text-base md:text-lg">Docker</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Client Projects Section - Premium Dossier Style */}
      <section className="py-20 md:py-28 lg:py-32 px-4 md:px-12 lg:px-24 border-t border-white/10 relative overflow-hidden">
         {/* Background Elements */}
         <div className="absolute top-0 right-0 w-[300px] md:w-[400px] lg:w-[500px] h-[300px] md:h-[400px] lg:h-[500px] bg-blue-500/5 blur-[80px] md:blur-[100px] pointer-events-none"></div>
         
         <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 lg:mb-20">
                <div>
                   <h3 className="text-xs md:text-sm font-light tracking-[0.2em] uppercase text-gray-400 mb-2 md:mb-4">Selected Works</h3>
                   <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">Client <span className="text-gray-600">Engagements</span></h2>
                </div>
                <div className="hidden lg:block h-px w-32 bg-white/20"></div>
            </div>
         
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-6 lg:gap-8">
                {CLIENT_PROJECTS.map((project, idx) => (
                    <div 
                        key={idx}
                        className="group relative bg-[#0a0a0a] border border-white/10 hover:border-white/20 transition-all duration-500 rounded-none overflow-hidden"
                    >
                        {/* Hover Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        {/* Top Bar */}
                        <div className="relative p-4 md:p-5 lg:p-6 border-b border-white/5 flex items-center justify-between">
                            <span className="font-mono text-[10px] md:text-xs text-blue-400 tracking-widest">0{idx + 1}</span>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="font-mono text-[9px] md:text-[10px] text-gray-500 uppercase">Deployed / V1.0</span>
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
                                <span className="text-[10px] font-mono text-gray-600 uppercase block mb-3">Technology Stack</span>
                                <div className="flex flex-wrap gap-2">
                                    {project.stack.map(tech => (
                                        <span key={tech} className="text-[10px] md:text-xs text-gray-300 bg-white/5 px-2 py-1 ">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        
                        {/* Corner Accents */}
                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20"></div>
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20"></div>
                    </div>
                ))}
            </div>
         </div>
      </section>

      {/* Personal Projects Section with Premium Bento Grid */}
      <section className="py-20 md:py-24 lg:py-24 px-4 md:px-12 lg:px-24 border-t border-white/10 relative">
         <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 max-w-7xl mx-auto">
             <div>
                <h3 className="text-xs md:text-sm font-light tracking-[0.2em] uppercase text-gray-400 mb-2 md:mb-4">Innovation Lab</h3>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">Personal <span className="text-gray-600">Projects</span></h2>
             </div>
             <div className="hidden lg:flex items-center gap-4">
                 <span className="text-xs font-mono text-gray-500">SYSTEM.LAB.01</span>
                 <div className="h-px w-20 bg-white/20"></div>
             </div>
         </div>
         
         <BentoGrid className="max-w-7xl mx-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {PERSONAL_PROJECTS.map((project, idx) => (
                <div 
                    key={idx}
                    onClick={() => setModalProject(project)}
                    className={`cursor-pointer group relative ${idx === 3 || idx === 6 ? "md:col-span-2 lg:col-span-2" : ""}`}
                >
                    <BentoGridItem
                        title={
                            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                                <span className="text-lg md:text-xl font-bold text-white group-hover:text-purple-400 transition-colors">{project.title}</span>
                                <span className="text-[10px] md:text-xs font-mono text-gray-600">PROJ.0{idx + 1}</span>
                            </div>
                        }
                        description={
                            <p className="text-gray-400 text-xs md:text-sm leading-relaxed mb-6 font-light">
                                {project.description}
                            </p>
                        }
                        header={
                            <div className="flex flex-1 w-full h-full min-h-[12rem] rounded-lg overflow-hidden border border-white/10 bg-[#050505] relative group-hover:border-white/20 transition-colors">
                                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                                
                                {/* Tech overlay lines */}
                                <div className="absolute top-2 left-2 z-20 flex gap-1">
                                    <div className="w-1 h-1 bg-white/40 rounded-full"></div>
                                    <div className="w-1 h-1 bg-white/40 rounded-full"></div>
                                </div>
                                <div className="absolute bottom-4 left-4 z-20 text-[9px] md:text-[10px] font-mono text-white/60 tracking-widest uppercase">
                                    Interactive Preview
                                </div>

                                <img
                                    src={project.preview}
                                    alt={project.title}
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                                />
                            </div>
                        }
                        className=""
                        icon={
                            <div className="flex gap-2 flex-wrap pt-4 border-t border-white/5">
                                {project.stack.map(tech => (
                                    <span key={tech} className="text-[9px] md:text-[10px] font-mono text-gray-500 bg-white/[0.03] px-2 py-1 border border-white/5 hover:bg-white/10 transition-colors">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        }
                    />
                </div>
            ))}
         </BentoGrid>
      </section>

      {/* Contact Section - Premium Finale */}
      <section className="py-24 md:py-32 lg:py-40 px-4 md:px-12 lg:px-8 relative overflow-hidden flex flex-col items-center justify-center border-t border-white/10">
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[450px] lg:w-[600px] h-[300px] md:h-[450px] lg:h-[600px] bg-white/5 blur-[80px] md:blur-[100px] lg:blur-[120px] pointer-events-none"></div>
          
          <div className="relative z-10 max-w-4xl mx-auto text-center w-full">
              <div className="flex items-center justify-center gap-2 mb-6 md:mb-8">
                  <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full animate-pulse"></span>
                  <span className="text-xs md:text-sm font-mono text-gray-400 tracking-widest uppercase">Available for new opportunities</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl lg:text-8xl font-bold tracking-tighter text-white mb-8 md:mb-12 leading-tight">
                Ready to start <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-400 to-gray-600">
                    the next revolution?
                </span>
              </h2>

              <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 mb-12 md:mb-20 w-full px-4">
                  <a 
                    href="https://mail.google.com/mail/u/0/?fs=1&to=kamalkamalesh316@gmail.com" 
                    target="_blank"
                    rel="noreferrer"
                    className="group relative px-6 py-3 md:px-8 md:py-4 bg-white/5 border border-white/10 rounded-full overflow-hidden hover:border-white/20 transition-all duration-300 w-full md:w-auto min-w-[200px]"
                  >
                      <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                      <span className="relative z-10 flex items-center justify-center gap-2 text-white font-medium text-sm md:text-base">
                          <span>Start a Project</span>
                          <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </span>
                  </a>

                  <div className="flex gap-4">
                      <a 
                        href="https://www.linkedin.com/in/kamaleshsa/" 
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 md:p-4 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:border-white/30 transition-all duration-300 group"
                        title="LinkedIn"
                      >
                         <svg className="w-5 h-5 md:w-6 md:h-6 fill-gray-400 group-hover:fill-white transition-colors" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                      </a>
                      <a 
                        href="https://github.com/kamaleshsa" 
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 md:p-4 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:border-white/30 transition-all duration-300 group"
                        title="GitHub"
                      >
                          <svg className="w-5 h-5 md:w-6 md:h-6 fill-gray-400 group-hover:fill-white transition-colors" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg> 
                      </a>
                  </div>
              </div>
          </div>

          <footer className="absolute bottom-0 w-full py-4 md:py-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between px-4 md:px-12 lg:px-24">
              <div className="text-[9px] md:text-[10px] text-gray-600 font-mono uppercase tracking-widest mb-2 md:mb-0">
                  © {new Date().getFullYear()} Kamalesh S A
              </div>
              <div className="flex gap-4 md:gap-8">
                  <span className="text-[9px] md:text-[10px] text-gray-700 font-mono">LOC: 13.0827° N, 80.2707° E</span>
                  <span className="text-[9px] md:text-[10px] text-gray-700 font-mono">SYS: ONLINE</span>
              </div>
          </footer>
      </section>

      {/* Project Modal */}
      <ProjectModal 
        isOpen={!!modalProject}
        onClose={() => setModalProject(null)}
        project={modalProject}
      />
    </div>
  );
}

const CLIENT_PROJECTS = [
    {
        title: "Leave Management",
        description: "Employee leave tracking and management system with approval workflows.",
        stack: ["ReactJS", "Material UI", "Python"]
    },
    {
        title: "Pida (ShadowPan)",
        description: "Agricultural management platform for resource tracking and optimization.",
        stack: ["ReactJS", "Material UI", "FastAPI"]
    },
    {
        title: "TradeSchool",
        description: "Ad creation platform with dynamic templates and campaign management.",
        stack: ["ReactJS", "Shadcn/UI", "FastAPI"]
    }
];

const PERSONAL_PROJECTS = [
    {
        title: "Siddha AI",
        description: "AI-powered platform with intelligent automation and data processing.",
        stack: ["ReactJS", "Aceternity UI", "FastAPI", "PostgreSQL"],
        link: "https://siddha-ai.vercel.app/",
        preview: "/siddha-ai-preview.png"
    },
    {
        title: "OTPify",
        description: "Email OTP verification service with secure authentication flows and free forever.",
        stack: ["ReactJS", "Aceternity UI", "FastAPI", "PostgreSQL"],
        link: "https://otpify-email.vercel.app/",
        preview: "/otipy-preview.png"
    },
    {
        title: "Prism Convert",
        description: "File conversion tool with modern UI and batch processing capabilities.",
        stack: ["ReactJS", "Shadcn/UI"],
        link: "https://prism-convert-v2-0.vercel.app/",
        preview: "/prism-convert-preview.png"
    }
];
