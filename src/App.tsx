import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ClientPortalDashboard from './pages/ClientPortalDashboard';
import DueDiligenceChecklistPage from './pages/DueDiligenceChecklistPage';
import LOIReviewPage from './pages/LOIReviewPage';
import FinalReportPage from './pages/FinalReportPage';
import StrategyDocBuilderPage from './pages/StrategyDocBuilderPage';
import KPIandOKRPage from './pages/KPIandOKRPage';
import InteractiveGlossaryPage from './pages/InteractiveGlossaryPage';
import DealProgressionPage from './pages/DealProgressionPage';
import ProfessionalAdvisorsPage from './pages/ProfessionalAdvisorsPage';
import KnowYourBuyerPage from './pages/KnowYourBuyerPage';
import AssetFreeEducationPage from './pages/AssetFreeEducationPage';
import TimeKillsDealsPage from './pages/TimeKillsDealsPage';
import EBITDAExplainedPage from './pages/EBITDAExplainedPage';
import DataRoomPage from './pages/DataRoomPage';
import AssetWorkshopPage from './pages/AssetWorkshopPage';
import HoldCoStructurePage from './pages/HoldCoStructurePage';
import QuickWinsPage from './pages/QuickWinsPage';
import DebtInterestPage from './pages/DebtInterestPage';
import EarnoutsMultipliersPage from './pages/EarnoutsMultipliersPage';
import PostClosingRealityPage from './pages/PostClosingRealityPage';
import EbitdaCalculatorPage from './pages/EbitdaCalculatorPage';
import MultiplesPage from './pages/MultiplesPage';
import ScenariosPage from './pages/ScenariosPage';
import ScorecardPage from './pages/ScorecardPage';
import TopPerformersPage from './pages/TopPerformersPage';
import BusinessScorecardPage from './pages/BusinessScorecardPage';
import DealKillersPage from './pages/DealKillersPage';
import { AuthProvider } from './hooks/useAuth';
import { ProgressProvider } from './hooks/useProgress';
import { ClientPortalLayout } from './components/ClientPortalLayout';
import ScheduleConsultation from './pages/ScheduleConsultation';
import DiscoveryInterviewPage from './pages/DiscoveryInterviewPage';

function App() {
  return (
    <AuthProvider>
      <ProgressProvider>
        <Router>
          <Routes>
            <Route path="/" element={<ClientPortalLayout><ClientPortalDashboard /></ClientPortalLayout>} />
            <Route path="/portal" element={<ClientPortalLayout><ClientPortalDashboard /></ClientPortalLayout>} />
            <Route path="/portal/schedule-consultation" element={<ClientPortalLayout><ScheduleConsultation /></ClientPortalLayout>} />

            {/* Week 1 Routes */}
            <Route path="/portal/week-1/glossary" element={<ClientPortalLayout><InteractiveGlossaryPage /></ClientPortalLayout>} />
            <Route path="/portal/week-1/deal-progression" element={<ClientPortalLayout><DealProgressionPage /></ClientPortalLayout>} />
            <Route path="/portal/week-1/professional-advisors" element={<ClientPortalLayout><ProfessionalAdvisorsPage /></ClientPortalLayout>} />
            <Route path="/portal/week-1/know-your-buyer" element={<ClientPortalLayout><KnowYourBuyerPage /></ClientPortalLayout>} />
            <Route path="/portal/week-1/asset-free-education" element={<ClientPortalLayout><AssetFreeEducationPage /></ClientPortalLayout>} />
            <Route path="/portal/week-1/time-kills-deals" element={<ClientPortalLayout><TimeKillsDealsPage /></ClientPortalLayout>} />
            <Route path="/portal/week-1/ebitda-course" element={<ClientPortalLayout><EBITDAExplainedPage /></ClientPortalLayout>} />

            {/* Week 2 Routes */}
            <Route path="/portal/week-2/data-room" element={<ClientPortalLayout><DataRoomPage /></ClientPortalLayout>} />
            <Route path="/portal/week-2/asset-workshop" element={<ClientPortalLayout><AssetWorkshopPage /></ClientPortalLayout>} />
            <Route path="/portal/week-2/holdco-structure" element={<ClientPortalLayout><HoldCoStructurePage /></ClientPortalLayout>} />
            <Route path="/portal/week-2/quick-wins" element={<ClientPortalLayout><QuickWinsPage /></ClientPortalLayout>} />
            <Route path="/portal/week-2/debt-interest" element={<ClientPortalLayout><DebtInterestPage /></ClientPortalLayout>} />
            <Route path="/portal/week-2/earnouts-multipliers" element={<ClientPortalLayout><EarnoutsMultipliersPage /></ClientPortalLayout>} />
            <Route path="/portal/week-2/post-closing-reality" element={<ClientPortalLayout><PostClosingRealityPage /></ClientPortalLayout>} />

            {/* Week 3 Routes */}
            <Route path="/portal/week-3/ebitda-calculator" element={<ClientPortalLayout><EbitdaCalculatorPage /></ClientPortalLayout>} />
            <Route path="/portal/week-3/multiples" element={<ClientPortalLayout><MultiplesPage /></ClientPortalLayout>} />
            <Route path="/portal/week-3/scenarios" element={<ClientPortalLayout><ScenariosPage /></ClientPortalLayout>} />
            <Route path="/portal/week-3/scorecard" element={<ClientPortalLayout><ScorecardPage /></ClientPortalLayout>} />
            <Route path="/portal/week-3/top-performers" element={<ClientPortalLayout><TopPerformersPage /></ClientPortalLayout>} />
            <Route path="/portal/week-3/business-scorecard" element={<ClientPortalLayout><BusinessScorecardPage /></ClientPortalLayout>} />
            <Route path="/portal/week-3/deal-killers" element={<ClientPortalLayout><DealKillersPage /></ClientPortalLayout>} />

            {/* Week 4 Routes */}
            <Route path="/portal/week-4/dd-checklist" element={<ClientPortalLayout><DueDiligenceChecklistPage /></ClientPortalLayout>} />
            <Route path="/portal/week-4/loi-review" element={<ClientPortalLayout><LOIReviewPage /></ClientPortalLayout>} />
            <Route path="/portal/week-4/final-report" element={<ClientPortalLayout><FinalReportPage /></ClientPortalLayout>} />
            <Route path="/portal/week-4/discovery-interview" element={<ClientPortalLayout><DiscoveryInterviewPage /></ClientPortalLayout>} />
            <Route path="/portal/week-4/value-builder" element={<ClientPortalLayout><StrategyDocBuilderPage /></ClientPortalLayout>} />
            <Route path="/portal/week-4/kpis-okrs" element={<ClientPortalLayout><KPIandOKRPage /></ClientPortalLayout>} />
          </Routes>
        </Router>
      </ProgressProvider>
    </AuthProvider>
  );
}

export default App;
