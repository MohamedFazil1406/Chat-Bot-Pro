"use client";

import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import Sidebar from "@/app/components/Sidebar";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

import { collection, getDocs } from "firebase/firestore";
import { db } from "@/libs/firebaseClient";

type BotData = {
  name: string;
  value: number;
};

const COLORS = ["#2563eb", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444"];

export default function AnalyticsPage() {
  const [data, setData] = useState<BotData[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "messages"));

      const counts: Record<string, number> = {};

      snapshot.forEach((doc) => {
        const botType = doc.data().botType || "unknown";
        counts[botType] = (counts[botType] || 0) + 1;
      });

      const formatted = Object.entries(counts).map(([key, value]) => ({
        name: key.toUpperCase(),
        value,
      }));

      const totalMessages = formatted.reduce((acc, cur) => acc + cur.value, 0);

      setData(formatted);
      setTotal(totalMessages);
    };

    fetchData();
  }, []);

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

          {/* 🔥 ANALYTICS CONTENT */}
          <div className="p-6 space-y-6 bg-[#efeff6] min-h-screen">
            <h1 className="text-2xl font-semibold text-gray-800">
              Analytics Overview
            </h1>

            <div className="grid md:grid-cols-2 gap-6">
              {/* PIE CHART */}
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-[#646776]">
                  Most Used Bots
                </h3>

                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data}
                      dataKey="value"
                      outerRadius={100}
                      label={({ name, percent }) =>
                        `${name} (${((percent as number) * 100).toFixed(0)}%)`
                      }
                    >
                      {data.map((_, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                        />
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

              {/* TABLE */}
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-[#646776]">
                  Bot Usage Details
                </h3>

                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b">
                      <th className="pb-2">Bot</th>
                      <th className="pb-2">Messages</th>
                      <th className="pb-2">Usage %</th>
                    </tr>
                  </thead>

                  <tbody>
                    {data.map((bot, i) => {
                      const percent = total
                        ? ((bot.value / total) * 100).toFixed(1)
                        : 0;

                      return (
                        <tr key={i} className="border-b last:border-none">
                          <td className="py-2 font-medium text-black ">
                            {bot.name}
                          </td>
                          <td className="py-2 text-black">{bot.value}</td>
                          <td className="py-2 text-black">{percent}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
