"use client";

import Logo from "../../../components/icons/Logo";
import LoginForm from "../../../components/auth/LoginForm";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/libs/firebaseClient";
import axios from "axios";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlelogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const user = userCredential.user;

      if (!user.emailVerified) {
        setError("Please verify your email before logging in.");
        setLoading(false);
        return;
      }

      const idToken = await user.getIdToken();

      const resp = await axios.post(
        "/api/auth/sessionLogin",
        { idToken },
        { headers: { "Content-Type": "application/json" } },
      );

      if (resp.status === 200) {
        router.push("/dashboard");
      } else {
        setError("Login failed during session setup.");
      }
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        setError("No user found with this email.");
      } else if (error.code === "auth/wrong-password") {
        setError("Incorrect password.");
      } else {
        setError("Login failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#efeff7] min-h-screen">
      <div className="max-w-130 mx-auto p-6 text-black flex flex-col items-center bg-white rounded-lg shadow-lg mt-20 h-3/4">
        <Logo />
        <h1 className="text-2xl font-bold font-sans ">Welcome Back</h1>
        <h2 className="text-lg mb-6"> Login to your account</h2>
        <form className="mb-6 w-full max-w-md">
          <div className="max-w-full">
            {error && <p className="text-red-500">{error}</p>}
          </div>
          <LoginForm
            mode="signin"
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            fullName=""
            setFullName={() => {}}
            confirmPassword=""
            setConfirmPassword={() => {}}
          />

          <div className="text-right">
            <a
              href="/forgot-password"
              className="text-[#3767e6] font-medium text-sm"
            >
              Forgot Password?
            </a>
          </div>

          <label>
            <input type="checkbox" /> Remember Me
          </label>
          <br />
          <div className="bg-[#3969e7] rounded mt-4">
            <button
              onClick={handlelogin}
              className="text-[#fdfcfd] p-2 text-center w-full font-bold "
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </div>
        </form>
        <div className="text-center">
          Don't have an account?{" "}
          <a href="/signup" className="text-[#3767e6]">
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}
