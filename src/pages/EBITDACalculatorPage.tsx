import { useAuth } from "@/hooks/useAuth";
import { useFinancialAssessment, useAddBackCategories } from "@/hooks/useFinancialAssessment";
import { EBITDADisplay } from "@/components/EBITDA/EBITDADisplay";
import { EBITDASimulator } from "@/components/EBITDA/EBITDASimulator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calculator } from "lucide-react";

export default function EBITDACalculatorPage() {
  const { user } = useAuth();
  const { data: assessment, isLoading: assessmentLoading } = useFinancialAssessment(user?.id || '');
  const { data: addBacks = [], isLoading: addBacksLoading } = useAddBackCategories(assessment?.id || '');

  const isLoading = assessmentLoading || addBacksLoading;

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-3 mb-8">
          <Calculator className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">EBITDA Calculator</h1>
            <p className="text-muted-foreground">Analyze your current EBITDA and explore scenarios</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-3 mb-8">
          <Calculator className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">EBITDA Calculator</h1>
            <p className="text-muted-foreground">Analyze your current EBITDA and explore scenarios</p>
          </div>
        </div>
        
        <Alert>
          <AlertDescription>
            No financial assessment found. Please complete your financial assessment first to use the EBITDA calculator.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Calculator className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">EBITDA Calculator</h1>
          <p className="text-muted-foreground">
            Analyze your current EBITDA and explore potential improvements
          </p>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Evidence-Based EBITDA */}
        <EBITDADisplay 
          assessment={assessment} 
          addBacks={addBacks}
          className="h-fit"
        />

        {/* Right Panel - EBITDA Simulator */}
        <EBITDASimulator 
          baseline={assessment}
          className="h-fit"
        />
      </div>

      {/* Additional Information */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg">Understanding Your EBITDA</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Evidence-Based Calculator (Left)</h4>
              <p className="text-muted-foreground">
                Shows your actual EBITDA based on submitted financial data. This is the "true" 
                calculation that potential buyers would see and is used for valuation purposes.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Scenario Simulator (Right)</h4>
              <p className="text-muted-foreground">
                Explore "what-if" scenarios to understand how operational improvements could 
                impact your EBITDA. Use this to identify opportunities for value creation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}