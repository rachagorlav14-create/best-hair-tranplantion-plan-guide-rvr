// AI photo analysis using Lovable AI Gateway (Gemini Vision).
// Returns a *preliminary educational estimate* — never a diagnosis.

import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const MODEL = "google/gemini-2.5-flash"; // multimodal, fast, good for vision

type Photo = { area: string; dataUrl: string };

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const key = Deno.env.get("LOVABLE_API_KEY");
    if (!key) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const photos: Photo[] = Array.isArray(body.photos) ? body.photos.slice(0, 8) : [];
    const meta = body.meta || {};
    if (photos.length === 0) {
      return new Response(JSON.stringify({ error: "No photos provided" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const system = `You are an AI assistant that gives an EDUCATIONAL PRELIMINARY visual estimate of androgenic hair loss patterns from user-uploaded photos. You are NOT a doctor. You do NOT diagnose. You always return JSON. Your estimate is based only on visible cues (recession shape, density, scalp visibility, donor appearance). When uncertain, lower confidence_score. Never give medication doses. Always mention that final assessment requires an in-person consultation.`;

    const userText = `Patient self-reported context: ${JSON.stringify(meta)}.
Analyse the attached scalp photos (labeled by area). Return JSON ONLY with this shape:
{
  "norwood_stage": "N1|N2|N3|N3V|N4|N5|N6|N7|null",
  "ludwig_stage": "L1|L2|L3|null",
  "pattern": "string short description",
  "affected_zones": ["hairline","temples","mid_scalp","crown","diffuse"],
  "graft_estimate_low": number,
  "graft_estimate_high": number,
  "zone_split": { "hairline_temples":[low,high], "mid_scalp":[low,high], "crown":[low,high] },
  "donor_quality": "good|moderate|poor|unclear",
  "sessions_required": 1|2,
  "risk_flags": ["string"],
  "confidence_score": 0.0-1.0,
  "image_quality": { "overall": 0-1, "issues": ["lighting","blur","angle","missing_views"] },
  "notes": "1-3 sentence plain-language summary including the disclaimer"
}`;

    const content: any[] = [{ type: "text", text: userText }];
    for (const p of photos) {
      content.push({ type: "text", text: `[Area: ${p.area}]` });
      content.push({ type: "image_url", image_url: { url: p.dataUrl } });
    }

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": key,
      },
      body: JSON.stringify({
        model: MODEL,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          { role: "user", content },
        ],
      }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      const status = resp.status === 429 || resp.status === 402 ? resp.status : 502;
      return new Response(JSON.stringify({ error: `AI gateway ${resp.status}: ${text}` }), {
        status, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await resp.json();
    const raw = data?.choices?.[0]?.message?.content || "{}";
    let parsed: any = {};
    try { parsed = JSON.parse(raw); } catch { parsed = { notes: raw }; }

    return new Response(JSON.stringify({ result: parsed, model: MODEL }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String((e as Error).message || e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
