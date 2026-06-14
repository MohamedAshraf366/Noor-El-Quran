export type TafsirEdition = { id: string; name: string; author: string };

// Editions verified available on api.alquran.cloud
export const tafasir: TafsirEdition[] = [
  { id: "ar.muyassar", name: "التفسير الميسّر", author: "نخبة من العلماء" },
  { id: "ar.jalalayn", name: "تفسير الجلالين", author: "المحلي والسيوطي" },
  { id: "ar.miftah", name: "مفتاح التفسير", author: "نخبة من العلماء" },
  { id: "ar.qurtubi", name: "تفسير القرطبي", author: "أبو عبدالله القرطبي" },
  { id: "ar.tabari", name: "تفسير الطبري", author: "ابن جرير الطبري" },
  { id: "ar.ibnkatheer", name: "تفسير ابن كثير", author: "ابن كثير" },
  { id: "ar.baghawi", name: "تفسير البغوي", author: "الإمام البغوي" },
  { id: "ar.waseet", name: "التفسير الوسيط", author: "محمد سيد طنطاوي" },
];

export const DEFAULT_TAFSIR = tafasir[0];