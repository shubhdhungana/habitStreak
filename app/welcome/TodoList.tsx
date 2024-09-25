
"use client";

import StreakEmoji from "./StreakEmoji";

interface Habit {
  id: string;
  habit: string;
  last_checked: Date | null;
  streak_count: number;
}

interface TodoListProps {
  habits: Habit[];
  onStreakSubmit: (habit: Habit) => void;
  onDeleteHabit: (habitId: string) => void;
}

export default function TodoList({
  habits,
  onStreakSubmit,
  onDeleteHabit,
}: TodoListProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Your Habits</h2>

      {/* Habit list */}
      <div className="space-y-2">
        {habits.length > 0 ? (
          habits.map((habit) => (
            <div key={habit.id} className="flex items-center mb-2">
              
              <span className="flex-grow font-bold capitalize ">{habit.habit}</span>
              
              {/* Display the streak count with fire emoji */}
              <span className="mx-4 font-semibold">{habit.streak_count} 🔥</span>

              <button
                onClick={() => onStreakSubmit(habit)}
                className="bg-blue-500 text-white p-2 rounded ml-2"
              >
                Submit
              </button>
              <button
                onClick={() => onDeleteHabit(habit.id)}
                className="bg-red-500 text-white p-2 rounded ml-2"
              >
                Delete
              </button>
              
            </div>
            
          ))
        ) : (
          <p>No habits found.</p>
        )}
      </div>
    </div>
  );
}
