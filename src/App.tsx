import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { AuthProvider } from '@/components/AuthProvider';
import { ProgressProvider } from '@/components/ProgressProvider';
import AdminRoute from '@/components/AdminRoute';
import ClientRoute from '@/components/ClientRoute';
import AdminLayout from '@/components/AdminLayout';
import ClientPortalLayout from '@/components/ClientPortalLayout';
import ErrorBoundary from '@/components/ErrorBoundary';

// Page Imports
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import AssessmentPage from '@/pages/AssessmentPage';
import ClientDashboard from '@/pages/ClientDashboard';
import ClientProfilePage from '@/pages/ClientProfilePage';
import ClientDataRoom from '@/pages/ClientDataRoom';
import ClientSimulator from '@/pages/ClientSimulator';
import ContactPage from '@/pages/ContactPage';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminInquiries from '@/pages/AdminInquiries';
import AdminUsers from '@/pages/AdminUsers';
import AdminActivity from '@/pages/AdminActivity';
import AdminLogin from '@/pages/AdminLogin';

import AdminCompanyDetail from '@/pages/AdminCompanyDetail';
import AdminInitialEBITDA from '@/pages/AdminInitialEBITDA';

const queryClient = new QueryClient();

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <AuthProvider>
            <ProgressProvider>
              <Router>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/assessment" element={<AssessmentPage />} />
                  <Route path="/contact" element={<ContactPage />} />

                  {/* Client Routes */}
                  <Route path="/client/*" element={
                    <ClientRoute>
                      <ClientPortalLayout>
                        <Routes>
                          <Route path="dashboard" element={<ClientDashboard />} />
                          <Route path="profile" element={<ClientProfilePage />} />
                          <Route path="data-room" element={<ClientDataRoom />} />
                          <Route path="simulator" element={<ClientSimulator />} />
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
                          <Route path="users" element={<AdminUsers />} />
                          <Route path="activity" element={<AdminActivity />} />
                          <Route path="companies/:id" element={<AdminCompanyDetail />} />
                          <Route path="companies/:id/initial-ebitda" element={<AdminInitialEBITDA />} />
                        </Routes>
                      </AdminLayout>
                    </AdminRoute>
                  } />

                  {/* Not Found Route */}
                  <Route path="*" element={<p>Page not found</p>} />
                </Routes>
                <Toaster />
                <Sonner />
              </Router>
            </ProgressProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
