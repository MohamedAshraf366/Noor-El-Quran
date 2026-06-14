import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, Copy, Check, BookHeart } from "lucide-react";
import { duaCategories } from "@/data/duas";
import { quranicDuaCategories } from "@/data/duas-quranic";

const allCategories = [...duaCategories, ...quranicDuaCategories];
const totalDuas = allCategories.reduce((sum, c) => sum + c.duas.length, 0);

export const Route = createFileRoute("/adiya")({
  head: () => ({
    meta: [
      { title: "مكتبة الأدعية — أكاديمية نور القرآن" },
      { name: "description", content: "مكتبة شاملة من الأدعية والأذكار من القرآن والسنة، مصنفة حسب المناسبات والأحوال." },
    ],
  }),
  component: AdiyaPage,
});

function AdiyaPage() {
  const [active, setActive] = useState(allCategories[0].id);
  const [query, setQuery] = useState("");
  const current = allCategories.find((c) => c.id === active)!;
  const filtered = useMemo(() => {
    if (!query) return current.duas;
    return current.duas.filter((d) => d.text.includes(query));
  }, [current, query]);

  return (
    <>
      <section className="container mx-auto px-4 pt-16 pb-8 text-center">
        <div className="text-sm font-bold uppercase tracking-[0.2em] text-gold mb-3">مكتبة الأدعية</div>
        <h1 className="font-display text-5xl md:text-6xl font-bold">أدعية وأذكار من الكتاب والسنة</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          أكثر من {totalDuas} دعاءً وذكراً موثَّقاً، تشمل أذكار اليوم والليلة، أدعية الأنبياء، وكل آيات الدعاء في القرآن — مصنفة في {allCategories.length} باباً.
        </p>
      </section>

      <section className="container mx-auto px-4 pb-24 grid gap-6 lg:grid-cols-[300px_1fr]">
        <aside className="ornate-border rounded-2xl bg-card p-4 lg:sticky lg:top-24 lg:max-h-[80vh] lg:overflow-y-auto">
          <h2 className="font-display text-lg font-bold mb-3 px-2">الأبواب</h2>
          <div className="space-y-1">
            {allCategories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className={`w-full text-right rounded-xl p-3 transition-all ${active === c.id ? "gradient-hero text-gold-soft shadow-elegant" : "hover:bg-accent/10"}`}
              >
                <div className="font-bold text-sm">{c.title}</div>
                <div className="text-[11px] opacity-70 mt-0.5">{c.duas.length} دعاء</div>
              </button>
            ))}
          </div>
        </aside>

        <div>
          <div className="ornate-border rounded-2xl bg-card p-6 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl gradient-gold">
                <BookHeart className="h-6 w-6 text-emerald-deep" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold">{current.title}</h2>
                <p className="text-sm text-muted-foreground">{current.description}</p>
              </div>
            </div>
            <div className="relative mt-4">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ابحث في الأدعية..." className="pr-10" />
            </div>
          </div>

          <div className="grid gap-4">
            {filtered.map((d, i) => <DuaCard key={i} index={i + 1} text={d.text} source={d.source} />)}
            {filtered.length === 0 && <p className="text-center text-muted-foreground py-10">لا توجد نتائج لبحثك.</p>}
          </div>
        </div>
      </section>
    </>
  );
}

function DuaCard({ index, text, source }: { index: number; text: string; source?: string }) {
  const [copied, setCopied] = useState(false);
  const onCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="ornate-border rounded-2xl bg-card p-6 hover:shadow-elegant transition-all">
      <div className="flex items-start justify-between gap-4 mb-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg gradient-gold text-sm font-bold text-emerald-deep flex-shrink-0">{index}</span>
        <button onClick={onCopy} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-gold transition-colors">
          {copied ? <><Check className="h-4 w-4" /> تم النسخ</> : <><Copy className="h-4 w-4" /> نسخ</>}
        </button>
      </div>
      <p className="font-display text-xl md:text-2xl leading-loose text-foreground">{text}</p>
      {source && <div className="mt-4 pt-4 border-t border-border/60 text-xs text-gold">المصدر: {source}</div>}
    </div>
  );
}