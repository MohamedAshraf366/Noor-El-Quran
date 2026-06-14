import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Mic, Play, Pause, Loader2, Headphones, X, SkipBack, SkipForward, Menu, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { reciters, getSurahAudioUrl } from "@/data/reciters";
import { usePreferences } from "@/lib/use-local-storage";

export const Route = createFileRoute("/audio")({
  head: () => ({
    meta: [
      { title: "القرآن المسموع — نور القرآن" },
      { name: "description", content: "استمع للقرآن الكريم بأصوات أكثر من 60 قارئاً بصوت عذب وجميل، اختر قارئك المفضل واستمع لأي سورة." },
    ],
  }),
  component: AudioPage,
});

async function fetchSurahs() {
  const r = await fetch("https://api.alquran.cloud/v1/surah");
  return (await r.json()).data as { number: number; name: string; englishName: string; numberOfAyahs: number }[];
}

function AudioPage() {
  const [prefs, setPrefs] = usePreferences();
  const [query, setQuery] = useState("");
  const [surahQuery, setSurahQuery] = useState("");
  const [rewayaFilter, setRewayaFilter] = useState<string>("الكل");
  const [now, setNow] = useState<{ surah: number; name: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const surahsQ = useQuery({ queryKey: ["surahs"], queryFn: fetchSurahs, staleTime: 1000 * 60 * 60 });

  const reciter = reciters.find((r) => r.id === prefs.reciterId) ?? reciters[0];

  // Close sidebar on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const rewayat = useMemo(() => {
    const set = new Set<string>();
    reciters.forEach((r) => r.rewaya && set.add(r.rewaya));
    return ["الكل", ...Array.from(set)];
  }, []);

  const filteredReciters = useMemo(
    () => reciters.filter((r) => {
      const matchQ = r.name.includes(query) || (r.rewaya ?? "").includes(query);
      const matchR = rewayaFilter === "الكل" || r.rewaya === rewayaFilter;
      return matchQ && matchR;
    }),
    [query, rewayaFilter],
  );
  
  const filteredSurahs = useMemo(() => {
    const all = surahsQ.data ?? [];
    if (!surahQuery) return all;
    return all.filter((s) => s.name.includes(surahQuery) || String(s.number).includes(surahQuery));
  }, [surahsQ.data, surahQuery]);

  function initials(name: string) {
    return name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]).join("");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: "radial-gradient(circle at 20% 30%, #C5A059 0, transparent 40%), radial-gradient(circle at 80% 70%, #D4AF37 0, transparent 40%)",
        }} />
        <div className="relative container mx-auto px-4 py-12 text-center sm:py-16 md:py-20 lg:py-24">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-black/30 px-4 py-1.5 text-xs font-bold text-amber-400 mb-4 sm:mb-6">
            <Headphones className="h-3.5 w-3.5" /> القرآن المسموع
          </div>
          <h1 className="font-arabic text-3xl font-bold text-white sm:text-4xl md:text-5xl lg:text-6xl">
            استمع بأصوات نخبة من القرّاء
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-amber-100/80 text-sm sm:text-base md:text-lg px-4">
            أكثر من 60 قارئاً بصوت عذب. اختر قارئك المفضّل واستمع لأي سورة.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 mt-6 pb-32">
        {/* Mobile: Current Reciter & Collapse Button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-between rounded-2xl bg-white dark:bg-gray-900 p-4 shadow-lg border border-gray-200 dark:border-gray-800"
          >
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                {initials(reciter.name)}
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-900 dark:text-white text-sm">القارئ الحالي</div>
                <div className="font-arabic text-gray-800 dark:text-gray-200 text-base font-semibold">
                  {reciter.name.length > 20 ? reciter.name.slice(0, 20) + "…" : reciter.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{reciter.rewaya}</div>
              </div>
            </div>
            <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${sidebarOpen ? "rotate-180" : ""}`} />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row lg:gap-6 xl:gap-8">
          {/* Reciters Sidebar */}
          <aside
            className={`
              lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:w-80 xl:w-96
              transition-all duration-300 ease-in-out
              ${sidebarOpen 
                ? "max-h-[600px] opacity-100 visible mb-4" 
                : "max-h-0 opacity-0 invisible lg:max-h-[calc(100vh-8rem)] lg:opacity-100 lg:visible"
              }
              overflow-hidden lg:overflow-visible
            `}
          >
            <div className="rounded-2xl bg-white dark:bg-gray-900 shadow-xl border border-gray-200 dark:border-gray-800 h-full flex flex-col">
              {/* Header */}
              <div className="hidden lg:flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                <h2 className="font-arabic text-xl font-bold text-gray-900 dark:text-white">القرّاء</h2>
                <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                  {filteredReciters.length} قارئ
                </span>
              </div>

              {/* Search */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    value={query} 
                    onChange={(e) => setQuery(e.target.value)} 
                    placeholder="ابحث عن قارئ..." 
                    className="pr-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-right"
                  />
                </div>
              </div>

              {/* Rewayat Filters */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-800 overflow-x-auto">
                <div className="flex flex-wrap gap-2">
                  {rewayat.map((r) => (
                    <button
                      key={r}
                      onClick={() => setRewayaFilter(r)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                        rewayaFilter === r 
                          ? "bg-amber-500 text-white shadow-md" 
                          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reciters List */}
              <div className="flex-1 overflow-y-auto p-2 space-y-1 max-h-[400px] lg:max-h-none">
                {filteredReciters.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      setPrefs((p) => ({ ...p, reciterId: r.id }));
                      setSidebarOpen(false);
                    }}
                    className={`w-full text-right rounded-xl p-3 transition-all flex items-center gap-3 ${
                      prefs.reciterId === r.id 
                        ? "bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950/50 dark:to-amber-900/30 border-r-4 border-amber-500" 
                        : "hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-bold text-sm ${
                      prefs.reciterId === r.id 
                        ? "bg-amber-500 text-white" 
                        : "bg-gray-100 dark:bg-gray-800 text-amber-600 dark:text-amber-400"
                    }`}>
                      {initials(r.name)}
                    </span>
                    <div className="flex-1 min-w-0 text-right">
                      <div className="font-bold text-sm text-gray-900 dark:text-white truncate">{r.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{r.rewaya}</div>
                    </div>
                    {prefs.reciterId === r.id && (
                      <Mic className="h-4 w-4 text-amber-500 shrink-0" />
                    )}
                  </button>
                ))}
                {filteredReciters.length === 0 && (
                  <div className="text-center py-10 text-sm text-gray-500 dark:text-gray-400">
                    لا يوجد قارئ مطابق
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Surah List */}
          <div className="flex-1 min-w-0">
            {/* Desktop Current Reciter Card */}
            <div className="hidden lg:block mb-6">
              <div className="rounded-2xl bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950/50 dark:to-amber-900/30 p-6 shadow-lg border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-5">
                  <div className="relative shrink-0">
                    <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg">
                      <span className="font-arabic text-3xl font-bold text-white">
                        {initials(reciter.name)}
                      </span>
                    </div>
                    <span className="absolute -bottom-2 -right-2 h-7 w-7 rounded-full bg-emerald-600 flex items-center justify-center border-2 border-white dark:border-gray-900">
                      <Mic className="h-3.5 w-3.5 text-amber-400" />
                    </span>
                  </div>
                  <div className="flex-1 text-right">
                    <div className="text-xs text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider">القارئ الحالي</div>
                    <h2 className="font-arabic text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {reciter.name}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{reciter.rewaya}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Search Surah */}
            <div className="sticky top-0 lg:top-20 z-10 bg-background pt-2 pb-3 -mt-2">
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    value={surahQuery} 
                    onChange={(e) => setSurahQuery(e.target.value)} 
                    placeholder="ابحث عن سورة..." 
                    className="pr-10 h-11 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm text-right"
                  />
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full whitespace-nowrap">
                  {filteredSurahs.length} سورة
                </span>
              </div>
            </div>

            {surahsQ.isLoading && (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
              </div>
            )}

            {/* Surah Grid */}
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 mt-4">
              {filteredSurahs.map((s) => (
                <SurahPlayer
                  key={s.number}
                  number={s.number}
                  name={s.name}
                  ayahs={s.numberOfAyahs}
                  url={getSurahAudioUrl(reciter, s.number)}
                  isPlaying={now?.surah === s.number}
                  onPlay={() => setNow({ surah: s.number, name: s.name })}
                />
              ))}
            </div>

            {filteredSurahs.length === 0 && !surahsQ.isLoading && (
              <div className="text-center py-20">
                <p className="text-gray-500 dark:text-gray-400">لا توجد سور مطابقة للبحث</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mini Player */}
      {now && (
        <MiniPlayer
          surah={now.surah}
          name={now.name}
          reciterName={reciter.name}
          url={getSurahAudioUrl(reciter, now.surah)}
          onClose={() => setNow(null)}
          onPrev={() => {
            if (now.surah > 1) {
              const prevSurah = (surahsQ.data ?? []).find((s) => s.number === now.surah - 1);
              setNow({ surah: now.surah - 1, name: prevSurah?.name ?? "" });
            }
          }}
          onNext={() => {
            if (now.surah < 114) {
              const nextSurah = (surahsQ.data ?? []).find((s) => s.number === now.surah + 1);
              setNow({ surah: now.surah + 1, name: nextSurah?.name ?? "" });
            }
          }}
        />
      )}
    </div>
  );
}

function SurahPlayer({ number, name, ayahs, isPlaying, onPlay }: { 
  number: number; 
  name: string; 
  ayahs: number; 
  url: string; 
  isPlaying: boolean; 
  onPlay: () => void;
}) {
  return (
    <button
      onClick={onPlay}
      className={`group w-full text-right rounded-xl bg-white dark:bg-gray-900 p-4 transition-all hover:shadow-lg border ${
        isPlaying 
          ? "border-amber-500 shadow-lg shadow-amber-500/20" 
          : "border-gray-200 dark:border-gray-800 hover:border-amber-300 dark:hover:border-amber-700"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-bold text-sm ${
          isPlaying 
            ? "bg-amber-500 text-white shadow-md" 
            : "bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400"
        }`}>
          {number}
        </span>
        <div className="flex-1 min-w-0 text-right">
          <div className="font-arabic text-base font-bold text-gray-900 dark:text-white truncate">
            {name}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{ayahs} آية</div>
        </div>
        <span className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${
          isPlaying 
            ? "bg-amber-500 text-white" 
            : "bg-gray-100 dark:bg-gray-800 text-amber-600 dark:text-amber-400 group-hover:bg-amber-500 group-hover:text-white"
        }`}>
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </span>
      </div>
    </button>
  );
}

function MiniPlayer({ surah, name, reciterName, url, onClose, onPrev, onNext }: {
  surah: number; 
  name: string; 
  reciterName: string; 
  url: string;
  onClose: () => void; 
  onPrev: () => void; 
  onNext: () => void;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    audioRef.current.src = url;
    audioRef.current.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [url]);

  function toggle() {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
    }
  }

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 px-3 pb-3 pointer-events-none">
      <div className="mx-auto max-w-lg md:max-w-2xl lg:max-w-3xl pointer-events-auto">
        <div className="rounded-2xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-800 p-4">
          {/* Main Controls */}
          <div className="flex items-center gap-3">
            {/* Surah Number */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white font-arabic text-lg font-bold shadow-md">
              {surah}
            </div>
            
            {/* Info */}
            <div className="flex-1 min-w-0 text-right">
              <div className="font-arabic font-bold text-gray-900 dark:text-white truncate">
                سورة {name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {reciterName}
              </div>
            </div>
            
            {/* Playback Controls */}
            <div className="flex items-center gap-1">
              <button 
                onClick={onPrev} 
                disabled={surah <= 1} 
                className="h-9 w-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 flex items-center justify-center transition-colors" 
                title="السورة السابقة"
              >
                <SkipForward className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </button>
              <button 
                onClick={toggle} 
                className="h-11 w-11 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all" 
                title={playing ? "إيقاف" : "تشغيل"}
              >
                {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </button>
              <button 
                onClick={onNext} 
                disabled={surah >= 114} 
                className="h-9 w-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 flex items-center justify-center transition-colors" 
                title="السورة التالية"
              >
                <SkipBack className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </button>
              <button 
                onClick={() => { audioRef.current?.pause(); onClose(); }} 
                className="h-9 w-9 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 flex items-center justify-center transition-colors ml-1" 
                title="إغلاق"
              >
                <X className="h-4 w-4 text-gray-500 hover:text-red-500" />
              </button>
            </div>
          </div>
          
          {/* Audio Element */}
          <audio 
            ref={audioRef} 
            className="w-full mt-3" 
            onEnded={onNext} 
            onPlay={() => setPlaying(true)} 
            onPause={() => setPlaying(false)} 
            controls
          />
        </div>
      </div>
    </div>
  );
}