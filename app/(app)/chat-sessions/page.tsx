"use client";

import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import Sidebar from "@/app/components/Sidebar";

import {
  collection,
  query,
  orderBy,
  onSnapshot,
  where,
  getDocs,
} from "firebase/firestore";

import { db, auth } from "@/libs/firebaseClient";
import { onAuthStateChanged } from "firebase/auth";

type Session = {
  id: string;
  botType: string;
  lastMessage: string;
};

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatSessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [botNames, setBotNames] = useState<Record<string, string>>({});
  const [userId, setUserId] = useState<string | null>(null);

  // ✅ 1. Wait for auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user?.uid || null);
    });

    return () => unsubscribe();
  }, []);

  // ✅ 2. Fetch bot names (dynamic)
  useEffect(() => {
    if (!userId) return;

    const fetchBots = async () => {
      const snapshot = await getDocs(collection(db, "users", userId, "bots"));

      const map: Record<string, string> = {};

      snapshot.forEach((doc) => {
        map[doc.id] = doc.data().name;
      });

      setBotNames(map);
    };

    fetchBots();
  }, [userId]);

  // ✅ 3. Fetch sessions (filtered by user)
  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(db, "chat_sessions"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        botType: doc.data().botType,
        lastMessage: doc.data().lastMessage || "No message",
      }));

      setSessions(data);
    });

    return () => unsubscribe();
  }, [userId]);

  // ✅ 4. Fetch messages using sessionId
  useEffect(() => {
    if (!selectedSession) return;

    const q = query(
      collection(db, "messages"),
      where("sessionId", "==", selectedSession),
      orderBy("createdAt", "asc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        role: doc.data().role,
        content: doc.data().content,
      }));

      setMessages(data);
    });

    return () => unsubscribe();
  }, [selectedSession]);

  return (
    <div className="bg-white min-h-screen">
      <div className="flex">
        <Sidebar />

        <div className="w-px bg-gray-300"></div>

        <div className="flex-1 flex flex-col">
          {/* Navbar */}
          <div className="p-4">
            <Navbar />
          </div>

          <hr className="border-gray-300" />

          {/* MAIN UI */}
          <div className="flex h-[calc(100vh-100px)]">
            {/* LEFT: SESSION LIST */}
            <div className="w-1/3 border-r overflow-y-auto bg-[#efeff6]">
              <h2 className="p-4 font-semibold text-black">Chat Sessions</h2>

              {sessions.length === 0 ? (
                <p className="p-4 text-gray-400">No sessions yet</p>
              ) : (
                sessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => setSelectedSession(session.id)}
                    className={`p-4 cursor-pointer border-b hover:bg-white hover:rounded-xl ${
                      selectedSession === session.id
                        ? "bg-white rounded-2xl"
                        : ""
                    }`}
                  >
                    {/* ✅ FIX: show dynamic name */}
                    <p className="font-medium capitalize text-black">
                      {botNames[session.botType] || session.botType}
                    </p>

                    {/* ✅ cleaner last message */}
                    <p className="text-sm text-gray-600 truncate">
                      {session.lastMessage === "Session started"
                        ? "Started chat"
                        : session.lastMessage}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* RIGHT: CHAT VIEW */}
            <div className="flex-1 p-6 overflow-y-auto">
              {selectedSession ? (
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <p className="text-gray-400">No messages yet</p>
                  ) : (
                    messages.map((msg, i) => (
                      <div
                        key={i}
                        className={`max-w-md p-3 rounded-xl ${
                          msg.role === "user"
                            ? "ml-auto bg-blue-600 text-white"
                            : "bg-white border text-black"
                        }`}
                      >
                        {msg.content}
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="text-gray-400 text-center mt-20">
                  Select a session to view messages
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
