import Config from "../config/config.js";
import { render } from "./dom.js";

let stateCursor = 0;          // global hook cursor
let effects = [];             // collected effects during render
let isRendering = false;      // prevent nested renders
let pendingRender = false;    // queue if render already running

// ---------- useState ----------
export function useState(initialValue) {
  const index = stateCursor++;
  const compKey = Config.appState.get("render-component-index");
  const key = `state-${compKey}-${index}`;

  if (!Config.appState.has(key)) {
    Config.appState.set(key, initialValue);
  }

  const getState = () => Config.appState.get(key);

  const setState = (newValue) => {
    const currentValue = Config.appState.get(key);
    if (newValue !== currentValue) {
      Config.appState.set(key, newValue);
      scheduleUpdate(); // controlled re-render
    }
  };

  return [getState(), setState];
}

// ---------- Reset Cursor ----------
export function resetStateCursor() {
  stateCursor = 0;
  effects = []; // clear collected effects
}

// ---------- useEffect ----------
export function useEffect(callback, dependencies) {
  const index = stateCursor++;
  const compKey = Config.appState.get("render-component-index");
  const key = `effect-${compKey}-${index}`;

  const old = Config.appState.get(key) || { deps: undefined, cleanup: null };

  let hasChanged = true;

  if (dependencies === undefined) {
    // no deps => run on every render
    hasChanged = true;
  } else if (old.deps === undefined) {
    // first time => run always
    hasChanged = true;
  } else {
    // shallow compare
    hasChanged = dependencies.some((d, i) => d !== old.deps[i]);
  }

  if (hasChanged) {
    effects.push(() => {
      if (old.cleanup) old.cleanup();
      const cleanup = callback();
      Config.appState.set(key, { deps: dependencies, cleanup });
    });
  }
}

// ---------- useRef ----------
export function useRef(initialValue) {
  return { current: initialValue };
}

// ---------- useMemo ----------
export function useMemo(factory, dependencies) {
  const [value, setValue] = useState(factory());
  useEffect(() => setValue(factory()), dependencies);
  return value;
}

// ---------- Schedule Update (controlled re-render) ----------
function scheduleUpdate() {
  if (isRendering) {
    pendingRender = true;
    return;
  }

  isRendering = true;
  try {
    const comp = Config.componentState.get("renderd-state");
    if (comp) {
      render(comp, Config.appRoot);
      // run collected effects after render
      effects.forEach((fn) => fn());
      effects = [];
    }
  } catch (err) {
    console.error("Render Error:", err);
  } finally {
    isRendering = false;
    if (pendingRender) {
      pendingRender = false;
      scheduleUpdate();
    }
  }
}
export function runEffects() {
  effects.forEach((fn) => fn());
  effects = [];
}
