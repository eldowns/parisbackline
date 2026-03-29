"use client";

import { useState, useEffect } from "react";

export default function Greeting({ name }: { name: string }) {
  const [greeting, setGreeting] = useState("");
  const [emoji, setEmoji] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good morning");
      setEmoji("\u2600\uFE0F");
    } else if (hour < 18) {
      setGreeting("Good afternoon");
      setEmoji("\uD83D\uDC4B");
    } else {
      setGreeting("Good evening");
      setEmoji("\uD83C\uDF19");
    }
  }, []);

  if (!greeting) return null;

  return (
    <span className="text-text-primary text-base">
      {greeting}, {name} <span className="ml-1.5">{emoji}</span>
    </span>
  );
}
