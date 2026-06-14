import { useState } from "react";
import { Settings, X, Type, Volume2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/lib/use-local-storage";
import { reciters } from "@/data/reciters";
import { tafasir } from "@/data/tafasir";

export function SettingsDrawer() {
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = usePreferences();

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        aria-label="الإعدادات"
        className="relative"
      >
        <Settings className="h-5 w-5" />
      </Button>
      {open && (
        <div className="fixed inset-0 z-[70] flex" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-emerald-deep/60 backdrop-blur-sm" />
          <aside
            onClick={(e) => e.stopPropagation()}
            className="relative me-auto h-full w-full max-w-md overflow-y-auto bg-card shadow-elegant border-s border-border/60 p-6"
            dir="rtl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-bold">إعدادات القراءة</h2>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <Section icon={Volume2} title="القارئ المختار">
              <select
                value={prefs.reciterId}
                onChange={(e) => setPrefs((p) => ({ ...p, reciterId: e.target.value }))}
                className="w-full rounded-lg border border-input bg-background p-3 text-sm"
              >
                {reciters.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} — {r.rewaya}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-muted-foreground">
                يُستخدم عند الضغط على زر «استمع» بجوار الآيات وفي صفحة القرآن المسموع.
              </p>
            </Section>

            <Section icon={BookOpen} title="التفسير المفضّل">
              <select
                value={prefs.tafsirId}
                onChange={(e) => setPrefs((p) => ({ ...p, tafsirId: e.target.value }))}
                className="w-full rounded-lg border border-input bg-background p-3 text-sm"
              >
                {tafasir.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} — {t.author}
                  </option>
                ))}
              </select>
            </Section>

            <Section icon={Type} title="حجم خط المصحف">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPrefs((p) => ({ ...p, fontSize: Math.max(18, p.fontSize - 2) }))}
                >
                  −
                </Button>
                <div className="flex-1 text-center font-bold">{prefs.fontSize}px</div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPrefs((p) => ({ ...p, fontSize: Math.min(52, p.fontSize + 2) }))}
                >
                  +
                </Button>
              </div>
            </Section>
          </aside>
        </div>
      )}
    </>
  );
}

function Section({ icon: Icon, title, children }: { icon: typeof Settings; title: string; children: React.ReactNode }) {
  return (
    <div className="mb-7">
      <h3 className="flex items-center gap-2 mb-3 font-bold text-foreground">
        <Icon className="h-4 w-4 text-gold" /> {title}
      </h3>
      {children}
    </div>
  );
}