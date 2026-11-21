import test from "node:test";
import assert from "node:assert/strict";
import {
  angleDifference,
  calculateQiblaBearing,
  distanceToKaaba,
  headingFromOrientation,
  magneticDeclination,
  smoothAngle,
} from "../src/utils/qibla.js";

// Valori noti arrotondati al grado
test("da Londra e da Roma la Qibla è verso sud-est", () => {
  assert.equal(Math.round(calculateQiblaBearing(51.5074, -0.1278)), 119);
  assert.equal(Math.round(calculateQiblaBearing(41.9028, 12.4964)), 123);
});

test("da New York la Qibla è verso nord-est", () => {
  assert.equal(Math.round(calculateQiblaBearing(40.7128, -74.006)), 58);
});

test("leggo la bussola di iOS e quella assoluta degli altri browser", () => {
  assert.equal(headingFromOrientation({ webkitCompassHeading: 90 }), 90);
  assert.equal(headingFromOrientation({ absolute: true, alpha: 90 }), 270);
  assert.equal(headingFromOrientation({ absolute: false, alpha: 90 }), null);
});

test("con il telefono in orizzontale aggiungo la rotazione dello schermo", () => {
  assert.equal(headingFromOrientation({ webkitCompassHeading: 300 }, 90), 30);
  assert.equal(headingFromOrientation({ absolute: true, alpha: 0 }, 0), 0);
});

test("distanza dalla Kaaba (Roma circa 3.420 km)", () => {
  const km = distanceToKaaba(41.9028, 12.4964);
  assert.ok(km > 3380 && km < 3460, `distanza ${km}`);
});

test("differenza tra angoli e media morbida passano bene da 359 a 0", () => {
  assert.equal(angleDifference(350, 10), 20);
  assert.equal(angleDifference(10, 350), -20);
  assert.equal(smoothAngle(null, 90), 90);
  assert.equal(smoothAngle(350, 10, 0.5), 0);
});

test("declinazione magnetica: Bologna verso est, New York verso ovest", () => {
  const date = new Date("2026-06-01");
  assert.equal(Math.round(magneticDeclination(44.49, 11.34, date)), 4);
  assert.equal(Math.round(magneticDeclination(40.71, -74.0, date)), -12);
});
