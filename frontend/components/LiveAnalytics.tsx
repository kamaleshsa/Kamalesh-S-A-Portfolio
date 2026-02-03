'use client';

import { useState, useEffect } from 'react';
import { Users, Eye } from 'lucide-react';

interface LiveStats {
  activeVisitors: number;
  totalViews: number;
}

export default function LiveAnalytics() {
  const [stats, setStats] = useState<LiveStats>({ activeVisitors: 0, totalViews: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analytics/visitors/live`);
        if (response.ok) {
          const data = await response.json();
          console.log('Live stats:', data); // Debug log
          setStats({
            activeVisitors: data.active_visitors || 0,
            totalViews: data.total_views || 0
          });
        }
      } catch (error) {
        console.error('Failed to fetch live stats:', error);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-4 right-4 z-[90]">
      {/* Glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-white/20 via-gray-300/20 to-white/20 rounded-full opacity-10 blur-md" />
      
      {/* Main content - Horizontal layout */}
      <div className="relative bg-gradient-to-r from-[#0a0a0a]/95 via-[#0f0f0f]/95 to-[#0a0a0a]/95 backdrop-blur-2xl border border-white/20 rounded-full shadow-2xl px-4 py-2">
        {/* Animated border */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5 animate-pulse pointer-events-none rounded-full" />
        
        <div className="relative flex items-center gap-4">
          {/* Active visitors */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center">
              <Users className="w-3 h-3 text-white" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-white">{stats.activeVisitors}</span>
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
            </div>
          </div>

          {/* Divider */}
          <div className="w-px h-4 bg-white/20"></div>

          {/* Total views */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center">
              <Eye className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-bold text-white">{stats.totalViews.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
