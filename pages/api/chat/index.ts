import type { NextApiRequest, NextApiResponse } from "next";
import groq from "@/libs/groqConnection";
import { bots } from "@/libs/bots";
import { db } from "@/libs/firebaseClient";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { botType, message, sessionId, userId } = req.body;

    // ✅ Validate input
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    if (!botType || !message) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // ✅ 1. Fetch bot config (user-specific OR fallback)
    let botConfig: any = null;

    const botRef = doc(db, "users", userId, "bots", botType);
    const botSnap = await getDoc(botRef);

    if (botSnap.exists()) {
      botConfig = botSnap.data();
    } else {
      botConfig = bots[botType as keyof typeof bots];

      if (!botConfig) {
        return res.status(404).json({ error: "Bot not found" });
      }
    }

    // ✅ 2. Save user message
    await addDoc(collection(db, "messages"), {
      sessionId,
      botType,
      role: "user",
      content: message,
      userId,
      createdAt: serverTimestamp(),
    });

    // ✅ 3. Call Groq
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // 🔥 stable + recommended
      messages: [
        {
          role: "system",
          content: `
${botConfig.prompt}

Tone: ${botConfig.tone || "friendly"}
Instructions:
- Be clear and helpful
- Keep answers concise
`,
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: botConfig.temperature ?? 0.7,
      max_tokens: 500,
    });

    const botReply = response.choices?.[0]?.message?.content || "No response";

    // ✅ 4. Save bot response
    await addDoc(collection(db, "messages"), {
      sessionId,
      botType,
      role: "assistant",
      content: botReply,
      userId,
      createdAt: serverTimestamp(),
    });

    // ✅ 5. Return response
    return res.status(200).json({ reply: botReply });
  } catch (error) {
    console.error("API ERROR:", error);

    return res.status(500).json({
      error: "Error generating response",
    });
  }
}
