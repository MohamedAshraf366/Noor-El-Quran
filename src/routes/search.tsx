import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search as SearchIcon, Loader2, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "بحث في القرآن الكريم — نور القرآن" },
      { name: "description", content: "ابحث عن أي كلمة أو آية أو سورة في القرآن الكريم بحثاً فورياً." },
    ],
  }),
  component: SearchPage,
});

type FlatAyah = { s: number; sn: string; a: number; text: string; plain: string };

function stripTashkeel(s: string) {
  return s.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, "").replace(/[إأآا]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه");
}

async function fetchIndex(): Promise<FlatAyah[]> {
  const [vRes, cRes] = await Promise.all([
    fetch("https://api.quran.com/api/v4/quran/verses/uthmani"),
    fetch("https://api.quran.com/api/v4/chapters?language=ar"),
  ]);
  const vJ = await vRes.json();
  const cJ = await cRes.json();
  const names: Record<number, string> = {};
  for (const c of cJ.chapters) names[c.id] = c.name_arabic;
  return vJ.verses.map((v: any) => {
    const [sn, an] = v.verse_key.split(":").map(Number);
    return { s: sn, sn: names[sn], a: an, text: v.text_uthmani, plain: stripTashkeel(v.text_uthmani) };
  });
}

function SearchPage() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const idxQ = useQuery({ queryKey: ["quran-index"], queryFn: fetchIndex, staleTime: Infinity });

  const results = useMemo(() => {
    const data = idxQ.data;
    if (!data || q.trim().length < 2) return [];
    const needle = stripTashkeel(q.trim());
    return data.filter((a) => a.plain.includes(needle)).slice(0, 200);
  }, [idxQ.data, q]);

  return (
    <>
      <section className="container mx-auto px-4 pt-12 pb-6 text-center">
        <div className="text-sm font-bold uppercase tracking-[0.2em] text-gold mb-2">بحث في القرآن</div>
        <h1 className="font-display text-4xl md:text-5xl font-bold">ابحث في القرآن الكريم</h1>
        <p className="mt-3 text-muted-foreground">ابحث عن أي كلمة أو جزء من آية، يتجاهل البحث التشكيل ويطابق الهمزات تلقائياً.</p>
      </section>

      <section className="container mx-auto px-4 pb-10 max-w-3xl">
        <div className="ornate-border rounded-2xl bg-card p-3">
          <div className="relative">
            <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="مثال: الرحمن — لا إله إلا الله — ربنا آتنا..."
              className="pr-12 h-14 text-lg"
            />
          </div>
        </div>
        {idxQ.isLoading && (
          <p className="mt-4 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" /> جاري تحميل فهرس القرآن (مرة واحدة فقط)...
          </p>
        )}
      </section>

      <section className="container mx-auto px-4 pb-24 max-w-3xl">
        {q.trim().length >= 2 && (
          <div className="text-sm text-muted-foreground mb-3">عُثر على {results.length} نتيجة{results.length === 200 && " (الأولى)"}</div>
        )}
        <div className="grid gap-3">
          {results.map((r, i) => (
            <button
              key={i}
              onClick={() => navigate({ to: "/mushaf", search: { surah: r.s, ayah: r.a } as never })}
              className="ornate-border rounded-2xl bg-card p-5 text-right hover:shadow-elegant transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gold flex items-center gap-1"><BookOpen className="h-3 w-3" /> {r.sn} • آية {r.a}</span>
                <span className="text-xs text-muted-foreground">اذهب →</span>
              </div>
              <p className="font-quran text-xl md:text-2xl text-foreground leading-loose" dir="rtl">{highlight(r.text, q)}</p>
            </button>
          ))}
        </div>
      </section>
    </>
  );
}

function highlight(text: string, q: string) {
  if (!q.trim()) return text;
  // Best-effort: highlight literal substring; tashkeel-insensitive highlight is complex.
  const idx = text.indexOf(q);
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-gold/40 text-foreground rounded px-1">{text.slice(idx, idx + q.length)}</mark>
      {text.slice(idx + q.length)}
    </>
  );
}