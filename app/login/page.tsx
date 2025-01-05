"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Main Login function component
export default function Login() {
  const router = useRouter(); // React hook for client-side navigation
  const [email, setEmail] = useState(""); // State for storing email input
  const [password, setPassword] = useState(""); // State for storing password input
  const [error, setError] = useState(""); // State for error messages

  /* 
    This function handles the login form submission. 
    It prevents the default form submission behavior, attempts to sign the user in 
    using Supabase authentication, and handles errors by updating the error state.
    If login is successful, the user is redirected to the welcome page.
  */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevents page reload on form submission

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    /* 
      If an error occurs during the login process, 
      the error message is set to the error state and displayed on the UI.
    */
    if (error) {
      setError(error.message);
    } else {
      router.push("/welcome"); // If login is successful, redirect to the welcome page
    }
  };

  return (
    /* 
      Main container that centers the content both horizontally and vertically. 
      The background is set to a light gray for a clean aesthetic.
    */
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">

      {/* Inner container for the login form */}
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        
        {/* Title of the app */}
        <h1 className="text-3xl font-bold text-center mb-4 text-yellow-500">HabitStreak</h1>

        {/* Subtitle for login */}
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        {/* Conditional error message rendering */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Login form */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* Email input field */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email} // Controlled input: email state updates as the user types
              onChange={(e) => setEmail(e.target.value)} // Updates email state on input change
              className="w-full border border-gray-300 p-2 rounded-lg"
              required // Ensures the field is not empty before submission
            />
          </div>

          {/* Password input field */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password} // Controlled input: password state updates as the user types
              onChange={(e) => setPassword(e.target.value)} // Updates password state on input change
              className="w-full border border-gray-300 p-2 rounded-lg"
              required // Ensures the field is not empty before submission
            />
          </div>

          {/* Submit button for login */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
          >
            Login
          </button>
        </form>

        {/* Link to the registration page for users who don't have an account */}
        <p className="text-center text-sm mt-4">
          not registered yet?{" "}
          <Link href="/register" className="text-blue-500 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
