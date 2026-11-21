// Lettori per l'ascolto delle sure intere
// folder = cartella su download.quranicaudio.com/quran/
export const RECITERS = [
  { id: "abdulbaset-mujawwad", name: "Abdul Basit (Mujawwad)", folder: "abdulbaset_mujawwad" },
  { id: "abdulbaset-murattal", name: "Abdul Basit (Murattal)", folder: "abdul_basit_murattal" },
  { id: "alafasy", name: "Mishary Rashid Alafasy", folder: "mishaari_raashid_al_3afaasee" },
  { id: "sudais", name: "Abdurrahman As-Sudais", folder: "abdurrahmaan_as-sudays" },
  { id: "maher", name: "Maher Al-Muaiqly", folder: "maher_256" },
  { id: "ghamdi", name: "Saad Al-Ghamdi", folder: "sa3d_al-ghaamidi/complete" },
  { id: "dosari", name: "Yasser Ad-Dosari", folder: "yasser_ad-dussary" },
  { id: "ajamy", name: "Ahmed Al-Ajamy", folder: "ahmed_ibn_3ali_al-3ajamy" },
  { id: "minshawi", name: "Muhammad Siddiq Al-Minshawi", folder: "muhammad_siddeeq_al-minshaawee" },
  { id: "husary", name: "Mahmoud Khalil Al-Husary", folder: "mahmood_khaleel_al-husaree" },
];

export const DEFAULT_RECITER = RECITERS[0];

// Lettore dall'id salvato (se non esiste uso quello di default)
export function findReciter(id) {
  return RECITERS.find((reciter) => reciter.id === id) ?? DEFAULT_RECITER;
}
