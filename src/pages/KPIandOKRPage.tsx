import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Download, ChevronRight, BarChart3, Target, TrendingUp, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface KPIMetric {
  id: string;
  metricName: string;
  metricType: 'KPI' | 'OKR';
  category: 'Financial' | 'Operational' | 'Customer' | 'Growth' | 'Quality';
  currentValue: number;
  targetValue: number;
  unitOfMeasure: string;
  measurementFrequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly';
  startDate: string;
  targetDate: string;
  strategicInitiativeLink: string;
  valuationImpact: 'High' | 'Medium' | 'Low';
  ebitdaImpact: number;
  owner: string;
  department: string;
  status: 'Not Started' | 'On Track' | 'At Risk' | 'Behind' | 'Achieved';
}

interface KeyResult {
  id: string;
  keyResult: string;
  currentProgress: number;
  targetProgress: number;
  status: 'Not Started' | 'In Progress' | 'Completed';
}

const peValueDriverTemplates = [
  {
    metricName: "Customer Concentration",
    category: "Customer" as const,
    currentValue: 42,
    targetValue: 25,
    unitOfMeasure: "% of revenue",
    valuationImpact: "High" as const,
    ebitdaImpact: 500000
  },
  {
    metricName: "Gross Margin Improvement",
    category: "Financial" as const,
    currentValue: 35,
    targetValue: 42,
    unitOfMeasure: "%",
    valuationImpact: "High" as const,
    ebitdaImpact: 750000
  },
  {
    metricName: "Monthly Recurring Revenue",
    category: "Growth" as const,
    currentValue: 250000,
    targetValue: 400000,
    unitOfMeasure: "$",
    valuationImpact: "High" as const,
    ebitdaImpact: 1800000
  },
  {
    metricName: "Employee Turnover Rate",
    category: "Operational" as const,
    currentValue: 25,
    targetValue: 10,
    unitOfMeasure: "% annual",
    valuationImpact: "Medium" as const,
    ebitdaImpact: 200000
  },
  {
    metricName: "Customer NPS Score",
    category: "Quality" as const,
    currentValue: 32,
    targetValue: 50,
    unitOfMeasure: "score",
    valuationImpact: "Medium" as const,
    ebitdaImpact: 300000
  }
];

export default function KPIandOKRPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<KPIMetric[]>([]);
  const [keyResults, setKeyResults] = useState<Record<string, KeyResult[]>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'KPI' | 'OKR'>('KPI');
  const [showTemplates, setShowTemplates] = useState(false);

  useEffect(() => {
    loadMetrics();
    loadStrategyInitiatives();
  }, [user]);

  const loadMetrics = async () => {
    if (!user) return;
    
    try {
      const { data: metricsData, error: metricsError } = await supabase
        .from("kpi_metrics")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at");
        
      if (metricsError) throw metricsError;
      
      if (metricsData) {
        const formattedMetrics = metricsData.map(m => ({
          id: m.id,
          metricName: m.metric_name,
          metricType: m.metric_type as 'KPI' | 'OKR',
          category: m.category as KPIMetric['category'],
          currentValue: m.current_value || 0,
          targetValue: m.target_value || 0,
          unitOfMeasure: m.unit_of_measure || '',
          measurementFrequency: m.measurement_frequency as KPIMetric['measurementFrequency'],
          startDate: m.start_date || new Date().toISOString().split('T')[0],
          targetDate: m.target_date || '',
          strategicInitiativeLink: m.strategic_initiative_link || '',
          valuationImpact: m.valuation_impact as KPIMetric['valuationImpact'],
          ebitdaImpact: m.ebitda_impact || 0,
          owner: m.owner || '',
          department: m.department || '',
          status: m.status as KPIMetric['status']
        }));
        
        setMetrics(formattedMetrics);
        
        // Load OKR key results
        const okrIds = formattedMetrics.filter(m => m.metricType === 'OKR').map(m => m.id);
        if (okrIds.length > 0) {
          const { data: keyResultsData } = await supabase
            .from("okr_key_results")
            .select("*")
            .in("objective_id", okrIds);
            
          if (keyResultsData) {
            const groupedKeyResults = keyResultsData.reduce((acc, kr) => {
              if (!acc[kr.objective_id]) acc[kr.objective_id] = [];
              acc[kr.objective_id].push({
                id: kr.id,
                keyResult: kr.key_result,
                currentProgress: kr.current_progress || 0,
                targetProgress: kr.target_progress || 100,
                status: kr.status as KeyResult['status']
              });
              return acc;
            }, {} as Record<string, KeyResult[]>);
            
            setKeyResults(groupedKeyResults);
          }
        }
      }
    } catch (err) {
      console.error("Load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadStrategyInitiatives = async () => {
    if (!user) return;
    
    try {
      const { data } = await supabase
        .from("strategy_documents")
        .select("initiatives_90_day")
        .eq("user_id", user.id)
        .single();
        
      if (data?.initiatives_90_day && Array.isArray(data.initiatives_90_day) && metrics.length === 0) {
        // Pre-populate KPIs from strategy initiatives
        const initiativeKPIs = data.initiatives_90_day
          .filter((init: any) => init.metrics)
          .map((init: any) => ({
            id: crypto.randomUUID(),
            metricName: init.metrics,
            metricType: 'KPI' as const,
            category: 'Operational' as const,
            currentValue: 0,
            targetValue: 100,
            unitOfMeasure: '%',
            measurementFrequency: 'Monthly' as const,
            startDate: new Date().toISOString().split('T')[0],
            targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            strategicInitiativeLink: init.initiative,
            valuationImpact: 'Medium' as const,
            ebitdaImpact: 0,
            owner: init.owner || '',
            department: '',
            status: 'Not Started' as const
          }));
          
        if (initiativeKPIs.length > 0) {
          setMetrics(initiativeKPIs);
        }
      }
    } catch (err) {
      console.error("Error loading strategy initiatives:", err);
    }
  };

  const saveMetrics = async () => {
    if (!user || saving) return;
    
    setSaving(true);
    try {
      // Save KPIs/OKRs
      for (const metric of metrics) {
        const { error } = await supabase
          .from("kpi_metrics")
          .upsert({
            id: metric.id,
            user_id: user.id,
            metric_name: metric.metricName,
            metric_type: metric.metricType,
            category: metric.category,
            current_value: metric.currentValue,
            target_value: metric.targetValue,
            unit_of_measure: metric.unitOfMeasure,
            measurement_frequency: metric.measurementFrequency,
            start_date: metric.startDate,
            target_date: metric.targetDate,
            strategic_initiative_link: metric.strategicInitiativeLink,
            valuation_impact: metric.valuationImpact,
            ebitda_impact: metric.ebitdaImpact,
            owner: metric.owner,
            department: metric.department,
            status: metric.status,
            last_updated: new Date().toISOString()
          });
          
        if (error) throw error;
        
        // Save key results for OKRs
        if (metric.metricType === 'OKR' && keyResults[metric.id]) {
          // Delete existing key results
          await supabase
            .from("okr_key_results")
            .delete()
            .eq("objective_id", metric.id);
            
          // Insert new key results
          for (const kr of keyResults[metric.id]) {
            await supabase
              .from("okr_key_results")
              .insert({
                id: kr.id,
                objective_id: metric.id,
                key_result: kr.keyResult,
                current_progress: kr.currentProgress,
                target_progress: kr.targetProgress,
                status: kr.status
              });
          }
        }
      }
      
      toast.success("KPIs and OKRs saved!");
    } catch (err) {
      toast.error("Failed to save metrics");
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  const addMetric = (type: 'KPI' | 'OKR', template?: typeof peValueDriverTemplates[0]) => {
    if (metrics.length >= 10) {
      toast.error("Maximum 10 metrics allowed");
      return;
    }

    const newMetric: KPIMetric = {
      id: crypto.randomUUID(),
      metricName: template?.metricName || '',
      metricType: type,
      category: template?.category || 'Financial',
      currentValue: template?.currentValue || 0,
      targetValue: template?.targetValue || 0,
      unitOfMeasure: template?.unitOfMeasure || '',
      measurementFrequency: 'Monthly',
      startDate: new Date().toISOString().split('T')[0],
      targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      strategicInitiativeLink: '',
      valuationImpact: template?.valuationImpact || 'Medium',
      ebitdaImpact: template?.ebitdaImpact || 0,
      owner: '',
      department: '',
      status: 'Not Started'
    };

    setMetrics([...metrics, newMetric]);
    
    if (type === 'OKR') {
      setKeyResults({
        ...keyResults,
        [newMetric.id]: [
          { id: crypto.randomUUID(), keyResult: '', currentProgress: 0, targetProgress: 100, status: 'Not Started' }
        ]
      });
    }
  };

  const updateMetric = (id: string, updates: Partial<KPIMetric>) => {
    setMetrics(metrics.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const removeMetric = (id: string) => {
    setMetrics(metrics.filter(m => m.id !== id));
    if (keyResults[id]) {
      const newKeyResults = { ...keyResults };
      delete newKeyResults[id];
      setKeyResults(newKeyResults);
    }
  };

  const addKeyResult = (objectiveId: string) => {
    const currentKRs = keyResults[objectiveId] || [];
    if (currentKRs.length >= 5) {
      toast.error("Maximum 5 key results per objective");
      return;
    }
    
    setKeyResults({
      ...keyResults,
      [objectiveId]: [...currentKRs, {
        id: crypto.randomUUID(),
        keyResult: '',
        currentProgress: 0,
        targetProgress: 100,
        status: 'Not Started'
      }]
    });
  };

  const updateKeyResult = (objectiveId: string, krId: string, updates: Partial<KeyResult>) => {
    setKeyResults({
      ...keyResults,
      [objectiveId]: keyResults[objectiveId].map(kr => 
        kr.id === krId ? { ...kr, ...updates } : kr
      )
    });
  };

  const removeKeyResult = (objectiveId: string, krId: string) => {
    setKeyResults({
      ...keyResults,
      [objectiveId]: keyResults[objectiveId].filter(kr => kr.id !== krId)
    });
  };

  const calculateProgress = (metric: KPIMetric) => {
    if (metric.targetValue === 0) return 0;
    const progress = (metric.currentValue / metric.targetValue) * 100;
    return Math.min(Math.round(progress), 100);
  };

  const getTotalEBITDAImpact = () => {
    return metrics.reduce((sum, metric) => sum + (metric.ebitdaImpact || 0), 0);
  };

  const getStatusColor = (status: KPIMetric['status']) => {
    switch (status) {
      case 'Achieved': return 'text-green-400';
      case 'On Track': return 'text-blue-400';
      case 'At Risk': return 'text-yellow-400';
      case 'Behind': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const exportMetrics = () => {
    const doc = `# KPIs and OKRs
Generated: ${new Date().toLocaleDateString()}
Total EBITDA Impact: $${getTotalEBITDAImpact().toLocaleString()}

## Key Performance Indicators (KPIs)
${metrics.filter(m => m.metricType === 'KPI').map(kpi => `
### ${kpi.metricName}
- **Category:** ${kpi.category}
- **Current:** ${kpi.currentValue} ${kpi.unitOfMeasure}
- **Target:** ${kpi.targetValue} ${kpi.unitOfMeasure}
- **Progress:** ${calculateProgress(kpi)}%
- **Status:** ${kpi.status}
- **Owner:** ${kpi.owner || 'Unassigned'}
- **Frequency:** ${kpi.measurementFrequency}
- **EBITDA Impact:** $${kpi.ebitdaImpact.toLocaleString()}
- **Valuation Impact:** ${kpi.valuationImpact}
- **Strategic Initiative:** ${kpi.strategicInitiativeLink || 'None'}
`).join('\n')}

## Objectives and Key Results (OKRs)
${metrics.filter(m => m.metricType === 'OKR').map(okr => `
### Objective: ${okr.metricName}
- **Owner:** ${okr.owner || 'Unassigned'}
- **Status:** ${okr.status}
- **Valuation Impact:** ${okr.valuationImpact}

**Key Results:**
${(keyResults[okr.id] || []).map((kr, i) => `
${i + 1}. ${kr.keyResult}
   - Progress: ${kr.currentProgress}%
   - Status: ${kr.status}
`).join('\n')}
`).join('\n')}`;

    const blob = new Blob([doc], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KPIs-OKRs-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><div className="text-white/70">Loading...</div></div>;
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">KPIs & OKRs</h1>
          <p className="text-white/70">Define and track the metrics that drive your business value</p>
          <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-sm text-blue-300">
              <BarChart3 className="w-4 h-4 inline mr-1" />
              Total EBITDA Impact: <span className="font-bold">${getTotalEBITDAImpact().toLocaleString()}</span>
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('KPI')}
            className={`px-6 py-3 rounded-lg transition ${
              activeTab === 'KPI' ? 'bg-blue-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            KPIs ({metrics.filter(m => m.metricType === 'KPI').length})
          </button>
          <button
            onClick={() => setActiveTab('OKR')}
            className={`px-6 py-3 rounded-lg transition ${
              activeTab === 'OKR' ? 'bg-blue-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            OKRs ({metrics.filter(m => m.metricType === 'OKR').length})
          </button>
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="ml-auto px-4 py-3 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition"
          >
            PE Value Drivers
          </button>
        </div>

        {/* Templates */}
        {showTemplates && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <h3 className="text-white font-semibold mb-3">Quick Add: PE Value Driver Templates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {peValueDriverTemplates.map((template, index) => (
                <button
                  key={index}
                  onClick={() => {
                    addMetric('KPI', template);
                    setShowTemplates(false);
                  }}
                  className="text-left p-3 bg-black/30 border border-white/10 rounded-lg hover:bg-white/10 transition"
                >
                  <p className="text-white text-sm font-medium">{template.metricName}</p>
                  <p className="text-white/60 text-xs">{template.currentValue} → {template.targetValue} {template.unitOfMeasure}</p>
                  <p className="text-green-400 text-xs mt-1">+${template.ebitdaImpact.toLocaleString()} EBITDA</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* KPI Tab */}
        {activeTab === 'KPI' && (
          <div className="space-y-4">
            {metrics.filter(m => m.metricType === 'KPI').map((kpi) => (
              <div key={kpi.id} className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={kpi.metricName}
                      onChange={(e) => updateMetric(kpi.id, { metricName: e.target.value })}
                      className="text-lg font-semibold bg-transparent border-b border-white/20 text-white mb-2 w-full"
                      placeholder="KPI Name"
                    />
                    <div className="flex items-center gap-4 text-sm">
                      <span className={getStatusColor(kpi.status)}>{kpi.status}</span>
                      <span className="text-white/60">Progress: {calculateProgress(kpi)}%</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeMetric(kpi.id)}
                    className="text-red-400 hover:text-red-300 ml-4"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm text-white/70 mb-1">Category</label>
                    <select
                      value={kpi.category}
                      onChange={(e) => updateMetric(kpi.id, { category: e.target.value as KPIMetric['category'] })}
                      className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="Financial">Financial</option>
                      <option value="Operational">Operational</option>
                      <option value="Customer">Customer</option>
                      <option value="Growth">Growth</option>
                      <option value="Quality">Quality</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-white/70 mb-1">Current Value</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={kpi.currentValue}
                        onChange={(e) => updateMetric(kpi.id, { currentValue: Number(e.target.value) })}
                        className="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white"
                      />
                      <input
                        type="text"
                        value={kpi.unitOfMeasure}
                        onChange={(e) => updateMetric(kpi.id, { unitOfMeasure: e.target.value })}
                        className="w-20 bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white"
                        placeholder="unit"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-white/70 mb-1">Target Value</label>
                    <input
                      type="number"
                      value={kpi.targetValue}
                      onChange={(e) => updateMetric(kpi.id, { targetValue: Number(e.target.value) })}
                      className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-sm text-white/70 mb-1">Owner</label>
                    <input
                      type="text"
                      value={kpi.owner}
                      onChange={(e) => updateMetric(kpi.id, { owner: e.target.value })}
                      className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white"
                      placeholder="e.g., CFO"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-white/70 mb-1">Frequency</label>
                    <select
                      value={kpi.measurementFrequency}
                      onChange={(e) => updateMetric(kpi.id, { measurementFrequency: e.target.value as KPIMetric['measurementFrequency'] })}
                      className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="Daily">Daily</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Quarterly">Quarterly</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-white/70 mb-1">Valuation Impact</label>
                    <select
                      value={kpi.valuationImpact}
                      onChange={(e) => updateMetric(kpi.id, { valuationImpact: e.target.value as KPIMetric['valuationImpact'] })}
                      className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-white/70 mb-1">EBITDA Impact</label>
                    <input
                      type="number"
                      value={kpi.ebitdaImpact}
                      onChange={(e) => updateMetric(kpi.id, { ebitdaImpact: Number(e.target.value) })}
                      className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white"
                      placeholder="$"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm text-white/70 mb-1">Linked Initiative</label>
                    <input
                      type="text"
                      value={kpi.strategicInitiativeLink}
                      onChange={(e) => updateMetric(kpi.id, { strategicInitiativeLink: e.target.value })}
                      className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white"
                      placeholder="e.g., Customer Diversification Sprint"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/70 mb-1">Status</label>
                    <select
                      value={kpi.status}
                      onChange={(e) => updateMetric(kpi.id, { status: e.target.value as KPIMetric['status'] })}
                      className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="Not Started">Not Started</option>
                      <option value="On Track">On Track</option>
                      <option value="At Risk">At Risk</option>
                      <option value="Behind">Behind</option>
                      <option value="Achieved">Achieved</option>
                    </select>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/60">Progress</span>
                    <span className="text-white">{calculateProgress(kpi)}%</span>
                  </div>
                  <div className="w-full bg-black/30 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${calculateProgress(kpi)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}

            {metrics.filter(m => m.metricType === 'KPI').length < 10 && (
              <button
                onClick={() => addMetric('KPI')}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-4 text-white/70 hover:bg-white/10 transition flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" /> Add KPI
              </button>
            )}
          </div>
        )}

        {/* OKR Tab */}
        {activeTab === 'OKR' && (
          <div className="space-y-4">
            {metrics.filter(m => m.metricType === 'OKR').map((okr) => (
              <div key={okr.id} className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-5 h-5 text-blue-400" />
                      <input
                        type="text"
                        value={okr.metricName}
                        onChange={(e) => updateMetric(okr.id, { metricName: e.target.value })}
                        className="text-lg font-semibold bg-transparent border-b border-white/20 text-white flex-1"
                        placeholder="Objective"
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <input
                        type="text"
                        value={okr.owner}
                        onChange={(e) => updateMetric(okr.id, { owner: e.target.value })}
                        className="bg-black/30 border border-white/10 rounded-lg px-3 py-1 text-white text-sm"
                        placeholder="Owner"
                      />
                      <select
                        value={okr.valuationImpact}
                        onChange={(e) => updateMetric(okr.id, { valuationImpact: e.target.value as KPIMetric['valuationImpact'] })}
                        className="bg-black/30 border border-white/10 rounded-lg px-3 py-1 text-white text-sm"
                      >
                        <option value="High">High Impact</option>
                        <option value="Medium">Medium Impact</option>
                        <option value="Low">Low Impact</option>
                      </select>
                      <span className={`text-sm ${getStatusColor(okr.status)}`}>{okr.status}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeMetric(okr.id)}
                    className="text-red-400 hover:text-red-300 ml-4"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Key Results */}
                <div className="ml-7 space-y-3">
                  <h4 className="text-sm font-medium text-white/70 mb-2">Key Results:</h4>
                  {(keyResults[okr.id] || []).map((kr, index) => (
                    <div key={kr.id} className="bg-black/20 rounded-lg p-3">
                      <div className="flex items-start gap-3">
                        <span className="text-white/50 text-sm mt-1">{index + 1}.</span>
                        <div className="flex-1">
                          <input
                            type="text"
                            value={kr.keyResult}
                            onChange={(e) => updateKeyResult(okr.id, kr.id, { keyResult: e.target.value })}
                            className="w-full bg-transparent border-b border-white/20 text-white mb-2"
                            placeholder="Key result"
                          />
                          <div className="flex items-center gap-4">
                            <div className="flex-1">
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-white/50">Progress</span>
                                <span className="text-white">{kr.currentProgress}%</span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={kr.currentProgress}
                                onChange={(e) => updateKeyResult(okr.id, kr.id, { currentProgress: Number(e.target.value) })}
                                className="w-full"
                              />
                            </div>
                            <select
                              value={kr.status}
                              onChange={(e) => updateKeyResult(okr.id, kr.id, { status: e.target.value as KeyResult['status'] })}
                              className="bg-black/30 border border-white/10 rounded px-2 py-1 text-xs text-white"
                            >
                              <option value="Not Started">Not Started</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Completed">Completed</option>
                            </select>
                            <button
                              onClick={() => removeKeyResult(okr.id, kr.id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {(!keyResults[okr.id] || keyResults[okr.id].length < 5) && (
                    <button
                      onClick={() => addKeyResult(okr.id)}
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      + Add Key Result
                    </button>
                  )}
                </div>
              </div>
            ))}

            {metrics.filter(m => m.metricType === 'OKR').length < 5 && (
              <button
                onClick={() => addMetric('OKR')}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-4 text-white/70 hover:bg-white/10 transition flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" /> Add Objective
              </button>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={saveMetrics}
            disabled={saving}
            className="flex-1 bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Metrics"}
          </button>
          
          <button
            onClick={exportMetrics}
            className="bg-white/10 text-white py-3 px-6 rounded-lg hover:bg-white/20 transition"
          >
            <Download className="w-5 h-5 inline mr-2" /> Export
          </button>
          
          <button
            onClick={() => navigate("/portal/week-2/ebitda-calculator")}
            className="bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition flex items-center gap-2"
          >
            Next: EBITDA Impact <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}