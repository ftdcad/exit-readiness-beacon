
import React from 'react';
import { AssetFreeEducation } from '@/components/asset-free-debt-free/AssetFreeEducation';

export default function AssetFreeEducationPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-white">Asset Free, Debt Free Education</h1>
          <p className="text-xl text-gray-300">
            Learn what PE buyers really mean when they say "asset free, debt free, cash free" transaction
          </p>
        </div>
        <AssetFreeEducation />
      </div>
    </div>
  );
}
