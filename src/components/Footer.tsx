import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Phone, Mail, MapPin, Linkedin, Shield, Clock, Award } from "lucide-react";

const Footer = () => {
  const companyInfo = {
    name: "Exitus Advisory Group",
    tagline: "Strategic Exit Intelligence",
    phone: "(561) 555-0190",
    email: "inquiries@meridianadvisory.com",
    address: "Boca Raton, FL"
  };

  const credentials = [
    { icon: Award, text: "Certified Exit Planning Advisor" },
    { icon: Shield, text: "FINRA Licensed" },
    { icon: Clock, text: "15+ Years PE Experience" }
  ];

  const quickLinks = [
    { label: "Assessment Process", href: "#process" },
    { label: "About Our Team", href: "#team" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "#contact" }
  ];

  const legalLinks = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "NDA Template", href: "/nda" },
    { label: "Compliance", href: "/compliance" }
  ];

  return (
    <footer className="bg-background-card border-t border-border/50">
      <div className="container px-4 md:px-6">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {companyInfo.name}
                </h3>
                <p className="text-accent font-medium mb-4">{companyInfo.tagline}</p>
                <p className="text-foreground-secondary text-sm leading-relaxed">
                  Helping founders maximize exit value through comprehensive operational assessments 
                  and strategic advisory. Confidential, no-BS approach with proven results.
                </p>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-accent" />
                  <span className="text-foreground text-sm">{companyInfo.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-accent" />
                  <span className="text-foreground text-sm">{companyInfo.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-accent" />
                  <span className="text-foreground text-sm">{companyInfo.address}</span>
                </div>
              </div>

              {/* Credentials */}
              <div className="space-y-2">
                {credentials.map((credential, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <credential.icon className="h-4 w-4 text-success" />
                    <span className="text-foreground-secondary text-xs">{credential.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href}
                      className="text-foreground-secondary text-sm hover:text-accent transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Call to Action */}
            <div>
              <Card className="glass-card border-border/50 p-6">
                <h4 className="font-semibold text-foreground mb-3">Ready to Start?</h4>
                <p className="text-foreground-secondary text-sm mb-4">
                  Get your PE readiness assessment and maximize your exit value.
                </p>
                <Button className="w-full bg-accent hover:bg-accent/90 font-semibold button-shadow text-sm">
                  Schedule Assessment
                </Button>
                
              </Card>
            </div>
          </div>
        </div>

        <Separator className="bg-border/50" />

        {/* Bottom Footer */}
        <div className="py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="text-foreground-muted text-sm">
              © 2025 Exitus Advisory Group. All rights reserved.
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap gap-4">
              {legalLinks.map((link, index) => (
                <a 
                  key={index}
                  href={link.href}
                  className="text-foreground-muted text-sm hover:text-accent transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Social */}
            <div className="flex items-center gap-3">
              <a 
                href="#"
                className="p-2 bg-background-hover hover:bg-accent/20 rounded-lg transition-luxury"
              >
                <Linkedin className="h-4 w-4 text-foreground-secondary hover:text-accent transition-colors" />
              </a>
            </div>
          </div>
        </div>

        {/* Compliance Notice */}
        <div className="pb-4">
          <div className="bg-background-hover/50 border border-border/30 rounded-lg p-4">
            <p className="text-foreground-muted text-xs leading-relaxed">
              <strong>Important Disclosure:</strong> Exitus Advisory Group provides strategic advisory services. 
              We are not a registered investment advisor or broker-dealer. All assessments are for informational 
              purposes and do not constitute investment advice. Past performance does not guarantee future results. 
              Exit outcomes depend on market conditions and company-specific factors beyond our control.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;