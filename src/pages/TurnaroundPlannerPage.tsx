import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { 
  RefreshCw, 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle,
  Target,
  Calendar,
  DollarSign,
  Users,
  Settings,
  Zap,
  CheckCircle,
  Plus,
  ArrowLeft
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface TurnaroundLever {
  id: string;
  category: 'cost' | 'revenue' | 'working-capital' | 'management';
  name: string;
  description: string;
  currentValue: number;
  targetValue: number;
  timelineMonths: number;
  confidence: number;
  impact: number;
  implemented: boolean;
}

export default function TurnaroundPlannerPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  // Current state
  const [currentEbitda, setCurrentEbitda] = useState(0);
  const [currentRevenue, setCurrentRevenue] = useState(0);
  const [timelineMonths, setTimelineMonths] = useState(18);
  
  // Turnaround levers
  const [levers, setLevers] = useState<TurnaroundLever[]>([]);
  
  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    
    try {
      // Load current financial data
      const { data: financialData } = await supabase
        .from('user_financial_data')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (financialData) {
        const ebitda = financialData.revenue - financialData.cogs - financialData.opex +
          (financialData.owner_salary || 0) + (financialData.personal_vehicle || 0) +
          (financialData.travel_meals || 0) + (financialData.legal_fees || 0) +
          (financialData.other_non_recurring || 0);
        setCurrentEbitda(ebitda);
        setCurrentRevenue(financialData.revenue || 0);
        
        // Initialize default turnaround levers
        initializeDefaultLevers(financialData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeDefaultLevers = (financialData: any) => {
    const defaultLevers: TurnaroundLever[] = [
      {
        id: '1',
        category: 'cost',
        name: 'Operating Expense Reduction',
        description: 'Cut non-essential OpEx by 20-30%',
        currentValue: financialData.opex || 0,
        targetValue: (financialData.opex || 0) * 0.75,
        timelineMonths: 6,
        confidence: 80,
        impact: (financialData.opex || 0) * 0.25,
        implemented: false
      },
      {
        id: '2',
        category: 'cost',
        name: 'COGS Optimization',
        description: 'Renegotiate supplier contracts, reduce waste',
        currentValue: financialData.cogs || 0,
        targetValue: (financialData.cogs || 0) * 0.9,
        timelineMonths: 9,
        confidence: 70,
        impact: (financialData.cogs || 0) * 0.1,
        implemented: false
      },
      {
        id: '3',
        category: 'revenue',
        name: 'Customer Recovery',
        description: 'Win back lost customers, improve retention',
        currentValue: financialData.revenue || 0,
        targetValue: (financialData.revenue || 0) * 1.15,
        timelineMonths: 12,
        confidence: 60,
        impact: (financialData.revenue || 0) * 0.15 * 0.2, // 20% margin on incremental revenue
        implemented: false
      },
      {
        id: '4',
        category: 'working-capital',
        name: 'Cash Flow Optimization',
        description: 'Improve collections, extend payables',
        currentValue: 0,
        targetValue: (financialData.revenue || 0) * 0.05,
        timelineMonths: 3,
        confidence: 85,
        impact: (financialData.revenue || 0) * 0.05,
        implemented: false
      },
      {
        id: '5',
        category: 'management',
        name: 'Management Strengthening',
        description: 'Improve operations, accountability, KPIs',
        currentValue: 0,
        targetValue: (financialData.revenue || 0) * 0.03,
        timelineMonths: 6,
        confidence: 75,
        impact: (financialData.revenue || 0) * 0.03,
        implemented: false
      }
    ];
    
    setLevers(defaultLevers);
  };

  const updateLever = (id: string, updates: Partial<TurnaroundLever>) => {
    setLevers(levers.map(lever => 
      lever.id === id ? { ...lever, ...updates } : lever
    ));
  };

  const addCustomLever = () => {
    const newLever: TurnaroundLever = {
      id: Date.now().toString(),
      category: 'cost',
      name: 'Custom Initiative',
      description: 'Add your description',
      currentValue: 0,
      targetValue: 0,
      timelineMonths: 12,
      confidence: 70,
      impact: 0,
      implemented: false
    };
    setLevers([...levers, newLever]);
  };

  const calculateResults = () => {
    const implementedLevers = levers.filter(l => l.implemented);
    const totalImpact = implementedLevers.reduce((sum, lever) => sum + lever.impact, 0);
    const projectedEbitda = currentEbitda + totalImpact;
    const breakEvenMonths = currentEbitda < 0 ? 
      Math.ceil(Math.abs(currentEbitda) / (totalImpact / 12)) : 0;
    
    return {
      totalImpact,
      projectedEbitda,
      breakEvenMonths,
      implementedCount: implementedLevers.length,
      totalLevers: levers.length
    };
  };

  const savePlan = async () => {
    if (!user) return;
    
    try {
      await supabase
        .from('user_financial_data')
        .upsert({
          user_id: user.id,
          source: 'turnaround_plan',
          revenue: currentRevenue,
          turnaround_timeline: timelineMonths,
          turnaround_levers: levers
        });
        
      toast.success('Turnaround plan saved successfully');
    } catch (error) {
      toast.error('Failed to save turnaround plan');
    }
  };

  const results = calculateResults();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cost': return DollarSign;
      case 'revenue': return TrendingUp;
      case 'working-capital': return RefreshCw;
      case 'management': return Users;
      default: return Settings;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'cost': return 'text-red-400 border-red-500/30 bg-red-500/10';
      case 'revenue': return 'text-green-400 border-green-500/30 bg-green-500/10';
      case 'working-capital': return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
      case 'management': return 'text-purple-400 border-purple-500/30 bg-purple-500/10';
      default: return 'text-white/70 border-white/10 bg-white/5';
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-white/70">Loading turnaround analysis...</div>
    </div>;
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="text-white/70">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <RefreshCw className="w-8 h-8 text-orange-400" />
              Turnaround Planner
            </h1>
            <p className="text-white/70">Stabilize operations and return to profitability</p>
          </div>
        </div>

        {/* Current Situation */}
        <Card className="bg-red-500/10 border-red-500/30 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Current Situation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-white/70 text-sm">Annual Revenue</div>
                <div className="text-xl font-bold text-white">
                  ${(currentRevenue / 1000000).toFixed(2)}M
                </div>
              </div>
              <div>
                <div className="text-white/70 text-sm">Current EBITDA</div>
                <div className={`text-xl font-bold ${currentEbitda < 0 ? 'text-red-400' : 'text-white'}`}>
                  ${(currentEbitda / 1000000).toFixed(2)}M
                </div>
              </div>
              <div>
                <div className="text-white/70 text-sm">Recovery Timeline</div>
                <input
                  type="range"
                  min="12"
                  max="36"
                  step="3"
                  value={timelineMonths}
                  onChange={(e) => setTimelineMonths(Number(e.target.value))}
                  className="w-full mt-2"
                />
                <div className="text-white font-medium">{timelineMonths} months</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Preview */}
        <Card className="bg-green-500/10 border-green-500/30 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Target className="w-5 h-5 text-green-400" />
              Projected Recovery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <div className="text-white/70 text-sm">Levers Implemented</div>
                <div className="text-xl font-bold text-white">
                  {results.implementedCount}/{results.totalLevers}
                </div>
              </div>
              <div>
                <div className="text-white/70 text-sm">Total Impact</div>
                <div className="text-xl font-bold text-green-400">
                  +${(results.totalImpact / 1000000).toFixed(2)}M
                </div>
              </div>
              <div>
                <div className="text-white/70 text-sm">Projected EBITDA</div>
                <div className={`text-xl font-bold ${results.projectedEbitda > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ${(results.projectedEbitda / 1000000).toFixed(2)}M
                </div>
              </div>
              <div>
                <div className="text-white/70 text-sm">Break-even Timeline</div>
                <div className="text-xl font-bold text-white">
                  {results.breakEvenMonths > 0 ? `${results.breakEvenMonths} months` : 'Profitable'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Turnaround Levers */}
        <div className="space-y-6 mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Turnaround Levers</h2>
            <Button onClick={addCustomLever} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Custom Lever
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {levers.map((lever) => {
              const Icon = getCategoryIcon(lever.category);
              const colorClass = getCategoryColor(lever.category);
              
              return (
                <Card key={lever.id} className={`${colorClass} ${lever.implemented ? 'border-2' : ''}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <div>
                          <CardTitle className="text-white text-base">{lever.name}</CardTitle>
                          <CardDescription className="text-white/70 text-sm">
                            {lever.description}
                          </CardDescription>
                        </div>
                      </div>
                      <button
                        onClick={() => updateLever(lever.id, { implemented: !lever.implemented })}
                        className={`p-1 rounded ${lever.implemented ? 'text-green-400' : 'text-white/40'}`}
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-white/70">Impact</div>
                        <div className="text-white font-medium">
                          ${(lever.impact / 1000).toFixed(0)}K
                        </div>
                      </div>
                      <div>
                        <div className="text-white/70">Timeline</div>
                        <div className="text-white font-medium">{lever.timelineMonths} months</div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm text-white/70 mb-1">
                        <span>Confidence Level</span>
                        <span>{lever.confidence}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div 
                          className="bg-current h-2 rounded-full transition-all" 
                          style={{ width: `${lever.confidence}%` }}
                        />
                      </div>
                    </div>

                    {lever.implemented && (
                      <div className="p-2 bg-green-500/20 border border-green-500/30 rounded text-sm text-green-400">
                        ✓ Included in recovery projection
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recovery Timeline */}
        <Card className="bg-white/5 border-white/10 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Calendar className="w-5 h-5" />
              Recovery Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Phase 1: Stabilization */}
              <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-white">Phase 1: Stabilization (0-6 months)</h4>
                  <Badge variant="outline">Critical</Badge>
                </div>
                <ul className="text-sm text-white/80 space-y-1">
                  <li>• Immediate cash flow management</li>
                  <li>• Essential cost reductions</li>
                  <li>• Stakeholder communication</li>
                  <li>• Quick wins implementation</li>
                </ul>
              </div>

              {/* Phase 2: Recovery */}
              <div className="p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-white">Phase 2: Recovery (6-12 months)</h4>
                  <Badge variant="outline">Important</Badge>
                </div>
                <ul className="text-sm text-white/80 space-y-1">
                  <li>• Revenue recovery initiatives</li>
                  <li>• Operational improvements</li>
                  <li>• Team rebuilding</li>
                  <li>• Process optimization</li>
                </ul>
              </div>

              {/* Phase 3: Growth */}
              <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-white">Phase 3: Growth (12-{timelineMonths} months)</h4>
                  <Badge variant="outline">Opportunity</Badge>
                </div>
                <ul className="text-sm text-white/80 space-y-1">
                  <li>• Market expansion</li>
                  <li>• Strategic investments</li>
                  <li>• Exit preparation</li>
                  <li>• Value maximization</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button onClick={savePlan} className="flex-1">
            <RefreshCw className="w-4 h-4 mr-2" />
            Save Turnaround Plan
          </Button>
          <Button variant="outline" onClick={() => navigate('/portal/week-2/scenarios')}>
            Model Recovery Scenarios
          </Button>
        </div>
      </div>
    </div>
  );
}