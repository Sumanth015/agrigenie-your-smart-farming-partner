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
    const { imageBase64, language } = await req.json();

    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: "No image provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const langInstruction = language && language !== "en"
      ? `Respond entirely in ${language === "hi" ? "Hindi" : language === "kn" ? "Kannada" : "English"}.`
      : "Respond in English.";

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
            content: `You are an expert agricultural plant pathologist. Analyze the provided plant/crop image and identify any diseases or health issues. ${langInstruction}

You MUST respond using the following JSON tool call format. Be accurate and specific. If the plant appears healthy, say so. If you cannot identify the plant or disease clearly, provide your best assessment with a lower confidence score.`,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this crop/plant image for any diseases or health issues. Identify the plant, any disease present, confidence level, treatment, and prevention tips.",
              },
              {
                type: "image_url",
                image_url: {
                  url: imageBase64.startsWith("data:") ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`,
                },
              },
            ],
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "report_disease_detection",
              description: "Report the results of plant disease detection analysis",
              parameters: {
                type: "object",
                properties: {
                  plantName: { type: "string", description: "Name of the plant/crop identified" },
                  diseaseName: { type: "string", description: "Name of the disease detected, or 'Healthy' if no disease" },
                  confidence: { type: "number", description: "Confidence percentage (0-100)" },
                  description: { type: "string", description: "Brief description of the disease and symptoms observed" },
                  treatment: { type: "string", description: "Recommended treatment steps" },
                  prevention: {
                    type: "array",
                    items: { type: "string" },
                    description: "List of prevention tips",
                  },
                },
                required: ["plantName", "diseaseName", "confidence", "description", "treatment", "prevention"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "report_disease_detection" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall) {
      throw new Error("No structured response from AI");
    }

    const result = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("detect-disease error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
