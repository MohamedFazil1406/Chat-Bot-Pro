"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { auth, db } from "@/libs/firebaseClient";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  where,
  limit,
  doc,
  updateDoc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import { onAuthStateChanged } from "firebase/auth";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatPage() {
  const params = useParams();
  const botType = params?.bots ? String(params.bots).trim().toLowerCase() : "";
  const [botName, setBotName] = useState("");

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // ✅ Wait for auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user?.uid || null);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId || !botType) return;

    const fetchBot = async () => {
      try {
        const ref = doc(db, "users", userId, "bots", botType);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setBotName(snap.data().name);
        } else {
          setBotName(botType);
        }
      } catch (err) {
        console.error("Error fetching bot:", err);
        setBotName(botType);
      }
    };

    fetchBot();
  }, [botType, userId]);
  // 🔹 auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ FIXED: Validate or create session
  useEffect(() => {
    if (!botType || !userId) return;

    const key = `session-${userId}-${botType}`;

    const loadSession = async () => {
      const existingSession = localStorage.getItem(key);

      if (existingSession) {
        const ref = doc(db, "chat_sessions", existingSession);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setSessionId(existingSession);
          return;
        } else {
          // ❌ invalid → remove
          localStorage.removeItem(key);
        }
      }

      // ✅ create new session
      const docRef = await addDoc(collection(db, "chat_sessions"), {
        botType,
        createdAt: serverTimestamp(),
        lastMessage: "Session started",
        userId,
        lastMessageAt: serverTimestamp(),
        status: "active",
      });

      setSessionId(docRef.id);
      localStorage.setItem(key, docRef.id);
    };

    loadSession();
  }, [botType, userId]);

  // ✅ Listen messages
  useEffect(() => {
    if (!sessionId || !userId) return;

    const q = query(
      collection(db, "messages"),
      where("sessionId", "==", sessionId),
      where("userId", "==", userId),
      orderBy("createdAt", "asc"),
      limit(100),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        role: doc.data().role,
        content: doc.data().content,
      })) as Message[];

      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [sessionId, userId]);

  // ✅ Send message (safe session update)
  const sendMessage = async () => {
    if (!input.trim() || !userId) return;

    let currentSessionId = sessionId;

    // ✅ ALWAYS ensure session exists
    if (!currentSessionId) {
      const docRef = await addDoc(collection(db, "chat_sessions"), {
        botType,
        createdAt: serverTimestamp(),
        lastMessage: input,
        userId,
        lastMessageAt: serverTimestamp(),
        status: "active",
      });

      currentSessionId = docRef.id;
      setSessionId(docRef.id);
      localStorage.setItem(`session-${userId}-${botType}`, docRef.id);
    }

    const userText = input;

    setInput("");
    setLoading(true);

    try {
      // 🔥 Send message to API
      await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userText,
          botType,
          sessionId: currentSessionId,
          userId,
        }),
      });

      // 🔥 ALWAYS update session after message
      await setDoc(
        doc(db, "chat_sessions", currentSessionId),
        {
          botType,
          userId,
          lastMessage: userText,
          lastMessageAt: serverTimestamp(),
        },
        { merge: true },
      );
    } catch (error) {
      console.error("Chat error:", error);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}

      <div className="p-4 border-b bg-white text-black font-semibold text-lg">
        {botName || botType} bot
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-md p-3 rounded-xl ${
              msg.role === "user"
                ? "ml-auto bg-blue-600 text-white"
                : "bg-white border text-black"
            }`}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {msg.content}
            </ReactMarkdown>
          </div>
        ))}

        {loading && (
          <div className="text-sm text-gray-500">Bot is typing...</div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Ask something..."
          className="flex-1 border rounded-lg px-4 py-2 text-black"
        />

        <button
          onClick={sendMessage}
          disabled={!sessionId || loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
