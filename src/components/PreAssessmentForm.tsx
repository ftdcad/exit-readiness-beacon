import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, Users, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PreAssessmentForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Company Basics
    companyName: "",
    industry: "",
    founded: "",
    employees: "",
    
    // Financial
    revenue2025: "",
    revenue2024: "",
    revenue2023: "",
    revenue2022: "",
    
    // Exit Goals
    exitTimeline: "",
    exitType: "",
    currentChallenges: "",
    
    // Contact
    phone: "",
    preferredContact: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API submission to Airtable/Notion
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Store data locally for demo
    localStorage.setItem('meridian_preassessment', JSON.stringify({
      ...formData,
      submittedAt: new Date().toISOString(),
      status: 'pending_review'
    }));

    toast({
      title: "Assessment Submitted",
      description: "Thank you! We'll review your information and contact you within 24 hours.",
    });

    setIsSubmitting(false);
    // Would redirect to thank you page or show success state
  };

  const industries = [
    "Software/SaaS", "E-commerce", "Healthcare/Medical", "Financial Services",
    "Manufacturing", "Professional Services", "Real Estate", "Technology Hardware",
    "Consumer Products", "Education", "Other"
  ];

  const revenueRanges = [
    "Under $1M", "$1M - $5M", "$5M - $10M", "$10M - $25M", "$25M - $50M", 
    "$50M - $100M", "$100M+"
  ];

  const employeeRanges = [
    "1-10", "11-25", "26-50", "51-100", "101-250", "250+"
  ];

  return (
    <section className="py-16 bg-background-card">
      <div className="container px-4 md:px-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-4 mb-8">
            <h2 className="text-3xl md:text-4xl font-bold">
              PE Readiness <span className="text-accent">Pre-Assessment</span>
            </h2>
            <p className="text-foreground-secondary text-lg">
              Help us understand your business so we can provide a customized assessment approach.
            </p>
            
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-foreground-muted">
                <span>Step {step} of {totalSteps}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>

          <Card className="glass-card border-border/50">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit}>
                {/* Step 1: Company Basics */}
                {step === 1 && (
                  <div className="space-y-6">
                    <CardHeader className="px-0 pt-0">
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Users className="h-5 w-5 text-accent" />
                        Company Information
                      </CardTitle>
                    </CardHeader>

                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input
                          id="companyName"
                          value={formData.companyName}
                          onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                          className="bg-background-hover border-border/50"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="industry">Industry</Label>
                          <Select
                            value={formData.industry}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}
                          >
                            <SelectTrigger className="bg-background-hover border-border/50">
                              <SelectValue placeholder="Select industry" />
                            </SelectTrigger>
                            <SelectContent>
                              {industries.map((industry) => (
                                <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="founded">Year Founded</Label>
                          <Input
                            id="founded"
                            type="number"
                            min="1900"
                            max="2025"
                            value={formData.founded}
                            onChange={(e) => setFormData(prev => ({ ...prev, founded: e.target.value }))}
                            className="bg-background-hover border-border/50"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="employees">Number of Employees</Label>
                        <Select
                          value={formData.employees}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, employees: value }))}
                        >
                          <SelectTrigger className="bg-background-hover border-border/50">
                            <SelectValue placeholder="Select employee count" />
                          </SelectTrigger>
                          <SelectContent>
                            {employeeRanges.map((range) => (
                              <SelectItem key={range} value={range}>{range}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Business Performance */}
                {step === 2 && (
                  <div className="space-y-6">
                    <CardHeader className="px-0 pt-0">
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <DollarSign className="h-5 w-5 text-accent" />
                        Business Performance
                      </CardTitle>
                      <p className="text-sm text-foreground-secondary">
                        Rough estimates are fine. This helps us understand your business trajectory.
                      </p>
                    </CardHeader>

                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="revenue2025" className="flex items-center gap-2">
                          2025 Gross Revenue (what are you on track for this year?)
                          <span className="text-xs text-foreground-muted cursor-help" title="Total income before any deductions or expenses">ⓘ</span>
                        </Label>
                        <Select
                          value={formData.revenue2025}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, revenue2025: value }))}
                        >
                          <SelectTrigger className="bg-background-hover border-border/50">
                            <SelectValue placeholder="Select revenue range" />
                          </SelectTrigger>
                          <SelectContent>
                            {revenueRanges.map((range) => (
                              <SelectItem key={range} value={range}>{range}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="revenue2024" className="flex items-center gap-2">
                          2024 Gross Revenue
                          <span className="text-xs text-foreground-muted cursor-help" title="Total income before any deductions or expenses">ⓘ</span>
                        </Label>
                        <Select
                          value={formData.revenue2024}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, revenue2024: value }))}
                        >
                          <SelectTrigger className="bg-background-hover border-border/50">
                            <SelectValue placeholder="Select revenue range" />
                          </SelectTrigger>
                          <SelectContent>
                            {revenueRanges.map((range) => (
                              <SelectItem key={range} value={range}>{range}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="revenue2023" className="flex items-center gap-2">
                          2023 Gross Revenue
                          <span className="text-xs text-foreground-muted cursor-help" title="Total income before any deductions or expenses">ⓘ</span>
                        </Label>
                        <Select
                          value={formData.revenue2023}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, revenue2023: value }))}
                        >
                          <SelectTrigger className="bg-background-hover border-border/50">
                            <SelectValue placeholder="Select revenue range" />
                          </SelectTrigger>
                          <SelectContent>
                            {revenueRanges.map((range) => (
                              <SelectItem key={range} value={range}>{range}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="revenue2022" className="flex items-center gap-2 text-foreground-secondary">
                          2022 Gross Revenue (leave blank if not applicable)
                          <span className="text-xs text-foreground-muted cursor-help" title="Total income before any deductions or expenses">ⓘ</span>
                        </Label>
                        <Select
                          value={formData.revenue2022}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, revenue2022: value }))}
                        >
                          <SelectTrigger className="bg-background-hover border-border/50">
                            <SelectValue placeholder="Leave blank if company was not operating" />
                          </SelectTrigger>
                          <SelectContent>
                            {revenueRanges.map((range) => (
                              <SelectItem key={range} value={range}>{range}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Exit Goals & Contact */}
                {step === 3 && (
                  <div className="space-y-6">
                    <CardHeader className="px-0 pt-0">
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Clock className="h-5 w-5 text-accent" />
                        Exit Strategy & Contact
                      </CardTitle>
                    </CardHeader>

                    <div className="grid gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="exitTimeline">Target Exit Timeline</Label>
                          <Select
                            value={formData.exitTimeline}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, exitTimeline: value }))}
                          >
                            <SelectTrigger className="bg-background-hover border-border/50">
                              <SelectValue placeholder="Select timeline" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="6-12 months">6-12 months</SelectItem>
                              <SelectItem value="1-2 years">1-2 years</SelectItem>
                              <SelectItem value="2-3 years">2-3 years</SelectItem>
                              <SelectItem value="3+ years">3+ years</SelectItem>
                              <SelectItem value="exploring">Just exploring</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="exitType">Preferred Exit Type</Label>
                          <Select
                            value={formData.exitType}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, exitType: value }))}
                          >
                            <SelectTrigger className="bg-background-hover border-border/50">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="private-equity">Private Equity</SelectItem>
                              <SelectItem value="strategic">Strategic Acquisition</SelectItem>
                              <SelectItem value="ipo">IPO</SelectItem>
                              <SelectItem value="unsure">Not Sure Yet</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="currentChallenges">Current Business Challenges</Label>
                        <Textarea
                          id="currentChallenges"
                          placeholder="What are your main operational or strategic challenges?"
                          value={formData.currentChallenges}
                          onChange={(e) => setFormData(prev => ({ ...prev, currentChallenges: e.target.value }))}
                          className="bg-background-hover border-border/50 min-h-[100px]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          className="bg-background-hover border-border/50"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-8">
                  {step > 1 && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handlePrev}
                      className="border-border/50 hover:bg-background-hover"
                    >
                      Previous
                    </Button>
                  )}
                  
                  <div className="ml-auto">
                    {step < totalSteps ? (
                      <Button 
                        type="button" 
                        onClick={handleNext}
                        className="bg-accent hover:bg-accent/90 font-semibold button-shadow"
                      >
                        Next Step
                      </Button>
                    ) : (
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="bg-success hover:bg-success/90 font-semibold button-shadow"
                      >
                        {isSubmitting ? "Submitting..." : "Submit Assessment"}
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Trust Signals */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-foreground-secondary">
              <CheckCircle className="h-4 w-4 text-success" />
              <span>Confidential & secure • No spam • 24hr response guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PreAssessmentForm;