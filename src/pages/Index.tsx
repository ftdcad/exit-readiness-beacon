import HeroSection from "@/components/HeroSection";
import PreAssessmentForm from "@/components/PreAssessmentForm";
import OfferDetails from "@/components/OfferDetails";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Admin Access Link */}
      <div className="fixed top-4 right-4 z-50">
        <Link
          to="/admin/login"
          className="inline-flex items-center gap-2 px-3 py-2 text-xs bg-background-card/80 backdrop-blur-sm border border-border rounded-lg text-foreground-secondary hover:text-foreground hover:bg-background-hover transition-luxury"
        >
          <Shield className="w-3 h-3" />
          Admin
        </Link>
      </div>
      
      <HeroSection />
      <PreAssessmentForm />
      <OfferDetails />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Index;
