/* 
  This component displays a list of habits, allowing the user to submit streaks for each habit
  and delete habits. The component manages the disabled state for buttons based on the user's 
  interaction (whether the habit has already been submitted for the day or not).
*/

import { useState, useEffect } from "react";
import { Fireworks } from "fireworks-js"; // Import Fireworks for possible visual effects on the habit streak.

interface Habit {
  id: string;
  habit: string;
  last_checked: Date | null;
  streak_count: number;
}

interface TodoListProps {
  habits: Habit[]; // Array of habits that will be displayed in the list.
  onStreakSubmit: (habit: Habit) => void; // Callback to handle streak submission.
  onDeleteHabit: (habitId: string) => void; // Callback to handle habit deletion.
}

export default function TodoList({
  habits,
  onStreakSubmit,
  onDeleteHabit,
}: TodoListProps) {
  /* 
    Disabled buttons are tracked using this state, where each habit's id is the key
    and the value is a boolean indicating whether the button for that habit should be disabled.
  */
  const [disabledButtons, setDisabledButtons] = useState<{ [key: string]: boolean }>({});

  /* 
    useEffect is used to check if the habit has already been submitted for today.
    If it has been submitted today, the button is disabled until tomorrow.
    This effect runs every time the habits array changes (e.g., when a new habit is added).
  */
  useEffect(() => {
    habits.forEach((habit) => {
      const lastChecked = localStorage.getItem(`habit-${habit.id}-lastChecked`);
      if (lastChecked && isSameDay(new Date(lastChecked), new Date())) {
        // Disable the button if the habit was already submitted today.
        setDisabledButtons((prev) => ({ ...prev, [habit.id]: true }));
      } else {
        // Otherwise, enable the button.
        setDisabledButtons((prev) => ({ ...prev, [habit.id]: false }));
      }
    });
  }, [habits]);

  /* 
    handleStreakSubmit handles the submission of a habit's streak.
    It disables the button for the current habit and saves the submission date in localStorage.
    A timeout is set to re-enable the button after midnight.
  */
  const handleStreakSubmit = (habit: Habit) => {
    // Call the parent handler to submit the streak
    onStreakSubmit(habit);

    // Disable the button for the current habit
    setDisabledButtons((prev) => ({ ...prev, [habit.id]: true }));

    // Save the current date in localStorage to track when the habit was last checked
    localStorage.setItem(`habit-${habit.id}-lastChecked`, new Date().toString());

    /* 
      Calculate time remaining until midnight to re-enable the button.
      The timeout ensures that the button will be enabled after midnight.
    */
    const now = new Date();
    const timeUntilMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();

    setTimeout(() => {
      setDisabledButtons((prev) => ({ ...prev, [habit.id]: false })); // Re-enable the button
      localStorage.removeItem(`habit-${habit.id}-lastChecked`); // Clear the last checked date after midnight
    }, timeUntilMidnight);
  };

  /* 
    isSameDay compares two dates and returns true if they are the same day.
    This is used to determine if the habit was already checked today.
  */
  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  return (
    <div className="space-y-4">
      {/* Heading for the habit list */}
      <h2 className="text-xl font-semibold">Your Habits</h2>

      {/* Habit list rendering */}
      <div className="space-y-2">
        {habits.length > 0 ? (
          habits.map((habit) => (
            /* Display each habit with its streak count and buttons to submit or delete the habit */
            <div key={habit.id} className="flex items-center mb-2">
              <span className="flex-grow font-bold capitalize ">{habit.habit}</span>

              {/* Streak count display with the fire emoji */}
              <span className="mx-4 font-semibold">{habit.streak_count} 🔥</span>

              {/* Submit button for streak */}
              <button
                onClick={() => handleStreakSubmit(habit)} // Calls handleStreakSubmit on click
                className={`p-2 rounded ml-2
                  ${
                    disabledButtons[habit.id] // Button styles change based on whether it's disabled
                    ? "bg-black text-gray-200 cursor-not-allowed" // Disabled button styles
                      : "bg-blue-500 text-white hover:bg-blue-600" // Active button styles
                  }`}
                disabled={disabledButtons[habit.id]} // Disable button when it's clicked already today
              >
                Submit
              </button>

              {/* Delete button for habit */}
              <button
                onClick={() => onDeleteHabit(habit.id)} // Calls onDeleteHabit when clicked
                className="bg-red-500 text-white p-2 rounded ml-2"
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>No habits found.</p> // Message when there are no habits to display
        )}
      </div>
    </div>
  );
}
