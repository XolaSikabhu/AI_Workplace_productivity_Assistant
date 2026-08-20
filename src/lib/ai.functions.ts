import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const ToolInput = z.object({
  system: z.string().min(1),
  prompt: z.string().min(1),
});

const ChatInput = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      }),
    )
    .min(1),
});

export const runAiTool = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ToolInput.parse(input))
  .handler(async ({ data }) => {
    const { streamText } = await import("ai");
    const { createLovableAiGatewayProvider } = await import("./ai-gateway.server");
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("AI is not configured yet.");

    const gateway = createLovableAiGatewayProvider(key);
    const result = streamText({
      model: gateway("google/gemini-3.7-flash"),
      system: data.system,
      prompt: data.prompt,
    });
    return { text: await result.text };
  });

export const runAiChat = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ChatInput.parse(input))
  .handler(async ({ data }) => {
    const { streamText } = await import("ai");
    const { createLovableAiGatewayProvider } = await import("./ai-gateway.server");
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("AI is not configured yet.");

    const gateway = createLovableAiGatewayProvider(key);
    const result = streamText({
      model: gateway("google/gemini-3.7-flash"),
      system:
        "You are AI_Workplace_productivity_Assistant, an AI workplace productivity assistant for busy professionals. Be concise, practical and well structured. Use markdown.",
      messages: data.messages,
    });
    return { text: await result.text };
  });
