import Config from "../config/config.js";
import { render } from "./dom.js";

/* ---------- Internal State ---------- */
let stateCursor = 0;
let effectCursor = 0;
let memoCursor = 0;
let refCursor = 0;

let effects = [];
let memoCache = [];
let refs = [];

/* ---------- useState ---------- */
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
    const valueToSet =
      typeof newValue === "function" ? newValue(currentValue) : newValue;

    if (valueToSet !== currentValue) {
      Config.appState.set(key, valueToSet);
      scheduleUpdate();
    }
  };

  return [getState(), setState];
}

/* ---------- Reset Cursors ---------- */
export function resetStateCursor() {
  stateCursor = 0;
  effectCursor = 0;
  memoCursor = 0;
  refCursor = 0;

  effects = [];
  memoCache = [];
  refs = [];
}

/* ---------- useEffect ---------- */
export function useEffect(callback, dependencies) {
  const index = effectCursor++;
  const compKey = Config.appState.get("render-component-index");
  const key = `effect-${compKey}-${index}`;

  const old = Config.appState.get(key) || { deps: undefined, cleanup: null };

  // check deps properly
  const hasChanged =
    !dependencies ||
    !old.deps ||
    dependencies.length !== old.deps.length ||
    dependencies.some((d, i) => d !== old.deps[i]);

  if (hasChanged) {
    effects.push(() => {
      if (old.cleanup) old.cleanup(); // cleanup pehle run karo
      const cleanup = callback(); // callback run
      Config.appState.set(key, { deps: dependencies, cleanup });
    });
  }
}


/* ---------- useRef ---------- */
export function useRef(initialValue) {
  const index = refCursor++;
  if (!refs[index]) {
    refs[index] = { current: initialValue };
  }
  return refs[index];
}

/* ---------- useMemo ---------- */
export function useMemo(factory, dependencies) {
  const index = memoCursor++;
  const cache = memoCache[index];

  if (!cache) {
    const value = factory();
    memoCache[index] = { value, deps: dependencies };
    return value;
  }

  const { value, deps } = cache;
  const hasChanged =
    !deps ||
    dependencies.length !== deps.length ||
    dependencies.some((d, i) => d !== deps[i]);

  if (hasChanged) {
    const newValue = factory();
    memoCache[index] = { value: newValue, deps: dependencies };
    return newValue;
  }

  return value;
}

/* ---------- Scheduler ---------- */
let scheduled = false;
function scheduleUpdate() {
  if (!scheduled) {
    scheduled = true;
    Promise.resolve().then(() => {
      scheduled = false;
      const comp = Config.componentState.get("renderd-state");
      if (comp) {
        resetStateCursor();
        render(comp, Config.appRoot);
        runEffects();
      }
    });
  }
}

/* ---------- Run Effects ---------- */
export function runEffects() {
  effects.forEach((fn) => fn());
  effects = [];
}
