const axios = require('axios');

const askLlama = async (req, res) => {
  const userPrompt = req.body.prompt;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'nvidia/llama-3.3-nemotron-super-49b-v1:free',
        messages: [{ role: 'user', content: userPrompt }],
      },
      {
        headers: {
          'Authorization': `Bearer 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`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://orica.example.com',
          'X-Title': 'Orica',
        },
      }
    );

    res.json(response.data.choices[0].message);
  } catch (error) {
    console.error('OpenRouter error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get response from model' });
  }
};

module.exports = { askLlama };
