import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Download, Plus, DollarSign, AlertTriangle, CheckCircle2, Minus } from 'lucide-react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

interface Asset {
  id: string;
  name: string;
  value: number;
  description: string;
  currentCategory: 'Core' | 'Destroyer' | 'Negotiable';
  notes: string;
}

const AssetWorkshopPage = () => {
  const [assets, setAssets] = useState<Asset[]>([
    {
      id: '1',
      name: 'Office Building',
      value: 850000,
      description: 'Main headquarters facility',
      currentCategory: 'Core',
      notes: ''
    },
    {
      id: '2', 
      name: 'Company Vehicle Fleet',
      value: 120000,
      description: 'Delivery trucks and sales vehicles',
      currentCategory: 'Core',
      notes: ''
    },
    {
      id: '3',
      name: 'Vacation Condo',
      value: 400000,
      description: 'Executive retreat property',
      currentCategory: 'Destroyer',
      notes: ''
    },
    {
      id: '4',
      name: 'Manufacturing Equipment',
      value: 2100000,
      description: 'Core production machinery',
      currentCategory: 'Core',
      notes: ''
    },
    {
      id: '5',
      name: 'Art Collection',
      value: 75000,
      description: 'Office artwork and sculptures',
      currentCategory: 'Destroyer',
      notes: ''
    },
    {
      id: '6',
      name: 'Cash Reserves',
      value: 500000,
      description: 'Excess working capital',
      currentCategory: 'Negotiable',
      notes: ''
    }
  ]);

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
        prev.map(asset => 
          asset.id === draggedAsset 
            ? { ...asset, currentCategory: category }
            : asset
        )
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
        currentCategory: 'Negotiable',
        notes: ''
      };
      setAssets(prev => [...prev, asset]);
      setNewAsset({ name: '', value: '', description: '' });
    }
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
      key: 'Core' as const,
      title: 'Core Assets',
      description: 'Directly tied to business operations. Buyers expect these to stay.',
      bgColor: 'bg-green-900/10',
      borderColor: 'border-green-400/20',
      textColor: 'text-green-400',
      icon: CheckCircle2
    },
    {
      key: 'Destroyer' as const,
      title: 'Value Destroyers',
      description: 'Non-essential or personal assets that reduce your multiple or kill deals.',
      bgColor: 'bg-red-900/10',
      borderColor: 'border-red-400/20',
      textColor: 'text-red-400',
      icon: AlertTriangle
    },
    {
      key: 'Negotiable' as const,
      title: 'Negotiable',
      description: 'Could go either way depending on the buyer\'s strategy or risk tolerance.',
      bgColor: 'bg-yellow-900/10',
      borderColor: 'border-yellow-400/20',
      textColor: 'text-yellow-400',
      icon: DollarSign
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Asset Categorization Workshop
        </h1>
        <p className="text-muted-foreground text-lg">
          Identify Core vs Non-Core Assets
        </p>
      </div>

      {/* Story/Context */}
      <Card className="border-primary/20 bg-primary/5 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-primary">Founder's Story</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            "When I sold my company, I didn't realize the building I owned in the company's name was tanking our valuation. 
            Private equity wanted no part of it. That moment taught me a hard lesson: buyers want streamlined, operationally 
            essential businesses. Everything else? Dead weight."
          </p>
          <div className="mt-4 p-4 rounded-lg bg-background/50">
            <p className="font-medium text-foreground">
              This module helps you identify which assets to divest or separate *before* buyers discount your deal.
            </p>
          </div>
        </CardContent>
      </Card>

      <ResizablePanelGroup direction="horizontal" className="min-h-[800px]">
        {/* Left Panel - Categorizer */}
        <ResizablePanel defaultSize={65}>
          <div className="space-y-6 pr-6">
            {/* Add New Asset */}
            <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
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
                  />
                  <Input
                    type="number"
                    placeholder="Value ($)"
                    value={newAsset.value}
                    onChange={(e) => setNewAsset(prev => ({ ...prev, value: e.target.value }))}
                  />
                </div>
                <Input
                  placeholder="Description"
                  value={newAsset.description}
                  onChange={(e) => setNewAsset(prev => ({ ...prev, description: e.target.value }))}
                />
                <Button onClick={addAsset} disabled={!newAsset.name || !newAsset.value}>
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
                    className={`${category.borderColor} ${category.bgColor} backdrop-blur-sm transition-all duration-200`}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, category.key)}
                  >
                    <CardHeader>
                      <CardTitle className={`flex items-center gap-2 ${category.textColor}`}>
                        <Icon className="h-5 w-5" />
                        {category.title}
                        <Badge variant="outline" className={`${category.textColor} border-current`}>
                          {categoryAssets.length}
                        </Badge>
                      </CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {categoryAssets.map((asset) => (
                          <div
                            key={asset.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, asset.id)}
                            className="p-3 rounded-lg bg-background/70 border border-border/50 cursor-move hover:bg-background/90 transition-colors"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium">{asset.name}</h4>
                                <p className="text-sm text-muted-foreground">{asset.description}</p>
                                <p className="text-sm font-medium text-primary">
                                  ${asset.value.toLocaleString()}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeAsset(asset.id)}
                                className="text-muted-foreground hover:text-destructive"
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                            </div>
                            <Textarea
                              placeholder="Add notes..."
                              value={asset.notes}
                              onChange={(e) => updateAssetNotes(asset.id, e.target.value)}
                              className="mt-2 text-sm"
                              rows={2}
                            />
                          </div>
                        ))}
                        {categoryAssets.length === 0 && (
                          <div className="p-8 text-center text-muted-foreground border-2 border-dashed border-border/30 rounded-lg">
                            Drag assets here
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
            <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Valuation Impact
                </CardTitle>
                <CardDescription>Live preview of buyer discount</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Assets:</span>
                    <span className="font-medium">${impact.totalAssets.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Value Destroyers:</span>
                    <span className="font-medium text-red-400">${impact.destroyerValue.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Buyer Discount (20%):</span>
                    <span className="font-medium text-red-400">-${impact.discountAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Adjusted Valuation:</span>
                    <span className={impact.deltaFromBaseline < 0 ? 'text-red-400' : 'text-green-400'}>
                      ${impact.adjustedValuation.toLocaleString()}
                    </span>
                  </div>
                </div>

                {impact.deltaFromBaseline < 0 && (
                  <div className="p-4 rounded-lg bg-red-900/10 border border-red-400/20">
                    <p className="text-red-400 text-sm font-medium">
                      ⚠️ Value destroyers are reducing your valuation by ${Math.abs(impact.deltaFromBaseline).toLocaleString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Asset Summary</CardTitle>
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
                        <span className={`text-sm ${category.textColor}`}>{category.title}:</span>
                        <div className="text-right">
                          <div className="text-sm font-medium">{count} assets</div>
                          <div className="text-xs text-muted-foreground">${value.toLocaleString()}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Button className="w-full" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Analysis
            </Button>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default AssetWorkshopPage;