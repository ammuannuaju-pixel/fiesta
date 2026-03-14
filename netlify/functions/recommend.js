const https = require("https");

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  try {
    const { prompt } = JSON.parse(event.body);
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ content: [{ text: "GEMINI_API_KEY is not set" }] })
      };
    }

    const payload = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 2000 }
    });

    const path = `/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const rawResult = await new Promise((resolve, reject) => {
      const options = {
        hostname: "generativelanguage.googleapis.com",
        path:     path,
        method:   "POST",
        headers: {
          "Content-Type":   "application/json",
          "Content-Length": Buffer.byteLength(payload),
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

    console.log("Raw Gemini response:", rawResult);

    const parsed = JSON.parse(rawResult);

    // Check for API errors
    if (parsed.error) {
      return {
        statusCode: 200,
        body: JSON.stringify({ content: [{ text: "Gemini error: " + parsed.error.message }] })
      };
    }

    const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text || "";

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