import React, { useState, useMemo } from 'react';
import { Search, Heart, BookOpen, DollarSign, Scale, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  category: 'financial' | 'legal' | 'deal-structure' | 'operational';
  example?: string;
  relatedTerms?: string[];
  isFavorite?: boolean;
}

const glossaryTerms: GlossaryTerm[] = [
  {
    id: '1',
    term: 'EBITDA',
    definition: 'Earnings Before Interest, Taxes, Depreciation, and Amortization. A measure of a company\'s operating performance and cash flow generation.',
    category: 'financial',
    example: 'If your company has $2M in revenue, $1.5M in operating expenses, $100K in depreciation, your EBITDA would be $500K + $100K = $600K.',
    relatedTerms: ['Multiple', 'Adjusted EBITDA', 'Operating Cash Flow']
  },
  {
    id: '2',
    term: 'Multiple',
    definition: 'The ratio of enterprise value to EBITDA, used to value companies. Higher multiples indicate higher valuations.',
    category: 'financial',
    example: 'A 5x multiple on $1M EBITDA means your company is valued at $5M.',
    relatedTerms: ['EBITDA', 'Enterprise Value', 'Valuation']
  },
  {
    id: '3',
    term: 'Due Diligence',
    definition: 'The comprehensive review process where buyers examine all aspects of your business before finalizing a deal.',
    category: 'legal',
    example: 'PE firms will review your financial records, contracts, HR policies, and operations during a 60-90 day due diligence period.',
    relatedTerms: ['LOI', 'Management Presentation', 'Data Room']
  },
  {
    id: '4',
    term: 'Letter of Intent (LOI)',
    definition: 'A non-binding document outlining the key terms of a proposed acquisition, including valuation and deal structure.',
    category: 'legal',
    example: 'An LOI might offer $10M at 6x EBITDA with 70% cash and 30% rollover equity.',
    relatedTerms: ['Due Diligence', 'Purchase Agreement', 'Term Sheet']
  },
  {
    id: '5',
    term: 'Rollover Equity',
    definition: 'When the seller retains an ownership stake in the company post-acquisition, typically 10-30% of the transaction value.',
    category: 'deal-structure',
    example: 'In a $10M deal with 20% rollover, you\'d receive $8M cash and keep $2M worth of equity in the new entity.',
    relatedTerms: ['Management Rollover', 'Second Bite', 'Equity Participation']
  },
  {
    id: '6',
    term: 'Working Capital',
    definition: 'Current assets minus current liabilities. Represents the cash needed to run daily operations.',
    category: 'financial',
    example: 'If you have $500K in receivables and inventory, but owe $200K in payables, your working capital is $300K.',
    relatedTerms: ['Cash Flow', 'Current Assets', 'Operating Capital']
  },
  {
    id: '7',
    term: 'Management Presentation',
    definition: 'A detailed presentation to potential buyers showcasing your business model, growth strategy, and investment opportunity.',
    category: 'operational',
    example: 'A 20-slide deck covering market position, financials, growth drivers, and management team capabilities.',
    relatedTerms: ['Due Diligence', 'Investment Memorandum', 'Pitch Deck']
  },
  {
    id: '8',
    term: 'Add-Backs',
    definition: 'Non-recurring or owner-specific expenses added back to EBITDA to show normalized earning power.',
    category: 'financial',
    example: 'Adding back $50K in owner\'s personal expenses and $25K in one-time legal fees to increase EBITDA by $75K.',
    relatedTerms: ['Adjusted EBITDA', 'Normalization', 'Quality of Earnings']
  }
];

const categoryIcons = {
  financial: DollarSign,
  legal: Scale,
  'deal-structure': Settings,
  operational: BookOpen
};

const categoryColors = {
  financial: 'bg-green-100 text-green-800',
  legal: 'bg-blue-100 text-blue-800',
  'deal-structure': 'bg-purple-100 text-purple-800',
  operational: 'bg-orange-100 text-orange-800'
};

export function InteractiveGlossary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [favorites, setFavorites] = useState<string[]>([]);

  const filteredTerms = useMemo(() => {
    return glossaryTerms.filter(term => {
      const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          term.definition.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || term.category === selectedCategory;
      const matchesFavorites = selectedCategory === 'favorites' ? favorites.includes(term.id) : true;
      
      return matchesSearch && (matchesCategory || matchesFavorites);
    });
  }, [searchTerm, selectedCategory, favorites]);

  const toggleFavorite = (termId: string) => {
    setFavorites(prev => 
      prev.includes(termId) 
        ? prev.filter(id => id !== termId)
        : [...prev, termId]
    );
  };

  const categories = [
    { value: 'all', label: 'All Terms', count: glossaryTerms.length },
    { value: 'financial', label: 'Financial', count: glossaryTerms.filter(t => t.category === 'financial').length },
    { value: 'legal', label: 'Legal', count: glossaryTerms.filter(t => t.category === 'legal').length },
    { value: 'deal-structure', label: 'Deal Structure', count: glossaryTerms.filter(t => t.category === 'deal-structure').length },
    { value: 'operational', label: 'Operational', count: glossaryTerms.filter(t => t.category === 'operational').length },
    { value: 'favorites', label: 'Favorites', count: favorites.length }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">Interactive Glossary</h1>
        <p className="text-lg text-muted-foreground">
          Master the language of private equity and exit transactions
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search terms and definitions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          {categories.map((category) => (
            <TabsTrigger key={category.value} value={category.value} className="text-xs">
              {category.label} ({category.count})
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          {filteredTerms.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">
                  {searchTerm ? 'No terms found matching your search.' : 'No terms in this category yet.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredTerms.map((term) => {
                const CategoryIcon = categoryIcons[term.category];
                const isFavorited = favorites.includes(term.id);
                
                return (
                  <Card key={term.id} className="group hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <CategoryIcon className="h-5 w-5 text-muted-foreground" />
                          <CardTitle className="text-lg">{term.term}</CardTitle>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className={categoryColors[term.category]}>
                            {term.category.replace('-', ' ')}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleFavorite(term.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Heart 
                              className={`h-4 w-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} 
                            />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <CardDescription className="text-sm leading-relaxed">
                        {term.definition}
                      </CardDescription>
                      
                      {term.example && (
                        <div className="bg-muted/50 p-3 rounded-md">
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">Example:</span> {term.example}
                          </p>
                        </div>
                      )}
                      
                      {term.relatedTerms && term.relatedTerms.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-2">Related Terms:</p>
                          <div className="flex flex-wrap gap-1">
                            {term.relatedTerms.map((relatedTerm) => (
                              <Badge key={relatedTerm} variant="outline" className="text-xs">
                                {relatedTerm}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}