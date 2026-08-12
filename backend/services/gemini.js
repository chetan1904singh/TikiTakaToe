import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

export async function generateBoard() {

    const prompt = `
Generate a football Tic Tac Toe board.

Requirements:
- Exactly 3 row labels.
- Exactly 3 column labels.
- Labels may be clubs or countries.
- Every row-column intersection should have at least one valid footballer.
- Return ONLY valid JSON.
- Do not use markdown.
- Do not use code blocks.
- Do not explain anything.

Format:
{
  "rows": ["...", "...", "..."],
  "cols": ["...", "...", "..."]
}
`;

    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: prompt
    });

    const board = JSON.parse(response.text);
        return board;
}

//--------Ans validation -----------

export async function validateAnswerByGemini(player, row, col) {
    
const prompt2 = `
Player: ${player}
club : ${row}
country :${col}
Return ONLY JSON if the football player played for both club and country. no explanations.
Rules:
1. Do NOT autocomplete, infer, expand initials, or guess and size should be >3.
2. If there is any uncertainty, return INVALID.
Example:{"valid": true}
`
;
        console.time("Gemini Validation");
        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash-lite",
            contents: prompt2,

        });
        console.timeEnd("Gemini Validation");
        console.log("Raw Gemini response:");
        console.log(response.text);
        const result = JSON.parse(response.text);

        return result;


}