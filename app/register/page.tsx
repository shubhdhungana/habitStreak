"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Main function for the Registration page
export default function Register() {
  const router = useRouter(); // React hook to navigate between pages
  const [email, setEmail] = useState(""); // State for email input field
  const [password, setPassword] = useState(""); // State for password input field
  const [error, setError] = useState(""); // State for handling errors

  /* 
    This function handles the form submission. 
    It prevents the default form behavior, resets previous error messages, 
    and attempts to sign the user up using Supabase authentication. 
    If there is an error, it sets the error state, 
    otherwise, it redirects the user to the "welcome" page.
  */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevents the default page reload on form submission
    setError(""); // Resets any previous errors

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    /* 
      If there is an error during sign-up, the error message is captured and 
      displayed to the user.
    */
    if (error) {
      setError(error.message);
    } else {
      router.push("/welcome"); // Redirects the user to the welcome page on success
    }
  };

  return (
    /* 
      This is the main container div. It centers the registration form 
      both horizontally and vertically, making the UI look clean and centered.
      The background is set to a light gray to give a soft aesthetic.
    */
    <div className="flex items-center justify-center h-screen bg-gray-100">
      {/* Card-like container to hold the form */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        {/* Application title */}
        <h1 className="text-3xl font-bold text-center mb-4 text-yellow-500">
          HabitStreak
        </h1>

        {/* Subtitle for registration */}
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        {/* Registration form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email input field */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Updates email state on change
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
              placeholder="Enter your email"
            />
          </div>

          {/* Password input field */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Updates password state on change
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
              placeholder="Enter your password"
            />
          </div>

          {/* Display error message if there is one */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Submit button for registration */}
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition duration-200"
          >
            Register
          </button>
        </form>

        {/* Link to the login page if the user already has an account */}
        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
