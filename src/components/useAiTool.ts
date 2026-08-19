import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { runAiTool } from "@/lib/ai.functions";

export function useAiTool() {
  const call = useServerFn(runAiTool);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async (system: string, prompt: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await call({ data: { system, prompt } });
      setOutput(res.text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong generating this. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return { output, setOutput, loading, error, generate };
}
