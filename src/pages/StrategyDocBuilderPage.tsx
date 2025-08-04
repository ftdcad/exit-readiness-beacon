import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, Download, Save, ArrowRight, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';

interface Initiative {
  id?: string;
  title: string;
  description: string;
  timeline_30: string;
  timeline_60: string;
  timeline_90: string;
  sort_order: number;
}

const TEMPLATES = {
  'Revenue Growth': {
    title: 'Revenue Growth Strategy',
    description: 'Focused on expanding market reach and increasing sales velocity',
    timeline_30: 'Analyze current sales funnel and identify bottlenecks',
    timeline_60: 'Implement sales process improvements and new lead generation channels',
    timeline_90: 'Launch new market segments and measure revenue growth'
  },
  'Operational Excellence': {
    title: 'Operational Excellence Initiative',
    description: 'Streamline operations to improve margins and scalability',
    timeline_30: 'Map current processes and identify inefficiencies',
    timeline_60: 'Implement process improvements and automation tools',
    timeline_90: 'Measure operational metrics and establish new standards'
  },
  'Digital Transformation': {
    title: 'Digital Transformation Program',
    description: 'Modernize technology stack and improve digital capabilities',
    timeline_30: 'Assess current technology infrastructure and gaps',
    timeline_60: 'Begin implementation of new systems and staff training',
    timeline_90: 'Complete rollout and measure digital transformation impact'
  }
};

export const StrategyDocBuilderPage = () => {
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadInitiatives();
    }
  }, [user]);

  const loadInitiatives = async () => {
    try {
      const { data, error } = await supabase
        .from('strategy_initiatives')
        .select('*')
        .eq('user_id', user?.id)
        .order('sort_order');

      if (error) throw error;
      setInitiatives(data || []);
    } catch (error) {
      console.error('Error loading initiatives:', error);
      toast({
        title: "Error loading initiatives",
        description: "Failed to load your strategy initiatives",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveInitiatives = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      // Delete existing initiatives
      await supabase
        .from('strategy_initiatives')
        .delete()
        .eq('user_id', user.id);

      // Insert updated initiatives
      const initiativesToSave = initiatives.map((init, index) => ({
        ...init,
        user_id: user.id,
        sort_order: index
      }));

      const { error } = await supabase
        .from('strategy_initiatives')
        .insert(initiativesToSave);

      if (error) throw error;

      toast({
        title: "Strategy saved successfully",
        description: "Your initiatives have been saved to your account"
      });
    } catch (error) {
      console.error('Error saving initiatives:', error);
      toast({
        title: "Error saving strategy",
        description: "Failed to save your initiatives",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const addInitiative = () => {
    if (initiatives.length >= 5) {
      toast({
        title: "Maximum initiatives reached",
        description: "You can have up to 5 strategic initiatives",
        variant: "destructive"
      });
      return;
    }

    const newInitiative: Initiative = {
      title: '',
      description: '',
      timeline_30: '',
      timeline_60: '',
      timeline_90: '',
      sort_order: initiatives.length
    };
    setInitiatives([...initiatives, newInitiative]);
  };

  const removeInitiative = (index: number) => {
    const updated = initiatives.filter((_, i) => i !== index);
    setInitiatives(updated.map((init, i) => ({ ...init, sort_order: i })));
  };

  const updateInitiative = (index: number, field: keyof Initiative, value: string) => {
    const updated = [...initiatives];
    updated[index] = { ...updated[index], [field]: value };
    setInitiatives(updated);
  };

  const addTemplate = (templateKey: string) => {
    if (initiatives.length >= 5) {
      toast({
        title: "Maximum initiatives reached",
        description: "Remove an existing initiative first",
        variant: "destructive"
      });
      return;
    }

    const template = TEMPLATES[templateKey as keyof typeof TEMPLATES];
    const newInitiative: Initiative = {
      ...template,
      sort_order: initiatives.length
    };
    setInitiatives([...initiatives, newInitiative]);
  };

  const exportMarkdown = () => {
    let markdown = '# Strategic Exit Readiness Plan\n\n';
    markdown += '## 90-Day Strategic Initiatives\n\n';
    
    initiatives.forEach((init, index) => {
      markdown += `### ${index + 1}. ${init.title}\n\n`;
      markdown += `**Description:** ${init.description}\n\n`;
      markdown += `**30-Day Milestone:** ${init.timeline_30}\n\n`;
      markdown += `**60-Day Milestone:** ${init.timeline_60}\n\n`;
      markdown += `**90-Day Milestone:** ${init.timeline_90}\n\n`;
      markdown += '---\n\n';
    });

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'strategy-roadmap.md';
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Strategy exported",
      description: "Your strategy document has been downloaded"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-primary">Strategy Doc Builder</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform your exit readiness gaps into actionable 90-day strategic initiatives
          </p>
          <Badge variant="secondary" className="text-sm">
            Week 2: Strategic Planning & Value Creation
          </Badge>
        </div>

        {/* Templates Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5" />
              Quick Start Templates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.keys(TEMPLATES).map((template) => (
                <Button
                  key={template}
                  variant="outline"
                  className="h-auto p-4 text-left justify-start"
                  onClick={() => addTemplate(template)}
                >
                  <div className="w-full">
                    <div className="font-medium">{template}</div>
                    <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {TEMPLATES[template as keyof typeof TEMPLATES].description}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Initiatives */}
        <div className="space-y-6">
          {initiatives.map((initiative, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Initiative {index + 1}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeInitiative(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`title-${index}`}>Initiative Title</Label>
                    <Input
                      id={`title-${index}`}
                      value={initiative.title}
                      onChange={(e) => updateInitiative(index, 'title', e.target.value)}
                      placeholder="Enter initiative title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`description-${index}`}>Description</Label>
                    <Textarea
                      id={`description-${index}`}
                      value={initiative.description}
                      onChange={(e) => updateInitiative(index, 'description', e.target.value)}
                      placeholder="Describe the initiative"
                      className="min-h-[80px]"
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Timeline & Milestones</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`timeline-30-${index}`}>30-Day Milestone</Label>
                      <Textarea
                        id={`timeline-30-${index}`}
                        value={initiative.timeline_30}
                        onChange={(e) => updateInitiative(index, 'timeline_30', e.target.value)}
                        placeholder="What will be accomplished in 30 days?"
                        className="min-h-[100px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`timeline-60-${index}`}>60-Day Milestone</Label>
                      <Textarea
                        id={`timeline-60-${index}`}
                        value={initiative.timeline_60}
                        onChange={(e) => updateInitiative(index, 'timeline_60', e.target.value)}
                        placeholder="What will be accomplished in 60 days?"
                        className="min-h-[100px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`timeline-90-${index}`}>90-Day Milestone</Label>
                      <Textarea
                        id={`timeline-90-${index}`}
                        value={initiative.timeline_90}
                        onChange={(e) => updateInitiative(index, 'timeline_90', e.target.value)}
                        placeholder="What will be accomplished in 90 days?"
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add Initiative */}
        {initiatives.length < 5 && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-6">
              <Button onClick={addInitiative} variant="ghost" className="h-auto py-4">
                <PlusCircle className="h-6 w-6 mr-2" />
                Add Strategic Initiative
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                {initiatives.length}/5 initiatives added
              </p>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Button onClick={saveInitiatives} disabled={saving} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Strategy'}
          </Button>
          
          <Button onClick={exportMarkdown} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export as Markdown
          </Button>

          <Button asChild className="flex items-center gap-2">
            <Link to="/portal/week-2/metrics">
              Continue to KPIs & OKRs
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};