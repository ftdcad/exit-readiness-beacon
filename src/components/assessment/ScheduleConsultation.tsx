
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { submitConsultation } from '@/lib/data/assessment';
import { useToast } from '@/hooks/use-toast';

type Props = {
  emailDefault?: string | null;
  submission: {
    step_1_8?: any;
    step_9?: any;
    step_10?: any;
    email?: string | null;
  };
  onSubmitted?: () => void;
};

export const ScheduleConsultation: React.FC<Props> = ({ emailDefault, submission, onSubmitted }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState(emailDefault ?? submission.email ?? '');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'done' | 'error'>('idle');
  const { toast } = useToast();

  async function handleSubmit() {
    setStatus('saving');
    try {
      await submitConsultation({
        submission,
        name,
        email,
        phone,
        notes,
      });
      setStatus('done');
      toast({
        title: 'Consultation requested',
        description: 'Thanks! We will reach out to confirm a time.',
      });
      window.dispatchEvent(new CustomEvent('analytics', { detail: { event: 'consultation_requested' } }));
      onSubmitted?.();
    } catch (e) {
      console.error('[assessment] Consultation submit failed:', e);
      setStatus('error');
      toast({
        title: 'Submission failed',
        description: 'Please try again.',
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold">Schedule Your Free Exit Strategy Consultation</h2>
          <p className="text-sm text-muted-foreground mt-1">
            We will review your assessment and reach out to confirm a time.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </div>
          <div>
            <label className="text-sm">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div>
            <label className="text-sm">Phone</label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(555) 555-5555" />
          </div>
          <div>
            <label className="text-sm">Notes</label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Anything we should know before the call" />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Button onClick={handleSubmit} disabled={status === 'saving' || status === 'done'}>
            {status === 'saving' ? 'Submitting...' : status === 'done' ? 'Submitted' : 'Submit Request'}
          </Button>
          <Button variant="outline" onClick={() => window.location.assign('/')}>Back to Home</Button>
        </div>

        {status === 'error' && <p className="text-destructive mt-2">Something went wrong. Please try again.</p>}
        {status === 'done' && <p className="text-success mt-2">Thanks. We will reach out shortly.</p>}
      </Card>
    </div>
  );
};
