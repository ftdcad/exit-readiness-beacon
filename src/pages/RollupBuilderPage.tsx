import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { 
  Building2, 
  Plus, 
  Trash2, 
  TrendingUp,
  Calculator,
  Target,
  DollarSign,
  ArrowLeft,
  Download
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface RollupTarget {
  id: string;
  name: string;
  revenue: number;
  ebitda: number;
  multiple: number;
  acquisitionCost: number;
  synergies: number;
  integrationCost: number;
  integrationMonths: number;
}

interface PlatformCompany {
  name: string;
  revenue: number;
  ebitda: number;
  currentValuation: number;
}

export default function RollupBuilderPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  // Platform company (user's current business)
  const [platform, setPlatform] = useState<PlatformCompany>({
    name: 'My Company',
    revenue: 0,
    ebitda: 0,
    currentValuation: 0
  });
  
  // Target companies for acquisition
  const [targets, setTargets] = useState<RollupTarget[]>([]);
  
  // Strategy parameters
  const [rollupMultiple, setRollupMultiple] = useState(6.5);
  const [synergiesPct, setSynergiesPct] = useState(15);
  const [integrationCostPct, setIntegrationCostPct] = useState(5);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    
    try {
      // Load current company data
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
          
        setPlatform({
          name: 'My Company',
          revenue: financialData.revenue || 0,
          ebitda: ebitda,
          currentValuation: ebitda * 4.5 // Current multiple
        });
        
        // Initialize with sample targets
        initializeSampleTargets();
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeSampleTargets = () => {
    const sampleTargets: RollupTarget[] = [
      {
        id: '1',
        name: 'Competitor A',
        revenue: 1500000,
        ebitda: 300000,
        multiple: 4.0,
        acquisitionCost: 1200000,
        synergies: 45000,
        integrationCost: 60000,
        integrationMonths: 12
      },
      {
        id: '2',
        name: 'Regional Player B',
        revenue: 2200000,
        ebitda: 440000,
        multiple: 4.2,
        acquisitionCost: 1848000,
        synergies: 66000,
        integrationCost: 92400,
        integrationMonths: 18
      }
    ];
    setTargets(sampleTargets);
  };

  const addTarget = () => {
    const newTarget: RollupTarget = {
      id: Date.now().toString(),
      name: 'New Target',
      revenue: 0,
      ebitda: 0,
      multiple: 4.0,
      acquisitionCost: 0,
      synergies: 0,
      integrationCost: 0,
      integrationMonths: 12
    };
    setTargets([...targets, newTarget]);
  };

  const updateTarget = (id: string, updates: Partial<RollupTarget>) => {
    setTargets(targets.map(target => {
      if (target.id === id) {
        const updated = { ...target, ...updates };
        // Auto-calculate fields
        if (updates.revenue || updates.ebitda || updates.multiple) {
          updated.acquisitionCost = updated.ebitda * updated.multiple;
          updated.synergies = updated.ebitda * (synergiesPct / 100);
          updated.integrationCost = updated.acquisitionCost * (integrationCostPct / 100);
        }
        return updated;
      }
      return target;
    }));
  };

  const removeTarget = (id: string) => {
    setTargets(targets.filter(target => target.id !== id));
  };

  const calculateRollupResults = () => {
    // Combined metrics
    const combinedRevenue = platform.revenue + targets.reduce((sum, t) => sum + t.revenue, 0);
    const combinedEbitdaBase = platform.ebitda + targets.reduce((sum, t) => sum + t.ebitda, 0);
    const totalSynergies = targets.reduce((sum, t) => sum + t.synergies, 0);
    const combinedEbitdaWithSynergies = combinedEbitdaBase + totalSynergies;
    
    // Investment required
    const totalAcquisitionCost = targets.reduce((sum, t) => sum + t.acquisitionCost, 0);
    const totalIntegrationCost = targets.reduce((sum, t) => sum + t.integrationCost, 0);
    const totalInvestment = totalAcquisitionCost + totalIntegrationCost;
    
    // Exit valuation
    const exitValuation = combinedEbitdaWithSynergies * rollupMultiple;
    const currentTotalValue = platform.currentValuation + targets.reduce((sum, t) => sum + (t.ebitda * t.multiple), 0);
    const valueCreated = exitValuation - currentTotalValue;
    const roi = totalInvestment > 0 ? valueCreated / totalInvestment : 0;
    
    return {
      combinedRevenue,
      combinedEbitdaBase,
      totalSynergies,
      combinedEbitdaWithSynergies,
      totalInvestment,
      exitValuation,
      valueCreated,
      roi,
      targetCount: targets.length
    };
  };

  const saveStrategy = async () => {
    if (!user) return;
    
    try {
      const results = calculateRollupResults();
      
      await supabase
        .from('user_financial_data')
        .upsert({
          user_id: user.id,
          source: 'rollup_strategy',
          rollup_targets: targets,
          rollup_multiple: rollupMultiple,
          rollup_results: results
        });
        
      toast.success('Roll-up strategy saved successfully');
    } catch (error) {
      toast.error('Failed to save roll-up strategy');
    }
  };

  const exportAnalysis = () => {
    const results = calculateRollupResults();
    
    const report = `# Roll-up Strategy Analysis
Generated: ${new Date().toLocaleDateString()}

## Platform Company
- Name: ${platform.name}
- Revenue: $${(platform.revenue / 1000000).toFixed(2)}M
- EBITDA: $${(platform.ebitda / 1000000).toFixed(2)}M
- Current Valuation: $${(platform.currentValuation / 1000000).toFixed(2)}M

## Target Acquisitions
${targets.map(target => `
### ${target.name}
- Revenue: $${(target.revenue / 1000000).toFixed(2)}M
- EBITDA: $${(target.ebitda / 1000000).toFixed(2)}M
- Acquisition Cost: $${(target.acquisitionCost / 1000000).toFixed(2)}M
- Expected Synergies: $${(target.synergies / 1000).toFixed(0)}K
`).join('\n')}

## Combined Pro Forma
- Combined Revenue: $${(results.combinedRevenue / 1000000).toFixed(2)}M
- Combined EBITDA (pre-synergy): $${(results.combinedEbitdaBase / 1000000).toFixed(2)}M
- Total Synergies: $${(results.totalSynergies / 1000000).toFixed(2)}M
- Pro Forma EBITDA: $${(results.combinedEbitdaWithSynergies / 1000000).toFixed(2)}M

## Investment & Returns
- Total Investment Required: $${(results.totalInvestment / 1000000).toFixed(2)}M
- Exit Valuation (${rollupMultiple}x): $${(results.exitValuation / 1000000).toFixed(2)}M
- Value Created: $${(results.valueCreated / 1000000).toFixed(2)}M
- ROI: ${(results.roi * 100).toFixed(1)}%
`;

    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Rollup-Strategy-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const results = calculateRollupResults();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-white/70">Loading roll-up builder...</div>
    </div>;
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="text-white/70">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <Building2 className="w-8 h-8 text-purple-400" />
              Roll-up Strategy Builder
            </h1>
            <p className="text-white/70">Combine multiple companies to create industry scale</p>
          </div>
        </div>

        {/* Platform Company */}
        <Card className="bg-purple-500/10 border-purple-500/30 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Building2 className="w-5 h-5 text-purple-400" />
              Platform Company (Your Business)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-white/70 text-sm mb-1">Company Name</label>
                <input
                  type="text"
                  value={platform.name}
                  onChange={(e) => setPlatform({...platform, name: e.target.value})}
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white"
                />
              </div>
              <div>
                <div className="text-white/70 text-sm">Revenue</div>
                <div className="text-xl font-bold text-white">
                  ${(platform.revenue / 1000000).toFixed(2)}M
                </div>
              </div>
              <div>
                <div className="text-white/70 text-sm">EBITDA</div>
                <div className="text-xl font-bold text-white">
                  ${(platform.ebitda / 1000000).toFixed(2)}M
                </div>
              </div>
              <div>
                <div className="text-white/70 text-sm">Current Valuation</div>
                <div className="text-xl font-bold text-white">
                  ${(platform.currentValuation / 1000000).toFixed(2)}M
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Target Companies */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Target Acquisitions</h2>
            <Button onClick={addTarget} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Target
            </Button>
          </div>

          <div className="space-y-4">
            {targets.map((target) => (
              <Card key={target.id} className="bg-white/5 border-white/10">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-8 gap-4 items-end">
                    <div>
                      <label className="block text-white/70 text-sm mb-1">Company Name</label>
                      <input
                        type="text"
                        value={target.name}
                        onChange={(e) => updateTarget(target.id, { name: e.target.value })}
                        className="w-full bg-black/30 border border-white/10 rounded px-2 py-1 text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 text-sm mb-1">Revenue</label>
                      <input
                        type="number"
                        value={target.revenue}
                        onChange={(e) => updateTarget(target.id, { revenue: Number(e.target.value) })}
                        className="w-full bg-black/30 border border-white/10 rounded px-2 py-1 text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 text-sm mb-1">EBITDA</label>
                      <input
                        type="number"
                        value={target.ebitda}
                        onChange={(e) => updateTarget(target.id, { ebitda: Number(e.target.value) })}
                        className="w-full bg-black/30 border border-white/10 rounded px-2 py-1 text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 text-sm mb-1">Multiple</label>
                      <input
                        type="number"
                        step="0.1"
                        value={target.multiple}
                        onChange={(e) => updateTarget(target.id, { multiple: Number(e.target.value) })}
                        className="w-full bg-black/30 border border-white/10 rounded px-2 py-1 text-white text-sm"
                      />
                    </div>
                    <div>
                      <div className="text-white/70 text-sm">Acq. Cost</div>
                      <div className="text-white text-sm font-medium">
                        ${(target.acquisitionCost / 1000000).toFixed(2)}M
                      </div>
                    </div>
                    <div>
                      <div className="text-white/70 text-sm">Synergies</div>
                      <div className="text-green-400 text-sm font-medium">
                        +${(target.synergies / 1000).toFixed(0)}K
                      </div>
                    </div>
                    <div>
                      <div className="text-white/70 text-sm">Integration</div>
                      <div className="text-white text-sm">
                        ${(target.integrationCost / 1000).toFixed(0)}K
                      </div>
                    </div>
                    <div>
                      <Button
                        onClick={() => removeTarget(target.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Strategy Parameters */}
        <Card className="bg-blue-500/10 border-blue-500/30 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Calculator className="w-5 h-5 text-blue-400" />
              Strategy Parameters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="flex justify-between text-sm text-white/70 mb-2">
                  <span>Exit Multiple</span>
                  <span className="text-white">{rollupMultiple.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="12"
                  step="0.5"
                  value={rollupMultiple}
                  onChange={(e) => setRollupMultiple(Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-xs text-white/50 mt-1">
                  Larger companies typically command higher multiples
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm text-white/70 mb-2">
                  <span>Expected Synergies</span>
                  <span className="text-white">{synergiesPct}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="5"
                  value={synergiesPct}
                  onChange={(e) => setSynergiesPct(Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-xs text-white/50 mt-1">
                  Cost savings and revenue synergies (% of combined EBITDA)
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm text-white/70 mb-2">
                  <span>Integration Costs</span>
                  <span className="text-white">{integrationCostPct}%</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="15"
                  step="1"
                  value={integrationCostPct}
                  onChange={(e) => setIntegrationCostPct(Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-xs text-white/50 mt-1">
                  One-time costs to integrate (% of acquisition cost)
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pro Forma Results */}
        <Card className="bg-green-500/10 border-green-500/30 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Target className="w-5 h-5 text-green-400" />
              Pro Forma Combined Company
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-4">
                <div>
                  <div className="text-white/70 text-sm">Combined Revenue</div>
                  <div className="text-2xl font-bold text-white">
                    ${(results.combinedRevenue / 1000000).toFixed(2)}M
                  </div>
                </div>
                <div>
                  <div className="text-white/70 text-sm">Pre-Synergy EBITDA</div>
                  <div className="text-xl font-bold text-white">
                    ${(results.combinedEbitdaBase / 1000000).toFixed(2)}M
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="text-white/70 text-sm">Total Synergies</div>
                  <div className="text-2xl font-bold text-green-400">
                    +${(results.totalSynergies / 1000000).toFixed(2)}M
                  </div>
                </div>
                <div>
                  <div className="text-white/70 text-sm">Pro Forma EBITDA</div>
                  <div className="text-xl font-bold text-green-400">
                    ${(results.combinedEbitdaWithSynergies / 1000000).toFixed(2)}M
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="text-white/70 text-sm">Total Investment</div>
                  <div className="text-2xl font-bold text-white">
                    ${(results.totalInvestment / 1000000).toFixed(2)}M
                  </div>
                </div>
                <div>
                  <div className="text-white/70 text-sm">Exit Valuation ({rollupMultiple}x)</div>
                  <div className="text-xl font-bold text-blue-400">
                    ${(results.exitValuation / 1000000).toFixed(2)}M
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="text-white/70 text-sm">Value Created</div>
                  <div className="text-2xl font-bold text-green-400">
                    ${(results.valueCreated / 1000000).toFixed(2)}M
                  </div>
                </div>
                <div>
                  <div className="text-white/70 text-sm">ROI</div>
                  <div className="text-xl font-bold text-green-400">
                    {(results.roi * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>

            {/* Success Metrics */}
            <div className="mt-6 pt-6 border-t border-white/20">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-white">{results.targetCount}</div>
                  <div className="text-white/70 text-sm">Acquisitions</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    {((results.combinedRevenue / platform.revenue) - 1).toFixed(1)}x
                  </div>
                  <div className="text-white/70 text-sm">Revenue Growth</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    {((results.exitValuation / platform.currentValuation) - 1).toFixed(1)}x
                  </div>
                  <div className="text-white/70 text-sm">Valuation Increase</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Roll-up Benefits */}
        <Card className="bg-white/5 border-white/10 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <TrendingUp className="w-5 h-5" />
              Roll-up Strategy Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-white font-medium mb-3">Operational Synergies</h4>
                <ul className="space-y-2 text-sm text-white/80">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    Economies of scale in purchasing
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    Shared overhead and administrative costs
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    Cross-selling opportunities
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    Best practice sharing
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-medium mb-3">Strategic Benefits</h4>
                <ul className="space-y-2 text-sm text-white/80">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    Market leadership position
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    Multiple arbitrage (buy small, sell large)
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    Geographic expansion
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    Enhanced buyer appeal
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button onClick={saveStrategy} className="flex-1">
            <Building2 className="w-4 h-4 mr-2" />
            Save Roll-up Strategy
          </Button>
          <Button onClick={exportAnalysis} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Analysis
          </Button>
          <Button variant="outline" onClick={() => navigate('/portal/week-2/scenarios')}>
            Model in Scenarios
          </Button>
        </div>
      </div>
    </div>
  );
}