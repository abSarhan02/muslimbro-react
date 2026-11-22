import { useCallback, useSyncExternalStore } from "react";

// Telefono/tablet: qui si mostra la Qibla
export const QIBLA_DEVICE_QUERY = "(max-width: 1024px), (hover: none) and (pointer: coarse)";

// Hook per le media query (true/false)
export function useMediaQuery(query) {
  const subscribe = useCallback(
    (onChange) => {
      const media = matchMedia(query);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(subscribe, () => matchMedia(query).matches);
}
