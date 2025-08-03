import { useAuth } from '@/hooks/useAuth';
import { useInquiryStats } from '@/hooks/useInquiries';
import { useProfileStats } from '@/hooks/useProfiles';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { LogOut, Users, Building2, FileText, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const { profile, signOut } = useAuth();
  const { data: inquiryStats, isLoading: inquiryLoading } = useInquiryStats();
  const { data: profileStats, isLoading: profileLoading } = useProfileStats();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background-card border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-foreground-secondary">
              Welcome back, {profile?.full_name || profile?.email}
            </p>
          </div>
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="border-border text-foreground hover:bg-background-hover"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Stats Cards */}
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground-secondary">
                Total Companies
              </CardTitle>
              <Building2 className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              {inquiryLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold text-foreground">{inquiryStats?.total || 0}</div>
              )}
              <p className="text-xs text-foreground-muted">
                Submitted assessments
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground-secondary">
                Pending Review
              </CardTitle>
              <FileText className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              {inquiryLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold text-foreground">{inquiryStats?.pending || 0}</div>
              )}
              <p className="text-xs text-foreground-muted">
                Awaiting admin review
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground-secondary">
                Admin Users
              </CardTitle>
              <Users className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              {profileLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold text-foreground">{profileStats?.admins || 0}</div>
              )}
              <p className="text-xs text-foreground-muted">
                Active administrators
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-foreground">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-foreground-secondary">
              Welcome to the admin dashboard. Here you can manage company assessments, 
              view submissions, and administer user accounts.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button 
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
                disabled
              >
                <Building2 className="w-4 h-4 mr-2" />
                View Companies (Coming Soon)
              </Button>
              
              <Button 
                variant="outline"
                className="border-border text-foreground hover:bg-background-hover"
                disabled
              >
                <Users className="w-4 h-4 mr-2" />
                Manage Users (Coming Soon)
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;