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

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summariser — Aurelio" },
      {
        name: "description",
        content:
          "Paste a transcript or rough notes and get a structured summary with decisions, action items and owners.",
      },
      { property: "og:title", content: "Meeting Notes Summariser — Aurelio" },
      {
        property: "og:description",
        content: "Turn messy meeting notes into decisions and action items.",
      },
    ],
  }),
  component: NotesPage,
});

const FORMATS = ["Executive summary", "Detailed minutes", "Action items only", "Client recap"];

function NotesPage() {
  const { output, setOutput, loading, error, generate } = useAiTool();
  const [title, setTitle] = useState("");
  const [attendees, setAttendees] = useState("");
  const [notes, setNotes] = useState("");
  const [format, setFormat] = useState("Executive summary");

  const submit = () =>
    generate(
      "You are a meticulous meeting analyst. Summarise transcripts into clean markdown with sections: Summary, Key Decisions, Action Items (owner + due date when available), Risks/Open Questions, and Next Steps. Never invent facts.",
      [
        `Meeting: ${title || "Untitled meeting"}`,
        `Attendees: ${attendees || "unspecified"}`,
        `Requested format: ${format}`,
        `Raw notes / transcript:\n${notes}`,
      ].join("\n"),
    );

  return (
    <AppShell
      title="Meeting Notes Summariser"
      description="Structured summaries, decisions and action items from raw notes."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-5 p-5" style={{ boxShadow: "var(--shadow-soft)" }}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Meeting title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Q3 roadmap review"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="attendees">Attendees</Label>
              <Input
                id="attendees"
                value={attendees}
                onChange={(e) => setAttendees(e.target.value)}
                placeholder="Sam, Priya, Thandi"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Output format</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FORMATS.map((f) => (
                  <SelectItem key={f} value={f}>
                    {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Transcript or rough notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Paste your meeting transcript or bullet notes here…"
              className="min-h-64"
            />
          </div>
          <Button onClick={submit} disabled={loading || notes.trim().length < 20} className="w-full">
            <Sparkles className="size-4" />
            {loading ? "Summarising…" : "Summarise meeting"}
          </Button>
        </Card>

        <AiOutput
          value={output}
          onChange={setOutput}
          loading={loading}
          error={error}
          placeholder="Your structured meeting summary will appear here."
          filename="meeting-summary.md"
        />
      </div>
    </AppShell>
  );
}
