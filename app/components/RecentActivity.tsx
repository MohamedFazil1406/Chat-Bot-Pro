"use client";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  where,
  getDocs,
} from "firebase/firestore";
import { db, auth } from "@/libs/firebaseClient";

type Activity = {
  name: string;
  role: string;
  time: string;
};

export default function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [botNames, setBotNames] = useState<Record<string, string>>({});

  // ✅ 1. Fetch bot names
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

  // ✅ 2. Listen to recent activity (grouped by session)
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "messages"), // 🔥 FIX: use messages
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(20), // fetch more, then filter
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const sessionMap: Record<string, any> = {};

      snapshot.docs.forEach((doc) => {
        const d = doc.data();

        // ✅ keep only latest per session
        if (!sessionMap[d.sessionId]) {
          sessionMap[d.sessionId] = d;
        }
      });

      const data = Object.values(sessionMap)
        .slice(0, 5) // only top 5 sessions
        .map((d: any) => ({
          name: botNames[d.botType] || d.botType,
          role: d.role === "user" ? "User started chat" : "Bot replied",
          time: formatTime(d.createdAt),
        }));

      setActivities(data);
    });

    return () => unsubscribe();
  }, [botNames]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm min-w-40">
      <h3 className="text-lg font-semibold mb-4 text-[#646776]">
        Recent Activity
      </h3>

      <div className="space-y-4">
        {activities.length === 0 ? (
          <p className="text-sm text-gray-400">No activity yet</p>
        ) : (
          activities.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm text-[#646776]">
                  {item.name}
                </p>
                <p className="text-xs text-gray-500">{item.role}</p>
              </div>

              <span className="text-xs text-gray-400">{item.time}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ✅ Improved time formatting
function formatTime(timestamp: any) {
  if (!timestamp?.toDate) return "just now";

  const date = timestamp.toDate();
  const now = new Date();

  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return "just now";
  if (diff < 300) return "few mins ago";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;

  return `${Math.floor(diff / 86400)}d ago`;
}
