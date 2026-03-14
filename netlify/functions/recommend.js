const https = require("https");

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  try {
    const { prompt } = JSON.parse(event.body);
    const apiKey = process.env.COHERE_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ content: [{ text: "COHERE_API_KEY is not set" }] })
      };
    }

    const payload = JSON.stringify({
      model:       "command-r-plus",
      message:     prompt,
      max_tokens:  1500,
      temperature: 0.7
    });

    const rawResult = await new Promise((resolve, reject) => {
      const options = {
        hostname: "api.cohere.com",
        path:     "/v1/chat",
        method:   "POST",
        headers: {
          "Content-Type":   "application/json",
          "Authorization":  `Bearer ${apiKey}`,
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

    const parsed = JSON.parse(rawResult);

    if (parsed.message && !parsed.text) {
      return {
        statusCode: 200,
        body: JSON.stringify({ content: [{ text: "Cohere error: " + parsed.message }] })
      };
    }

    const text = parsed?.text || "";

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