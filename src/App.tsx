
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import AuthPage from '@/pages/AuthPage';
import AdminLogin from '@/pages/AdminLogin';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminInquiries from '@/pages/AdminInquiries';
import CompanyDetail from '@/pages/CompanyDetail';
import AssessmentPage from '@/pages/AssessmentPage';
import EBITDACalculatorPage from '@/pages/EBITDACalculatorPage';
import EBITDACoursePage from '@/pages/EBITDACoursePage';
import IndustryMultiplesPage from '@/pages/IndustryMultiplesPage';
import GlossaryPage from '@/pages/GlossaryPage';
import { ScheduleConsultationPage } from '@/pages/ScheduleConsultationPage';
import NotFound from '@/pages/NotFound';
import QuickWinsPage from '@/pages/QuickWinsPage';
import { DataRoomIntroPage } from '@/pages/DataRoomIntroPage';
import DataRoomPage from '@/pages/DataRoomPage';
import { DataRoomWorkspacePage } from '@/pages/DataRoomWorkspacePage';
import AssetWorkshopPage from '@/pages/AssetWorkshopPage';
import AssetFreeEducationPage from '@/pages/AssetFreeEducationPage';
import { ScenarioPlanningPage } from '@/pages/ScenarioPlanningPage';
import StrategyDocBuilderPage from '@/pages/StrategyDocBuilderPage';
import KnowYourBuyerPage from '@/pages/KnowYourBuyerPage';
import ExecutiveDiscoveryInterviewPage from '@/pages/ExecutiveDiscoveryInterviewPage';
import KPIandOKRPage from '@/pages/KPIandOKRPage';
import TimeKillsDealsPage from '@/pages/TimeKillsDealsPage';
import ProfessionalAdvisorsPage from '@/pages/ProfessionalAdvisorsPage';

// Week 2 imports
import { DebtInterestPage } from '@/pages/week-2/DebtInterestPage';
import { EarnoutsMultipliersPage } from '@/pages/week-2/EarnoutsMultipliersPage';
import { HoldCoStructurePage } from '@/pages/week-2/HoldCoStructurePage';
import { PostClosingRealityPage } from '@/pages/week-2/PostClosingRealityPage';

// Week 3 imports
import { BusinessScorecardPage } from '@/pages/week-3/BusinessScorecardPage';
import { DealKillersDiagnosticPage } from '@/pages/week-3/DealKillersDiagnosticPage';
import { ManagementScorecardPage } from '@/pages/week-3/ManagementScorecardPage';
import { TopPerformersPage } from '@/pages/week-3/TopPerformersPage';

// Week 4 imports
import { DueDiligenceChecklistPage } from '@/pages/week-4/DueDiligenceChecklistPage';
import { FinalReportPage } from '@/pages/week-4/FinalReportPage';

// Portal imports
import ClientPortalDashboard from '@/pages/ClientPortalDashboard';
import { LOIReviewPage } from '@/pages/LOIReviewPage';
import { DealProgressionPage } from '@/pages/DealProgressionPage';

// Component imports
import AdminLayout from '@/components/AdminLayout';
import AdminRoute from '@/components/AdminRoute';
import { ClientPortalLayout } from '@/components/ClientPortalLayout';
import { AdminSidebar } from '@/components/AdminSidebar';
import { ClientRoute } from '@/components/ClientRoute';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ErrorBoundary>
          <div className="min-h-screen bg-background">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/assessment" element={<AssessmentPage />} />
              <Route path="/ebitda-calculator" element={<EBITDACalculatorPage />} />
              <Route path="/ebitda-course" element={<EBITDACoursePage />} />
              <Route path="/industry-multiples" element={<IndustryMultiplesPage />} />
              <Route path="/glossary" element={<GlossaryPage />} />
              <Route path="/schedule-consultation" element={<ScheduleConsultationPage />} />
              <Route path="/quick-wins" element={<QuickWinsPage />} />
              <Route path="/asset-workshop" element={<AssetWorkshopPage />} />
              <Route path="/asset-free-education" element={<AssetFreeEducationPage />} />
              <Route path="/scenario-planning" element={<ScenarioPlanningPage />} />
              <Route path="/strategy-doc-builder" element={<StrategyDocBuilderPage />} />
              <Route path="/know-your-buyer" element={<KnowYourBuyerPage />} />
              <Route path="/executive-discovery" element={<ExecutiveDiscoveryInterviewPage />} />
              <Route path="/kpis-okrs" element={<KPIandOKRPage />} />
              <Route path="/time-kills-deals" element={<TimeKillsDealsPage />} />
              <Route path="/professional-advisors" element={<ProfessionalAdvisorsPage />} />

              {/* Admin routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={
                <AdminRoute>
                  <SidebarProvider>
                    <AdminLayout>
                      <AdminDashboard />
                    </AdminLayout>
                  </SidebarProvider>
                </AdminRoute>
              } />
              <Route path="/admin/inquiries" element={
                <AdminRoute>
                  <SidebarProvider>
                    <AdminLayout>
                      <AdminInquiries />
                    </AdminLayout>
                  </SidebarProvider>
                </AdminRoute>
              } />
              <Route path="/admin/companies/:id" element={
                <AdminRoute>
                  <SidebarProvider>
                    <AdminLayout>
                      <CompanyDetail />
                    </AdminLayout>
                  </SidebarProvider>
                </AdminRoute>
              } />

              {/* Client Portal routes */}
              <Route path="/portal" element={
                <ClientRoute>
                  <ClientPortalLayout>
                    <ClientPortalDashboard />
                  </ClientPortalLayout>
                </ClientRoute>
              } />
              
              <Route path="/portal/data-room-intro" element={
                <ClientRoute>
                  <ClientPortalLayout>
                    <DataRoomIntroPage />
                  </ClientPortalLayout>
                </ClientRoute>
              } />
              
              <Route path="/portal/data-room" element={
                <ClientRoute>
                  <ClientPortalLayout>
                    <DataRoomPage />
                  </ClientPortalLayout>
                </ClientRoute>
              } />
              
              <Route path="/portal/data-room/workspace" element={
                <ClientRoute>
                  <ClientPortalLayout>
                    <DataRoomWorkspacePage />
                  </ClientPortalLayout>
                </ClientRoute>
              } />

              {/* Week 2 Portal Routes */}
              <Route path="/portal/week-2/debt-interest" element={
                <ClientRoute>
                  <ClientPortalLayout>
                    <DebtInterestPage />
                  </ClientPortalLayout>
                </ClientRoute>
              } />
              
              <Route path="/portal/week-2/earnouts-multipliers" element={
                <ClientRoute>
                  <ClientPortalLayout>
                    <EarnoutsMultipliersPage />
                  </ClientPortalLayout>
                </ClientRoute>
              } />
              
              <Route path="/portal/week-2/holdco-structure" element={
                <ClientRoute>
                  <ClientPortalLayout>
                    <HoldCoStructurePage />
                  </ClientPortalLayout>
                </ClientRoute>
              } />
              
              <Route path="/portal/week-2/post-closing-reality" element={
                <ClientRoute>
                  <ClientPortalLayout>
                    <PostClosingRealityPage />
                  </ClientPortalLayout>
                </ClientRoute>
              } />

              {/* Week 3 Portal Routes */}
              <Route path="/portal/week-3/business-scorecard" element={
                <ClientRoute>
                  <ClientPortalLayout>
                    <BusinessScorecardPage />
                  </ClientPortalLayout>
                </ClientRoute>
              } />
              
              <Route path="/portal/week-3/deal-killers-diagnostic" element={
                <ClientRoute>
                  <ClientPortalLayout>
                    <DealKillersDiagnosticPage />
                  </ClientPortalLayout>
                </ClientRoute>
              } />
              
              <Route path="/portal/week-3/management-scorecard" element={
                <ClientRoute>
                  <ClientPortalLayout>
                    <ManagementScorecardPage />
                  </ClientPortalLayout>
                </ClientRoute>
              } />
              
              <Route path="/portal/week-3/top-performers" element={
                <ClientRoute>
                  <ClientPortalLayout>
                    <TopPerformersPage />
                  </ClientPortalLayout>
                </ClientRoute>
              } />

              {/* Week 4 Portal Routes */}
              <Route path="/portal/week-4/due-diligence-checklist" element={
                <ClientRoute>
                  <ClientPortalLayout>
                    <DueDiligenceChecklistPage />
                  </ClientPortalLayout>
                </ClientRoute>
              } />
              
              <Route path="/portal/week-4/final-report" element={
                <ClientRoute>
                  <ClientPortalLayout>
                    <FinalReportPage />
                  </ClientPortalLayout>
                </ClientRoute>
              } />
              
              <Route path="/portal/week-4/kpis-okrs" element={
                <ClientRoute>
                  <ClientPortalLayout>
                    <KPIandOKRPage />
                  </ClientPortalLayout>
                </ClientRoute>
              } />

              <Route path="/portal/loi-review" element={
                <ClientRoute>
                  <ClientPortalLayout>
                    <LOIReviewPage />
                  </ClientPortalLayout>
                </ClientRoute>
              } />
              
              <Route path="/portal/deal-progression" element={
                <ClientRoute>
                  <ClientPortalLayout>
                    <DealProgressionPage />
                  </ClientPortalLayout>
                </ClientRoute>
              } />

              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </ErrorBoundary>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
