import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, ArrowRight, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { calculateEBITDA, calculateValuation, formatCurrency, formatPercentage } from "@/lib/calculations/ebitda";
import { toast } from "sonner";

export default function EBITDACalculatorPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [financialData, setFinancialData] = useState(null);
  const [hasUploadedPnL, setHasUploadedPnL] = useState(false);
  const [manualEntry, setManualEntry] = useState({
    revenue: 0,
    cogs: 0,
    opex: 0,
    ownerSalary: 0,
    personalVehicle: 0,
    travelMeals: 0,
    legalFees: 0,
    otherNonRecurring: 0
  });
  const [simulatorValues, setSimulatorValues] = useState({
    revenueChange: 0,
    cogsChange: 0,
    opexChange: 0,
    additionalAddbacks: 0
  });

  useEffect(() => {
    if (user) {
      checkDataRoomDocuments();
      loadFinancialData();
    }
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
        setFinancialData({
          revenue: data.revenue || 0,
          cogs: data.cogs || 0,
          opex: data.opex || 0,
          addbacks: {
            ownerSalary: data.owner_salary || 0,
            personalVehicle: data.personal_vehicle || 0,
            travelMeals: data.travel_meals || 0,
            legalFees: data.legal_fees || 0,
            otherNonRecurring: data.other_non_recurring || 0
          }
        });
      }
    } catch (error) {
      console.error('Error loading financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveManualEntry = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_financial_data')
        .upsert({
          user_id: user.id,
          source: 'manual',
          revenue: manualEntry.revenue,
          cogs: manualEntry.cogs,
          opex: manualEntry.opex,
          owner_salary: manualEntry.ownerSalary,
          personal_vehicle: manualEntry.personalVehicle,
          travel_meals: manualEntry.travelMeals,
          legal_fees: manualEntry.legalFees,
          other_non_recurring: manualEntry.otherNonRecurring
        });

      if (error) throw error;

      toast.success('Financial data saved');
      await loadFinancialData();
    } catch (error) {
      toast.error('Failed to save data');
    }
  };

  const loadMockData = async () => {
    if (!user) return;

    const mockData = {
      user_id: user.id,
      source: 'mock',
      revenue: 2500000,
      cogs: 1100000,
      opex: 950000,
      owner_salary: 175000,
      personal_vehicle: 18000,
      travel_meals: 25000,
      legal_fees: 12000,
      other_non_recurring: 0
    };

    try {
      const { error } = await supabase
        .from('user_financial_data')
        .upsert(mockData);

      if (error) throw error;

      toast.success('Mock data loaded - Acme Manufacturing LLC');
      await loadFinancialData();
    } catch (error) {
      toast.error('Failed to load mock data');
    }
  };

  // Calculate both actual and simulated EBITDA
  const actualResults = financialData ? calculateEBITDA(financialData) : null;
  
  const simulatedData = financialData ? {
    revenue: financialData.revenue * (1 + simulatorValues.revenueChange / 100),
    cogs: financialData.cogs * (1 + simulatorValues.cogsChange / 100),
    opex: financialData.opex * (1 + simulatorValues.opexChange / 100),
    addbacks: {
      ...financialData.addbacks,
      otherNonRecurring: (financialData.addbacks.otherNonRecurring || 0) + simulatorValues.additionalAddbacks
    }
  } : null;
  
  const simulatedResults = simulatedData ? calculateEBITDA(simulatedData) : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // No P&L uploaded state
  if (!hasUploadedPnL) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <Card className="backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Upload Your P&L Statement First</h2>
              <p className="text-muted-foreground mb-6">
                To use the EBITDA Calculator, please upload your Profit & Loss statement to the Data Room first.
                This ensures accurate calculations based on your actual financial data.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate('/portal/week-1/data-room')}
                  className="inline-flex items-center gap-2"
                >
                  Go to Data Room
                  <ArrowRight className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  onClick={loadMockData}
                >
                  Or load sample data to explore
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Manual data entry if no financial data
  if (!financialData) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Enter Financial Data</h1>
          
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-6">
                You've uploaded your P&L statement. Now enter the key figures to calculate your EBITDA.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Revenue</label>
                  <input
                    type="number"
                    value={manualEntry.revenue}
                    onChange={(e) => setManualEntry({...manualEntry, revenue: Number(e.target.value)})}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2"
                    placeholder="Enter annual revenue"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Cost of Goods Sold (COGS)</label>
                  <input
                    type="number"
                    value={manualEntry.cogs}
                    onChange={(e) => setManualEntry({...manualEntry, cogs: Number(e.target.value)})}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2"
                    placeholder="Enter COGS"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Operating Expenses</label>
                  <input
                    type="number"
                    value={manualEntry.opex}
                    onChange={(e) => setManualEntry({...manualEntry, opex: Number(e.target.value)})}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2"
                    placeholder="Enter operating expenses"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Owner Salary Add-back</label>
                  <input
                    type="number"
                    value={manualEntry.ownerSalary}
                    onChange={(e) => setManualEntry({...manualEntry, ownerSalary: Number(e.target.value)})}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2"
                    placeholder="Enter owner salary"
                  />
                </div>
              </div>
              
              <div className="flex gap-4 mt-6">
                <Button onClick={saveManualEntry}>
                  Calculate EBITDA
                </Button>
                <Button variant="outline" onClick={loadMockData}>
                  Use Sample Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Main calculator view
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">EBITDA Calculator</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT PANEL - Actual EBITDA (Read-only) */}
          <Card className="backdrop-blur-sm">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-6">Your Actual EBITDA</h2>
              
              {actualResults && (
                <>
                  {/* Health Indicator */}
                  <div className={`p-4 rounded-lg mb-6 ${
                    actualResults.healthStatus === 'green' ? 'bg-green-500/20 border border-green-500/30' :
                    actualResults.healthStatus === 'yellow' ? 'bg-yellow-500/20 border border-yellow-500/30' :
                    'bg-red-500/20 border border-red-500/30'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-medium">{actualResults.healthMessage}</span>
                      <span className="text-2xl font-bold">{formatPercentage(actualResults.margin)}</span>
                    </div>
                  </div>
                  
                  {/* Financial Breakdown */}
                  <div className="space-y-4">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Revenue</span>
                      <span>{formatCurrency(actualResults.revenue)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>COGS</span>
                      <span>-{formatCurrency(actualResults.cogs)}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Gross Profit</span>
                      <span>{formatCurrency(actualResults.grossProfit)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Operating Expenses</span>
                      <span>-{formatCurrency(actualResults.opex)}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Base EBITDA</span>
                      <span>{formatCurrency(actualResults.baseEBITDA)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Add-backs</span>
                      <span>+{formatCurrency(actualResults.totalAddbacks)}</span>
                    </div>
                    <div className="border-t border-border pt-4 mt-4">
                      <div className="flex justify-between text-xl font-bold">
                        <span>Adjusted EBITDA</span>
                        <span>{formatCurrency(actualResults.adjustedEBITDA)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Valuation */}
                  <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Estimated Valuation (4.5x)</span>
                      <span className="text-xl font-bold text-blue-400">
                        {formatCurrency(calculateValuation(actualResults.adjustedEBITDA))}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          
          {/* RIGHT PANEL - Simulator */}
          <Card className="backdrop-blur-sm">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-6">What-If Analysis</h2>
              
              <div className="space-y-6">
                {/* Revenue Slider */}
                <div>
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>Revenue Change</span>
                    <span className={simulatorValues.revenueChange >= 0 ? 'text-green-400' : 'text-red-400'}>
                      {simulatorValues.revenueChange >= 0 ? '+' : ''}{simulatorValues.revenueChange}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={simulatorValues.revenueChange}
                    onChange={(e) => setSimulatorValues({...simulatorValues, revenueChange: Number(e.target.value)})}
                    className="w-full"
                  />
                </div>
                
                {/* COGS Slider */}
                <div>
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>COGS Change</span>
                    <span className={simulatorValues.cogsChange <= 0 ? 'text-green-400' : 'text-red-400'}>
                      {simulatorValues.cogsChange >= 0 ? '+' : ''}{simulatorValues.cogsChange}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-25"
                    max="25"
                    value={simulatorValues.cogsChange}
                    onChange={(e) => setSimulatorValues({...simulatorValues, cogsChange: Number(e.target.value)})}
                    className="w-full"
                  />
                </div>
                
                {/* OpEx Slider */}
                <div>
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>Operating Expenses Change</span>
                    <span className={simulatorValues.opexChange <= 0 ? 'text-green-400' : 'text-red-400'}>
                      {simulatorValues.opexChange >= 0 ? '+' : ''}{simulatorValues.opexChange}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-25"
                    max="25"
                    value={simulatorValues.opexChange}
                    onChange={(e) => setSimulatorValues({...simulatorValues, opexChange: Number(e.target.value)})}
                    className="w-full"
                  />
                </div>
                
                {/* Additional Add-backs */}
                <div>
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>Additional Add-backs</span>
                    <span className="text-green-400">+{formatCurrency(simulatorValues.additionalAddbacks)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="500000"
                    step="10000"
                    value={simulatorValues.additionalAddbacks}
                    onChange={(e) => setSimulatorValues({...simulatorValues, additionalAddbacks: Number(e.target.value)})}
                    className="w-full"
                  />
                </div>
              </div>
              
              {/* Simulated Results */}
              {simulatedResults && actualResults && (
                <div className="mt-6 space-y-4">
                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between">
                      <span>Simulated EBITDA</span>
                      <span className="font-bold">{formatCurrency(simulatedResults.adjustedEBITDA)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground text-sm">
                      <span>Margin</span>
                      <span>{formatPercentage(simulatedResults.margin)}</span>
                    </div>
                  </div>
                  
                  {/* Delta */}
                  <div className={`p-4 rounded-lg ${
                    simulatedResults.adjustedEBITDA > actualResults.adjustedEBITDA
                      ? 'bg-green-500/20 border border-green-500/30'
                      : 'bg-red-500/20 border border-red-500/30'
                  }`}>
                    <div className="flex items-center justify-between">
                      {simulatedResults.adjustedEBITDA > actualResults.adjustedEBITDA ? (
                        <TrendingUp className="w-5 h-5 text-green-400" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-400" />
                      )}
                      <span className="font-medium">
                        {simulatedResults.adjustedEBITDA > actualResults.adjustedEBITDA ? '+' : ''}
                        {formatCurrency(simulatedResults.adjustedEBITDA - actualResults.adjustedEBITDA)}
                      </span>
                      <span className="text-muted-foreground text-sm">
                        ({((simulatedResults.adjustedEBITDA - actualResults.adjustedEBITDA) / actualResults.adjustedEBITDA * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  
                  {/* Simulated Valuation */}
                  <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">New Valuation (4.5x)</span>
                      <span className="text-xl font-bold text-blue-400">
                        {formatCurrency(calculateValuation(simulatedResults.adjustedEBITDA))}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}