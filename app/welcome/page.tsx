"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import TodoList from "./TodoList";
import Swal from "sweetalert2"; // Import SweetAlert2 for showing confirmation alerts
import { AiOutlineUser } from "react-icons/ai"; // Import user icon from React Icons

// Defining the structure of the Habit data
interface Habit {
  id: string;
  habit: string;
  last_checked: Date | null;
  streak_count: number;
}

export default function Welcome() {
  const [habits, setHabits] = useState<Habit[]>([]); // State to store user's habits
  const [newHabit, setNewHabit] = useState(""); // State to manage new habit input
  const [user, setUser] = useState<any>(null); // State for storing user information
  const [loading, setLoading] = useState(true); // State to handle loading status
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown menu visibility
  const router = useRouter(); // Next.js router for navigation

  useEffect(() => {
    // Fetch user data on component mount
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession(); // Fetch current session from Supabase
      if (!session?.user) {
        router.push("/login"); // Redirect to login page if no user is logged in
      } else {
        setUser(session.user); // Set user in state
        fetchHabits(session.user.id); // Fetch user's habits from Supabase
      }
    };
    getUser(); // Call getUser function
  }, [router]); // Depend on router to re-run on login/logout

  /* 
    This function fetches habits from Supabase and updates the state with the user's habits.
    It also handles any errors that may occur while fetching data.
  */
  const fetchHabits = async (user_id: string) => {
    const { data, error } = await supabase
      .from("habits")
      .select("*")
      .eq("user_id", user_id); // Fetch habits for the current user

    if (error) {
      console.error("Error fetching habits: ", error); // Log error if any
    } else {
      setHabits(data); // Update state with fetched habits
    }

    setLoading(false); // Set loading to false once data is fetched
  };

  /* 
    This function handles adding a new habit to the database.
    It checks if the input is empty before attempting to add the habit to Supabase.
    After adding, the new habit is displayed in the list.
  */
  const handleAddHabit = async () => {
    if (newHabit.trim() === "") return; // Prevent adding empty habits

    const { data, error } = await supabase
      .from("habits")
      .insert({
        habit: newHabit,
        user_id: user.id,
        streak_count: 0, // Initial streak count is 0
        last_checked: null, // No last checked date initially
      })
      .select();

    if (error) {
      console.error("Error adding habit: ", error); // Log any error
    } else {
      setHabits([...habits, data[0]]); // Add the new habit to the state
      setNewHabit(""); // Clear the input field after adding
    }
  };

  /* 
    This function handles streak submission when a user marks a habit as completed for the day.
    It prevents multiple submissions for the same habit on the same day and updates the streak count.
  */
  const handleStreakSubmit = async (habit: Habit) => {
    const currentDate = new Date().toDateString(); // Get today's date as a string
    const lastCheckedDate = habit.last_checked
      ? new Date(habit.last_checked).toDateString()
      : "";

    // Prevent marking the habit if it has already been checked today
    if (lastCheckedDate === currentDate) {
      console.log("Habit already submitted for today.");
      return;
    }

    const newStreakCount = habit.streak_count + 1; // Increment streak count

    const { error } = await supabase
      .from("habits")
      .update({ last_checked: new Date(), streak_count: newStreakCount })
      .eq("id", habit.id); // Update habit's streak count in the database

    if (!error) {
      setHabits(
        habits.map((h) =>
          h.id === habit.id
            ? { ...habit, streak_count: newStreakCount, last_checked: new Date() }
            : h
        )
      ); // Update habit list with new streak count
    } else {
      console.error("Error updating habit: ", error); // Log error if updating fails
    }
  };

  /* 
    This function handles the deletion of a habit. It uses SweetAlert2 to confirm the deletion
    before actually deleting the habit from the database.
  */
  const handleDeleteHabit = async (habitId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      const { error } = await supabase
        .from("habits")
        .delete()
        .eq("id", habitId); // Delete the habit from Supabase

      if (!error) {
        setHabits(habits.filter((h) => h.id !== habitId)); // Remove habit from state
        Swal.fire("Deleted!", "Your habit has been deleted.", "success"); // Show success alert
      } else {
        console.error("Error deleting habit: ", error); // Log error if deleting fails
      }
    }
  };

  /* 
    This function handles user logout. It signs the user out using Supabase 
    and redirects them to the login page.
  */
  const handleLogout = async () => {
    await supabase.auth.signOut(); // Sign out user
    router.push("/login"); // Redirect to login page
  };

  // Toggle dropdown menu visibility
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Return loading state if data is being fetched
  if (loading) return <div className="text-center">Loading...</div>;

  return (
    /* Main container with gradient background */
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-red-300 p-8 flex flex-col items-center relative">
      
      {/* User Profile Icon with dropdown */}
      <div className="absolute top-4 right-4">
        <div className="relative inline-block text-left">
          <button
            onClick={toggleDropdown}
            className="flex items-center focus:outline-none"
          >
            <AiOutlineUser className="w-8 h-8 text-gray-800" /> {/* User Icon */}
          </button>
          
          {dropdownOpen && (
            /* Dropdown menu for profile settings and logout */
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md">
              <div className="py-1">
                <button
                  onClick={() => router.push("/profile-settings")}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  Profile Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <h1 className="text-4xl font-bold text-gray-800 mb-2">HabitStreak</h1>
      <h2 className="text-xl text-gray-600 mb-6">Build of Consistency</h2>

      {/* New Habit Input Section */}
      <div className="mb-6 bg-white shadow-lg rounded-lg p-4 w-full max-w-md">
        <input
          type="text"
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          placeholder="Enter new habit"
          className="border border-gray-300 p-2 rounded-lg w-full mr-2 focus:outline-none focus:ring focus:ring-blue-400"
        />
        <button
          onClick={handleAddHabit}
          className="bg-green-600 mt-2 text-white p-2 rounded-lg transition duration-300 hover:bg-green-500"
        >
          Add Habit
        </button>
      </div>

      {/* List of Habits */}
      <TodoList
        habits={habits}
        onStreakSubmit={handleStreakSubmit}
        onDeleteHabit={handleDeleteHabit}
      />
    </div>
  );
}
