"use client";

import { useState, useEffect } from "react";

export default function Greeting({ name }: { name: string }) {
  const [greeting, setGreeting] = useState("");
  const [emoji, setEmoji] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);

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
    setTimeout(() => setShowEmoji(true), 400);
  }, []);

  if (!greeting) return null;

  return (
    <span className="text-text-secondary text-base">
      {greeting}, {name}
      <span
        className="ml-1.5 inline-block"
        style={{
          fontSize: "0.9em",
          opacity: showEmoji ? 1 : 0,
          transform: showEmoji ? "translateY(0)" : "translateY(6px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}
      >
        {emoji}
      </span>
    </span>
  );
}
