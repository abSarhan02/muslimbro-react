import test from "node:test";
import assert from "node:assert/strict";
import { BASMALA, verseText } from "../src/utils/quranText.js";

// Test del basmala
test("un versetto senza prefisso rimane intero", () => {
  const text = "أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ";
  assert.equal(verseText(text, 94, 1), text);
});

test("rimuovo soltanto un basmala riconosciuto, già mostrato nell'intestazione", () => {
  const verse = "قُلْ هُوَ ٱللَّهُ أَحَدٌ";
  assert.equal(verseText(`${BASMALA} ${verse}`, 112, 1), verse);
});

test("il primo versetto della Fatiha non viene eliminato", () => {
  assert.equal(verseText(BASMALA, 1, 1), BASMALA);
});

test("non modifico i versetti successivi al primo", () => {
  const text = `${BASMALA} testo`;
  assert.equal(verseText(text, 2, 2), text);
});
