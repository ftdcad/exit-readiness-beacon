import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AuthPage from "./pages/AuthPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./components/AdminLayout";
import AdminInquiries from "./pages/AdminInquiries";
import CompanyDetail from "./pages/CompanyDetail";
import { ClientRoute } from "./components/ClientRoute";
import { ClientPortalLayout } from "./components/ClientPortalLayout";
import ClientPortalDashboard from "./pages/ClientPortalDashboard";
import GlossaryPage from "./pages/GlossaryPage";
import EBITDACoursePage from "./pages/EBITDACoursePage";
import EBITDACalculatorPage from "./pages/EBITDACalculatorPage";
import AssetWorkshopPage from "./pages/AssetWorkshopPage";
import QuickWinsPage from "./pages/QuickWinsPage";
import KnowYourBuyerPage from "./pages/KnowYourBuyerPage";
import DataRoomPage from "./pages/DataRoomPage";
import ExecutiveDiscoveryInterviewPage from "./pages/ExecutiveDiscoveryInterviewPage";
import StrategyDocBuilderPage from "./pages/StrategyDocBuilderPage";
import KPIandOKRPage from "./pages/KPIandOKRPage";
import IndustryMultiplesPage from "./pages/IndustryMultiplesPage";
import AssessmentPage from "./pages/AssessmentPage";
import { ScenarioPlanningPage } from "./pages/ScenarioPlanningPage";
import { ScheduleConsultationPage } from "./pages/ScheduleConsultationPage";
import AssetFreeEducationPage from "./pages/AssetFreeEducationPage";
import TimeKillsDealsPage from "./pages/TimeKillsDealsPage";
import ProfessionalAdvisorsPage from "./pages/ProfessionalAdvisorsPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        console.error('Query failed:', error);
        return failureCount < 2;
      },
    },
  },
});

// Add some global error handling
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

console.log('App initializing...');

const App = () => {
  React.useEffect(() => {
    console.log('App mounted successfully');
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/assessment" element={<AssessmentPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route 
                path="/admin/dashboard" 
                element={
                  <AdminRoute>
                    <AdminLayout>
                      <AdminDashboard />
                    </AdminLayout>
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/inquiries" 
                element={
                  <AdminRoute>
                    <AdminLayout>
                      <AdminInquiries />
                    </AdminLayout>
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/companies/:id" 
                element={
                  <AdminRoute>
                    <AdminLayout>
                      <CompanyDetail />
                    </AdminLayout>
                  </AdminRoute>
                } 
              />
              
              {/* Client Portal Routes */}
              <Route 
                path="/portal" 
                element={
                  <ClientRoute>
                    <ClientPortalLayout>
                      <ClientPortalDashboard />
                    </ClientPortalLayout>
                  </ClientRoute>
                } 
              />
              
              {/* Week 1 Routes - Foundation & Education */}
              <Route 
                path="/portal/week-1/know-your-buyer" 
                element={
                  <ClientRoute>
                    <ClientPortalLayout>
                      <KnowYourBuyerPage />
                    </ClientPortalLayout>
                  </ClientRoute>
                } 
              />
              <Route 
                path="/portal/week-1/glossary" 
                element={
                  <ClientRoute>
                    <ClientPortalLayout>
                      <GlossaryPage />
                    </ClientPortalLayout>
                  </ClientRoute>
                } 
              />
              <Route 
                path="/portal/week-1/ebitda-course" 
                element={
                  <ClientRoute>
                    <ClientPortalLayout>
                      <EBITDACoursePage />
                    </ClientPortalLayout>
                  </ClientRoute>
                } 
              />
              <Route 
                path="/portal/week-1/asset-free-education" 
                element={
                  <ClientRoute>
                    <ClientPortalLayout>
                      <AssetFreeEducationPage />
                    </ClientPortalLayout>
                  </ClientRoute>
                } 
              />
              <Route 
                path="/portal/week-1/time-kills-deals" 
                element={
                  <ClientRoute>
                    <ClientPortalLayout>
                      <TimeKillsDealsPage />
                    </ClientPortalLayout>
                  </ClientRoute>
                } 
              />
              <Route 
                path="/portal/week-1/professional-advisors" 
                element={
                  <ClientRoute>
                    <ClientPortalLayout>
                      <ProfessionalAdvisorsPage />
                    </ClientPortalLayout>
                  </ClientRoute>
                } 
              />
              
              {/* Week 2 Routes - Deal Readiness */}
              <Route 
                path="/portal/week-2/data-room" 
                element={
                  <ClientRoute>
                    <ClientPortalLayout>
                      <DataRoomPage />
                    </ClientPortalLayout>
                  </ClientRoute>
                } 
              />
              <Route 
                path="/portal/week-2/executive-discovery" 
                element={
                  <ClientRoute>
                    <ClientPortalLayout>
                      <ExecutiveDiscoveryInterviewPage />
                    </ClientPortalLayout>
                  </ClientRoute>
                } 
              />
              <Route 
                path="/portal/week-2/value-builder" 
                element={
                  <ClientRoute>
                    <ClientPortalLayout>
                      <StrategyDocBuilderPage />
                    </ClientPortalLayout>
                  </ClientRoute>
                } 
              />
              <Route 
                path="/portal/week-2/strategy-builder" 
                element={
                  <ClientRoute>
                    <ClientPortalLayout>
                      <StrategyDocBuilderPage />
                    </ClientPortalLayout>
                  </ClientRoute>
                } 
              />
              <Route 
                path="/portal/week-2/kpis-okrs" 
                element={
                  <ClientRoute>
                    <ClientPortalLayout>
                      <KPIandOKRPage />
                    </ClientPortalLayout>
                  </ClientRoute>
                } 
              />
              <Route 
                path="/portal/week-2/asset-workshop" 
                element={
                  <ClientRoute>
                    <ClientPortalLayout>
                      <AssetWorkshopPage />
                    </ClientPortalLayout>
                  </ClientRoute>
                } 
              />
              <Route 
                path="/portal/week-2/quick-wins" 
                element={
                  <ClientRoute>
                    <ClientPortalLayout>
                      <QuickWinsPage />
                    </ClientPortalLayout>
                  </ClientRoute>
                } 
              />
              
              {/* Week 3 Routes - Performance Readiness */}
              <Route 
                path="/portal/week-3/ebitda-calculator" 
                element={
                  <ClientRoute>
                    <ClientPortalLayout>
                      <EBITDACalculatorPage />
                    </ClientPortalLayout>
                  </ClientRoute>
                } 
              />
              <Route 
                path="/portal/week-3/multiples" 
                element={
                  <ClientRoute>
                    <ClientPortalLayout>
                      <IndustryMultiplesPage />
                    </ClientPortalLayout>
                  </ClientRoute>
                } 
              />
              <Route 
                path="/portal/week-3/scenarios" 
                element={
                  <ClientRoute>
                    <ClientPortalLayout>
                      <ScenarioPlanningPage />
                    </ClientPortalLayout>
                  </ClientRoute>
                } 
              />
              
              <Route 
                path="/portal/schedule-consultation" 
                element={
                  <ClientRoute>
                    <ClientPortalLayout>
                      <ScheduleConsultationPage />
                    </ClientPortalLayout>
                  </ClientRoute>
                } 
              />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
