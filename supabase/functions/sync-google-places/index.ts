// Google Places sync — admin-only.
// If GOOGLE_PLACES_API_KEY is not yet configured, returns a clear setup message
// so the admin UI can show "Add the key in project secrets to enable live sync".

import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const placesKey = Deno.env.get("GOOGLE_PLACES_API_KEY");
    const url = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const authHeader = req.headers.get("Authorization") || "";
    const supabase = createClient(url, serviceKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Verify admin
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", userData.user.id);
    if (!roles?.some((r) => r.role === "admin")) {
      return new Response(JSON.stringify({ error: "Admin role required" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const { city = "", country = "", keyword = "hair transplant clinic", dryRun = true } = body;

    if (!placesKey) {
      return new Response(JSON.stringify({
        ok: false,
        setupRequired: true,
        message: "GOOGLE_PLACES_API_KEY is not yet configured. Add it in project secrets to enable live sync.",
        receivedQuery: { city, country, keyword },
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Live Google Places Text Search
    const q = `${keyword} ${city} ${country}`.trim();
    const placesUrl = `https://places.googleapis.com/v1/places:searchText`;
    const placesResp = await fetch(placesUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": placesKey,
        "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.websiteUri,places.internationalPhoneNumber,places.googleMapsUri",
      },
      body: JSON.stringify({ textQuery: q }),
    });
    if (!placesResp.ok) {
      const text = await placesResp.text();
      return new Response(JSON.stringify({ error: `Places API ${placesResp.status}: ${text}` }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const places = await placesResp.json();
    const results = (places.places || []).map((p: any) => ({
      google_place_id: p.id,
      name: p.displayName?.text,
      address: p.formattedAddress,
      google_rating: p.rating,
      google_rating_count: p.userRatingCount,
      website: p.websiteUri,
      phone: p.internationalPhoneNumber,
      google_maps_url: p.googleMapsUri,
      city, country,
    }));

    let inserted = 0;
    if (!dryRun) {
      for (const r of results) {
        await supabase.from("clinics").upsert({
          ...r,
          data_source: "google_places",
          data_confidence: "medium",
          last_synced_at: new Date().toISOString(),
          status: "active",
        }, { onConflict: "google_place_id" });
        inserted++;
      }
    }

    return new Response(JSON.stringify({ ok: true, count: results.length, inserted, dryRun, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String((e as Error).message || e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
