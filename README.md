# use-google-maps-sdk

A [react hook](https://reactjs.org/docs/hooks-intro.html) that wraps the [Google Maps SDK](https://developers.google.com/maps/documentation/).

`npm install use-google-maps-sdk`

## Supported Methods

Currently limited to the JS SDK and a handful of methods.

```
import {
  useGoogleMapsSDK,
  usePlacesAutocompleteService,
  usePlacesAutocompleteSessionToken,
  usePlacePredictions
} from 'use-google-maps-sdk
```

Support will expand to include all methods that can be represented as a hook.

### usePlacePredictions
`usePlacePredictions` improves on the SDK by ignoring out of order updates. The native SDK offers no resolution guarantees — when using the hook prediction results will always represent the most recent input for which we've resolved a response.

## License

**[MIT](LICENSE)** Licensed
