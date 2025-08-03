import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, DollarSign, TrendingUp, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useInquiry } from '@/hooks/useInquiries';
import { useFinancialAssessment } from '@/hooks/useFinancialAssessment';
import { FinancialInputForm } from '@/components/FinancialInputForm';
import { PEReadinessGauge } from '@/components/PEReadinessGauge';

const CompanyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: company, isLoading: companyLoading, error: companyError } = useInquiry(id!);
  const { data: assessment, isLoading: assessmentLoading } = useFinancialAssessment(id!);

  const formatRevenue = (revenue: number | null) => {
    if (!revenue) return 'Not specified';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(revenue);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      new: { variant: 'secondary' as const, label: 'New' },
      contacted: { variant: 'default' as const, label: 'Contacted' },
      qualified: { variant: 'default' as const, label: 'Qualified' },
      proposal_sent: { variant: 'default' as const, label: 'Proposal Sent' },
      closed_won: { variant: 'default' as const, label: 'Closed Won' },
      closed_lost: { variant: 'destructive' as const, label: 'Closed Lost' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.new;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (companyLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64" />
            <Skeleton className="h-48" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-32" />
            <Skeleton className="h-48" />
          </div>
        </div>
      </div>
    );
  }

  if (companyError || !company) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/inquiries')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Inquiries
          </Button>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">Company not found or error loading data.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/admin/inquiries')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Inquiries
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{company.company_name}</h1>
          <p className="text-muted-foreground">
            {company.industry} • Submitted {formatDate(company.created_at)}
          </p>
        </div>
        {getStatusBadge(company.status)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Company Info & Financial Assessment */}
        <div className="lg:col-span-2 space-y-6">
          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Company Name</label>
                  <p className="font-medium">{company.company_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Industry</label>
                  <p className="font-medium">{company.industry || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Annual Revenue</label>
                  <p className="font-medium">{formatRevenue(company.annual_revenue)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Exit Timeline</label>
                  <p className="font-medium">{company.exit_timeline || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Contact Name</label>
                  <p className="font-medium">{company.contact_name || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Contact Email</label>
                  <p className="font-medium">{company.contact_email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Assessment Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Financial Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FinancialInputForm 
                companyId={id!} 
                assessment={assessment} 
                loading={assessmentLoading}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - PE Readiness Score & Metrics */}
        <div className="space-y-6">
          {/* PE Readiness Score */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                PE Readiness Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PEReadinessGauge 
                score={assessment?.pe_readiness_score || 0}
                assessment={assessment}
                company={company}
              />
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Assessment Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className="text-sm font-medium">
                  {assessment?.assessment_status || 'Not Started'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">EBITDA Margin</span>
                <span className="text-sm font-medium">
                  {assessment?.ebitda_margin 
                    ? `${(assessment.ebitda_margin * 100).toFixed(1)}%`
                    : 'Not calculated'
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Current EBITDA</span>
                <span className="text-sm font-medium">
                  {assessment?.current_ebitda 
                    ? formatRevenue(assessment.current_ebitda)
                    : 'Not set'
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Adjusted EBITDA</span>
                <span className="text-sm font-medium">
                  {assessment?.adjusted_ebitda 
                    ? formatRevenue(assessment.adjusted_ebitda)
                    : 'Not calculated'
                  }
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetail;