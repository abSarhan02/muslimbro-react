import { test } from "vitest";
import assert from "node:assert/strict";
import { DEFAULT_RECITER, findReciter, RECITERS } from "./reciters.js";
import { surahAudioUrl } from "../services/quranApi.js";

test("trova il lettore salvato", () => {
  assert.equal(findReciter("alafasy").folder, "mishaari_raashid_al_3afaasee");
});

test("id sconosciuto o vuoto: lettore di default", () => {
  assert.equal(findReciter("non-esiste"), DEFAULT_RECITER);
  assert.equal(findReciter(null), DEFAULT_RECITER);
});

test("id dei lettori tutti diversi", () => {
  assert.equal(new Set(RECITERS.map((reciter) => reciter.id)).size, RECITERS.length);
});

test("url audio con il lettore scelto", () => {
  assert.equal(
    surahAudioUrl(2, findReciter("ghamdi")),
    "https://download.quranicaudio.com/quran/sa3d_al-ghaamidi/complete/002.mp3",
  );
  assert.equal(surahAudioUrl(114), "https://download.quranicaudio.com/quran/abdulbaset_mujawwad/114.mp3");
});
