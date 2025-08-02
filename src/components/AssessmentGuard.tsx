import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, AlertCircle } from 'lucide-react';
import { NDAGate } from './NDAGate';
import { useNDASubmission } from '@/hooks/useNDASubmission';

interface AssessmentGuardProps {
  children: React.ReactNode;
}

export const AssessmentGuard: React.FC<AssessmentGuardProps> = ({ children }) => {
  const [showNDA, setShowNDA] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { checkNDAStatus } = useNDASubmission();

  useEffect(() => {
    const ndaStatus = checkNDAStatus();
    setIsAuthorized(!!ndaStatus);
  }, []);

  const handleNDAClose = () => {
    setShowNDA(false);
    // Recheck status after NDA modal closes
    const ndaStatus = checkNDAStatus();
    setIsAuthorized(!!ndaStatus);
  };

  if (isAuthorized) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <Card className="max-w-md mx-auto glass-card border-border/50">
        <CardContent className="p-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="p-4 bg-accent/20 rounded-full">
              <Lock className="h-8 w-8 text-accent" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-bold">NDA Required</h3>
            <p className="text-foreground-secondary">
              This assessment contains confidential information. Please sign our NDA to continue.
            </p>
          </div>

          <div className="flex flex-col gap-2 p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Protected Content</span>
            </div>
            <p className="text-xs text-orange-600 dark:text-orange-400">
              Our assessment methodology and frameworks are proprietary and require confidentiality protection.
            </p>
          </div>

          <Button 
            onClick={() => setShowNDA(true)}
            className="w-full bg-accent hover:bg-accent/90 font-semibold"
          >
            Sign NDA & Continue
          </Button>
        </CardContent>
      </Card>

      {showNDA && <NDAGate onClose={handleNDAClose} />}
    </div>
  );
};