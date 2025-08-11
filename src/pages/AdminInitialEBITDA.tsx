
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInquiry } from '@/hooks/useInquiries';
import { useFinancialAssessment, useAddBackCategories, useCreateFinancialAssessment, useUpdateFinancialAssessment, useUpdateAddBackCategory } from '@/hooks/useFinancialAssessment';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calculator, FileText } from 'lucide-react';
import { EBITDAAdminDisplay } from '@/components/EBITDA/EBITDAAdminDisplay';
import { ExtractedFinancialData } from '@/lib/dataRoomParser';

const AdminInitialEBITDA = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: inquiry, isLoading: inquiryLoading } = useInquiry(id!);
  const { data: assessment, isLoading: assessmentLoading } = useFinancialAssessment(id!);
  const { data: addBacks = [] } = useAddBackCategories(assessment?.id || '');
  
  const createAssessment = useCreateFinancialAssessment();
  const updateAssessment = useUpdateFinancialAssessment();
  const updateAddBack = useUpdateAddBackCategory();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    revenue: assessment?.revenue?.toString() || inquiry?.annual_revenue?.toString() || '',
    netIncome: assessment?.net_income?.toString() || '',
    currentEbitda: assessment?.current_ebitda?.toString() || '',
  });

  const [addBackEdits, setAddBackEdits] = useState<Record<string, { amount: number; isApplied: boolean }>>({});

  const handleSaveFinancials = async () => {
    const revenue = parseInt(formData.revenue) || 0;
    const netIncome = parseInt(formData.netIncome) || 0;
    const currentEbitda = parseInt(formData.currentEbitda) || netIncome;
    
    const financialData = {
      revenue,
      net_income: netIncome,
      current_ebitda: currentEbitda,
      ebitda_margin: revenue > 0 ? currentEbitda / revenue : 0,
      assessment_status: 'draft' as const,
    };

    if (assessment) {
      await updateAssessment.mutateAsync({
        id: assessment.id,
        updates: financialData,
      });
    } else {
      const newAssessment = await createAssessment.mutateAsync({
        company_id: id!,
        ...financialData,
      });
    }

    setIsEditing(false);
  };

  const handleAddBackChange = async (categoryId: string, amount: number, isApplied: boolean) => {
    if (!assessment?.id) return;
    
    setAddBackEdits(prev => ({
      ...prev,
      [categoryId]: { amount, isApplied }
    }));

    await updateAddBack.mutateAsync({
      categoryId,
      amount,
      isApplied,
      assessmentId: assessment.id
    });
  };

  const formatCurrency = (value: number | null) => {
    if (!value) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (inquiryLoading || assessmentLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-64 mb-4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!inquiry) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-destructive">Company not found</p>
            <Button variant="outline" onClick={() => navigate('/admin/inquiries')} className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Companies
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Create financial data for the display component
  const financialData: ExtractedFinancialData = {
    revenue: assessment?.revenue || inquiry?.annual_revenue || 0,
    netIncome: assessment?.net_income || 0,
    currentEbitda: assessment?.current_ebitda || 0,
    source: 'assessment',
    documentName: `Initial Assessment - ${inquiry.company_name}`,
  };

  const defaultAddBacks = [
    { id: 'owner-salary', category: 'Owner Salary Add-Back', description: 'Excess owner compensation above market rate' },
    { id: 'personal-vehicles', category: 'Personal Vehicle Expenses', description: 'Vehicle expenses not related to business operations' },
    { id: 'travel-meals', category: 'Travel & Meals', description: 'Personal travel and meal expenses' },
    { id: 'legal-professional', category: 'Legal & Professional Fees', description: 'One-time or non-recurring professional fees' },
    { id: 'other-expenses', category: 'Other Non-Recurring Expenses', description: 'Other one-time or personal expenses' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate(`/admin/companies/${id}`)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Company
        </Button>
        <div className="flex items-center gap-3">
          <Calculator className="w-6 h-6 text-primary" />
          <h1 className="text-3xl font-bold">Initial EBITDA Calculator</h1>
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
            Admin Only - Pre-Assessment Data
          </Badge>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900">Initial Evidence Calculator</h3>
            <p className="text-sm text-blue-700">
              This calculator uses data from the initial contact inquiry form. Enter quick financial numbers 
              to generate preliminary EBITDA calculations for {inquiry.company_name}.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Input Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Financial Input</CardTitle>
            <p className="text-sm text-muted-foreground">
              Enter basic financials for preliminary EBITDA calculation
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isEditing && assessment ? (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Annual Revenue</Label>
                  <p className="text-xl font-semibold">{formatCurrency(assessment.revenue)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Net Income</Label>
                  <p className="text-xl font-semibold">{formatCurrency(assessment.net_income)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Current EBITDA</Label>
                  <p className="text-xl font-semibold">{formatCurrency(assessment.current_ebitda)}</p>
                </div>
                <Button onClick={() => setIsEditing(true)} className="w-full">
                  Edit Numbers
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="revenue">Annual Revenue ($)</Label>
                  <Input
                    id="revenue"
                    type="number"
                    value={formData.revenue}
                    onChange={(e) => setFormData(prev => ({ ...prev, revenue: e.target.value }))}
                    placeholder="e.g., 5000000"
                  />
                </div>
                <div>
                  <Label htmlFor="netIncome">Net Income ($)</Label>
                  <Input
                    id="netIncome"
                    type="number"
                    value={formData.netIncome}
                    onChange={(e) => setFormData(prev => ({ ...prev, netIncome: e.target.value }))}
                    placeholder="e.g., 750000"
                  />
                </div>
                <div>
                  <Label htmlFor="currentEbitda">Current EBITDA ($)</Label>
                  <Input
                    id="currentEbitda"
                    type="number"
                    value={formData.currentEbitda}
                    onChange={(e) => setFormData(prev => ({ ...prev, currentEbitda: e.target.value }))}
                    placeholder="Leave blank to use Net Income"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSaveFinancials} className="flex-1">
                    Save Numbers
                  </Button>
                  {assessment && (
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add-backs Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Add-Backs</CardTitle>
            <p className="text-sm text-muted-foreground">
              Adjust common add-back categories for preliminary calculations
            </p>
          </CardHeader>
          <CardContent>
            {assessment ? (
              <div className="space-y-4">
                {defaultAddBacks.map((defaultAddBack) => {
                  const existing = addBacks.find(ab => ab.category === defaultAddBack.category);
                  const currentEdit = addBackEdits[defaultAddBack.id];
                  const amount = currentEdit?.amount ?? existing?.amount ?? 0;
                  const isApplied = currentEdit?.isApplied ?? existing?.is_applied ?? false;
                  
                  return (
                    <div key={defaultAddBack.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">{defaultAddBack.category}</Label>
                        <input
                          type="checkbox"
                          checked={isApplied}
                          onChange={(e) => handleAddBackChange(
                            existing?.id || defaultAddBack.id,
                            amount,
                            e.target.checked
                          )}
                          className="rounded"
                        />
                      </div>
                      <Input
                        type="number"
                        value={amount}
                        onChange={(e) => handleAddBackChange(
                          existing?.id || defaultAddBack.id,
                          parseInt(e.target.value) || 0,
                          isApplied
                        )}
                        placeholder="Enter amount"
                        disabled={!isApplied}
                      />
                      <p className="text-xs text-muted-foreground">{defaultAddBack.description}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Save financial numbers first to enable add-backs
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* EBITDA Display */}
      {assessment && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Initial EBITDA Analysis</h2>
          <EBITDAAdminDisplay
            financialData={financialData}
            addBacks={addBacks}
            className="max-w-2xl"
          />
        </div>
      )}
    </div>
  );
};

export default AdminInitialEBITDA;
