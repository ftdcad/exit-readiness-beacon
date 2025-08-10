
import React from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Sparkles } from "lucide-react";

export function AIAssistantDialog() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [link, setLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const location = useLocation();

  const handleAsk = async () => {
    if (!question.trim()) {
      toast({ title: "Enter a question", description: "Please type a question for the assistant." });
      return;
    }
    setLoading(true);
    setAnswer(null);
    setLink(null);

    console.log("[AI] invoking ai-ask with", { question, module: location.pathname });

    const { data, error } = await supabase.functions.invoke("ai-ask", {
      body: { question: question.trim(), module: location.pathname },
    });

    setLoading(false);

    if (error) {
      console.error("[AI] error:", error);
      toast({
        title: "Assistant unavailable",
        description: error.message ?? "Please try again in a moment.",
      });
      return;
    }

    setAnswer(data?.answer ?? null);
    setLink(data?.link ?? null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="default" className="gap-2">
          <Bot className="h-4 w-4" />
          Ask AI
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Deal Room Assistant
          </DialogTitle>
          <DialogDescription>
            Get concise guidance and links to the right module. Avoids legal/tax advice.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-2">
              Your question
            </label>
            <Textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. What counts as an add-back in EBITDA?"
              rows={4}
            />
          </div>

          {answer && (
            <div className="rounded-md border bg-card text-card-foreground p-3">
              <div className="text-sm whitespace-pre-wrap">{answer}</div>
              {link && (
                <div className="mt-2">
                  <a
                    href={link}
                    className="text-primary hover:underline text-sm"
                    onClick={() => setOpen(false)}
                  >
                    Open module
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
          <Button onClick={handleAsk} disabled={loading}>
            {loading ? "Thinking..." : "Ask"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AIAssistantDialog;
