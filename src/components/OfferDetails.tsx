import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Users, FileText, TrendingUp, Shield, Calendar, DollarSign, Key } from "lucide-react";

const OfferDetails = () => {
  const deliverables = [
    {
      icon: FileText,
      title: "Comprehensive Assessment Report",
      description: "Detailed analysis with financial modeling and operational benchmarking"
    },
    {
      icon: TrendingUp,
      title: "Exit Readiness Score",
      description: "Quantified rating (1-10) across 6 critical dimensions with specific improvement roadmap"
    },
    {
      icon: Users,
      title: "Management Team Evaluation",
      description: "Leadership depth analysis and organizational structure recommendations"
    },
    {
      icon: Shield,
      title: "Risk Mitigation Plan",
      description: "Identified vulnerabilities with prioritized action items and timeline"
    }
  ];

  const timeline = [
    { week: "Week 1", activity: "Financial & Operational Foundation", description: "P&L analysis, KPI benchmarking, unit economics review, process mapping, efficiency analysis, scalability evaluation" },
    { week: "Week 2", activity: "Management & Market Analysis", description: "Leadership interviews, team structure analysis, positioning analysis, growth opportunity assessment" },
    { week: "Week 3", activity: "Risk & Compliance Deep Dive", description: "Legal, regulatory, and operational risk evaluation, vulnerability assessment, compliance gap analysis" },
    { week: "Week 4", activity: "Report & Strategic Presentation", description: "Final report delivery, strategic discussion, and actionable roadmap presentation" }
  ];

  const pricingFeatures = [
    "No retainer or hourly billing",
    "$1,000 down to start assessment", 
    "$4,000 due at completion",
    "Includes 2-hour strategy session"
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container px-4 md:px-6">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <Badge className="bg-accent/20 text-accent border-accent/30">
            4-Week Assessment Program
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold">
            What You Get in Your <span className="text-accent">PE Readiness Assessment</span>
          </h2>
          <p className="text-foreground-secondary text-lg max-w-2xl mx-auto">
            Get a free initial assessment teaser, then proceed with our comprehensive 4-week evaluation designed to identify gaps, maximize valuation, and position your company for a successful exit.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Deliverables */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <FileText className="h-6 w-6 text-accent" />
                Core Deliverables
              </h3>
              <div className="space-y-4">
                {deliverables.map((item, index) => (
                  <Card key={index} className="glass-card border-border/50 hover:border-accent/30 transition-luxury">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-accent/20 rounded-lg">
                          <item.icon className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">{item.title}</h4>
                          <p className="text-foreground-secondary text-sm">{item.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Pricing Card */}
            <Card className="glass-card border-accent/30 luxury-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <DollarSign className="h-6 w-6 text-success" />
                  Investment & Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-6 bg-gradient-to-br from-accent/10 to-success/10 rounded-lg border border-accent/20">
                  <div className="text-4xl font-bold text-accent mb-2">$5,000</div>
                  <div className="text-foreground-secondary">$1,000 Down • $4,000 at Completion</div>
                </div>
                
                <div className="space-y-3">
                  {pricingFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                      <span className="text-foreground-secondary text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button className="w-full bg-success hover:bg-success/90 font-semibold button-shadow">
                  Schedule Assessment Call
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right: Timeline */}
          <div>
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Calendar className="h-6 w-6 text-accent" />
                4-Week Timeline: The 6 Keys to Get You There
              </h3>
            
            <div className="space-y-6">
              {timeline.map((phase, index) => (
                <div key={index} className="relative">
                  {/* Timeline Line */}
                  {index < timeline.length - 1 && (
                    <div className="absolute left-6 top-12 w-0.5 h-16 bg-border" />
                  )}
                  
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-accent/20 rounded-full border-2 border-accent/30">
                      <Key className="h-5 w-5 text-accent" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-foreground">{phase.week}</h4>
                        <Badge variant="outline" className="border-accent/30 text-accent">
                          {phase.activity}
                        </Badge>
                      </div>
                      <p className="text-foreground-secondary text-sm leading-relaxed">
                        {phase.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Info */}
            <Card className="mt-8 glass-card border-border/50">
              <CardContent className="p-6">
                <h4 className="font-semibold text-foreground mb-3">What Makes Us Different</h4>
                <div className="space-y-2 text-sm text-foreground-secondary">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    <span>We've sat in the buyer's chair — Private equity perspective — we know exactly what buyers look for, and how they exploit what you don't prepare.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    <span>Hands-on operators, not spreadsheet tourists — We've run businesses, led exits, and felt what it's like to hand over the keys — this isn't theoretical.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    <span>Recommendations you can actually execute — No vague consulting fluff. You'll get punch-list steps you can act on immediately.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    <span>We've done this from both sides — Veteran sellers and embedded buyer-side advisors — we know what happens in those closed-door calls you'll never hear.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    <span>Insider knowledge you won't find online — This isn't scraped blog advice or recycled checklists — it's the stuff you only learn after someone's been burned.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    <span>Zero theory, 100% deal reality — Our frameworks are built in the field, not a classroom. If it doesn't matter in diligence, we don't waste your time on it.</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OfferDetails;