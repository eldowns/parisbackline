"use client";

import { useState, useEffect } from "react";

export default function Greeting({ name }: { name: string }) {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  if (!greeting) return null;

  return (
    <p className="text-center text-text-secondary text-sm mb-6 md:mb-8">
      {greeting}, <span className="text-text-primary font-medium">{name}</span>
    </p>
  );
}
