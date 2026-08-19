import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Bot, CalendarCheck, Mail, NotebookPen, Search } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aurelio — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Automate workplace tasks with AI: draft emails, summarise meetings, plan your week, run research and chat with your assistant.",
      },
      { property: "og:title", content: "Aurelio — AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content: "Draft emails, summarise meetings, plan tasks and research faster with AI.",
      },
    ],
  }),
  component: Dashboard,
});

const TOOLS = [
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email Generator",
    body: "Turn bullet points into polished, on-tone emails ready to send.",
  },
  {
    to: "/notes",
    icon: NotebookPen,
    title: "Meeting Notes Summariser",
    body: "Decisions, action items and owners extracted from any transcript.",
  },
  {
    to: "/planner",
    icon: CalendarCheck,
    title: "AI Task Planner",
    body: "Prioritised, time-blocked plans that fit your real capacity.",
  },
  {
    to: "/research",
    icon: Search,
    title: "AI Research Assistant",
    body: "Structured memos with findings, comparisons and next steps.",
  },
  {
    to: "/chat",
    icon: Bot,
    title: "AI Chat",
    body: "An always-on assistant for anything else on your plate.",
  },
] as const;

const STATS = [
  { label: "Workflows automated", value: "5" },
  { label: "Avg. time saved / task", value: "18 min" },
  { label: "Outputs fully editable", value: "100%" },
];

function Dashboard() {
  return (
    <AppShell
      title="Dashboard"
      description="Your AI workspace for everyday professional tasks."
    >
      <section
        className="mb-8 overflow-hidden rounded-2xl p-6 text-primary-foreground md:p-10"
        style={{ backgroundImage: "var(--gradient-brand)", boxShadow: "var(--shadow-elevated)" }}
      >
        <p className="text-xs font-semibold tracking-widest uppercase opacity-80">
          AI workplace assistant
        </p>
        <h2 className="mt-3 max-w-2xl text-2xl leading-tight font-semibold md:text-4xl">
          Automate the busywork. Keep the judgement.
        </h2>
        <p className="mt-3 max-w-xl text-sm opacity-90 md:text-base">
          Structured prompts, professional output, and everything editable before it leaves your
          desk.
        </p>
        <Link
          to="/chat"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-background/15 px-4 py-2.5 text-sm font-medium backdrop-blur transition-colors hover:bg-background/25"
        >
          Start with AI Chat <ArrowRight className="size-4" />
        </Link>
      </section>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {STATS.map((s) => (
          <Card key={s.label} className="p-5" style={{ boxShadow: "var(--shadow-soft)" }}>
            <p className="text-2xl font-semibold text-foreground">{s.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
          </Card>
        ))}
      </div>

      <h3 className="mb-4 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
        Your tools
      </h3>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {TOOLS.map((tool) => (
          <Link key={tool.to} to={tool.to} className="group">
            <Card
              className="h-full p-5 transition-all group-hover:-translate-y-0.5"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <tool.icon className="size-5" />
              </span>
              <p className="mt-4 font-semibold text-foreground">{tool.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{tool.body}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Open <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Card>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
