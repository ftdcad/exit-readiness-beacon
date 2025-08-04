// EBITDA CALCULATOR PAGE - TRUE SIDE-BY-SIDE COMPARISON
// src/pages/EBITDACalculatorPage.tsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { calculateEBITDA } from '@/lib/calculations/ebitda';
import { 
  Calculator, 
  Copy, 
  RefreshCw, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle,
  FileText,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

interface CalculatorData {
  revenue: number;
  cogs: number;
  opex: number;
  ownerSalary: number;
  personalVehicle: number;
  travelMeals: number;
  legalFees: number;
  otherNonRecurring: number;
}

const emptyCalculatorData: CalculatorData = {
  revenue: 0,
  cogs: 0,
  opex: 0,
  ownerSalary: 0,
  personalVehicle: 0,
  travelMeals: 0,
  legalFees: 0,
  otherNonRecurring: 0
};

export default function EBITDACalculatorPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hasUploadedPnL, setHasUploadedPnL] = useState(false);
  const [savingA, setSavingA] = useState(false);
  const [savingB, setSavingB] = useState(false);
  
  // Two separate calculator states
  const [calculatorA, setCalculatorA] = useState<CalculatorData>(emptyCalculatorData);
  const [calculatorB, setCalculatorB] = useState<CalculatorData>(emptyCalculatorData);
  
  // Labels for each calculator
  const [labelA, setLabelA] = useState('Actual Financials');
  const [labelB, setLabelB] = useState('Scenario Analysis');

  useEffect(() => {
    checkDataRoomDocuments();
    loadFinancialData();
  }, [user]);

  const checkDataRoomDocuments = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('data_room_documents')
        .select('*')
        .eq('user_id', user.id)
        .eq('category', 'Financials')
        .eq('subcategory', 'Income Statements')
        .eq('is_active', true)
        .eq('document_type', 'Income Statement');

      setHasUploadedPnL(data && data.length > 0);
    } catch (error) {
      console.error('Error checking documents:', error);
    }
  };

  const loadFinancialData = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('user_financial_data')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data) {
        // Load actual data into both calculators with same baseline
        const baselineData = {
          revenue: data.revenue || 0,
          cogs: data.cogs || 0,
          opex: data.opex || 0,
          ownerSalary: data.owner_salary || 0,
          personalVehicle: data.personal_vehicle || 0,
          travelMeals: data.travel_meals || 0,
          legalFees: data.legal_fees || 0,
          otherNonRecurring: data.other_non_recurring || 0
        };
        
        setCalculatorA(baselineData);
        setCalculatorB(baselineData); // Start scenario with same baseline
      }
    } catch (error) {
      console.error('Error loading financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveCalculatorData = async (calculator: 'A' | 'B', data: CalculatorData) => {
    if (!user) return;

    const setSaving = calculator === 'A' ? setSavingA : setSavingB;
    setSaving(true);

    try {
      const { error } = await supabase
        .from('user_financial_data')
        .upsert({
          user_id: user.id,
          source: calculator === 'A' ? 'actual' : 'scenario',
          revenue: data.revenue,
          cogs: data.cogs,
          opex: data.opex,
          owner_salary: data.ownerSalary,
          personal_vehicle: data.personalVehicle,
          travel_meals: data.travelMeals,
          legal_fees: data.legalFees,
          other_non_recurring: data.otherNonRecurring
        });

      if (error) throw error;

      toast.success(`Calculator ${calculator} saved successfully`);
    } catch (error) {
      toast.error(`Failed to save Calculator ${calculator}`);
    } finally {
      setSaving(false);
    }
  };

  const loadMockData = () => {
    const mockData: CalculatorData = {
      revenue: 2500000,
      cogs: 1100000,
      opex: 950000,
      ownerSalary: 175000,
      personalVehicle: 18000,
      travelMeals: 25000,
      legalFees: 12000,
      otherNonRecurring: 0
    };
    
    setCalculatorA(mockData);
    setCalculatorB(mockData); // Start scenario with same baseline
    toast.success('Mock data loaded - Acme Manufacturing LLC');
  };

  const copyToCalculator = (from: 'A' | 'B') => {
    if (from === 'A') {
      setCalculatorB(calculatorA);
      toast.success('Copied to Calculator B');
    } else {
      setCalculatorA(calculatorB);
      toast.success('Copied to Calculator A');
    }
  };

  const resetCalculator = (calculator: 'A' | 'B') => {
    if (calculator === 'A') {
      setCalculatorA(emptyCalculatorData);
    } else {
      setCalculatorB(emptyCalculatorData);
    }
    toast.success(`Calculator ${calculator} reset`);
  };

  // Calculate results for both calculators
  const resultsA = calculateEBITDA({
    revenue: calculatorA.revenue,
    cogs: calculatorA.cogs,
    opex: calculatorA.opex,
    addbacks: {
      ownerSalary: calculatorA.ownerSalary,
      personalVehicle: calculatorA.personalVehicle,
      travelMeals: calculatorA.travelMeals,
      legalFees: calculatorA.legalFees,
      otherNonRecurring: calculatorA.otherNonRecurring
    }
  });

  const resultsB = calculateEBITDA({
    revenue: calculatorB.revenue,
    cogs: calculatorB.cogs,
    opex: calculatorB.opex,
    addbacks: {
      ownerSalary: calculatorB.ownerSalary,
      personalVehicle: calculatorB.personalVehicle,
      travelMeals: calculatorB.travelMeals,
      legalFees: calculatorB.legalFees,
      otherNonRecurring: calculatorB.otherNonRecurring
    }
  });

  // Calculate delta between calculators
  const delta = {
    revenue: calculatorB.revenue - calculatorA.revenue,
    ebitda: resultsB.adjustedEBITDA - resultsA.adjustedEBITDA,
    margin: resultsB.margin - resultsA.margin,
    valuation: (resultsB.adjustedEBITDA * 4.5) - (resultsA.adjustedEBITDA * 4.5)
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-white/70" />
      </div>
    );
  }

  // No P&L uploaded state
  if (!hasUploadedPnL) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white/5 border border-white/10 rounded-xl p-8 backdrop-blur-sm text-center">
          <FileText className="w-16 h-16 text-white/40 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Upload Your P&L Statement First</h2>
          <p className="text-white/70 mb-6">
            To use the EBITDA Calculator, please upload your Profit & Loss statement to the Data Room first.
            This ensures accurate calculations based on your actual financial data.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/portal/week-1/data-room')}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition inline-flex items-center gap-2"
            >
              Go to Data Room
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={loadMockData}
              className="bg-white/10 text-white px-6 py-3 rounded-lg hover:bg-white/20 transition"
            >
              Use Sample Data
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Individual calculator component
  const CalculatorPanel = ({ 
    data, 
    setData, 
    results, 
    label,
    setLabel,
    calculatorId,
    onSave,
    onCopy,
    onReset,
    saving
  }: {
    data: CalculatorData;
    setData: (data: CalculatorData) => void;
    results: ReturnType<typeof calculateEBITDA>;
    label: string;
    setLabel: (label: string) => void;
    calculatorId: 'A' | 'B';
    onSave: () => void;
    onCopy: () => void;
    onReset: () => void;
    saving: boolean;
  }) => (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="text-xl font-semibold bg-transparent border-b border-white/20 text-white focus:border-blue-400 outline-none"
        />
        <div className="flex gap-2">
          <button
            onClick={onCopy}
            className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
            title={`Copy to Calculator ${calculatorId === 'A' ? 'B' : 'A'}`}
          >
            <Copy className="w-4 h-4 text-white/70" />
          </button>
          <button
            onClick={onReset}
            className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
            title="Reset Calculator"
          >
            <RefreshCw className="w-4 h-4 text-white/70" />
          </button>
        </div>
      </div>

      {/* Health Indicator */}
      <div className={`p-4 rounded-lg mb-6 ${
        results.healthStatus === 'green' ? 'bg-green-500/20 border border-green-500/30' :
        results.healthStatus === 'yellow' ? 'bg-yellow-500/20 border border-yellow-500/30' :
        'bg-red-500/20 border border-red-500/30'
      }`}>
        <div className="flex items-center justify-between">
          <span className="text-lg font-medium text-white">{results.healthMessage}</span>
          <span className="text-2xl font-bold text-white">{results.margin.toFixed(1)}%</span>
        </div>
      </div>

      {/* Input Fields */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm text-white/70 mb-1">Revenue</label>
          <input
            type="number"
            value={data.revenue || ''}
            onChange={(e) => setData({...data, revenue: Number(e.target.value)})}
            className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm text-white/70 mb-1">Cost of Goods Sold (COGS)</label>
          <input
            type="number"
            value={data.cogs || ''}
            onChange={(e) => setData({...data, cogs: Number(e.target.value)})}
            className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm text-white/70 mb-1">Operating Expenses</label>
          <input
            type="number"
            value={data.opex || ''}
            onChange={(e) => setData({...data, opex: Number(e.target.value)})}
            className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white"
            placeholder="0"
          />
        </div>

        {/* Add-backs Section */}
        <div className="pt-4 border-t border-white/10">
          <h4 className="text-sm font-medium text-white/70 mb-3">Add-backs</h4>
          
          <div className="space-y-3">
            <input
              type="number"
              value={data.ownerSalary || ''}
              onChange={(e) => setData({...data, ownerSalary: Number(e.target.value)})}
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white"
              placeholder="Owner Salary"
            />
            
            <input
              type="number"
              value={data.personalVehicle || ''}
              onChange={(e) => setData({...data, personalVehicle: Number(e.target.value)})}
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white"
              placeholder="Personal Vehicle"
            />
            
            <input
              type="number"
              value={data.travelMeals || ''}
              onChange={(e) => setData({...data, travelMeals: Number(e.target.value)})}
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white"
              placeholder="Travel & Meals"
            />
            
            <input
              type="number"
              value={data.legalFees || ''}
              onChange={(e) => setData({...data, legalFees: Number(e.target.value)})}
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white"
              placeholder="One-time Legal Fees"
            />
            
            <input
              type="number"
              value={data.otherNonRecurring || ''}
              onChange={(e) => setData({...data, otherNonRecurring: Number(e.target.value)})}
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white"
              placeholder="Other Non-recurring"
            />
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-white/70">Gross Profit</span>
          <span className="text-white">${results.grossProfit.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/70">Base EBITDA</span>
          <span className="text-white">${results.baseEBITDA.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/70">Total Add-backs</span>
          <span className="text-white">+${results.totalAddbacks.toLocaleString()}</span>
        </div>
        <div className="border-t border-white/20 pt-3">
          <div className="flex justify-between text-lg font-bold">
            <span className="text-white">Adjusted EBITDA</span>
            <span className="text-white">${results.adjustedEBITDA.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Valuation */}
      <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg mb-6">
        <div className="flex justify-between items-center">
          <span className="text-white/70">Estimated Valuation (4.5x)</span>
          <span className="text-xl font-bold text-blue-400">
            ${((results.adjustedEBITDA * 4.5) / 1000000).toFixed(2)}M
          </span>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={onSave}
        disabled={saving}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {saving ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            Save Calculator {calculatorId}
          </>
        )}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">EBITDA Calculator - Side by Side Comparison</h1>
        
        {/* Delta Summary Bar */}
        {(calculatorA.revenue > 0 && calculatorB.revenue > 0) && (
          <div className="mb-8 bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-white mb-4">Comparison Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-sm text-white/70">Revenue Delta</p>
                <p className={`text-xl font-bold ${delta.revenue >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {delta.revenue >= 0 ? '+' : ''}{(delta.revenue / 1000000).toFixed(2)}M
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-white/70">EBITDA Delta</p>
                <p className={`text-xl font-bold ${delta.ebitda >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {delta.ebitda >= 0 ? '+' : ''}{(delta.ebitda / 1000000).toFixed(2)}M
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-white/70">Margin Delta</p>
                <p className={`text-xl font-bold ${delta.margin >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {delta.margin >= 0 ? '+' : ''}{delta.margin.toFixed(1)}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-white/70">Valuation Delta</p>
                <p className={`text-xl font-bold ${delta.valuation >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {delta.valuation >= 0 ? '+' : ''}{(delta.valuation / 1000000).toFixed(2)}M
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Side by Side Calculators */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator A */}
          <CalculatorPanel
            data={calculatorA}
            setData={setCalculatorA}
            results={resultsA}
            label={labelA}
            setLabel={setLabelA}
            calculatorId="A"
            onSave={() => saveCalculatorData('A', calculatorA)}
            onCopy={() => copyToCalculator('A')}
            onReset={() => resetCalculator('A')}
            saving={savingA}
          />
          
          {/* Calculator B */}
          <CalculatorPanel
            data={calculatorB}
            setData={setCalculatorB}
            results={resultsB}
            label={labelB}
            setLabel={setLabelB}
            calculatorId="B"
            onSave={() => saveCalculatorData('B', calculatorB)}
            onCopy={() => copyToCalculator('B')}
            onReset={() => resetCalculator('B')}
            saving={savingB}
          />
        </div>
        
        {/* Navigation */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate('/portal/week-1/industry-multiples')}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition inline-flex items-center gap-2"
          >
            Continue to Industry Multiples
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}