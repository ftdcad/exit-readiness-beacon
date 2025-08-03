import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useCreateFinancialAssessment, useUpdateFinancialAssessment, FinancialAssessment } from '@/hooks/useFinancialAssessment';

const financialSchema = z.object({
  revenue: z.string().min(1, 'Revenue is required'),
  netIncome: z.string().min(1, 'Net income is required'),
  currentEbitda: z.string().optional(),
  assessmentStatus: z.string().min(1, 'Assessment status is required'),
});

type FinancialFormData = z.infer<typeof financialSchema>;

interface FinancialInputFormProps {
  companyId: string;
  assessment: FinancialAssessment | null | undefined;
  loading: boolean;
}

export const FinancialInputForm = ({ companyId, assessment, loading }: FinancialInputFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  
  const form = useForm<FinancialFormData>({
    resolver: zodResolver(financialSchema),
    defaultValues: {
      revenue: '',
      netIncome: '',
      currentEbitda: '',
      assessmentStatus: 'draft',
    },
  });

  const createAssessment = useCreateFinancialAssessment();
  const updateAssessment = useUpdateFinancialAssessment();

  // Update form when assessment data loads
  useEffect(() => {
    if (assessment) {
      form.reset({
        revenue: assessment.revenue?.toString() || '',
        netIncome: assessment.net_income?.toString() || '',
        currentEbitda: assessment.current_ebitda?.toString() || '',
        assessmentStatus: assessment.assessment_status,
      });
    }
  }, [assessment, form]);

  const onSubmit = async (data: FinancialFormData) => {
    const revenue = parseInt(data.revenue);
    const netIncome = parseInt(data.netIncome);
    const currentEbitda = data.currentEbitda ? parseInt(data.currentEbitda) : netIncome;
    const ebitdaMargin = revenue > 0 ? currentEbitda / revenue : 0;

    const financialData = {
      revenue,
      net_income: netIncome,
      current_ebitda: currentEbitda,
      ebitda_margin: ebitdaMargin,
      assessment_status: data.assessmentStatus,
    };

    if (assessment) {
      await updateAssessment.mutateAsync({
        id: assessment.id,
        updates: financialData,
      });
    } else {
      await createAssessment.mutateAsync({
        company_id: companyId,
        ...financialData,
      });
    }

    setIsEditing(false);
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

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10" />
      </div>
    );
  }

  if (!isEditing && assessment) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <Label className="text-sm font-medium text-muted-foreground">Annual Revenue</Label>
              <p className="text-2xl font-bold">{formatCurrency(assessment.revenue)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <Label className="text-sm font-medium text-muted-foreground">Net Income</Label>
              <p className="text-2xl font-bold">{formatCurrency(assessment.net_income)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <Label className="text-sm font-medium text-muted-foreground">EBITDA</Label>
              <p className="text-2xl font-bold">{formatCurrency(assessment.current_ebitda)}</p>
              {assessment.ebitda_margin && (
                <p className="text-sm text-muted-foreground">
                  {(assessment.ebitda_margin * 100).toFixed(1)}% margin
                </p>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={() => setIsEditing(true)}>
            Edit Financial Data
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="revenue">Annual Revenue ($)</Label>
          <Input
            id="revenue"
            type="number"
            placeholder="e.g., 5000000"
            {...form.register('revenue')}
          />
          {form.formState.errors.revenue && (
            <p className="text-sm text-destructive">{form.formState.errors.revenue.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="netIncome">Net Income ($)</Label>
          <Input
            id="netIncome"
            type="number"
            placeholder="e.g., 1000000"
            {...form.register('netIncome')}
          />
          {form.formState.errors.netIncome && (
            <p className="text-sm text-destructive">{form.formState.errors.netIncome.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="currentEbitda">Current EBITDA ($)</Label>
          <Input
            id="currentEbitda"
            type="number"
            placeholder="Leave blank to use Net Income"
            {...form.register('currentEbitda')}
          />
          <p className="text-xs text-muted-foreground">
            If not provided, we'll use Net Income as a starting point
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="assessmentStatus">Assessment Status</Label>
          <Select 
            value={form.watch('assessmentStatus')} 
            onValueChange={(value) => form.setValue('assessmentStatus', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="review">Under Review</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        {assessment && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </Button>
        )}
        <Button 
          type="submit" 
          disabled={createAssessment.isPending || updateAssessment.isPending}
        >
          {createAssessment.isPending || updateAssessment.isPending 
            ? 'Saving...' 
            : assessment 
              ? 'Update Assessment' 
              : 'Create Assessment'
          }
        </Button>
      </div>
    </form>
  );
};