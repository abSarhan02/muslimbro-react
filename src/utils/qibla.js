// Coordinate della Kaaba
const KAABA = { latitude: 21.4225, longitude: 39.8262 };

const toRadians = (degrees) => (degrees * Math.PI) / 180;
const toDegrees = (radians) => (radians * 180) / Math.PI;

// Calcola la direzione della Qibla (gradi da nord)
export function calculateQiblaBearing(latitude, longitude) {
  const latitudeRadians = toRadians(latitude);
  const kaabaLatitudeRadians = toRadians(KAABA.latitude);
  const longitudeDifference = toRadians(KAABA.longitude - longitude);

  const y = Math.sin(longitudeDifference);
  const x =
    Math.cos(latitudeRadians) * Math.tan(kaabaLatitudeRadians) -
    Math.sin(latitudeRadians) * Math.cos(longitudeDifference);

  return (toDegrees(Math.atan2(y, x)) + 360) % 360;
}

// Direzione del telefono
// (iOS usa webkitCompassHeading, gli altri alpha)
export function headingFromOrientation(event) {
  if (Number.isFinite(event.webkitCompassHeading)) return event.webkitCompassHeading;
  if (event.absolute && Number.isFinite(event.alpha)) return (360 - event.alpha) % 360;
  return null;
}
