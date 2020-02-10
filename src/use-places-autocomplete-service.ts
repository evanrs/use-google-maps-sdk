import { useMemo, DependencyList } from "react";
import { useGoogleMapsSDK, usePlacesAutocompleteSessionToken } from "./";

export function usePlacesAutocompleteService(
  key: string,
  deps?: DependencyList
) {
  const { maps, loaded, error } = useGoogleMapsSDK(key);
  const { sessionToken } = usePlacesAutocompleteSessionToken(key, deps);

  return useMemo(() => {
    const autocomplete =
      maps == null ? undefined : new maps.places.AutocompleteService();

    return {
      maps,
      autocomplete:
        autocomplete == null || sessionToken == null
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
