const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

exports.generateProsCons = async (req, res) => {
  try {
    const { decisionId, optionA, optionB } = req.body;

    const prompt = `Generate pros and cons for two options:\n
Option A: ${optionA}
Option B: ${optionB}

Return them in this format:
Option A:
Pros:
-
Cons:
-

Option B:
Pros:
-
Cons:
-`;

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const result = completion.data.choices[0].message.content;

    // Optional: You can save pros/cons to DB using decisionId here

    res.status(200).json({ success: true, result });
  } catch (err) {
    console.error("OpenAI error:", err.message);
    res.status(500).json({ success: false, error: "AI generation failed" });
  }
};
