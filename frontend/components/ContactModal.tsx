'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState<'IDLE' | 'SENDING' | 'SUCCESS' | 'ERROR'>('IDLE');
    const [errorMessage, setErrorMessage] = useState('');

    // Reset when opening
    useEffect(() => {
        if (isOpen) {
            setStatus('IDLE');
            setErrorMessage('');
            setErrorMessage('');
            setFormData({ name: '', email: '', subject: '', message: '' });
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('SENDING');

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const response = await fetch(`${apiUrl}/api/contact/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const data = await response.json();
                if (data.detail) {
                    // Handle array of errors (Pydantic) or single string
                    const detail = Array.isArray(data.detail) 
                        ? data.detail.map((err: any) => err.msg).join(', ')
                        : data.detail;
                    throw new Error(detail);
                }
                throw new Error('Transmission failed');
            }
            
            setStatus('SUCCESS');
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (error: any) {
            console.error(error);
            setStatus('ERROR');
            
            // Try to extract specific error message from the response
            let msg = 'Uplink failed. Try again.';
            if (error.message && error.message !== 'Transmission failed') {
                msg = error.message;
            }
            setErrorMessage(msg);
        }
    };

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
                        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
                    />

                    {/* Drawer Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 z-[70] h-full w-full md:w-[500px] bg-[#050505]/90 backdrop-blur-xl border-l border-white/10 p-8 md:p-12 flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-12">
                            <div className="flex flex-col">
                                <span className="font-mono text-[10px] text-gray-400 tracking-[0.2em] uppercase">Secure Channel</span>
                                <h2 className="text-3xl font-bold text-white tracking-tighter mt-1">Initialize Contact</h2>
                            </div>
                            <button 
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors group"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Form */}
                        {status === 'SUCCESS' ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
                                    <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-xl text-white font-medium">Transmission Sent</h3>
                                <p className="text-gray-400 text-sm">We will establish connection shortly.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex-1 space-y-8">
                                <div className="space-y-6">
                                    <div className="group">
                                        <label className="block font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-2 group-focus-within:text-white transition-colors">Identifier (Name)</label>
                                        <input 
                                            type="text" 
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            className="w-full bg-transparent border-b border-white/10 py-3 text-white focus:outline-none focus:border-white transition-colors font-light text-lg placeholder-white/20"
                                            placeholder="Enter your name"
                                        />
                                    </div>
                                    <div className="group">
                                        <label className="block font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-2 group-focus-within:text-white transition-colors">Frequency (Email)</label>
                                        <input 
                                            type="email" 
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            className="w-full bg-transparent border-b border-white/10 py-3 text-white focus:outline-none focus:border-white transition-colors font-light text-lg placeholder-white/20"
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                    <div className="group">
                                        <label className="block font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-2 group-focus-within:text-white transition-colors">Subject</label>
                                        <input 
                                            type="text" 
                                            value={formData.subject}
                                            onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                            className="w-full bg-transparent border-b border-white/10 py-3 text-white focus:outline-none focus:border-white transition-colors font-light text-lg placeholder-white/20"
                                            placeholder="Transmission topic"
                                        />
                                    </div>
                                    <div className="group">
                                        <label className="block font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-2 group-focus-within:text-white transition-colors">Payload (Message)</label>
                                        <textarea 
                                            required
                                            rows={5}
                                            value={formData.message}
                                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                                            className="w-full bg-transparent border-b border-white/10 py-3 text-white focus:outline-none focus:border-white transition-colors font-light text-lg placeholder-white/20 resize-none"
                                            placeholder="Transmission content..."
                                        />
                                    </div>
                                </div>

                                {status === 'ERROR' && (
                                    <div className="text-red-400 text-xs font-mono bg-red-500/10 p-3 rounded border border-red-500/20">
                                        {`//! ERROR: ${errorMessage}`}
                                    </div>
                                )}

                                <button 
                                    type="submit"
                                    disabled={status === 'SENDING'}
                                    className="w-full group relative overflow-hidden bg-white text-black py-4 font-medium tracking-wide transition-transform active:scale-[0.99]"
                                >
                                    <div className="absolute inset-0 bg-gray-200 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                    <span className="relative z-10 group-hover:text-black transition-colors flex items-center justify-center gap-2">
                                        {status === 'SENDING' ? 'TRANSMITTING...' : 'INITIATE UPLINK'}
                                        {status !== 'SENDING' && <span className="text-lg">→</span>}
                                    </span>
                                </button>
                            </form>
                        )}
                        
                        {/* Footer */}
                        <div className="mt-8 pt-8 border-t border-white/5 flex justify-between text-[10px] font-mono text-gray-600 uppercase">
                            <span>Encrypted: AES-256</span>
                            <span>Status: Secure</span>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
