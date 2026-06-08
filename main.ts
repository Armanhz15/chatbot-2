// main.ts
export default {
  async fetch(req: Request, env: any): Promise<Response> {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // OPTIONS request (برای CORS)
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (req.method !== "POST") {
      return new Response("Method Not Allowed", { 
        status: 405, 
        headers: corsHeaders 
      });
    }

    try {
      const body = await req.json();

      const openrouterRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://armanhz15.github.io",
          "X-Title": "My Chatbot",
        },
        body: JSON.stringify({
          ...body,
          model: "openai/gpt-oss-120b:free"
        })
      });

      const data = await openrouterRes.json();

      return new Response(JSON.stringify(data), {
        headers: corsHeaders
      });

    } catch (err: any) {
      console.error(err);
      return new Response(JSON.stringify({ 
        error: err.message || "Internal Server Error" 
      }), { 
        status: 500, 
        headers: corsHeaders 
      });
    }
  }
};