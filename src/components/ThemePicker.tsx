"use client";

import { useEffect, useState } from "react";
import { Palette, X } from "lucide-react";

interface ThemeOption {
  id: string;
  name: string;
  colorClass: string;
  hex: string;
}

const themeOptions: ThemeOption[] = [
  { id: "indigo", name: "Indigo Theme", colorClass: "bg-indigo-600", hex: "#4f46e5" },
  { id: "emerald", name: "Emerald Theme", colorClass: "bg-emerald-600", hex: "#059669" },
  { id: "orange", name: "Orange Theme", colorClass: "bg-orange-600", hex: "#ea580c" },
  { id: "rose", name: "Rose Theme", colorClass: "bg-rose-600", hex: "#e11d48" },
  { id: "dark", name: "Slate Theme", colorClass: "bg-slate-700", hex: "#475569" },
];

export default function ThemePicker() {
  const [activeTheme, setActiveTheme] = useState("indigo");
  const [isOpen, setIsOpen] = useState(false);

  // Load initial theme on mount
  useEffect(() => {
    const saved = localStorage.getItem("peerpilot_theme") || "indigo";
    setActiveTheme(saved);
    applyThemeClass(saved);
  }, []);

  const applyThemeClass = (theme: string) => {
    // Remove existing theme classes from HTML
    const htmlClasses = document.documentElement.className.split(" ");
    const cleaned = htmlClasses.filter((c) => !c.startsWith("theme-"));
    cleaned.push(`theme-${theme}`);
    document.documentElement.className = cleaned.join(" ").trim();
  };

  const handleSelectTheme = (themeId: string) => {
    setActiveTheme(themeId);
    localStorage.setItem("peerpilot_theme", themeId);
    applyThemeClass(themeId);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex items-center gap-3">
      {/* Expanded Palette Drawer */}
      {isOpen && (
        <div className="bg-white/80 backdrop-blur-md border border-slate-100 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 animate-in slide-in-from-right duration-250">
          <div className="flex gap-2">
            {themeOptions.map((opt) => {
              const isActive = activeTheme === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectTheme(opt.id)}
                  className={`h-7 w-7 rounded-full transition-all cursor-pointer flex items-center justify-center relative hover:scale-110 ${opt.colorClass} ${
                    isActive ? "ring-2 ring-offset-2 ring-slate-800 scale-105" : "opacity-80"
                  }`}
                  title={opt.name}
                >
                  {isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-white block" />
                  )}
                </button>
              );
            })}
          </div>
          <div className="h-4 w-px bg-slate-200" />
        </div>
      )}

      {/* Main Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-11 w-11 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-indigo-600 shadow-lg shadow-slate-950/10 transition-all cursor-pointer active:scale-95"
        title="Customize Theme"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Palette className="h-5 w-5" />}
      </button>
    </div>
  );
}
