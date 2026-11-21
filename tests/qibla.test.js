import test from "node:test";
import assert from "node:assert/strict";
import { calculateQiblaBearing, headingFromOrientation } from "../src/utils/qibla.js";

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
