import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  const { user_id, habit } = await request.json();
  const { data, error } = await supabase
    .from("habits")
    .insert([{ user_id, habit, streak_count: 0, last_checked: new Date() }]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ data });
}

export async function PATCH(request: Request) {
  const { user_id, habit_id } = await request.json();

  // Fetch the current habit to get the current streak count
  const { data: currentHabit, error: fetchError } = await supabase
    .from("habits")
    .select("streak_count")
    .eq("id", habit_id)
    .eq("user_id", user_id)
    .single();

  if (fetchError || !currentHabit) {
    return NextResponse.json({ error: fetchError?.message || "Habit not found" }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("habits")
    .update({
      last_checked: new Date(),
      streak_count: currentHabit.streak_count + 1, // Increment the streak_count directly
    })
    .match({ id: habit_id, user_id });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ data });
}
