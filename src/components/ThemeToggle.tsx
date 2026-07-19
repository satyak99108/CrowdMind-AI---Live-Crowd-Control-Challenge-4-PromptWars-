import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="h-8 w-full justify-start gap-2 px-2 text-[12px]">
        <Moon className="h-4 w-4" />
        <span>Dark Mode</span>
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="text-sidebar-foreground hover:bg-sidebar-accent h-8 w-full justify-start gap-2 px-2 text-[12px] font-medium transition-colors"
    >
      {isDark ? (
        <>
          <Sun className="h-4 w-4 text-amber-400 shrink-0" />
          <span>Switch to Light</span>
        </>
      ) : (
        <>
          <Moon className="h-4 w-4 text-indigo-500 shrink-0" />
          <span>Switch to Dark</span>
        </>
      )}
    </Button>
  );
}
