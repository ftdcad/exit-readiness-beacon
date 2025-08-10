import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminInquiries from "./pages/AdminInquiries";
import ClientPortalDashboard from "./pages/ClientPortalDashboard";
import AssessmentPage from "./pages/AssessmentPage";
import { ScheduleConsultationPage } from "./pages/ScheduleConsultationPage";
import CompanyDetail from "./pages/CompanyDetail";
import DataRoomPage from "./pages/DataRoomPage";
import { DataRoomIntroPage } from "./pages/DataRoomIntroPage";
import { DataRoomWorkspacePage } from "./pages/DataRoomWorkspacePage";
import GlossaryPage from "./pages/GlossaryPage";
import DealProgressionPage from "./pages/DealProgressionPage";
import ProfessionalAdvisorsPage from "./pages/ProfessionalAdvisorsPage";
import KnowYourBuyerPage from "./pages/KnowYourBuyerPage";
import AssetFreeEducationPage from "./pages/AssetFreeEducationPage";
import TimeKillsDealsPage from "./pages/TimeKillsDealsPage";
import EBITDACoursePage from "./pages/EBITDACoursePage";
import AssetWorkshopPage from "./pages/AssetWorkshopPage";
import QuickWinsPage from "./pages/QuickWinsPage";
import EBITDACalculatorPage from "./pages/EBITDACalculatorPage";
import IndustryMultiplesPage from "./pages/IndustryMultiplesPage";
import { ScenarioPlanningPage } from "./pages/ScenarioPlanningPage";
import KPIandOKRPage from "./pages/KPIandOKRPage";
import ExecutiveDiscoveryInterviewPage from "./pages/ExecutiveDiscoveryInterviewPage";
import StrategyDocBuilderPage from "./pages/StrategyDocBuilderPage";
import BusinessScorecardPage from "./pages/week-3/BusinessScorecardPage";
import ManagementScorecardPage from "./pages/week-3/ManagementScorecardPage";
import HoldCoStructurePage from "./pages/week-2/HoldCoStructurePage";
import DebtInterestPage from "./pages/week-2/DebtInterestPage";
import EarnoutsMultipliersPage from "./pages/week-2/EarnoutsMultipliersPage";
import PostClosingRealityPage from "./pages/week-2/PostClosingRealityPage";
import AdminRoute from "./components/AdminRoute";
import { ClientRoute } from "./components/ClientRoute";
import { ClientPortalLayout } from "./components/ClientPortalLayout";
import { ErrorBoundary } from "./components/ErrorBoundary";
import TopPerformersPage from "./pages/week-3/TopPerformersPage";

const queryClient = new QueryClient();

// Portal Layout Wrapper Component
const PortalLayoutWrapper = () => {
  return (
    <ClientRoute>
      <ClientPortalLayout>
        <Outlet />
      </ClientPortalLayout>
    </ClientRoute>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/schedule-consultation" element={<ScheduleConsultationPage />} />
                
                {/* Admin Routes */}
                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/admin/inquiries" element={<AdminRoute><AdminInquiries /></AdminRoute>} />
                
                {/* Client Portal Routes - All wrapped in ClientPortalLayout */}
                <Route path="/portal" element={<PortalLayoutWrapper />}>
                  <Route index element={<ClientPortalDashboard />} />
                  <Route path="assessment" element={<AssessmentPage />} />
                  <Route path="company/:id" element={<CompanyDetail />} />
                  
                  {/* Data Room Routes */}
                  <Route path="week-2/data-room" element={<DataRoomIntroPage />} />
                  <Route path="data-room" element={<DataRoomPage />} />
                  <Route path="data-room/workspace" element={<DataRoomWorkspacePage />} />
                  
                  {/* Week 1 - Foundation & Education */}
                  <Route path="week-1/glossary" element={<GlossaryPage />} />
                  <Route path="week-1/deal-progression" element={<DealProgressionPage />} />
                  <Route path="week-1/professional-advisors" element={<ProfessionalAdvisorsPage />} />
                  <Route path="week-1/know-your-buyer" element={<KnowYourBuyerPage />} />
                  <Route path="week-1/asset-free-education" element={<AssetFreeEducationPage />} />
                  <Route path="week-1/time-kills-deals" element={<TimeKillsDealsPage />} />
                  <Route path="week-1/ebitda-course" element={<EBITDACoursePage />} />
                  
                  {/* Week 2 - Deal Readiness */}
                  <Route path="week-2/asset-workshop" element={<AssetWorkshopPage />} />
                  <Route path="week-2/holdco-structure" element={<HoldCoStructurePage />} />
                  <Route path="week-2/quick-wins" element={<QuickWinsPage />} />
                  <Route path="week-2/debt-interest" element={<DebtInterestPage />} />
                  <Route path="week-2/earnouts-multipliers" element={<EarnoutsMultipliersPage />} />
                  <Route path="week-2/post-closing-reality" element={<PostClosingRealityPage />} />
                  
                  {/* Week 3 - Performance Readiness */}
                  <Route path="week-3/ebitda-calculator" element={<EBITDACalculatorPage />} />
                  <Route path="week-3/multiples" element={<IndustryMultiplesPage />} />
                  <Route path="week-3/scenarios" element={<ScenarioPlanningPage />} />
                  <Route path="week-3/scorecard" element={<ManagementScorecardPage />} />
                  <Route path="week-3/business-scorecard" element={<BusinessScorecardPage />} />
                  <Route path="week-3/top-performers" element={<TopPerformersPage />} />
                  
                  {/* Week 4 - Final Readiness */}
                  <Route path="week-4/kpis-okrs" element={<KPIandOKRPage />} />
                  <Route path="week-4/executive-discovery" element={<ExecutiveDiscoveryInterviewPage />} />
                  <Route path="week-4/value-builder" element={<StrategyDocBuilderPage />} />
                </Route>
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ErrorBoundary>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
