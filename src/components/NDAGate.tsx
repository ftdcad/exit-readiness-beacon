import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Shield, Lock, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NDAGateProps {
  onClose: () => void;
}

export const NDAGate = ({ onClose }: NDAGateProps) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    agreesToNDA: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreesToNDA) {
      toast({
        title: "NDA Agreement Required",
        description: "Please agree to the NDA terms to proceed.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call - in real implementation, store in Supabase
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Store NDA acceptance timestamp + IP (would be done server-side)
    const ndaData = {
      ...formData,
      timestamp: new Date().toISOString(),
      ipAddress: "Client IP", // Would be captured server-side
    };
    
    localStorage.setItem('meridian_nda_accepted', JSON.stringify(ndaData));
    
    toast({
      title: "NDA Accepted",
      description: "Thank you. You can now proceed with the assessment.",
    });
    
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-background-card border-border/50 backdrop-luxury">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <Shield className="h-6 w-6 text-accent" />
            Confidentiality Agreement
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* NDA Notice */}
          <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
            <div className="flex items-start gap-3">
              <Lock className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
              <div className="text-sm text-foreground-secondary">
                <p className="font-medium text-foreground mb-2">Mutual Non-Disclosure Agreement</p>
                <p>
                  This assessment involves sharing sensitive business information. By proceeding, you agree to maintain strict confidentiality of all shared data and methodologies.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  className="bg-background-hover border-border/50"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  className="bg-background-hover border-border/50"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Business Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="bg-background-hover border-border/50"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company Name</Label>
              <Input
                id="company"
                type="text"
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                className="bg-background-hover border-border/50"
                required
              />
            </div>

            {/* NDA Checkbox */}
            <div className="flex items-start space-x-3 pt-4">
              <Checkbox 
                id="nda"
                checked={formData.agreesToNDA}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, agreesToNDA: checked as boolean }))}
                className="mt-1"
              />
              <div className="space-y-1">
                <Label htmlFor="nda" className="text-sm leading-relaxed cursor-pointer">
                  I agree to the mutual non-disclosure agreement and understand that all information shared during this assessment will remain strictly confidential.
                </Label>
                <p className="text-xs text-foreground-muted">
                  Full NDA terms available upon request
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full bg-accent hover:bg-accent/90 font-semibold button-shadow transition-luxury"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Accept & Continue"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};