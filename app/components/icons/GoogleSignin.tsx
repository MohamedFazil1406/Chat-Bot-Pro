"use client";

import { auth } from "../../../libs/firebaseClient"; // make sure path is correct: ../lib NOT ../libs
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import axios from "axios";

export default function GoogleSignInButton() {
  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      // correct axios usage: axios.post(url, data, config)
      const resp = await axios.post(
        "/api/auth/sessionLogin",
        { idToken },
        { headers: { "Content-Type": "application/json" } },
      );

      if (resp.status == 200) {
        console.log("sessionLogin successful");
        window.location.href = "/dashboard";
      } else {
        console.error("sessionLogin failed:", resp.data);
        alert("Sign-in failed during session setup. Please try again.");
        return;
      }
    } catch (err: any) {
      // Detailed logging (helps debug network / axios issues)

      if (axios.isAxiosError(err)) {
        console.error("Axios error:", err.toJSON(), err.response?.data);
      } else {
        console.error("Sign-in error:", err);
      }

      // Handle firebase popup errors
      // const code = err?.code;
      // if (code === "auth/popup-closed-by-user") {
      //   alert("Sign-in cancelled. Please try again.");
      //   return;
      // }

      // if (
      //   code === "auth/popup-blocked" ||
      //   code === "auth/cancelled-popup-request"
      // ) {
      //   // popup blocked — fallback to redirect
      //   try {
      //     await signInWithRedirect(auth, provider);
      //     return;
      //   } catch (redirectErr) {
      //     console.error("Redirect fallback failed:", redirectErr);
      //     alert("Sign-in failed. Try another browser.");
      //     return;
      //   }
      // }

      // // generic fallback attempt: redirect
      // try {
      //   await signInWithRedirect(auth, provider);
      // } catch (redirectErr) {
      //   console.error("Final redirect fallback failed:", redirectErr);
      //   alert("Sign in failed — check console for details.");
      // }
    }
  };

  return (
    <button
      onClick={handleSignIn}
      className="w-full justify-center items-center inline-flex  gap-3 px-4 py-2 rounded-lg shadow-sm
                 bg-white text-slate-700 border border-slate-200
                 hover:shadow-md active:scale-[0.99] transition-transform focus:outline-none focus:ring-2 focus:ring-blue-400"
      aria-label="Sign in with Google"
      type="button"
    >
      {/* Google G */}
      <svg
        width="18"
        height="18"
        viewBox="0 0 533.5 544.3"
        className="block"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          fill="#4285F4"
          d="M533.5 278.4c0-18.1-1.6-35.5-4.6-52.4H272v99.3h147.5c-6.4 34.5-25.3 63.7-54 83.4v69.6h87.2c51-47 81.8-116.4 81.8-199.9z"
        />
        <path
          fill="#34A853"
          d="M272 544.3c73.7 0 135.6-24.5 180.8-66.6l-87.2-69.6c-24.3 16.3-55.4 26-93.6 26-72 0-133.1-48.7-154.9-114.1H28.4v71.8C74.1 481 166.1 544.3 272 544.3z"
        />
        <path
          fill="#FBBC05"
          d="M117.1 323.9c-11.9-35.8-11.9-74.9 0-110.7V141.4H28.4c-39.9 79.9-39.9 174.2 0 254.1l88.7-71.6z"
        />
        <path
          fill="#EA4335"
          d="M272 107.7c39.9 0 75.9 13.7 104.2 40.7l78-78C401.6 24 337.9 0 272 0 166.1 0 74.1 63.3 28.4 141.4l88.7 71.8C138.9 156.4 200 107.7 272 107.7z"
        />
      </svg>

      <span className="text-sm font-medium">Sign in with Google</span>
    </button>
  );
}
