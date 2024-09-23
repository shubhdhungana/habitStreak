"use client"; // This marks the component as a Client Component

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  // Automatically redirect to /register
  useEffect(() => {
    router.push("/register");
  }, [router]);

  return null; // Render nothing as the user is redirected
}
