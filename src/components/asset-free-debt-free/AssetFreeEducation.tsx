
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, ChevronLeft, Home, Car, Truck, DollarSign, Building, Anchor } from 'lucide-react';

export const AssetFreeEducation: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  
  const pages = [
    {
      title: "What PE Buyers Actually Buy",
      content: <IntroPage />
    },
    {
      title: "Core vs Non-Core Assets",
      content: <CoreAssetsPage />
    },
    {
      title: "The Building Problem",
      content: <BuildingExplanation />
    },
    {
      title: "Cash & Debt at Closing",
      content: <CashDebtExplanation />
    },
    {
      title: "Your Clean-Up Checklist",
      content: <ChecklistPage />
    }
  ];
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <Progress value={(currentPage + 1) / pages.length * 100} className="h-2" />
        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
          <span>Step {currentPage + 1} of {pages.length}</span>
          <span>{pages[currentPage].title}</span>
        </div>
      </div>
      
      {/* Content */}
      <Card className="p-8 min-h-[500px]">
        {pages[currentPage].content}
      </Card>
      
      {/* Navigation */}
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

// Page 1: Introduction
const IntroPage: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold">Private Equity Wants a Clean Business</h2>
    
    <div className="text-lg space-y-4 text-muted-foreground">
      <p>
        When PE firms say they want an <strong className="text-foreground">"asset free, debt free, cash free"</strong> transaction, 
        most business owners get confused. Let's break this down in plain English.
      </p>
      
      <div className="bg-accent/20 p-6 rounded-lg border-l-4 border-accent">
        <p className="font-semibold mb-2 text-foreground">Here's the simple truth:</p>
        <p className="text-muted-foreground">
          PE buyers want to purchase your <em>operating business</em> - the machine that makes money. 
          They don't want your personal stuff, your debt, or complications.
        </p>
      </div>
      
      <p>
        Think of it like selling a restaurant. The buyer wants the kitchen equipment, 
        the recipes, and the customer list. They don't want your personal car parked 
        out back or the loan you took to renovate your house.
      </p>
    </div>
    
    <div className="mt-8 grid grid-cols-3 gap-4">
      <div className="text-center p-4 bg-success/10 border border-success/20 rounded-lg">
        <DollarSign className="w-12 h-12 text-success mx-auto mb-2" />
        <p className="font-semibold">Cash Free</p>
        <p className="text-sm text-muted-foreground">Explained on page 4</p>
      </div>
      <div className="text-center p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
        <Building className="w-12 h-12 text-destructive mx-auto mb-2" />
        <p className="font-semibold">Asset Free</p>
        <p className="text-sm text-muted-foreground">Core assets only</p>
      </div>
      <div className="text-center p-4 bg-warning/10 border border-warning/20 rounded-lg">
        <DollarSign className="w-12 h-12 text-warning mx-auto mb-2" />
        <p className="font-semibold">Debt Free</p>
        <p className="text-sm text-muted-foreground">Clean balance sheet</p>
      </div>
    </div>
  </div>
);

// Page 2: Core vs Non-Core Assets
const CoreAssetsPage: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  
  const assets = [
    { id: 'truck', icon: Truck, label: 'Delivery Trucks', isCore: true, reason: 'Delivers your product to customers' },
    { id: 'bmw', icon: Car, label: "Owner's BMW", isCore: false, reason: 'Personal vehicle, not for operations' },
    { id: 'computers', icon: Home, label: 'Office Computers', isCore: true, reason: 'Employees need these to work' },
    { id: 'boat', icon: Anchor, label: 'Fishing Boat', isCore: false, reason: 'Entertainment, not revenue generating' },
    { id: 'warehouse', icon: Building, label: 'Warehouse Equipment', isCore: true, reason: 'Required for daily operations' },
    { id: 'condo', icon: Building, label: 'Beach Condo', isCore: false, reason: 'Personal property in company name' }
  ];
  
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Quiz: Core or Not Core?</h2>
      
      <p className="text-lg text-muted-foreground">
        Click on the assets that are <strong className="text-foreground">CORE</strong> to running the business:
      </p>
      
      <div className="grid grid-cols-2 gap-4">
        {assets.map(asset => {
          const Icon = asset.icon;
          const isSelected = selectedItems.includes(asset.id);
          const showResult = isSelected;
          
          return (
            <button
              key={asset.id}
              onClick={() => setSelectedItems([...selectedItems, asset.id])}
              className={`p-4 rounded-lg border-2 transition-all ${
                showResult
                  ? asset.isCore
                    ? 'border-success bg-success/10'
                    : 'border-destructive bg-destructive/10'
                  : 'border-border hover:border-muted-foreground bg-card'
              }`}
            >
              <Icon className={`w-12 h-12 mx-auto mb-2 ${
                showResult
                  ? asset.isCore ? 'text-success' : 'text-destructive'
                  : 'text-muted-foreground'
              }`} />
              <p className="font-semibold">{asset.label}</p>
              {showResult && (
                <p className="text-sm mt-2 text-muted-foreground">{asset.reason}</p>
              )}
            </button>
          );
        })}
      </div>
      
      <Card className="p-4">
        <p className="font-semibold mb-2">Remember:</p>
        <p className="text-sm text-muted-foreground">
          Core assets are things the business NEEDS to operate and generate revenue. 
          If it's personal, recreational, or the business could easily rent/lease it instead, it's NOT core.
        </p>
      </Card>
    </div>
  );
};

// Page 3: The Building Problem
const BuildingExplanation: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold">Why Your Building Isn't Core</h2>
    
    <div className="bg-warning/20 p-6 rounded-lg border-l-4 border-warning">
      <p className="text-lg font-semibold mb-2">
        "But I've owned this building for 20 years!"
      </p>
      <p className="text-muted-foreground">
        We get it. But here's why PE buyers don't want to buy your real estate...
      </p>
    </div>
    
    <div className="space-y-4">
      <div className="flex items-start space-x-4">
        <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">1</div>
        <div>
          <p className="font-semibold">They're not in the real estate business</p>
          <p className="text-muted-foreground">PE firms buy operating companies, not property management companies.</p>
        </div>
      </div>
      
      <div className="flex items-start space-x-4">
        <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">2</div>
        <div>
          <p className="font-semibold">It ties up capital</p>
          <p className="text-muted-foreground">They'd rather use that money to grow the business, not own a building.</p>
        </div>
      </div>
      
      <div className="flex items-start space-x-4">
        <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">3</div>
        <div>
          <p className="font-semibold">Flexibility matters</p>
          <p className="text-muted-foreground">What if they want to move locations or expand? Leasing gives options.</p>
        </div>
      </div>
    </div>
    
    <Card className="bg-success/10 border-success/20 p-6">
      <p className="font-semibold mb-2">The Solution: Sell-Leaseback</p>
      <p className="text-muted-foreground">
        You keep the building personally and lease it back to the company at market rates. 
        You get rental income, they get a clean transaction. Everyone wins.
      </p>
    </Card>
  </div>
);

// Page 4: Cash and Debt Explanation
const CashDebtExplanation: React.FC = () => {
  const [showExample, setShowExample] = useState(false);
  
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Cash & Debt at Closing</h2>
      
      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6 bg-success/10 border border-success/20">
          <DollarSign className="w-12 h-12 text-success mb-4" />
          <h3 className="text-xl font-semibold mb-2">Cash Free</h3>
          <p className="text-muted-foreground mb-4">
            Any cash in the business bank accounts at closing goes to YOU, the seller.
          </p>
          <p className="text-sm text-muted-foreground">
            If you have $300K in the bank, you get that $300K on top of the purchase price. 
            The buyer starts with their own working capital.
          </p>
        </Card>
        
        <Card className="p-6 bg-destructive/10 border border-destructive/20">
          <DollarSign className="w-12 h-12 text-destructive mb-4" />
          <h3 className="text-xl font-semibold mb-2">Debt Free</h3>
          <p className="text-muted-foreground mb-4">
            All company debt must be paid off at or before closing.
          </p>
          <p className="text-sm text-muted-foreground">
            SBA loans, equipment financing, lines of credit - all gone. 
            This usually comes out of the purchase price at closing.
          </p>
        </Card>
      </div>
      
      <Button 
        onClick={() => setShowExample(!showExample)}
        variant="outline"
        className="w-full"
      >
        {showExample ? 'Hide' : 'Show'} Real Example
      </Button>
      
      {showExample && (
        <Card className="p-6">
          <h4 className="font-semibold mb-4">Example: $10M Purchase Price</h4>
          <div className="space-y-2 font-mono text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Purchase Price:</span>
              <span>$10,000,000</span>
            </div>
            <div className="flex justify-between text-destructive">
              <span>Less: SBA Loan Payoff:</span>
              <span>($500,000)</span>
            </div>
            <div className="flex justify-between text-destructive">
              <span>Less: Equipment Loans:</span>
              <span>($200,000)</span>
            </div>
            <div className="flex justify-between text-success">
              <span>Plus: Cash in Bank:</span>
              <span>$300,000</span>
            </div>
            <div className="flex justify-between font-bold pt-2 border-t border-border">
              <span>You Receive:</span>
              <span>$9,600,000</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

// Page 5: Checklist
const ChecklistPage: React.FC = () => {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  
  const checklistItems = [
    { id: 'vehicles', label: 'List all vehicles - separate work trucks from personal cars' },
    { id: 'realestate', label: 'Identify any real estate - plan for lease-back if needed' },
    { id: 'equipment', label: 'Review equipment - is it all used for operations?' },
    { id: 'boats', label: 'Remove recreational assets (boats, RVs, etc.)' },
    { id: 'art', label: 'Take personal items home (art, collections)' },
    { id: 'debt', label: 'Get current payoff amounts for all loans' },
    { id: 'cash', label: 'Understand your working capital needs' }
  ];
  
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Your Clean-Up Checklist</h2>
      
      <p className="text-lg text-muted-foreground">
        Before you talk to PE buyers, clean up your business:
      </p>
      
      <div className="space-y-3">
        {checklistItems.map(item => (
          <label
            key={item.id}
            className="flex items-center p-4 rounded-lg border border-border hover:bg-accent cursor-pointer"
          >
            <input
              type="checkbox"
              checked={checkedItems.includes(item.id)}
              onChange={(e) => {
                if (e.target.checked) {
                  setCheckedItems([...checkedItems, item.id]);
                } else {
                  setCheckedItems(checkedItems.filter(id => id !== item.id));
                }
              }}
              className="w-5 h-5 mr-4"
            />
            <span className={checkedItems.includes(item.id) ? 'line-through text-muted-foreground' : ''}>
              {item.label}
            </span>
          </label>
        ))}
      </div>
      
      <Card className="bg-accent/20 border-accent/20 p-6">
        <p className="font-semibold mb-2">Pro Tip:</p>
        <p className="text-muted-foreground">
          Start this clean-up process at least 12 months before you plan to sell. 
          Some changes (like removing assets) can affect your taxes and financial statements.
        </p>
      </Card>
      
      {checkedItems.length === checklistItems.length && (
        <Card className="bg-success/10 border-success/20 p-6 text-center">
          <p className="text-2xl font-bold text-success mb-2">🎉 You're Ready!</p>
          <p className="text-muted-foreground">Your business is starting to look attractive to PE buyers.</p>
        </Card>
      )}
    </div>
  );
};
