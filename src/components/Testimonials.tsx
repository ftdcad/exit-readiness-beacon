import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Quote, Star, TrendingUp } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      title: "CEO & Founder",
      company: "TechFlow Solutions",
      industry: "SaaS",
      exitValue: "$47M",
      testimonial: "The assessment revealed operational gaps we didn't even know existed. Fixed 3 critical issues before our PE process - ended up getting 2x the valuation we originally expected.",
      rating: 5,
      outcome: "Successful PE Exit"
    },
    {
      name: "Marcus Rodriguez",
      title: "Founder",
      company: "LogiChain Pro",
      industry: "Supply Chain",
      exitValue: "$23M",
      testimonial: "Meridian's report became our roadmap for the next 18 months. Every recommendation was spot-on. Our buyers were impressed with how 'PE-ready' we were.",
      rating: 5,
      outcome: "Strategic Acquisition"
    },
    {
      name: "Jennifer Kim",
      title: "Co-Founder & COO",
      company: "HealthTech Innovations",
      industry: "Healthcare",
      exitValue: "In Process",
      testimonial: "Still 6 months out from our exit, but the operational improvements we've made based on their assessment have already increased our EBITDA by 40%. Best $5K we've ever spent.",
      rating: 5,
      outcome: "PE Process Ongoing"
    }
  ];

  const metrics = [
    { label: "Average Valuation Increase", value: "73%", icon: TrendingUp },
    { label: "Successful Exits", value: "94%", icon: Star },
    { label: "Time to Close", value: "-45%", icon: TrendingUp },
  ];

  return (
    <section className="py-16 bg-background-card">
      <div className="container px-4 md:px-6">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            Real Results from <span className="text-accent">Real Founders</span>
          </h2>
          <p className="text-foreground-secondary text-lg max-w-2xl mx-auto">
            See how our PE readiness assessments have helped founders maximize their exit outcomes.
          </p>
        </div>

        {/* Metrics */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {metrics.map((metric, index) => (
            <Card key={index} className="glass-card border-border/50 text-center">
              <CardContent className="p-6">
                <div className="flex items-center justify-center mb-3">
                  <div className="p-3 bg-accent/20 rounded-full">
                    <metric.icon className="h-6 w-6 text-accent" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-accent mb-2">{metric.value}</div>
                <div className="text-foreground-secondary text-sm">{metric.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="glass-card border-border/50 hover:border-accent/30 transition-luxury h-full">
              <CardContent className="p-6 h-full flex flex-col">
                {/* Quote Icon */}
                <div className="flex items-center justify-between mb-4">
                  <Quote className="h-8 w-8 text-accent/40" />
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                    ))}
                  </div>
                </div>

                {/* Testimonial Text */}
                <blockquote className="text-foreground-secondary text-sm leading-relaxed mb-6 flex-1">
                  "{testimonial.testimonial}"
                </blockquote>

                {/* Author Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-accent/20 text-accent font-semibold">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      <div className="text-foreground-secondary text-sm">{testimonial.title}</div>
                      <div className="text-foreground-muted text-xs">{testimonial.company}</div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="border-accent/30 text-accent text-xs">
                      {testimonial.industry}
                    </Badge>
                    <Badge variant="outline" className="border-success/30 text-success text-xs">
                      {testimonial.outcome}
                    </Badge>
                    {testimonial.exitValue !== "In Process" && (
                      <Badge variant="outline" className="border-warning/30 text-warning text-xs">
                        Exit: {testimonial.exitValue}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <div className="inline-flex flex-col items-center gap-4 p-8 bg-gradient-to-br from-accent/10 to-success/10 rounded-2xl border border-accent/20">
            <h3 className="text-xl font-semibold text-foreground">
              Ready to Join These Success Stories?
            </h3>
            <p className="text-foreground-secondary text-sm max-w-md">
              Get your PE readiness assessment and position your company for maximum exit value.
            </p>
            <div className="flex gap-3">
              <button className="px-6 py-3 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-lg button-shadow transition-luxury">
                Start Your Assessment
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;