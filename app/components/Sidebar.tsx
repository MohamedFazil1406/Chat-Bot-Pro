"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Bot,
  BarChart,
  Users,
  MessagesSquare,
} from "lucide-react";
import Logo from "./icons/Logo";

export default function Sidebar() {
  const pathname = usePathname() || "";

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Bots", href: "/bots", icon: Bot },
    { name: "Chat Sessions", href: "/chat-sessions", icon: MessagesSquare },
    { name: "Analytics", href: "/analytics", icon: BarChart },
  ];

  return (
    <div className="w-64 bg-[#efeff6] min-h-screen shadow-md p-5">
      <div className="flex justify-center items-center mb-4">
        <Logo />
      </div>

      <hr className="border-gray-500 mb-4" />

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          // Supports subroutes too
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-blue-100 hover:text-blue-600"
              }`}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
