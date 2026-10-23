import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export interface NaceCode {
  code: string;
  name: string;
}

async function loadNace(): Promise<NaceCode[]> {
  const date = new Date().toISOString().slice(0, 10);
  const res = await fetch(`https://data.ssb.no/api/klass/v1/classifications/6/codesAt?date=${date}`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error("Kunne ikke hente NACE-listen fra SSB");
  const json = (await res.json()) as { codes: { code: string; name: string; level: string }[] };
  return json.codes.filter((c) => c.level === "5").map((c) => ({ code: c.code, name: c.name }));
}

export const getNaceCodes = createServerFn({ method: "GET" }).handler(async () => loadNace());

export const suggestNace = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ name: z.string().max(200), description: z.string().max(1000) }).parse(d))
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) return { suggestions: [], error: "KI er ikke konfigurert." };
    const [{ streamText, Output }, { createGatewayProvider }, codes] = await Promise.all([
      import("ai"),
      import("./ai-gateway.server"),
      loadNace(),
    ]);
    const valid = new Map(codes.map((c) => [c.code, c.name]));
    try {
      const provider = createGatewayProvider(apiKey);
      const result = streamText({
        model: provider.responses("openai/gpt-6-astra"),
        instructions:
          "Du er ekspert på norsk standard for næringsgruppering (SN/NACE, SSB). Foreslå 3–5 mest relevante næringskoder på 5-siffernivå (format 00.000) for virksomheten. Velg KUN koder fra listen under, og bruk koden nøyaktig slik den står. Gi en kort begrunnelse på bokmål for hver.\n\nGyldige koder:\n" + codes.map((c) => `${c.code} ${c.name}`).join("\n"),
        prompt: `Navn: ${data.name || "(ikke oppgitt)"}\nBeskrivelse: ${data.description || "(ikke oppgitt)"}`,
        output: Output.object({
          schema: z.object({
            suggestions: z.array(z.object({ code: z.string(), name: z.string(), reason: z.string() })),
          }),
        }),
        providerOptions: {
          openai: { store: false, forceReasoning: true, reasoningEffort: "low", reasoningSummary: "auto", include: ["reasoning.encrypted_content"] },
        },
      });
      const out = await result.output;
      const suggestions = out.suggestions
        .filter((s) => valid.has(s.code))
        .map((s) => ({ code: s.code, name: valid.get(s.code)!, reason: s.reason }));
      return { suggestions, error: null as string | null };
    } catch (e) {
      console.error("suggestNace failed", e);
      const status = (e as { statusCode?: number }).statusCode;
      const msg = status === 402 ? "Tomt for KI-kreditter. Fyll på under Innstillinger → Plans & credits." : status === 429 ? "For mange forespørsler – prøv igjen om litt." : "Kunne ikke hente forslag akkurat nå.";
      return { suggestions: [], error: msg };
    }
  });
