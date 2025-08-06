import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { ChevronRight, Target, AlertCircle, CheckCircle } from "lucide-react";

// Custom debounce - no lodash needed
function debounce(fn: (...args: any[]) => void, delay: number) {
  let t: any;
  return (...args: any[]) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}

const KnowYourBuyerModule = {
  title: "Know Your Buyer",
  purpose: "Identify which type of acquirer fits your business profile and understand what they value most. Different buyers = different prep strategies.",
  introContent: {
    hook: "Preparing for VC when PE is your real buyer? That's like training for tennis when you're playing golf.",
    reality: "Most founders waste months optimizing the wrong metrics because they don't understand their buyer universe. PE wants EBITDA. VC wants growth. Strategic buyers want synergies. Get this wrong and you'll leave millions on the table."
  },
  structure: {
    buyerTypes: [
      {
        id: "traditional-pe",
        name: "Traditional Private Equity",
        sweetSpot: "$3M+ EBITDA",
        whatTheyWant: "Platform businesses, strong management, add-on potential",
        yourFit: "HIGH",
        keyMetrics: ["EBITDA margins 15-25%+", "3+ years profitability", "Recurring revenue"],
        dealKillers: ["Customer concentration >30%", "Owner dependency", "Declining revenue"],
        prepFocus: "Normalize EBITDA, build management team, document processes"
      },
      {
        id: "search-fund",
        name: "Search Fund / ETA",
        sweetSpot: "$1-5M EBITDA",
        whatTheyWant: "Simple operations, seller transition support, steady cash flow",
        yourFit: "HIGH",
        keyMetrics: ["Clean books", "5+ year history", "B2B preferred"],
        dealKillers: ["Complex operations", "Regulatory issues", "High CapEx needs"],
        prepFocus: "Simplify operations, create transition plan, clean up books"
      },
      {
        id: "strategic-buyer",
        name: "Strategic Buyer",
        sweetSpot: "Any size with synergies",
        whatTheyWant: "Market share, customer base, technology, talent",
        yourFit: "MEDIUM",
        keyMetrics: ["Unique capabilities", "Customer overlap", "Geographic expansion"],
        dealKillers: ["Direct competition concerns", "Integration complexity"],
        prepFocus: "Highlight synergies, protect IP, quantify cost savings"
      },
      {
        id: "angel",
        name: "Angel Investor",
        sweetSpot: "<$1M revenue",
        whatTheyWant: "Early traction, great story, founder credibility",
        yourFit: "LOW",
        keyMetrics: ["Narrative clarity", "Initial traction", "Founding team"],
        dealKillers: ["No clear path to monetization", "Scattered focus"],
        prepFocus: "Polish the story, define early wins, show smart use of capital"
      },
      {
        id: "vc",
        name: "Venture Capital",
        sweetSpot: "$1M+ with fast growth",
        whatTheyWant: "Hypergrowth, TAM, LTV:CAC, team",
        yourFit: "LOW",
        keyMetrics: ["MRR growth", "Burn rate runway", "Cohort retention"],
        dealKillers: ["Flat growth", "Cap table chaos"],
        prepFocus: "Highlight scalability, lean into upside, de-risk execution"
      },
      {
        id: "family-office",
        name: "Family Office",
        sweetSpot: "$2M–$20M deals",
        whatTheyWant: "Stability, low drama, legacy-minded growth",
        yourFit: "HIGH",
        keyMetrics: ["Consistent profits", "Long-tenured team", "Modest growth"],
        dealKillers: ["Volatility", "High turnover", "Overleverage"],
        prepFocus: "Emphasize reliability, build trust, offer multi-year vision"
      },
      {
        id: "sba-pe",
        name: "SBA-Backed PE",
        sweetSpot: "$1M–$10M exits",
        whatTheyWant: "Clean financials, seller transition, debt-friendly terms",
        yourFit: "HIGH",
        keyMetrics: ["SDE or EBITDA documented", "Owner willing to stay", "Low legal risk"],
        dealKillers: ["Inconsistent bookkeeping", "Disorganized operations"],
        prepFocus: "Get GAAP compliant, build transition plan, clean up legal/HR"
      }
    ]
  }
};

export default function KnowYourBuyerPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [buyerScores, setBuyerScores] = useState<Record<string, number>>({});
  const [selectedBuyer, setSelectedBuyer] = useState<string | null>(null);

  const quizQuestions = [
    {
      id: "revenue",
      question: "What's your current annual revenue?",
      options: ["< $1M", "$1M - $5M", "$5M - $20M", "$20M+"]
    },
    {
      id: "ebitda",
      question: "Is your business EBITDA positive?",
      options: ["Yes, 15%+ margins", "Yes, under 15%", "Break-even", "No, burning cash"]
    },
    {
      id: "growth",
      question: "What's your annual growth rate?",
      options: ["50%+ hypergrowth", "20-50% fast growth", "5-20% steady", "Flat or declining"]
    },
    {
      id: "timeline",
      question: "When do you want to exit?",
      options: ["< 1 year", "1-2 years", "2-5 years", "5+ years"]
    }
  ];

  const calculateBuyerScores = (answers: Record<string, string>) => {
    const scores: Record<string, number> = {};
    KnowYourBuyerModule.structure.buyerTypes.forEach(buyer => {
      let score = 0;
      if (buyer.id === "traditional-pe") {
        if (answers.revenue === "$20M+") score += 30;
        if (answers.ebitda === "Yes, 15%+ margins") score += 40;
        if (answers.growth === "5-20% steady") score += 20;
        if (answers.timeline === "1-2 years") score += 10;
      }
      if (buyer.id === "search-fund") {
        if (answers.revenue === "$1M - $5M" || answers.revenue === "$5M - $20M") score += 35;
        if (answers.ebitda?.startsWith("Yes")) score += 25;
        if (answers.growth === "5-20% steady") score += 25;
        if (answers.timeline === "2-5 years") score += 15;
      }
      if (buyer.id === "angel") {
        if (answers.revenue === "< $1M") score += 35;
        if (answers.growth === "50%+ hypergrowth" || answers.growth === "20-50% fast growth") score += 25;
        if (answers.ebitda === "Break-even" || answers.ebitda === "No, burning cash") score += 20;
        if (answers.timeline === "5+ years") score += 20;
      }
      if (buyer.id === "family-office") {
        if (answers.revenue === "$5M - $20M") score += 30;
        if (answers.ebitda?.startsWith("Yes")) score += 30;
        if (answers.growth === "5-20% steady") score += 20;
        if (answers.timeline === "2-5 years" || answers.timeline === "5+ years") score += 20;
      }
      if (buyer.id === "sba-pe") {
        if (answers.revenue === "$1M - $5M") score += 30;
        if (answers.ebitda?.startsWith("Yes")) score += 30;
        if (answers.growth === "5-20% steady" || answers.growth === "Flat or declining") score += 20;
        if (answers.timeline === "< 1 year" || answers.timeline === "1-2 years") score += 20;
      }
      if (buyer.id === "strategic-buyer") {
        if (answers.growth === "20-50% fast growth" || answers.growth === "50%+ hypergrowth") score += 35;
        if (answers.revenue !== "< $1M") score += 20;
        if (answers.ebitda?.startsWith("Yes")) score += 25;
        if (answers.timeline === "2-5 years") score += 20;
      }
      if (buyer.id === "vc") {
        if (answers.growth === "50%+ hypergrowth") score += 50;
        if (answers.ebitda === "No, burning cash") score += 20;
        if (answers.revenue === "$1M - $5M") score += 20;
        if (answers.timeline === "2-5 years") score += 10;
      }
      scores[buyer.id] = score;
    });
    return scores;
  };

  const saveProgress = debounce(async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("buyer_analysis").upsert({
        user_id: user.id,
        quiz_answers: quizAnswers,
        buyer_scores: buyerScores,
        selected_buyer: selectedBuyer,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });
      if (error) throw error;
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  }, 1000);

  useEffect(() => {
    const scores = calculateBuyerScores(quizAnswers);
    setBuyerScores(scores);
  }, [quizAnswers]);

  useEffect(() => {
    if (!loading) saveProgress();
  }, [quizAnswers, selectedBuyer]);

  useEffect(() => {
    if (!user) return;
    const loadProgress = async () => {
      try {
        const { data } = await supabase
          .from("buyer_analysis")
          .select("*")
          .eq("user_id", user.id)
          .single();
        if (data) {
          setQuizAnswers(data.quiz_answers as Record<string, string> || {});
          setBuyerScores(data.buyer_scores as Record<string, number> || {});
          setSelectedBuyer(data.selected_buyer);
        }
      } catch (err) {
        console.error("Load error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProgress();
  }, [user]);

  const getSortedBuyers = () => {
    return [...KnowYourBuyerModule.structure.buyerTypes].sort(
      (a, b) => (buyerScores[b.id] || 0) - (buyerScores[a.id] || 0)
    );
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="text-white/70">Loading...</div></div>;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{KnowYourBuyerModule.title}</h1>
          <p className="text-white/70">{KnowYourBuyerModule.purpose}</p>
          <p className="text-white/60 mt-2">{KnowYourBuyerModule.introContent.reality}</p>
        </div>

        {/* Quiz Section */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-6">Quick Diagnostic</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quizQuestions.map(q => (
              <div key={q.id} className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                <p className="text-white mb-4">{q.question}</p>
                <div className="space-y-2">
                  {q.options.map(option => (
                    <button
                      key={option}
                      onClick={() => setQuizAnswers({ ...quizAnswers, [q.id]: option })}
                      className={`w-full text-left px-4 py-2 rounded-lg transition ${
                        quizAnswers[q.id] === option
                          ? "bg-blue-500/20 border border-blue-500/50 text-white"
                          : "bg-black/20 border border-white/10 text-white/70 hover:bg-white/5"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Buyer Results */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-6">Your Best-Fit Buyers</h2>
          <p className="text-white/60 mb-6 text-sm">💡 Click any buyer card below to see detailed information about what they value and how to prepare for them.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getSortedBuyers().map((buyer, index) => {
              const score = buyerScores[buyer.id] || 0;
              const isTopMatch = index === 0 && score > 50;
              return (
                <div
                  key={buyer.id}
                  onClick={() => setSelectedBuyer(buyer.id)}
                  className={`bg-white/5 border rounded-xl p-6 backdrop-blur-sm cursor-pointer transition ${
                    selectedBuyer === buyer.id
                      ? "border-blue-500/50 bg-blue-500/10"
                      : isTopMatch
                      ? "border-green-500/50"
                      : "border-white/10 hover:bg-white/10"
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-white">{buyer.name}</h3>
                    {isTopMatch && <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">TOP MATCH</span>}
                  </div>
                  <p className="text-sm text-white/70 mb-2">{buyer.sweetSpot}</p>
                  <p className="text-sm text-white/60 mb-4">{buyer.whatTheyWant}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-blue-400">{score}%</div>
                    <ChevronRight className="w-5 h-5 text-white/30" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Buyer Deep Dive */}
        {selectedBuyer && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-8 backdrop-blur-sm">
            {(() => {
              const buyer = KnowYourBuyerModule.structure.buyerTypes.find(b => b.id === selectedBuyer)!;
              return (
                <>
                  <h2 className="text-2xl font-bold text-white mb-6">{buyer.name} Deep Dive</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold text-green-400 mb-3 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" /> Key Success Metrics
                      </h3>
                      <ul className="space-y-2">
                        {buyer.keyMetrics.map(metric => (
                          <li key={metric} className="text-white/80 text-sm">• {metric}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-red-400 mb-3 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" /> Deal Killers
                      </h3>
                      <ul className="space-y-2">
                        {buyer.dealKillers.map(killer => (
                          <li key={killer} className="text-white/80 text-sm">• {killer}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="mt-8 p-6 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-400 mb-2 flex items-center gap-2">
                      <Target className="w-5 h-5" /> Your Preparation Focus
                    </h3>
                    <p className="text-white/90">{buyer.prepFocus}</p>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {saving && (
          <div className="fixed bottom-6 right-6 text-xs text-blue-400 animate-pulse">
            Saving analysis...
          </div>
        )}
      </div>
    </div>
  );
}