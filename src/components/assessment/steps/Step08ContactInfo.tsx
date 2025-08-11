
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';

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
  
  const websiteRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // No validation - just proceed to next step
    console.log('Form submitted with data:', {
      firstName,
      lastName,
      email,
      phone,
      companyName,
      website,
      role
    });
    
    onNext();
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
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="John"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Smith"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@company.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="text"
            inputMode="tel"
            placeholder="(386) 689-6896"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name</Label>
          <Input
            id="companyName"
            type="text"
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
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Your Role</Label>
          <Select value={role} onValueChange={setRole}>
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
          <Button type="submit">
            Complete Assessment
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Step08ContactInfo;
