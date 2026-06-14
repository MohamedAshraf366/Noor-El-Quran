export type Reciter = { id: string; name: string; server: string; rewaya?: string };

// Curated list of 60+ popular reciters with direct mp3 servers from mp3quran.net
// URL pattern: {server}{surahNumber:000}.mp3
export const reciters: Reciter[] = [
  { id: "alafasy", name: "مشاري بن راشد العفاسي", server: "https://server8.mp3quran.net/afs/", rewaya: "حفص - مرتل" },
  { id: "sudais", name: "عبدالرحمن السديس", server: "https://server11.mp3quran.net/sds/", rewaya: "حفص - مرتل" },
  { id: "shuraim", name: "سعود الشريم", server: "https://server7.mp3quran.net/shur/", rewaya: "حفص - مرتل" },
  { id: "minshawi", name: "محمد صديق المنشاوي", server: "https://server10.mp3quran.net/minsh/", rewaya: "حفص - مرتل" },
  { id: "husary", name: "محمود خليل الحصري", server: "https://server13.mp3quran.net/husr/", rewaya: "حفص - مرتل" },
  { id: "abdulbasit", name: "عبد الباسط عبد الصمد", server: "https://server7.mp3quran.net/basit/", rewaya: "حفص - مرتل" },
  { id: "ghamdi", name: "سعد الغامدي", server: "https://server7.mp3quran.net/s_gmd/", rewaya: "حفص - مرتل" },
  { id: "ajamy", name: "أحمد بن علي العجمي", server: "https://server10.mp3quran.net/ajm/", rewaya: "حفص - مرتل" },
  { id: "mohaisany", name: "خالد المهنا (المحيسني)", server: "https://server6.mp3quran.net/maxhx/", rewaya: "حفص - مرتل" },
  { id: "qatami", name: "ناصر القطامي", server: "https://server6.mp3quran.net/qtm/", rewaya: "حفص - مرتل" },
  { id: "muaiqly", name: "ماهر المعيقلي", server: "https://server12.mp3quran.net/maher/", rewaya: "حفص - مرتل" },
  { id: "yaser", name: "ياسر الدوسري", server: "https://server11.mp3quran.net/yasser/", rewaya: "حفص - مرتل" },
  { id: "balilah", name: "بندر بليلة", server: "https://server6.mp3quran.net/balilah/", rewaya: "حفص - مرتل" },
  { id: "hudhaify", name: "علي بن عبد الرحمن الحذيفي", server: "https://server7.mp3quran.net/hthfi/", rewaya: "حفص - مرتل" },
  { id: "tablawi", name: "محمد محمود الطبلاوي", server: "https://server16.mp3quran.net/tblawi/", rewaya: "حفص - مرتل" },
  { id: "banna", name: "محمود علي البنا", server: "https://server16.mp3quran.net/bna/", rewaya: "حفص - مرتل" },
  { id: "ayyub", name: "محمد أيوب", server: "https://server16.mp3quran.net/ayyub/", rewaya: "حفص - مرتل" },
  { id: "akram", name: "أكرم العلاقمي", server: "https://server13.mp3quran.net/akrm/", rewaya: "حفص - مرتل" },
  { id: "rifai", name: "هاني الرفاعي", server: "https://server8.mp3quran.net/rifai/", rewaya: "حفص - مرتل" },
  { id: "juhany", name: "عبدالله عواد الجهني", server: "https://server10.mp3quran.net/jhn/", rewaya: "حفص - مرتل" },
  { id: "salah", name: "صلاح البدير", server: "https://server7.mp3quran.net/s_bud/", rewaya: "حفص - مرتل" },
  { id: "thubaity", name: "صالح الثبيتي", server: "https://server16.mp3quran.net/thubaity/", rewaya: "حفص - مرتل" },
  { id: "luhaidan", name: "عبدالله البعيجان", server: "https://server16.mp3quran.net/lhdan/", rewaya: "حفص - مرتل" },
  { id: "bukhatir", name: "أحمد بوخاطر", server: "https://server13.mp3quran.net/bkhtr/", rewaya: "حفص - مرتل" },
  { id: "mishary_mujwd", name: "مشاري العفاسي - مجود", server: "https://server8.mp3quran.net/frs_a/Almusshaf-Al-Mojawwad/", rewaya: "حفص - مجود" },
  { id: "abdulbasit_mjwd", name: "عبد الباسط - مجود", server: "https://server7.mp3quran.net/basit/Almusshaf-Al-Mojawwad/", rewaya: "حفص - مجود" },
  { id: "menshawi_mjwd", name: "المنشاوي - مجود", server: "https://server10.mp3quran.net/minsh/Almusshaf-Al-Mojawwad/", rewaya: "حفص - مجود" },
  { id: "husary_mjwd", name: "الحصري - مجود", server: "https://server13.mp3quran.net/husr/Almusshaf-Al-Mojawwad/", rewaya: "حفص - مجود" },
  { id: "hindawi", name: "فارس عباد", server: "https://server8.mp3quran.net/frs_a/", rewaya: "حفص - مرتل" },
  { id: "kurdi", name: "رعد الكردي", server: "https://server6.mp3quran.net/kurdi/", rewaya: "حفص - مرتل" },
  { id: "abdullah_matroud", name: "عبدالله المطرود", server: "https://server8.mp3quran.net/mtrod/", rewaya: "حفص - مرتل" },
  { id: "yasser_dosary", name: "ياسر الدوسري", server: "https://server11.mp3quran.net/yasser/Rewayat-Hafs-A-n-Assem/", rewaya: "حفص" },
  { id: "shatri", name: "أبو بكر الشاطري", server: "https://server11.mp3quran.net/shatri/", rewaya: "حفص - مرتل" },
  { id: "ajmi_doaa", name: "العجمي - دعاء ختم القرآن", server: "https://server10.mp3quran.net/ajm/Almusshaf-Al-Mojawwad/", rewaya: "حفص - مجود" },
  { id: "hawashi", name: "إدريس أبكر", server: "https://server11.mp3quran.net/abkr/", rewaya: "حفص - مرتل" },
  { id: "abdulwahab", name: "عبد الوهاب الطنطاوي", server: "https://server7.mp3quran.net/tntawi/", rewaya: "حفص - مرتل" },
  { id: "ghazawi", name: "علي جابر", server: "https://server16.mp3quran.net/jaber/", rewaya: "حفص - مرتل" },
  { id: "alqasim", name: "عبد المحسن القاسم", server: "https://server6.mp3quran.net/qasm/", rewaya: "حفص - مرتل" },
  { id: "abdulazeez", name: "عبدالعزيز الزهراني", server: "https://server13.mp3quran.net/zhrani/", rewaya: "حفص - مرتل" },
  { id: "ahmed_naina", name: "أحمد نعينع", server: "https://server16.mp3quran.net/naina/", rewaya: "حفص - مرتل" },
  { id: "ali_hajjaj", name: "علي حجاج السويسي", server: "https://server16.mp3quran.net/hajjaj/", rewaya: "حفص - مرتل" },
  { id: "khaled_qahtani", name: "خالد القحطاني", server: "https://server8.mp3quran.net/qht/", rewaya: "حفص - مرتل" },
  { id: "mohammed_lohaidan", name: "محمد اللحيدان", server: "https://server16.mp3quran.net/m_lhdan/", rewaya: "حفص - مرتل" },
  { id: "saber_abdulhakam", name: "صابر عبد الحكم", server: "https://server16.mp3quran.net/saber/", rewaya: "حفص - مرتل" },
  { id: "twejri", name: "محمد التويجري", server: "https://server16.mp3quran.net/twjri/", rewaya: "حفص - مرتل" },
  { id: "fahd_kandari", name: "فهد الكندري", server: "https://server8.mp3quran.net/kndri/", rewaya: "حفص - مرتل" },
  { id: "kareem_mansouri", name: "كريم منصوري", server: "https://server13.mp3quran.net/mansouri/", rewaya: "ورش عن نافع" },
  { id: "rashed_alafasy_warsh", name: "أبو زيد العمري - ورش", server: "https://server13.mp3quran.net/zaid/", rewaya: "ورش عن نافع" },
  { id: "yahya_hawwa", name: "يحيى حوى", server: "https://server13.mp3quran.net/hawwa/", rewaya: "حفص - مرتل" },
  { id: "saleh_habdan", name: "صالح الحبدان", server: "https://server13.mp3quran.net/habdan/", rewaya: "حفص - مرتل" },
  { id: "saad_nuaimy", name: "سعد النعيمي", server: "https://server13.mp3quran.net/naimy/", rewaya: "حفص - مرتل" },
  { id: "khalifah_tunaiji", name: "خليفة الطنيجي", server: "https://server8.mp3quran.net/tnjy/", rewaya: "حفص - مرتل" },
  { id: "abdulrahman_almasad", name: "عبد الرحمن مسعد", server: "https://server13.mp3quran.net/masad/", rewaya: "حفص - مرتل" },
  { id: "ibrahim_akhdar", name: "إبراهيم الأخضر", server: "https://server6.mp3quran.net/akdr/", rewaya: "حفص - مرتل" },
  { id: "abdulbari_thubaity", name: "عبدالباري الثبيتي", server: "https://server6.mp3quran.net/thubti/", rewaya: "حفص - مرتل" },
  { id: "abdurrashid_sufi", name: "عبد الرشيد صوفي", server: "https://server13.mp3quran.net/sufi/", rewaya: "السوسي عن أبي عمرو" },
  { id: "yousef_baqar", name: "يوسف بن نوح أحمد", server: "https://server13.mp3quran.net/ynh/", rewaya: "حفص - مرتل" },
  { id: "ali_basfar", name: "علي عبدالله جابر", server: "https://server10.mp3quran.net/a_jbr/", rewaya: "حفص - مرتل" },
  { id: "abdullah_basfar", name: "عبدالله بصفر", server: "https://server10.mp3quran.net/bsfr/", rewaya: "حفص - مرتل" },
  { id: "mahmoud_shahat", name: "محمود الشحات أنور", server: "https://server16.mp3quran.net/shhat/", rewaya: "حفص - مجود" },
  { id: "muhammad_jibril", name: "محمد جبريل", server: "https://server8.mp3quran.net/jibreel/", rewaya: "حفص - مرتل" },
  { id: "abdulrahman_ossi", name: "عبد الرحمن العوسي", server: "https://server10.mp3quran.net/aosi/", rewaya: "حفص - مرتل" },
  { id: "saadalghamdi_mujwd", name: "الغامدي - مجود", server: "https://server7.mp3quran.net/s_gmd/Almusshaf-Al-Mojawwad/", rewaya: "حفص - مجود" },
];

export const DEFAULT_RECITER = reciters[0];

export function getReciterById(id: string): Reciter {
  return reciters.find((r) => r.id === id) ?? DEFAULT_RECITER;
}

export function getSurahAudioUrl(reciter: Reciter, surahNumber: number): string {
  const padded = String(surahNumber).padStart(3, "0");
  return `${reciter.server}${padded}.mp3`;
}

// Per-ayah audio via everyayah.com (free, public). Identifier mapping for popular reciters:
const everyayahMap: Record<string, string> = {
  alafasy: "Alafasy_128kbps",
  sudais: "Abdurrahmaan_As-Sudais_192kbps",
  shuraim: "Saood_ash-Shuraym_128kbps",
  minshawi: "Minshawy_Murattal_128kbps",
  husary: "Husary_128kbps",
  abdulbasit: "Abdul_Basit_Murattal_192kbps",
  ghamdi: "Ghamadi_40kbps",
  ajamy: "ahmed_ibn_3ali_al-3ajamy_128kbps",
  muaiqly: "Maher_AlMuaiqly_64kbps",
  shatri: "Abu_Bakr_Ash-Shaatree_128kbps",
  hudhaify: "Hudhaify_64kbps",
  juhany: "Abdullaah_3awwaad_Al-Juhaynee_128kbps",
  rifai: "Hani_Rifai_192kbps",
  qatami: "Nasser_Alqatami_128kbps",
  yaser: "Yasser_Ad-Dussary_128kbps",
  jibril: "Muhammad_Jibreel_64kbps",
};

export function getAyahAudioUrl(reciterId: string, surah: number, ayah: number): string | null {
  const dir = everyayahMap[reciterId] ?? everyayahMap.alafasy;
  if (!dir) return null;
  const s = String(surah).padStart(3, "0");
  const a = String(ayah).padStart(3, "0");
  return `https://everyayah.com/data/${dir}/${s}${a}.mp3`;
}