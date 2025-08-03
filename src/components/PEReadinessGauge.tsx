import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, FileText, DollarSign, BarChart3 } from 'lucide-react';
import { FinancialAssessment } from '@/hooks/useFinancialAssessment';
import { ContactInquiry } from '@/hooks/useInquiries';

interface PEReadinessGaugeProps {
  score: number;
  assessment: FinancialAssessment | null | undefined;
  company: ContactInquiry;
}

export const PEReadinessGauge = ({ score, assessment, company }: PEReadinessGaugeProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Work';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Calculate individual component scores
  const ebitdaScore = assessment?.ebitda_margin ? Math.min(40, (assessment.ebitda_margin / 0.20) * 40) : 0;
  const docScore = 0; // Will be calculated based on document uploads in future
  const addBackScore = 0; // Will be calculated based on add-backs in future
  const healthScore = 0; // Will be calculated based on business health metrics

  const components = [
    {
      label: 'EBITDA Margin',
      score: ebitdaScore,
      maxScore: 40,
      icon: DollarSign,
      description: assessment?.ebitda_margin 
        ? `${(assessment.ebitda_margin * 100).toFixed(1)}% margin`
        : 'Not calculated',
    },
    {
      label: 'Documentation',
      score: docScore,
      maxScore: 20,
      icon: FileText,
      description: 'Tax returns, P&Ls, contracts',
    },
    {
      label: 'Add-Back Potential',
      score: addBackScore,
      maxScore: 20,
      icon: TrendingUp,
      description: 'Personal expenses to normalize',
    },
    {
      label: 'Business Health',
      score: healthScore,
      maxScore: 20,
      icon: BarChart3,
      description: 'Customer concentration, scalability',
    },
  ];

  const formatCurrency = (value: number | null) => {
    if (!value) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Calculate estimated valuation if we have assessment data
  const estimatedValuation = assessment && assessment.current_ebitda 
    ? assessment.current_ebitda * 4.5 // Default 4.5x multiple
    : null;

  return (
    <div className="space-y-6">
      {/* Main Score Display */}
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="w-32 h-32 mx-auto relative">
            {/* Background circle */}
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-muted-foreground/20"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={`${2.51 * score} 251.2`}
                className={score >= 80 ? 'text-green-500' : score >= 60 ? 'text-yellow-500' : 'text-red-500'}
                strokeLinecap="round"
              />
            </svg>
            {/* Score text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-2xl font-bold ${getScoreColor(score)}`}>
                  {score}
                </div>
                <div className="text-xs text-muted-foreground">/ 100</div>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <Badge variant={score >= 60 ? 'default' : 'destructive'} className="mb-2">
            {getScoreLabel(score)}
          </Badge>
          <p className="text-sm text-muted-foreground">
            PE Readiness Score
          </p>
        </div>
      </div>

      {/* Component Breakdown */}
      <div className="space-y-4">
        <h4 className="font-medium">Score Breakdown</h4>
        {components.map((component) => {
          const Icon = component.icon;
          const percentage = (component.score / component.maxScore) * 100;
          
          return (
            <Card key={component.label}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{component.label}</span>
                  <span className="text-sm text-muted-foreground ml-auto">
                    {Math.round(component.score)}/{component.maxScore}
                  </span>
                </div>
                <Progress value={percentage} className="h-2 mb-2" />
                <p className="text-xs text-muted-foreground">{component.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Valuation Estimate */}
      {estimatedValuation && (
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium mb-2">Estimated Valuation</h4>
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(estimatedValuation)}
            </p>
            <p className="text-xs text-muted-foreground">
              Based on {assessment?.current_ebitda ? formatCurrency(assessment.current_ebitda) : '$0'} EBITDA × 4.5x multiple
            </p>
          </CardContent>
        </Card>
      )}

      {/* Next Steps */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-medium mb-3">Recommended Actions</h4>
          <div className="space-y-2 text-sm">
            {score < 40 && (
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 flex-shrink-0" />
                <span>Complete financial assessment to identify improvement areas</span>
              </div>
            )}
            {assessment?.ebitda_margin && assessment.ebitda_margin < 0.15 && (
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-1.5 flex-shrink-0" />
                <span>Improve EBITDA margin through cost optimization or add-backs</span>
              </div>
            )}
            {!assessment && (
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                <span>Begin by entering basic financial information</span>
              </div>
            )}
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />
              <span>Gather supporting documentation for due diligence</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};