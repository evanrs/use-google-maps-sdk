import { useMemo, DependencyList } from "react";
import { useGoogleMapsSDK } from "./";

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
