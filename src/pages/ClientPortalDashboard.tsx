import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Crown, Clock, Trophy, ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ClientPortalDashboard() {
  // This would come from user progress data in real implementation
  const weekProgress = {
    1: { completed: 0, total: 4, unlocked: true },
    2: { completed: 0, total: 4, unlocked: false },
    3: { completed: 0, total: 4, unlocked: false },
    4: { completed: 0, total: 4, unlocked: false }
  };

  const overallProgress = 0; // 0% for new user
  const currentWeek = 1;

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-primary">
          <Crown className="h-8 w-8" />
          <h1 className="text-4xl font-bold">Welcome to Your Deal Room</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your exclusive 4-week journey to maximize exit value. Let's transform your business into a PE-ready powerhouse.
        </p>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          $5,000 Investment • 4 Weeks • Maximum Value
        </Badge>
      </div>

      {/* Progress Overview */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Your Journey Progress
          </CardTitle>
          <CardDescription>
            Track your progress through the 4-week exit readiness program
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Completion</span>
              <span>{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
          
          <div className="grid grid-cols-4 gap-4 mt-6">
            {Object.entries(weekProgress).map(([week, progress]) => (
              <div key={week} className="text-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                  progress.unlocked 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {week}
                </div>
                <div className="text-xs text-muted-foreground">
                  {progress.completed}/{progress.total} modules
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Week Focus */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Week {currentWeek}: Foundation & Education
          </CardTitle>
          <CardDescription>
            Build your PE knowledge foundation and identify immediate value drivers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="bg-muted/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Interactive Glossary</CardTitle>
                <CardDescription className="text-sm">
                  Master the language of private equity transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link to="/portal/week-1/glossary">
                    <Play className="h-4 w-4 mr-2" />
                    Start Learning
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-muted/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">EBITDA Mastery Course</CardTitle>
                <CardDescription className="text-sm">
                  Understand how EBITDA drives your valuation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" disabled>
                  <Clock className="h-4 w-4 mr-2" />
                  Complete Glossary First
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-medium mb-2">This Week You'll:</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Master 20+ essential PE terms and concepts</li>
              <li>• Learn how EBITDA calculation affects your valuation</li>
              <li>• Categorize your assets (core vs non-core)</li>
              <li>• Identify 5 quick wins worth $500K+ in value</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary">20+</CardTitle>
            <CardDescription>Essential PE Terms to Master</CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary">$500K+</CardTitle>
            <CardDescription>Potential Value from Quick Wins</CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary">4 Weeks</CardTitle>
            <CardDescription>To Exit-Ready Status</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Call to Action */}
      <Card className="bg-primary text-primary-foreground">
        <CardContent className="text-center py-8">
          <h3 className="text-2xl font-bold mb-4">Ready to Begin Your Journey?</h3>
          <p className="mb-6 text-primary-foreground/90">
            Start with the Interactive Glossary to build your foundation in PE terminology.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/portal/week-1/glossary">
              Begin Week 1
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}