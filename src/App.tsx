
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthRoute } from "./components/AuthRoute";
import { AdminRoute } from "./components/AdminRoute";
import { ClientRoute } from "./components/ClientRoute";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ClientPortalLayout } from "./components/ClientPortalLayout";
import { AdminLayout } from "./components/AdminLayout";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import AdminLogin from "./pages/AdminLogin";
import ScheduleConsultationPage from "./pages/ScheduleConsultationPage";
import AssessmentPage from "./pages/AssessmentPage";
import NotFound from "./pages/NotFound";
import CompanyDetail from "./pages/CompanyDetail";

// Admin pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminInquiries from "./pages/AdminInquiries";

// Client portal pages
import ClientPortalDashboard from "./pages/ClientPortalDashboard";
import GlossaryPage from "./pages/GlossaryPage";
import EBITDACoursePage from "./pages/EBITDACoursePage";
import EBITDACalculatorPage from "./pages/EBITDACalculatorPage";
import IndustryMultiplesPage from "./pages/IndustryMultiplesPage";
import ScenarioPlanningPage from "./pages/ScenarioPlanningPage";
import BusinessScorecardPage from "./pages/week-3/BusinessScorecardPage";
import ManagementScorecardPage from "./pages/week-3/ManagementScorecardPage";
import DealProgressionPage from "./pages/DealProgressionPage";
import ProfessionalAdvisorsPage from "./pages/ProfessionalAdvisorsPage";
import KnowYourBuyerPage from "./pages/KnowYourBuyerPage";
import AssetFreeEducationPage from "./pages/AssetFreeEducationPage";
import TimeKillsDealsPage from "./pages/TimeKillsDealsPage";
import DataRoomIntroPage from "./pages/DataRoomIntroPage";
import DataRoomPage from "./pages/DataRoomPage";
import DataRoomWorkspacePage from "./pages/DataRoomWorkspacePage";
import AssetWorkshopPage from "./pages/AssetWorkshopPage";
import HoldCoStructurePage from "./pages/week-2/HoldCoStructurePage";
import QuickWinsPage from "./pages/QuickWinsPage";
import DebtInterestPage from "./pages/week-2/DebtInterestPage";
import EarnoutsMultipliersPage from "./pages/week-2/EarnoutsMultipliersPage";
import PostClosingRealityPage from "./pages/week-2/PostClosingRealityPage";
import ExecutiveDiscoveryInterviewPage from "./pages/ExecutiveDiscoveryInterviewPage";
import StrategyDocBuilderPage from "./pages/StrategyDocBuilderPage";
import KPIandOKRPage from "./pages/KPIandOKRPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ErrorBoundary>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/schedule-consultation" element={<ScheduleConsultationPage />} />
              <Route path="/assessment" element={<AssessmentPage />} />
              
              {/* Admin routes */}
              <Route path="/admin" element={
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
              
              <Route path="/admin/company/:id" element={
                <AdminRoute>
                  <AdminLayout>
                    <CompanyDetail />
                  </AdminLayout>
                </AdminRoute>
              } />
              
              {/* Client portal routes */}
              <Route path="/portal/dashboard" element={
                <ClientRoute>
                  <ClientPortalLayout>
                    <ClientPortalDashboard />
                  </ClientPortalLayout>
                </ClientRoute>
              } />
              
              {/* Week 1 modules */}
              <Route path="/portal/week-1/glossary" element={
                <ClientRoute>
                  <ClientPortalLayout>
                    <GlossaryPage />
                  </ClientPortalLayout>
                </ClientRoute>
              } />
              
              <Route path="/portal/week-1/deal-progression" element={
                <ClientRoute>
                  <ClientPortalLayout>
                    <DealProgressionPage />
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
              
              <Route path="/portal/week-1/know-your-buyer" element={
                <ClientRoute>
                  <ClientPortalLayout>
                    <KnowYourBuyerPage />
                  </ClientPortalLayout>
                </ClientRoute>
              } />
              
              <Route path="/portal/week-1/asset-free-education" element={
                <ClientRoute>
                  <ClientPortalLayout>
                    <AssetFreeEducationPage />
                  </ClientPortalLayout>
                </ClientRoute>
              } />
              
              <Route path="/portal/week-1/time-kills-deals" element={
                <ClientRoute>
                  <ClientPortalLayout>
                    <TimeKillsDealsPage />
                  </ClientPortalLayout>
                </ClientRoute>
              } />
              
              <Route path="/portal/week-1/ebitda-course" element={
                <ClientRoute>
                  <ClientPortalLayout>
                    <EBITDACoursePage />
                  </ClientPortalLayout>
                </ClientRoute>
              } />
              
              {/* Week 2 modules */}
              <Route path="/portal/week-2/data-room" element={
                <ClientRoute>
                  <ClientPortalLayout>
                    <DataRoomIntroPage />
                  </ClientPortalLayout>
                </ClientRoute>
              } />
              
              <Route path="/portal/week-2/data-room/workspace" element={
                <ClientRoute>
                  <ClientPortalLayout>
                    <DataRoomWorkspacePage />
                  </ClientPortalLayout>
                </ClientRoute>
              } />
              
              <Route path="/portal/week-2/data-room/builder" element={
                <ClientRoute>
                  <ClientPortalLayout>
                    <DataRoomPage />
                  </ClientPortalLayout>
                </ClientRoute>
              } />
              
              <Route path="/portal/week-2/asset-workshop" element={
                <ClientRoute>
                  <ClientPortalLayout>
                    <AssetWorkshopPage />
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
              
              <Route path="/portal/week-2/quick-wins" element={
                <ClientRoute>
                  <ClientPortalLayout>
                    <QuickWinsPage />
                  </ClientPortalLayout>
                </ClientRoute>
              } />
              
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
              
              <Route path="/portal/week-2/post-closing-reality" element={
                <ClientRoute>
                  <ClientPortalLayout>
                    <PostClosingRealityPage />
                  </ClientPortalLayout>
                </ClientRoute>
              } />
              
              {/* Week 3 modules */}
              <Route path="/portal/week-3/ebitda-calculator" element={
                <ClientRoute>
                  <ClientPortalLayout>
                    <EBITDACalculatorPage />
                  </ClientPortalLayout>
                </ClientRoute>
              } />
              
              <Route path="/portal/week-3/multiples" element={
                <ClientRoute>
                  <ClientPortalLayout>
                    <IndustryMultiplesPage />
                  </ClientPortalLayout>
                </ClientRoute>
              } />
              
              <Route path="/portal/week-3/scenarios" element={
                <ClientRoute>
                  <ClientPortalLayout>
                    <ScenarioPlanningPage />
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
              
              <Route path="/portal/week-3/scorecard" element={
                <ClientRoute>
                  <ClientPortalLayout>
                    <ManagementScorecardPage />
                  </ClientPortalLayout>
                </ClientRoute>
              } />
              
              {/* Week 4 modules */}
              <Route path="/portal/week-4/executive-discovery" element={
                <ClientRoute>
                  <ClientPortalLayout>
                    <ExecutiveDiscoveryInterviewPage />
                  </ClientPortalLayout>
                </ClientRoute>
              } />
              
              <Route path="/portal/week-4/value-builder" element={
                <ClientRoute>
                  <ClientPortalLayout>
                    <StrategyDocBuilderPage />
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
              
              {/* Catch all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ErrorBoundary>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
