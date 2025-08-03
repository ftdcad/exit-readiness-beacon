import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const assessmentQuestions = [
  {
    id: "customer-concentration",
    question: "What percentage of revenue comes from your largest customer?",
    type: "radio",
    options: ["Under 10%", "10-20%", "20-30%", "30-40%", "Over 40%"],
    dealKillerThreshold: 2,
    whyItMatters: "PE firms see >30% as major risk. They'll slash your multiple."
  },
  {
    id: "owner-dependency",
    question: "How many key decisions require YOUR personal approval?",
    type: "radio",
    options: ["Almost none", "Some operational", "Most operational", "Everything"],
    dealKillerThreshold: 2,
    whyItMatters: "If you ARE the business, buyers can't envision it without you."
  },
  {
    id: "management-depth",
    question: "If you disappeared for 3 months, what would happen?",
    type: "radio",
    options: ["Business runs smoothly", "Minor hiccups only", "Major issues arise", "Business would fail"],
    dealKillerThreshold: 2,
    whyItMatters: "No management team = no premium multiple."
  },
  {
    id: "financial-hygiene",
    question: "How 'clean' are your financials? (Select all that apply)",
    type: "checkbox",
    options: [
      "GAAP compliant books",
      "Monthly financials within 10 days",
      "Clean AR aging (90%+ current)",
      "No personal expenses in P&L",
      "3-year audited financials"
    ],
    dealKillerThreshold: 2,
    whyItMatters: "Messy books = longer due diligence = dead deals."
  },
  {
    id: "recurring-revenue",
    question: "What percentage of revenue is recurring/contracted?",
    type: "radio",
    options: ["Over 80%", "60-80%", "40-60%", "20-40%", "Under 20%"],
    dealKillerThreshold: 3,
    whyItMatters: "Recurring revenue gets 2-3x higher multiples than project work."
  },
  {
    id: "growth-trajectory",
    question: "Your revenue growth over the last 3 years?",
    type: "radio",
    options: ["20%+ annually", "10-20% annually", "5-10% annually", "Flat", "Declining"],
    dealKillerThreshold: 3,
    whyItMatters: "PE needs growth story. Flat = commodity multiple."
  },
  {
    id: "systems-processes",
    question: "Which critical processes are documented? (Select all that apply)",
    type: "checkbox",
    options: ["Sales process", "Service delivery", "Financial reporting", "HR/hiring", "IT/technology"],
    dealKillerThreshold: 3,
    whyItMatters: "No systems = no scale = no strategic buyer interest."
  }
];

export default function ExitReadinessAssessmentPage() {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (questionId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const calculateScore = () => {
    let totalScore = 0;
    let maxScore = 0;

    assessmentQuestions.forEach(question => {
      maxScore += question.options.length - 1;
      
      if (question.type === 'radio') {
        const answerIndex = question.options.indexOf(answers[question.id]);
        if (answerIndex !== -1) {
          totalScore += (question.options.length - 1 - answerIndex);
        }
      } else if (question.type === 'checkbox') {
        const checkedCount = answers[question.id]?.length || 0;
        totalScore += Math.min(checkedCount, question.options.length);
        maxScore = question.options.length; // Override for checkbox questions
      }
    });

    return Math.round((totalScore / maxScore) * 100);
  };

  const getScoreColor = (score: number) => {
    if (score >= 71) return 'text-green-600';
    if (score >= 41) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 71) return <CheckCircle className="h-6 w-6 text-green-600" />;
    if (score >= 41) return <AlertCircle className="h-6 w-6 text-yellow-600" />;
    return <AlertTriangle className="h-6 w-6 text-red-600" />;
  };

  const getScoreMessage = (score: number) => {
    if (score >= 71) return "You're in great shape. Let's optimize for maximum multiple.";
    if (score >= 41) return "You have work to do, but these are solvable in 90-180 days.";
    return "Your business has serious issues that will crush your valuation.";
  };

  const nextQuestion = () => {
    if (currentQuestion < assessmentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  if (showResults) {
    const score = calculateScore();
    
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Your Exit Readiness Score</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                {getScoreIcon(score)}
                <span className={`text-4xl font-bold ${getScoreColor(score)}`}>
                  {score}%
                </span>
              </div>
              <p className="text-lg text-muted-foreground mb-4">
                {getScoreMessage(score)}
              </p>
              <Progress value={score} className="h-3" />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Key Issues Identified:</h3>
              {assessmentQuestions.map(question => {
                const answer = answers[question.id];
                let isIssue = false;
                
                if (question.type === 'radio') {
                  const answerIndex = question.options.indexOf(answer);
                  isIssue = answerIndex >= question.dealKillerThreshold;
                } else if (question.type === 'checkbox') {
                  isIssue = (answer?.length || 0) < question.dealKillerThreshold;
                }

                if (isIssue) {
                  return (
                    <div key={question.id} className="p-3 border-l-4 border-red-500 bg-red-50">
                      <p className="font-medium text-red-800">{question.question}</p>
                      <p className="text-sm text-red-600">{question.whyItMatters}</p>
                    </div>
                  );
                }
                return null;
              })}
            </div>

            <div className="text-center pt-4">
              <Button asChild className="mr-4">
                <Link to="/portal/week-2/value-builder">
                  Build Your 90-Day Action Plan
                </Link>
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Retake Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const question = assessmentQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / assessmentQuestions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Exit Readiness Assessment</CardTitle>
            <span className="text-sm text-muted-foreground">
              {currentQuestion + 1} of {assessmentQuestions.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">{question.question}</h3>
            
            {question.type === 'radio' ? (
              <RadioGroup
                value={answers[question.id] || ''}
                onValueChange={(value) => handleAnswer(question.id, value)}
              >
                {question.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`${question.id}-${index}`} />
                    <Label htmlFor={`${question.id}-${index}`}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <div className="space-y-2">
                {question.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${question.id}-${index}`}
                      checked={answers[question.id]?.includes(option) || false}
                      onCheckedChange={(checked) => {
                        const current = answers[question.id] || [];
                        if (checked) {
                          handleAnswer(question.id, [...current, option]);
                        } else {
                          handleAnswer(question.id, current.filter((item: string) => item !== option));
                        }
                      }}
                    />
                    <Label htmlFor={`${question.id}-${index}`}>{option}</Label>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium text-muted-foreground">
              Why this matters:
            </p>
            <p className="text-sm">{question.whyItMatters}</p>
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            <Button
              onClick={nextQuestion}
              disabled={!answers[question.id] || (question.type === 'checkbox' && (!answers[question.id] || answers[question.id].length === 0))}
            >
              {currentQuestion === assessmentQuestions.length - 1 ? 'View Results' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}