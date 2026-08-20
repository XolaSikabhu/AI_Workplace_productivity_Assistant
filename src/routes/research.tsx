import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { useState } from "react";

import { AiOutput } from "@/components/AiOutput";
import { AppShell } from "@/components/AppShell";
import { useAiTool } from "@/components/useAiTool";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — AI_Workplace_productivity_Assistant" },
      {
        name: "description",
        content:
          "Brief the AI on a topic and get a structured research memo with findings, comparisons and open questions.",
      },
      { property: "og:title", content: "AI Research Assistant — AI_Workplace_productivity_Assistant" },
      { property: "og:description", content: "Structured research memos for busy professionals." },
    ],
  }),
  component: ResearchPage,
});

const DEPTHS = ["Quick brief", "Standard memo", "Deep dive"];
const AUDIENCES = ["Executive team", "Technical team", "Client", "Internal wiki"];

function ResearchPage() {
  const { output, setOutput, loading, error, generate } = useAiTool();
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState("");
  const [depth, setDepth] = useState("Standard memo");
  const [audience, setAudience] = useState("Executive team");

  const submit = () =>
    generate(
      "You are a rigorous research analyst. Produce a markdown memo with: Overview, Key Findings, Comparison table where useful, Implications, Open Questions, and Recommended Next Steps. Flag anything uncertain and never fabricate sources or statistics — say when a claim needs verification.",
      [
        `Topic: ${topic}`,
        `Specific questions: ${questions || "general overview"}`,
        `Depth: ${depth}`,
        `Audience: ${audience}`,
      ].join("\n"),
    );

  return (
    <AppShell
      title="AI Research Assistant"
      description="Structured research memos tailored to your audience."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-5 p-5" style={{ boxShadow: "var(--shadow-soft)" }}>
          <div className="space-y-2">
            <Label htmlFor="topic">Research topic</Label>
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="AI adoption trends in professional services"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="questions">Questions to answer</Label>
            <Textarea
              id="questions"
              value={questions}
              onChange={(e) => setQuestions(e.target.value)}
              placeholder={"- What are the main adoption barriers?\n- How do teams measure ROI?"}
              className="min-h-40"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Depth</Label>
              <Select value={depth} onValueChange={setDepth}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DEPTHS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Audience</Label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AUDIENCES.map((a) => (
                    <SelectItem key={a} value={a}>
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={submit} disabled={loading || !topic.trim()} className="w-full">
            <Sparkles className="size-4" />
            {loading ? "Researching…" : "Run research"}
          </Button>
        </Card>

        <AiOutput
          value={output}
          onChange={setOutput}
          loading={loading}
          error={error}
          placeholder="Your research memo will appear here."
          filename="research-memo.md"
        />
      </div>
    </AppShell>
  );
}
