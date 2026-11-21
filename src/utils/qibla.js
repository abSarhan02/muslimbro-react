import geomagnetism from "geomagnetism";

// Coordinate della Kaaba
const KAABA = { latitude: 21.4225, longitude: 39.8262 };
const EARTH_RADIUS_KM = 6371;

const toRadians = (degrees) => (degrees * Math.PI) / 180;
const toDegrees = (radians) => (radians * 180) / Math.PI;

// Porta un angolo tra 0 e 360
const normalize = (degrees) => ((degrees % 360) + 360) % 360;

// Calcola la direzione della Qibla (gradi da nord)
export function calculateQiblaBearing(latitude, longitude) {
  const latitudeRadians = toRadians(latitude);
  const kaabaLatitudeRadians = toRadians(KAABA.latitude);
  const longitudeDifference = toRadians(KAABA.longitude - longitude);

  const y = Math.sin(longitudeDifference);
  const x =
    Math.cos(latitudeRadians) * Math.tan(kaabaLatitudeRadians) -
    Math.sin(latitudeRadians) * Math.cos(longitudeDifference);

  return normalize(toDegrees(Math.atan2(y, x)));
}

// Distanza dalla Kaaba in km (formula dell'haversine)
export function distanceToKaaba(latitude, longitude) {
  const dLat = toRadians(KAABA.latitude - latitude);
  const dLon = toRadians(KAABA.longitude - longitude);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(latitude)) * Math.cos(toRadians(KAABA.latitude)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
}

// Declinazione magnetica (nord bussola vs nord vero)
// es. Bologna +4°, New York -12°
export function magneticDeclination(latitude, longitude, date = new Date()) {
  try {
    return geomagnetism.model(date).point([latitude, longitude]).decl;
  } catch {
    return 0; // se qualcosa va storto non correggo
  }
}

// Direzione del telefono (nord magnetico)
// iOS: webkitCompassHeading, gli altri: alpha
// screenAngle: se il telefono è in orizzontale
export function headingFromOrientation(event, screenAngle = 0) {
  let heading = null;
  if (Number.isFinite(event.webkitCompassHeading)) heading = event.webkitCompassHeading;
  else if (event.absolute && Number.isFinite(event.alpha)) heading = 360 - event.alpha;
  return heading === null ? null : normalize(heading + screenAngle);
}

// Differenza più corta tra due angoli (da -180 a 180)
export function angleDifference(from, to) {
  return normalize(to - from + 180) - 180;
}

// Media tra angoli, toglie il tremolio (anche da 359 a 0)
export function smoothAngle(previous, next, factor = 0.25) {
  if (previous === null) return normalize(next);
  return normalize(previous + angleDifference(previous, next) * factor);
}
