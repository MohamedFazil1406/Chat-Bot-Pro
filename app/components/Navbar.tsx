"use client";

import { Search } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/libs/firebaseClient";
import axios from "axios";
import { useRouter } from "next/navigation";

function getInitials(name: string) {
  const names = name.split(" ");
  const initials = names.map((n) => n[0]).join("");
  return initials.toUpperCase();
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Current user in Navbar:", currentUser?.photoURL);
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await axios.post("/api/auth/sessionLogout");
      router.push("/");
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="bg-white h-10 px-6 ml-20 flex justify-between  ">
      <div className="flex justify-center items-center">
        <div className="border px-4 py-2.5 rounded-tl-lg rounded-bl-lg">
          <Search size={18} className="text-gray-600" />
        </div>

        <input
          type="text"
          placeholder="Search..."
          className="rounded-tr-lg rounded-br-lg px-4 py-2 w-80 bg-[#efeef5] border-0 text-black focus:outline-none"
        />
      </div>
      <div className="relative" ref={dropdownRef}>
        {/* Avatar */}
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 focus:outline-none"
        >
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt="Profile"
              className="w-10 h-10 rounded-full border border-gray-600 object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-700 text-white flex items-center justify-center font-bold">
              {user && getInitials(user.displayName || "")}
            </div>
          )}
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 mt-2 w-56 rounded-lg bg-[#1f2937] shadow-lg border border-gray-700 z-50">
            <div className="px-4 py-3 border-b border-gray-700">
              <p className="text-sm font-medium text-white">
                {user?.displayName || "User"}
              </p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 rounded-b-lg"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
