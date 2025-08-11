
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { AuthProvider } from '@/components/AuthProvider';
import { ProgressProvider } from '@/components/ProgressProvider';
import AdminRoute from '@/components/AdminRoute';
import { ClientRoute } from '@/components/ClientRoute';
import AdminLayout from '@/components/AdminLayout';
import { ClientPortalLayout } from '@/components/ClientPortalLayout';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Page Imports
import AssessmentPage from '@/pages/AssessmentPage';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminInquiries from '@/pages/AdminInquiries';
import AdminLogin from '@/pages/AdminLogin';
import AdminCompanyDetail from '@/pages/AdminCompanyDetail';
import AdminInitialEBITDA from '@/pages/AdminInitialEBITDA';

const queryClient = new QueryClient();

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ProgressProvider>
            <Router>
              <Routes>
                {/* Public Routes */}
                <Route path="/assessment" element={<AssessmentPage />} />

                {/* Client Routes */}
                <Route path="/client/*" element={
                  <ClientRoute>
                    <ClientPortalLayout>
                      <Routes>
                        <Route path="*" element={<div>Client area under construction</div>} />
                      </Routes>
                    </ClientPortalLayout>
                  </ClientRoute>
                } />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/*" element={
                  <AdminRoute>
                    <AdminLayout>
                      <Routes>
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="inquiries" element={<AdminInquiries />} />
                        <Route path="companies/:id" element={<AdminCompanyDetail />} />
                        <Route path="companies/:id/initial-ebitda" element={<AdminInitialEBITDA />} />
                        <Route path="activity" element={<div>Admin activity page under construction</div>} />
                        <Route path="*" element={<div>Admin page not found</div>} />
                      </Routes>
                    </AdminLayout>
                  </AdminRoute>
                } />

                {/* Root redirect */}
                <Route path="/" element={<div>Welcome to the application</div>} />
                
                {/* Catch-all for unmatched routes */}
                <Route path="*" element={<div>Page not found</div>} />
              </Routes>
              <Toaster />
              <Sonner />
            </Router>
          </ProgressProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
