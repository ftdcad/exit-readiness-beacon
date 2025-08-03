import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { ChevronRight, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

// Complete assessment configuration
const ExitReadinessAssessmentConfig = {
  title: "Exit Readiness Assessment",
  subtitle: "Let's see how PE-ready your business really is",
  
  questions: [
    {
      id: "customer-concentration",
      question: "What percentage of revenue comes from your largest customer?",
      type: "select",
      options: [
        { label: "Under 10%", value: 0, score: 100 },
        { label: "10-20%", value: 1, score: 80 },
        { label: "20-30%", value: 2, score: 50 },
        { label: "30-40%", value: 3, score: 20 },
        { label: "Over 40%", value: 4, score: 0 }
      ],
      redFlag: 3,
      impact: "High",
      fixPath: "customer-diversification",
      timeToFix: "90 days",
      buyerView: "PE sees >30% as major risk. They'll slash your multiple by 20-40%."
    },
    {
      id: "owner-dependency",
      question: "How many key decisions require YOUR personal approval?",
      type: "select",
      options: [
        { label: "Almost none", value: 0, score: 100 },
        { label: "Some operational", value: 1, score: 70 },
        { label: "Most operational", value: 2, score: 30 },
        { label: "Everything", value: 3, score: 0 }
      ],
      redFlag: 2,
      impact: "High",
      fixPath: "management-building",
      timeToFix: "180 days",
      buyerView: "If you ARE the business, buyers can't envision it without you."
    },
    {
      id: "management-depth",
      question: "If you disappeared for 3 months, what would happen?",
      type: "select",
      options: [
        { label: "Business runs smoothly", value: 0, score: 100 },
        { label: "Minor hiccups only", value: 1, score: 70 },
        { label: "Major issues arise", value: 2, score: 30 },
        { label: "Business would fail", value: 3, score: 0 }
      ],
      redFlag: 2,
      impact: "High",
      fixPath: "leadership-development",
      timeToFix: "180 days",
      buyerView: "No management team = no premium multiple. PE needs leadership continuity."
    },
    {
      id: "financial-hygiene",
      question: "How 'clean' are your financials?",
      type: "multiselect",
      options: [
        { label: "GAAP compliant books", value: 0, score: 20 },
        { label: "Monthly financials within 10 days", value: 1, score: 20 },
        { label: "Clean AR aging (90%+ current)", value: 2, score: 20 },
        { label: "No personal expenses in P&L", value: 3, score: 20 },
        { label: "3-year audited financials", value: 4, score: 20 }
      ],
      redFlag: 2, // Less than 2 selected
      impact: "Medium",
      fixPath: "financial-cleanup",
      timeToFix: "90 days",
      buyerView: "Messy books = longer due diligence = dead deals. Clean financials speed everything up."
    },
    {
      id: "recurring-revenue",
      question: "What percentage of revenue is recurring/contracted?",
      type: "select",
      options: [
        { label: "Over 80%", value: 0, score: 100 },
        { label: "60-80%", value: 1, score: 80 },
        { label: "40-60%", value: 2, score: 60 },
        { label: "20-40%", value: 3, score: 30 },
        { label: "Under 20%", value: 4, score: 0 }
      ],
      redFlag: 3,
      impact: "Medium",
      fixPath: "revenue-model-shift",
      timeToFix: "180 days",
      buyerView: "Recurring revenue gets 2-3x higher multiples than project work."
    },
    {
      id: "growth-trajectory",
      question: "Your revenue growth over the last 3 years?",
      type: "select",
      options: [
        { label: "20%+ annually", value: 0, score: 100 },
        { label: "10-20% annually", value: 1, score: 75 },
        { label: "5-10% annually", value: 2, score: 50 },
        { label: "Flat", value: 3, score: 25 },
        { label: "Declining", value: 4, score: 0 }
      ],
      redFlag: 3,
      impact: "Medium",
      fixPath: "growth-acceleration",
      timeToFix: "90 days",
      buyerView: "PE needs growth story. Flat = commodity multiple. Growth = premium valuation."
    },
    {
      id: "systems-processes",
      question: "Which critical processes are documented?",
      type: "multiselect",
      options: [
        { label: "Sales process", value: 0, score: 20 },
        { label: "Service delivery", value: 1, score: 20 },
        { label: "Financial reporting", value: 2, score: 20 },
        { label: "HR/hiring", value: 3, score: 20 },
        { label: "IT/technology", value: 4, score: 20 }
      ],
      redFlag: 3, // Less than 3 documented
      impact: "Low",
      fixPath: "process-documentation",
      timeToFix: "90 days",
      buyerView: "No systems = no scale = no strategic buyer interest. Documentation enables growth."
    }
  ],
  
  weights: {
    "customer-concentration": 20,
    "owner-dependency": 20,
    "management-depth": 15,
    "financial-hygiene": 15,
    "recurring-revenue": 15,
    "growth-trajectory": 10,
    "systems-processes": 5
  },
  
  resultsFramework: {
    "0-40": {
      label: "Critical Gaps",
      message: "You've got gaps—but they're fixable with focus.",
      color: "red",
      icon: XCircle
    },
    "41-70": {
      label: "Fixable Risks",
      message: "You're not far off. A focused 90-day plan could substantially improve your valuation.",
      color: "yellow",
      icon: AlertCircle
    },
    "71-100": {
      label: "Exit Ready",
      message: "You're in the strike zone. Time to push for a premium.",
      color: "green",
      icon: CheckCircle2
    }
  }
};

export default function ExitReadinessAssessmentPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [showResults, setShowResults] = useState(false);
  const [saving, setSaving] = useState(false);
  const [score, setScore] = useState(0);

  const questions = ExitReadinessAssessmentConfig.questions;
  const question = questions[currentQuestion];

  // Calculate score whenever answers change
  useEffect(() => {
    calculateScore();
  }, [answers]);

  const calculateScore = () => {
    let totalScore = 0;
    let totalWeight = 0;

    questions.forEach((q) => {
      const weight = ExitReadinessAssessmentConfig.weights[q.id] || 0;
      const answer = answers[q.id];
      
      if (answer !== undefined) {
        let questionScore = 0;
        
        if (q.type === 'select') {
          const option = q.options.find(o => o.value === answer);
          questionScore = option?.score || 0;
        } else if (q.type === 'multiselect' && Array.isArray(answer)) {
          // For multiselect, sum the scores of selected options
          questionScore = answer.reduce((sum, val) => {
            const option = q.options.find(o => o.value === val);
            return sum + (option?.score || 0);
          }, 0);
        }
        
        totalScore += (questionScore * weight) / 100;
        totalWeight += weight;
      }
    });

    const finalScore = totalWeight > 0 ? Math.round(totalScore) : 0;
    setScore(finalScore);
  };

  const handleAnswer = (value: any) => {
    if (question.type === 'multiselect') {
      const currentValues = answers[question.id] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v: any) => v !== value)
        : [...currentValues, value];
      setAnswers({ ...answers, [question.id]: newValues });
    } else {
      setAnswers({ ...answers, [question.id]: value });
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
      saveAssessment();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const saveAssessment = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("exit_readiness_assessments").upsert({
        user_id: user.id,
        answers,
        score,
        assessment_version: "1.0",
        completed_at: new Date().toISOString()
      });
      if (error) throw error;
      toast.success("Assessment saved!");
    } catch (err) {
      toast.error("Failed to save assessment");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const getResultCategory = () => {
    if (score <= 40) return ExitReadinessAssessmentConfig.resultsFramework["0-40"];
    if (score <= 70) return ExitReadinessAssessmentConfig.resultsFramework["41-70"];
    return ExitReadinessAssessmentConfig.resultsFramework["71-100"];
  };

  const getRedFlagCount = () => {
    let count = 0;
    questions.forEach((q) => {
      const answer = answers[q.id];
      if (q.type === 'select' && answer >= q.redFlag) {
        count++;
      } else if (q.type === 'multiselect' && Array.isArray(answer) && answer.length < q.redFlag) {
        count++;
      }
    });
    return count;
  };

  if (showResults) {
    const result = getResultCategory();
    const ResultIcon = result.icon;
    const redFlags = getRedFlagCount();

    return (
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Your Exit Readiness Score</h1>
            <div className="flex justify-center items-center gap-4 mb-8">
              <ResultIcon className={`w-16 h-16 ${
                result.color === 'red' ? 'text-destructive' : 
                result.color === 'yellow' ? 'text-yellow-500' : 
                'text-green-500'
              }`} />
              <div className="text-6xl font-bold text-foreground">{score}%</div>
            </div>
            <div className={`inline-block px-6 py-3 rounded-full text-lg font-semibold ${
              result.color === 'red' ? 'bg-destructive/20 text-destructive' :
              result.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-600' :
              'bg-green-500/20 text-green-600'
            }`}>
              {result.label}
            </div>
            <p className="text-muted-foreground mt-6 text-lg max-w-2xl mx-auto">{result.message}</p>
            {redFlags > 0 && (
              <p className="text-destructive mt-4">You have {redFlags} critical issues that need immediate attention.</p>
            )}
          </div>

          <div className="space-y-6 mb-12">
            <h2 className="text-2xl font-bold text-foreground">Your Key Issues</h2>
            {questions.map((q) => {
              const answer = answers[q.id];
              const isRedFlag = (q.type === 'select' && answer >= q.redFlag) || 
                                (q.type === 'multiselect' && Array.isArray(answer) && answer.length < q.redFlag);
              
              if (isRedFlag) {
                return (
                  <div key={q.id} className="bg-destructive/10 border border-destructive/30 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <AlertCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-2">{q.question}</h3>
                        <p className="text-muted-foreground mb-3">{q.buyerView}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-destructive">Impact: {q.impact}</span>
                          <span className="text-muted-foreground">Time to fix: {q.timeToFix}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => navigate("/portal/week-2/value-builder")}
              className="flex-1 bg-primary text-primary-foreground py-4 px-6 rounded-lg hover:bg-primary/90 transition flex items-center justify-center gap-2"
            >
              Build Your 90-Day Plan <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => window.print()}
              className="bg-secondary text-secondary-foreground py-4 px-6 rounded-lg hover:bg-secondary/80 transition"
            >
              Export Report
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{ExitReadinessAssessmentConfig.title}</h1>
          <p className="text-muted-foreground">{ExitReadinessAssessmentConfig.subtitle}</p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Question {currentQuestion + 1} of {questions.length}</span>
            <span className="text-sm text-muted-foreground">{Math.round(((currentQuestion + 1) / questions.length) * 100)}% complete</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-card border rounded-xl p-8 backdrop-blur-sm">
          <h2 className="text-xl font-semibold text-foreground mb-6">{question.question}</h2>

          {question.type === 'select' ? (
            <div className="space-y-3">
              {question.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className={`w-full text-left px-6 py-4 rounded-lg transition ${
                    answers[question.id] === option.value
                      ? "bg-primary/20 border border-primary/50 text-foreground"
                      : "bg-muted border border-border text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {question.options.map((option) => {
                const isSelected = (answers[question.id] || []).includes(option.value);
                return (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(option.value)}
                    className={`w-full text-left px-6 py-4 rounded-lg transition flex items-center gap-3 ${
                      isSelected
                        ? "bg-primary/20 border border-primary/50 text-foreground"
                        : "bg-muted border border-border text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      isSelected ? "bg-primary border-primary" : "border-muted-foreground"
                    }`}>
                      {isSelected && <CheckCircle2 className="w-3 h-3 text-primary-foreground" />}
                    </div>
                    {option.label}
                  </button>
                );
              })}
            </div>
          )}

          <div className="mt-8 p-4 bg-primary/10 border border-primary/30 rounded-lg">
            <p className="text-sm text-primary flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              {question.buyerView}
            </p>
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={
              question.type === 'select' ? answers[question.id] === undefined :
              !answers[question.id] || answers[question.id].length === 0
            }
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {currentQuestion === questions.length - 1 ? 'See Results' : 'Next'} 
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}