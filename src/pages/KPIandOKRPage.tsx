import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { 
  Plus, 
  Trash2, 
  Download, 
  ChevronRight, 
  BarChart3, 
  Target, 
  TrendingUp, 
  AlertCircle,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  ArrowRight,
  Info,
  Edit3,
  ChevronDown
} from "lucide-react";
import { toast } from "sonner";
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

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

// Simplified Gauge Component
const SimpleGauge = ({ value, label, status }: any) => {
  const getColor = () => {
    if (status === 'green') return 'text-green-400';
    if (status === 'amber') return 'text-yellow-400';
    return 'text-red-400';
  };
  
  return (
    <div className="text-center">
      <div className="relative w-28 h-28 mx-auto">
        <svg className="transform -rotate-90 w-28 h-28">
          <circle
            cx="56"
            cy="56"
            r="48"
            stroke="currentColor"
            strokeWidth="10"
            fill="none"
            className="text-white/10"
          />
          <circle
            cx="56"
            cy="56"
            r="48"
            stroke="currentColor"
            strokeWidth="10"
            fill="none"
            strokeDasharray={`${value * 3.01} 301.59`}
            className={getColor()}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-white">{value}%</span>
        </div>
      </div>
      <p className="text-sm text-white/70 mt-2">{label}</p>
    </div>
  );
};

// Trend Sparkline Component
const TrendLine = ({ data, positive }: any) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const points = data.map((val: number, i: number) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((val - min) / (max - min)) * 100;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <div className="flex items-center gap-2">
      <svg className="w-20 h-10" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline
          points={points}
          fill="none"
          stroke={positive ? '#10b981' : '#ef4444'}
          strokeWidth="3"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {positive ? (
        <TrendingUp className="w-4 h-4 text-green-400" />
      ) : (
        <TrendingDown className="w-4 h-4 text-red-400" />
      )}
    </div>
  );
};

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
  const [showSetup, setShowSetup] = useState(false);

  // Dashboard state
  const [dashboardMetrics, setDashboardMetrics] = useState([
    {
      id: '1',
      name: 'EBITDA Margin',
      current: 18,
      target: 25,
      unit: '%',
      trend: [15, 16, 16, 17, 17, 18, 18, 18],
      valueImpact: 1200000,
      status: 'amber',
      action: 'Reduce operating expenses by 10%',
      progress: 52
    },
    {
      id: '2',
      name: 'Customer Concentration',
      current: 35,
      target: 20,
      unit: '%',
      trend: [45, 44, 42, 40, 38, 36, 35, 35],
      valueImpact: 1500000,
      status: 'red',
      action: 'Add 5 new customers over $100K',
      progress: 33,
      inverse: true
    },
    {
      id: '3',
      name: 'Recurring Revenue',
      current: 45,
      target: 70,
      unit: '%',
      trend: [30, 32, 35, 38, 40, 42, 45, 45],
      valueImpact: 900000,
      status: 'amber',
      action: 'Convert 10 project clients to retainers',
      progress: 56
    },
    {
      id: '4',
      name: 'Revenue Growth YoY',
      current: 22,
      target: 30,
      unit: '%',
      trend: [10, 12, 15, 18, 20, 22, 22, 22],
      valueImpact: 800000,
      status: 'green',
      action: 'Launch new service line Q2',
      progress: 73
    },
    {
      id: '5',
      name: 'Customer Retention',
      current: 85,
      target: 95,
      unit: '%',
      trend: [80, 82, 83, 84, 84, 85, 85, 85],
      valueImpact: 600000,
      status: 'amber',
      action: 'Implement quarterly business reviews',
      progress: 50
    }
  ]);

  const [summaryData, setSummaryData] = useState({
    totalValueAtRisk: 5000000,
    capturedValue: 1800000,
    remainingOpportunity: 3200000,
    overallHealth: 'amber',
    daysToNextReview: 28
  });

  useEffect(() => {
    loadMetrics();
    loadStrategyInitiatives();
  }, [user]);

  // Determine if setup should be shown by default
  useEffect(() => {
    setShowSetup(metrics.length === 0);
  }, [metrics]);

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
        
        // Convert database metrics to dashboard format
        if (formattedMetrics.length > 0) {
          const convertedDashboardMetrics = formattedMetrics.slice(0, 5).map((metric, index) => ({
            id: metric.id,
            name: metric.metricName,
            current: metric.currentValue,
            target: metric.targetValue,
            unit: metric.unitOfMeasure,
            trend: [metric.currentValue * 0.7, metric.currentValue * 0.8, metric.currentValue * 0.9, metric.currentValue],
            valueImpact: metric.ebitdaImpact,
            status: metric.status === 'Achieved' ? 'green' : metric.status === 'On Track' ? 'amber' : 'red',
            action: `Improve ${metric.metricName.toLowerCase()}`,
            progress: calculateProgress(metric)
          }));
          setDashboardMetrics(convertedDashboardMetrics);
        }
        
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
      // Refresh dashboard data
      loadMetrics();
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

  const getTopOpportunities = () => {
    return dashboardMetrics
      .filter(m => m.status !== 'green')
      .sort((a, b) => b.valueImpact - a.valueImpact)
      .slice(0, 3);
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
    return <div className="flex items-center justify-center min-h-screen"><div className="text-white/70">Loading your value drivers...</div></div>;
  }

  const topOpportunities = getTopOpportunities();

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">KPIs & Performance Dashboard</h1>
          <p className="text-white/70">Define, track, and optimize your value drivers</p>
        </div>

        {/* Setup Section (Collapsible) */}
        <Card className="mb-8 bg-white/5 border-white/10">
          <div 
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
            onClick={() => setShowSetup(!showSetup)}
          >
            <div className="flex items-center gap-3">
              <Edit3 className="w-5 h-5 text-blue-400" />
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {metrics.length === 0 ? "Let's define your first value drivers" : "Edit Metrics"}
                </h2>
                <p className="text-white/70 text-sm">
                  {metrics.length === 0 
                    ? "Start by creating KPIs and OKRs that drive your business value"
                    : `${metrics.length} metrics defined • Click to modify`
                  }
                </p>
              </div>
            </div>
            <ChevronDown className={`w-5 h-5 text-white/70 transition-transform ${showSetup ? 'rotate-180' : ''}`} />
          </div>
          
          {showSetup && (
            <div className="px-6 pb-6 border-t border-white/10">
              {/* Setup content - existing KPI/OKR creation functionality */}
              <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-sm text-blue-300">
                  <BarChart3 className="w-4 h-4 inline mr-1" />
                  Total EBITDA Impact: <span className="font-bold">${getTotalEBITDAImpact().toLocaleString()}</span>
                </p>
              </div>

              {/* Tab Navigation */}
              <div className="flex gap-2 mt-6 mb-6">
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

              {/* Add buttons */}
              <div className="flex gap-4 mb-6">
                <Button 
                  onClick={() => addMetric('KPI')}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add KPI
                </Button>
                <Button 
                  onClick={() => addMetric('OKR')}
                  className="bg-purple-500 hover:bg-purple-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add OKR
                </Button>
              </div>

              {/* Simplified metrics list for setup */}
              {metrics.length > 0 && (
                <div className="space-y-3 mb-6">
                  {metrics.filter(m => m.metricType === activeTab).map((metric) => (
                    <div key={metric.id} className="bg-black/20 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <input
                          type="text"
                          value={metric.metricName}
                          onChange={(e) => updateMetric(metric.id, { metricName: e.target.value })}
                          className="text-lg font-semibold bg-transparent border-b border-white/20 text-white mb-2 flex-1"
                          placeholder="Metric Name"
                        />
                        <button
                          onClick={() => removeMetric(metric.id)}
                          className="text-red-400 hover:text-red-300 ml-4"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="text-xs text-white/60">Current Value</label>
                          <input
                            type="number"
                            value={metric.currentValue}
                            onChange={(e) => updateMetric(metric.id, { currentValue: Number(e.target.value) })}
                            className="w-full bg-black/20 border border-white/20 text-white p-2 rounded text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-white/60">Target Value</label>
                          <input
                            type="number"
                            value={metric.targetValue}
                            onChange={(e) => updateMetric(metric.id, { targetValue: Number(e.target.value) })}
                            className="w-full bg-black/20 border border-white/20 text-white p-2 rounded text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-white/60">Unit</label>
                          <input
                            type="text"
                            value={metric.unitOfMeasure}
                            onChange={(e) => updateMetric(metric.id, { unitOfMeasure: e.target.value })}
                            className="w-full bg-black/20 border border-white/20 text-white p-2 rounded text-sm"
                            placeholder="%,$,etc"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Save buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={saveMetrics}
                  disabled={saving}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  {saving ? 'Saving...' : 'Save Metrics'}
                </Button>
                <Button
                  onClick={exportMetrics}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Dashboard Section (Always Visible) */}
        {metrics.length > 0 && (
          <>
            {/* Executive Summary - 3 Cards Only */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 border-green-500/30 p-6">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="w-8 h-8 text-green-400" />
                  <span className="text-xs text-green-400 font-medium">OPPORTUNITY</span>
                </div>
                <p className="text-3xl font-bold text-white mb-1">
                  ${(summaryData.remainingOpportunity / 1000000).toFixed(1)}M
                </p>
                <p className="text-sm text-white/70">Additional value available</p>
              </Card>
              
              <Card className="bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border-blue-500/30 p-6">
                <div className="flex items-center justify-between mb-2">
                  <Target className="w-8 h-8 text-blue-400" />
                  <span className="text-xs text-blue-400 font-medium">CAPTURED</span>
                </div>
                <p className="text-3xl font-bold text-white mb-1">
                  ${(summaryData.capturedValue / 1000000).toFixed(1)}M
                </p>
                <p className="text-sm text-white/70">Value already created</p>
              </Card>
              
              <Card className={`bg-gradient-to-br ${
                summaryData.overallHealth === 'green' 
                  ? 'from-green-500/20 to-green-600/20 border-green-500/30'
                  : summaryData.overallHealth === 'amber'
                  ? 'from-yellow-500/20 to-amber-600/20 border-yellow-500/30'
                  : 'from-red-500/20 to-red-600/20 border-red-500/30'
              } p-6`}>
                <div className="flex items-center justify-between mb-2">
                  {summaryData.overallHealth === 'green' ? (
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  ) : (
                    <AlertTriangle className={`w-8 h-8 ${
                      summaryData.overallHealth === 'amber' ? 'text-yellow-400' : 'text-red-400'
                    }`} />
                  )}
                  <span className={`text-xs font-medium ${
                    summaryData.overallHealth === 'green' ? 'text-green-400' :
                    summaryData.overallHealth === 'amber' ? 'text-yellow-400' : 'text-red-400'
                  }`}>STATUS</span>
                </div>
                <p className="text-3xl font-bold text-white mb-1 capitalize">
                  {summaryData.overallHealth}
                </p>
                <p className="text-sm text-white/70">Overall health score</p>
              </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Metrics Overview - 2 columns */}
              <div className="lg:col-span-2">
                <Card className="bg-white/5 border-white/10 p-6">
                  <h2 className="text-xl font-semibold text-white mb-6">Performance Overview</h2>
                  
                  {/* Top 3 Gauges */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {dashboardMetrics.slice(0, 3).map(metric => (
                      <SimpleGauge
                        key={metric.id}
                        value={metric.progress}
                        label={metric.name}
                        status={metric.status}
                      />
                    ))}
                  </div>
                  
                  {/* All Metrics List */}
                  <div className="space-y-3">
                    {dashboardMetrics.map(metric => (
                      <div key={metric.id} className="bg-black/20 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${
                              metric.status === 'green' ? 'bg-green-400' :
                              metric.status === 'amber' ? 'bg-yellow-400' :
                              'bg-red-400'
                            }`} />
                            <h3 className="font-medium text-white">{metric.name}</h3>
                          </div>
                          <TrendLine 
                            data={metric.trend} 
                            positive={metric.trend[metric.trend.length - 1] > metric.trend[0]}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-baseline gap-2 mb-1">
                              <span className="text-2xl font-bold text-white">
                                {metric.current}{metric.unit}
                              </span>
                              <span className="text-sm text-white/60">
                                / {metric.target}{metric.unit}
                              </span>
                            </div>
                            <Progress value={metric.progress} className="h-1.5" />
                          </div>
                          <div className="text-right ml-4">
                            <p className="text-sm font-medium text-green-400">
                              +${(metric.valueImpact / 1000).toFixed(0)}K
                            </p>
                            <p className="text-xs text-white/60">potential</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Action Focus - 1 column */}
              <div>
                <Card className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-500/30 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                    <h2 className="text-lg font-semibold text-white">Focus Actions</h2>
                  </div>
                  
                  <p className="text-sm text-white/70 mb-4">
                    Complete these for maximum impact:
                  </p>
                  
                  <div className="space-y-3">
                    {topOpportunities.map((metric, index) => (
                      <div key={metric.id} className="bg-black/20 rounded-lg p-3">
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-xs font-bold text-amber-400">
                            #{index + 1} PRIORITY
                          </span>
                          <span className="text-xs text-green-400 font-medium">
                            +${(metric.valueImpact / 1000).toFixed(0)}K
                          </span>
                        </div>
                        <h4 className="font-medium text-white mb-1">{metric.name}</h4>
                        <p className="text-sm text-white/80 mb-2">{metric.action}</p>
                        <button className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1">
                          Get detailed plan
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <p className="text-xs text-white/70 mb-1">Complete all 3 actions:</p>
                    <p className="text-lg font-bold text-green-400">
                      +${(topOpportunities.reduce((sum, m) => sum + m.valueImpact, 0) / 1000000).toFixed(1)}M
                    </p>
                    <p className="text-xs text-white/70">in additional value</p>
                  </div>
                </Card>
              </div>
            </div>

            {/* Bottom CTA */}
            <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-4">
                  <Info className="w-6 h-6 text-blue-400 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">
                      Next Review: {summaryData.daysToNextReview} days
                    </h3>
                    <p className="text-white/70">
                      Stay on track with monthly performance reviews to maximize your exit value.
                    </p>
                  </div>
                </div>
                <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition whitespace-nowrap">
                  Schedule Review
                </button>
              </div>
            </Card>
          </>
        )}

        {/* Empty state when no metrics */}
        {metrics.length === 0 && !showSetup && (
          <Card className="bg-white/5 border-white/10 p-8 text-center">
            <Target className="w-16 h-16 text-white/40 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No KPIs defined yet</h3>
            <p className="text-white/70 mb-4">Create your first value drivers to see your performance dashboard</p>
            <Button 
              onClick={() => setShowSetup(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First KPI
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}