interface StreakEmojiProps {
  streakCount: number;
}

export default function StreakEmoji({ streakCount }: StreakEmojiProps) {
  return <span className="text-red-600 ml-2">{"🔥".repeat(streakCount)}</span>;
}
