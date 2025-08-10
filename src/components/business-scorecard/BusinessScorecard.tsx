
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ChevronRight, ChevronLeft, AlertTriangle, DollarSign, TrendingDown, XCircle } from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';
import { getNextModulePath } from '@/config/moduleConfig';
import { useNavigate } from 'react-router-dom';

interface ScorecardCategory {
  name: string;
  weight: number;
  score: number;
  maxImpact: string;
  details: string[];
}

export const BusinessScorecard: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [categories, setCategories] = useState<ScorecardCategory[]>([
    { name: 'Financial Performance', weight: 30, score: 0, maxImpact: '-$3M', details: [] },
    { name: 'Revenue Quality', weight: 25, score: 0, maxImpact: '-$2.5M', details: [] },
    { name: 'Customer Concentration', weight: 20, score: 0, maxImpact: '-$2M', details: [] },
    { name: 'Operational Excellence', weight: 15, score: 0, maxImpact: '-$1.5M', details: [] },
    { name: 'Market Position', weight: 10, score: 0, maxImpact: '-$1M', details: [] }
  ]);
  
  const pages = [
    {
      title: "PE's Brutal Scoring System",
      content: <IntroPage />
    },
    {
      title: "Financial Performance Check",
      content: <FinancialPage categories={categories} setCategories={setCategories} />
    },
    {
      title: "Revenue Quality Assessment",
      content: <RevenuePage categories={categories} setCategories={setCategories} />
    },
    {
      title: "Customer Concentration Risk",
      content: <CustomerPage categories={categories} setCategories={setCategories} />
    },
    {
      title: "Operational Excellence",
      content: <OperationalPage categories={categories} setCategories={setCategories} />
    },
    {
      title: "Market Position",
      content: <MarketPage categories={categories} setCategories={setCategories} />
    },
    {
      title: "Your PE Readiness Report",
      content: <ReportPage categories={categories} />
    }
  ];
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <Progress value={(currentPage + 1) / pages.length * 100} className="h-2" />
        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
          <span>Step {currentPage + 1} of {pages.length}</span>
          <span>{pages[currentPage].title}</span>
        </div>
      </div>
      
      <Card className="p-8 min-h-[600px]">
        {pages[currentPage].content}
      </Card>
      
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        
        <Button
          onClick={() => setCurrentPage(Math.min(pages.length - 1, currentPage + 1))}
          disabled={currentPage === pages.length - 1}
        >
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

const IntroPage: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold text-foreground">
      How PE Firms Actually Score Your Business
    </h2>
    
    <Card className="bg-red-500/10 border-red-500/30 p-6">
      <p className="text-red-600 dark:text-red-400 font-semibold mb-2">The Hard Truth:</p>
      <p className="text-foreground">
        PE firms run your business through a scoring matrix. Every weakness directly reduces 
        your valuation. A "70% ready" business gets a 30% valuation haircut. Let's see your real score.
      </p>
    </Card>
    
    <div className="grid grid-cols-2 gap-6">
      <Card className="p-6 bg-muted">
        <DollarSign className="w-8 h-8 text-green-500 mb-3" />
        <h3 className="text-xl font-semibold mb-3">What PE Rewards</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Predictable, growing revenue</li>
          <li>• Diverse customer base</li>
          <li>• Scalable operations</li>
          <li>• Strong margins & cash flow</li>
          <li>• Market leadership position</li>
        </ul>
      </Card>
      
      <Card className="p-6 bg-muted">
        <TrendingDown className="w-8 h-8 text-red-500 mb-3" />
        <h3 className="text-xl font-semibold mb-3">What Kills Value</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Customer concentration &gt;30%</li>
          <li>• Declining or lumpy revenue</li>
          <li>• Owner dependency</li>
          <li>• Weak systems & processes</li>
          <li>• Commodity market position</li>
        </ul>
      </Card>
    </div>
    
    <Card className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
      <h3 className="text-xl font-semibold mb-3">The Scoring Impact</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="font-medium">90-100% Score</span>
          <span className="text-green-500 font-bold">Premium valuation (6-8x EBITDA)</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium">70-89% Score</span>
          <span className="text-yellow-500 font-bold">Market valuation (4-6x EBITDA)</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium">50-69% Score</span>
          <span className="text-orange-500 font-bold">Discounted value (3-4x EBITDA)</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium">&lt;50% Score</span>
          <span className="text-red-500 font-bold">No deal or fire sale (2-3x EBITDA)</span>
        </div>
      </div>
    </Card>
    
    <Alert className="border-yellow-500/30 bg-yellow-500/10">
      <AlertTriangle className="h-4 w-4 text-yellow-600" />
      <AlertDescription className="text-foreground">
        <strong>Warning:</strong> This assessment shows exactly how PE firms will evaluate you during 
        due diligence. Every "no" answer will become a negotiation point to reduce your price.
      </AlertDescription>
    </Alert>
  </div>
);

const FinancialPage: React.FC<{
  categories: ScorecardCategory[];
  setCategories: (cats: ScorecardCategory[]) => void;
}> = ({ categories, setCategories }) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  const updateCategory = () => {
    let score = 0;
    const details: string[] = [];
    
    if (answers.growth === 'yes') score += 25;
    else details.push('Revenue growth below 15% annually');
    
    if (answers.margins === 'yes') score += 25;
    else details.push('EBITDA margins below industry average');
    
    if (answers.consistency === 'yes') score += 25;
    else details.push('Inconsistent monthly/quarterly performance');
    
    if (answers.cashflow === 'yes') score += 25;
    else details.push('Poor cash conversion cycle');
    
    const updated = [...categories];
    updated[0] = { ...updated[0], score, details };
    setCategories(updated);
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-foreground">
        Financial Performance Reality Check
      </h2>
      
      <p className="text-muted-foreground">
        PE firms want predictable, growing, high-margin businesses. Every "no" costs you money.
      </p>
      
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Revenue Growth</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Have you grown revenue 15%+ annually for the last 3 years?
        </p>
        <RadioGroup 
          value={answers.growth} 
          onValueChange={(value) => {
            setAnswers({...answers, growth: value});
            updateCategory();
          }}
        >
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="growth-yes" />
              <Label htmlFor="growth-yes">Yes - Consistent 15%+ growth</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="growth-no" />
              <Label htmlFor="growth-no">No - Below 15% or inconsistent</Label>
            </div>
          </div>
        </RadioGroup>
        {answers.growth === 'no' && (
          <Alert className="mt-4 border-red-500/30 bg-red-500/10">
            <AlertDescription>
              <strong>Impact:</strong> Reduces multiple by 0.5-1x. PE wants growth stories, not mature businesses.
            </AlertDescription>
          </Alert>
        )}
      </Card>
      
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">EBITDA Margins</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Are your EBITDA margins above 20% (or top quartile for your industry)?
        </p>
        <RadioGroup 
          value={answers.margins} 
          onValueChange={(value) => {
            setAnswers({...answers, margins: value});
            updateCategory();
          }}
        >
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="margins-yes" />
              <Label htmlFor="margins-yes">Yes - Strong margins for industry</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="margins-no" />
              <Label htmlFor="margins-no">No - Below industry average</Label>
            </div>
          </div>
        </RadioGroup>
        {answers.margins === 'no' && (
          <Alert className="mt-4 border-red-500/30 bg-red-500/10">
            <AlertDescription>
              <strong>Impact:</strong> Every 5% below average = -$500K in valuation on $2M EBITDA business.
            </AlertDescription>
          </Alert>
        )}
      </Card>
      
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Performance Consistency</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Is your monthly revenue predictable within 10% variance?
        </p>
        <RadioGroup 
          value={answers.consistency} 
          onValueChange={(value) => {
            setAnswers({...answers, consistency: value});
            updateCategory();
          }}
        >
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="consistency-yes" />
              <Label htmlFor="consistency-yes">Yes - Smooth, predictable revenue</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="consistency-no" />
              <Label htmlFor="consistency-no">No - Lumpy or seasonal swings</Label>
            </div>
          </div>
        </RadioGroup>
        {answers.consistency === 'no' && (
          <Alert className="mt-4 border-red-500/30 bg-red-500/10">
            <AlertDescription>
              <strong>Impact:</strong> Lumpy revenue = "higher risk" = lower multiple by 0.5-1.5x.
            </AlertDescription>
          </Alert>
        )}
      </Card>
      
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Cash Flow Conversion</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Do you convert 80%+ of EBITDA to free cash flow?
        </p>
        <RadioGroup 
          value={answers.cashflow} 
          onValueChange={(value) => {
            setAnswers({...answers, cashflow: value});
            updateCategory();
          }}
        >
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="cashflow-yes" />
              <Label htmlFor="cashflow-yes">Yes - Strong cash generation</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="cashflow-no" />
              <Label htmlFor="cashflow-no">No - Poor cash conversion</Label>
            </div>
          </div>
        </RadioGroup>
        {answers.cashflow === 'no' && (
          <Alert className="mt-4 border-red-500/30 bg-red-500/10">
            <AlertDescription>
              <strong>Impact:</strong> PE values cash, not accounting profits. Poor conversion = major red flag.
            </AlertDescription>
          </Alert>
        )}
      </Card>
    </div>
  );
};

const RevenuePage: React.FC<{
  categories: ScorecardCategory[];
  setCategories: (cats: ScorecardCategory[]) => void;
}> = ({ categories, setCategories }) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  const updateCategory = () => {
    let score = 0;
    const details: string[] = [];
    
    if (answers.recurring === 'yes') score += 40;
    else details.push('Less than 60% recurring revenue');
    
    if (answers.contracts === 'yes') score += 30;
    else details.push('Weak or missing customer contracts');
    
    if (answers.churn === 'yes') score += 30;
    else details.push('Customer churn above 10% annually');
    
    const updated = [...categories];
    updated[1] = { ...updated[1], score, details };
    setCategories(updated);
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-foreground">
        Revenue Quality Deep Dive
      </h2>
      
      <p className="text-muted-foreground">
        PE firms pay premium multiples for recurring, contracted, sticky revenue.
      </p>
      
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recurring Revenue</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Is 60%+ of your revenue recurring or subscription-based?
        </p>
        <RadioGroup 
          value={answers.recurring} 
          onValueChange={(value) => {
            setAnswers({...answers, recurring: value});
            updateCategory();
          }}
        >
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="recurring-yes" />
              <Label htmlFor="recurring-yes">Yes - Majority is recurring/subscription</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="recurring-no" />
              <Label htmlFor="recurring-no">No - Mostly project or transactional</Label>
            </div>
          </div>
        </RadioGroup>
        {answers.recurring === 'no' && (
          <Alert className="mt-4 border-red-500/30 bg-red-500/10">
            <AlertDescription>
              <strong>Impact:</strong> Project revenue gets 3-4x multiple. Recurring gets 5-7x. Do the math.
            </AlertDescription>
          </Alert>
        )}
      </Card>
      
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Customer Contracts</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Do you have multi-year contracts with 50%+ of revenue?
        </p>
        <RadioGroup 
          value={answers.contracts} 
          onValueChange={(value) => {
            setAnswers({...answers, contracts: value});
            updateCategory();
          }}
        >
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="contracts-yes" />
              <Label htmlFor="contracts-yes">Yes - Strong multi-year contracts</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="contracts-no" />
              <Label htmlFor="contracts-no">No - Month-to-month or handshake deals</Label>
            </div>
          </div>
        </RadioGroup>
        {answers.contracts === 'no' && (
          <Alert className="mt-4 border-red-500/30 bg-red-500/10">
            <AlertDescription>
              <strong>Impact:</strong> No contracts = revenue at risk = massive valuation discount.
            </AlertDescription>
          </Alert>
        )}
      </Card>
      
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Customer Retention</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Is your annual customer churn below 10%?
        </p>
        <RadioGroup 
          value={answers.churn} 
          onValueChange={(value) => {
            setAnswers({...answers, churn: value});
            updateCategory();
          }}
        >
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="churn-yes" />
              <Label htmlFor="churn-yes">Yes - Less than 10% annual churn</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="churn-no" />
              <Label htmlFor="churn-no">No - Losing 10%+ customers yearly</Label>
            </div>
          </div>
        </RadioGroup>
        {answers.churn === 'no' && (
          <Alert className="mt-4 border-red-500/30 bg-red-500/10">
            <AlertDescription>
              <strong>Impact:</strong> High churn = broken business model. PE will run away.
            </AlertDescription>
          </Alert>
        )}
      </Card>
    </div>
  );
};

const CustomerPage: React.FC<{
  categories: ScorecardCategory[];
  setCategories: (cats: ScorecardCategory[]) => void;
}> = ({ categories, setCategories }) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  const updateCategory = () => {
    let score = 0;
    const details: string[] = [];
    
    if (answers.concentration === 'yes') score += 50;
    else details.push('Customer concentration exceeds 30%');
    
    if (answers.top10 === 'yes') score += 30;
    else details.push('Top 10 customers exceed 50% of revenue');
    
    if (answers.industry === 'yes') score += 20;
    else details.push('Over-concentrated in single industry');
    
    const updated = [...categories];
    updated[2] = { ...updated[2], score, details };
    setCategories(updated);
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-foreground">
        Customer Concentration Kill Zone
      </h2>
      
      <Card className="bg-red-500/10 border-red-500/30 p-6 mb-6">
        <p className="text-red-600 dark:text-red-400 font-semibold mb-2">Deal Killer Alert:</p>
        <p className="text-foreground">
          Customer concentration is the #1 deal killer. If one customer is 30%+ of revenue, 
          PE either walks away or cuts valuation by 30-50%.
        </p>
      </Card>
      
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Largest Customer Risk</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Is your largest customer less than 15% of revenue?
        </p>
        <RadioGroup 
          value={answers.concentration} 
          onValueChange={(value) => {
            setAnswers({...answers, concentration: value});
            updateCategory();
          }}
        >
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="concentration-yes" />
              <Label htmlFor="concentration-yes">Yes - No customer exceeds 15%</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="concentration-no" />
              <Label htmlFor="concentration-no">No - Have customer(s) over 15%</Label>
            </div>
          </div>
        </RadioGroup>
        {answers.concentration === 'no' && (
          <Alert className="mt-4 border-red-500/30 bg-red-500/10">
            <AlertDescription>
              <strong>Impact:</strong> Customer at 30% = -$1M valuation. At 50% = deal dead.
            </AlertDescription>
          </Alert>
        )}
      </Card>
      
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Top 10 Customer Spread</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Do your top 10 customers represent less than 40% of revenue?
        </p>
        <RadioGroup 
          value={answers.top10} 
          onValueChange={(value) => {
            setAnswers({...answers, top10: value});
            updateCategory();
          }}
        >
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="top10-yes" />
              <Label htmlFor="top10-yes">Yes - Well diversified beyond top 10</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="top10-no" />
              <Label htmlFor="top10-no">No - Top 10 exceed 40% of revenue</Label>
            </div>
          </div>
        </RadioGroup>
      </Card>
      
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Industry Diversification</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Are you diversified across 3+ industries/verticals?
        </p>
        <RadioGroup 
          value={answers.industry} 
          onValueChange={(value) => {
            setAnswers({...answers, industry: value});
            updateCategory();
          }}
        >
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="industry-yes" />
              <Label htmlFor="industry-yes">Yes - Multiple industry exposure</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="industry-no" />
              <Label htmlFor="industry-no">No - Concentrated in 1-2 industries</Label>
            </div>
          </div>
        </RadioGroup>
      </Card>
    </div>
  );
};

const OperationalPage: React.FC<{
  categories: ScorecardCategory[];
  setCategories: (cats: ScorecardCategory[]) => void;
}> = ({ categories, setCategories }) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  const updateCategory = () => {
    let score = 0;
    const details: string[] = [];
    
    if (answers.systems === 'yes') score += 35;
    else details.push('Weak systems and processes');
    
    if (answers.dependency === 'yes') score += 35;
    else details.push('High owner dependency');
    
    if (answers.scalability === 'yes') score += 30;
    else details.push('Limited scalability without major investment');
    
    const updated = [...categories];
    updated[3] = { ...updated[3], score, details };
    setCategories(updated);
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-foreground">
        Operational Excellence Check
      </h2>
      
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Systems & Processes</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Do you have documented processes and modern systems (ERP, CRM)?
        </p>
        <RadioGroup 
          value={answers.systems} 
          onValueChange={(value) => {
            setAnswers({...answers, systems: value});
            updateCategory();
          }}
        >
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="systems-yes" />
              <Label htmlFor="systems-yes">Yes - Modern tech stack, documented processes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="systems-no" />
              <Label htmlFor="systems-no">No - Spreadsheets and tribal knowledge</Label>
            </div>
          </div>
        </RadioGroup>
        {answers.systems === 'no' && (
          <Alert className="mt-4 border-red-500/30 bg-red-500/10">
            <AlertDescription>
              <strong>Impact:</strong> PE will budget $500K-2M for systems. Comes out of your price.
            </AlertDescription>
          </Alert>
        )}
      </Card>
      
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Owner Dependency</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Can the business run for 30 days without you?
        </p>
        <RadioGroup 
          value={answers.dependency} 
          onValueChange={(value) => {
            setAnswers({...answers, dependency: value});
            updateCategory();
          }}
        >
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="dependency-yes" />
              <Label htmlFor="dependency-yes">Yes - Strong management, runs without me</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="dependency-no" />
              <Label htmlFor="dependency-no">No - I'm involved in everything</Label>
            </div>
          </div>
        </RadioGroup>
        {answers.dependency === 'no' && (
          <Alert className="mt-4 border-red-500/30 bg-red-500/10">
            <AlertDescription>
              <strong>Impact:</strong> Owner dependency = 3-year earnout prison. Plus lower multiple.
            </AlertDescription>
          </Alert>
        )}
      </Card>
      
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Scalability</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Can you double revenue with current infrastructure?
        </p>
        <RadioGroup 
          value={answers.scalability} 
          onValueChange={(value) => {
            setAnswers({...answers, scalability: value});
            updateCategory();
          }}
        >
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="scalability-yes" />
              <Label htmlFor="scalability-yes">Yes - Built to scale efficiently</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="scalability-no" />
              <Label htmlFor="scalability-no">No - Would need major investment</Label>
            </div>
          </div>
        </RadioGroup>
      </Card>
    </div>
  );
};

const MarketPage: React.FC<{
  categories: ScorecardCategory[];
  setCategories: (cats: ScorecardCategory[]) => void;
}> = ({ categories, setCategories }) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  const updateCategory = () => {
    let score = 0;
    const details: string[] = [];
    
    if (answers.position === 'yes') score += 40;
    else details.push('Not a market leader');
    
    if (answers.moat === 'yes') score += 30;
    else details.push('No competitive moat');
    
    if (answers.market === 'yes') score += 30;
    else details.push('Declining or saturated market');
    
    const updated = [...categories];
    updated[4] = { ...updated[4], score, details };
    setCategories(updated);
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-foreground">
        Market Position Reality
      </h2>
      
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Market Leadership</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Are you top 3 in your market/niche?
        </p>
        <RadioGroup 
          value={answers.position} 
          onValueChange={(value) => {
            setAnswers({...answers, position: value});
            updateCategory();
          }}
        >
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="position-yes" />
              <Label htmlFor="position-yes">Yes - Clear market leader</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="position-no" />
              <Label htmlFor="position-no">No - Middle of the pack or unknown</Label>
            </div>
          </div>
        </RadioGroup>
      </Card>
      
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Competitive Moat</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Do you have defensible competitive advantages (IP, exclusive contracts, network effects)?
        </p>
        <RadioGroup 
          value={answers.moat} 
          onValueChange={(value) => {
            setAnswers({...answers, moat: value});
            updateCategory();
          }}
        >
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="moat-yes" />
              <Label htmlFor="moat-yes">Yes - Clear competitive advantages</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="moat-no" />
              <Label htmlFor="moat-no">No - Easily replicated business</Label>
            </div>
          </div>
        </RadioGroup>
      </Card>
      
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Market Growth</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Is your market growing 10%+ annually?
        </p>
        <RadioGroup 
          value={answers.market} 
          onValueChange={(value) => {
            setAnswers({...answers, market: value});
            updateCategory();
          }}
        >
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="market-yes" />
              <Label htmlFor="market-yes">Yes - Growing market with tailwinds</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="market-no" />
              <Label htmlFor="market-no">No - Flat or declining market</Label>
            </div>
          </div>
        </RadioGroup>
      </Card>
    </div>
  );
};

const ReportPage: React.FC<{ categories: ScorecardCategory[] }> = ({ categories }) => {
  const { markModuleComplete } = useProgress();
  const navigate = useNavigate();
  
  const totalScore = categories.reduce((acc, cat) => {
    return acc + (cat.score * cat.weight / 100);
  }, 0);
  
  const getMultipleRange = (score: number) => {
    if (score >= 90) return '6-8x';
    if (score >= 70) return '4-6x';
    if (score >= 50) return '3-4x';
    return '2-3x';
  };
  
  const getReadinessLevel = (score: number) => {
    if (score >= 90) return { text: 'Premium Ready', color: 'text-green-500' };
    if (score >= 70) return { text: 'Market Ready', color: 'text-yellow-500' };
    if (score >= 50) return { text: 'Needs Work', color: 'text-orange-500' };
    return { text: 'Not Ready', color: 'text-red-500' };
  };
  
  const readiness = getReadinessLevel(totalScore);
  const totalImpact = categories.reduce((acc, cat) => {
    if (cat.score < 100) {
      const impact = parseFloat(cat.maxImpact.replace('-$', '').replace('M', ''));
      return acc + (impact * (100 - cat.score) / 100);
    }
    return acc;
  }, 0);

  const handleCompleteModule = async () => {
    await markModuleComplete('Business Scorecard', 3);
    const nextPath = getNextModulePath('Business Scorecard');
    if (nextPath) {
      navigate(nextPath);
    }
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-foreground">
        Your PE Readiness Score
      </h2>
      
      <Card className={`p-6 ${
        totalScore >= 70 ? 'bg-green-500/10 border-green-500/30' : 
        totalScore >= 50 ? 'bg-yellow-500/10 border-yellow-500/30' : 
        'bg-red-500/10 border-red-500/30'
      }`}>
        <div className="text-center">
          <p className="text-5xl font-bold mb-2">{totalScore.toFixed(0)}%</p>
          <p className={`text-2xl font-semibold ${readiness.color}`}>
            {readiness.text}
          </p>
          <p className="text-lg mt-2 text-muted-foreground">
            Expected Multiple: {getMultipleRange(totalScore)} EBITDA
          </p>
        </div>
      </Card>
      
      <Card className="p-6 bg-gradient-to-r from-red-500/10 to-orange-500/10">
        <h3 className="text-xl font-semibold mb-3">Valuation Impact</h3>
        <p className="text-3xl font-bold text-red-500">
          -${totalImpact.toFixed(1)}M
        </p>
        <p className="text-sm text-muted-foreground">
          Lost value from current weaknesses
        </p>
      </Card>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Category Breakdown</h3>
        {categories.map((cat, i) => (
          <Card key={i} className="p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">{cat.name}</span>
              <span className={`font-bold ${
                cat.score >= 80 ? 'text-green-500' : 
                cat.score >= 60 ? 'text-yellow-500' : 
                'text-red-500'
              }`}>
                {cat.score}%
              </span>
            </div>
            <Progress value={cat.score} className="h-2 mb-2" />
            {cat.details.length > 0 && (
              <div className="mt-2">
                {cat.details.map((detail, j) => (
                  <p key={j} className="text-sm text-red-500 flex items-center">
                    <XCircle className="w-3 h-3 mr-1" />
                    {detail}
                  </p>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
      
      <Card className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
        <h3 className="text-xl font-semibold mb-4">Priority Actions to Increase Value</h3>
        <div className="space-y-3">
          {categories
            .filter(cat => cat.score < 80)
            .sort((a, b) => (a.score * a.weight) - (b.score * b.weight))
            .slice(0, 5)
            .map((cat, i) => (
              <div key={i} className="flex items-start space-x-2">
                <span className="font-bold text-blue-500">{i + 1}.</span>
                <div>
                  <p className="font-semibold">{cat.name} Improvements</p>
                  <p className="text-sm text-muted-foreground">
                    Current: {cat.score}% → Target: 80%+ | Impact: +{cat.maxImpact.replace('-', '')}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </Card>
      
      <Alert>
        <DollarSign className="h-4 w-4" />
        <AlertDescription>
          <strong>Bottom Line:</strong> Every 10% improvement in your score adds approximately 
          $500K-1M to your exit value on a $2M EBITDA business. Fix the red flags before going to market.
        </AlertDescription>
      </Alert>

      <div className="flex justify-center pt-6">
        <Button onClick={handleCompleteModule} className="bg-primary hover:bg-primary/90">
          Complete Assessment & Continue
        </Button>
      </div>
    </div>
  );
};

export default BusinessScorecard;
