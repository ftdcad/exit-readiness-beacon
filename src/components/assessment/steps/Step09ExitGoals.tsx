
import React, { useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Step09Value = {
  exitSpeed?: string;
  improvementTime?: string;
  riskTolerance?: string;
  capitalAvailable?: string;
  primaryGoal?: string;
};

type Props = {
  value: Step09Value;
  onChange: (p: Partial<Step09Value>) => void;
  onNext: () => void;
  onBack: () => void;
  onSavePartial?: () => Promise<void>;
};

export const Step09ExitGoals: React.FC<Props> = ({ value, onChange, onNext, onBack, onSavePartial }) => {
  useEffect(() => {
    // Fire analytics when Step 9 starts
    window.dispatchEvent(new CustomEvent('analytics', { detail: { event: 'assessment_step_view', step: 9 } }));
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Part 1: Exit Goals and Preferences</h2>

      <Card className="p-4 space-y-6">
        <div className="space-y-2">
          <Label>1. How quickly do you need to exit your business?</Label>
          <Select
            value={value.exitSpeed ?? ''}
            onValueChange={(v) => onChange({ exitSpeed: v })}
          >
            <SelectTrigger><SelectValue placeholder="Select one" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="6months">Within 6 months</SelectItem>
              <SelectItem value="1year">Within 1 year</SelectItem>
              <SelectItem value="1to2years">1 to 2 years</SelectItem>
              <SelectItem value="3plus">3 plus years</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>2. How much time can you dedicate to improving your business?</Label>
          <Select
            value={value.improvementTime ?? ''}
            onValueChange={(v) => onChange({ improvementTime: v })}
          >
            <SelectTrigger><SelectValue placeholder="Select one" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="fulltime">Full time focus</SelectItem>
              <SelectItem value="20plus">20+ hours per week</SelectItem>
              <SelectItem value="10to20">10–20 hours per week</SelectItem>
              <SelectItem value="under10">Under 10 hours per week</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>3. What is your risk tolerance?</Label>
          <Select
            value={value.riskTolerance ?? ''}
            onValueChange={(v) => onChange({ riskTolerance: v })}
          >
            <SelectTrigger><SelectValue placeholder="Select one" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="conservative">Conservative</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="aggressive">Aggressive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>4. Do you have capital available for business improvements?</Label>
          <Select
            value={value.capitalAvailable ?? ''}
            onValueChange={(v) => onChange({ capitalAvailable: v })}
          >
            <SelectTrigger><SelectValue placeholder="Select one" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No capital available</SelectItem>
              <SelectItem value="under50k">Under $50K</SelectItem>
              <SelectItem value="50to250k">$50K to $250K</SelectItem>
              <SelectItem value="250kplus">$250K+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>5. What is your primary exit goal?</Label>
          <Select
            value={value.primaryGoal ?? ''}
            onValueChange={(v) => onChange({ primaryGoal: v })}
          >
            <SelectTrigger><SelectValue placeholder="Select one" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="maxValue">Maximize sale price</SelectItem>
              <SelectItem value="quickExit">Quick exit</SelectItem>
              <SelectItem value="legacy">Preserve company legacy</SelectItem>
              <SelectItem value="employeeWelfare">Protect employees</SelectItem>
              <SelectItem value="stayInvolved">Stay involved post-sale</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <div className="space-x-2">
          {onSavePartial && (
            <Button variant="outline" onClick={onSavePartial}>Save</Button>
          )}
          <Button onClick={onNext}>Next</Button>
        </div>
      </div>
    </div>
  );
};
