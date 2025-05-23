"use client"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export default function DarkModeButton() {
  const [isDark, setIsDark] = useState(false);

  // Load theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const isDarkMode = savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  const toggleDarkMode = () => {
    const html = document.documentElement;
    const isCurrentlyDark = html.classList.contains("dark");
    if (isCurrentlyDark) {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  return (
    <Button variant="default" onClick={toggleDarkMode}>
      {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </Button>
  );
}
