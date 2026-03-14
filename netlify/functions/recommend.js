const https = require("https");

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  try {
    const { prompt } = JSON.parse(event.body);
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ content: [{ text: "OPENROUTER_API_KEY is not set" }] })
      };
    }

    const payload = JSON.stringify({
      model: "mistralai/mistral-7b-instruct:free",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1500
    });

    const rawResult = await new Promise((resolve, reject) => {
      const options = {
        hostname: "openrouter.ai",
        path:     "/api/v1/chat/completions",
        method:   "POST",
        headers: {
          "Content-Type":   "application/json",
          "Authorization":  `Bearer ${apiKey}`,
          "Content-Length": Buffer.byteLength(payload),
          "HTTP-Referer":   "https://stirring-cupcake-0aa910.netlify.app",
          "X-Title":        "Fiesta Book App"
        },
      };

      const req = https.request(options, (res) => {
        let data = "";
        res.on("data", (chunk) => { data += chunk; });
        res.on("end", () => resolve(data));
      });

      req.on("error", reject);
      req.write(payload);
      req.end();
    });

    const parsed = JSON.parse(rawResult);

    if (parsed.error) {
      return {
        statusCode: 200,
        body: JSON.stringify({ content: [{ text: "OpenRouter error: " + parsed.error.message }] })
      };
    }

    const text = parsed?.choices?.[0]?.message?.content || "";

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ content: [{ text }] }),
    };

  } catch (err) {
    console.error("Function error:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};