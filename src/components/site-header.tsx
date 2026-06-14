import { Link } from "@tanstack/react-router";
import { Moon, Sun, BookOpen, Menu, X, Search } from "lucide-react";
import { useState } from "react";
import { useTheme } from "./theme-provider";
import { Button } from "./ui/button";
import { SettingsDrawer } from "./settings-drawer";

const links = [
  { to: "/", label: "الرئيسية" },
  { to: "/mushaf", label: "المصحف" },
  { to: "/tafsir", label: "التفسير" },
  { to: "/audio", label: "القرآن المسموع" },
  { to: "/adiya", label: "الأدعية" },
  { to: "/search", label: "البحث" },
] as const;

export function SiteHeader() {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl gradient-hero shadow-elegant">
            <BookOpen className="h-6 w-6 text-gold" strokeWidth={1.5} />
          </div>
          <div className="hidden sm:block leading-tight">
            <div className="font-display text-lg font-bold text-foreground">نور القرآن</div>
            <div className="text-[11px] text-muted-foreground">مصحف · تفسير · مسموع · أدعية</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-primary rounded-lg hover:bg-accent/10 transition-colors"
              activeProps={{ className: "px-4 py-2 text-sm font-bold text-primary rounded-lg bg-accent/15" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/search" className="hidden md:inline-flex">
            <Button variant="ghost" size="icon" aria-label="بحث"><Search className="h-5 w-5" /></Button>
          </Link>
          
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="تبديل الوضع">
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(!open)} aria-label="القائمة">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <nav className="lg:hidden border-t border-border/60 bg-background">
          <div className="container mx-auto flex flex-col px-4 py-3 gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="px-4 py-3 text-sm font-medium rounded-lg hover:bg-accent/10"
                activeProps={{ className: "px-4 py-3 text-sm font-bold text-primary rounded-lg bg-accent/15" }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}