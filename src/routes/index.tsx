import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Headphones, BookText, Heart, Search, Bookmark, Sparkles } from "lucide-react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-quran.jpg";
import { usePreferences } from "@/lib/use-local-storage";
import { duaCategories } from "@/data/duas";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "نور القرآن — اقرأ القرآن واستمع وتدبّر وادعُ" },
      { name: "description", content: "منصة قرآنية شاملة: المصحف للقراءة، تفسير تفاعلي بأكثر من تفسير، قرآن مسموع لأكثر من 60 قارئاً، مكتبة أدعية، وبحث في القرآن." },
      { property: "og:title", content: "نور القرآن" },
      { property: "og:description", content: "كل ما تحتاجه للقرآن الكريم في مكان واحد." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <Hero />
      <ContinueReading />
      <FeatureGrid />
      <DuaOfDay />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img src={heroImg} alt="" className="h-full w-full object-cover opacity-20" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/85 to-background" />
      </div>
      <div className="container mx-auto px-4 pt-24 pb-24 lg:pt-32 lg:pb-32 text-center">
        <div className="inline-flex items-center gap-2 rounded-full ornate-border px-4 py-1.5 text-sm font-medium text-foreground/80 mb-6">
          <Sparkles className="h-4 w-4 text-gold" />
          منصتك القرآنية الشاملة
        </div>
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.1] text-foreground">
          نور القرآن
          <br />
          <span className="text-gradient-gold">في كفّك</span>
        </h1>
        <p className="mt-8 mx-auto max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed">
          اقرأ المصحف الشريف، تدبَّر التفسير بأكثر من كتاب، استمع لأصوات كبار القراء،
          وادعُ ربك من مكتبة أدعية واسعة — كل ذلك في مكان واحد.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link to="/mushaf"><Button variant="hero" size="xl">افتح المصحف</Button></Link>
          <Link to="/audio"><Button variant="ornate" size="xl">استمع للقرآن</Button></Link>
        </div>
      </div>
    </section>
  );
}

function ContinueReading() {
  const [prefs] = usePreferences();
  const b = prefs.bookmark;
  return (
    <section className="container mx-auto px-4 -mt-12 relative z-10">
      <div className="ornate-border rounded-3xl bg-card shadow-elegant p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-gold text-emerald-deep shrink-0">
          <Bookmark className="h-7 w-7" />
        </div>
        <div className="flex-1">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-1">آخر قراءة</div>
          {b ? (
            <div>
              <div className="font-display text-2xl font-bold">سورة {b.surahName} — الآية {b.ayah}</div>
              <div className="text-xs text-muted-foreground mt-1">
                آخر تحديث: {new Date(b.updatedAt).toLocaleString("ar-EG")}
              </div>
            </div>
          ) : (
            <div className="text-muted-foreground">لا توجد علامة محفوظة بعد. ابدأ القراءة وسيتم حفظ موضعك تلقائياً.</div>
          )}
        </div>
        <Link
          to="/mushaf"
          search={b ? ({ surah: b.surah, ayah: b.ayah } as never) : undefined}
        >
          <Button variant="hero" size="lg">{b ? "متابعة القراءة" : "ابدأ القراءة"}</Button>
        </Link>
      </div>
    </section>
  );
}

function FeatureGrid() {
  const features = [
    { to: "/mushaf", icon: BookOpen, title: "المصحف الشريف", desc: "اقرأ القرآن الكريم بالرسم العثماني، مع تكبير الخط، تفسير الآية، واستماع لها بصوت قارئك المفضّل." },
    { to: "/tafsir", icon: BookText, title: "التفسير التفاعلي", desc: "تفسير القرآن كاملاً بأكثر من 8 تفاسير معتمدة، مع عرض الآية بجوار تفسيرها." },
    { to: "/audio", icon: Headphones, title: "قرآن مسموع", desc: "أكثر من 60 قارئاً بأصوات عذبة، اختر قارئك واستمع لأي سورة بضغطة زر." },
    { to: "/adiya", icon: Heart, title: "مكتبة الأدعية", desc: "مئات الأدعية الصحيحة، أدعية من القرآن، أذكار اليوم والليلة، ودعاء ختم القرآن." },
    { to: "/search", icon: Search, title: "بحث في القرآن", desc: "ابحث عن أي كلمة أو آية في القرآن الكريم بحثاً فورياً يتجاهل التشكيل." },
    { to: "/mushaf", icon: Bookmark, title: "حفظ موضع القراءة", desc: "آخر آية قرأتها تُحفظ تلقائياً، ارجع إليها في أي وقت من زر متابعة القراءة." },
  ] as const;
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="text-sm font-bold uppercase tracking-[0.2em] text-gold mb-3">ما يقدّمه الموقع</div>
        <h2 className="font-display text-4xl md:text-5xl font-bold">كل ما تحتاجه للقرآن في مكان واحد</h2>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <Link
            key={f.title}
            to={f.to}
            className="group ornate-border rounded-2xl p-7 bg-card transition-all hover:shadow-elegant hover:-translate-y-1"
          >
            <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl gradient-hero shadow-elegant">
              <f.icon className="h-7 w-7 text-gold" strokeWidth={1.5} />
            </div>
            <h3 className="font-display text-2xl font-bold text-foreground">{f.title}</h3>
            <p className="mt-3 text-muted-foreground leading-relaxed">{f.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function DuaOfDay() {
  const dua = useMemo(() => {
    const all = duaCategories.flatMap((c) => c.duas);
    const idx = new Date().getDate() % all.length;
    return all[idx];
  }, []);
  return (
    <section className="container mx-auto px-4 pb-24">
      <div className="relative overflow-hidden rounded-3xl gradient-hero p-10 md:p-14 text-center shadow-elegant">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, var(--gold) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="relative">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-3">دعاء اليوم</div>
          <p className="font-display text-2xl md:text-3xl text-gold-soft leading-loose max-w-3xl mx-auto">{dua.text}</p>
          {dua.source && <div className="mt-4 text-sm text-gold">— {dua.source}</div>}
          <div className="mt-8">
            <Link to="/adiya"><Button variant="ornate" size="lg">تصفّح كل الأدعية</Button></Link>
          </div>
        </div>
      </div>
    </section>
  );
}