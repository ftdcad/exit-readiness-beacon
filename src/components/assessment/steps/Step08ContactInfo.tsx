import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { useContactSubmission } from '@/hooks/useContactSubmission';

interface Step08ContactInfoProps {
  onNext: () => void;
  onPrevious: () => void;
}

const Step08ContactInfo: React.FC<Step08ContactInfoProps> = ({ onNext, onPrevious }) => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [website, setWebsite] = useState('');
  const [role, setRole] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [websiteError, setWebsiteError] = useState('');
  const [globalError, setGlobalError] = useState('');
  
  const websiteRef = useRef<HTMLInputElement>(null);
  const { submitContact, isSubmitting } = useContactSubmission();

  const isValidUS = (str: string) => {
    return /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/.test(str);
  };

  const toE164 = (str: string) => {
    const cleaned = (str || "").replace(/\D+/g, "");
    if (cleaned.length > 10) {
      return `+1${cleaned.substring(0, 11)}`;
    }
    return `+1${cleaned}`;
  };

  const normalizePhone = (value: string) => {
    const cleanedValue = value.replace(/\D/g, '');
    let formattedValue = '';
  
    if (cleanedValue.length > 0) {
      formattedValue += '(' + cleanedValue.substring(0, 3);
    }
    if (cleanedValue.length > 3) {
      formattedValue += ') ' + cleanedValue.substring(3, 6);
    }
    if (cleanedValue.length > 6) {
      formattedValue += '-' + cleanedValue.substring(6, 10);
    }
  
    return formattedValue;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError('');
    setWebsiteError('');
    setGlobalError('');

    // Validate phone
    if (!isValidUS(phone)) {
      setPhoneError("Enter a valid US phone number.");
      document.getElementById('phone')?.focus();
      return;
    }

    // Website validation (optional)
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
        document.getElementById('companyWebsite')?.focus();
        return;
      }
    }

    // Create contact data in the format expected by submitContact
    const contactData = {
      companyName,
      industry: 'Unknown', // Default value
      founded: '2020', // Default value
      employees: '1-10', // Default value
      revenue2025: '0',
      revenue2024: '0',
      revenue2023: '0',
      revenue2022: '0',
      investmentType: 'Unknown',
      entityType: 'Unknown',
      ownershipType: 'Unknown',
      owners: [],
      pnlAvailability: 'Unknown',
      taxReturnsAvailability: 'Unknown',
      balanceSheetsAvailability: 'Unknown',
      exitTimeline: 'Unknown',
      exitType: 'Unknown',
      currentChallenges: 'Unknown',
      email,
      phone: toE164(phone),
      companyWebsite: websiteNormalized || undefined,
      preferredContact: 'email',
      jobTitle: role
    };

    try {
      const result = await submitContact(contactData);
      if (result.success) {
        onNext();
      } else {
        setGlobalError("Could not submit. Please try again.");
      }
    } catch (err: any) {
      setGlobalError(err?.message || "Could not submit. Please try again.");
    }
  };

  return (
    <Card className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Contact Information</h2>
        <p className="text-muted-foreground">
          Let's get your contact details to personalize your assessment results.
        </p>
      </div>

      {/* Temporary Skip Button */}
      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800 mb-3">
          <strong>Temporary:</strong> Skip form validation and go directly to Executive Discovery Interview
        </p>
        <Button 
          variant="outline" 
          onClick={() => navigate('/portal/week-4/executive-discovery')}
          className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border-yellow-300"
        >
          Skip to Executive Discovery Interview →
        </Button>
      </div>

      <form noValidate onSubmit={handleSubmit} className="space-y-6">
        {globalError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{globalError}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="John"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Smith"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@company.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="text"
            inputMode="tel"
            placeholder="(386) 689-6896"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          {phoneError && <p className="mt-1 text-sm text-red-600">{phoneError}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name *</Label>
          <Input
            id="companyName"
            type="text"
            required
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Acme Corporation"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyWebsite">Company Website (Optional)</Label>
          <Input
            id="companyWebsite"
            ref={websiteRef}
            type="text"
            inputMode="url"
            placeholder="coastalclaims.net or https://coastalclaims.net"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            onBlur={() => {
              const v = website.trim();
              if (!v) return;
              try {
                const test = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(v) ? v : `https://${v}`;
                const u = new URL(test);
                setWebsite(`${u.protocol}//${u.hostname}${u.pathname === '/' ? '' : u.pathname}${u.search}${u.hash}`);
                setWebsiteError('');
              } catch {
                setWebsite(v);
              }
            }}
          />
          {websiteError && <p className="mt-1 text-sm text-red-600">{websiteError}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Your Role *</Label>
          <Select value={role} onValueChange={setRole} required>
            <SelectTrigger>
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="owner">Business Owner</SelectItem>
              <SelectItem value="ceo">CEO</SelectItem>
              <SelectItem value="president">President</SelectItem>
              <SelectItem value="cfo">CFO</SelectItem>
              <SelectItem value="partner">Partner</SelectItem>
              <SelectItem value="other">Other Executive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-between pt-6">
          <Button type="button" variant="outline" onClick={onPrevious}>
            Previous
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Complete Assessment'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Step08ContactInfo;
