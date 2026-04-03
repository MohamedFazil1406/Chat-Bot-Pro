"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "@/libs/firebaseClient";

const COLORS = ["#2563eb", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444"];

export default function CustomerPieChart() {
  const [data, setData] = useState<{ name: string; value: number }[]>([]);

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

  // ✅ 2. Fetch messages (only this user)
  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(
        collection(db, "messages"),
        where("userId", "==", user.uid),
      );

      const snapshot = await getDocs(q);

      const counts: Record<string, number> = {};

      snapshot.forEach((doc) => {
        const botType = doc.data().botType || "unknown";
        counts[botType] = (counts[botType] || 0) + 1;
      });

      // 🔥 FIX: use dynamic names instead of uppercase
      const formatted = Object.entries(counts).map(([botType, value]) => ({
        name: botNames[botType] || botType,
        value,
      }));

      setData(formatted);
    };

    fetchData();
  }, [botNames]); // ✅ IMPORTANT

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-[#646776]">
        Most Used Bots
      </h3>

      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} dataKey="value" outerRadius={80}>
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "none",
              borderRadius: "8px",
              color: "black",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
