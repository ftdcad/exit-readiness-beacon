import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, Users, DollarSign, Scale, Plus, X, FileText, Upload, File, Calculator } from "lucide-react";
import { useContactSubmission } from "@/hooks/useContactSubmission";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const PreAssessmentForm = () => {
  console.log("PreAssessmentForm loaded - NDA system removed");
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
    
    // Investment Type
    investmentType: "",
    
    // Business Structure & Ownership
    entityType: "",
    ownershipType: "",
    owners: [] as Array<{ name: string; percentage: string }>,
    
    // Document Availability
    pnlAvailability: "",
    taxReturnsAvailability: "",
    balanceSheetsAvailability: "",
    
    // Document Uploads
    pnlFiles: [] as File[],
    taxReturnFiles: [] as File[],
    balanceSheetFiles: [] as File[],
    
    // Exit Goals
    exitTimeline: "",
    exitType: "",
    currentChallenges: "",
    
    // Contact
    email: "",
    phone: "",
    companyWebsite: "",
    preferredContact: "",
    
    // Add-backs for EBITDA normalization
    addBacks: {
      personalVehicles: { selected: false, notes: "" },
      familySalaries: { selected: false, notes: "" },
      ownerInsurance: { selected: false, notes: "" },
      travelEntertainment: { selected: false, notes: "" },
      personalProperty: { selected: false, notes: "" },
      professionalServices: { selected: false, notes: "" },
      discretionarySpending: { selected: false, notes: "" },
      other: { selected: false, notes: "" }
    },

    // Enhanced fields
    jobTitle: "",
    companySize: "",
    howDidYouHear: "",
  });
  
  const { submitContact, isSubmitting } = useContactSubmission();
  const { toast } = useToast();
  const navigate = useNavigate();

  const totalSteps = 8;
  const progress = (step / totalSteps) * 100;

  // Validation function for each step
  const validateStep = (stepNumber: number): boolean => {
    switch(stepNumber) {
      case 1:
        return !!(formData.companyName && formData.industry && formData.founded && formData.employees && formData.email);
      case 2:
        return !!(formData.revenue2025 && formData.revenue2024 && formData.revenue2023 && formData.revenue2022);
      case 3:
        return !!formData.investmentType;
      case 4:
        return !!(formData.entityType && formData.ownershipType);
      case 5:
        return !!(formData.pnlAvailability && formData.taxReturnsAvailability && formData.balanceSheetsAvailability);
      case 6:
        return true; // File uploads are optional
      case 7:
        return !!(formData.exitTimeline && formData.exitType && formData.currentChallenges);
      case 8:
        return !!(formData.phone && formData.preferredContact);
      default:
        return false;
    }
  };

  const validateAllSteps = (): boolean => {
    for (let i = 1; i <= totalSteps; i++) {
      if (!validateStep(i)) {
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep(step)) {
      toast({
        title: "Please complete all required fields",
        description: "Fill in all required information before proceeding to the next step.",
        variant: "destructive",
      });
      return;
    }
    
    if (step < totalSteps) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent submission if not on final step
    if (step !== totalSteps) {
      console.log('Form submission prevented - not on final step. Current step:', step, 'Total steps:', totalSteps);
      return;
    }

    // Validate all steps before submission
    if (!validateAllSteps()) {
      toast({
        title: "Please complete all required fields",
        description: "Some required information is missing. Please review and complete all steps.",
        variant: "destructive",
      });
      return;
    }
    
    console.log('=== FORM SUBMISSION DEBUG ===');
    console.log('Form data:', JSON.stringify(formData, null, 2));
    console.log('Attempting submission...');

    try {
      const result = await submitContact(formData, null);
      
      if (result.success) {
        // Save completion status to localStorage
        localStorage.setItem('meridian_assessment_submitted', JSON.stringify({
          id: result.data?.id,
          submittedAt: new Date().toISOString(),
          companyName: formData.companyName
        }));

        toast({
          title: "Assessment Submitted Successfully!",
          description: "Thank you! We'll review your information and contact you within 24 hours.",
        });

        // Redirect to portal after successful submission
        setTimeout(() => {
          navigate('/portal');
        }, 2000);
      }
    } catch (error: any) {
      console.error('=== SUBMISSION ERROR ===');
      console.error('Full error object:', error);
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      console.error('=== END ERROR ===');
      
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your assessment. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Owner management functions
  const addOwner = () => {
    setFormData(prev => ({
      ...prev,
      owners: [...prev.owners, { name: "", percentage: "" }]
    }));
  };

  const removeOwner = (index: number) => {
    setFormData(prev => ({
      ...prev,
      owners: prev.owners.filter((_, i) => i !== index)
    }));
  };

  const updateOwner = (index: number, field: 'name' | 'percentage', value: string) => {
    setFormData(prev => ({
      ...prev,
      owners: prev.owners.map((owner, i) => 
        i === index ? { ...owner, [field]: value } : owner
      )
    }));
  };

  const getTotalPercentage = () => {
    return formData.owners.reduce((total, owner) => {
      const percentage = parseFloat(owner.percentage) || 0;
      return total + percentage;
    }, 0);
  };

  // File upload handlers
  const handleFileUpload = (files: FileList | null, documentType: 'pnl' | 'taxReturn' | 'balanceSheet') => {
    if (!files) return;
    
    const fileArray = Array.from(files);
    const fieldMap = {
      pnl: 'pnlFiles',
      taxReturn: 'taxReturnFiles', 
      balanceSheet: 'balanceSheetFiles'
    } as const;
    
    setFormData(prev => ({
      ...prev,
      [fieldMap[documentType]]: [...prev[fieldMap[documentType]], ...fileArray]
    }));
  };

  const removeFile = (index: number, documentType: 'pnl' | 'taxReturn' | 'balanceSheet') => {
    const fieldMap = {
      pnl: 'pnlFiles',
      taxReturn: 'taxReturnFiles',
      balanceSheet: 'balanceSheetFiles'
    } as const;
    
    setFormData(prev => ({
      ...prev,
      [fieldMap[documentType]]: prev[fieldMap[documentType]].filter((_, i) => i !== index)
    }));
  };

  // Add-back management functions
  const toggleAddBack = (category: keyof typeof formData.addBacks) => {
    setFormData(prev => ({
      ...prev,
      addBacks: {
        ...prev.addBacks,
        [category]: {
          ...prev.addBacks[category],
          selected: !prev.addBacks[category].selected
        }
      }
    }));
  };

  const updateAddBackNotes = (category: keyof typeof formData.addBacks, notes: string) => {
    setFormData(prev => ({
      ...prev,
      addBacks: {
        ...prev.addBacks,
        [category]: {
          ...prev.addBacks[category],
          notes
        }
      }
    }));
  };

  const industries = [
    "HVAC/Mechanical Services",
    "Electrical Services", 
    "Plumbing Services",
    "Construction/General Contracting",
    "Professional Services (Accounting, Legal, Consulting)",
    "Healthcare Services (Dental, Veterinary, Urgent Care)",
    "Home Services (Pest Control, Landscaping, Cleaning)",
    "Software/SaaS",
    "Manufacturing",
    "Financial Services",
    "Behavioral Health/Mental Health",
    "Staffing & Recruiting",
    "E-commerce",
    "Real Estate Services",
    "Food & Beverage",
    "Transportation/Logistics",
    "Other"
  ];

  const revenueRanges = [
    "Under $1M", "$1M+", "$2M+", "$3M+", "$4M+", "$5M-$7M", 
    "$7M-$10M", "$10M-$15M", "$15M-$25M", "$25M+"
  ];

  const employeeRanges = [
    "1-10", "11-25", "26-50", "51-100", "101-250", "250+"
  ];

  return (
    <section id="assessment-form" className="py-16 bg-background-card">
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
                        Company Basics
                      </CardTitle>
                      <p className="text-sm text-foreground-secondary">
                        Let's start with some basic information about your company.
                      </p>
                    </CardHeader>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="companyName">Company Name *</Label>
                        <Input
                          id="companyName"
                          value={formData.companyName}
                          onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                          className="bg-background-hover border-border/50"
                          placeholder="Enter your company name"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="industry">Industry *</Label>
                        <Select 
                          value={formData.industry} 
                          onValueChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}
                          required
                        >
                          <SelectTrigger className="bg-background-hover border-border/50">
                            <SelectValue placeholder="Select your industry" />
                          </SelectTrigger>
                          <SelectContent>
                            {industries.map((industry) => (
                              <SelectItem key={industry} value={industry}>
                                {industry}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="founded">Year Founded *</Label>
                        <Input
                          id="founded"
                          type="number"
                          min="1900"
                          max={new Date().getFullYear()}
                          value={formData.founded}
                          onChange={(e) => setFormData(prev => ({ ...prev, founded: e.target.value }))}
                          className="bg-background-hover border-border/50"
                          placeholder="e.g., 2010"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="employees">Number of Employees *</Label>
                        <Select 
                          value={formData.employees} 
                          onValueChange={(value) => setFormData(prev => ({ ...prev, employees: value }))}
                          required
                        >
                          <SelectTrigger className="bg-background-hover border-border/50">
                            <SelectValue placeholder="Select employee count" />
                          </SelectTrigger>
                          <SelectContent>
                            {employeeRanges.map((range) => (
                              <SelectItem key={range} value={range}>
                                {range}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Business Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="bg-background-hover border-border/50"
                        placeholder="your@company.com"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Financial Performance */}
                {step === 2 && (
                  <div className="space-y-6">
                    <CardHeader className="px-0 pt-0">
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <DollarSign className="h-5 w-5 text-accent" />
                        Financial Performance
                      </CardTitle>
                      <p className="text-sm text-foreground-secondary">
                        Provide your revenue information for the past few years.
                      </p>
                    </CardHeader>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="revenue2025">2025 Revenue (Projected) *</Label>
                        <Select 
                          value={formData.revenue2025} 
                          onValueChange={(value) => setFormData(prev => ({ ...prev, revenue2025: value }))}
                          required
                        >
                          <SelectTrigger className="bg-background-hover border-border/50">
                            <SelectValue placeholder="Select revenue range" />
                          </SelectTrigger>
                          <SelectContent>
                            {revenueRanges.map((range) => (
                              <SelectItem key={range} value={range}>
                                {range}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="revenue2024">2024 Revenue *</Label>
                        <Select 
                          value={formData.revenue2024} 
                          onValueChange={(value) => setFormData(prev => ({ ...prev, revenue2024: value }))}
                          required
                        >
                          <SelectTrigger className="bg-background-hover border-border/50">
                            <SelectValue placeholder="Select revenue range" />
                          </SelectTrigger>
                          <SelectContent>
                            {revenueRanges.map((range) => (
                              <SelectItem key={range} value={range}>
                                {range}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="revenue2023">2023 Revenue *</Label>
                        <Select 
                          value={formData.revenue2023} 
                          onValueChange={(value) => setFormData(prev => ({ ...prev, revenue2023: value }))}
                          required
                        >
                          <SelectTrigger className="bg-background-hover border-border/50">
                            <SelectValue placeholder="Select revenue range" />
                          </SelectTrigger>
                          <SelectContent>
                            {revenueRanges.map((range) => (
                              <SelectItem key={range} value={range}>
                                {range}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="revenue2022">2022 Revenue *</Label>
                        <Select 
                          value={formData.revenue2022} 
                          onValueChange={(value) => setFormData(prev => ({ ...prev, revenue2022: value }))}
                          required
                        >
                          <SelectTrigger className="bg-background-hover border-border/50">
                            <SelectValue placeholder="Select revenue range" />
                          </SelectTrigger>
                          <SelectContent>
                            {revenueRanges.map((range) => (
                              <SelectItem key={range} value={range}>
                                {range}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Investment Type */}
                {step === 3 && (
                  <div className="space-y-6">
                    <CardHeader className="px-0 pt-0">
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Scale className="h-5 w-5 text-accent" />
                        Investment Interest
                      </CardTitle>
                      <p className="text-sm text-foreground-secondary">
                        What type of investment or transaction are you considering?
                      </p>
                    </CardHeader>

                    <RadioGroup 
                      value={formData.investmentType} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, investmentType: value }))}
                      className="space-y-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="complete-sale" id="complete-sale" />
                        <Label htmlFor="complete-sale" className="flex-1 cursor-pointer">
                          <div className="font-medium">Complete Sale/Exit</div>
                          <div className="text-sm text-foreground-secondary">Sell 100% of the business</div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="majority-sale" id="majority-sale" />
                        <Label htmlFor="majority-sale" className="flex-1 cursor-pointer">
                          <div className="font-medium">Majority Sale</div>
                          <div className="text-sm text-foreground-secondary">Sell controlling interest (51%+)</div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="minority-investment" id="minority-investment" />
                        <Label htmlFor="minority-investment" className="flex-1 cursor-pointer">
                          <div className="font-medium">Minority Investment</div>
                          <div className="text-sm text-foreground-secondary">Growth capital while retaining control</div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="exploring-options" id="exploring-options" />
                        <Label htmlFor="exploring-options" className="flex-1 cursor-pointer">
                          <div className="font-medium">Exploring Options</div>
                          <div className="text-sm text-foreground-secondary">Want to understand what's possible</div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}

                {/* Step 4: Business Structure & Ownership */}
                {step === 4 && (
                  <div className="space-y-6">
                    <CardHeader className="px-0 pt-0">
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Users className="h-5 w-5 text-accent" />
                        Business Structure & Ownership
                      </CardTitle>
                      <p className="text-sm text-foreground-secondary">
                        Help us understand your business structure and ownership.
                      </p>
                    </CardHeader>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="entityType">Entity Type *</Label>
                        <Select 
                          value={formData.entityType} 
                          onValueChange={(value) => setFormData(prev => ({ ...prev, entityType: value }))}
                          required
                        >
                          <SelectTrigger className="bg-background-hover border-border/50">
                            <SelectValue placeholder="Select entity type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="llc">LLC</SelectItem>
                            <SelectItem value="s-corp">S-Corporation</SelectItem>
                            <SelectItem value="c-corp">C-Corporation</SelectItem>
                            <SelectItem value="partnership">Partnership</SelectItem>
                            <SelectItem value="sole-proprietorship">Sole Proprietorship</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Ownership Structure *</Label>
                        <RadioGroup 
                          value={formData.ownershipType} 
                          onValueChange={(value) => setFormData(prev => ({ ...prev, ownershipType: value }))}
                          className="space-y-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="sole-owner" id="sole-owner" />
                            <Label htmlFor="sole-owner">Sole Owner (100%)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="multiple-owners" id="multiple-owners" />
                            <Label htmlFor="multiple-owners">Multiple Owners</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {formData.ownershipType === "multiple-owners" && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label>Ownership Breakdown</Label>
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm" 
                              onClick={addOwner}
                              className="flex items-center gap-1"
                            >
                              <Plus className="h-4 w-4" />
                              Add Owner
                            </Button>
                          </div>
                          
                          {formData.owners.map((owner, index) => (
                            <div key={index} className="flex gap-3 items-end">
                              <div className="flex-1 space-y-1">
                                <Label>Owner Name</Label>
                                <Input
                                  value={owner.name}
                                  onChange={(e) => updateOwner(index, 'name', e.target.value)}
                                  placeholder="Owner name"
                                  className="bg-background-hover border-border/50"
                                />
                              </div>
                              <div className="w-24 space-y-1">
                                <Label>%</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={owner.percentage}
                                  onChange={(e) => updateOwner(index, 'percentage', e.target.value)}
                                  placeholder="0"
                                  className="bg-background-hover border-border/50"
                                />
                              </div>
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm" 
                                onClick={() => removeOwner(index)}
                                className="p-2"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          
                          {formData.owners.length > 0 && (
                            <div className="text-sm">
                              <span className="font-medium">Total: {getTotalPercentage()}%</span>
                              {getTotalPercentage() !== 100 && (
                                <span className="text-orange-500 ml-2">
                                  (Should equal 100%)
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 5: Document Availability */}
                {step === 5 && (
                  <div className="space-y-6">
                    <CardHeader className="px-0 pt-0">
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <FileText className="h-5 w-5 text-accent" />
                        Financial Document Availability
                      </CardTitle>
                      <p className="text-sm text-foreground-secondary">
                        What financial documents do you have readily available?
                      </p>
                    </CardHeader>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label>Profit & Loss Statements *</Label>
                        <RadioGroup 
                          value={formData.pnlAvailability} 
                          onValueChange={(value) => setFormData(prev => ({ ...prev, pnlAvailability: value }))}
                          className="space-y-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="current-monthly" id="pnl-current-monthly" />
                            <Label htmlFor="pnl-current-monthly">Current & monthly statements available</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="annual-only" id="pnl-annual-only" />
                            <Label htmlFor="pnl-annual-only">Annual statements only</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="need-preparation" id="pnl-need-preparation" />
                            <Label htmlFor="pnl-need-preparation">Need to be prepared</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="not-available" id="pnl-not-available" />
                            <Label htmlFor="pnl-not-available">Not available</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-2">
                        <Label>Tax Returns *</Label>
                        <RadioGroup 
                          value={formData.taxReturnsAvailability} 
                          onValueChange={(value) => setFormData(prev => ({ ...prev, taxReturnsAvailability: value }))}
                          className="space-y-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="3-years" id="tax-3-years" />
                            <Label htmlFor="tax-3-years">3+ years available</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="1-2-years" id="tax-1-2-years" />
                            <Label htmlFor="tax-1-2-years">1-2 years available</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="current-only" id="tax-current-only" />
                            <Label htmlFor="tax-current-only">Current year only</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="not-available" id="tax-not-available" />
                            <Label htmlFor="tax-not-available">Not available</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-2">
                        <Label>Balance Sheets *</Label>
                        <RadioGroup 
                          value={formData.balanceSheetsAvailability} 
                          onValueChange={(value) => setFormData(prev => ({ ...prev, balanceSheetsAvailability: value }))}
                          className="space-y-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="current-monthly" id="balance-current-monthly" />
                            <Label htmlFor="balance-current-monthly">Current & monthly available</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="annual-only" id="balance-annual-only" />
                            <Label htmlFor="balance-annual-only">Annual only</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="need-preparation" id="balance-need-preparation" />
                            <Label htmlFor="balance-need-preparation">Need to be prepared</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="not-available" id="balance-not-available" />
                            <Label htmlFor="balance-not-available">Not available</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 6: Document Upload */}
                {step === 6 && (
                  <div className="space-y-6">
                    <CardHeader className="px-0 pt-0">
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Upload className="h-5 w-5 text-accent" />
                        Document Upload (Optional)
                      </CardTitle>
                      <p className="text-sm text-foreground-secondary">
                        Upload financial documents if you have them readily available. This is optional but helps us provide a more accurate assessment.
                      </p>
                    </CardHeader>

                    <div className="space-y-6">
                      {/* P&L Upload */}
                      <div className="space-y-3">
                        <Label>Profit & Loss Statements</Label>
                        <div className="border-2 border-dashed border-border/50 rounded-lg p-6 text-center bg-background-hover/50">
                          <input
                            type="file"
                            id="pnl-upload"
                            multiple
                            accept=".pdf,.xlsx,.xls,.csv"
                            onChange={(e) => handleFileUpload(e.target.files, 'pnl')}
                            className="hidden"
                          />
                          <label htmlFor="pnl-upload" className="cursor-pointer">
                            <Upload className="h-8 w-8 mx-auto mb-2 text-foreground-muted" />
                            <p className="text-sm text-foreground-secondary">
                              Click to upload P&L statements
                            </p>
                            <p className="text-xs text-foreground-muted mt-1">
                              PDF, Excel, or CSV files accepted
                            </p>
                          </label>
                        </div>
                        {formData.pnlFiles.length > 0 && (
                          <div className="space-y-2">
                            {formData.pnlFiles.map((file, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-background-hover rounded border border-border/50">
                                <div className="flex items-center gap-2">
                                  <File className="h-4 w-4 text-foreground-muted" />
                                  <span className="text-sm">{file.name}</span>
                                </div>
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => removeFile(index, 'pnl')}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Tax Returns Upload */}
                      <div className="space-y-3">
                        <Label>Tax Returns</Label>
                        <div className="border-2 border-dashed border-border/50 rounded-lg p-6 text-center bg-background-hover/50">
                          <input
                            type="file"
                            id="tax-upload"
                            multiple
                            accept=".pdf,.xlsx,.xls"
                            onChange={(e) => handleFileUpload(e.target.files, 'taxReturn')}
                            className="hidden"
                          />
                          <label htmlFor="tax-upload" className="cursor-pointer">
                            <Upload className="h-8 w-8 mx-auto mb-2 text-foreground-muted" />
                            <p className="text-sm text-foreground-secondary">
                              Click to upload tax returns
                            </p>
                            <p className="text-xs text-foreground-muted mt-1">
                              PDF or Excel files accepted
                            </p>
                          </label>
                        </div>
                        {formData.taxReturnFiles.length > 0 && (
                          <div className="space-y-2">
                            {formData.taxReturnFiles.map((file, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-background-hover rounded border border-border/50">
                                <div className="flex items-center gap-2">
                                  <File className="h-4 w-4 text-foreground-muted" />
                                  <span className="text-sm">{file.name}</span>
                                </div>
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => removeFile(index, 'taxReturn')}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Balance Sheets Upload */}
                      <div className="space-y-3">
                        <Label>Balance Sheets</Label>
                        <div className="border-2 border-dashed border-border/50 rounded-lg p-6 text-center bg-background-hover/50">
                          <input
                            type="file"
                            id="balance-upload"
                            multiple
                            accept=".pdf,.xlsx,.xls,.csv"
                            onChange={(e) => handleFileUpload(e.target.files, 'balanceSheet')}
                            className="hidden"
                          />
                          <label htmlFor="balance-upload" className="cursor-pointer">
                            <Upload className="h-8 w-8 mx-auto mb-2 text-foreground-muted" />
                            <p className="text-sm text-foreground-secondary">
                              Click to upload balance sheets
                            </p>
                            <p className="text-xs text-foreground-muted mt-1">
                              PDF, Excel, or CSV files accepted
                            </p>
                          </label>
                        </div>
                        {formData.balanceSheetFiles.length > 0 && (
                          <div className="space-y-2">
                            {formData.balanceSheetFiles.map((file, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-background-hover rounded border border-border/50">
                                <div className="flex items-center gap-2">
                                  <File className="h-4 w-4 text-foreground-muted" />
                                  <span className="text-sm">{file.name}</span>
                                </div>
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => removeFile(index, 'balanceSheet')}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 7: Exit Goals & Challenges */}
                {step === 7 && (
                  <div className="space-y-6">
                    <CardHeader className="px-0 pt-0">
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Clock className="h-5 w-5 text-accent" />
                        Exit Goals & Current Challenges
                      </CardTitle>
                      <p className="text-sm text-foreground-secondary">
                        Help us understand your timeline and current business challenges.
                      </p>
                    </CardHeader>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label>Target Exit Timeline *</Label>
                        <RadioGroup 
                          value={formData.exitTimeline} 
                          onValueChange={(value) => setFormData(prev => ({ ...prev, exitTimeline: value }))}
                          className="space-y-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="6-months" id="exit-6-months" />
                            <Label htmlFor="exit-6-months">Within 6 months</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="1-year" id="exit-1-year" />
                            <Label htmlFor="exit-1-year">Within 1 year</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="2-3-years" id="exit-2-3-years" />
                            <Label htmlFor="exit-2-3-years">2-3 years</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="3-5-years" id="exit-3-5-years" />
                            <Label htmlFor="exit-3-5-years">3-5 years</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="5-plus-years" id="exit-5-plus-years" />
                            <Label htmlFor="exit-5-plus-years">5+ years</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="unsure" id="exit-unsure" />
                            <Label htmlFor="exit-unsure">Unsure/Exploring</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-2">
                        <Label>Preferred Exit Type *</Label>
                        <RadioGroup 
                          value={formData.exitType} 
                          onValueChange={(value) => setFormData(prev => ({ ...prev, exitType: value }))}
                          className="space-y-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="strategic-buyer" id="strategic-buyer" />
                            <Label htmlFor="strategic-buyer">Strategic buyer (competitor/industry player)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="financial-buyer" id="financial-buyer" />
                            <Label htmlFor="financial-buyer">Financial buyer (private equity/investment firm)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="management-buyout" id="management-buyout" />
                            <Label htmlFor="management-buyout">Management buyout</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="family-succession" id="family-succession" />
                            <Label htmlFor="family-succession">Family succession</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="open-to-options" id="open-to-options" />
                            <Label htmlFor="open-to-options">Open to best option</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="currentChallenges">Current Business Challenges *</Label>
                        <Textarea
                          id="currentChallenges"
                          value={formData.currentChallenges}
                          onChange={(e) => setFormData(prev => ({ ...prev, currentChallenges: e.target.value }))}
                          className="bg-background-hover border-border/50 min-h-[100px]"
                          placeholder="Describe any current challenges, areas for improvement, or concerns about your business..."
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 8: Contact Information */}
                {step === 8 && (
                  <div className="space-y-6">
                    <CardHeader className="px-0 pt-0">
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Users className="h-5 w-5 text-accent" />
                        Contact Information
                      </CardTitle>
                      <p className="text-sm text-foreground-secondary">
                        Final step! How can we best reach you with your assessment results?
                      </p>
                    </CardHeader>

                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                            className="bg-background-hover border-border/50"
                            placeholder="(555) 123-4567"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="companyWebsite">Company Website (Optional)</Label>
                          <Input
                            id="companyWebsite"
                            type="url"
                            value={formData.companyWebsite}
                            onChange={(e) => setFormData(prev => ({ ...prev, companyWebsite: e.target.value }))}
                            className="bg-background-hover border-border/50"
                            placeholder="https://www.yourcompany.com"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Preferred Contact Method *</Label>
                        <RadioGroup 
                          value={formData.preferredContact} 
                          onValueChange={(value) => setFormData(prev => ({ ...prev, preferredContact: value }))}
                          className="space-y-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="email" id="contact-email" />
                            <Label htmlFor="contact-email">Email</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="phone" id="contact-phone" />
                            <Label htmlFor="contact-phone">Phone Call</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="both" id="contact-both" />
                            <Label htmlFor="contact-both">Either Email or Phone</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="howDidYouHear">How did you hear about us? (Optional)</Label>
                        <Select 
                          value={formData.howDidYouHear} 
                          onValueChange={(value) => setFormData(prev => ({ ...prev, howDidYouHear: value }))}
                        >
                          <SelectTrigger className="bg-background-hover border-border/50">
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="google-search">Google Search</SelectItem>
                            <SelectItem value="linkedin">LinkedIn</SelectItem>
                            <SelectItem value="referral">Referral from colleague/advisor</SelectItem>
                            <SelectItem value="industry-event">Industry Event</SelectItem>
                            <SelectItem value="social-media">Social Media</SelectItem>
                            <SelectItem value="direct-outreach">Direct Outreach</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Add-backs Section */}
                      <div className="space-y-4 pt-6 border-t border-border/50">
                        <div className="space-y-2">
                          <Label className="text-base font-semibold flex items-center gap-2">
                            <Calculator className="h-4 w-4 text-accent" />
                            Owner Add-backs for EBITDA (Optional but Recommended)
                          </Label>
                          <p className="text-sm text-foreground-secondary">
                            Select expenses that could be eliminated by a new owner. This helps show the true earning potential of your business.
                          </p>
                        </div>

                        <div className="space-y-4">
                          {Object.entries(formData.addBacks).map(([category, data]) => {
                            const categoryLabels = {
                              personalVehicles: "Personal vehicles/auto expenses",
                              familySalaries: "Family member salaries (non-working)",
                              ownerInsurance: "Owner's personal insurance",
                              travelEntertainment: "Personal travel & entertainment",
                              personalProperty: "Personal property expenses",
                              professionalServices: "Personal professional services",
                              discretionarySpending: "Discretionary owner spending",
                              other: "Other owner add-backs"
                            } as const;

                            return (
                              <div key={category} className="space-y-2">
                                <div className="flex items-center space-x-3">
                                  <Checkbox
                                    id={category}
                                    checked={data.selected}
                                    onCheckedChange={() => toggleAddBack(category as keyof typeof formData.addBacks)}
                                    className="h-4 w-4"
                                  />
                                  <Label htmlFor={category} className="text-sm cursor-pointer">
                                    {categoryLabels[category as keyof typeof categoryLabels]}
                                  </Label>
                                </div>
                                {data.selected && (
                                  <div className="ml-7 space-y-1">
                                    <Label className="text-xs text-foreground-muted">
                                      Notes (optional)
                                    </Label>
                                    <Textarea
                                      value={data.notes}
                                      onChange={(e) => updateAddBackNotes(category as keyof typeof formData.addBacks, e.target.value)}
                                      className="bg-background-hover border-border/50 text-sm"
                                      placeholder="Add details about this add-back..."
                                      rows={2}
                                    />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Trust Signals */}
                      <div className="bg-background-hover/50 p-6 rounded-lg border border-border/30">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                          <div className="space-y-2">
                            <h4 className="font-semibold text-sm">Your Information is Secure</h4>
                            <ul className="text-xs text-foreground-secondary space-y-1">
                              <li>• All data is encrypted and stored securely</li>
                              <li>• We never share your information with third parties</li>
                              <li>• Your assessment is confidential and for your use only</li>
                              <li>• You'll receive your personalized results within 24-48 hours</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-8 border-t border-border/50">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handlePrev}
                    disabled={step === 1}
                    className="flex items-center gap-2"
                  >
                    Previous
                  </Button>
                  
                  {step === totalSteps ? (
                    <Button 
                      type="submit" 
                      disabled={isSubmitting || !validateStep(step)}
                      className="bg-accent hover:bg-accent/90 font-semibold flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Assessment
                          <CheckCircle className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button 
                      type="button" 
                      onClick={handleNext}
                      disabled={!validateStep(step)}
                      className="bg-accent hover:bg-accent/90 font-semibold"
                    >
                      Next Step
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PreAssessmentForm;
