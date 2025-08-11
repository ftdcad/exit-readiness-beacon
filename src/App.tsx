import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { Toaster as RadixToaster } from '@/components/ui/toaster';
import { ThemeProvider } from 'next-themes';

// Import pages
import Index from '@/pages/Index';
import AuthPage from '@/pages/AuthPage';
import AdminLogin from '@/pages/AdminLogin';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminInquiries from '@/pages/AdminInquiries';
import ClientPortalDashboard from '@/pages/ClientPortalDashboard';
import AssessmentPage from '@/pages/AssessmentPage';
import EBITDACalculatorPage from '@/pages/EBITDACalculatorPage';
import EBITDACoursePage from '@/pages/EBITDACoursePage';
import IndustryMultiplesPage from '@/pages/IndustryMultiplesPage';
import ScheduleConsultationPage from '@/pages/ScheduleConsultationPage';
import NotFound from '@/pages/NotFound';
import GlossaryPage from '@/pages/GlossaryPage';
import KnowYourBuyerPage from '@/pages/KnowYourBuyerPage';
import DataRoomIntroPage from '@/pages/DataRoomIntroPage';
import DataRoomPage from '@/pages/DataRoomPage';
import DataRoomWorkspacePage from '@/pages/DataRoomWorkspacePage';
import CompanyDetail from '@/pages/CompanyDetail';
import AssetWorkshopPage from '@/pages/AssetWorkshopPage';
import AssetFreeEducationPage from '@/pages/AssetFreeEducationPage';
import ScenarioPlanningPage from '@/pages/ScenarioPlanningPage';
import StrategyDocBuilderPage from '@/pages/StrategyDocBuilderPage';
import QuickWinsPage from '@/pages/QuickWinsPage';
import TimeKillsDealsPage from '@/pages/TimeKillsDealsPage';
import ProfessionalAdvisorsPage from '@/pages/ProfessionalAdvisorsPage';
import DealProgressionPage from '@/pages/DealProgressionPage';
import ExecutiveDiscoveryInterviewPage from '@/pages/ExecutiveDiscoveryInterviewPage';
import KPIandOKRPage from '@/pages/KPIandOKRPage';
import LOIReviewPage from '@/pages/LOIReviewPage';

// Week 2 Pages
import DebtInterestPage from '@/pages/week-2/DebtInterestPage';
import EarnoutsMultipliersPage from '@/pages/week-2/EarnoutsMultipliersPage';
import HoldCoStructurePage from '@/pages/week-2/HoldCoStructurePage';
import PostClosingRealityPage from '@/pages/week-2/PostClosingRealityPage';

// Week 3 Pages
import BusinessScorecardPage from '@/pages/week-3/BusinessScorecardPage';
import ManagementScorecardPage from '@/pages/week-3/ManagementScorecardPage';
import DealKillersDiagnosticPage from '@/pages/week-3/DealKillersDiagnosticPage';
import TopPerformersPage from '@/pages/week-3/TopPerformersPage';

// Week 4 Pages
import DueDiligenceChecklistPage from '@/pages/week-4/DueDiligenceChecklistPage';
import FinalReportPage from '@/pages/week-4/FinalReportPage';

// Layout components
import ClientPortalLayout from '@/components/ClientPortalLayout';
import AdminLayout from '@/components/AdminLayout';
import ClientRoute from '@/components/ClientRoute';
import AdminRoute from '@/components/AdminRoute';
import ErrorBoundary from '@/components/ErrorBoundary';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" enableSystem>
        <Router>
          <ErrorBoundary>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/glossary" element={<GlossaryPage />} />
              <Route path="/know-your-buyer" element={<KnowYourBuyerPage />} />
              <Route path="/data-room-intro" element={<DataRoomIntroPage />} />
              <Route path="/asset-workshop" element={<AssetWorkshopPage />} />
              <Route path="/asset-free-education" element={<AssetFreeEducationPage />} />
              <Route path="/schedule-consultation" element={<ScheduleConsultationPage />} />
              <Route path="/scenario-planning" element={<ScenarioPlanningPage />} />
              <Route path="/strategy-doc-builder" element={<StrategyDocBuilderPage />} />
              <Route path="/quick-wins" element={<QuickWinsPage />} />
              <Route path="/time-kills-deals" element={<TimeKillsDealsPage />} />
              <Route path="/professional-advisors" element={<ProfessionalAdvisorsPage />} />
              <Route path="/deal-progression" element={<DealProgressionPage />} />
              <Route path="/executive-discovery-interview" element={<ExecutiveDiscoveryInterviewPage />} />
              <Route path="/company/:companyId" element={<CompanyDetail />} />
              <Route path="*" element={<NotFound />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="inquiries" element={<AdminRoute><AdminInquiries /></AdminRoute>} />
              </Route>

              {/* Client Portal Routes */}
              <Route path="/portal" element={<ClientPortalLayout />}>
                <Route index element={<ClientRoute><ClientPortalDashboard /></ClientRoute>} />
                <Route path="dashboard" element={<ClientRoute><ClientPortalDashboard /></ClientRoute>} />
                <Route path="assessment" element={<ClientRoute><AssessmentPage /></ClientRoute>} />
                <Route path="ebitda-calculator" element={<ClientRoute><EBITDACalculatorPage /></ClientRoute>} />
                <Route path="ebitda-course" element={<ClientRoute><EBITDACoursePage /></ClientRoute>} />
                <Route path="industry-multiples" element={<ClientRoute><IndustryMultiplesPage /></ClientRoute>} />
                <Route path="data-room" element={<ClientRoute><DataRoomPage /></ClientRoute>} />
                <Route path="data-room-workspace" element={<ClientRoute><DataRoomWorkspacePage /></ClientRoute>} />

                {/* Week 2 Routes */}
                <Route path="week-2/debt-interest" element={<ClientRoute><DebtInterestPage /></ClientRoute>} />
                <Route path="week-2/earnouts-multipliers" element={<ClientRoute><EarnoutsMultipliersPage /></ClientRoute>} />
                <Route path="week-2/holdco-structure" element={<ClientRoute><HoldCoStructurePage /></ClientRoute>} />
                <Route path="week-2/post-closing-reality" element={<ClientRoute><PostClosingRealityPage /></ClientRoute>} />

                {/* Week 3 Routes */}
                <Route path="week-3/business-scorecard" element={<ClientRoute><BusinessScorecardPage /></ClientRoute>} />
                <Route path="week-3/management-scorecard" element={<ClientRoute><ManagementScorecardPage /></ClientRoute>} />
                <Route path="week-3/deal-killers" element={<ClientRoute><DealKillersDiagnosticPage /></ClientRoute>} />
                <Route path="week-3/top-performers" element={<ClientRoute><TopPerformersPage /></ClientRoute>} />

                {/* Week 4 Routes */}
                <Route path="week-4/kpis-okrs" element={<ClientRoute><KPIandOKRPage /></ClientRoute>} />
                <Route path="week-4/due-diligence" element={<ClientRoute><DueDiligenceChecklistPage /></ClientRoute>} />
                <Route path="week-4/loi-review" element={<ClientRoute><LOIReviewPage /></ClientRoute>} />
                <Route path="week-4/final-report" element={<ClientRoute><FinalReportPage /></ClientRoute>} />
              </Route>
            </Routes>
          </ErrorBoundary>
        </Router>
        <Toaster />
        <RadixToaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
