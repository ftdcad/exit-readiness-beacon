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
import { AssessmentGuard } from "@/components/AssessmentGuard";
import { useContactSubmission } from "@/hooks/useContactSubmission";
import { useNDASubmission } from "@/hooks/useNDASubmission";

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
    phone: "",
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
  const { checkNDAStatus } = useNDASubmission();

  const totalSteps = 8;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Get NDA record ID if available
    const ndaStatus = checkNDAStatus();
    const ndaRecordId = ndaStatus?.id;

    const result = await submitContact(formData, ndaRecordId);
    
    if (result.success) {
      // Could redirect to thank you page or show success state
      // For now, form will show success message via toast
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
    <section className="py-16 bg-background-card">
      <div className="container px-4 md:px-6">
        <div className="max-w-2xl mx-auto">
          <AssessmentGuard>
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

                {/* Step 3: Investment Type & Interest */}
                {step === 3 && (
                  <div className="space-y-6">
                    <CardHeader className="px-0 pt-0">
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <CheckCircle className="h-5 w-5 text-accent" />
                        Investment Type & Interest
                      </CardTitle>
                      <p className="text-sm text-foreground-secondary">
                        Understanding what type of investment you're considering helps us provide more targeted guidance.
                      </p>
                    </CardHeader>

                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="investmentType">What type of investment are you most interested in?</Label>
                        <Select
                          value={formData.investmentType}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, investmentType: value }))}
                        >
                          <SelectTrigger className="bg-background-hover border-border/50">
                            <SelectValue placeholder="Select investment type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="angel">Angel Investment - Early stage funding, typically $25K-$500K for startups</SelectItem>
                            <SelectItem value="venture-capital">Venture Capital - Growth funding $1M+ for high-potential businesses</SelectItem>
                            <SelectItem value="private-equity-minority">Private Equity (Minority) - PE firm takes &lt;50% ownership ⚠️ Very rare</SelectItem>
                            <SelectItem value="private-equity-majority">Private Equity (Majority) - PE firm takes &gt;50% ownership (Most common)</SelectItem>
                            <SelectItem value="strategic-acquisition">Strategic Acquisition - Sale to industry competitor or larger company</SelectItem>
                            <SelectItem value="not-sure">Not Sure Yet - Still exploring options</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {formData.investmentType === "private-equity-minority" && (
                        <div className="p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                          <p className="text-sm text-orange-800 dark:text-orange-200">
                            <strong>Important Note:</strong> Private equity minority investments are extremely rare. Most PE firms prefer majority control to implement operational changes and drive growth. Consider whether majority PE or strategic acquisition might better align with your goals.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 4: Business Structure & Ownership */}
                {step === 4 && (
                  <div className="space-y-6">
                    <CardHeader className="px-0 pt-0">
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Scale className="h-5 w-5 text-accent" />
                        Business Structure & Ownership
                      </CardTitle>
                      <p className="text-sm text-foreground-secondary">
                        Understanding your corporate structure and ownership helps us tailor our assessment.
                      </p>
                    </CardHeader>

                    <div className="grid gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="entityType">What type of business entity are you?</Label>
                        <Select
                          value={formData.entityType}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, entityType: value }))}
                        >
                          <SelectTrigger className="bg-background-hover border-border/50">
                            <SelectValue placeholder="Select entity type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="llc">LLC (Limited Liability Company)</SelectItem>
                            <SelectItem value="c-corp">C Corporation</SelectItem>
                            <SelectItem value="s-corp">S Corporation</SelectItem>
                            <SelectItem value="partnership">Partnership</SelectItem>
                            <SelectItem value="sole-proprietorship">Sole Proprietorship</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-4">
                        <Label>Are you the sole owner or do you have partners/co-owners?</Label>
                        <RadioGroup
                          value={formData.ownershipType}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, ownershipType: value, owners: value === 'sole' ? [] : prev.owners }))}
                          className="flex gap-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="sole" id="sole" />
                            <Label htmlFor="sole">Sole owner</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="multiple" id="multiple" />
                            <Label htmlFor="multiple">Multiple owners/partners</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {formData.ownershipType === 'multiple' && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label className="text-base font-medium">Ownership Structure</Label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={addOwner}
                              className="flex items-center gap-2"
                            >
                              <Plus className="h-4 w-4" />
                              Add Owner
                            </Button>
                          </div>

                          {formData.owners.map((owner, index) => (
                            <div key={index} className="flex gap-3 items-end">
                              <div className="flex-1 space-y-2">
                                <Label htmlFor={`owner-name-${index}`}>Owner Name</Label>
                                <Input
                                  id={`owner-name-${index}`}
                                  value={owner.name}
                                  onChange={(e) => updateOwner(index, 'name', e.target.value)}
                                  placeholder="Full name"
                                  className="bg-background-hover border-border/50"
                                />
                              </div>
                              <div className="w-32 space-y-2">
                                <Label htmlFor={`owner-percentage-${index}`}>Ownership %</Label>
                                <Input
                                  id={`owner-percentage-${index}`}
                                  type="number"
                                  min="0"
                                  max="100"
                                  step="0.1"
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
                            <div className="mt-4 p-3 bg-background-hover/50 rounded-lg">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Total Ownership:</span>
                                <span className={`text-sm font-medium ${getTotalPercentage() === 100 ? 'text-success' : 'text-warning'}`}>
                                  {getTotalPercentage().toFixed(1)}%
                                </span>
                              </div>
                              {getTotalPercentage() !== 100 && (
                                <p className="text-xs text-warning mt-1">
                                  Ownership percentages should total 100%
                                </p>
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
                        Financial Documentation
                      </CardTitle>
                      <p className="text-sm text-foreground-secondary">
                        Understanding what financial documents you have available helps us prepare for the due diligence process.
                      </p>
                    </CardHeader>

                    <div className="grid gap-6">
                      <div className="space-y-4">
                        <Label className="text-base font-medium">Are you able to provide 3 years of P&L statements?</Label>
                        <RadioGroup
                          value={formData.pnlAvailability}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, pnlAvailability: value }))}
                          className="grid gap-3"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="readily-available" id="pnl-ready" />
                            <Label htmlFor="pnl-ready">Yes, I have them readily available</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="need-time" id="pnl-time" />
                            <Label htmlFor="pnl-time">Yes, but I'd need time to gather them</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="not-available" id="pnl-no" />
                            <Label htmlFor="pnl-no">No, I don't have them available</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="not-sure" id="pnl-unsure" />
                            <Label htmlFor="pnl-unsure">Not sure</Label>
                          </div>
                        </RadioGroup>
                        
                        {formData.pnlAvailability === 'readily-available' && (
                          <div className="mt-4 p-4 border-2 border-dashed border-border/50 rounded-lg bg-background-hover/30">
                            <div className="text-center">
                              <Upload className="h-8 w-8 text-foreground-secondary mx-auto mb-2" />
                              <Label className="text-sm font-medium">Upload P&L Statements</Label>
                              <p className="text-xs text-foreground-secondary mb-3">Drag and drop or click to select files (PDF, Excel)</p>
                              <input
                                type="file"
                                multiple
                                accept=".pdf,.xlsx,.xls"
                                onChange={(e) => handleFileUpload(e.target.files, 'pnl')}
                                className="hidden"
                                id="pnl-upload"
                              />
                              <Label htmlFor="pnl-upload" className="cursor-pointer">
                                <Button type="button" variant="outline" size="sm" asChild>
                                  <span>Choose Files</span>
                                </Button>
                              </Label>
                              {formData.pnlFiles.length > 0 && (
                                <div className="mt-3 space-y-2">
                                  {formData.pnlFiles.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between text-xs bg-background-hover p-2 rounded">
                                      <div className="flex items-center gap-2">
                                        <File className="h-3 w-3" />
                                        <span>{file.name}</span>
                                      </div>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeFile(index, 'pnl')}
                                        className="h-auto p-1"
                                      >
                                        <X className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <Label className="text-base font-medium">Are you able to provide 3 years of tax returns?</Label>
                        <RadioGroup
                          value={formData.taxReturnsAvailability}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, taxReturnsAvailability: value }))}
                          className="grid gap-3"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="readily-available" id="tax-ready" />
                            <Label htmlFor="tax-ready">Yes, I have them readily available</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="need-time" id="tax-time" />
                            <Label htmlFor="tax-time">Yes, but I'd need time to gather them</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="not-available" id="tax-no" />
                            <Label htmlFor="tax-no">No, I don't have them available</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="not-sure" id="tax-unsure" />
                            <Label htmlFor="tax-unsure">Not sure</Label>
                          </div>
                        </RadioGroup>
                        
                        {formData.taxReturnsAvailability === 'readily-available' && (
                          <div className="mt-4 p-4 border-2 border-dashed border-border/50 rounded-lg bg-background-hover/30">
                            <div className="text-center">
                              <Upload className="h-8 w-8 text-foreground-secondary mx-auto mb-2" />
                              <Label className="text-sm font-medium">Upload Tax Returns</Label>
                              <p className="text-xs text-foreground-secondary mb-3">Drag and drop or click to select files (PDF, Excel)</p>
                              <input
                                type="file"
                                multiple
                                accept=".pdf,.xlsx,.xls"
                                onChange={(e) => handleFileUpload(e.target.files, 'taxReturn')}
                                className="hidden"
                                id="tax-upload"
                              />
                              <Label htmlFor="tax-upload" className="cursor-pointer">
                                <Button type="button" variant="outline" size="sm" asChild>
                                  <span>Choose Files</span>
                                </Button>
                              </Label>
                              {formData.taxReturnFiles.length > 0 && (
                                <div className="mt-3 space-y-2">
                                  {formData.taxReturnFiles.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between text-xs bg-background-hover p-2 rounded">
                                      <div className="flex items-center gap-2">
                                        <File className="h-3 w-3" />
                                        <span>{file.name}</span>
                                      </div>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeFile(index, 'taxReturn')}
                                        className="h-auto p-1"
                                      >
                                        <X className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <Label className="text-base font-medium">Are you able to provide 3 years of balance sheets?</Label>
                        <RadioGroup
                          value={formData.balanceSheetsAvailability}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, balanceSheetsAvailability: value }))}
                          className="grid gap-3"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="readily-available" id="balance-ready" />
                            <Label htmlFor="balance-ready">Yes, I have them readily available</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="need-time" id="balance-time" />
                            <Label htmlFor="balance-time">Yes, but I'd need time to gather them</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="not-available" id="balance-no" />
                            <Label htmlFor="balance-no">No, I don't have them available</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="not-sure" id="balance-unsure" />
                            <Label htmlFor="balance-unsure">Not sure</Label>
                          </div>
                        </RadioGroup>
                        
                        {formData.balanceSheetsAvailability === 'readily-available' && (
                          <div className="mt-4 p-4 border-2 border-dashed border-border/50 rounded-lg bg-background-hover/30">
                            <div className="text-center">
                              <Upload className="h-8 w-8 text-foreground-secondary mx-auto mb-2" />
                              <Label className="text-sm font-medium">Upload Balance Sheets</Label>
                              <p className="text-xs text-foreground-secondary mb-3">Drag and drop or click to select files (PDF, Excel)</p>
                              <input
                                type="file"
                                multiple
                                accept=".pdf,.xlsx,.xls"
                                onChange={(e) => handleFileUpload(e.target.files, 'balanceSheet')}
                                className="hidden"
                                id="balance-upload"
                              />
                              <Label htmlFor="balance-upload" className="cursor-pointer">
                                <Button type="button" variant="outline" size="sm" asChild>
                                  <span>Choose Files</span>
                                </Button>
                              </Label>
                              {formData.balanceSheetFiles.length > 0 && (
                                <div className="mt-3 space-y-2">
                                  {formData.balanceSheetFiles.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between text-xs bg-background-hover p-2 rounded">
                                      <div className="flex items-center gap-2">
                                        <File className="h-3 w-3" />
                                        <span>{file.name}</span>
                                      </div>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeFile(index, 'balanceSheet')}
                                        className="h-auto p-1"
                                      >
                                        <X className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 6: Owner Add-Back Questionnaire */}
                 {step === 6 && (
                  <div className="space-y-6">
                    <CardHeader className="px-0 pt-0">
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Calculator className="h-5 w-5 text-accent" />
                        Owner Add-Back Analysis
                      </CardTitle>
                      <p className="text-sm text-foreground-secondary">
                        Identify personal expenses currently run through the business that wouldn't carry over post-sale. This helps normalize EBITDA for more accurate valuation.
                      </p>
                    </CardHeader>

                    <div className="grid gap-6">
                      <div className="space-y-4">
                        <Label className="text-base font-medium">
                          Select any personal expenses currently run through your business:
                        </Label>
                        
                        <div className="grid gap-3">
                          {[
                            { key: 'personalVehicles' as const, label: 'Personal vehicles (cars, trucks, boats, RVs)' },
                            { key: 'familySalaries' as const, label: 'Family member salaries (non-working family)' },
                            { key: 'ownerInsurance' as const, label: 'Owner/family health, life, or disability insurance' },
                            { key: 'travelEntertainment' as const, label: 'Personal travel and entertainment' },
                            { key: 'personalProperty' as const, label: 'Personal property expenses (home office, etc.)' },
                            { key: 'professionalServices' as const, label: 'One-time professional services (legal, consulting)' },
                            { key: 'discretionarySpending' as const, label: 'Other discretionary owner spending' },
                            { key: 'other' as const, label: 'Other personal expenses' }
                          ].map((category) => (
                            <div key={category.key} className="space-y-3">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={category.key}
                                  checked={formData.addBacks[category.key].selected}
                                  onCheckedChange={() => toggleAddBack(category.key)}
                                />
                                <Label htmlFor={category.key} className="cursor-pointer">
                                  {category.label}
                                </Label>
                              </div>
                              
                              {formData.addBacks[category.key].selected && (
                                <div className="mt-4 p-4 border-2 border-dashed border-border/50 rounded-lg bg-background-hover/30">
                                  <Textarea
                                    placeholder="Describe the expense and estimated annual amount (e.g., 'Personal vehicle lease - $12,000/year')"
                                    value={formData.addBacks[category.key].notes}
                                    onChange={(e) => updateAddBackNotes(category.key, e.target.value)}
                                    className="bg-background border-border/50 text-sm"
                                    rows={2}
                                  />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
                        <h4 className="text-sm font-semibold text-accent mb-2 flex items-center gap-2">
                          <Calculator className="h-4 w-4" />
                          Why This Matters
                        </h4>
                        <p className="text-xs text-foreground-secondary">
                          These add-backs help normalize your EBITDA by removing personal expenses that won't continue after a sale. 
                          This typically increases your business valuation by improving the adjusted EBITDA multiple.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 7: Exit Strategy & Goals */}
                {step === 7 && (
                  <div className="space-y-6">
                    <CardHeader className="px-0 pt-0">
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Clock className="h-5 w-5 text-accent" />
                        Exit Strategy & Goals
                      </CardTitle>
                      <p className="text-sm text-foreground-secondary">
                        Understanding your exit timeline and preferences helps us provide targeted guidance.
                      </p>
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
                        We'll use this information to contact you with your personalized assessment results.
                      </p>
                    </CardHeader>

                    <div className="grid gap-4">
                      <div className="grid grid-cols-2 gap-4">
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

                        <div className="space-y-2">
                          <Label htmlFor="jobTitle">Your Job Title</Label>
                          <Input
                            id="jobTitle"
                            value={formData.jobTitle}
                            onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                            className="bg-background-hover border-border/50"
                            placeholder="e.g., CEO, Founder, Owner"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="preferredContact">Preferred Contact Method</Label>
                          <Select
                            value={formData.preferredContact}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, preferredContact: value }))}
                          >
                            <SelectTrigger className="bg-background-hover border-border/50">
                              <SelectValue placeholder="Select method" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="phone">Phone Call</SelectItem>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="video">Video Call</SelectItem>
                              <SelectItem value="in-person">In-Person Meeting</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="howDidYouHear">How did you hear about us?</Label>
                          <Select
                            value={formData.howDidYouHear}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, howDidYouHear: value }))}
                          >
                            <SelectTrigger className="bg-background-hover border-border/50">
                              <SelectValue placeholder="Select source" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="google">Google Search</SelectItem>
                              <SelectItem value="linkedin">LinkedIn</SelectItem>
                              <SelectItem value="referral">Referral</SelectItem>
                              <SelectItem value="social-media">Social Media</SelectItem>
                              <SelectItem value="industry-event">Industry Event</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
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
          </AssessmentGuard>
        </div>
      </div>
    </section>
  );
};

export default PreAssessmentForm;