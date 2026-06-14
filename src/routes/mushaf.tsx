import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Search, BookOpen, X, Loader2, Play, Pause, BookText, Bookmark, Type, ChevronRight, ChevronLeft, Mic, Menu, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/lib/use-local-storage";
import { tafasir } from "@/data/tafasir";
import { getAyahAudioUrl, reciters, getReciterById, getSurahAudioUrl } from "@/data/reciters";

type SearchType = { surah?: number; ayah?: number };

export const Route = createFileRoute("/mushaf")({
  validateSearch: (s: Record<string, unknown>): SearchType => ({
    surah: s.surah ? Number(s.surah) : undefined,
    ayah: s.ayah ? Number(s.ayah) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "المصحف الشريف — نور القرآن" },
      { name: "description", content: "اقرأ القرآن الكريم بالنص العثماني، اختر القارئ والتفسير، واحفظ آخر موضع للقراءة." },
    ],
  }),
  component: MushafPage,
});

type Surah = { number: number; name: string; englishName: string; numberOfAyahs: number; revelationType: string };
type Ayah = { number: number; numberInSurah: number; text: string };

async function fetchSurahs(): Promise<Surah[]> {
  const r = await fetch("https://api.quran.com/api/v4/chapters?language=ar");
  const j = await r.json();
  return j.chapters.map((c: any): Surah => ({
    number: c.id,
    name: c.name_arabic,
    englishName: c.name_simple,
    numberOfAyahs: c.verses_count,
    revelationType: c.revelation_place === "makkah" ? "Meccan" : "Medinan",
  }));
}
async function fetchSurah(n: number): Promise<{ ayahs: Ayah[]; name: string }> {
  const [vRes, cRes] = await Promise.all([
    fetch(`https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number=${n}`),
    fetch(`https://api.quran.com/api/v4/chapters/${n}?language=ar`),
  ]);
  const vJ = await vRes.json();
  const cJ = await cRes.json();
  const ayahs: Ayah[] = vJ.verses.map((v: any, i: number) => {
    const [, ayahN] = v.verse_key.split(":");
    return { number: v.id, numberInSurah: Number(ayahN), text: v.text_uthmani };
  });
  return { ayahs, name: cJ.chapter.name_arabic };
}
async function fetchTafsir(s: number, a: number, tafsirId: string): Promise<string> {
  const r = await fetch(`https://api.alquran.cloud/v1/ayah/${s}:${a}/${tafsirId}`);
  const j = await r.json();
  return j.data?.text ?? "التفسير غير متاح حاليًا لهذا التفسير.";
}

function MushafPage() {
  const sp = Route.useSearch();
  const navigate = useNavigate({ from: "/mushaf" });
  const [prefs, setPrefs] = usePreferences();

  const [selected, setSelected] = useState<number | null>(sp.surah ?? prefs.bookmark?.surah ?? null);
  const [query, setQuery] = useState("");
  const [tafsirAyah, setTafsirAyah] = useState<{ surah: number; ayah: number; surahName: string } | null>(null);
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [playingSurah, setPlayingSurah] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const surahsQ = useQuery({ queryKey: ["surahs"], queryFn: fetchSurahs, staleTime: 1000 * 60 * 60 });
  const surahQ = useQuery({
    queryKey: ["surah", selected],
    queryFn: () => fetchSurah(selected!),
    enabled: selected != null,
    staleTime: 1000 * 60 * 30,
  });

  // Close sidebar when screen is large
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Scroll to target ayah from URL or bookmark
  useEffect(() => {
    if (!surahQ.data || !selected) return;
    const targetAyah = sp.ayah;
    if (targetAyah) {
      requestAnimationFrame(() => {
        const el = document.getElementById(`ayah-${targetAyah}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.classList.add("ring-2", "ring-gold", "rounded-md");
          setTimeout(() => el.classList.remove("ring-2", "ring-gold", "rounded-md"), 3000);
        }
      });
    }
  }, [surahQ.data, selected, sp.ayah]);

  const filtered = (surahsQ.data ?? []).filter((s) =>
    s.name.includes(query) || s.englishName.toLowerCase().includes(query.toLowerCase()) || String(s.number).includes(query),
  );

  const surahName = surahQ.data?.name ?? "";

  // Save bookmark when a surah is opened
  useEffect(() => {
    if (!selected || !surahName) return;
    const t = setTimeout(() => {
      setPrefs((p) => ({
        ...p,
        bookmark: { surah: selected, ayah: sp.ayah ?? 1, surahName, updatedAt: Date.now() },
      }));
    }, 1500);
    return () => clearTimeout(t);
  }, [selected, surahName, sp.ayah, setPrefs]);

  function onAyahClick(ayahNum: number) {
    if (!selected) return;
    setPrefs((p) => ({
      ...p,
      bookmark: { surah: selected, ayah: ayahNum, surahName, updatedAt: Date.now() },
    }));
  }

  function goToSurah(n: number) {
    setSelected(n);
    setSidebarOpen(false);
    navigate({ search: { surah: n } });
  }

  const totalSurahs = 114;

  return (
    <>
      <section className="container mx-auto px-3 pt-6 pb-4 text-center sm:px-4 sm:pt-8 sm:pb-5 md:pt-10 md:pb-6">
        <div className="text-sm font-bold uppercase tracking-[0.2em] text-gold mb-2">المصحف الشريف</div>
        <h1 className="font-display text-2xl font-bold sm:text-3xl md:text-4xl lg:text-5xl">اقرأ القرآن الكريم</h1>
        <p className="mx-auto mt-2 max-w-2xl text-xs leading-6 text-muted-foreground sm:text-sm md:text-base">
          اضغط على الآية لفتح التفسير، أو على زر السماعة للاستماع بصوت قارئك المفضّل.
        </p>
      </section>

      <div className="container mx-auto px-3 pb-24 sm:px-4">
        {/* Mobile: Collapsible Sidebar Button */}
        <div className="lg:hidden mb-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-between rounded-xl bg-card p-3 shadow-elegant border border-border/40"
          >
            <div className="flex items-center gap-2">
              <Menu className="h-5 w-5 text-gold" />
              <span className="font-medium">
                {selected ? `سورة ${surahName}` : "اختر سورة"}
              </span>
            </div>
            <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${sidebarOpen ? "rotate-180" : ""}`} />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row lg:gap-4 xl:gap-6 2xl:gap-8">
          {/* Sidebar - Collapsible on mobile, sticky on desktop */}
          <aside
            className={`
              lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)]
              lg:w-[280px] xl:w-[320px] 2xl:w-[360px]
              transition-all duration-300 ease-in-out
              ${sidebarOpen 
                ? "max-h-[500px] opacity-100 visible mb-4" 
                : "max-h-0 opacity-0 invisible lg:max-h-[calc(100vh-8rem)] lg:opacity-100 lg:visible"
              }
              overflow-hidden lg:overflow-visible
            `}
          >
            <div className="ornate-border flex max-h-full flex-col overflow-hidden rounded-2xl bg-card p-3 sm:p-4 h-full">
              <div className="relative mb-3">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  value={query} 
                  onChange={(e) => setQuery(e.target.value)} 
                  placeholder="ابحث عن سورة..." 
                  className="pr-10" 
                />
              </div>
              {prefs.bookmark && (
                <button
                  onClick={() => goToSurah(prefs.bookmark!.surah)}
                  className="mb-3 rounded-xl border border-gold/40 bg-gold/10 p-3 text-right hover:bg-gold/20 transition-colors"
                >
                  <div className="flex items-center gap-2 text-xs text-gold font-bold">
                    <Bookmark className="h-3 w-3" /> آخر قراءة
                  </div>
                  <div className="mt-1 text-sm font-bold break-words">
                    سورة {prefs.bookmark.surahName} — آية {prefs.bookmark.ayah}
                  </div>
                </button>
              )}
              <div className="min-h-0 flex-1 space-y-1 overflow-y-auto pl-1">
                {surahsQ.isLoading && <Loader />}
                {filtered.map((s) => (
                  <button
                    key={s.number}
                    onClick={() => goToSurah(s.number)}
                    className={`w-full flex items-center gap-3 rounded-xl p-3 text-right transition-all ${
                      selected === s.number 
                        ? "gradient-hero text-gold-soft shadow-elegant" 
                        : "hover:bg-accent/10"
                    }`}
                  >
                    <span className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg text-xs font-bold ${
                      selected === s.number ? "bg-gold text-emerald-deep" : "bg-accent/15 text-gold"
                    }`}>
                      {s.number}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-display text-base sm:text-lg font-bold truncate">{s.name}</div>
                      <div className="text-[10px] sm:text-[11px] opacity-70">
                        {s.numberOfAyahs} آية • {s.revelationType === "Meccan" ? "مكية" : "مدنية"}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Reader Area */}
          <div className="flex-1 min-w-0">
            <div className="mushaf-reader ornate-border min-h-[60vh] rounded-2xl bg-card p-3 shadow-elegant sm:p-5 md:p-6 lg:p-8 lg:rounded-3xl">
              {/* Toolbar */}
              {selected && (
                <div className="flex flex-col gap-3 border-b border-border/60 pb-3 mb-3 sm:pb-4 sm:mb-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => goToSurah(Math.max(1, selected - 1))} 
                        disabled={selected <= 1}
                        className="px-2 sm:px-3"
                      >
                        <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" /> 
                        <span className="hidden xs:inline">السابقة</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => goToSurah(Math.min(totalSurahs, selected + 1))} 
                        disabled={selected >= totalSurahs}
                        className="px-2 sm:px-3"
                      >
                        <span className="hidden xs:inline">التالية</span> 
                        <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-1 rounded-md border border-input bg-background px-2 py-1">
                        <Mic className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gold flex-shrink-0" />
                        <select
                          value={prefs.reciterId}
                          onChange={(e) => setPrefs((p) => ({ ...p, reciterId: e.target.value }))}
                          className="min-w-0 flex-1 bg-transparent text-xs outline-none"
                          title="القارئ المختار"
                        >
                          {reciters.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </select>
                      </div>
                      <select
                        value={prefs.tafsirId}
                        onChange={(e) => setPrefs((p) => ({ ...p, tafsirId: e.target.value }))}
                        className="min-w-0 rounded-md border border-input bg-background px-2 py-1.5 text-xs"
                        title="التفسير المختار"
                      >
                        {tafasir.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                      </select>
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          title="تصغير" 
                          onClick={() => setPrefs((p) => ({ ...p, fontSize: Math.max(18, p.fontSize - 2) }))}
                          className="h-8 w-8 sm:h-9 sm:w-9"
                        >
                          <Type className="h-3 w-3" />
                        </Button>
                        <span className="text-xs w-6 text-center">{prefs.fontSize}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          title="تكبير" 
                          onClick={() => setPrefs((p) => ({ ...p, fontSize: Math.min(52, p.fontSize + 2) }))}
                          className="h-8 w-8 sm:h-9 sm:w-9"
                        >
                          <Type className="h-4 w-4 sm:h-5 sm:w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!selected ? (
                <EmptyState onResume={prefs.bookmark ? () => goToSurah(prefs.bookmark!.surah) : null} />
              ) : surahQ.isLoading ? (
                <Loader />
              ) : surahQ.data ? (
                <SurahView
                  name={surahQ.data.name}
                  ayahs={surahQ.data.ayahs}
                  surahNumber={selected}
                  fontSize={prefs.fontSize}
                  reciterId={prefs.reciterId}
                  playingAyah={playingAyah}
                  setPlayingAyah={setPlayingAyah}
                  playingSurah={playingSurah}
                  setPlayingSurah={setPlayingSurah}
                  onAyahClick={onAyahClick}
                  onTafsir={(ayah) => setTafsirAyah({ surah: selected, ayah, surahName: surahQ.data!.name })}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {tafsirAyah && <TafsirModal info={tafsirAyah} tafsirId={prefs.tafsirId} onClose={() => setTafsirAyah(null)} />}
    </>
  );
}

function EmptyState({ onResume }: { onResume: (() => void) | null }) {
  return (
    <div className="text-center py-12 sm:py-16 md:py-20">
      <div className="mx-auto inline-flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl gradient-hero shadow-elegant">
        <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 text-gold" strokeWidth={1.5} />
      </div>
      <h3 className="mt-4 sm:mt-6 font-display text-xl sm:text-2xl font-bold">اختر سورة للبدء</h3>
      <p className="mt-2 text-sm text-muted-foreground px-4">من القائمة على اليمين، اختر السورة التي تريد قراءتها.</p>
      {onResume && (
        <div className="mt-4 sm:mt-6">
          <Button variant="hero" onClick={onResume}>
            <Bookmark className="h-4 w-4" /> متابعة آخر قراءة
          </Button>
        </div>
      )}
    </div>
  );
}

function Loader() {
  return (
    <div className="flex items-center justify-center py-16 sm:py-20">
      <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-gold" />
    </div>
  );
}

function SurahView({
  name, ayahs, surahNumber, fontSize, reciterId, playingAyah, setPlayingAyah, playingSurah, setPlayingSurah, onAyahClick, onTafsir,
}: {
  name: string; ayahs: Ayah[]; surahNumber: number; fontSize: number; reciterId: string;
  playingAyah: number | null; setPlayingAyah: (n: number | null) => void;
  playingSurah: boolean; setPlayingSurah: (b: boolean) => void;
  onAyahClick: (n: number) => void; onTafsir: (n: number) => void;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const surahAudioRef = useRef<HTMLAudioElement | null>(null);

  function togglePlay(ayahN: number) {
    if (!audioRef.current) audioRef.current = new Audio();
    if (playingAyah === ayahN) {
      audioRef.current.pause();
      setPlayingAyah(null);
      return;
    }
    const url = getAyahAudioUrl(reciterId, surahNumber, ayahN);
    if (!url) return;
    audioRef.current.src = url;
    audioRef.current.onended = () => setPlayingAyah(null);
    audioRef.current.play().catch(() => setPlayingAyah(null));
    setPlayingAyah(ayahN);
  }

  function toggleSurahPlay() {
    if (!surahAudioRef.current) surahAudioRef.current = new Audio();
    if (playingSurah) {
      surahAudioRef.current.pause();
      setPlayingSurah(false);
      return;
    }
    surahAudioRef.current.src = getSurahAudioUrl(getReciterById(reciterId), surahNumber);
    surahAudioRef.current.onended = () => setPlayingSurah(false);
    surahAudioRef.current.play().catch(() => setPlayingSurah(false));
    setPlayingSurah(true);
  }

  useEffect(() => () => { audioRef.current?.pause(); surahAudioRef.current?.pause(); }, []);

  // Stop surah audio when surah or reciter changes
  useEffect(() => {
    surahAudioRef.current?.pause();
    setPlayingSurah(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [surahNumber, reciterId]);

  const BISMILLAH = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ";

  return (
    <div>
      <div className="text-center pb-4 mb-4 border-b border-border/60 sm:pb-5 sm:mb-5 md:pb-6 md:mb-6">
        <div className="text-xs sm:text-sm text-gold font-bold">سورة رقم {surahNumber}</div>
        <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gradient-gold mt-2">
          {name}
        </h2>
        <div className="mt-3 sm:mt-4 flex flex-wrap items-center justify-center gap-2">
          <Button variant="hero" size="sm" onClick={toggleSurahPlay} className="text-xs sm:text-sm">
            {playingSurah ? (
              <><Pause className="h-3 w-3 sm:h-4 sm:w-4" /> إيقاف التلاوة</>
            ) : (
              <><Play className="h-3 w-3 sm:h-4 sm:w-4" /> استمع للسورة كاملة</>
            )}
          </Button>
        </div>
      </div>
      {surahNumber !== 1 && surahNumber !== 9 && (
        <div 
          className="text-center mb-4 sm:mb-6 font-quran text-gold-soft break-words" 
          dir="rtl" 
          style={{ fontSize: `clamp(18px, 1.8vw, ${fontSize - 2}px)` }}
        >
          {BISMILLAH}
        </div>
      )}
      <div 
        className="font-quran mushaf-text text-foreground" 
        dir="rtl" 
        style={{ fontSize: `clamp(18px, 2.1vw, ${fontSize}px)` }}
      >
        {ayahs.map((a) => {
          const text = a.text;
          return (
            <span
              key={a.number}
              id={`ayah-${a.numberInSurah}`}
              onClick={() => { onAyahClick(a.numberInSurah); onTafsir(a.numberInSurah); }}
              className={`ayah-span inline-block leading-loose sm:leading-loose ${playingAyah === a.numberInSurah ? "is-playing" : ""}`}
            >
              {text}
              <span className="inline-flex items-center gap-1 mx-1 align-middle">
                <button
                  onClick={(e) => { e.stopPropagation(); onTafsir(a.numberInSurah); }}
                  title={`الآية ${a.numberInSurah} — التفسير`}
                  className="inline-flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full border border-gold/40 text-gold hover:bg-gold/20 transition-colors text-[10px] sm:text-xs font-sans"
                >
                  {toArabicNum(a.numberInSurah)}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); togglePlay(a.numberInSurah); }}
                  title="استماع"
                  className="inline-flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  {playingAyah === a.numberInSurah ? <Pause className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> : <Play className="h-2.5 w-2.5 sm:h-3 sm:w-3" />}
                </button>
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

function TafsirModal({ info, tafsirId, onClose }: { info: { surah: number; ayah: number; surahName: string }; tafsirId: string; onClose: () => void }) {
  const [prefs, setPrefs] = usePreferences();
  const q = useQuery({
    queryKey: ["tafsir", info.surah, info.ayah, tafsirId],
    queryFn: () => fetchTafsir(info.surah, info.ayah, tafsirId),
  });
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-emerald-deep/70 backdrop-blur-sm" onClick={onClose}>
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="relative w-full max-w-[95%] sm:max-w-lg md:max-w-2xl ornate-border rounded-2xl sm:rounded-3xl bg-card p-5 sm:p-8 shadow-elegant max-h-[85vh] overflow-y-auto"
      >
        <Button variant="ghost" size="icon" onClick={onClose} className="absolute top-3 left-3 sm:top-4 sm:left-4 h-8 w-8">
          <X className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
        <div className="text-center pb-3 mb-3 border-b border-border/60 sm:pb-4 sm:mb-4">
          <div className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-gold flex items-center justify-center gap-1">
            <BookText className="h-3 w-3" /> تفسير الآية
          </div>
          <h3 className="mt-2 font-display text-lg sm:text-xl md:text-2xl font-bold">
            {info.surahName} — آية {toArabicNum(info.ayah)}
          </h3>
        </div>
        <div className="mb-4">
          <label className="text-xs text-muted-foreground">اختر التفسير:</label>
          <select
            value={prefs.tafsirId}
            onChange={(e) => setPrefs((p) => ({ ...p, tafsirId: e.target.value }))}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm"
          >
            {tafasir.map((t) => <option key={t.id} value={t.id}>{t.name} — {t.author}</option>)}
          </select>
        </div>
        {q.isLoading ? <Loader /> : (
          <p className="text-base sm:text-lg leading-relaxed sm:leading-loose text-foreground/95 text-justify">
            {q.data}
          </p>
        )}
      </div>
    </div>
  );
}

function toArabicNum(n: number): string {
  const a = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return String(n).split("").map((d) => a[parseInt(d)] ?? d).join("");
}