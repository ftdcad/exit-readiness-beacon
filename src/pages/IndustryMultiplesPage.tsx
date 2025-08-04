import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { 
  TrendingUp, 
  Building2, 
  Calculator, 
  Info,
  ChevronRight,
  DollarSign,
  BarChart3,
  Download,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { Slider } from '@/components/ui/slider';
import { ModuleProgress } from '@/components/ModuleProgress';
import {
  IndustryMultiple,
  CompanyProfile,
  ValuationResult,
  MultipleHealth,
  calculateValuation,
  getMultipleHealth,
  generateValuationReportContent,
  formatCurrency
} from '@/lib/calculations/multiples';

export default function IndustryMultiplesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [industryMultiples, setIndustryMultiples] = useState<IndustryMultiple[]>([]);
  const [financialData, setFinancialData] = useState<any>(null);
  
  // Form state
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>({
    industryCategory: '',
    industrySubcategory: '',
    annualRevenue: 0,
    ebitda: 0,
    recurringRevenuePercent: 0,
    customerConcentration: 0,
    yearsInBusiness: 5,
    growthRatePercent: 10
  });
  
  // Calculation results
  const [valuationResult, setValuationResult] = useState<ValuationResult | null>(null);
  const [selectedMultiple, setSelectedMultiple] = useState<IndustryMultiple | null>(null);
  const [multipleHealth, setMultipleHealth] = useState<MultipleHealth | null>(null);
  
  useEffect(() => {
    loadData();
  }, [user]);
  
  useEffect(() => {
    if (selectedIndustry && companyProfile.ebitda > 0) {
      calculateValuationResults();
    }
  }, [selectedIndustry, selectedSubcategory, companyProfile]);
  
  const loadData = async () => {
    if (!user) return;
    
    try {
      // Load financial data from previous calculator
      const { data: finData } = await supabase
        .from('user_financial_data')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (finData) {
        setFinancialData(finData);
        const calculatedEbitda = (finData.revenue - finData.cogs - finData.opex + 
                  (finData.owner_salary || 0) + 
                  (finData.personal_vehicle || 0) + 
                  (finData.travel_meals || 0) + 
                  (finData.legal_fees || 0) + 
                  (finData.other_non_recurring || 0)) || 0;
                  
        setCompanyProfile(prev => ({
          ...prev,
          annualRevenue: finData.revenue || 0,
          ebitda: calculatedEbitda
        }));
      }
      
      // Load industry multiples
      const { data: multiples } = await supabase
        .from('industry_multiples')
        .select('*')
        .order('industry_category', { ascending: true })
        .order('industry_subcategory', { ascending: true })
        .order('min_ebitda', { ascending: true });
        
      if (multiples) {
        const mappedMultiples = multiples.map(m => ({
          id: m.id,
          industryCategory: m.industry_category,
          industrySubcategory: m.industry_subcategory,
          sizeBand: m.size_band,
          minEbitda: m.min_ebitda,
          maxEbitda: m.max_ebitda,
          baseMultiple: m.base_multiple,
          highMultiple: m.high_multiple,
          typicalMarginPercent: m.typical_margin_percent,
          notes: m.notes
        }));
        setIndustryMultiples(mappedMultiples);
      }
      
      // Load saved company profile
      const { data: profile } = await supabase
        .from('company_industry_profile')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (profile) {
        setCompanyProfile({
          industryCategory: profile.industry_category,
          industrySubcategory: profile.industry_subcategory || '',
          annualRevenue: profile.annual_revenue,
          ebitda: profile.ebitda,
          recurringRevenuePercent: profile.recurring_revenue_percent,
          customerConcentration: profile.customer_concentration,
          yearsInBusiness: profile.years_in_business,
          growthRatePercent: profile.growth_rate_percent
        });
        setSelectedIndustry(profile.industry_category);
        setSelectedSubcategory(profile.industry_subcategory || '');
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const calculateValuationResults = () => {
    if (!companyProfile.ebitda || !selectedIndustry) return;
    
    // Find appropriate multiple based on industry and EBITDA size
    const relevantMultiple = industryMultiples.find(m => 
      m.industryCategory === selectedIndustry &&
      (!selectedSubcategory || m.industrySubcategory === selectedSubcategory) &&
      companyProfile.ebitda >= m.minEbitda &&
      companyProfile.ebitda < m.maxEbitda
    );
    
    if (!relevantMultiple) return;
    
    setSelectedMultiple(relevantMultiple);
    
    // Calculate valuation using the library
    const valuation = calculateValuation(relevantMultiple, companyProfile);
    setValuationResult(valuation);
    
    // Set health indicator
    const health = getMultipleHealth(valuation.adjustedMultiple, relevantMultiple.baseMultiple, relevantMultiple.highMultiple);
    setMultipleHealth(health);
  };
  
  const saveProfile = async () => {
    if (!user || !valuationResult) return;
    
    try {
      const { error } = await supabase
        .from('company_industry_profile')
        .upsert({
          user_id: user.id,
          industry_category: selectedIndustry,
          industry_subcategory: selectedSubcategory || null,
          annual_revenue: companyProfile.annualRevenue,
          ebitda: companyProfile.ebitda,
          recurring_revenue_percent: companyProfile.recurringRevenuePercent,
          customer_concentration: companyProfile.customerConcentration,
          years_in_business: companyProfile.yearsInBusiness,
          growth_rate_percent: companyProfile.growthRatePercent,
          calculated_multiple: valuationResult.adjustedMultiple,
          enterprise_value: valuationResult.enterpriseValue
        });
        
      if (error) throw error;
      
      toast.success('Industry profile saved');
    } catch (error) {
      toast.error('Failed to save profile');
    }
  };
  
  const handleExport = async (format: 'pdf' | 'markdown') => {
    if (!valuationResult || !selectedMultiple) return;
    
    try {
      const reportContent = generateValuationReportContent(companyProfile, valuationResult, selectedMultiple);
      
      // Create blob and download
      const blob = new Blob([reportContent], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `valuation-report-${new Date().toISOString().split('T')[0]}.md`;
      a.click();
      URL.revokeObjectURL(url);
      
      // Save export record
      if (user?.id) {
        await supabase.from('valuation_exports').insert({
          user_id: user.id,
          company_profile: companyProfile as any,
          valuation_data: valuationResult as any,
          export_format: format
        });
      }
      
      toast.success(`Valuation report exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export report');
    }
  };
  
  // Get unique industries and subcategories
  const industries = [...new Set(industryMultiples.map(m => m.industryCategory))];
  const subcategories = selectedIndustry 
    ? [...new Set(industryMultiples
        .filter(m => m.industryCategory === selectedIndustry)
        .map(m => m.industrySubcategory)
        .filter(Boolean))]
    : [];
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-muted-foreground">Loading...</div>
    </div>;
  }
  
  // EBITDA requirement check
  if (!financialData || companyProfile.ebitda <= 0) {
    return (
      <div className="min-h-screen p-6">
        <ModuleProgress currentModule={5} />
        
        <div className="max-w-2xl mx-auto">
          <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-8 text-center">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">EBITDA Required</h2>
            <p className="text-muted-foreground mb-6">
              Industry multiples require a completed EBITDA calculation from the previous module.
            </p>
            <div className="bg-card/50 rounded-lg p-4 mb-6">
              <p className="text-sm text-muted-foreground">
                <strong>Constraint:</strong> No manual EBITDA entry allowed. Valuations must be based on verified financial data only.
              </p>
            </div>
            <button
              onClick={() => navigate('/portal/week-2/ebitda-calculator')}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition inline-flex items-center gap-2"
            >
              Complete EBITDA Calculator
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <ModuleProgress currentModule={5} />
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Industry Multipliers & Valuation</h1>
          <p className="text-muted-foreground">Calculate your business value based on industry benchmarks and company characteristics</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Industry Selection & Company Profile */}
          <div className="lg:col-span-2 space-y-6">
            {/* Constraints Notice */}
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-primary flex-shrink-0" />
                <div className="text-sm text-foreground">
                  <p className="font-medium mb-1">Valuation Constraints:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• No manual override of calculated multiples</li>
                    <li>• Based on current EBITDA only (no forecasts)</li>
                    <li>• All adjustments follow documented PE methodology</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Industry Selection */}
            <div className="bg-card/50 border border-border rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Industry Selection
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Industry Category</label>
                  <select
                    value={selectedIndustry}
                    onChange={(e) => {
                      setSelectedIndustry(e.target.value);
                      setSelectedSubcategory('');
                    }}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground"
                  >
                    <option value="">Select Industry</option>
                    {industries.map(ind => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                </div>
                
                {subcategories.length > 0 && (
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Subcategory (Optional)</label>
                    <select
                      value={selectedSubcategory}
                      onChange={(e) => setSelectedSubcategory(e.target.value)}
                      className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground"
                    >
                      <option value="">All Subcategories</option>
                      {subcategories.map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
            
            {/* Financial Metrics (Read-only from EBITDA module) */}
            <div className="bg-card/50 border border-border rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Financial Metrics
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Annual Revenue</label>
                  <div className="bg-background border border-border rounded-lg px-4 py-2 text-foreground">
                    {formatCurrency(companyProfile.annualRevenue)}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">EBITDA (Verified)</label>
                  <div className="bg-background border border-border rounded-lg px-4 py-2 text-foreground flex items-center justify-between">
                    <span>{formatCurrency(companyProfile.ebitda)}</span>
                    <button
                      onClick={() => navigate('/portal/week-2/ebitda-calculator')}
                      className="text-xs text-primary hover:text-primary/80"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
              
              {companyProfile.annualRevenue > 0 && companyProfile.ebitda > 0 && (
                <div className="mt-4 p-3 bg-primary/10 border border-primary/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">EBITDA Margin</span>
                    <span className="text-lg font-semibold text-primary">
                      {((companyProfile.ebitda / companyProfile.annualRevenue) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Business Characteristics */}
            <div className="bg-card/50 border border-border rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Business Characteristics
              </h2>
              
              <div className="space-y-6">
                {/* Recurring Revenue */}
                <div>
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>Recurring Revenue</span>
                    <span className="text-green-500">{companyProfile.recurringRevenuePercent}%</span>
                  </div>
                  <Slider
                    value={[companyProfile.recurringRevenuePercent]}
                    onValueChange={([value]) => setCompanyProfile({...companyProfile, recurringRevenuePercent: value})}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Subscription, contracts, or predictable revenue
                  </p>
                </div>
                
                {/* Customer Concentration */}
                <div>
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>Largest Customer %</span>
                    <span className={companyProfile.customerConcentration > 30 ? 'text-destructive' : 'text-foreground'}>
                      {companyProfile.customerConcentration}%
                    </span>
                  </div>
                  <Slider
                    value={[companyProfile.customerConcentration]}
                    onValueChange={([value]) => setCompanyProfile({...companyProfile, customerConcentration: value})}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Revenue from your largest customer
                  </p>
                </div>
                
                {/* Growth Rate */}
                <div>
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>Annual Growth Rate</span>
                    <span className={
                      companyProfile.growthRatePercent > 25 ? 'text-green-500' : 
                      companyProfile.growthRatePercent < 5 ? 'text-destructive' : 
                      'text-foreground'
                    }>
                      {companyProfile.growthRatePercent}%
                    </span>
                  </div>
                  <Slider
                    value={[companyProfile.growthRatePercent]}
                    onValueChange={([value]) => setCompanyProfile({...companyProfile, growthRatePercent: value})}
                    min={-20}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
                
                {/* Years in Business */}
                <div>
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>Years in Business</span>
                    <span>{companyProfile.yearsInBusiness} years</span>
                  </div>
                  <Slider
                    value={[companyProfile.yearsInBusiness]}
                    onValueChange={([value]) => setCompanyProfile({...companyProfile, yearsInBusiness: value})}
                    max={50}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
              
              <button
                onClick={saveProfile}
                className="mt-6 w-full bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:bg-primary/90 transition"
              >
                Save Profile
              </button>
            </div>
          </div>
          
          {/* Right Panel - Valuation Results */}
          <div className="space-y-6">
            {/* Current Valuation */}
            {valuationResult && selectedMultiple && multipleHealth && (
              <>
                <div className="bg-gradient-to-br from-primary/20 to-secondary/20 border border-border rounded-xl p-6 backdrop-blur-sm">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Your Valuation</h2>
                  
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-muted-foreground text-sm">Enterprise Value</p>
                      <p className="text-4xl font-bold text-foreground mt-1">
                        {formatCurrency(valuationResult.enterpriseValue).replace('.00', '')}
                      </p>
                    </div>
                    
                    {/* Traffic Light Indicator */}
                    <div className={`p-3 rounded-lg text-center ${
                      multipleHealth.color === 'green' ? 'bg-green-500/20 border border-green-500/30' :
                      multipleHealth.color === 'yellow' ? 'bg-yellow-500/20 border border-yellow-500/30' :
                      'bg-destructive/20 border border-destructive/30'
                    }`}>
                      <div className="flex items-center justify-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          multipleHealth.color === 'green' ? 'bg-green-500' :
                          multipleHealth.color === 'yellow' ? 'bg-yellow-500' :
                          'bg-destructive'
                        }`} />
                        <span className="font-medium text-foreground">{multipleHealth.label}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{multipleHealth.description}</p>
                    </div>
                    
                    <div className="pt-4 border-t border-border">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">EBITDA</span>
                        <span className="text-foreground">{formatCurrency(companyProfile.ebitda).replace('.00', '')}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-2">
                        <span className="text-muted-foreground">Multiple</span>
                        <span className="text-foreground font-semibold">{valuationResult.adjustedMultiple.toFixed(1)}x</span>
                      </div>
                      <div className="flex justify-between text-sm mt-2">
                        <span className="text-muted-foreground">Size Band</span>
                        <span className="text-foreground">{selectedMultiple.sizeBand}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Export Buttons */}
                  <div className="mt-6 flex gap-2">
                    <button
                      onClick={() => handleExport('markdown')}
                      className="flex-1 bg-card/50 text-foreground py-2 px-4 rounded-lg hover:bg-card/70 transition flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Export Report
                    </button>
                  </div>
                </div>
                
                {/* Industry Comparison */}
                <div className="bg-card/50 border border-border rounded-xl p-6 backdrop-blur-sm">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Industry Comparison</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">Low (25th %ile)</span>
                      <span className="text-foreground">{formatCurrency(valuationResult.comparableRange.low).replace('.00', '')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">Median</span>
                      <span className="text-foreground">{formatCurrency(valuationResult.comparableRange.median).replace('.00', '')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">High (75th %ile)</span>
                      <span className="text-foreground">{formatCurrency(valuationResult.comparableRange.high).replace('.00', '')}</span>
                    </div>
                  </div>
                  
                  {/* Visual indicator with percentile bar */}
                  <div className="mt-4 relative h-2 bg-border rounded-full overflow-hidden">
                    <div 
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-destructive via-yellow-500 to-green-500"
                      style={{ width: '100%' }}
                    />
                    <div 
                      className="absolute top-0 h-full w-1 bg-foreground shadow-lg"
                      style={{ 
                        left: `${Math.max(0, Math.min(100, ((valuationResult.enterpriseValue - valuationResult.comparableRange.low) / 
                               (valuationResult.comparableRange.high - valuationResult.comparableRange.low)) * 100))}%` 
                      }}
                    />
                  </div>
                </div>
                
                {/* Multiple Adjustments */}
                <div className="bg-card/50 border border-border rounded-xl p-6 backdrop-blur-sm">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Multiple Adjustments</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Base Multiple ({selectedMultiple.sizeBand})</span>
                      <span className="text-foreground">{valuationResult.baseMultiple.toFixed(1)}x</span>
                    </div>
                    
                    {valuationResult.adjustmentFactors.recurringRevenueAdjustment > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Recurring Revenue</span>
                        <span className="text-green-500">
                          +{(valuationResult.adjustmentFactors.recurringRevenueAdjustment * 
                            (selectedMultiple.highMultiple - selectedMultiple.baseMultiple)).toFixed(1)}x
                        </span>
                      </div>
                    )}
                    
                    {valuationResult.adjustmentFactors.customerConcentrationAdjustment < 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Customer Concentration</span>
                        <span className="text-destructive">
                          {(valuationResult.adjustmentFactors.customerConcentrationAdjustment * 
                            (selectedMultiple.highMultiple - selectedMultiple.baseMultiple)).toFixed(1)}x
                        </span>
                      </div>
                    )}
                    
                    {valuationResult.adjustmentFactors.growthAdjustment !== 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Growth Rate</span>
                        <span className={valuationResult.adjustmentFactors.growthAdjustment > 0 ? 'text-green-500' : 'text-destructive'}>
                          {valuationResult.adjustmentFactors.growthAdjustment > 0 ? '+' : ''}
                          {(valuationResult.adjustmentFactors.growthAdjustment * 
                            (selectedMultiple.highMultiple - selectedMultiple.baseMultiple)).toFixed(1)}x
                        </span>
                      </div>
                    )}
                    
                    <div className="pt-3 border-t border-border">
                      <div className="flex justify-between">
                        <span className="text-foreground font-medium">Adjusted Multiple</span>
                        <span className="text-foreground font-bold">{valuationResult.adjustedMultiple.toFixed(1)}x</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {/* No Results State */}
            {(!valuationResult || !selectedMultiple) && selectedIndustry && (
              <div className="bg-card/50 border border-border rounded-xl p-6 backdrop-blur-sm text-center">
                <Calculator className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  Complete your business profile to see valuation
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Bottom Navigation */}
        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={() => navigate('/portal/week-2/ebitda-calculator')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
            Back to EBITDA Calculator
          </button>
          <button
            onClick={() => navigate('/portal/week-2/scenario-planning')}
            className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
          >
            Continue to Scenario Planning
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}