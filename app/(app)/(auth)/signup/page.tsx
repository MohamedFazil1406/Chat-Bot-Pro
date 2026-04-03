"use client";

import Logo from "../../../components/icons/Logo";
import LoginForm from "../../../components/auth/LoginForm";
import { useState } from "react";
import { auth } from "../../../../libs/firebaseClient";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const user = userCredential.user;

      // 2️⃣ Store full name in Firebase Auth profile
      await updateProfile(user, {
        displayName: fullName,
      });

      // 3️⃣ Send verification email
      await sendEmailVerification(user);

      alert("Verification email sent! Please check your inbox.");

      // 4️⃣ Redirect to login instead of dashboard
      router.push("/login");
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        setError("Email already in use.");
      } else if (error.code === "auth/invalid-email") {
        setError("Invalid email address.");
      } else if (error.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else {
        setError("Registration failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#efeff7] min-h-screen">
      <div className="max-w-130 mx-auto p-6 text-black flex flex-col items-center bg-white rounded-lg shadow-lg mt-20">
        <Logo />

        <h1 className="text-2xl font-bold">Getting Started</h1>
        <h2 className="text-lg mb-6">Create your account</h2>

        <form onSubmit={handleRegister} className="mb-6 w-full max-w-md">
          {error && <p className="text-red-500 mb-4">{error}</p>}

          <LoginForm
            mode="signup"
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            fullName={fullName}
            setFullName={setFullName}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
          />

          <label className="text-sm">
            <input type="checkbox" required /> I agree to the{" "}
            <a href="#" className="text-[#3767e6]">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="text-[#3767e6]">
              Privacy Policy
            </a>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full bg-[#3969e7] text-white p-2 rounded font-bold disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <div className="text-center">
          Already have an account?{" "}
          <a href="/login" className="text-[#3767e6]">
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
}
