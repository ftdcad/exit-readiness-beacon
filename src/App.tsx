import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import { ErrorBoundary } from "./components/ErrorBoundary";

const queryClient = new QueryClient();

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
                
                {/* Client Portal Routes */}
                <Route path="/portal" element={<ClientRoute><ClientPortalDashboard /></ClientRoute>} />
                <Route path="/portal/assessment" element={<ClientRoute><AssessmentPage /></ClientRoute>} />
                <Route path="/portal/company/:id" element={<ClientRoute><CompanyDetail /></ClientRoute>} />
                
                {/* Data Room Routes */}
                <Route path="/portal/week-2/data-room" element={<ClientRoute><DataRoomIntroPage /></ClientRoute>} />
                <Route path="/portal/data-room" element={<ClientRoute><DataRoomPage /></ClientRoute>} />
                <Route path="/portal/data-room/workspace" element={<ClientRoute><DataRoomWorkspacePage /></ClientRoute>} />
                
                {/* Week 1 - Foundation & Education */}
                <Route path="/portal/week-1/glossary" element={<ClientRoute><GlossaryPage /></ClientRoute>} />
                <Route path="/portal/week-1/deal-progression" element={<ClientRoute><DealProgressionPage /></ClientRoute>} />
                <Route path="/portal/week-1/professional-advisors" element={<ClientRoute><ProfessionalAdvisorsPage /></ClientRoute>} />
                <Route path="/portal/week-1/know-your-buyer" element={<ClientRoute><KnowYourBuyerPage /></ClientRoute>} />
                <Route path="/portal/week-1/asset-free-education" element={<ClientRoute><AssetFreeEducationPage /></ClientRoute>} />
                <Route path="/portal/week-1/time-kills-deals" element={<ClientRoute><TimeKillsDealsPage /></ClientRoute>} />
                <Route path="/portal/week-1/ebitda-course" element={<ClientRoute><EBITDACoursePage /></ClientRoute>} />
                
                {/* Week 2 - Deal Readiness */}
                <Route path="/portal/week-2/asset-workshop" element={<ClientRoute><AssetWorkshopPage /></ClientRoute>} />
                <Route path="/portal/week-2/holdco-structure" element={<ClientRoute><HoldCoStructurePage /></ClientRoute>} />
                <Route path="/portal/week-2/quick-wins" element={<ClientRoute><QuickWinsPage /></ClientRoute>} />
                <Route path="/portal/week-2/debt-interest" element={<ClientRoute><DebtInterestPage /></ClientRoute>} />
                <Route path="/portal/week-2/earnouts-multipliers" element={<ClientRoute><EarnoutsMultipliersPage /></ClientRoute>} />
                <Route path="/portal/week-2/post-closing-reality" element={<ClientRoute><PostClosingRealityPage /></ClientRoute>} />
                
                {/* Week 3 - Performance Readiness */}
                <Route path="/portal/week-3/ebitda-calculator" element={<ClientRoute><EBITDACalculatorPage /></ClientRoute>} />
                <Route path="/portal/week-3/multiples" element={<ClientRoute><IndustryMultiplesPage /></ClientRoute>} />
                <Route path="/portal/week-3/scenarios" element={<ClientRoute><ScenarioPlanningPage /></ClientRoute>} />
                <Route path="/portal/week-3/scorecard" element={<ClientRoute><ManagementScorecardPage /></ClientRoute>} />
                <Route path="/portal/week-3/business-scorecard" element={<ClientRoute><BusinessScorecardPage /></ClientRoute>} />
                
                {/* Week 4 - Final Readiness */}
                <Route path="/portal/week-4/kpis-okrs" element={<ClientRoute><KPIandOKRPage /></ClientRoute>} />
                <Route path="/portal/week-4/executive-discovery" element={<ClientRoute><ExecutiveDiscoveryInterviewPage /></ClientRoute>} />
                <Route path="/portal/week-4/value-builder" element={<ClientRoute><StrategyDocBuilderPage /></ClientRoute>} />
                
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
