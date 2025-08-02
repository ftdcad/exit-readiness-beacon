import HeroSection from "@/components/HeroSection";
import PreAssessmentForm from "@/components/PreAssessmentForm";
import OfferDetails from "@/components/OfferDetails";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <PreAssessmentForm />
      <OfferDetails />
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Index;
