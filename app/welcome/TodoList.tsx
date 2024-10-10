

"use client";
import { useState, useEffect } from "react";
import { Fireworks } from "fireworks-js"; // Import Fireworks from fireworks-js


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
  // Store disabled state for each habit button
  const [disabledButtons, setDisabledButtons] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    // On component mount, check if the buttons should be disabled based on localStorage
    habits.forEach((habit) => {
      const lastChecked = localStorage.getItem(`habit-${habit.id}-lastChecked`);
      if (lastChecked && isSameDay(new Date(lastChecked), new Date())) {
        // If last submission was today, disable the button
        setDisabledButtons((prev) => ({ ...prev, [habit.id]: true }));
      } else {
        // Otherwise, enable the button
        setDisabledButtons((prev) => ({ ...prev, [habit.id]: false }));
      }
    });
  }, [habits]);

  const handleStreakSubmit = (habit: Habit) => {


    // Call the parent's submit handler
    onStreakSubmit(habit);

    // Disable the button for the current habit
    setDisabledButtons((prev) => ({ ...prev, [habit.id]: true }));

    // Save the current date in localStorage
    localStorage.setItem(`habit-${habit.id}-lastChecked`, new Date().toString());

    // Set a timeout to re-enable the button at midnight
    const now = new Date();
    const timeUntilMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();

    setTimeout(() => {
      setDisabledButtons((prev) => ({ ...prev, [habit.id]: false }));
      localStorage.removeItem(`habit-${habit.id}-lastChecked`); // Clear after midnight
    }, timeUntilMidnight);
  };

  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Your Habits</h2>

      <div className="space-y-2">
        {habits.length > 0 ? (
          habits.map((habit) => (
            <div key={habit.id} className="flex items-center mb-2">
              <span className="flex-grow font-bold capitalize ">{habit.habit}</span>

              <span className="mx-4 font-semibold">{habit.streak_count} 🔥</span>

              <button
                onClick={() => handleStreakSubmit(habit)}
                className={`p-2 rounded ml-2
                  ${
                    disabledButtons[habit.id]
                    ? "bg-black text-gray-200 cursor-not-allowed" // Disabled button styles
                      : "bg-blue-500 text-white hover:bg-blue-600" // Active button styles
                  }`}
                disabled={disabledButtons[habit.id]} // Disable based on state
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

