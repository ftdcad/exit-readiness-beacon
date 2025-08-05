import React from 'react';
import { TrendingUp, Target, Building2, ArrowRight, Clock, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface PathRecommendationProps {
  ebitda: number;
  peScore?: number;
  timeline?: 'quick' | 'standard' | 'long';
  className?: string;
}

export function PathRecommendation({ ebitda, peScore = 50, timeline = 'standard', className }: PathRecommendationProps) {
  const getRecommendation = () => {
    const margin = ebitda > 0 ? (ebitda / 5000000) * 100 : 0; // Rough margin estimate
    
    if (margin < 10 || peScore < 40) {
      return 'turnaround';
    } else if (margin > 20 && peScore > 70) {
      return 'quick';
    } else if (ebitda < 1000000) {
      return 'rollup';
    }
    return 'value-build';
  };

  const recommendation = getRecommendation();

  const paths = {
    quick: {
      title: 'Quick Exit',
      description: 'Your business is PE-ready. Focus on deal execution.',
      timeline: '6-12 months',
      color: 'text-green-400 border-green-500/30 bg-green-500/10',
      icon: TrendingUp,
      features: ['Market-ready EBITDA', 'Strong margins', 'Clean operations'],
      nextSteps: ['Market preparation', 'Buyer outreach', 'Due diligence prep'],
      estimatedValue: ebitda * 5.5,
      confidence: 'High'
    },
    'value-build': {
      title: 'Value Builder',
      description: 'Optimize operations before exit for maximum value.',
      timeline: '18-36 months',
      color: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
      icon: Target,
      features: ['Growth potential', 'Margin improvement', 'Systems optimization'],
      nextSteps: ['EBITDA enhancement', 'Process improvement', 'Management strengthening'],
      estimatedValue: ebitda * 6.5,
      confidence: 'Medium'
    },
    rollup: {
      title: 'Market Maker',
      description: 'Consolidate smaller players to create industry leader.',
      timeline: '24-48 months',
      color: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
      icon: Building2,
      features: ['Small market leader', 'Acquisition opportunities', 'Scale advantages'],
      nextSteps: ['Platform strengthening', 'Acquisition strategy', 'Integration planning'],
      estimatedValue: ebitda * 8.0,
      confidence: 'Medium'
    },
    turnaround: {
      title: 'Turnaround',
      description: 'Stabilize operations and return to profitability.',
      timeline: '12-24 months',
      color: 'text-orange-400 border-orange-500/30 bg-orange-500/10',
      icon: TrendingUp,
      features: ['Cost reduction needed', 'Operational fixes', 'Performance recovery'],
      nextSteps: ['Stabilization plan', 'Cost optimization', 'Revenue recovery'],
      estimatedValue: Math.max(ebitda * 3.0, 0),
      confidence: 'Low'
    }
  };

  const recommendedPath = paths[recommendation];
  const Icon = recommendedPath.icon;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Your Recommended Path</h2>
        <p className="text-white/70">Based on your current EBITDA and readiness score</p>
      </div>

      {/* Primary Recommendation */}
      <Card className={`${recommendedPath.color} border-2`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon className="w-8 h-8" />
              <div>
                <CardTitle className="text-xl text-white">{recommendedPath.title}</CardTitle>
                <CardDescription className="text-white/80">{recommendedPath.description}</CardDescription>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs">
              RECOMMENDED
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="flex items-center gap-2 text-white/70 text-sm mb-1">
                <Clock className="w-4 h-4" />
                Timeline
              </div>
              <p className="text-white font-medium">{recommendedPath.timeline}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-white/70 text-sm mb-1">
                <DollarSign className="w-4 h-4" />
                Est. Value
              </div>
              <p className="text-white font-medium">
                ${(recommendedPath.estimatedValue / 1000000).toFixed(1)}M
              </p>
            </div>
            <div>
              <div className="text-white/70 text-sm mb-1">Confidence</div>
              <p className="text-white font-medium">{recommendedPath.confidence}</p>
            </div>
          </div>

          <div>
            <h4 className="text-white font-medium mb-2">Key Strengths</h4>
            <ul className="space-y-1">
              {recommendedPath.features.map((feature, index) => (
                <li key={index} className="text-white/80 text-sm flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-current" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-2">Next Steps</h4>
            <ul className="space-y-1 mb-4">
              {recommendedPath.nextSteps.map((step, index) => (
                <li key={index} className="text-white/80 text-sm flex items-center gap-2">
                  <ArrowRight className="w-3 h-3" />
                  {step}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-2">
            {recommendation === 'turnaround' && (
              <Button asChild className="flex-1">
                <Link to="/portal/turnaround">
                  Start Turnaround Plan
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            )}
            {recommendation === 'rollup' && (
              <Button asChild className="flex-1">
                <Link to="/portal/rollup-builder">
                  Build Roll-up Strategy
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            )}
            {(recommendation === 'quick' || recommendation === 'value-build') && (
              <Button asChild className="flex-1">
                <Link to="/portal/week-2/scenarios">
                  Model Scenarios
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Alternative Paths */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Alternative Paths</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(paths)
            .filter(([key]) => key !== recommendation)
            .map(([key, path]) => {
              const PathIcon = path.icon;
              return (
                <Card key={key} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <PathIcon className="w-5 h-5 text-white/70" />
                      <CardTitle className="text-sm text-white">{path.title}</CardTitle>
                    </div>
                    <CardDescription className="text-xs text-white/60">
                      {path.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-white/70">Timeline:</span>
                        <span className="text-white">{path.timeline}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Est. Value:</span>
                        <span className="text-white">${(path.estimatedValue / 1000000).toFixed(1)}M</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      </div>
    </div>
  );
}