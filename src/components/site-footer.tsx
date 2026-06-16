import { Link } from "@tanstack/react-router";
import { BookOpen, Github, Linkedin, Facebook, MessageCircle, Briefcase } from "lucide-react";

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
          
          {/* وسائل التواصل الاجتماعي */}
          <div className="pt-4">
            <h4 className="font-display text-sm font-bold text-gold-soft mb-3">تابعني</h4>
            <div className="flex gap-3 flex-wrap">
              <a
                href="https://github.com/MohamedAshraf366"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-soft/10 border border-gold-soft/20 text-gold-soft/80 hover:bg-gold-soft hover:text-emerald-deep transition-all duration-300 hover:scale-110"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/mohamed-ashraf-497a13170"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-soft/10 border border-gold-soft/20 text-gold-soft/80 hover:bg-gold-soft hover:text-emerald-deep transition-all duration-300 hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="https://www.facebook.com/mohamed.ashraf.791060/"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-soft/10 border border-gold-soft/20 text-gold-soft/80 hover:bg-gold-soft hover:text-emerald-deep transition-all duration-300 hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://wa.me/201111166832"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-soft/10 border border-gold-soft/20 text-gold-soft/80 hover:bg-gold-soft hover:text-emerald-deep transition-all duration-300 hover:scale-110"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                href=" https://portfolio-upgraded-q9ag762p8-moahmed-ashrafs-projects.vercel.app/"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-soft/10 border border-gold-soft/20 text-gold-soft/80 hover:bg-gold-soft hover:text-emerald-deep transition-all duration-300 hover:scale-110"
                aria-label="Portfolio"
              >
                <Briefcase className="h-4 w-4" />
              </a>
            </div>
          </div>
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
          COPYRIGHT © 2026
          <a 
            target="_blank" 
            rel="noopener noreferrer"
            className="ps-1 pe-1 hover:text-gold-soft transition-colors mx-1 font-medium" 
            href=' https://portfolio-upgraded-q9ag762p8-moahmed-ashrafs-projects.vercel.app/'
          >
            Mohamed Ashraf
          </a>
          . All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}