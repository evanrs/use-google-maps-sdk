import { useState, useEffect } from "react";

let cachedScripts: string[] = [];

export function useScript(src: string) {
  // Keeping track of script loaded and error state
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(
    () => {
      // If cachedScripts array already includes src that means another instance ...
      // ... of this hook already loaded this script, so no need to load again.
      if (cachedScripts.includes(src)) {
        setLoaded(true);
        setError(false);
      } else {
        setLoaded(false);
        setError(false);

        cachedScripts.push(src);

        // Create script
        let script = document.createElement("script");
        script.src = src;
        script.async = true;

        // Script event listener callbacks for load and error
        const onScriptLoad = () => {
          setLoaded(true);
          setError(false);
        };

        const onScriptError = () => {
          // Remove from cachedScripts we can try loading again
          const index = cachedScripts.indexOf(src);
          if (index >= 0) cachedScripts.splice(index, 1);
          script.remove();

          setLoaded(true);
          setError(true);
        };

        script.addEventListener("load", onScriptLoad);
        script.addEventListener("error", onScriptError);

        // Add script to document body
        document.body.appendChild(script);

        // Remove event listeners on cleanup
        return () => {
          script.removeEventListener("load", onScriptLoad);
          script.removeEventListener("error", onScriptError);
        };
      }
    },
    [src] // Only re-run effect if script src changes
  );

  return [loaded, error];
}
