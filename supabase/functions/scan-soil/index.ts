import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64, language, location } = await req.json();

    if (!imageBase64) {
      return new Response(JSON.stringify({ error: "No image provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const langInstruction =
      language && language !== "en"
        ? `Respond entirely in ${language === "hi" ? "Hindi" : language === "kn" ? "Kannada" : "English"}.`
        : "Respond in English.";

    const imageUrl = imageBase64.startsWith("data:")
      ? imageBase64
      : `data:image/jpeg;base64,${imageBase64}`;

    const locationContext = location?.state
      ? `The farm is located in ${location.district || ""}, ${location.state}, India. Recommend crops suitable for this region's climate.`
      : "Recommend crops suitable for general Indian farming conditions.";

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are an expert soil scientist and agronomist. Analyze the provided soil image and visually estimate its properties. ${langInstruction}

${locationContext}

Visually inspect color, texture, structure, and apparent moisture. Estimate soil type (Clay, Sandy, Loamy, Silty, Peaty, Chalky, Black Cotton, Red, Alluvial), moisture level (Dry/Low/Moderate/Wet), approximate pH range, organic matter, and recommend the 3 best crops to grow with reasoning.

Be honest about uncertainty — visual analysis is approximate. Use the tool call to respond.`,
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Analyze this soil sample image and recommend the best crops to grow." },
              { type: "image_url", image_url: { url: imageUrl } },
            ],
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "report_soil_analysis",
              description: "Report soil scan results and crop recommendations",
              parameters: {
                type: "object",
                properties: {
                  soilType: { type: "string", description: "Identified soil type (e.g., Loamy, Clay, Sandy, Black Cotton)" },
                  moistureLevel: { type: "string", enum: ["Dry", "Low", "Moderate", "Wet"], description: "Estimated moisture level" },
                  moisturePercent: { type: "number", description: "Approximate moisture percentage (0-100)" },
                  estimatedPH: { type: "string", description: "Estimated pH range (e.g., '6.0-6.8')" },
                  color: { type: "string", description: "Observed soil color" },
                  texture: { type: "string", description: "Observed texture (fine, coarse, gritty, etc.)" },
                  organicMatter: { type: "string", enum: ["Low", "Medium", "High"], description: "Estimated organic matter content" },
                  fertility: { type: "string", enum: ["Poor", "Moderate", "Good", "Excellent"], description: "Overall fertility assessment" },
                  confidence: { type: "number", description: "Confidence in analysis (0-100)" },
                  observations: { type: "string", description: "Brief 1-2 sentence summary of what was observed" },
                  recommendedCrops: {
                    type: "array",
                    description: "Top 3 recommended crops",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string", description: "Crop name" },
                        suitability: { type: "number", description: "Suitability percentage (0-100)" },
                        reason: { type: "string", description: "Why this crop suits the soil and location" },
                        season: { type: "string", description: "Best growing season (Kharif/Rabi/Zaid/Year-round)" },
                      },
                      required: ["name", "suitability", "reason", "season"],
                      additionalProperties: false,
                    },
                  },
                  improvementTips: {
                    type: "array",
                    items: { type: "string" },
                    description: "2-4 tips to improve soil quality",
                  },
                },
                required: [
                  "soilType",
                  "moistureLevel",
                  "moisturePercent",
                  "estimatedPH",
                  "color",
                  "texture",
                  "organicMatter",
                  "fertility",
                  "confidence",
                  "observations",
                  "recommendedCrops",
                  "improvementTips",
                ],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "report_soil_analysis" } },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No structured response from AI");

    const result = JSON.parse(toolCall.function.arguments);
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("scan-soil error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
