"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  limit,
  getDocs,
} from "firebase/firestore";
import { db, auth } from "@/libs/firebaseClient";

export default function MessagesBarChart() {
  const [chartData, setChartData] = useState<
    { name: string; messages: number }[]
  >([]);

  const [botNames, setBotNames] = useState<Record<string, string>>({});

  // ✅ 1. Fetch bot names (dynamic)
  useEffect(() => {
    const fetchBotNames = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const snapshot = await getDocs(collection(db, "users", user.uid, "bots"));

      const map: Record<string, string> = {};

      snapshot.forEach((doc) => {
        map[doc.id] = doc.data().name;
      });

      setBotNames(map);
    };

    fetchBotNames();
  }, []);

  // ✅ 2. Listen to messages
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "messages"),
      where("userId", "==", user.uid),
      where("role", "==", "user"),
      limit(100),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const counts: Record<string, number> = {};

      snapshot.docs.forEach((doc) => {
        const botType = doc.data().botType || "Unknown";
        counts[botType] = (counts[botType] || 0) + 1;
      });

      // 🔥 IMPORTANT: use botNames here
      const formattedData = Object.entries(counts).map(
        ([botType, messages]) => ({
          name: botNames[botType] || botType,
          messages,
        }),
      );

      setChartData(formattedData);
    });

    return () => unsubscribe();
  }, [botNames]); // ✅ VERY IMPORTANT

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-[#646776]">
        Messages Per Bot
      </h3>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
            }}
          />
          <Bar dataKey="messages" fill="#2563eb" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
