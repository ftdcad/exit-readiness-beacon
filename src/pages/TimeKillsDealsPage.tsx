
import React from 'react';
import { TimeKillsDealsEducation } from '@/components/time-kills-deals/TimeKillsDealsEducation';

export default function TimeKillsDealsPage() {
  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Time Kills Deals</h1>
          <p className="text-xl text-gray-300">
            Learn why speed and preparation are critical to M&A success
          </p>
        </div>
        
        <TimeKillsDealsEducation />
      </div>
    </div>
  );
}
