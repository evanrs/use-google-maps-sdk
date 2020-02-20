import { useMemo } from "react";
import { useScript } from "./";

type Libraries = "drawing" | "geometry" | "places" | "visualization";

export function useGoogleMapsSDK(
  key: string,
  libraries: Libraries[] = ["places"]
) {
  const [loaded, error] = useScript(
    `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
      key
    )}&libraries=${libraries.join(",")}`
  );

  // TODO the change detection on "maps" is by side effect
  //      there appears to be a race condition when multiple
  //      useGoogleMapsSDK are used
  return useMemo(
    () => ({
      loaded,
      error,
      get maps() {
        return window?.google?.maps;
      }
    }),
    [loaded, error, window?.google?.maps]
  );
}
