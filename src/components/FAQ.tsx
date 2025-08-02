import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HelpCircle, MessageCircle, Calendar, Shield } from "lucide-react";

const FAQ = () => {
  const faqs = [
    {
      question: "What exactly should I expect from this $5,000 assessment?",
      answer: (
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex gap-3">
              <span className="text-accent font-bold">•</span>
              <div>
                <span className="font-bold">Plain English Translation</span>: We translate complex legal and financial jargon into terms you actually understand
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-accent font-bold">•</span>
              <div>
                <span className="font-bold">Preparation Timeline</span>: We help you understand what needs to happen when, so you're not scrambling at the last minute
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-accent font-bold">•</span>
              <div>
                <span className="font-bold">Hidden Cost Awareness</span>: We explain the real costs coming your way - not just the obvious fees
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-accent font-bold">•</span>
              <div>
                <span className="font-bold">Post-Closing Reality</span>: We prepare you for what life actually looks like after the deal closes
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-accent font-bold">•</span>
              <div>
                <span className="font-bold">Process Guidance</span>: We explain what it means when lawyers, bankers, and buyers say certain things
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-accent font-bold">•</span>
              <div>
                <span className="font-bold">Cost-Benefit Mathematics</span>: We help you understand the real math behind decisions that could cost or save you millions
              </div>
            </div>
          </div>
          <div className="pt-2 border-t border-border/30">
            <p className="text-sm italic text-foreground-muted">
              This is educational preparation, not financial or legal advice - just founder-to-founder translation of what these deals actually mean.
            </p>
          </div>
        </div>
      )
    },
    {
      question: "How confidential is this process?",
      answer: "Absolutely confidential. All participants sign mutual NDAs before any information is shared. We've worked with 100+ companies and have never had a confidentiality breach. Your sensitive business data is encrypted and stored securely, with access limited only to your dedicated assessment team."
    },
    {
      question: "What size companies do you typically work with?",
      answer: "Our sweet spot is companies with $5M-$100M annual revenue, though we've successfully assessed businesses from $2M to $500M. The key factors are growth trajectory, profitability potential, and genuine exit intent within 2-3 years."
    },
    {
      question: "How is this different from hiring an investment banker?",
      answer: "This happens before you hire a banker. We identify and fix operational gaps that could derail your process or reduce valuation. Think of it as 'pre-due diligence' - we find the issues buyers will find, but give you time to address them first."
    },
    {
      question: "What if I'm not ready to exit for 2-3 years?",
      answer: "Perfect timing. The assessment creates a roadmap for becoming PE-ready. Most improvements take 12-24 months to implement properly. Starting early gives you the best chance to maximize valuation when you do decide to go to market."
    },
    {
      question: "Do you guarantee results?",
      answer: "While we can't guarantee exit outcomes due to market variables, our track record shows 94% of assessed companies successfully complete their exit process. We focus on delivering thorough, actionable insights based on our extensive PE experience."
    },
    {
      question: "What documents do I need to provide?",
      answer: "Financial statements (3 years), management reports, org charts, customer data, and operational metrics. We'll provide a detailed checklist after our initial call. Most founders already have 80% of what we need."
    },
    {
      question: "How many spots are available each month?",
      answer: "We limit ourselves to 5 assessments per month to ensure quality and attention. Once we're booked, there's typically a 4-6 week waiting list. High-growth companies get priority scheduling."
    }
  ];

  const contactOptions = [
    {
      icon: Calendar,
      title: "Schedule a Call",
      description: "15-minute intro call to discuss your situation",
      action: "Book Call",
      urgent: true
    },
    {
      icon: MessageCircle,
      title: "Email Questions",
      description: "Get answers within 4 hours",
      action: "Send Email",
      urgent: false
    },
    {
      icon: Shield,
      title: "Request NDA",
      description: "Confidential discussion about your business",
      action: "Get NDA",
      urgent: false
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Frequently Asked <span className="text-accent">Questions</span>
            </h2>
            <p className="text-foreground-secondary text-lg">
              Get answers to common questions about our PE readiness assessment process.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* FAQ Accordion */}
            <div className="lg:col-span-2">
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`item-${index}`}
                    className="glass-card border-border/50 rounded-lg px-6"
                  >
                    <AccordionTrigger className="text-left font-semibold text-foreground hover:text-accent transition-colors py-6">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-foreground-secondary leading-relaxed pb-6">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Contact Options */}
            <div className="space-y-6">
              <Card className="glass-card border-border/50 sticky top-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-accent" />
                    Still Have Questions?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {contactOptions.map((option, index) => (
                    <div 
                      key={index} 
                      className={`p-4 rounded-lg border transition-luxury hover:border-accent/30 ${
                        option.urgent ? 'bg-accent/10 border-accent/20' : 'bg-background-hover border-border/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          option.urgent ? 'bg-accent/20' : 'bg-background-card'
                        }`}>
                          <option.icon className={`h-4 w-4 ${
                            option.urgent ? 'text-accent' : 'text-foreground-secondary'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground text-sm mb-1">
                            {option.title}
                          </h4>
                          <p className="text-foreground-secondary text-xs mb-3">
                            {option.description}
                          </p>
                          <Button 
                            size="sm" 
                            className={`w-full text-xs ${
                              option.urgent 
                                ? 'bg-accent hover:bg-accent/90 button-shadow' 
                                : 'bg-background-card hover:bg-background-hover border border-border/50'
                            }`}
                          >
                            {option.action}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                </CardContent>
              </Card>

              {/* Trust Signal */}
              <Card className="glass-card border-border/50">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-accent mb-2">24 Hour</div>
                  <div className="text-sm text-foreground-secondary mb-4">
                    Response guarantee for all inquiries
                  </div>
                  <div className="text-xs text-foreground-muted">
                    Confidential consultation • No sales pressure • Honest assessment
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;