
import React from 'react';
import { AssetFreeEducation } from '@/components/asset-free-debt-free/AssetFreeEducation';

export default function AssetFreeEducationPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Asset Free, Debt Free Education</h1>
        <p className="text-xl text-muted-foreground">
          Learn what PE buyers really mean when they say "asset free, debt free, cash free" transaction
        </p>
      </div>
      <AssetFreeEducation />
    </div>
  );
}
