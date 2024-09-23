import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  const { user_id, habit } = await request.json();
  const { data, error } = await supabase
    .from("habits")
    .insert([{ user_id, habit, streak_count: 0, last_checked: new Date() }]);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}

export async function PATCH(request: Request) {
  const { user_id, habit_id } = await request.json();
  const { data, error } = await supabase
    .from("habits")
    .update({
      last_checked: new Date(),
      streak_count: supabase.raw("streak_count + 1"),
    })
    .match({ id: habit_id, user_id });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}
