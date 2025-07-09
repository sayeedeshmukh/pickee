// utils/openRouterClient.js
require("dotenv").config();
const fetch = require("node-fetch");

async function callOpenRouter(model, messages) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: model, // e.g. "nvidia/llama-3.3-nemotron-super-49b-v1:free"
      messages: messages
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenRouter Error: ${response.status} ${errText}`);
  }

  const result = await response.json();
  return result.choices?.[0]?.message?.content;
}

module.exports = callOpenRouter;
