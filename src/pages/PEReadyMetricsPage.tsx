import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Users, DollarSign, Target, Clock, Shield } from 'lucide-react';

const metricCategories = [
  {
    id: 'financial',
    name: 'Financial Performance',
    icon: DollarSign,
    description: 'Track revenue quality and profitability',
    metrics: [
      { id: 'recurring-revenue-growth', name: 'Recurring Revenue Growth %', critical: true },
      { id: 'gross-margin-expansion', name: 'Gross Margin Expansion', critical: true },
      { id: 'ebitda-margin', name: 'EBITDA Margin %', critical: true },
      { id: 'revenue-per-employee', name: 'Revenue per Employee', critical: false },
      { id: 'customer-lifetime-value', name: 'Customer Lifetime Value', critical: false },
      { id: 'working-capital-efficiency', name: 'Working Capital Efficiency', critical: false }
    ]
  },
  {
    id: 'growth',
    name: 'Growth & Scale',
    icon: TrendingUp,
    description: 'Measure scalability and market expansion',
    metrics: [
      { id: 'new-customer-acquisition', name: 'New Customer Acquisition Rate', critical: true },
      { id: 'market-share-growth', name: 'Market Share Growth', critical: false },
      { id: 'product-penetration', name: 'Product Penetration Rate', critical: false },
      { id: 'geographic-expansion', name: 'Geographic Expansion', critical: false },
      { id: 'sales-efficiency', name: 'Sales Efficiency Ratio', critical: true },
      { id: 'pipeline-velocity', name: 'Pipeline Velocity', critical: false }
    ]
  },
  {
    id: 'operational',
    name: 'Operational Excellence',
    icon: Target,
    description: 'Monitor efficiency and process maturity',
    metrics: [
      { id: 'customer-satisfaction', name: 'Customer Satisfaction Score', critical: true },
      { id: 'employee-retention', name: 'Employee Retention Rate', critical: true },
      { id: 'process-automation', name: 'Process Automation %', critical: false },
      { id: 'quality-metrics', name: 'Quality Metrics', critical: false },
      { id: 'delivery-performance', name: 'On-time Delivery %', critical: false },
      { id: 'cost-per-acquisition', name: 'Customer Acquisition Cost', critical: true }
    ]
  },
  {
    id: 'risk',
    name: 'Risk Management',
    icon: Shield,
    description: 'Track business stability and compliance',
    metrics: [
      { id: 'customer-concentration', name: 'Customer Concentration Risk', critical: true },
      { id: 'supplier-diversity', name: 'Supplier Diversity Index', critical: false },
      { id: 'compliance-score', name: 'Compliance Score', critical: true },
      { id: 'cash-runway', name: 'Cash Runway (months)', critical: true },
      { id: 'insurance-coverage', name: 'Insurance Coverage %', critical: false },
      { id: 'data-security', name: 'Data Security Score', critical: false }
    ]
  }
];

export default function PEReadyMetricsPage() {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('financial');

  const handleMetricToggle = (metricId: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metricId) 
        ? prev.filter(id => id !== metricId)
        : [...prev, metricId]
    );
  };

  const getCriticalMetrics = () => {
    return metricCategories.flatMap(category => 
      category.metrics.filter(metric => metric.critical)
    );
  };

  const selectedCriticalCount = getCriticalMetrics().filter(metric => 
    selectedMetrics.includes(metric.id)
  ).length;

  const totalCriticalCount = getCriticalMetrics().length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-6 w-6" />
            PE-Ready Metrics Dashboard
          </CardTitle>
          <p className="text-muted-foreground">
            Select the KPIs that will track your progress toward PE readiness. Focus on metrics that directly address the gaps identified in your assessment.
          </p>
        </CardHeader>
      </Card>

      {/* Progress Overview */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{selectedMetrics.length}</div>
              <div className="text-sm text-muted-foreground">Total Selected</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{selectedCriticalCount}</div>
              <div className="text-sm text-muted-foreground">Critical Metrics</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{totalCriticalCount - selectedCriticalCount}</div>
              <div className="text-sm text-muted-foreground">Critical Remaining</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {Math.round((selectedCriticalCount / totalCriticalCount) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Readiness Score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Selection */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          {metricCategories.map(category => {
            const Icon = category.icon;
            return (
              <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{category.name}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {metricCategories.map(category => (
          <TabsContent key={category.id} value={category.id}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <category.icon className="h-5 w-5" />
                  {category.name}
                </CardTitle>
                <p className="text-muted-foreground">{category.description}</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.metrics.map(metric => (
                    <div
                      key={metric.id}
                      className={`p-4 border rounded-lg transition-colors ${
                        selectedMetrics.includes(metric.id)
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            id={metric.id}
                            checked={selectedMetrics.includes(metric.id)}
                            onCheckedChange={() => handleMetricToggle(metric.id)}
                          />
                          <div className="space-y-1">
                            <Label
                              htmlFor={metric.id}
                              className="text-sm font-medium cursor-pointer"
                            >
                              {metric.name}
                            </Label>
                            {metric.critical && (
                              <Badge variant="destructive" className="text-xs">
                                Critical
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {selectedCriticalCount < totalCriticalCount && (
                <span className="text-orange-600 font-medium">
                  ⚠️ Consider selecting all critical metrics for maximum PE readiness
                </span>
              )}
              {selectedCriticalCount === totalCriticalCount && (
                <span className="text-green-600 font-medium">
                  ✅ All critical metrics selected - you're on track!
                </span>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                Save & Export List
              </Button>
              <Button disabled={selectedMetrics.length === 0}>
                Create Dashboard
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      {selectedMetrics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Next Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm">
                You've selected {selectedMetrics.length} metrics to track. Here's what happens next:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>Set baseline measurements for each selected metric</li>
                <li>Define target improvements over 90-180 days</li>
                <li>Implement tracking systems and regular reporting</li>
                <li>Use the EBITDA Impact Calculator to quantify improvements</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}