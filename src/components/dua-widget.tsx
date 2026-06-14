import { useMemo, useState } from "react";
import { Heart, RefreshCw, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { duaCategories } from "@/data/duas";

export function DuaWidget() {
  const [open, setOpen] = useState(false);
  const [seed, setSeed] = useState(0);

  const dua = useMemo(() => {
    const all = duaCategories.flatMap((c) => c.duas.map((d) => ({ ...d, cat: c.title })));
    return all[Math.floor(Math.random() * all.length)];
  }, [seed]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="دعاء"
        className="fixed bottom-5 left-5 z-40 flex h-14 w-14 items-center justify-center rounded-full gradient-gold text-emerald-deep shadow-gold hover:scale-105 transition-transform"
      >
        <Heart className="h-6 w-6" strokeWidth={2} />
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center p-4 bg-emerald-deep/60 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="ornate-border w-full max-w-lg rounded-3xl bg-card p-7 shadow-elegant" dir="rtl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold">دعاء مختار</span>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}><X className="h-4 w-4" /></Button>
            </div>
            <p className="font-display text-xl md:text-2xl leading-loose text-foreground">{dua.text}</p>
            {dua.source && <div className="mt-3 text-xs text-gold">— {dua.source}</div>}
            <div className="mt-2 text-xs text-muted-foreground">من باب: {dua.cat}</div>
            <div className="mt-6 flex items-center justify-between gap-3">
              <Button variant="outline" size="sm" onClick={() => setSeed((s) => s + 1)}>
                <RefreshCw className="h-4 w-4" /> دعاء آخر
              </Button>
              <Link to="/adiya" onClick={() => setOpen(false)}>
                <Button variant="hero" size="sm">كل الأدعية</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}