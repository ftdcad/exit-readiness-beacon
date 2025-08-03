import { useAuth } from '@/hooks/useAuth';
import { useInquiryStats } from '@/hooks/useInquiries';
import { useProfileStats } from '@/hooks/useProfiles';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { LogOut, Users, Building2, FileText, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const { profile } = useAuth();
  const { data: inquiryStats, isLoading: inquiryLoading } = useInquiryStats();
  const { data: profileStats, isLoading: profileLoading } = useProfileStats();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {profile?.full_name || profile?.email}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Companies
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {inquiryLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{inquiryStats?.total || 0}</div>
            )}
            <p className="text-xs text-muted-foreground">
              Submitted assessments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Review
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {inquiryLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{inquiryStats?.pending || 0}</div>
            )}
            <p className="text-xs text-muted-foreground">
              Awaiting admin review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Admin Users
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {profileLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{profileStats?.admins || 0}</div>
            )}
            <p className="text-xs text-muted-foreground">
              Active administrators
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Welcome to the admin dashboard. Here you can manage company assessments, 
            view submissions, and administer user accounts.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button disabled>
              <Building2 className="w-4 h-4 mr-2" />
              View Companies (Coming Soon)
            </Button>
            
            <Button variant="outline" disabled>
              <Users className="w-4 h-4 mr-2" />
              Manage Users (Coming Soon)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;