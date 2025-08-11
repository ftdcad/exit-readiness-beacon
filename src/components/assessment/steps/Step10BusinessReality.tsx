
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Step10Value = {
  customerConcentration?: string;
  ownerDependency?: string;
  ownerAbsenceImpact?: string;
  financialCleanliness?: string;
  recurringRevenue?: string;
  revenueGrowth?: string;
  processes?: string[];
};

type Props = {
  value: Step10Value;
  onChange: (p: Partial<Step10Value>) => void;
  onBack: () => void;
  onSavePartial?: () => Promise<void>;
  onComplete: () => void;
};

export const Step10BusinessReality: React.FC<Props> = ({ value, onChange, onBack, onSavePartial, onComplete }) => {
  const setChecked = (key: string, checked: boolean) => {
    const prev = Array.isArray(value.processes) ? value.processes : [];
    const set = new Set(prev);
    if (checked) set.add(key); else set.delete(key);
    onChange({ processes: Array.from(set) });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Part 2: Business Reality Check</h2>

      <Card className="p-4 space-y-6">
        <div className="space-y-2">
          <Label>6. What percentage of revenue comes from your largest customer?</Label>
          <Select
            value={value.customerConcentration ?? ''}
            onValueChange={(v) => onChange({ customerConcentration: v })}
          >
            <SelectTrigger><SelectValue placeholder="Select one" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="under10">Under 10%</SelectItem>
              <SelectItem value="10to25">10–25%</SelectItem>
              <SelectItem value="25to40">25–40%</</SelectItem>
              <SelectItem value="over40">Over 40%</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>7. How many key decisions require your personal approval?</Label>
          <Select
            value={value.ownerDependency ?? ''}
            onValueChange={(v) => onChange({ ownerDependency: v })}
          >
            <SelectTrigger><SelectValue placeholder="Select one" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All decisions</SelectItem>
              <SelectItem value="most">Most decisions</SelectItem>
              <SelectItem value="some">Some strategic decisions</SelectItem>
              <SelectItem value="few">Very few</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>8. If you disappeared for 3 months, what would happen?</Label>
          <Select
            value={value.ownerAbsenceImpact ?? ''}
            onValueChange={(v) => onChange({ ownerAbsenceImpact: v })}
          >
            <SelectTrigger><SelectValue placeholder="Select one" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="collapse">Business would collapse</SelectItem>
              <SelectItem value="struggle">Would struggle</SelectItem>
              <SelectItem value="slowdown">Some slowdown but survive</SelectItem>
              <SelectItem value="fine">Would run fine</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>9. How clean are your financials?</Label>
          <Select
            value={value.financialCleanliness ?? ''}
            onValueChange={(v) => onChange({ financialCleanliness: v })}
          >
            <SelectTrigger><SelectValue placeholder="Select one" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="audited">Audited by Big 4</SelectItem>
              <SelectItem value="reviewed">CPA reviewed</SelectItem>
              <SelectItem value="compiled">CPA compiled</SelectItem>
              <SelectItem value="internal">Internal only / QuickBooks</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>10. What percentage of revenue is recurring or contracted?</Label>
          <Select
            value={value.recurringRevenue ?? ''}
            onValueChange={(v) => onChange({ recurringRevenue: v })}
          >
            <SelectTrigger><SelectValue placeholder="Select one" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="over80">Over 80%</SelectItem>
              <SelectItem value="50to80">50–80%</SelectItem>
              <SelectItem value="20to50">20–50%</SelectItem>
              <SelectItem value="under20">Under 20%</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>11. Revenue growth over the last 3 years</Label>
          <Select
            value={value.revenueGrowth ?? ''}
            onValueChange={(v) => onChange({ revenueGrowth: v })}
          >
            <SelectTrigger><SelectValue placeholder="Select one" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="20plus">20%+ annually</SelectItem>
              <SelectItem value="10to20">10–20% annually</SelectItem>
              <SelectItem value="0to10">0–10%</SelectItem>
              <SelectItem value="decline">Declining</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>12. Which critical processes are documented?</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
            {[
              ['salesProcess','Sales process'],
              ['operations','Operations and delivery'],
              ['finance','Financial procedures'],
              ['hr','HR and hiring'],
              ['customerService','Customer service'],
              ['none','None documented'],
            ].map(([key, label]) => {
              const k = key as string;
              const checked = (value.processes ?? []).includes(k);
              return (
                <div key={k} className="flex items-center space-x-2">
                  <Checkbox
                    id={`proc_${k}`}
                    checked={checked}
                    onCheckedChange={(c: boolean) => setChecked(k, !!c)}
                  />
                  <Label htmlFor={`proc_${k}`}>{label}</Label>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      <div className="mt-6 p-4 rounded border border-border/50 bg-background/50">
        <p className="text-sm text-muted-foreground">
          Continue to schedule your free exit strategy consultation. Your answers will be included.
        </p>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <div className="space-x-2">
          {onSavePartial && (
            <Button variant="outline" onClick={onSavePartial}>Save</Button>
          )}
          <Button onClick={onComplete}>Continue</Button>
        </div>
      </div>
    </div>
  );
};
