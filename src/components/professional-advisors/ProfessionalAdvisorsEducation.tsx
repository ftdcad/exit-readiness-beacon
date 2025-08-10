
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, ChevronLeft, Users, DollarSign, AlertTriangle, CheckCircle } from 'lucide-react';

export const ProfessionalAdvisorsEducation: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  
  const pages = [
    {
      title: "Don't Use Your Cousin Larry",
      content: <IntroPage />
    },
    {
      title: "Investment Banker - Your Quarterback",
      content: <BankerPage />
    },
    {
      title: "M&A Attorney - Not Your Guy",
      content: <AttorneyPage />
    },
    {
      title: "QoE Accountant - Find the Money",
      content: <AccountantPage />
    },
    {
      title: "Managing the Costs",
      content: <CostPage />
    }
  ];
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Progress value={(currentPage + 1) / pages.length * 100} className="h-2" />
        <div className="flex justify-between mt-2 text-sm text-gray-400">
          <span>Step {currentPage + 1} of {pages.length}</span>
          <span>{pages[currentPage].title}</span>
        </div>
      </div>
      
      <Card className="bg-slate-800 border-slate-700 p-8 min-h-[500px]">
        {pages[currentPage].content}
      </Card>
      
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
          className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        
        <Button
          onClick={() => setCurrentPage(Math.min(pages.length - 1, currentPage + 1))}
          disabled={currentPage === pages.length - 1}
          className="bg-blue-600 hover:bg-blue-700"
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
    <h2 className="text-3xl font-bold text-white">Your Cousin Larry Can't Do This Deal</h2>
    
    <div className="bg-red-900/20 border-red-800 p-6 rounded-lg">
      <p className="text-red-400 font-semibold mb-2">Reality Check:</p>
      <p className="text-gray-300">
        PE buyers have teams doing 20+ deals a year. You'll do one. 
        Using your regular advisors is like bringing a knife to a gunfight.
      </p>
    </div>
    
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-white">Your PE Deal Team:</h3>
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-slate-700 p-4 text-center">
          <div className="text-2xl mb-2">🎯</div>
          <p className="font-semibold text-white">Investment Banker</p>
          <p className="text-sm text-gray-400">Runs the process</p>
        </Card>
        <Card className="bg-slate-700 p-4 text-center">
          <div className="text-2xl mb-2">⚖️</div>
          <p className="font-semibold text-white">M&A Attorney</p>
          <p className="text-sm text-gray-400">Protects you</p>
        </Card>
        <Card className="bg-slate-700 p-4 text-center">
          <div className="text-2xl mb-2">📊</div>
          <p className="font-semibold text-white">QoE Accountant</p>
          <p className="text-sm text-gray-400">Proves value</p>
        </Card>
      </div>
    </div>
  </div>
);

const BankerPage: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold text-white">Investment Banker: Your Quarterback</h2>
    
    <Card className="bg-green-900/20 border-green-800 p-6">
      <p className="text-green-400 font-semibold mb-2">What They Do:</p>
      <ul className="space-y-2 text-gray-300">
        <li>• Create competitive auction (adds 15-30% to price)</li>
        <li>• Know 50+ PE funds personally</li>
        <li>• Manage entire process start to finish</li>
      </ul>
    </Card>
    
    <Card className="bg-slate-700 p-6">
      <h3 className="text-white font-semibold mb-3">How They Get Paid:</h3>
      <div className="space-y-2 text-gray-300">
        <p>• Retainer: $25-100K monthly</p>
        <p>• Success fee: 2-6% at closing</p>
        <p>• Modified Lehman Formula common</p>
        <p className="text-yellow-400 mt-3">⚠️ Watch for tail periods!</p>
      </div>
    </Card>
    
    <Card className="bg-red-900/20 border-red-800 p-4">
      <p className="text-red-400 font-semibold">Red Flag:</p>
      <p className="text-gray-300">Can't name 10 PE deals in last 2 years = No real relationships</p>
    </Card>
  </div>
);

const AttorneyPage: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold text-white">M&A Attorney: Specialist Required</h2>
    
    <div className="grid grid-cols-2 gap-4">
      <Card className="bg-red-900/20 border-red-800 p-4">
        <h3 className="text-red-400 font-semibold mb-2">❌ Your Business Attorney</h3>
        <ul className="text-sm space-y-1 text-gray-300">
          <li>• Takes 300 hours for 100-hour job</li>
          <li>• Misses PE protections</li>
          <li>• Costs you $2M in bad terms</li>
        </ul>
      </Card>
      
      <Card className="bg-green-900/20 border-green-800 p-4">
        <h3 className="text-green-400 font-semibold mb-2">✅ M&A Specialist</h3>
        <ul className="text-sm space-y-1 text-gray-300">
          <li>• Done 50+ PE deals</li>
          <li>• Knows every PE trick</li>
          <li>• Same cost, better terms</li>
        </ul>
      </Card>
    </div>
    
    <Card className="bg-yellow-900/20 border-yellow-800 p-6">
      <h3 className="text-yellow-400 font-semibold mb-2">Control Legal Bills:</h3>
      <ul className="space-y-2 text-gray-300 text-sm">
        <li>• 15-minute cap on unscheduled calls</li>
        <li>• Always send agenda first</li>
        <li>• Batch your questions</li>
        <li>• Decide internally before calling</li>
      </ul>
    </Card>
  </div>
);

const AccountantPage: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold text-white">QoE: Find Hidden EBITDA</h2>
    
    <Card className="bg-purple-900/20 border-purple-800 p-6">
      <div className="text-center mb-4">
        <p className="text-gray-400">Your CPA says:</p>
        <p className="text-3xl font-mono text-white">$3M EBITDA</p>
      </div>
      <div className="text-center">
        <p className="text-purple-400">QoE finds:</p>
        <p className="text-3xl font-mono text-white">$4.2M EBITDA</p>
      </div>
      <p className="text-green-400 text-center mt-4">= $6M more at 5x multiple</p>
    </Card>
    
    <Card className="bg-slate-700 p-6">
      <h3 className="text-white font-semibold mb-3">What QoE Finds:</h3>
      <ul className="space-y-2 text-gray-300 text-sm">
        <li>• Owner excess compensation</li>
        <li>• One-time expenses</li>
        <li>• Personal expenses in P&L</li>
        <li>• Related party transactions</li>
      </ul>
      <p className="text-yellow-400 mt-4">Cost: $30-100K | Return: Often 50x+</p>
    </Card>
  </div>
);

const CostPage: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold text-white">Yes, It's Expensive. It's Worth It.</h2>
    
    <Card className="bg-blue-900/20 border-blue-800 p-6">
      <h3 className="text-blue-400 font-semibold mb-3">Typical All-In Costs:</h3>
      <div className="space-y-2 text-gray-300">
        <div className="flex justify-between">
          <span>$10M Deal:</span>
          <span className="font-mono">$500-700K</span>
        </div>
        <div className="flex justify-between">
          <span>$50M Deal:</span>
          <span className="font-mono">$1.5-2.5M</span>
        </div>
      </div>
    </Card>
    
    <Card className="bg-green-900/20 border-green-800 p-6">
      <p className="text-green-400 font-semibold mb-2">The Math:</p>
      <p className="text-gray-300">
        Good advisors typically add 15-30% to your price.
        On a $20M deal, that's $3-6M extra.
        Cost: $800K. Net gain: $2.2-5.2M.
      </p>
      <p className="text-white font-semibold mt-3">ROI: 3-7x</p>
    </Card>
    
    <Card className="bg-yellow-900/20 border-yellow-800 p-4">
      <p className="text-yellow-400 font-semibold">Remember:</p>
      <p className="text-gray-300">
        Only the banker's success fee waits for closing. 
        Lawyers and QoE get paid regardless. Budget accordingly.
      </p>
    </Card>
  </div>
);

export default ProfessionalAdvisorsEducation;
