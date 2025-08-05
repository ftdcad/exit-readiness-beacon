import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Building2, TrendingUp, Users, DollarSign, Target, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ConsolidationOpportunity {
  id: string;
  industry: string;
  companies: Array<{
    id: string;
    name: string;
    revenue: number;
    ebitda: number;
    margin: number;
  }>;
  combinedRevenue: number;
  combinedEbitda: number;
  synergyPotential: number;
  consolidationScore: number;
  recommendedPlatform: string;
}

export function MarketMakerOpportunities() {
  const [opportunities, setOpportunities] = useState<ConsolidationOpportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOpportunities();
  }, []);

  const loadOpportunities = async () => {
    try {
      // Query companies by industry to identify consolidation plays
      const { data: companies } = await supabase
        .from('contact_inquiries')
        .select(`
          id,
          company_name,
          industry,
          annual_revenue,
          revenue_2023,
          revenue_2024,
          employee_count
        `)
        .not('industry', 'is', null)
        .not('annual_revenue', 'is', null);

      if (companies) {
        const groupedByIndustry = companies.reduce((acc, company) => {
          const industry = company.industry || 'Other';
          if (!acc[industry]) acc[industry] = [];
          
          // Estimate EBITDA (rough 15% margin assumption)
          const revenue = company.annual_revenue || 0;
          const ebitda = revenue * 0.15;
          
          acc[industry].push({
            id: company.id,
            name: company.company_name,
            revenue,
            ebitda,
            margin: 15
          });
          return acc;
        }, {} as Record<string, any[]>);

        // Identify consolidation opportunities (industries with 3+ small companies)
        const consolidationOps: ConsolidationOpportunity[] = Object.entries(groupedByIndustry)
          .filter(([_, companies]) => companies.length >= 3)
          .map(([industry, companies]) => {
            const combinedRevenue = companies.reduce((sum, c) => sum + c.revenue, 0);
            const combinedEbitda = companies.reduce((sum, c) => sum + c.ebitda, 0);
            const synergyPotential = combinedEbitda * 0.2; // 20% synergy assumption
            
            // Score based on fragmentation and size
            const avgCompanySize = combinedRevenue / companies.length;
            const fragmentation = companies.length;
            const consolidationScore = Math.min(100, (fragmentation * 10) + (avgCompanySize / 1000000 * 5));
            
            // Recommend largest company as platform
            const recommendedPlatform = companies.reduce((largest, current) => 
              current.revenue > largest.revenue ? current : largest
            ).name;

            return {
              id: industry,
              industry,
              companies: companies.sort((a, b) => b.revenue - a.revenue),
              combinedRevenue,
              combinedEbitda,
              synergyPotential,
              consolidationScore,
              recommendedPlatform
            };
          })
          .sort((a, b) => b.consolidationScore - a.consolidationScore)
          .slice(0, 5); // Top 5 opportunities

        setOpportunities(consolidationOps);
      }
    } catch (error) {
      console.error('Error loading opportunities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-green-500/20 text-green-400">High</Badge>;
    if (score >= 60) return <Badge className="bg-yellow-500/20 text-yellow-400">Medium</Badge>;
    return <Badge className="bg-red-500/20 text-red-400">Low</Badge>;
  };

  if (loading) {
    return (
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-6">
          <div className="text-center text-white/70">Loading consolidation opportunities...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Building2 className="w-5 h-5 text-purple-400" />
          Market Maker Opportunities
        </CardTitle>
        <CardDescription className="text-white/70">
          Industries ripe for consolidation plays
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {opportunities.length === 0 ? (
          <div className="text-center py-8 text-white/70">
            <Building2 className="w-12 h-12 mx-auto mb-4 text-white/40" />
            <p>No clear consolidation opportunities identified yet.</p>
            <p className="text-sm">Need more companies in same industries.</p>
          </div>
        ) : (
          opportunities.map((opportunity) => (
            <div
              key={opportunity.id}
              className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-white font-medium">{opportunity.industry}</h3>
                  <p className="text-white/70 text-sm">
                    {opportunity.companies.length} companies identified
                  </p>
                </div>
                {getScoreBadge(opportunity.consolidationScore)}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-1 text-white/70 text-xs mb-1">
                    <DollarSign className="w-3 h-3" />
                    Combined Revenue
                  </div>
                  <div className="text-white font-medium">
                    ${(opportunity.combinedRevenue / 1000000).toFixed(1)}M
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-white/70 text-xs mb-1">
                    <TrendingUp className="w-3 h-3" />
                    Combined EBITDA
                  </div>
                  <div className="text-white font-medium">
                    ${(opportunity.combinedEbitda / 1000000).toFixed(1)}M
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-white/70 text-xs mb-1">
                    <Target className="w-3 h-3" />
                    Synergy Potential
                  </div>
                  <div className="text-green-400 font-medium">
                    +${(opportunity.synergyPotential / 1000000).toFixed(1)}M
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-white/70 text-xs mb-1">
                    <Users className="w-3 h-3" />
                    Target Count
                  </div>
                  <div className="text-white font-medium">
                    {opportunity.companies.length}
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <div className="text-white/70 text-xs mb-2">
                  Recommended Platform: <span className="text-white font-medium">{opportunity.recommendedPlatform}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {opportunity.companies.slice(0, 4).map((company) => (
                    <Badge
                      key={company.id}
                      variant="outline"
                      className="text-xs bg-white/5 border-white/20 text-white/80"
                    >
                      {company.name} (${(company.revenue / 1000000).toFixed(1)}M)
                    </Badge>
                  ))}
                  {opportunity.companies.length > 4 && (
                    <Badge variant="outline" className="text-xs bg-white/5 border-white/20 text-white/60">
                      +{opportunity.companies.length - 4} more
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs text-white/60">
                  Consolidation Score: {opportunity.consolidationScore.toFixed(0)}/100
                </div>
                <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
                  <Eye className="w-4 h-4 mr-1" />
                  View Details
                </Button>
              </div>
            </div>
          ))
        )}

        {opportunities.length > 0 && (
          <div className="mt-4 p-3 bg-purple-500/20 border border-purple-500/30 rounded-lg">
            <div className="flex items-start gap-2">
              <Building2 className="w-4 h-4 text-purple-400 mt-0.5" />
              <div className="text-sm text-white/90">
                <strong>Pro Tip:</strong> Industries with {opportunities.length > 0 && opportunities[0].companies.length}+ 
                fragmented players often present the best roll-up opportunities. 
                Focus on the largest player as your platform company.
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}