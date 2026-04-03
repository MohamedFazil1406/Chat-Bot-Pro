"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  limit,
} from "firebase/firestore";
import { db, auth } from "@/libs/firebaseClient";

const daysOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function ChatActivityChart() {
  const [chartData, setChartData] = useState<{ day: string; chats: number }[]>(
    [],
  );

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "messages"),
      where("userId", "==", user.uid),
      limit(100),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const counts: Record<string, number> = {
        Mon: 0,
        Tue: 0,
        Wed: 0,
        Thu: 0,
        Fri: 0,
        Sat: 0,
        Sun: 0,
      };

      snapshot.docs.forEach((doc) => {
        const createdAt = doc.data().createdAt?.toDate?.();
        if (!createdAt) return;

        const day = createdAt.toLocaleDateString("en-US", {
          weekday: "short",
        });

        counts[day] = (counts[day] || 0) + 1;
      });

      // ✅ Keep correct order
      const formattedData = daysOrder.map((day) => ({
        day,
        chats: counts[day] || 0,
      }));

      setChartData(formattedData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-[#646776]">
        Chat Activity
      </h3>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="chats"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
