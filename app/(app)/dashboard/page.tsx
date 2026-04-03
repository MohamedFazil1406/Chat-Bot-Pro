"use client";

import BotCard from "@/app/components/BotCard";
import ChatActivityChart from "@/app/components/ChatActivityChart";
import CustomerPieChart from "@/app/components/CustomerPieChart";
import MessagesBarChart from "@/app/components/MessagesBarChart";
import Navbar from "@/app/components/Navbar";
import RecentActivity from "@/app/components/RecentActivity";
import Sidebar from "@/app/components/Sidebar";
import Statcard from "@/app/components/Statcard";
import { Bot, MessageCircle, Mail, Users } from "lucide-react";

import { collection, getDocs, query, where, limit } from "firebase/firestore";

import { db, auth } from "@/libs/firebaseClient";
import { useEffect, useState } from "react";
import { bots } from "@/libs/bots";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalBots: 0,
    activeBots: 0,
    messagesToday: 0,
    totalCustomers: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      const user = auth.currentUser;

      if (!user) return;

      // ✅ ONLY current user's messages
      const messagesSnap = await getDocs(
        query(
          collection(db, "messages"),
          where("userId", "==", user.uid),
          limit(100), // ✅ only last 100 messages for performance
        ),
      );

      const totalBots = Object.keys(bots).length;

      const activeBots = new Set(
        messagesSnap.docs.map((doc) => doc.data().botType),
      ).size;

      const today = new Date();

      const messagesToday = messagesSnap.docs.filter((doc) => {
        const date = doc.data().createdAt?.toDate?.();
        if (!date) return false;

        return (
          date.getDate() === today.getDate() &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear()
        );
      }).length;

      // ❌ DO NOT expose all users count (unless admin)
      const totalCustomers = 0;

      setStats({
        totalBots,
        activeBots,
        messagesToday,
        totalCustomers,
      });
    }

    fetchStats();
  }, []);

  return (
    <div className="bg-white h-screen">
      <div className="flex">
        <Sidebar />

        <div className="w-px bg-gray-300"></div>

        <div className="flex-1 flex flex-col">
          {/* Navbar */}
          <div className="p-4">
            <Navbar />
          </div>

          <hr className="border-gray-300" />

          {/* Main Content */}
          <div className="bg-[#efeff6] flex-1 p-6 space-y-8">
            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              <Statcard
                icon={Bot}
                title="Total Bots"
                value={stats.totalBots.toString()}
              />

              <Statcard
                icon={MessageCircle}
                title="Active Bots"
                value={stats.activeBots.toString()}
              />

              <Statcard
                icon={Mail}
                title="Messages Today"
                value={stats.messagesToday.toString()}
              />

              <Statcard
                icon={Users}
                title="Total Customers"
                value={stats.totalCustomers.toString()}
              />
            </div>

            {/* Your Bots + Activity Layout */}
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-6">
                Your Bots
              </h2>

              <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                {/* LEFT SIDE */}
                <div className="xl:col-span-3 space-y-6">
                  {/* Bot Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <BotCard
                      name="SupportBot"
                      description="Customer Support Bot"
                      botType="support"
                    />
                    <BotCard
                      name="SalesBot"
                      description="Lead & Marketing Bot"
                      botType="sales"
                    />
                    <BotCard
                      name="HRBot"
                      description="Employee Assistance Bot"
                      botType="hr"
                    />
                  </div>

                  {/* Charts */}
                  <ChatActivityChart />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <MessagesBarChart />
                    <CustomerPieChart />
                  </div>
                </div>

                {/* RIGHT SIDE */}
                <RecentActivity />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
