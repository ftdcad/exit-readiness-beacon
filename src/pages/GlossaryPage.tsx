
import React from 'react';
import { InteractiveGlossary } from '@/components/InteractiveGlossary';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import { CourseNavigationFooter } from '@/components/CourseNavigationFooter';

export default function GlossaryPage() {
  return (
    <div className="space-y-8">
      {/* Module Header */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardHeader>
          <div className="flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="text-2xl">Interactive Glossary</CardTitle>
              <CardDescription className="text-lg">
                Master the essential terminology of private equity transactions and valuations
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Glossary Component */}
      <InteractiveGlossary />

      {/* Learning Objectives */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-3">What You'll Learn:</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>✓ Key financial terms (EBITDA, Multiple, Working Capital)</li>
            <li>✓ Legal concepts (Due Diligence, LOI, Purchase Agreement)</li>
            <li>✓ Deal structure elements (Rollover Equity, Add-backs)</li>
            <li>✓ Operational readiness factors</li>
          </ul>
        </CardContent>
      </Card>

      {/* Universal Navigation Footer */}
      <CourseNavigationFooter currentModulePath="/portal/week-1/glossary" />
    </div>
  );
}
