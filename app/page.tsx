"use client";
/* yo code le component lai Client Component ko rup ma define garcha, 
   client-side rendering enable garna lai. */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
/* yo code le useEffect (side effects handle garna) ra useRouter 
   (programmatic navigation ko lagi) import garcha. */

export default function Home() {
  /* yo Home component le user lai automatically /register page ma redirect garcha. */

  const router = useRouter();
  /* yo line le navigation ko lagi router instance initialize garcha. */

  useEffect(() => {
    /* yo code le component mount hunasath user lai /register route ma pathaunchha. */
    router.push("/register");
  }, [router]);

  return null;
  /* yo code le kehi render gardaina, kina ki user turuntai redirect huncha. */
}
