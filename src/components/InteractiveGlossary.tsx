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
    definition: 'Earnings Before Interest, Taxes, Depreciation, Amortization. Your operating profit before financing and non-cash expenses. The #1 metric buyers use.',
    category: 'financial',
    example: 'A company with $2M revenue, $1.5M operating expenses has $500K EBITDA.',
    relatedTerms: ['Add-Backs', 'Multiple', 'Quality of Earnings']
  },
  {
    id: '2',
    term: 'Multiple (Valuation Multiple)',
    definition: 'What buyers pay relative to EBITDA. "5x multiple" = paying 5 times annual EBITDA. Higher margins = higher multiples.',
    category: 'financial',
    example: 'A 5x multiple on $1M EBITDA values the business at $5M.',
    relatedTerms: ['EBITDA', 'Platform Company', 'Enterprise Value']
  },
  {
    id: '3',
    term: 'Due Diligence',
    definition: 'The buyer\'s deep investigation of your business. Expect requests for every document imaginable. Full disclosure prevents problems later.',
    category: 'legal',
    example: 'Reviewing 3 years of financial statements, customer contracts, and operational procedures.',
    relatedTerms: ['Quality of Earnings', 'Reps & Warranties', 'Management Presentation']
  },
  {
    id: '4',
    term: 'LOI (Letter of Intent)',
    definition: 'Non-binding offer outlining price and terms. Once signed, you enter exclusive negotiations. Not final but sets the framework.',
    category: 'legal',
    example: 'An LOI proposing $10M purchase price with 30-day exclusivity period.',
    relatedTerms: ['Purchase Agreement', 'Due Diligence', 'Closing']
  },
  {
    id: '5',
    term: 'Working Capital',
    definition: 'The difference between current assets and current liabilities, representing the short-term financial health and liquidity of a business.',
    category: 'financial',
    example: 'Current assets of $500K minus current liabilities of $300K equals $200K working capital.',
    relatedTerms: ['Working Capital Adjustment', 'Cash Flow', 'Operating Capital']
  },
  {
    id: '6',
    term: 'Rollover Equity',
    definition: 'Keeping ownership stake in new company structure. Selling 80% for cash, rolling 20% into HoldCo for future upside.',
    category: 'deal-structure',
    example: 'Selling 80% for $8M cash while rolling over 20% equity in the new structure.',
    relatedTerms: ['Holding Company', 'Earnout', 'Pro Rata']
  },
  {
    id: '7',
    term: 'Management Presentation',
    definition: 'A comprehensive presentation by the management team to potential buyers, covering business overview, financials, growth opportunities, and strategic vision.',
    category: 'operational',
    example: 'A 30-slide deck covering company history, market position, financial performance, and growth strategy.',
    relatedTerms: ['Due Diligence', 'Management Meeting', 'Business Overview']
  },
  {
    id: '8',
    term: 'Add-Backs',
    definition: 'Expenses added back to profit to show "normalized" EBITDA. Common examples: owner\'s excessive salary, personal vehicle, one-time legal fees. If you paid yourself $300K but market rate is $150K, that $150K difference is an add-back.',
    category: 'financial',
    example: 'Adding back $50K in owner\'s personal expenses and $25K in one-time legal fees to increase EBITDA by $75K.',
    relatedTerms: ['EBITDA', 'Quality of Earnings', 'Normalization']
  },
  {
    id: '9',
    term: 'SBA-backed PE',
    definition: 'Atypical private equity structure using Small Business Administration loans instead of direct investor capital. Unlike typical PE (which uses direct investor money with no strings attached), SBA-backed deals require the seller to stay 1-2 years, have lower down payments, and must follow specific SBA rules.',
    category: 'deal-structure',
    example: 'Typical PE: Buyer puts down $3M cash from investors. SBA-backed PE: Buyer puts down $1M cash + $2M SBA loan, but you must stay 18 months to help transition.',
    relatedTerms: ['Search Fund/ETA', 'LBO', 'Platform Company']
  },
  {
    id: '10',
    term: 'Bolt-On Acquisition',
    definition: 'A smaller company ($500K-$2M EBITDA) added to a platform company. Keeps some identity but operates under platform control. Gets lower multiples (3.5-5x) than platforms.',
    category: 'deal-structure',
    example: 'Platform company buys a $1M EBITDA bolt-on at 4x multiple for $4M to expand into new geography.',
    relatedTerms: ['Platform Company', 'Tuck-In Acquisition', 'Roll-Up']
  },
  {
    id: '11',
    term: 'Closing',
    definition: 'The day ownership transfers and money changes hands. You sign docs, get paid (minus escrow), and hand over the keys.',
    category: 'legal',
    example: 'Closing day: Sign purchase agreement, receive $8.5M wire (with $1.5M held in escrow), transfer ownership.',
    relatedTerms: ['Escrow/Holdback', 'Working Capital Adjustment', 'Reps & Warranties']
  },
  {
    id: '12',
    term: 'Covenants',
    definition: 'Promises to do or not do something. Example: You promise not to compete for 3 years post-sale. These are legally binding.',
    category: 'legal',
    example: 'Non-compete covenant preventing you from starting a similar business for 3 years in same market.',
    relatedTerms: ['Reps & Warranties', 'Indemnification', 'Purchase Agreement']
  },
  {
    id: '13',
    term: 'Earnout',
    definition: 'Part of purchase price paid later IF business hits targets. Example: $8M now + $2M if you hit $X revenue next year. Risky for sellers.',
    category: 'deal-structure',
    example: '$8M at closing + $2M earnout if company achieves $15M revenue in Year 1.',
    relatedTerms: ['Rollover Equity', 'Escrow/Holdback', 'KPI']
  },
  {
    id: '14',
    term: 'Escrow/Holdback',
    definition: 'Money held back from purchase price (usually 10-15%) for 12-18 months to cover potential claims. You get it back if no issues arise.',
    category: 'deal-structure',
    example: '$10M sale with $1.5M held in escrow for 18 months to cover potential warranty breaches.',
    relatedTerms: ['Indemnification', 'Reps & Warranties', 'RWI']
  },
  {
    id: '15',
    term: 'Holding Company (HoldCo)',
    definition: 'Parent company created to own your business. If you roll equity, you own shares in HoldCo, which owns the operating company.',
    category: 'deal-structure',
    example: 'PE creates HoldCo to own your operating company; you roll 20% equity into HoldCo shares.',
    relatedTerms: ['Rollover Equity', 'LBO', 'Corporate Structure']
  },
  {
    id: '16',
    term: 'Indemnification',
    definition: 'Your promise to pay buyer back if certain problems arise post-sale. Usually capped at a % of purchase price.',
    category: 'legal',
    example: 'You indemnify buyer for tax issues up to $1M (10% of purchase price) for 3 years.',
    relatedTerms: ['Reps & Warranties', 'Escrow/Holdback', 'RWI']
  },
  {
    id: '17',
    term: 'KPI (Key Performance Indicator)',
    definition: 'Important metrics that track business health. Examples: monthly recurring revenue, customer churn rate, gross margin.',
    category: 'operational',
    example: 'Monthly recurring revenue growing 15% year-over-year, customer churn rate below 5%.',
    relatedTerms: ['EBITDA', 'Quality of Earnings', 'Earnout']
  },
  {
    id: '18',
    term: 'Leveraged Buyout (LBO)',
    definition: 'Acquisition using mostly debt. The company takes on loans to finance its own purchase. Expect big interest payments post-close.',
    category: 'deal-structure',
    example: '$10M acquisition using $3M equity + $7M debt secured by company assets.',
    relatedTerms: ['SBA-backed PE', 'Holding Company', 'Platform Company']
  },
  {
    id: '19',
    term: 'Platform Company',
    definition: 'The main company PE builds around in an industry. Gets highest multiples (5-7x+). Expected to help integrate future acquisitions.',
    category: 'deal-structure',
    example: 'PE buys HVAC company at 6x multiple as platform, then adds bolt-ons at 4x multiples.',
    relatedTerms: ['Bolt-On Acquisition', 'Multiple', 'Roll-Up']
  },
  {
    id: '20',
    term: 'Pro Rata',
    definition: '"In proportion to ownership." If you own 20% and company needs $100K, your pro rata share is $20K.',
    category: 'deal-structure',
    example: 'Company raises $500K; your 15% ownership means $75K pro rata investment opportunity.',
    relatedTerms: ['Rollover Equity', 'Holding Company', 'Equity Participation']
  },
  {
    id: '21',
    term: 'QoE (Quality of Earnings)',
    definition: 'Deep financial analysis to verify your EBITDA is real and sustainable. Like an audit focused on cash flow quality.',
    category: 'financial',
    example: 'QoE finds $200K in non-recurring revenue, reducing adjusted EBITDA from $1.2M to $1M.',
    relatedTerms: ['EBITDA', 'Add-Backs', 'Due Diligence']
  },
  {
    id: '22',
    term: 'Redlining',
    definition: 'Marking up contracts with proposed changes. Normal part of negotiations. Each side redlines until agreement reached.',
    category: 'legal',
    example: 'Buyer redlines purchase agreement to extend due diligence period from 30 to 45 days.',
    relatedTerms: ['Purchase Agreement', 'LOI', 'Legal Review']
  },
  {
    id: '23',
    term: 'Reps & Warranties',
    definition: 'Your promises about the business being true. "No lawsuits," "taxes are paid," etc. If wrong, triggers indemnification.',
    category: 'legal',
    example: 'Warranty that financial statements are accurate; representation that all taxes are current.',
    relatedTerms: ['Indemnification', 'Escrow/Holdback', 'Due Diligence']
  },
  {
    id: '24',
    term: 'Roll-Up',
    definition: 'Strategy of buying multiple companies in same industry to create one larger entity. Your company becomes part of bigger platform.',
    category: 'deal-structure',
    example: 'PE buys 5 regional HVAC companies and combines them into one $50M revenue platform.',
    relatedTerms: ['Platform Company', 'Bolt-On Acquisition', 'Consolidation Strategy']
  },
  {
    id: '25',
    term: 'RWI (Reps & Warranties Insurance)',
    definition: 'Insurance that covers breaches instead of you paying from escrow. Good for sellers - reduces personal risk.',
    category: 'legal',
    example: '$1M RWI policy covers warranty breaches, allowing lower escrow and faster release.',
    relatedTerms: ['Reps & Warranties', 'Escrow/Holdback', 'Indemnification']
  },
  {
    id: '26',
    term: 'Search Fund/ETA',
    definition: 'Individual entrepreneur raising money to buy and run one business. Common for $1-5M EBITDA deals. Often SBA-backed.',
    category: 'deal-structure',
    example: 'MBA graduate raises $3M search fund to buy and operate a manufacturing company.',
    relatedTerms: ['SBA-backed PE', 'Platform Company', 'Entrepreneurship Through Acquisition']
  },
  {
    id: '27',
    term: 'Tuck-In Acquisition',
    definition: 'Tiny company (<$500K EBITDA) completely absorbed into platform. Lowest multiples (2-3.5x). You\'re bought for customers, not systems.',
    category: 'deal-structure',
    example: 'Platform buys $300K EBITDA company at 3x multiple purely for customer list integration.',
    relatedTerms: ['Platform Company', 'Bolt-On Acquisition', 'Customer Acquisition']
  },
  {
    id: '28',
    term: 'Working Capital Adjustment',
    definition: 'Post-closing true-up ensuring business has normal operating cash. Like agreeing on gas in tank when selling a car.',
    category: 'financial',
    example: 'Normal working capital is $200K; at closing it\'s $150K, so purchase price reduced by $50K.',
    relatedTerms: ['Working Capital', 'Closing', 'Purchase Price Adjustment']
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
      
      if (selectedCategory === 'favorites') {
        return matchesSearch && favorites.includes(term.id);
      }
      
      if (selectedCategory === 'all') {
        return matchesSearch;
      }
      
      return matchesSearch && term.category === selectedCategory;
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