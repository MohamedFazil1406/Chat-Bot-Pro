"use client";

import { Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import BotSettingsModal from "./BotSettingsModal";
import { useState, useEffect } from "react";
import { bots } from "@/libs/bots";
import { auth, db } from "@/libs/firebaseClient";
import { doc, onSnapshot } from "firebase/firestore";

import {
  Headset,
  TrendingUp,
  Users,
  Megaphone,
  ClipboardList,
  Calendar,
} from "lucide-react";

export const botIcons = {
  support: Headset,
  sales: TrendingUp,
  hr: Users,
  marketing: Megaphone,
  survey: ClipboardList,
  booking: Calendar,
};

type Props = {
  name: string;
  description: string;
  botType: keyof typeof botIcons;
};

export const botColors = {
  support: "w-8 h-8 bg-green-100 text-green-600 p-1 rounded-lg",
  sales: "w-8 h-8 bg-blue-100 text-blue-600 p-1 rounded-lg",
  hr: "w-8 h-8 bg-purple-100 text-purple-600 p-1 rounded-lg",
  marketing: "w-8 h-8 bg-orange-100 text-orange-600 p-1 rounded-lg",
  survey: "w-8 h-8 bg-pink-100 text-pink-600 p-1 rounded-lg",
  booking: "w-8 h-8 bg-yellow-100 text-yellow-600 p-1 rounded-lg",
};

export default function BotCard({ name, description, botType }: Props) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [botData, setBotData] = useState({
    name,
    description,
  });

  const router = useRouter();
  const Icon = botIcons[botType];
  const user = auth.currentUser;

  // 🔥 REAL-TIME FIRESTORE LISTENER
  useEffect(() => {
    if (!user) return;

    const ref = doc(db, "users", user.uid, "bots", botType);

    const unsubscribe = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const data = snap.data();

        setBotData({
          name: data.name || bots[botType].name,
          description: data.description || description,
        });
      } else {
        // fallback if no custom data
        setBotData({
          name,
          description,
        });
      }
    });

    return () => unsubscribe();
  }, [user, botType, name, description]);

  return (
    <>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition max-w-52">
        {/* Top Section */}
        <div className="flex items-center gap-3">
          <Icon size={20} className={botColors[botType]} />
          <h3 className="font-semibold text-gray-800">
            {botData.name} {/* ✅ dynamic */}
          </h3>
        </div>

        <p className="text-sm mt-1 text-gray-600">
          {botData.description} {/* ✅ dynamic */}
        </p>

        <hr className="my-3" />

        <div className="grid grid-cols-5 gap-3">
          <button
            onClick={() => router.push(`/chat/${botType}`)}
            className="col-span-3 bg-blue-600 text-white py-2 rounded-xl text-sm font-medium hover:bg-blue-700"
          >
            Open Chat
          </button>

          <button
            onClick={() => setSettingsOpen(true)}
            className="col-span-2 flex justify-center items-center border rounded-lg hover:bg-gray-100"
          >
            <Settings size={18} className="text-gray-500" />
          </button>
        </div>
      </div>

      {/* SETTINGS MODAL */}
      <BotSettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        botType={botType}
        initialData={bots[botType]}
        userId={user?.uid || ""}
      />
    </>
  );
}
