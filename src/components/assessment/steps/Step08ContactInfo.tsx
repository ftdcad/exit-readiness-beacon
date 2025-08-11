
import React, { useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

type Props = {
  value: {
    phone?: string;
    companyWebsite?: string;
    preferredContact?: "email"|"phone"|"either";
    howDidYouHear?: string;
  };
  onChange: (p: Props["value"]) => void;
  onNext: () => void;
  onBack: () => void;
};

// Validation helpers
const digits = (s: string) => (s || '').replace(/\D+/g, '');
const isValidUS = (s: string) => {
  const d = digits(s);
  return d.length === 10 || (d.length === 11 && d.startsWith('1'));
};
const toE164 = (s: string) => {
  const d = digits(s);
  if (d.length === 10) return `+1${d}`;
  if (d.length === 11 && d.startsWith('1')) return `+${d}`;
  return `+${d}`;
};

export default function Step08ContactInfo({ value, onChange, onNext, onBack }: Props) {
  const [phone, setPhone] = useState(value.phone ?? "");
  const [website, setWebsite] = useState(value.companyWebsite ?? "");
  const [preferred, setPreferred] = useState<Props["value"]["preferredContact"]>(value.preferredContact ?? "email");
  const [referral, setReferral] = useState(value.howDidYouHear ?? "");

  const [phoneError, setPhoneError] = useState("");
  const [websiteError, setWebsiteError] = useState("");
  const phoneRef = useRef<HTMLInputElement>(null);
  const websiteRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Clear previous errors
    setPhoneError("");
    setWebsiteError("");

    // Validate phone
    if (!phone.trim()) {
      setPhoneError("Phone is required.");
      phoneRef.current?.focus();
      return;
    }
    if (!isValidUS(phone)) {
      setPhoneError("Enter a valid US phone number.");
      phoneRef.current?.focus();
      return;
    }

    // Website optional. If provided, make sure it parses with scheme added
    let websiteNormalized = website.trim();
    if (websiteNormalized) {
      const test = /^[a-zA-Z][\w+.-]*:\/\//.test(websiteNormalized)
        ? websiteNormalized
        : `https://${websiteNormalized}`;
      try {
        const u = new URL(test);
        websiteNormalized = `${u.protocol}//${u.hostname}${u.pathname === '/' ? '' : u.pathname}${u.search}${u.hash}`;
      } catch {
        setWebsiteError("Enter a valid domain or URL.");
        websiteRef.current?.focus();
        return;
      }
    }

    // Build normalized payload
    const normalized = {
      phone: toE164(phone),
      companyWebsite: websiteNormalized || "",
      preferredContact: preferred,
      howDidYouHear: referral
    };

    onChange(normalized);
    onNext();
  }

  function handleWebsiteBlur() {
    const v = website.trim();
    if (!v) return; // optional
    
    // Normalize to https:// if valid
    try {
      const test = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(v) ? v : `https://${v}`;
      const u = new URL(test);
      const normalized = `${u.protocol}//${u.hostname}${u.pathname === '/' ? '' : u.pathname}${u.search}${u.hash}`;
      if (normalized !== v) {
        setWebsite(normalized);
      }
    } catch {
      // Leave as-is; validation will catch it on submit
      setWebsite(v);
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Contact Information</h2>
      <p className="text-sm text-muted-foreground">
        Final step. We will use this to follow up with your assessment results.
      </p>

      <Card className="p-4 space-y-6">
        <form noValidate onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                ref={phoneRef}
                type="text"
                inputMode="tel"
                placeholder="(386) 689-6896"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                aria-invalid={!!phoneError}
                className={cn(phoneError && "border-red-600 focus-visible:ring-red-600")}
              />
              {phoneError && <p className="mt-1 text-sm text-red-600">{phoneError}</p>}
            </div>

            <div>
              <Label htmlFor="companyWebsite">Company Website (Optional)</Label>
              <Input
                id="companyWebsite"
                ref={websiteRef}
                type="text"
                inputMode="url"
                autoComplete="url"
                placeholder="coastalclaims.net or https://coastalclaims.net"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                onBlur={handleWebsiteBlur}
                aria-invalid={!!websiteError}
                className={cn(websiteError && "border-red-600 focus-visible:ring-red-600")}
              />
              {websiteError && <p className="mt-1 text-sm text-red-600">{websiteError}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Preferred Contact Method *</Label>
            <div className="grid gap-2 md:grid-cols-3">
              <Button
                type="button"
                variant={preferred === "email" ? "default" : "outline"}
                onClick={() => setPreferred("email")}
              >
                Email
              </Button>
              <Button
                type="button"
                variant={preferred === "phone" ? "default" : "outline"}
                onClick={() => setPreferred("phone")}
              >
                Phone Call
              </Button>
              <Button
                type="button"
                variant={preferred === "either" ? "default" : "outline"}
                onClick={() => setPreferred("either")}
              >
                Either Email or Phone
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="referral">How did you hear about us? (Optional)</Label>
            <Select value={referral} onValueChange={setReferral}>
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Select an option</SelectItem>
                <SelectItem value="search">Search</SelectItem>
                <SelectItem value="referral">Referral</SelectItem>
                <SelectItem value="social">Social</SelectItem>
                <SelectItem value="event">Event</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button onClick={handleSubmit}>Next</Button>
      </div>
    </div>
  );
}
