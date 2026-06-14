import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, BookOpen } from "lucide-react";
import { tafasir } from "@/data/tafasir";
import { usePreferences } from "@/lib/use-local-storage";

export const Route = createFileRoute("/tafsir")({
  head: () => ({
    meta: [
      { title: "تفسير القرآن الكريم — نور القرآن" },
      { name: "description", content: "تفسير القرآن الكريم كاملاً بأكثر من تفسير: الميسر، الجلالين، ابن كثير، الطبري، القرطبي، السعدي." },
    ],
  }),
  component: TafsirPage,
});

type Surah = { number: number; name: string; numberOfAyahs: number };
type Ayah = { number: number; numberInSurah: number; text: string };

async function fetchSurahs(): Promise<Surah[]> {
  const r = await fetch("https://api.alquran.cloud/v1/surah");
  return (await r.json()).data;
}
async function fetchSurahWithTafsir(n: number, tafsirId: string) {
  const [quran, tafsir] = await Promise.all([
    fetch(`https://api.alquran.cloud/v1/surah/${n}/quran-uthmani`).then((r) => r.json()),
    fetch(`https://api.alquran.cloud/v1/surah/${n}/${tafsirId}`).then((r) => r.json()),
  ]);
  const ayahs: Ayah[] = quran.data.ayahs;
  const tafs: Ayah[] = tafsir.data?.ayahs ?? [];
  return {
    name: quran.data.name,
    pairs: ayahs.map((a, i) => ({
      ayah: a,
      tafsir: tafs[i]?.text ?? "—",
    })),
  };
}

function TafsirPage() {
  const [prefs, setPrefs] = usePreferences();
  const [surahN, setSurahN] = useState<number>(1);

  const surahsQ = useQuery({ queryKey: ["surahs"], queryFn: fetchSurahs, staleTime: 1000 * 60 * 60 });
  const dataQ = useQuery({
    queryKey: ["tafsir-full", surahN, prefs.tafsirId],
    queryFn: () => fetchSurahWithTafsir(surahN, prefs.tafsirId),
    staleTime: 1000 * 60 * 30,
  });

  return (
    <>
      <section className="container mx-auto px-4 pt-12 pb-6 text-center">
        <div className="text-sm font-bold uppercase tracking-[0.2em] text-gold mb-2">تفسير القرآن الكريم</div>
        <h1 className="font-display text-4xl md:text-5xl font-bold">تفسير تفاعلي للقرآن الكريم</h1>
        <p className="mt-3 text-muted-foreground">الآية على اليمين وتفسيرها على اليسار — اختر السورة والتفسير المفضّل.</p>
      </section>

      <section className="container mx-auto px-4 pb-6">
        <div className="ornate-border rounded-2xl bg-card p-4 grid gap-3 md:grid-cols-2">
          <label className="block">
            <span className="text-xs font-bold text-muted-foreground">السورة</span>
            <select
              value={surahN}
              onChange={(e) => setSurahN(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-input bg-background p-2.5"
            >
              {surahsQ.data?.map((s) => (
                <option key={s.number} value={s.number}>
                  {s.number}. {s.name} ({s.numberOfAyahs} آية)
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-bold text-muted-foreground">التفسير</span>
            <select
              value={prefs.tafsirId}
              onChange={(e) => setPrefs((p) => ({ ...p, tafsirId: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-input bg-background p-2.5"
            >
              {tafasir.map((t) => (
                <option key={t.id} value={t.id}>{t.name} — {t.author}</option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-20">
        {dataQ.isLoading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>
        ) : dataQ.data ? (
          <div className="ornate-border rounded-3xl bg-card overflow-hidden shadow-elegant">
            <div className="text-center py-6 border-b border-border/60 bg-emerald-deep/5">
              <BookOpen className="mx-auto h-6 w-6 text-gold" />
              <h2 className="mt-2 font-display text-3xl font-bold text-gradient-gold">سورة {dataQ.data.name}</h2>
            </div>
            <ol className="divide-y divide-border/60">
              {dataQ.data.pairs.map(({ ayah, tafsir }, idx) => (
                <li key={ayah.number} className="grid md:grid-cols-2 gap-0">
                  <div className="p-6 md:border-s border-border/60 bg-card">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full gradient-gold text-emerald-deep text-xs font-bold">{idx + 1}</span>
                      <span className="text-xs text-muted-foreground">الآية</span>
                    </div>
                    <p className="font-quran text-2xl md:text-3xl text-foreground" dir="rtl">{ayah.text}</p>
                  </div>
                  <div className="p-6 bg-muted/30">
                    <div className="text-xs text-gold font-bold mb-3">التفسير</div>
                    <p className="text-base leading-loose text-foreground/95">{tafsir}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        ) : null}
      </section>
    </>
  );
}