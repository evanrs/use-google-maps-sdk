import { useMemo } from "react";
import { useScript } from "./";

type Libraries = "drawing" | "geometry" | "places" | "visualization";

export function useGoogleMapsSDK(
  key: string,
  libraries: Libraries[] = ["places"]
) {
  const maps = window?.google?.maps;
  const [loaded, error] = useScript(
    `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
      key
    )}&libraries=${libraries.join(",")}`
  );

  // TODO the change detection on "maps" is by side effect
  //      there appears to be a race condition when multiple
  //      useGoogleMapsSDK are used
  return useMemo(() => ({ maps, loaded, error }), [maps, loaded, error]);
}
