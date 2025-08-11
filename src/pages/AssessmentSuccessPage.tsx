
import { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, Mail, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto w-full">
        <Card className="glass-card border-border/50">
          <CardContent className="p-8 text-center space-y-6">
            {/* Success Icon */}
            <div className="flex justify-center">
              <div className="p-4 bg-success/20 rounded-full">
                <CheckCircle className="h-12 w-12 text-success" />
              </div>
            </div>

            {/* Main Message */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Assessment Submitted Successfully!</h1>
              <p className="text-foreground-secondary text-lg">
                Thank you for completing our PE Readiness Pre-Assessment.
              </p>
            </div>

            {/* Submission Details */}
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

            {/* Next Steps */}
            <div className="bg-background-hover/30 p-6 rounded-lg border border-border/20">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-accent" />
                What Happens Next?
              </h3>
              <div className="space-y-3 text-sm text-foreground-secondary text-left">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">1</div>
                  <p>Our team will analyze your responses and business profile</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">2</div>
                  <p>We'll prepare a comprehensive PE readiness report tailored to your business</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">3</div>
                  <p>You'll receive your personalized assessment within 24-48 hours</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">4</div>
                  <p>We'll contact you to discuss next steps and answer any questions</p>
                </div>
              </div>
            </div>

            {/* Contact Methods */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-background-hover/30 rounded-lg border border-border/20">
                <Mail className="h-5 w-5 text-accent" />
                <div className="text-left">
                  <p className="font-medium">Email Updates</p>
                  <p className="text-sm text-foreground-secondary">Check your inbox for our report</p>
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

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6">
              <Button 
                onClick={() => navigate('/portal')}
                className="bg-accent hover:bg-accent/90"
              >
                Access Portal
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/')}
              >
                Return to Home
              </Button>
            </div>

            {/* Security Note */}
            <div className="text-xs text-foreground-muted">
              <p>Your information is secure and confidential. We never share your data with third parties.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AssessmentSuccessPage;
