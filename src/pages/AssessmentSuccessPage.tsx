import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, Mail, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Step09ExitGoals } from '@/components/assessment/steps/Step09ExitGoals';
import { Step10BusinessReality } from '@/components/assessment/steps/Step10BusinessReality';
import { ScheduleConsultation } from '@/components/assessment/ScheduleConsultation';
import { saveAssessmentProgress } from '@/lib/data/assessment';

const AssessmentSuccessPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user actually completed assessment
    const assessmentData = localStorage.getItem('meridian_assessment_submitted');
    if (!assessmentData) {
      // Redirect to assessment if no completion record found
      navigate('/assessment');
    }
  }, [navigate]);

  const assessmentData = localStorage.getItem('meridian_assessment_submitted');
  const submissionInfo = assessmentData ? JSON.parse(assessmentData) : null;

  // New local state to drive Step 9 -> Step 10 -> Schedule flow
  type Stage = 'success' | 'step9' | 'step10' | 'schedule';
  const [stage, setStage] = useState<Stage>('success');

  // Capture step answers
  const [step9, setStep9] = useState<Record<string, any>>({});
  const [step10, setStep10] = useState<Record<string, any>>({});

  // For UX (progress percent and header text)
  const header = useMemo(() => {
    if (stage === 'success') return 'Assessment Submitted Successfully!';
    if (stage === 'step9') return 'Step 9: Exit Goals & Preferences';
    if (stage === 'step10') return 'Step 10: Business Reality Check';
    if (stage === 'schedule') return 'Schedule Consultation';
    return '';
  }, [stage]);

  // Helper to persist partial progress into assessment_submissions
  const savePartial = async () => {
    console.log('[assessment] savePartial called from success flow');
    await saveAssessmentProgress({
      step_9: step9,
      step_10: step10,
      // We do not have the original email here; it will be provided during scheduling
      email: null,
    });
  };

  // Handlers to move between stages
  const goStep9 = () => setStage('step9');
  const goStep10 = () => setStage('step10');
  const goSchedule = () => {
    window.dispatchEvent(new CustomEvent('analytics', { detail: { event: 'assessment_complete' } }));
    setStage('schedule');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-3xl mx-auto w-full">
        <Card className="glass-card border-border/50">
          <CardContent className="p-8 space-y-6">
            {stage === 'success' && (
              <>
                <div className="flex justify-center">
                  <div className="p-4 bg-success/20 rounded-full">
                    <CheckCircle className="h-12 w-12 text-success" />
                  </div>
                </div>

                <div className="space-y-2 text-center">
                  <h1 className="text-3xl font-bold">{header}</h1>
                  <p className="text-foreground-secondary text-lg">
                    Thank you for completing our PE Readiness Pre-Assessment.
                  </p>
                </div>

                {submissionInfo && (
                  <div className="bg-background-hover/50 p-4 rounded-lg border border-border/30">
                    <h3 className="font-semibold mb-2">Submission Details:</h3>
                    <div className="text-sm text-foreground-secondary space-y-1">
                      <p><strong>Company:</strong> {submissionInfo.companyName}</p>
                      <p><strong>Submitted:</strong> {new Date(submissionInfo.submittedAt).toLocaleString()}</p>
                      <p><strong>Reference ID:</strong> {submissionInfo.id}</p>
                    </div>
                  </div>
                )}

                <div className="bg-background-hover/30 p-6 rounded-lg border border-border/20">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-accent" />
                    What Happens Next?
                  </h3>
                  <div className="space-y-3 text-sm text-foreground-secondary text-left">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">1</div>
                      <p>Answer a few questions about your exit goals (Step 9)</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">2</div>
                      <p>Complete a quick business reality check (Step 10)</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">3</div>
                      <p>Schedule your free exit strategy consultation</p>
                    </div>
                  </div>
                </div>

                {/* Important: No portal links here to avoid security hole */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 justify-center">
                  <Button className="bg-accent hover:bg-accent/90" onClick={goStep9}>
                    Continue to Step 9
                  </Button>
                  <Button variant="outline" onClick={() => window.location.assign('/')}>
                    Return to Home
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div className="flex items-center gap-3 p-4 bg-background-hover/30 rounded-lg border border-border/20">
                    <Mail className="h-5 w-5 text-accent" />
                    <div className="text-left">
                      <p className="font-medium">Email Updates</p>
                      <p className="text-sm text-foreground-secondary">We'll send your next steps by email</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-background-hover/30 rounded-lg border border-border/20">
                    <Phone className="h-5 w-5 text-accent" />
                    <div className="text-left">
                      <p className="font-medium">Follow-up Call</p>
                      <p className="text-sm text-foreground-secondary">We'll call to discuss your results</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {stage === 'step9' && (
              <Step09ExitGoals
                value={step9}
                onChange={(p) => setStep9((prev) => ({ ...prev, ...p }))}
                onBack={() => setStage('success')}
                onNext={() => setStage('step10')}
                onSavePartial={savePartial}
              />
            )}

            {stage === 'step10' && (
              <Step10BusinessReality
                value={step10 as any}
                onChange={(p) => setStep10((prev) => ({ ...prev, ...p }))}
                onBack={() => setStage('step9')}
                onSavePartial={savePartial}
                onComplete={goSchedule}
              />
            )}

            {stage === 'schedule' && (
              <ScheduleConsultation
                emailDefault={null}
                submission={{
                  step_1_8: {}, // We don't have the full payload here; still OK to proceed
                  step_9: step9,
                  step_10: step10,
                  email: null,
                }}
                onSubmitted={() => {
                  // Optionally redirect to a thank-you or home after a short delay
                }}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AssessmentSuccessPage;
