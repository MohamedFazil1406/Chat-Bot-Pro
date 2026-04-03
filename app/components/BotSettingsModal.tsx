"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/libs/firebaseClient";

type Props = {
  open: boolean;
  onClose: () => void;
  botType: string;
  userId: string;
  initialData: {
    name: string;
    prompt: string;
  };
};

export default function BotSettingsModal({
  open,
  onClose,
  botType,
  initialData,
  userId,
}: Props) {
  const [activeTab, setActiveTab] = useState("GENERAL");

  const [settings, setSettings] = useState({
    name: "",
    description: "",
    prompt: "",
    tone: "friendly",
    temperature: 0.7,
    leadCapture: true,
    widgetColor: "#2563eb",
  });

  useEffect(() => {
    const loadSettings = async () => {
      if (!userId) return;

      const docRef = doc(db, "users", userId, "bots", botType);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        setSettings((prev) => ({
          ...prev,
          ...snap.data(),
        }));
      } else {
        // fallback
        setSettings((prev) => ({
          ...prev,
          name: initialData.name,
          prompt: initialData.prompt,
        }));
      }
    };

    loadSettings();
  }, [userId, botType]);

  const handleSave = async () => {
    if (!userId) return;

    await setDoc(doc(db, "users", userId, "bots", botType), settings);

    console.log("Saved:", settings);

    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-175 rounded-2xl shadow-xl flex overflow-hidden">
        {/* Sidebar Tabs */}
        <div className="w-48 bg-gray-50 border-r p-4 space-y-3 text-black">
          {["GENERAL", "BEHAVIOUR", "AI", "LEADS", "WIDGET"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-3 py-2 rounded-lg  ${
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-black">Bot Settings</h2>
            <X className="cursor-pointer text-black" onClick={onClose} />
          </div>

          {/* TAB CONTENTS */}

          {/* GENERAL */}
          {activeTab === "GENERAL" && (
            <div className="space-y-4">
              <input
                className="w-full border p-2 rounded text-black"
                placeholder="Bot Name"
                value={settings.name}
                onChange={(e) =>
                  setSettings({ ...settings, name: e.target.value })
                }
              />

              <textarea
                className="w-full border p-2 rounded text-black"
                placeholder="Description"
                value={settings.description}
                onChange={(e) =>
                  setSettings({ ...settings, description: e.target.value })
                }
              />
            </div>
          )}

          {/* BEHAVIOR */}
          {activeTab === "BEHAVIOUR" && (
            <div className="space-y-4">
              <textarea
                className="w-full border p-2 rounded text-black"
                placeholder="System Prompt"
                value={settings.prompt}
                onChange={(e) =>
                  setSettings({ ...settings, prompt: e.target.value })
                }
              />

              <select
                className="w-full border p-2 rounded text-black"
                value={settings.tone}
                onChange={(e) =>
                  setSettings({ ...settings, tone: e.target.value })
                }
              >
                <option value="friendly">Friendly</option>
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
              </select>
            </div>
          )}

          {/* AI CONFIG */}
          {activeTab === "AI" && (
            <div className="space-y-4 text-black">
              <label>Temperature: {settings.temperature}</label>
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={settings.temperature}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    temperature: Number(e.target.value),
                  })
                }
                className="w-full"
              />
            </div>
          )}

          {/* LEADS */}
          {activeTab === "LEADS" && (
            <div className="flex items-center gap-3 text-black">
              <input
                type="checkbox"
                checked={settings.leadCapture}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    leadCapture: e.target.checked,
                  })
                }
              />
              <label>Enable Lead Capture</label>
            </div>
          )}

          {/* WIDGET */}
          {activeTab === "WIDGET" && (
            <div className="space-y-4 text-black">
              <label>Widget Color</label>
              <input
                type="color"
                value={settings.widgetColor}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    widgetColor: e.target.value,
                  })
                }
              />
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded text-black"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
