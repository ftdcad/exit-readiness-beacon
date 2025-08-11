
import React, { useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { normalizePhone, validatePhone, normalizeUrl, validateUrlLoose } from "@/lib/validation/contact";

type Props = {
  value: {
    phone?: string;            // whatever you were storing before
    companyWebsite?: string;   // optional
    preferredContact?: "email"|"phone"|"either";
    howDidYouHear?: string;
  };
  onChange: (p: Props["value"]) => void;
  onNext: () => void;
  onBack: () => void;
};

export default function Step08ContactInfo({ value, onChange, onNext, onBack }: Props) {
  const [phone, setPhone] = useState(value.phone ?? "");
  const [website, setWebsite] = useState(value.companyWebsite ?? "");
  const [preferred, setPreferred] = useState<Props["value"]["preferredContact"]>(value.preferredContact ?? "email");
  const [referral, setReferral] = useState(value.howDidYouHear ?? "");

  const [errors, setErrors] = useState<Partial<Record<"phone"|"website", string>>>({});
  const phoneRef = useRef<HTMLInputElement>(null);
  const websiteRef = useRef<HTMLInputElement>(null);

  function focusFirstError(map: typeof errors) {
    if (map.phone) {
      phoneRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      phoneRef.current?.focus();
      return;
    }
    if (map.website) {
      websiteRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      websiteRef.current?.focus();
    }
  }

  function validate() {
    const nextErrors: typeof errors = {};

    // Phone is required but flexible. Accept (386) 689-6896, 386-689-6896, 3866896896, 1-386...
    if (!phone.trim()) {
      nextErrors.phone = "Phone is required.";
    } else if (!validatePhone(phone)) {
      nextErrors.phone = "Enter a valid US phone number.";
    }

    // Website is OPTIONAL. If provided, accept domain, www.domain, or full URL.
    if (website.trim()) {
      if (!validateUrlLoose(website)) {
        nextErrors.website = "Enter a valid domain or URL (example: coastalclaims.net or https://coastalclaims.net).";
      }
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      focusFirstError(nextErrors);
      return false;
    }
    return true;
  }

  function handleNext() {
    if (!validate()) return;

    const normalized = {
      phone: normalizePhone(phone),                     // stores +13866896896
      companyWebsite: website.trim() ? normalizeUrl(website) : "", // stores https://coastalclaims.net
      preferredContact: preferred,
      howDidYouHear: referral
    };

    onChange(normalized);
    onNext();
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Contact Information</h2>
      <p className="text-sm text-muted-foreground">
        Final step. We will use this to follow up with your assessment results.
      </p>

      <Card className="p-4 space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              ref={phoneRef}
              type="text"                 // not "tel" with strict pattern
              inputMode="tel"
              placeholder="(386) 689-6896"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              aria-invalid={!!errors.phone}
              className={cn(errors.phone && "border-red-600 focus-visible:ring-red-600")}
            />
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
          </div>

          <div>
            <Label htmlFor="website">Company Website (Optional)</Label>
            <Input
              id="website"
              ref={websiteRef}
              type="text"                 // not "url" so "www..." and domains are allowed
              inputMode="url"
              autoComplete="url"
              placeholder="coastalclaims.net or https://coastalclaims.net"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              onBlur={() => {
                // Soft normalization on blur if valid
                if (website.trim() && validateUrlLoose(website)) {
                  const v = normalizeUrl(website);
                  if (v !== website) setWebsite(v);
                }
              }}
              aria-invalid={!!errors.website}
              className={cn(errors.website && "border-red-600 focus-visible:ring-red-600")}
            />
            {errors.website && <p className="mt-1 text-sm text-red-600">{errors.website}</p>}
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
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button onClick={handleNext}>Next</Button>
      </div>
    </div>
  );
}
