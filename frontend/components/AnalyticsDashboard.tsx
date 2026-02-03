'use client';

import { useState, useEffect } from 'react';
import { Users, Eye, TrendingUp, Activity } from 'lucide-react';
import { analyticsAPI } from '@/lib/api';

interface Stats {
  total_visitors: number;
  live_visitors: number;
  total_page_views: number;
  popular_sections: Array<{ name: string; views: number }>;
}

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [liveCount, setLiveCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch stats on mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await analyticsAPI.getStats();
        setStats(data);
        setLiveCount(data.live_visitors);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Update live visitors every 10 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const data = await analyticsAPI.getLiveVisitors();
        setLiveCount(data.live_visitors);
      } catch (error) {
        console.error('Failed to fetch live visitors:', error);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="w-full p-8 bg-black/40 backdrop-blur-xl border border-amber-500/20 rounded-2xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-white/10 rounded w-1/3" />
          <div className="grid grid-cols-3 gap-4">
            <div className="h-24 bg-white/10 rounded" />
            <div className="h-24 bg-white/10 rounded" />
            <div className="h-24 bg-white/10 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-8 bg-black/40 backdrop-blur-xl border border-amber-500/20 rounded-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Activity className="w-6 h-6 text-amber-500" />
        <h2 className="text-2xl font-bold text-white">Live Analytics</h2>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Live Visitors */}
        <div className="p-6 bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-green-500" />
            <span className="flex items-center gap-1 text-xs text-green-500">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Live
            </span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{liveCount}</div>
          <div className="text-sm text-gray-400">Active Visitors</div>
        </div>

        {/* Total Visitors */}
        <div className="p-6 bg-gradient-to-br from-amber-500/10 to-amber-600/10 border border-amber-500/20 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-amber-500" />
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {stats?.total_visitors || 0}
          </div>
          <div className="text-sm text-gray-400">Total Visitors (30d)</div>
        </div>

        {/* Page Views */}
        <div className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <Eye className="w-5 h-5 text-blue-500" />
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {stats?.total_page_views || 0}
          </div>
          <div className="text-sm text-gray-400">Total Page Views</div>
        </div>
      </div>

      {/* Popular Sections */}
      {stats?.popular_sections && stats.popular_sections.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Popular Sections (7d)</h3>
          <div className="space-y-3">
            {stats.popular_sections.map((section, index) => {
              const maxViews = stats.popular_sections[0]?.views || 1;
              const percentage = (section.views / maxViews) * 100;

              return (
                <div key={section.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">
                      {index + 1}. {section.name}
                    </span>
                    <span className="text-amber-500 font-semibold">{section.views} views</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
