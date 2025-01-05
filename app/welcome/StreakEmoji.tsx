/* 
  This is a functional React component named StreakEmoji. 
  It takes a single prop, streakCount, which is a number representing 
  how many fire emojis should be displayed.
*/

interface StreakEmojiProps {
  streakCount: number; // streakCount is a number that determines how many emojis to show.
}

export default function StreakEmoji({ streakCount }: StreakEmojiProps) {
  /* 
    The function body returns a span element containing the "🔥" emoji.
    The number of fire emojis displayed is determined by the streakCount prop.
    The ".repeat()" method repeats the emoji based on the streakCount value.
  */
  return <span className="text-red-600 ml-2">{"🔥".repeat(streakCount)}</span>;
}

