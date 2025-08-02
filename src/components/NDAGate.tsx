import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, Lock, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';

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
  const [showDownload, setShowDownload] = useState(false);
  const { toast } = useToast();

  const fullNDAText = `📄 MUTUAL NON-DISCLOSURE AGREEMENT

Effective Date: Upon acceptance via NDA Gate

Parties:

"Visitor": Any individual accessing this website or engaging with Exitus Advisory Group through the PE Readiness Assessment platform

"Exitus Advisory Group": The confidential advisory services entity operating this website

1. Purpose
This Agreement governs the exchange of confidential business information between the Visitor and Exitus Advisory Group. The purpose is to allow for an honest evaluation of exit readiness, strategy alignment, and deal-related information while maintaining strict confidentiality on both sides.

2. Definition of Confidential Information
"Confidential Information" includes, but is not limited to:

• All submitted data (financials, P&L, org charts, strategic goals, etc.)
• Business conditions, customer lists, staffing structure
• Uploaded or AI-generated assessments, scorecards, or exit roadmaps
• LOIs, term sheets, valuations, and notes related to potential or ongoing transactions
• All correspondence, call notes, and insights shared directly or indirectly through this platform

3. Obligations
Both parties agree to:

• Keep all Confidential Information strictly private
• Use it only for the purpose of the assessment or strategic planning
• Not disclose, replicate, or share any materials with third parties without written consent
• Take commercially reasonable steps to secure all data provided or received

4. Exclusions
This Agreement does not apply to information that:

• Was publicly known at the time of disclosure
• Becomes publicly available through no fault of either party
• Was independently developed without access to the Confidential Information
• Must be disclosed by law or legal process (notice will be provided if allowed)

5. Enforcement & Legal Remedy
This Agreement remains in effect for five (5) years from acceptance. A breach of confidentiality will result in immediate grounds for legal action, including but not limited to:

• Injunctive relief
• Recovery of compensatory damages
• Forensic analysis of misuse

Exitus Advisory Group may log IP addresses, store acceptance timestamps, and retain metadata to prove engagement and agreement.

6. No License or Rights Transferred
This Agreement does not transfer ownership or licensing rights of any intellectual property or proprietary content.

7. Acceptance
By clicking "I Agree" and accessing the site, both parties affirm they have read, understood, and agreed to be legally bound by this Mutual NDA.

Exitus Advisory Group
Confidential. Strategic. Unbiased.`;

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
    
    localStorage.setItem('exitus_nda_accepted', JSON.stringify(ndaData));
    
    toast({
      title: "NDA Accepted",
      description: "Thank you. You can now proceed with the assessment.",
    });
    
    setIsSubmitting(false);
    onClose();
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, agreesToNDA: checked }));
    setShowDownload(checked);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const textWidth = pageWidth - 2 * margin;
    
    // Add title
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('MUTUAL NON-DISCLOSURE AGREEMENT', pageWidth / 2, 30, { align: 'center' });
    
    // Add effective date
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text(`Effective Date: ${new Date().toLocaleDateString()}`, pageWidth / 2, 45, { align: 'center' });
    
    // Add user information
    let yPosition = 60;
    doc.setFont(undefined, 'bold');
    doc.text('Agreement Details:', margin, yPosition);
    yPosition += 10;
    doc.setFont(undefined, 'normal');
    doc.text(`Name: ${formData.firstName} ${formData.lastName}`, margin, yPosition);
    yPosition += 8;
    doc.text(`Email: ${formData.email}`, margin, yPosition);
    yPosition += 8;
    doc.text(`Company: ${formData.company}`, margin, yPosition);
    yPosition += 8;
    doc.text(`Accepted: ${new Date().toLocaleString()}`, margin, yPosition);
    yPosition += 20;
    
    // Add NDA content
    const lines = doc.splitTextToSize(fullNDAText, textWidth);
    
    lines.forEach((line: string) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, margin, yPosition);
      yPosition += 6;
    });
    
    // Save the PDF
    doc.save(`NDA-ExitusAdvisory-${formData.firstName}${formData.lastName}-${new Date().toISOString().split('T')[0]}.pdf`);
    
    toast({
      title: "NDA Downloaded",
      description: "Your signed NDA has been saved successfully.",
    });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[95vh] bg-background-card border-border/50 backdrop-luxury overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <Shield className="h-6 w-6 text-accent" />
            Mutual Non-Disclosure Agreement
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          {/* Full NDA Content */}
          <div className="border border-border/30 rounded-lg">
            <ScrollArea className="h-48 p-4">
              <div className="space-y-4 text-sm text-foreground-secondary leading-relaxed whitespace-pre-line">
                {fullNDAText}
              </div>
            </ScrollArea>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 pb-4">
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
                onCheckedChange={handleCheckboxChange}
                className="mt-1 h-5 w-5 border-2 border-accent data-[state=checked]:bg-accent data-[state=checked]:border-accent"
              />
              <div className="space-y-1">
                <Label htmlFor="nda" className="text-sm leading-relaxed cursor-pointer">
                  I agree to the mutual non-disclosure agreement and understand that all information shared during this assessment will remain strictly confidential.
                </Label>
                <p className="text-xs text-foreground-muted">
                  A downloadable copy will be available once you agree
                </p>
              </div>
            </div>

            {/* Download Button */}
            {showDownload && (
              <Button 
                type="button"
                variant="outline"
                onClick={generatePDF}
                className="w-full border-accent/30 hover:bg-accent/10 flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download NDA (PDF)
              </Button>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full bg-accent hover:bg-accent/90 font-semibold button-shadow transition-luxury"
              disabled={isSubmitting || !formData.agreesToNDA}
            >
              {isSubmitting ? "Processing..." : "Accept & Continue"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};