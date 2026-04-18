import type { QuestIdea } from '../types';

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent";

export async function callGemini(prompt: string): Promise<string> {
  const res = await fetch(`${GEMINI_URL}?key=${import.meta.env.VITE_GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.8, maxOutputTokens: 1000 }
    })
  });
  const data = await res.json();
  if (data.error) {
    throw new Error(data.error.message || "Failed to fetch from Gemini");
  }
  const text = data.candidates[0].content.parts[0].text;
  return text.replace(/```json|```/g, "").trim();
}

export async function generateQuestIdeas(tokenName: string, tokenSymbol: string, holderCount: number): Promise<QuestIdea[]> {
  const prompt = `You are a Web3 community growth expert. A creator has a token called "${tokenName}" (${tokenSymbol}) with ${holderCount} holders on Bags.fm Solana. Generate 3 creative quest ideas to grow their community. Return ONLY valid JSON array, no markdown: [{ "questType": "follow_x" | "hold_tokens" | "share_post" | "join_telegram" | "create_content", "title": string (max 8 words), "description": string (max 30 words), "suggestedReward": number, "maxCompletions": number, "whyItWorks": string (max 15 words) }]. Remember, questType MUST be EXACTLY one of those 5 literal strings.`;
  
  const resultText = await callGemini(prompt);
  try {
    const ideas = JSON.parse(resultText) as QuestIdea[];
    return ideas;
  } catch (error) {
    console.error("Error parsing Gemini response:", resultText);
    throw new Error("Failed to parse AI response into Quest Ideas");
  }
}
