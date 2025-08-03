import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/AdminSidebar';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-12 flex items-center justify-between border-b bg-background">
            <SidebarTrigger className="ml-2" />
            <Button variant="outline" size="sm" asChild className="mr-4">
              <Link to="/" className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                View Site
              </Link>
            </Button>
          </header>
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;