import { Check, Copy, Download, Loader2 } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export function AiOutput({
  value,
  onChange,
  loading,
  error,
  placeholder,
  filename = "aurelio-output.md",
}: {
  value: string;
  onChange: (v: string) => void;
  loading: boolean;
  error?: string | null;
  placeholder: string;
  filename?: string;
}) {
  const [editing, setEditing] = useState(true);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const download = () => {
    const url = URL.createObjectURL(new Blob([value], { type: "text/markdown" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="flex min-h-[420px] flex-col gap-4 p-5" style={{ boxShadow: "var(--shadow-soft)" }}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-foreground">Output</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setEditing((e) => !e)} disabled={!value}>
            {editing ? "Preview" : "Edit"}
          </Button>
          <Button variant="outline" size="sm" onClick={copy} disabled={!value}>
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          </Button>
          <Button variant="outline" size="sm" onClick={download} disabled={!value}>
            <Download className="size-4" />
          </Button>
        </div>
      </div>

      {error ? (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
      ) : null}

      {loading ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-muted-foreground">
          <Loader2 className="size-6 animate-spin" />
          <p className="text-sm">Generating with AI…</p>
        </div>
      ) : editing ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-h-[320px] flex-1 resize-none font-mono text-sm leading-relaxed"
        />
      ) : (
        <div className="prose prose-sm max-w-none flex-1 overflow-auto text-foreground prose-headings:text-foreground prose-strong:text-foreground">
          <ReactMarkdown>{value}</ReactMarkdown>
        </div>
      )}
    </Card>
  );
}
