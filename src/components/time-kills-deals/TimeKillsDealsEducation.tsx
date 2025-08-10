
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, ChevronLeft, Clock, TrendingDown, Phone, AlertTriangle, CheckCircle } from 'lucide-react';

export const TimeKillsDealsEducation: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  
  const pages = [
    {
      title: "Why Time Is Your Enemy",
      content: <IntroPage />
    },
    {
      title: "The Pager Store Disaster",
      content: <PagerStoryPage />
    },
    {
      title: "Market Timing Risk",
      content: <MarketTimingPage />
    },
    {
      title: "Deal Fatigue Is Real",
      content: <DealFatiguePage />
    },
    {
      title: "How Preparation Saves Deals",
      content: <PreparationPage />
    }
  ];
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <Progress value={(currentPage + 1) / pages.length * 100} className="h-2" />
        <div className="flex justify-between mt-2 text-sm text-gray-400">
          <span>Step {currentPage + 1} of {pages.length}</span>
          <span>{pages[currentPage].title}</span>
        </div>
      </div>
      
      {/* Content */}
      <Card className="p-8 min-h-[500px] bg-slate-800 border-gray-700">
        {pages[currentPage].content}
      </Card>
      
      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
          className="border-gray-600 text-gray-300 hover:bg-slate-700"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        
        <Button
          onClick={() => setCurrentPage(Math.min(pages.length - 1, currentPage + 1))}
          disabled={currentPage === pages.length - 1}
          className="bg-blue-600 hover:bg-blue-700 text-white"
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
    <h2 className="text-3xl font-bold text-white flex items-center">
      <Clock className="w-10 h-10 mr-3 text-red-400" />
      Time Kills Deals
    </h2>
    
    <div className="text-lg space-y-4 text-gray-300">
      <p>
        In M&A, there's a saying that every experienced dealmaker knows by heart: 
        <strong className="text-red-400"> "Time kills deals."</strong>
      </p>
      
      <div className="bg-red-900/50 p-6 rounded-lg border-l-4 border-red-500">
        <p className="font-semibold mb-2 text-white">Two Ways Time Destroys Value:</p>
        <ol className="list-decimal list-inside space-y-2 text-gray-300">
          <li><strong>Waiting too long to sell</strong> - Your industry changes, competition emerges, technology shifts</li>
          <li><strong>Taking too long to close</strong> - Deal fatigue, changing conditions, buyers get cold feet</li>
        </ol>
      </div>
      
      <p>
        This program exists because we've seen too many great businesses lose millions 
        by not understanding these time dynamics. Let's learn from their mistakes.
      </p>
    </div>
    
    <div className="grid grid-cols-2 gap-4 mt-8">
      <Card className="p-4 bg-yellow-900/30 border border-yellow-700">
        <TrendingDown className="w-8 h-8 text-yellow-400 mb-2" />
        <p className="font-semibold text-white">Market Windows Close</p>
        <p className="text-sm text-gray-400">Industries can change overnight</p>
      </Card>
      <Card className="p-4 bg-blue-900/30 border border-blue-700">
        <Clock className="w-8 h-8 text-blue-400 mb-2" />
        <p className="font-semibold text-white">Buyers Don't Wait</p>
        <p className="text-sm text-gray-400">They have other options</p>
      </Card>
    </div>
    
    <div className="mt-8">
      <Card className="bg-slate-800 border-slate-700 p-6">
        <div className="flex items-start space-x-4">
          <div className="text-4xl">🥚</div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-white mb-3">
              The Egg Paradox of M&A
            </h3>
            <p className="text-gray-300 mb-4">
              A deal is like an egg - incredibly strong yet devastatingly fragile.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-green-900/20 border border-green-800 rounded-lg p-4">
                <p className="text-green-400 font-semibold mb-2">When Nurtured:</p>
                <p className="text-gray-400 text-sm">
                  Can withstand months of pressure, negotiations, and due diligence. 
                  A well-cared-for deal grows stronger over time.
                </p>
              </div>
              
              <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
                <p className="text-red-400 font-semibold mb-2">When Attacked:</p>
                <p className="text-gray-400 text-sm">
                  One aggressive move, one surprise, one broken promise - 
                  and it shatters instantly. No putting it back together.
                </p>
              </div>
            </div>
            
            <p className="text-gray-300 mt-4 text-sm italic">
              The strongest deals require the gentlest hands.
            </p>
          </div>
        </div>
      </Card>
    </div>
  </div>
);

// Page 2: The Pager Store Story
const PagerStoryPage: React.FC = () => {
  const [showReveal, setShowReveal] = useState(false);
  
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">The $50 Million Mistake</h2>
      
      <div className="bg-slate-700 border border-gray-600 p-6 rounded-lg">
        <p className="text-lg mb-4 text-gray-300">
          <strong className="text-white">1998:</strong> A chain of pager stores in Texas. 
          42 locations. $8M in EBITDA. Life is good.
        </p>
        
        <div className="space-y-3 text-gray-300">
          <p>📟 Pagers are everywhere - doctors, executives, teenagers</p>
          <p>💰 PE firm offers $50M (6.25x multiple)</p>
          <p>🤔 Owner thinks: "Business is growing. Let's wait a year for a better price."</p>
        </div>
      </div>
      
      <Button 
        onClick={() => setShowReveal(true)} 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        disabled={showReveal}
      >
        What Happened Next?
      </Button>
      
      {showReveal && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-red-900/50 p-6 rounded-lg border-l-4 border-red-500">
            <p className="text-lg mb-4 text-white">
              <strong>1999:</strong> Cell phones explode in popularity.
            </p>
            
            <div className="space-y-3 text-gray-300">
              <p>📱 Nokia sells 78 million phones</p>
              <p>📉 Pager sales drop 40% in 6 months</p>
              <p>💸 PE firms won't even return calls</p>
              <p>🚫 Business sells for $8M in 2001 (asset value only)</p>
            </div>
          </div>
          
          <Card className="p-4 bg-yellow-900/30 border border-yellow-700">
            <AlertTriangle className="w-6 h-6 text-yellow-400 mb-2" />
            <p className="font-semibold text-white">The Lesson:</p>
            <p className="text-sm text-gray-300">
              Waiting for "just a little more" cost this owner $42 million. 
              Technology changed. The window closed. Game over.
            </p>
          </Card>
        </div>
      )}
    </div>
  );
};

// Page 3: Market Timing Risk
const MarketTimingPage: React.FC = () => {
  const examples = [
    {
      industry: "Video Rental",
      peak: "2004: Blockbuster worth $5B",
      crash: "2010: Bankruptcy. Netflix won.",
      icon: "📼"
    },
    {
      industry: "Travel Agencies", 
      peak: "1999: $100B industry",
      crash: "2005: Expedia/Kayak killed 80%",
      icon: "✈️"
    },
    {
      industry: "Print Newspapers",
      peak: "2000: Record valuations", 
      crash: "2010: Lost 90% of value",
      icon: "📰"
    },
    {
      industry: "Taxi Medallions",
      peak: "2013: NYC medallion = $1.3M",
      crash: "2020: Worth $150K. Uber won.",
      icon: "🚕"
    }
  ];
  
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">Industries Can Die Overnight</h2>
      
      <p className="text-lg text-gray-300">
        These business owners all thought they had more time:
      </p>
      
      <div className="space-y-4">
        {examples.map((example, idx) => (
          <Card key={idx} className="p-4 bg-slate-700 border border-gray-600 hover:bg-slate-600 transition-colors">
            <div className="flex items-start space-x-4">
              <span className="text-3xl">{example.icon}</span>
              <div className="flex-1">
                <p className="font-semibold text-lg text-white">{example.industry}</p>
                <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                  <p className="text-green-400">✅ {example.peak}</p>
                  <p className="text-red-400">❌ {example.crash}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="bg-blue-900/50 border border-blue-700 p-6 rounded-lg">
        <p className="font-semibold mb-2 text-white">The Pattern:</p>
        <p className="text-gray-300">
          Disruption happens slowly, then suddenly. By the time you see it coming, 
          buyers have already disappeared. The best time to sell is when you don't have to.
        </p>
      </div>
    </div>
  );
};

// Page 4: Deal Fatigue
const DealFatiguePage: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState(0);
  
  const timeline = [
    { month: 0, event: "LOI Signed", mood: "😊", buyer: 100, seller: 100 },
    { month: 1, event: "Due diligence starts", mood: "😐", buyer: 95, seller: 95 },
    { month: 3, event: "Still requesting documents", mood: "😕", buyer: 85, seller: 80 },
    { month: 5, event: "Re-trading begins", mood: "😟", buyer: 75, seller: 60 },
    { month: 7, event: "Deal fatigue sets in", mood: "😡", buyer: 60, seller: 40 },
    { month: 9, event: "Deal dies", mood: "💀", buyer: 0, seller: 0 }
  ];
  
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">Why Long Deals Die</h2>
      
      <p className="text-lg text-gray-300">
        Watch what happens to enthusiasm over time in a poorly prepared deal:
      </p>
      
      <div className="bg-slate-700 border border-gray-600 p-6 rounded-lg">
        <div className="flex justify-between mb-4">
          {timeline.map((point, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedMonth(idx)}
              className={`text-center px-2 py-1 rounded transition-colors ${
                idx === selectedMonth ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-slate-600'
              }`}
            >
              <p className="text-2xl">{point.mood}</p>
              <p className="text-xs mt-1">Month {point.month}</p>
            </button>
          ))}
        </div>
        
        <div className="space-y-4">
          <div>
            <p className="font-semibold mb-2 text-white">Event: {timeline[selectedMonth].event}</p>
          </div>
          
          <div className="space-y-2">
            <div>
              <p className="text-sm text-gray-400">Buyer Enthusiasm</p>
              <div className="w-full bg-gray-600 rounded-full h-4">
                <div 
                  className="bg-green-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${timeline[selectedMonth].buyer}%` }}
                />
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-400">Seller Enthusiasm</p>
              <div className="w-full bg-gray-600 rounded-full h-4">
                <div 
                  className="bg-blue-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${timeline[selectedMonth].seller}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 bg-red-900/30 border border-red-700">
          <p className="font-semibold mb-2 text-white">What Kills Enthusiasm:</p>
          <ul className="text-sm space-y-1 text-gray-300">
            <li>• Endless document requests</li>
            <li>• Surprise findings</li>
            <li>• Re-negotiation attempts</li>
            <li>• Key employee departures</li>
            <li>• Market changes</li>
          </ul>
        </Card>
        
        <Card className="p-4 bg-green-900/30 border border-green-700">
          <p className="font-semibold mb-2 text-white">What Preserves It:</p>
          <ul className="text-sm space-y-1 text-gray-300">
            <li>• Clean data room ready</li>
            <li>• No surprises</li>
            <li>• Fast responses</li>
            <li>• Aligned expectations</li>
            <li>• Professional advisors</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

// Page 5: How Preparation Saves Deals
const PreparationPage: React.FC = () => {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  
  const benefits = [
    {
      id: 'speed',
      title: 'Close 3-4 Months Faster',
      description: 'Prepared sellers close in 90-120 days vs 180-270 days',
      icon: '⚡'
    },
    {
      id: 'price',
      title: 'Maintain Your Price',
      description: 'No re-trading when there are no surprises',
      icon: '💰'
    },
    {
      id: 'certainty',
      title: 'Higher Close Rate',
      description: '90% of prepared deals close vs 50% unprepared',
      icon: '✅'
    },
    {
      id: 'stress',
      title: 'Less Stress',
      description: 'You know what\'s coming and you\'re ready',
      icon: '😌'
    }
  ];
  
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">Preparation = Speed = Success</h2>
      
      <p className="text-lg text-gray-300">
        This 4-week program turns a 9-month nightmare into a 3-month sprint:
      </p>
      
      <div className="grid grid-cols-2 gap-4">
        {benefits.map(benefit => (
          <Card 
            key={benefit.id}
            className={`p-4 cursor-pointer transition-all border ${
              checkedItems.includes(benefit.id) 
                ? 'bg-green-900/30 border-green-500' 
                : 'bg-slate-700 border-gray-600 hover:bg-slate-600'
            }`}
            onClick={() => {
              if (checkedItems.includes(benefit.id)) {
                setCheckedItems(checkedItems.filter(id => id !== benefit.id));
              } else {
                setCheckedItems([...checkedItems, benefit.id]);
              }
            }}
          >
            <div className="flex items-start space-x-3">
              <span className="text-3xl">{benefit.icon}</span>
              <div>
                <p className="font-semibold text-white">{benefit.title}</p>
                <p className="text-sm text-gray-300 mt-1">{benefit.description}</p>
              </div>
            </div>
            {checkedItems.includes(benefit.id) && (
              <CheckCircle className="w-6 h-6 text-green-400 mt-2" />
            )}
          </Card>
        ))}
      </div>
      
      <div className="bg-gradient-to-r from-blue-900/30 to-green-900/30 border border-gray-600 p-6 rounded-lg">
        <h3 className="font-bold text-xl mb-4 text-white">The Bottom Line:</h3>
        
        <div className="space-y-3 text-gray-300">
          <p>
            <strong className="text-white">Unprepared sellers:</strong> 6-9 months of hell, 50% close rate, 
            price drops 10-20%, everyone exhausted
          </p>
          
          <p>
            <strong className="text-white">Prepared sellers:</strong> 3-4 months smooth sailing, 90% close rate, 
            maintain price, celebrate at closing
          </p>
        </div>
      </div>
      
      <Card className="p-6 bg-yellow-900/30 border border-yellow-700">
        <p className="text-center text-lg text-gray-300">
          <strong className="text-white">Remember:</strong> Every week you spend preparing 
          saves a month in the deal process.
        </p>
      </Card>
    </div>
  );
};
