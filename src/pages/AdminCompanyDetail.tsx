
import { useParams, useNavigate } from 'react-router-dom';
import { useInquiry, useUpdateInquiry } from '@/hooks/useInquiries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Building2, User, Mail, Phone, DollarSign, Calendar, Clock } from 'lucide-react';
import { useState } from 'react';

const AdminCompanyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: inquiry, isLoading, error } = useInquiry(id!);
  const updateInquiry = useUpdateInquiry();
  
  const [status, setStatus] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Initialize state when data loads
  if (inquiry && !status) {
    setStatus(inquiry.status);
    setNotes(inquiry.admin_notes || '');
  }

  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus);
    if (inquiry) {
      updateInquiry.mutate({
        id: inquiry.id,
        updates: { status: newStatus }
      });
    }
  };

  const handleNotesChange = async () => {
    if (inquiry && notes !== inquiry.admin_notes) {
      updateInquiry.mutate({
        id: inquiry.id,
        updates: { admin_notes: notes }
      });
    }
  };

  const formatRevenue = (revenue: number | null) => {
    if (!revenue) return 'Not disclosed';
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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      new: 'default',
      reviewing: 'secondary',
      complete: 'outline',
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'default'}>
        {status}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-destructive">Error loading company details: {error.message}</p>
            <Button variant="outline" onClick={() => navigate('/admin/inquiries')} className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Companies
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!inquiry) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">Company not found</p>
            <Button variant="outline" onClick={() => navigate('/admin/inquiries')} className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Companies
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/admin/inquiries')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Companies
        </Button>
        <h1 className="text-3xl font-bold">{inquiry.company_name}</h1>
        {getStatusBadge(inquiry.status)}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Company Name</label>
              <p className="text-lg font-semibold">{inquiry.company_name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Industry</label>
              <p>{inquiry.industry || 'Not specified'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Annual Revenue</label>
              <p className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                {formatRevenue(inquiry.annual_revenue)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Exit Timeline</label>
              <p>{inquiry.exit_timeline || 'Not specified'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Contact Name</label>
              <p className="text-lg font-semibold">{inquiry.contact_name || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href={`mailto:${inquiry.contact_email}`} className="text-blue-600 hover:underline">
                  {inquiry.contact_email}
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Timeline & Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Submitted</label>
              <p className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(inquiry.created_at)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <Select value={status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="reviewing">Reviewing</SelectItem>
                  <SelectItem value="complete">Complete</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Form Version</label>
              <p>{inquiry.source_form_version || 'Not specified'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Admin Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={handleNotesChange}
              placeholder="Add notes about this company..."
              className="min-h-32"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Notes are automatically saved when you click outside the text area.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminCompanyDetail;
