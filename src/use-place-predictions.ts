import { useEffect, DependencyList } from "react";
import { useLatestVersion } from "use-latest-version";
import { useGoogleMapsSDK, usePlacesAutocompleteService } from "./";

export type UsePlacePredictionsProps = {
  /**
   * The Google service key with Google Maps JS SDK enabled
   */
  key: string;
  /**
   * Should input be allowed as a prop?
   */
  input?: string | null;
  /**
   * Constrains the results to the place type
   */
  types?: PlaceType[];
  /**
   * One or many ISO 3166-1 alpha-2 country codes
   */
  country?: string | string[];
  /**
   * Focus origin of predictions
   */
  geolocation?: {
    // We accept null arguments for ergonomics of passing useGeolocation
    // TODO pull request on react-use for type discriminator
    latitude: number | null;
    longitude: number | null;
  };
  /**
   * Specifies radius for the geolocation of the prediction
   * @default 16,000 meters ~10 miles
   */
  radius?: number;
};

type PlaceType =
  // Instructs the Place Autocomplete service to return only geocoding results, rather than business results.
  // Generally, you use this request to disambiguate results where the location specified may be indeterminate.
  | "geocode"
  // Instructs the Place Autocomplete service to return only geocoding results with a precise address.
  // Generally, you use this request when you know the user will be looking for a fully specified address.
  | "address"
  // Instructs the Place Autocomplete service to return only business results.
  | "establishment"
  // The (regions) type collection instructs the Places service to return any result matching the following types
  | "(regions)"
  // The (cities) type collection instructs the Places service to return results that match locality or administrative_area_level_3.
  | "(cities)";

type Status =
  | "INVALID_REQUEST"
  | "NOT_FOUND"
  | "OK"
  | "OVER_QUERY_LIMIT"
  | "REQUEST_DENIED"
  | "UNKNOWN_ERROR"
  | "ZERO_RESULTS";

export type Prediction = {
  input: string;
  results: google.maps.places.AutocompletePrediction[];
  status: Status;
};

const defaults = {
  get prediction(): Prediction {
    return {
      input: "",
      results: [],
      status: "OK"
    };
  }
};

/**
 * @TODO (?) add a loading state when input changes
 */
export function usePlacePredictions(
  props: UsePlacePredictionsProps,
  deps: DependencyList = []
) {
  const { key, input, types, country, geolocation, radius } = props;

  const { maps } = useGoogleMapsSDK(key);
  const { autocomplete } = usePlacesAutocompleteService(key, deps);

  const [prediction, setPrediction] = useLatestVersion(defaults.prediction, [
    input
  ]);

  useEffect(
    () => {
      if (maps && !input) {
        setPrediction(defaults.prediction);
      }

      if (maps && autocomplete && input) {
        autocomplete.getPlacePredictions(
          {
            input,

            types,

            ...(country && {
              componentRestrictions: {
                country: country
              }
            }),

            ...(geolocation &&
              geolocation.latitude != null &&
              geolocation.longitude != null && {
                location: new maps.LatLng(
                  geolocation.latitude,
                  geolocation.longitude
                ),

                radius: radius ?? 16000
              })
          },
          (results, status) => {
            setPrediction({ input, results: results ?? [], status });
          }
        );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      maps,
      autocomplete,
      input?.trim(),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      types && types.join(),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      Array.isArray(country) ? country.join() : country,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      Object.values(geolocation || {}).join(),
      radius
    ]
  );

  return prediction.value;
}
