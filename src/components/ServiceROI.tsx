import React from 'react';
import { TrendingUp, DollarSign, Zap, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ServiceROIProps {
  currentValuation: number;
  projectedValuation: number;
  consultingCost?: number;
  className?: string;
}

export function ServiceROI({ 
  currentValuation, 
  projectedValuation, 
  consultingCost = 72000,
  className 
}: ServiceROIProps) {
  const valueCreated = projectedValuation - currentValuation;
  const roi = consultingCost > 0 ? valueCreated / consultingCost : 0;
  const roiMultiple = Math.round(roi);

  return (
    <Card className={`bg-gradient-to-br from-green-500/20 to-blue-500/20 border-green-500/30 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Zap className="w-5 h-5 text-yellow-400" />
          Service ROI Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Value Creation Breakdown */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-white/70 text-sm">Current Valuation</div>
            <div className="text-xl font-bold text-white">
              ${(currentValuation / 1000000).toFixed(2)}M
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-white/70 text-sm">Projected Valuation</div>
            <div className="text-xl font-bold text-green-400">
              ${(projectedValuation / 1000000).toFixed(2)}M
            </div>
          </div>
        </div>

        {/* Value Created */}
        <div className="p-4 bg-white/10 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/70 text-sm">Value Created</span>
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-green-400">
            +${(valueCreated / 1000000).toFixed(2)}M
          </div>
        </div>

        {/* ROI Calculation */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-white/70">Consulting Investment</span>
            <span className="text-white">${consultingCost.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/70">Value Generated</span>
            <span className="text-green-400">${(valueCreated).toLocaleString()}</span>
          </div>
          <div className="border-t border-white/20 pt-3">
            <div className="flex justify-between items-center">
              <span className="text-white font-medium">Return on Investment</span>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-400">{roiMultiple}x</div>
                <div className="text-xs text-white/70">{(roi * 100).toFixed(0)}% ROI</div>
              </div>
            </div>
          </div>
        </div>

        {/* ROI Messaging */}
        <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
          <div className="flex items-start gap-2">
            <DollarSign className="w-4 h-4 text-green-400 mt-0.5" />
            <div className="text-sm text-white/90">
              <strong>Your ${(consultingCost / 1000).toFixed(0)}K investment</strong> in exit readiness 
              creates <strong>${(valueCreated / 1000000).toFixed(1)}M in additional value</strong> - 
              that's a <strong>{roiMultiple}x return</strong> on your consulting investment.
            </div>
          </div>
        </div>

        {/* Benchmark Comparison */}
        <div className="space-y-2">
          <div className="text-white/70 text-sm font-medium">Industry Benchmarks</div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-white/60">Typical Business Consulting</span>
              <span className="text-white">3-5x ROI</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Management Consulting</span>
              <span className="text-white">5-10x ROI</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Exit Readiness (Your Result)</span>
              <span className="text-green-400 font-medium">{roiMultiple}x ROI</span>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        {roiMultiple > 10 && (
          <div className="text-center p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
            <div className="text-sm text-white/90 mb-2">
              Outstanding ROI! This positions your business perfectly for exit.
            </div>
            <div className="text-xs text-white/70">
              Consider accelerating your timeline or exploring strategic buyers.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}