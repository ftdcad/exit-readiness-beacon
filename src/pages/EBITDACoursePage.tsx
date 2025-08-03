import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, ArrowRight, Calculator, TrendingUp, DollarSign, AlertCircle, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EBITDACoursePage() {
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  
  const sections = [
    { id: 'basics', title: 'EBITDA Basics', duration: '5 min' },
    { id: 'calculation', title: 'How PE Firms Calculate It', duration: '8 min' },
    { id: 'addbacks', title: 'The Power of Add-Backs', duration: '7 min' },
    { id: 'impact', title: 'Valuation Impact', duration: '5 min' }
  ];

  const progressPercentage = (completedSections.length / sections.length) * 100;
  const isCompleted = completedSections.length === sections.length;

  const markComplete = (sectionId: string) => {
    if (!completedSections.includes(sectionId)) {
      setCompletedSections([...completedSections, sectionId]);
    }
  };

  return (
    <div className="space-y-8">
      {/* Module Header */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardHeader>
          <div className="flex items-center gap-2 text-primary mb-2">
            <Calculator className="h-6 w-6" />
            <span className="text-sm font-medium">Week 1 • Module 2</span>
          </div>
          <CardTitle className="text-2xl">EBITDA Mastery Course</CardTitle>
          <CardDescription className="text-lg">
            Understand how EBITDA drives your valuation and learn to optimize it like a PE professional
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span>📊 4 Key Sections</span>
            <span>⏱️ 25 minutes</span>
            <span>🎯 Valuation Optimization</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Course Progress</span>
              <span>{Math.round(progressPercentage)}% Complete</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Course Content */}
      <Tabs defaultValue="basics" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {sections.map((section) => (
            <TabsTrigger 
              key={section.id} 
              value={section.id}
              className="text-xs relative"
            >
              {section.title}
              {completedSections.includes(section.id) && (
                <CheckCircle className="h-3 w-3 text-green-600 absolute -top-1 -right-1" />
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Section 1: EBITDA Basics */}
        <TabsContent value="basics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                What is EBITDA and Why Does It Matter?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose prose-sm max-w-none">
                <p className="text-lg leading-relaxed">
                  <strong>EBITDA (Earnings Before Interest, Taxes, Depreciation, and Amortization)</strong> is 
                  the single most important metric private equity firms use to value your business.
                </p>
                
                <div className="bg-primary/10 backdrop-blur-sm p-4 rounded-lg border-l-4 border-accent/30">
                  <h4 className="text-accent font-semibold mb-2">Why PE Firms Love EBITDA</h4>
                  <ul className="text-accent space-y-1">
                    <li>• Shows your company's true operating performance</li>
                    <li>• Removes accounting "noise" like depreciation schedules</li>
                    <li>• Enables apples-to-apples comparison between companies</li>
                    <li>• Directly multiplied to determine your company's value</li>
                  </ul>
                </div>

                <h4 className="text-lg font-semibold">The Simple Formula</h4>
                <div className="bg-muted/20 backdrop-blur-sm p-4 rounded-lg font-mono text-center">
                  <div className="text-xl font-bold">EBITDA = Revenue - Operating Expenses</div>
                  <div className="text-sm text-muted-foreground mt-2">
                    (Before interest, taxes, depreciation, and amortization)
                  </div>
                </div>

                <div className="bg-success/10 backdrop-blur-sm p-4 rounded-lg border-l-4 border-success/30">
                  <h4 className="text-success font-semibold mb-2">Real Example</h4>
                  <p className="text-success">
                    <strong>Company A:</strong> $5M revenue, $3.5M operating expenses = $1.5M EBITDA<br/>
                    <strong>At 6x multiple:</strong> Company value = $9M<br/>
                    <strong>Increase EBITDA to $1.7M:</strong> Company value = $10.2M<br/>
                    <strong>Result:</strong> $200K more EBITDA = $1.2M more exit value!
                  </p>
                </div>
              </div>

              <Button 
                onClick={() => markComplete('basics')}
                className="w-full"
                disabled={completedSections.includes('basics')}
              >
                {completedSections.includes('basics') ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Section Complete
                  </>
                ) : (
                  <>
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Mark Section Complete
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Section 2: PE Calculation */}
        <TabsContent value="calculation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                How PE Firms Calculate EBITDA Differently
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose prose-sm max-w-none">
                <p className="text-lg leading-relaxed">
                  Your accountant calculates EBITDA one way. PE firms calculate it another way. 
                  Understanding the difference can add <strong>hundreds of thousands</strong> to your valuation.
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-destructive/10 backdrop-blur-sm p-4 rounded-lg border border-destructive/30">
                    <h4 className="text-destructive font-semibold mb-3">❌ Accountant's EBITDA</h4>
                    <ul className="text-destructive text-sm space-y-1">
                      <li>• Takes numbers straight from P&L</li>
                      <li>• Includes owner perks and unusual expenses</li>
                      <li>• No adjustments for "one-time" items</li>
                      <li>• Conservative approach</li>
                    </ul>
                  </div>
                  
                  <div className="bg-success/10 backdrop-blur-sm p-4 rounded-lg border border-success/30">
                    <h4 className="text-success font-semibold mb-3">✅ PE Firm's EBITDA</h4>
                    <ul className="text-success text-sm space-y-1">
                      <li>• Adds back owner compensation above market</li>
                      <li>• Removes one-time expenses</li>
                      <li>• Adds back non-essential spending</li>
                      <li>• Shows "normalized" earning power</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-warning/10 backdrop-blur-sm p-4 rounded-lg border-l-4 border-warning/30">
                  <h4 className="text-warning font-semibold mb-2">⚠️ The $180K Mistake</h4>
                  <p className="text-warning">
                    One client had $1.2M in accountant EBITDA. After proper add-backs, we found $1.38M 
                    in normalized EBITDA. At 6x multiple, that's $1.08M more in exit value. 
                    The difference? Understanding what PE firms actually count.
                  </p>
                </div>

                <h4 className="text-lg font-semibold">Common Add-Backs PE Firms Accept</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h5 className="font-medium mb-2">Owner-Related</h5>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Excess owner compensation</li>
                      <li>• Owner's personal expenses</li>
                      <li>• Family member overpay</li>
                      <li>• Owner's personal travel</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">Business-Related</h5>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• One-time legal/consulting fees</li>
                      <li>• Non-recurring maintenance</li>
                      <li>• COVID-related expenses</li>
                      <li>• Acquisition/sale preparation costs</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => markComplete('calculation')}
                className="w-full"
                disabled={completedSections.includes('calculation')}
              >
                {completedSections.includes('calculation') ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Section Complete
                  </>
                ) : (
                  <>
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Mark Section Complete
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Section 3: Add-Backs */}
        <TabsContent value="addbacks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                The Power of Add-Backs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose prose-sm max-w-none">
                <p className="text-lg leading-relaxed">
                  Add-backs are legitimate adjustments that show your business's true earning potential. 
                  Master this, and you'll speak the same language as PE buyers.
                </p>

                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">🎯 Add-Back Strategy</h4>
                    <p className="text-sm">
                      The goal isn't to inflate numbers artificially. It's to show what the business 
                      earns when run by a "normal" owner who doesn't mix personal and business expenses.
                    </p>
                  </div>

                  <div className="grid gap-4">
                    <div className="border rounded-lg p-4">
                      <h5 className="font-medium text-green-700 mb-2">✅ Legitimate Add-Backs</h5>
                      <ul className="text-sm space-y-1">
                        <li>• Owner salary above $150K for a $5M business</li>
                        <li>• Owner's spouse on payroll doing minimal work</li>
                        <li>• Personal meals, travel, car expenses</li>
                        <li>• One-time legal fees for this sale process</li>
                        <li>• Unusual maintenance or repairs</li>
                      </ul>
                    </div>

                    <div className="border border-destructive/30 rounded-lg p-4 bg-destructive/10 backdrop-blur-sm">
                      <h5 className="font-medium text-destructive mb-2">❌ Questionable Add-Backs</h5>
                      <ul className="text-sm space-y-1">
                        <li>• Regular business expenses labeled as "one-time"</li>
                        <li>• Adding back salaries of actual working employees</li>
                        <li>• Normal repair and maintenance costs</li>
                        <li>• Market-rate owner compensation</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-primary/10 backdrop-blur-sm p-4 rounded-lg border-l-4 border-accent/30">
                  <h4 className="text-accent font-semibold mb-2">💡 Pro Tip</h4>
                  <p className="text-accent">
                    Document every add-back with clear justification. PE firms will scrutinize these 
                    during due diligence. The better your documentation, the more likely they'll accept 
                    your adjusted EBITDA number.
                  </p>
                </div>
              </div>

              <Button 
                onClick={() => markComplete('addbacks')}
                className="w-full"
                disabled={completedSections.includes('addbacks')}
              >
                {completedSections.includes('addbacks') ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Section Complete
                  </>
                ) : (
                  <>
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Mark Section Complete
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Section 4: Valuation Impact */}
        <TabsContent value="impact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Every $1 of EBITDA = $5-8 of Value
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose prose-sm max-w-none">
                <p className="text-lg leading-relaxed">
                  Understanding this multiplier effect is crucial. Small improvements in EBITDA 
                  create massive increases in company value.
                </p>

                <div className="bg-gradient-to-r from-primary/10 to-accent/10 backdrop-blur-sm p-6 rounded-lg border border-accent/30">
                  <h4 className="font-semibold text-center mb-4">The Multiplier Effect</h4>
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-primary">+$100K EBITDA</div>
                    <div className="text-lg">×</div>
                    <div className="text-2xl font-semibold">6x Multiple</div>
                    <div className="text-lg">=</div>
                    <div className="text-3xl font-bold text-success">+$600K Value</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h5 className="font-medium">Quick EBITDA Wins ($50K+ each):</h5>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>✓ Reduce owner compensation to market rate</li>
                      <li>✓ Remove family members from payroll</li>
                      <li>✓ Cut personal expenses from P&L</li>
                      <li>✓ Eliminate underperforming locations</li>
                      <li>✓ Renegotiate major supplier contracts</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h5 className="font-medium">Medium-term Wins ($100K+ each):</h5>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>✓ Implement pricing optimization</li>
                      <li>✓ Automate manual processes</li>
                      <li>✓ Focus on highest-margin services</li>
                      <li>✓ Reduce customer concentration risk</li>
                      <li>✓ Build recurring revenue streams</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-warning/10 backdrop-blur-sm p-4 rounded-lg border-l-4 border-warning/30">
                  <h4 className="text-warning font-semibold mb-2">🚀 Your Mission</h4>
                  <p className="text-warning">
                    Your goal is to increase EBITDA by at least $200K before going to market. 
                    At a 6x multiple, that's $1.2M more in your pocket. This course gives you 
                    the roadmap to get there.
                  </p>
                </div>
              </div>

              <Button 
                onClick={() => markComplete('impact')}
                className="w-full"
                disabled={completedSections.includes('impact')}
              >
                {completedSections.includes('impact') ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Section Complete
                  </>
                ) : (
                  <>
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Mark Section Complete
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Course Completion */}
      {isCompleted && (
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              EBITDA Mastery Complete!
            </CardTitle>
            <CardDescription>
              You now understand how PE firms value businesses. Ready for the next module?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">You've mastered:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✓ Why EBITDA is the #1 valuation metric</li>
                <li>✓ How PE firms calculate it differently than accountants</li>
                <li>✓ The power of legitimate add-backs</li>
                <li>✓ The 5-8x multiplier effect on company value</li>
              </ul>
            </div>
            
            <div className="flex gap-3">
              <Button className="flex-1">
                <CheckCircle className="h-4 w-4 mr-2" />
                Complete Module
              </Button>
              <Button variant="outline" asChild>
                <Link to="/portal/week-1/asset-workshop">
                  Next: Asset Workshop
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}