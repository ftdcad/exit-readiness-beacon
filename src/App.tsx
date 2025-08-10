
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth.tsx";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import AssessmentPage from "./pages/AssessmentPage";
import { ScheduleConsultationPage } from "./pages/ScheduleConsultationPage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminInquiries from "./pages/AdminInquiries";
import ClientPortalDashboard from "./pages/ClientPortalDashboard";
import GlossaryPage from "./pages/GlossaryPage";
import DealProgressionPage from "./pages/DealProgressionPage";
import ProfessionalAdvisorsPage from "./pages/ProfessionalAdvisorsPage";
import KnowYourBuyerPage from "./pages/KnowYourBuyerPage";
import AssetFreeEducationPage from "./pages/AssetFreeEducationPage";
import TimeKillsDealsPage from "./pages/TimeKillsDealsPage";
import EBITDACoursePage from "./pages/EBITDACoursePage";
import { DataRoomIntroPage } from "./pages/DataRoomIntroPage";
import DataRoomPage from "./pages/DataRoomPage";
import { DataRoomWorkspacePage } from "./pages/DataRoomWorkspacePage";
import AssetWorkshopPage from "./pages/AssetWorkshopPage";
import HoldCoStructurePage from "./pages/week-2/HoldCoStructurePage";
import QuickWinsPage from "./pages/QuickWinsPage";
import DebtInterestPage from "./pages/week-2/DebtInterestPage";
import EarnoutsMultipliersPage from "./pages/week-2/EarnoutsMultipliersPage";
import PostClosingRealityPage from "./pages/PostClosingRealityPage";
import EBITDACalculatorPage from "./pages/EBITDACalculatorPage";
import IndustryMultiplesPage from "./pages/IndustryMultiplesPage";
import { ScenarioPlanningPage } from "./pages/ScenarioPlanningPage";
import ExecutiveDiscoveryInterviewPage from "./pages/ExecutiveDiscoveryInterviewPage";
import StrategyDocBuilderPage from "./pages/StrategyDocBuilderPage";
import KPIandOKRPage from "./pages/KPIandOKRPage";
import CompanyDetail from "./pages/CompanyDetail";
import NotFound from "./pages/NotFound";
import AdminRoute from "./components/AdminRoute";
import { ClientRoute } from "./components/ClientRoute";
import { ErrorBoundary } from "./components/ErrorBoundary";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <BrowserRouter>
            <ErrorBoundary>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/assessment" element={<AssessmentPage />} />
                <Route path="/schedule" element={<ScheduleConsultationPage />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                
                {/* Admin routes */}
                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/admin/inquiries" element={<AdminRoute><AdminInquiries /></AdminRoute>} />
                
                {/* Client Portal routes */}
                <Route path="/portal" element={<ClientRoute><ClientPortalDashboard /></ClientRoute>} />
                
                {/* Week 1 routes */}
                <Route path="/portal/week-1/glossary" element={<ClientRoute><GlossaryPage /></ClientRoute>} />
                <Route path="/portal/week-1/deal-progression" element={<ClientRoute><DealProgressionPage /></ClientRoute>} />
                <Route path="/portal/week-1/professional-advisors" element={<ClientRoute><ProfessionalAdvisorsPage /></ClientRoute>} />
                <Route path="/portal/week-1/know-your-buyer" element={<ClientRoute><KnowYourBuyerPage /></ClientRoute>} />
                <Route path="/portal/week-1/asset-free-education" element={<ClientRoute><AssetFreeEducationPage /></ClientRoute>} />
                <Route path="/portal/week-1/time-kills-deals" element={<ClientRoute><TimeKillsDealsPage /></ClientRoute>} />
                <Route path="/portal/week-1/ebitda-course" element={<ClientRoute><EBITDACoursePage /></ClientRoute>} />
                
                {/* Week 2 routes */}
                <Route path="/portal/week-2/data-room" element={<ClientRoute><DataRoomIntroPage /></ClientRoute>} />
                <Route path="/portal/week-2/data-room/workspace" element={<ClientRoute><DataRoomWorkspacePage /></ClientRoute>} />
                <Route path="/portal/week-2/asset-workshop" element={<ClientRoute><AssetWorkshopPage /></ClientRoute>} />
                <Route path="/portal/week-2/holdco-structure" element={<ClientRoute><HoldCoStructurePage /></ClientRoute>} />
                <Route path="/portal/week-2/quick-wins" element={<ClientRoute><QuickWinsPage /></ClientRoute>} />
                <Route path="/portal/week-2/debt-interest" element={<ClientRoute><DebtInterestPage /></ClientRoute>} />
                <Route path="/portal/week-2/earnouts-multipliers" element={<ClientRoute><EarnoutsMultipliersPage /></ClientRoute>} />
                <Route path="/portal/week-2/post-closing-reality" element={<ClientRoute><PostClosingRealityPage /></ClientRoute>} />
                
                {/* Week 3 routes */}
                <Route path="/portal/week-3/ebitda-calculator" element={<ClientRoute><EBITDACalculatorPage /></ClientRoute>} />
                <Route path="/portal/week-3/multiples" element={<ClientRoute><IndustryMultiplesPage /></ClientRoute>} />
                <Route path="/portal/week-3/scenarios" element={<ClientRoute><ScenarioPlanningPage /></ClientRoute>} />
                
                {/* Week 4 routes */}
                <Route path="/portal/week-4/executive-discovery" element={<ClientRoute><ExecutiveDiscoveryInterviewPage /></ClientRoute>} />
                <Route path="/portal/week-4/value-builder" element={<ClientRoute><StrategyDocBuilderPage /></ClientRoute>} />
                <Route path="/portal/week-4/kpis-okrs" element={<ClientRoute><KPIandOKRPage /></ClientRoute>} />
                
                {/* Company detail route */}
                <Route path="/company/:id" element={<CompanyDetail />} />
                
                {/* 404 fallback */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ErrorBoundary>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
