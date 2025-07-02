async function generateProsCons(optionA, optionB) {
  try {
    const prompt = `Act as a professional decision-making assistant. Compare these two options and generate 3 high-quality pros and 3 high-quality cons for each:
    Option A: ${optionA}
    Option B: ${optionB}
    
    Requirements:
    - Be specific and concrete
    - Avoid generic statements
    - Consider both short-term and long-term impacts
    - Include potential risks and opportunities
    - Format as valid JSON exactly like this:
    {
      "optionA": { 
        "pros": ["specific pro 1", "specific pro 2", "specific pro 3"],
        "cons": ["specific con 1", "specific con 2", "specific con 3"] 
      },
      "optionB": {
        "pros": ["specific pro 1", "specific pro 2", "specific pro 3"],
        "cons": ["specific con 1", "specific con 2", "specific con 3"]
      }
    }`;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4", // Use GPT-4 for better quality
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5, // Lower for more focused responses
      response_format: { type: "json_object" } // Ensure JSON output
    });
    
    const result = JSON.parse(response.choices[0].message.content);
    
    // Add validation
    if (!result.optionA || !result.optionB) {
      throw new Error("Invalid AI response format");
    }
    
    return result;
  } catch (error) {
    console.error('OpenAI error:', error);
    // Provide fallback generic pros/cons
    return {
      optionA: {
        pros: [
          "Potential benefit 1 for Option A",
          "Potential benefit 2 for Option A",
          "Potential benefit 3 for Option A"
        ],
        cons: [
          "Potential drawback 1 for Option A",
          "Potential drawback 2 for Option A",
          "Potential drawback 3 for Option A"
        ]
      },
      optionB: {
        pros: [
          "Potential benefit 1 for Option B",
          "Potential benefit 2 for Option B",
          "Potential benefit 3 for Option B"
        ],
        cons: [
          "Potential drawback 1 for Option B",
          "Potential drawback 2 for Option B",
          "Potential drawback 3 for Option B"
        ]
      }
    };
  }
}