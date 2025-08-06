import React from 'react';
import { InteractiveGlossary } from '@/components/InteractiveGlossary';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProgress } from '@/hooks/useProgress';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export default function GlossaryPage() {
  const { markModuleComplete, isModuleCompleted } = useProgress();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleMarkComplete = async () => {
    if (!user) return;
    
    try {
      await markModuleComplete('Interactive Glossary', 1);
      toast({
        title: "Module Completed!",
        description: "You've completed the Interactive Glossary module.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark module as complete.",
        variant: "destructive",
      });
    }
  };

  const isCompleted = isModuleCompleted('Interactive Glossary', 1);

  return (
    <div className="space-y-8">
      {/* Module Header */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle className="text-2xl">Interactive Glossary</CardTitle>
          <CardDescription className="text-lg">
            Master the essential terminology of private equity transactions and valuations
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Glossary Component */}
      <InteractiveGlossary />

      {/* Completion Actions */}
      <Card className="border-green-400/20 bg-green-900/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-400">
            <CheckCircle className="h-5 w-5" />
            Mark Module Complete
          </CardTitle>
          <CardDescription>
            Ready to move on? Mark this module as complete to unlock the next one.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">You've learned:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>✓ Key financial terms (EBITDA, Multiple, Working Capital)</li>
              <li>✓ Legal concepts (Due Diligence, LOI, Purchase Agreement)</li>
              <li>✓ Deal structure elements (Rollover Equity, Add-backs)</li>
              <li>✓ Operational readiness factors</li>
            </ul>
          </div>
          
          <div className="flex gap-3">
            <Button 
              className="flex-1"
              onClick={handleMarkComplete}
              disabled={isCompleted}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {isCompleted ? 'Module Completed' : 'Complete Module'}
            </Button>
            <Button variant="outline" asChild>
              <Link to="/portal/week-1/ebitda-course">
                Next: EBITDA Mastery
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}