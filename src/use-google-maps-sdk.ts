import { useMemo, DependencyList } from "react";
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

export function usePlacesAutocompleteService(
  key: string,
  deps?: DependencyList
) {
  const { maps, loaded, error } = useGoogleMapsSDK(key);
  const sessionToken = usePlacesAutocompleteSessionToken(key, deps);

  return useMemo(() => {
    const autocomplete =
      maps == null ? undefined : new maps.places.AutocompleteService();

    return {
      maps,
      autocomplete:
        autocomplete == null
          ? undefined
          : <typeof autocomplete>{
              getQueryPredictions(request, callback) {
                return autocomplete.getQueryPredictions(request, callback);
              },
              getPlacePredictions(request, callback) {
                return autocomplete.getPlacePredictions(
                  { sessionToken, ...request },
                  callback
                );
              }
            },
      loaded,
      error
    };
  }, [maps, loaded, error, sessionToken]);
}

export function usePlacesAutocompleteSessionToken(
  key: string,
  deps?: DependencyList
) {
  const { maps, loaded, error } = useGoogleMapsSDK(key);

  const value = useMemo(
    () => ({
      maps,
      sessionToken: maps
        ? new maps.places.AutocompleteSessionToken()
        : undefined,
      loaded,
      error
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [maps, loaded, error, ...(deps ? deps : [])]
  );

  return value;
}
