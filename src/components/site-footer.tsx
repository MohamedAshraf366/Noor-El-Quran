import { Link } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-emerald-deep text-gold">
      <div className="container mx-auto px-4 py-16 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl gradient-gold">
              <BookOpen className="h-6 w-6 text-emerald-deep" strokeWidth={1.5} />
            </div>
            <div>
              <div className="font-display text-xl font-bold text-gold-soft">نور القرآن</div>
              <div className="text-xs text-gold-soft/70">مصحف · تفسير · قرآن مسموع · أدعية</div>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-gold-soft/80 max-w-md">
            منصة قرآنية شاملة: اقرأ المصحف الشريف، تصفّح التفسير بأكثر من تفسير،
            استمع لأصوات كبار القراء، وادعُ من مكتبة أدعية واسعة — كل ذلك في مكان واحد.
          </p>
        </div>

        <div>
          <h3 className="font-display text-lg font-bold text-gold-soft mb-4">روابط سريعة</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/mushaf" className="hover:text-xl transition-all">المصحف الشريف</Link></li>
            <li><Link to="/tafsir" className="hover:text-xl transition-all">التفسير</Link></li>
            <li><Link to="/audio" className="hover:text-xl transition-all">القرآن المسموع</Link></li>
            <li><Link to="/adiya" className="hover:text-xl transition-all">الأدعية</Link></li>
            <li><Link to="/search" className="hover:text-xl transition-all">البحث</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-lg font-bold text-gold-soft mb-4">المصادر</h3>
          <ul className="space-y-3 text-sm">
            <li>المصحف: نص عثماني معتمد</li>
            <li>التفسير: عدة كتب موثوقة</li>
            <li>الأصوات: قراء معتمدون</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gold/15">
        <div className="container mx-auto px-4 py-5 text-center text-xs text-gold-soft/60">
          COPYRIGHT &copy; 2026
                            <a target="_blank" className="ps-1 pe-1 fs-5" href='https://portfolio-upgraded-p4r8256o1-moahmed-ashrafs-projects.vercel.app/'>Mohamed Ashraf</a>
                            . All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}