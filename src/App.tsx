import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import AssessmentPage from "./pages/AssessmentPage";
import AssessmentSuccessPage from "./pages/AssessmentSuccessPage";
import ClientPortalDashboard from "./pages/ClientPortalDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminInquiries from "./pages/AdminInquiries";
import CompanyDetail from "./pages/CompanyDetail";
import NotFound from "./pages/NotFound";
import { ClientRoute } from "./components/ClientRoute";
import { AdminRoute } from "./components/AdminRoute";
import { ClientPortalLayout } from "./components/ClientPortalLayout";
import { AdminLayout } from "./components/AdminLayout";

// Week 1 pages
import EBITDACalculatorPage from "./pages/EBITDACalculatorPage";
import IndustryMultiplesPage from "./pages/IndustryMultiplesPage";
import ScenarioPlanningPage from "./pages/ScenarioPlanningPage";
import GlossaryPage from "./pages/GlossaryPage";
import QuickWinsPage from "./pages/QuickWinsPage";
import KnowYourBuyerPage from "./pages/KnowYourBuyerPage";
import StrategyDocBuilderPage from "./pages/StrategyDocBuilderPage";
import ExecutiveDiscoveryInterviewPage from "./pages/ExecutiveDiscoveryInterviewPage";
import AssetWorkshopPage from "./pages/AssetWorkshopPage";
import DataRoomPage from "./pages/DataRoomPage";
import DataRoomIntroPage from "./pages/DataRoomIntroPage";
import DataRoomWorkspacePage from "./pages/DataRoomWorkspacePage";
import ScheduleConsultationPage from "./pages/ScheduleConsultationPage";
import ProfessionalAdvisorsPage from "./pages/ProfessionalAdvisorsPage";
import AssetFreeEducationPage from "./pages/AssetFreeEducationPage";
import TimeKillsDealsPage from "./pages/TimeKillsDealsPage";
import DealProgressionPage from "./pages/DealProgressionPage";
import EBITDACoursePage from "./pages/EBITDACoursePage";

// Week 2 pages
import DebtInterestPage from "./pages/week-2/DebtInterestPage";
import EarnoutsMultipliersPage from "./pages/week-2/EarnoutsMultipliersPage";
import HoldCoStructurePage from "./pages/week-2/HoldCoStructurePage";
import PostClosingRealityPage from "./pages/week-2/PostClosingRealityPage";

// Week 3 pages
import TopPerformersPage from "./pages/week-3/TopPerformersPage";
import BusinessScorecardPage from "./pages/week-3/BusinessScorecardPage";
import ManagementScorecardPage from "./pages/week-3/ManagementScorecardPage";
import DealKillersDiagnosticPage from "./pages/week-3/DealKillersDiagnosticPage";

// Week 4 pages
import DueDiligenceChecklistPage from "./pages/week-4/DueDiligenceChecklistPage";
import FinalReportPage from "./pages/week-4/FinalReportPage";
import LOIReviewPage from "./pages/LOIReviewPage";
import KPIandOKRPage from "./pages/KPIandOKRPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/assessment" element={<AssessmentPage />} />
            <Route path="/assessment-success" element={<AssessmentSuccessPage />} />
            
            {/* Admin routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={
              <AdminRoute>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/inquiries" element={
              <AdminRoute>
                <AdminLayout>
                  <AdminInquiries />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/companies/:id" element={
              <AdminRoute>
                <AdminLayout>
                  <CompanyDetail />
                </AdminLayout>
              </AdminRoute>
            } />

            {/* Client portal routes */}
            <Route path="/portal" element={
              <ClientRoute>
                <ClientPortalLayout>
                  <ClientPortalDashboard />
                </ClientPortalLayout>
              </ClientRoute>
            } />

            {/* Week 1 routes */}
            <Route path="/portal/week-1" element={<Navigate to="/portal/week-1/glossary" replace />} />
            <Route path="/portal/week-1/glossary" element={
              <ClientRoute>
                <ClientPortalLayout>
                  <GlossaryPage />
                </ClientPortalLayout>
              </ClientRoute>
            } />
            <Route path="/portal/week-1/ebitda-calculator" element={
              <ClientRoute>
                <ClientPortalLayout>
                  <EBITDACalculatorPage />
                </ClientPortalLayout>
              </ClientRoute>
            } />
            <Route path="/portal/week-1/industry-multiples" element={
              <ClientRoute>
                <ClientPortalLayout>
                  <IndustryMultiplesPage />
                </ClientPortalLayout>
              </ClientRoute>
            } />
            <Route path="/portal/week-1/scenario-planning" element={
              <ClientRoute>
                <ClientPortalLayout>
                  <ScenarioPlanningPage />
                </ClientPortalLayout>
              </ClientRoute>
            } />
            <Route path="/portal/week-1/quick-wins" element={
              <ClientRoute>
                <ClientPortalLayout>
                  <QuickWinsPage />
                </ClientPortalLayout>
              </ClientRoute>
            } />
            <Route path="/portal/week-1/know-your-buyer" element={
              <ClientRoute>
                <ClientPortalLayout>
                  <KnowYourBuyerPage />
                </ClientPortalLayout>
              </ClientRoute>
            } />
            <Route path="/portal/week-1/professional-advisors" element={
              <ClientRoute>
                <ClientPortalLayout>
                  <ProfessionalAdvisorsPage />
                </ClientPortalLayout>
              </ClientRoute>
            } />

            {/* Week 2 routes */}
            <Route path="/portal/week-2" element={<Navigate to="/portal/week-2/debt-interest" replace />} />
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
            <Route path="/portal/week-2/asset-free-education" element={
              <ClientRoute>
                <ClientPortalLayout>
                  <AssetFreeEducationPage />
                </ClientPortalLayout>
              </ClientRoute>
            } />
            <Route path="/portal/week-2/time-kills-deals" element={
              <ClientRoute>
                <ClientPortalLayout>
                  <TimeKillsDealsPage />
                </ClientPortalLayout>
              </ClientRoute>
            } />
            <Route path="/portal/week-2/deal-progression" element={
              <ClientRoute>
                <ClientPortalLayout>
                  <DealProgressionPage />
                </ClientPortalLayout>
              </ClientRoute>
            } />

            {/* Week 3 routes */}
            <Route path="/portal/week-3" element={<Navigate to="/portal/week-3/top-performers" replace />} />
            <Route path="/portal/week-3/top-performers" element={
              <ClientRoute>
                <ClientPortalLayout>
                  <TopPerformersPage />
                </ClientPortalLayout>
              </ClientRoute>
            } />
            <Route path="/portal/week-3/business-scorecard" element={
              <ClientRoute>
                <ClientPortalLayout>
                  <BusinessScorecardPage />
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
            <Route path="/portal/week-3/deal-killers-diagnostic" element={
              <ClientRoute>
                <ClientPortalLayout>
                  <DealKillersDiagnosticPage />
                </ClientPortalLayout>
              </ClientRoute>
            } />
            <Route path="/portal/week-3/ebitda-course" element={
              <ClientRoute>
                <ClientPortalLayout>
                  <EBITDACoursePage />
                </ClientPortalLayout>
              </ClientRoute>
            } />
            <Route path="/portal/week-3/strategy-doc-builder" element={
              <ClientRoute>
                <ClientPortalLayout>
                  <StrategyDocBuilderPage />
                </ClientPortalLayout>
              </ClientRoute>
            } />
            <Route path="/portal/week-3/executive-discovery-interview" element={
              <ClientRoute>
                <ClientPortalLayout>
                  <ExecutiveDiscoveryInterviewPage />
                </ClientPortalLayout>
              </ClientRoute>
            } />

            {/* Week 4 routes */}
            <Route path="/portal/week-4" element={<Navigate to="/portal/week-4/due-diligence-checklist" replace />} />
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
            <Route path="/portal/week-4/asset-workshop" element={
              <ClientRoute>
                <ClientPortalLayout>
                  <AssetWorkshopPage />
                </ClientPortalLayout>
              </ClientRoute>
            } />
            <Route path="/portal/week-4/data-room" element={
              <ClientRoute>
                <ClientPortalLayout>
                  <DataRoomPage />
                </ClientPortalLayout>
              </ClientRoute>
            } />
            <Route path="/portal/week-4/data-room-intro" element={
              <ClientRoute>
                <ClientPortalLayout>
                  <DataRoomIntroPage />
                </ClientPortalLayout>
              </ClientRoute>
            } />
            <Route path="/portal/week-4/data-room-workspace" element={
              <ClientRoute>
                <ClientPortalLayout>
                  <DataRoomWorkspacePage />
                </ClientPortalLayout>
              </ClientRoute>
            } />

            {/* Additional routes for compatibility */}
            <Route path="/portal/loi-review" element={
              <ClientRoute>
                <ClientPortalLayout>
                  <LOIReviewPage />
                </ClientPortalLayout>
              </ClientRoute>
            } />
            <Route path="/portal/kpi-okr" element={
              <ClientRoute>
                <ClientPortalLayout>
                  <KPIandOKRPage />
                </ClientPortalLayout>
              </ClientRoute>
            } />
            <Route path="/portal/schedule-consultation" element={
              <ClientRoute>
                <ClientPortalLayout>
                  <ScheduleConsultationPage />
                </ClientPortalLayout>
              </ClientRoute>
            } />

            {/* Fallback route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
