import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { soilData, location, cropHistory } = await req.json();

    const prompt = `You are an expert Indian agricultural advisor. Based on the following farmer data, suggest the top 5 best crops to grow this season.

FARMER DATA:
- Location: ${location?.state || 'Unknown'}, ${location?.district || 'Unknown'}
- Soil Type: ${soilData?.soil_type || 'Unknown'}
- Soil pH: ${soilData?.ph || 'Unknown'}
- Moisture: ${soilData?.moisture || 'Unknown'}%
- Nitrogen: ${soilData?.nitrogen || 'Unknown'} kg/ha
- Phosphorus: ${soilData?.phosphorus || 'Unknown'} kg/ha
- Potassium: ${soilData?.potassium || 'Unknown'} kg/ha
- Past Crops: ${cropHistory?.length ? cropHistory.map((c: any) => `${c.crop} (${c.season} ${c.year})`).join(', ') : 'None recorded'}

Respond ONLY with a JSON array of exactly 5 crop objects. Each object must have:
- name: string (crop name)
- suitabilityScore: number (0-100)
- expectedYield: number (tons per acre)
- profitMargin: number (estimated profit in INR)
- sustainabilityScore: number (0-100)
- waterRequirement: "low" | "medium" | "high"
- growthDuration: number (days)
- riskLevel: "low" | "medium" | "high"
- reasoning: string (2-3 sentences why this crop is suitable)

Consider soil health, crop rotation benefits, local climate, market demand, and water availability. Prioritize crops that complement the farmer's past crop history for good rotation.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || "";
    
    // Extract JSON from response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("No valid JSON in AI response");
    
    const crops = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify({ crops }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
