import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Download, Plus, DollarSign, AlertTriangle, CheckCircle2, Minus } from 'lucide-react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { useProgress } from '@/hooks/useProgress';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Asset {
  id: string;
  name: string;
  value: number;
  description: string;
  currentCategory: 'Core' | 'Destroyer' | 'Negotiable' | 'Uncategorized';
  notes: string;
  warningLevel?: 'green' | 'yellow' | 'red';
  warningMessage?: string;
  explanation?: string;
}

interface IndustryAssetRule {
  assetPattern: RegExp;
  coreIndustries: string[];
  negotiableIndustries: string[];
  destroyerIndustries: string[];
}

const AssetWorkshopPage = () => {
  const { markModuleComplete, isModuleCompleted } = useProgress();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Start with empty assets list - users must add their own
  const [assets, setAssets] = useState<Asset[]>([]);
  
  // Get user's industry from localStorage or default
  const getUserIndustry = () => {
    try {
      const assessment = localStorage.getItem('preAssessment');
      if (assessment) {
        const data = JSON.parse(assessment);
        return data.industry || 'Unknown';
      }
    } catch (e) {
      console.log('Could not parse industry data');
    }
    return 'Unknown';
  };
  
  const userIndustry = getUserIndustry();
  
  // Industry-specific asset intelligence rules
  const assetRules: IndustryAssetRule[] = [
    {
      assetPattern: /vehicle|truck|fleet|van|car/i,
      coreIndustries: ['HVAC', 'Plumbing', 'Electrical', 'Construction', 'Delivery', 'Service'],
      negotiableIndustries: ['Retail', 'Manufacturing'],
      destroyerIndustries: ['Legal', 'Accounting', 'Consulting', 'Software', 'Healthcare']
    },
    {
      assetPattern: /building|office|warehouse|facility|real estate|property/i,
      coreIndustries: ['Manufacturing', 'Warehousing'],
      negotiableIndustries: ['Retail', 'Healthcare'],
      destroyerIndustries: ['Legal', 'Accounting', 'Consulting', 'Software', 'HVAC', 'Plumbing']
    },
    {
      assetPattern: /equipment|machinery|tools|production/i,
      coreIndustries: ['Manufacturing', 'Construction', 'Healthcare'],
      negotiableIndustries: ['Service', 'Retail'],
      destroyerIndustries: ['Legal', 'Accounting', 'Software']
    },
    {
      assetPattern: /vacation|personal|art|yacht|rv|recreational/i,
      coreIndustries: [],
      negotiableIndustries: [],
      destroyerIndustries: ['All']
    },
    {
      assetPattern: /computer|printer|copier|software|IT/i,
      coreIndustries: ['Software', 'Legal', 'Accounting', 'Consulting'],
      negotiableIndustries: ['All'],
      destroyerIndustries: []
    }
  ];
  
  // Get warning level for asset categorization
  const getAssetWarning = (assetName: string, category: Asset['currentCategory']): { level: 'green' | 'yellow' | 'red', message: string } => {
    if (category === 'Uncategorized') return { level: 'green', message: '' };
    
    const rule = assetRules.find(rule => rule.assetPattern.test(assetName));
    if (!rule) return { level: 'green', message: 'Standard categorization' };
    
    const isCore = rule.coreIndustries.includes(userIndustry) || rule.coreIndustries.includes('All');
    const isNegotiable = rule.negotiableIndustries.includes(userIndustry) || rule.negotiableIndustries.includes('All');
    const isDestroyer = rule.destroyerIndustries.includes(userIndustry) || rule.destroyerIndustries.includes('All');
    
    if (category === 'Core') {
      if (isDestroyer) return { level: 'red', message: `Very unusual - ${assetName} is typically not core for ${userIndustry} companies. Detailed justification required.` };
      if (!isCore && !isNegotiable) return { level: 'yellow', message: `Unusual for ${userIndustry} - please explain why this is essential to operations.` };
      return { level: 'green', message: `Common for ${userIndustry} companies - looks good` };
    }
    
    if (category === 'Destroyer') {
      if (isDestroyer) return { level: 'green', message: `Correct - typically problematic for all industries` };
      if (isCore) return { level: 'red', message: `Warning - this asset is usually core for ${userIndustry} companies. Are you sure?` };
      return { level: 'yellow', message: `Please explain why this is a value destroyer for your business` };
    }
    
    return { level: 'green', message: 'Standard categorization' };
  };

  const [newAsset, setNewAsset] = useState({
    name: '',
    value: '',
    description: ''
  });

  const [draggedAsset, setDraggedAsset] = useState<string | null>(null);

  const calculateValuationImpact = () => {
    const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);
    const destroyerValue = assets
      .filter(asset => asset.currentCategory === 'Destroyer')
      .reduce((sum, asset) => sum + asset.value, 0);
    
    // 15-25% discount for each dollar of non-core assets
    const discountRate = 0.20;
    const discountAmount = destroyerValue * discountRate;
    
    return {
      totalAssets: totalValue,
      destroyerValue,
      discountAmount,
      adjustedValuation: totalValue - discountAmount,
      deltaFromBaseline: -discountAmount
    };
  };

  const handleDragStart = (e: React.DragEvent, assetId: string) => {
    setDraggedAsset(assetId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, category: Asset['currentCategory']) => {
    e.preventDefault();
    if (draggedAsset) {
      setAssets(prev => 
        prev.map(asset => {
          if (asset.id === draggedAsset) {
            const warning = getAssetWarning(asset.name, category);
            return { 
              ...asset, 
              currentCategory: category,
              warningLevel: warning.level,
              warningMessage: warning.message,
              explanation: warning.level !== 'green' ? asset.explanation || '' : undefined
            };
          }
          return asset;
        })
      );
      setDraggedAsset(null);
    }
  };

  const addAsset = () => {
    if (newAsset.name && newAsset.value) {
      const asset: Asset = {
        id: Date.now().toString(),
        name: newAsset.name,
        value: parseInt(newAsset.value),
        description: newAsset.description,
        currentCategory: 'Uncategorized',
        notes: ''
      };
      setAssets(prev => [...prev, asset]);
      setNewAsset({ name: '', value: '', description: '' });
    }
  };
  
  const updateAssetExplanation = (id: string, explanation: string) => {
    setAssets(prev => 
      prev.map(asset => 
        asset.id === id ? { ...asset, explanation } : asset
      )
    );
  };

  const removeAsset = (id: string) => {
    setAssets(prev => prev.filter(asset => asset.id !== id));
  };

  const updateAssetNotes = (id: string, notes: string) => {
    setAssets(prev => 
      prev.map(asset => 
        asset.id === id ? { ...asset, notes } : asset
      )
    );
  };

  const impact = calculateValuationImpact();

  const categories = [
    {
      key: 'Uncategorized' as const,
      title: 'Your Assets',
      description: 'Drag assets below into the appropriate categories based on buyer perspective.',
      bgColor: 'bg-slate-900/10',
      borderColor: 'border-slate-400/20',
      textColor: 'text-slate-400',
      icon: Plus
    },
    {
      key: 'Core' as const,
      title: 'Core Assets',
      description: 'Directly tied to business operations. Buyers expect these to stay.',
      bgColor: 'bg-green-900/10',
      borderColor: 'border-green-400/20',
      textColor: 'text-green-400',
      icon: CheckCircle2
    },
    {
      key: 'Negotiable' as const,
      title: 'Negotiable',
      description: 'Could go either way depending on the buyer\'s strategy or risk tolerance.',
      bgColor: 'bg-yellow-900/10',
      borderColor: 'border-yellow-400/20',
      textColor: 'text-yellow-400',
      icon: DollarSign
    },
    {
      key: 'Destroyer' as const,
      title: 'Value Destroyers',
      description: 'Non-essential or personal assets that reduce your multiple or kill deals.',
      bgColor: 'bg-red-900/10',
      borderColor: 'border-red-400/20',
      textColor: 'text-red-400',
      icon: AlertTriangle
    }
  ];

  return (
    <div className="space-y-8">
        {/* Module Header */}
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 backdrop-blur-lg">
          <CardHeader>
            <div className="flex items-center gap-2 text-primary mb-2">
              <CheckCircle2 className="h-6 w-6" />
              <span className="text-sm font-medium">Week 1 • Module 1</span>
            </div>
            <CardTitle className="text-2xl">Asset Categorization Workshop</CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              Identify Core vs Non-Core Assets - Strategic Asset Allocation for Maximum Exit Value
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Story/Context */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-accent">Founder's Story</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-accent/90 leading-relaxed text-lg">
              "When I sold my company, I didn't realize the building I owned in the company's name was tanking our valuation. 
              Private equity wanted no part of it. That moment taught me a hard lesson: buyers want streamlined, operationally 
              essential businesses. Everything else? Dead weight."
            </p>
            <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-accent/10 to-primary/10 backdrop-blur-sm border border-accent/20">
              <p className="font-medium text-accent">
                💡 This module helps you identify which assets to divest or separate *before* buyers discount your deal.
              </p>
            </div>
          </CardContent>
        </Card>

        <ResizablePanelGroup direction="horizontal" className="min-h-[800px]">
          {/* Left Panel - Categorizer */}
          <ResizablePanel defaultSize={65}>
            <div className="space-y-6 pr-6">
              {/* Add New Asset */}
              <Card className="border-primary/20 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-accent">
                    <Plus className="h-5 w-5" />
                    Add Business Asset
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Asset name"
                      value={newAsset.name}
                      onChange={(e) => setNewAsset(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-background/50 backdrop-blur-sm text-foreground placeholder:text-muted-foreground"
                    />
                    <Input
                      type="number"
                      placeholder="Value ($)"
                      value={newAsset.value}
                      onChange={(e) => setNewAsset(prev => ({ ...prev, value: e.target.value }))}
                      className="bg-background/50 backdrop-blur-sm text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <Input
                    placeholder="Description"
                    value={newAsset.description}
                    onChange={(e) => setNewAsset(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-background/50 backdrop-blur-sm text-foreground placeholder:text-muted-foreground"
                  />
                  <Button onClick={addAsset} disabled={!newAsset.name || !newAsset.value} className="w-full">
                    Add Asset
                  </Button>
                </CardContent>
              </Card>

              {/* Categories */}
              <div className="grid grid-cols-1 gap-6">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const categoryAssets = assets.filter(asset => asset.currentCategory === category.key);
                  
                  return (
                    <Card 
                      key={category.key}
                      className={`border-primary/20 bg-gradient-to-br from-${category.key === 'Core' ? 'emerald' : category.key === 'Destroyer' ? 'red' : 'amber'}-900/20 to-${category.key === 'Core' ? 'emerald' : category.key === 'Destroyer' ? 'red' : 'amber'}-900/5 backdrop-blur-lg transition-all duration-200 hover:shadow-lg`}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, category.key)}
                    >
                      <CardHeader>
                        <CardTitle className={`flex items-center gap-2 ${category.textColor}`}>
                          <Icon className="h-5 w-5" />
                          {category.title}
                          <Badge variant="outline" className={`${category.textColor} border-current bg-background/20`}>
                            {categoryAssets.length}
                          </Badge>
                        </CardTitle>
                        <CardDescription className="text-muted-foreground/80">{category.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {categoryAssets.map((asset) => (
                            <div
                              key={asset.id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, asset.id)}
                              className="p-4 rounded-lg bg-gradient-to-r from-background/80 to-background/60 border border-border/50 cursor-move hover:from-background/90 hover:to-background/70 transition-all duration-200 backdrop-blur-sm shadow-sm hover:shadow-md"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-foreground">{asset.name}</h4>
                                  <p className="text-sm text-muted-foreground/80">{asset.description}</p>
                                  <p className="text-sm font-semibold text-accent mt-1">
                                    ${asset.value.toLocaleString()}
                                  </p>
                                  
                                  {/* Smart Warning System */}
                                  {asset.warningLevel && asset.warningLevel !== 'green' && (
                                    <div className={`mt-2 p-2 rounded text-xs ${
                                      asset.warningLevel === 'red' 
                                        ? 'bg-red-900/20 text-red-400 border border-red-400/30' 
                                        : 'bg-yellow-900/20 text-yellow-400 border border-yellow-400/30'
                                    }`}>
                                      <p className="font-medium">
                                        {asset.warningLevel === 'red' ? '🔴' : '🟡'} {asset.warningMessage}
                                      </p>
                                    </div>
                                  )}
                                  
                                  {asset.warningLevel === 'green' && asset.warningMessage && (
                                    <div className="mt-2 p-2 rounded text-xs bg-green-900/20 text-green-400 border border-green-400/30">
                                      <p className="font-medium">✅ {asset.warningMessage}</p>
                                    </div>
                                  )}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeAsset(asset.id)}
                                  className="text-muted-foreground hover:text-destructive opacity-60 hover:opacity-100"
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                              </div>
                              
                              {/* Explanation required for warnings */}
                              {asset.warningLevel && asset.warningLevel !== 'green' && (
                                <Textarea
                                  placeholder={`Required: Explain why this is ${category.key.toLowerCase()} for your ${userIndustry} business...`}
                                  value={asset.explanation || ''}
                                  onChange={(e) => updateAssetExplanation(asset.id, e.target.value)}
                                  className="mt-3 text-sm bg-background/30 backdrop-blur-sm border-yellow-400/30"
                                  rows={2}
                                />
                              )}
                              
                              <Textarea
                                placeholder="Add notes..."
                                value={asset.notes}
                                onChange={(e) => updateAssetNotes(asset.id, e.target.value)}
                                className="mt-3 text-sm bg-background/30 backdrop-blur-sm"
                                rows={2}
                              />
                            </div>
                          ))}
                          {categoryAssets.length === 0 && (
                            <div className="p-8 text-center text-muted-foreground/60 border-2 border-dashed border-border/30 rounded-lg bg-background/10 backdrop-blur-sm">
                              Drag assets here to categorize
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Right Panel - Valuation Impact */}
          <ResizablePanel defaultSize={35}>
            <div className="pl-6 space-y-6">
              <Card className="border-primary/20 bg-gradient-to-br from-accent/10 to-primary/5 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-accent">
                    <DollarSign className="h-5 w-5" />
                    Valuation Impact
                  </CardTitle>
                  <CardDescription className="text-muted-foreground/80">Live preview of buyer discount</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Assets:</span>
                      <span className="font-semibold text-accent">${impact.totalAssets.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Value Destroyers:</span>
                      <span className="font-semibold text-red-400">${impact.destroyerValue.toLocaleString()}</span>
                    </div>
                    <Separator className="bg-border/50" />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Buyer Discount (20%):</span>
                      <span className="font-semibold text-red-400">-${impact.discountAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-foreground">Adjusted Valuation:</span>
                      <span className={impact.deltaFromBaseline < 0 ? 'text-red-400' : 'text-emerald-400'}>
                        ${impact.adjustedValuation.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {impact.deltaFromBaseline < 0 && (
                    <div className="p-4 rounded-lg bg-gradient-to-r from-red-900/20 to-red-900/10 border border-red-400/30 backdrop-blur-sm">
                      <p className="text-red-400 text-sm font-medium">
                        ⚠️ Value destroyers are reducing your valuation by ${Math.abs(impact.deltaFromBaseline).toLocaleString()}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="text-accent">Asset Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {categories.map((category) => {
                      const count = assets.filter(asset => asset.currentCategory === category.key).length;
                      const value = assets
                        .filter(asset => asset.currentCategory === category.key)
                        .reduce((sum, asset) => sum + asset.value, 0);
                      
                      return (
                        <div key={category.key} className="flex justify-between items-center">
                          <span className={`text-sm font-medium ${category.textColor}`}>{category.title}:</span>
                          <div className="text-right">
                            <div className="text-sm font-semibold text-foreground">{count} assets</div>
                            <div className="text-xs text-muted-foreground">${value.toLocaleString()}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3">
                <Button 
                  className="w-full bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 text-white shadow-lg" 
                  variant="default"
                  onClick={() => {
                    // Generate CSV export with warnings and explanations
                     const csvContent = [
                      'Asset Name,Value,Description,Category,Warning Level,Warning Message,Explanation,Notes',
                      ...assets.map(asset => 
                        `"${asset.name}","${asset.value}","${asset.description}","${asset.currentCategory}","${asset.warningLevel || 'none'}","${asset.warningMessage || ''}","${asset.explanation || ''}","${asset.notes}"`
                      )
                    ].join('\n');

                    // Create and download CSV file
                    const blob = new Blob([csvContent], { type: 'text/csv' });
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `asset-analysis-${userIndustry.toLowerCase()}-${new Date().toISOString().split('T')[0]}.csv`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);

                    toast({
                      title: "Export Complete",
                      description: `Asset analysis for ${userIndustry} business exported successfully`
                    });
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Analysis
                </Button>
                
                <Button 
                  className="w-full"
                  onClick={async () => {
                    if (!user) {
                      toast({
                        title: "Login Required",
                        description: "Please log in to save your progress",
                        variant: "destructive"
                      });
                      return;
                    }

                    try {
                      await markModuleComplete('Asset Workshop', 1);
                      toast({
                        title: "Module Completed!",
                        description: "Asset Categorization Workshop marked as complete"
                      });
                    } catch (error) {
                      console.error('Error completing module:', error);
                      toast({
                        title: "Error",
                        description: "Failed to mark module as complete.",
                        variant: "destructive",
                      });
                    }
                  }}
                  disabled={isModuleCompleted('Asset Workshop', 1)}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  {isModuleCompleted('Asset Workshop', 1) ? '✓ Module Complete' : 'Complete Module'}
                </Button>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
    </div>
  );
};

export default AssetWorkshopPage;