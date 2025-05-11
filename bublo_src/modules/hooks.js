import Config from "../config/config.js";
import { render } from "./dom.js";

// Fixed useState implementation
let stateCursor = 0; // Global counter during a render

export function useState(initialValue) {
  // Unique for every call
  stateCursor++; // Move cursor for next useState call
  const index = Config.appState.get("render-component-index");
  const key = `state-${index}-${stateCursor}`;
//   console.log("useState key", key, "cursor", stateCursor);

  const componentState = Config.componentState.get("component-state");
  const renderState = Config.appState.get("renderd-state");
  if (componentState !== renderState) {
    // Initialize if doesn't exist
    if (!Config.appState.has(key)) {
      Config.appState.set(key, initialValue);
      console.log("useState initialized", key, initialValue);
    }
  }

  const getState = () => Config.appState.get(key);

  const setState = (newValue) => {
    const currentValue = Config.appState.get(key);
    if (newValue !== currentValue) {
      Config.appState.set(key, newValue);
      // Before re-render, reset cursor
      stateCursor = 0;
      // render(Config.componentState.get("renderd-state"), Config.appRoot);
    }
  };

  return [getState, setState];
}

// Important: Reset cursor to 0 before every re-render
export function resetStateCursor() {
  stateCursor = 0;
}

export function useEffect(callback, dependencies = []) {
  const key = Symbol();
  const state = Config.appState.get(key) || { lastDeps: [], hasRun: false };

  if (
    !state.hasRun ||
    dependencies.some((dep, i) => dep !== state.lastDeps[i])
  ) {
    callback();
    Config.appState.set(key, { lastDeps: dependencies, hasRun: true });
  }
}

export function useRef(initialValue) {
  return { current: initialValue };
}

export function useMemo(factory, dependencies) {
  const [getState, setState] = useState(factory());
  useEffect(() => setState(factory()), dependencies);
  return getState();
}
