import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, TrendingUp, Target, ChevronRight, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AssessmentQuestion {
  id: string;
  question: string;
  options: { value: string; label: string; weight: { quick: number; value: number; strategic: number } }[];
}

interface PathResult {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  timeline: string;
  icon: any;
  color: string;
  highlights: string[];
}

const questions: AssessmentQuestion[] = [
  {
    id: 'urgency',
    question: 'How quickly do you need to exit your business?',
    options: [
      { value: 'asap', label: 'As soon as possible (within 12 months)', weight: { quick: 3, value: 1, strategic: 0 } },
      { value: 'moderate', label: 'Within 18-24 months', weight: { quick: 1, value: 3, strategic: 2 } },
      { value: 'flexible', label: 'I have 2+ years to plan', weight: { quick: 0, value: 2, strategic: 3 } }
    ]
  },
  {
    id: 'involvement',
    question: 'How much time can you dedicate to improving your business?',
    options: [
      { value: 'minimal', label: 'Very little - I want a hands-off approach', weight: { quick: 3, value: 0, strategic: 0 } },
      { value: 'moderate', label: 'Some time for key improvements', weight: { quick: 1, value: 3, strategic: 2 } },
      { value: 'full', label: 'Significant time for major growth', weight: { quick: 0, value: 1, strategic: 3 } }
    ]
  },
  {
    id: 'risk',
    question: 'What is your risk tolerance?',
    options: [
      { value: 'low', label: 'Conservative - I prefer certainty', weight: { quick: 3, value: 2, strategic: 0 } },
      { value: 'medium', label: 'Moderate - Some risk for better returns', weight: { quick: 1, value: 3, strategic: 2 } },
      { value: 'high', label: 'Aggressive - High risk, high reward', weight: { quick: 0, value: 1, strategic: 3 } }
    ]
  },
  {
    id: 'capital',
    question: 'Do you have capital available for business improvements?',
    options: [
      { value: 'none', label: 'No additional capital available', weight: { quick: 3, value: 1, strategic: 0 } },
      { value: 'some', label: 'Some capital for targeted improvements', weight: { quick: 1, value: 3, strategic: 2 } },
      { value: 'significant', label: 'Significant capital for major initiatives', weight: { quick: 0, value: 2, strategic: 3 } }
    ]
  },
  {
    id: 'goals',
    question: 'What is your primary exit goal?',
    options: [
      { value: 'liquidity', label: 'Quick liquidity for personal reasons', weight: { quick: 3, value: 1, strategic: 0 } },
      { value: 'maximize', label: 'Maximize value with reasonable effort', weight: { quick: 0, value: 3, strategic: 2 } },
      { value: 'legacy', label: 'Build something bigger and more valuable', weight: { quick: 0, value: 1, strategic: 3 } }
    ]
  }
];

const pathResults: PathResult[] = [
  {
    id: 'quick',
    title: 'Quick Exit',
    subtitle: 'Sell as-is in 6-12 months',
    description: 'Get to market quickly with minimal preparation. Best for owners who need immediate liquidity or want a hands-off approach.',
    timeline: '6-12 months',
    icon: Clock,
    color: 'orange',
    highlights: [
      'Fastest path to liquidity',
      'Minimal time investment required',
      'Predictable timeline',
      'Less preparation needed'
    ]
  },
  {
    id: 'value',
    title: 'Value Building',
    subtitle: 'Improve first, then sell in 18-24 months',
    description: 'Make strategic improvements to increase business value before sale. Balanced approach between effort and return.',
    timeline: '18-24 months',
    icon: TrendingUp,
    color: 'blue',
    highlights: [
      'Significant value increase potential',
      'Proven improvement strategies',
      'Manageable time commitment',
      'Higher sale multiples'
    ]
  },
  {
    id: 'strategic',
    title: 'Strategic Growth',
    subtitle: 'Build something bigger over 2-3 years',
    description: 'Transform your business into a market leader through strategic initiatives. Highest potential return for committed owners.',
    timeline: '2-3 years',
    icon: Target,
    color: 'purple',
    highlights: [
      'Maximum value creation',
      'Market leadership position',
      'Premium buyer interest',
      'Legacy building opportunity'
    ]
  }
];

export default function PathDiscoveryPage() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [recommendedPath, setRecommendedPath] = useState<string>('');

  const handleAnswer = (questionId: string, value: string) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateRecommendation(newAnswers);
    }
  };

  const calculateRecommendation = (finalAnswers: Record<string, string>) => {
    const scores = { quick: 0, value: 0, strategic: 0 };

    questions.forEach(question => {
      const answer = finalAnswers[question.id];
      const option = question.options.find(opt => opt.value === answer);
      if (option) {
        scores.quick += option.weight.quick;
        scores.value += option.weight.value;
        scores.strategic += option.weight.strategic;
      }
    });

    const maxScore = Math.max(scores.quick, scores.value, scores.strategic);
    let recommended = 'value'; // default

    if (scores.quick === maxScore) recommended = 'quick';
    else if (scores.strategic === maxScore) recommended = 'strategic';

    setRecommendedPath(recommended);
    setShowResults(true);
  };

  const resetAssessment = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setRecommendedPath('');
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-foreground mb-2">Your Recommended Exit Path</h1>
            <p className="text-muted-foreground">Based on your responses, here's the best approach for your situation</p>
          </div>

          <div className="grid gap-6 mb-8">
            {pathResults.map(path => {
              const Icon = path.icon;
              const isRecommended = path.id === recommendedPath;
              
              return (
                <Card key={path.id} className={`p-6 transition-all ${
                  isRecommended 
                    ? 'ring-2 ring-primary shadow-lg bg-primary/5' 
                    : 'hover:shadow-md'
                }`}>
                  {isRecommended && (
                    <div className="bg-primary text-primary-foreground text-sm px-3 py-1 rounded-full w-fit mb-4">
                      ⭐ Recommended for You
                    </div>
                  )}
                  
                  <div className="flex items-start gap-6">
                    <div className={`w-16 h-16 bg-${path.color}-500/20 rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-8 h-8 text-${path.color}-500`} />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-foreground mb-1">{path.title}</h3>
                      <p className="text-lg text-muted-foreground mb-3">{path.subtitle}</p>
                      <p className="text-foreground mb-4">{path.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                        {path.highlights.map((highlight, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{highlight}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Timeline: </span>
                          <span className="text-sm font-semibold text-foreground">{path.timeline}</span>
                        </div>
                        
                        {isRecommended && (
                          <Button onClick={() => navigate('/portal/schedule-consultation')} className="gap-2">
                            Get Started
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="bg-accent/50 border border-border rounded-xl p-6 text-center">
            <h3 className="text-xl font-semibold text-foreground mb-2">Ready to Move Forward?</h3>
            <p className="text-muted-foreground mb-4">
              Schedule a consultation to discuss your {pathResults.find(p => p.id === recommendedPath)?.title.toLowerCase()} strategy in detail.
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate('/portal/schedule-consultation')} size="lg">
                Schedule Strategy Session
              </Button>
              <Button variant="outline" onClick={resetAssessment}>
                Retake Assessment
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-foreground">Exit Path Discovery</h1>
            <span className="text-sm text-muted-foreground">
              {currentQuestion + 1} of {questions.length}
            </span>
          </div>
          
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <Card className="p-8">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            {question.question}
          </h2>
          
          <div className="space-y-3">
            {question.options.map(option => (
              <button
                key={option.value}
                onClick={() => handleAnswer(question.id, option.value)}
                className="w-full p-4 text-left border border-border rounded-lg hover:bg-accent hover:border-primary transition-all"
              >
                <span className="text-foreground">{option.label}</span>
              </button>
            ))}
          </div>
        </Card>

        {currentQuestion > 0 && (
          <div className="mt-6 text-center">
            <Button 
              variant="outline" 
              onClick={() => setCurrentQuestion(currentQuestion - 1)}
            >
              Previous Question
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}