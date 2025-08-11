
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import Step08ContactInfo from './assessment/steps/Step08ContactInfo';
import { Step09ExitGoals } from './assessment/steps/Step09ExitGoals';
import { Step10BusinessReality } from './assessment/steps/Step10BusinessReality';
import { useContactSubmission } from '@/hooks/useContactSubmission';

const PreAssessmentForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const { submitContact, isSubmitting } = useContactSubmission();

  const totalSteps = 10;
  const progress = (currentStep / totalSteps) * 100;

  // No validation - always allow next step
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete assessment - no validation needed
      navigate('/assessment-success');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 8:
        return (
          <Step08ContactInfo
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 9:
        return (
          <Step09ExitGoals
            value={{}}
            onChange={() => {}}
            onNext={handleNext}
            onBack={handlePrevious}
          />
        );
      case 10:
        return (
          <Step10BusinessReality
            value={{}}
            onChange={() => {}}
            onBack={handlePrevious}
            onComplete={handleNext}
          />
        );
      default:
        // For steps 1-7, just show a simple form with Next button
        return (
          <div className="p-8 space-y-6">
            <h2 className="text-2xl font-bold">Step {currentStep}</h2>
            <p>This is step {currentStep} content. Click Next to continue.</p>
            <div className="flex justify-between pt-6">
              {currentStep > 1 && (
                <button 
                  type="button" 
                  onClick={handlePrevious}
                  className="px-4 py-2 border rounded"
                >
                  Previous
                </button>
              )}
              <button 
                type="button" 
                onClick={handleNext}
                className="px-4 py-2 bg-blue-500 text-white rounded ml-auto"
              >
                Next
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-4">Business Assessment</h1>
        <div className="space-y-2">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-gray-600 text-center">
            Step {currentStep} of {totalSteps}
          </p>
        </div>
      </div>

      {renderStep()}
    </div>
  );
};

export default PreAssessmentForm;
