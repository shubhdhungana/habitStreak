"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import TodoList from "./TodoList";

interface Habit {
  id: string;
  habit: string;
  last_checked: Date | null;
  streak_count: number;
}

export default function Welcome() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState("");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) {
        router.push("/login");
      } else {
        setUser(session.user);
        fetchHabits(session.user.id);
      }
    };
    getUser();
  }, [router]);

  const fetchHabits = async (user_id: string) => {
    const { data, error } = await supabase
      .from("habits")
      .select("*")
      .eq("user_id", user_id);

    if (error) {
      console.error("Error fetching habits: ", error);
    } else {
      setHabits(data);
    }

    setLoading(false);
  };

  const handleAddHabit = async () => {
    if (newHabit.trim() === "") return;

    const { data, error } = await supabase
      .from("habits")
      .insert({
        habit: newHabit,
        user_id: user.id,
        streak_count: 0,
        last_checked: null,
      })
      .select();

    if (error) {
      console.error("Error adding habit: ", error);
    } else {
      setHabits([...habits, data[0]]);
      setNewHabit(""); // Clear input after adding habit
    }
  };

  const handleStreakSubmit = async (habit: Habit) => {
    const currentDate = new Date().toDateString();
    const lastCheckedDate = habit.last_checked
      ? new Date(habit.last_checked).toDateString()
      : "";

    if (lastCheckedDate === currentDate) {
      console.log("Habit already submitted for today.");
      return; // Prevent multiple submissions in a day
    }

    const newStreakCount = habit.streak_count + 1;

    const { error } = await supabase
      .from("habits")
      .update({ last_checked: new Date(), streak_count: newStreakCount })
      .eq("id", habit.id);

    if (!error) {
      setHabits(
        habits.map((h) =>
          h.id === habit.id
            ? {
                ...habit,
                streak_count: newStreakCount,
                last_checked: new Date(),
              }
            : h
        )
      );
    } else {
      console.error("Error updating habit: ", error);
    }
  };

  const handleDeleteHabit = async (habitId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this habit?"
    );
    if (!confirmDelete) return;

    const { error } = await supabase.from("habits").delete().eq("id", habitId);

    if (!error) {
      setHabits(habits.filter((h) => h.id !== habitId));
    } else {
      console.error("Error deleting habit: ", error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) return <div className="text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 to-purple-300 p-8 flex flex-col items-center relative">
      {/* Username/Email Display */}
      <div className="absolute top-4 right-4 text-gray-800 font-medium">
        {user?.email}
      </div>

      <h1 className="text-4xl font-bold text-gray-800 mb-2">HabitStreak</h1>
      <h2 className="text-xl text-gray-600 mb-6">Build of Consistency</h2>

      {/* Add New Habit Section */}
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
          className="bg-green-600 text-white p-2 rounded-lg transition duration-300 hover:bg-green-500"
        >
          Add Habit
        </button>
      </div>

      {/* Habit List */}
      <TodoList
        habits={habits}
        onStreakSubmit={handleStreakSubmit}
        onDeleteHabit={handleDeleteHabit}
      />

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="mt-6 bg-red-600 text-white p-2 rounded-lg transition duration-300 hover:bg-red-500"
      >
        Logout
      </button>
    </div>
  );
}
