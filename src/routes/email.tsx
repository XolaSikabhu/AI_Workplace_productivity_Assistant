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

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Aurelio" },
      {
        name: "description",
        content:
          "Draft professional workplace emails in seconds with structured AI prompts and fully editable output.",
      },
      { property: "og:title", content: "Smart Email Generator — Aurelio" },
      {
        property: "og:description",
        content: "Draft professional workplace emails in seconds with AI.",
      },
    ],
  }),
  component: EmailPage,
});

const TONES = ["Professional", "Friendly", "Direct", "Persuasive", "Apologetic", "Formal"];
const LENGTHS = ["Short", "Medium", "Detailed"];

function EmailPage() {
  const { output, setOutput, loading, error, generate } = useAiTool();
  const [recipient, setRecipient] = useState("");
  const [purpose, setPurpose] = useState("");
  const [points, setPoints] = useState("");
  const [tone, setTone] = useState("Professional");
  const [length, setLength] = useState("Medium");

  const submit = () =>
    generate(
      "You are an expert business communication writer. Write clear, workplace-appropriate emails. Always return a subject line, then the email body, then a one-line signature placeholder. Use markdown.",
      [
        `Recipient: ${recipient || "colleague"}`,
        `Purpose: ${purpose}`,
        `Key points to include: ${points || "n/a"}`,
        `Tone: ${tone}`,
        `Length: ${length}`,
      ].join("\n"),
    );

  return (
    <AppShell
      title="Smart Email Generator"
      description="Turn a few bullet points into a polished, send-ready email."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-5 p-5" style={{ boxShadow: "var(--shadow-soft)" }}>
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient</Label>
            <Input
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Head of Operations"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose of the email</Label>
            <Input
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Request a deadline extension for the Q3 report"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="points">Key points</Label>
            <Textarea
              id="points"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              placeholder={"- Data source delayed by 3 days\n- New delivery date: 14 Sept\n- Draft already 70% complete"}
              className="min-h-32"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TONES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Length</Label>
              <Select value={length} onValueChange={setLength}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LENGTHS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={submit} disabled={loading || !purpose.trim()} className="w-full">
            <Sparkles className="size-4" />
            {loading ? "Generating…" : "Generate email"}
          </Button>
        </Card>

        <AiOutput
          value={output}
          onChange={setOutput}
          loading={loading}
          error={error}
          placeholder="Your generated email will appear here — fully editable."
          filename="email-draft.md"
        />
      </div>
    </AppShell>
  );
}
