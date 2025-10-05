// dom.js - Ultra-optimized VDOM (Bug-Free, cleaned & safe)
// Improvements: pooling optional, proper cleanup (listeners & vnode), robust keyed reconciliation,
// reorder checks use isSameNode, style handling fixed, no unnecessary insertBefore churn.

import Config from "../config/config.js";
import LoadOnVDOM from "../app/Load_On_VDOM.js";
import { resetStateCursor, runEffects } from "./hooks.js";

/* ---------- Config Flags ---------- */
const ENABLE_POOL = false; // toggle pooling for safety during dev
const MAX_POOL_SIZE = 1000;

/* ---------- Constants ---------- */
const EMPTY_OBJ = Object.freeze({});
const EMPTY_ARR = Object.freeze([]);
const TEXT_NODE = 3;
const ELEMENT_NODE = 1;

/* ---------- VNode Pooling (optional) ---------- */
const vnodePool = [];
function getPooledVNode() {
  if (!ENABLE_POOL) return {};
  return vnodePool.pop() || {};
}
function releaseVNode(vnode) {
  if (!ENABLE_POOL || !vnode) return;
  // clear references conservatively
  vnode.type = null;
  vnode.key = null;
  vnode.props = null;
  if (vnodePool.length < MAX_POOL_SIZE) vnodePool.push(vnode);
}

/* ---------- Utility Helpers ---------- */
function isPrimitive(v) {
  return v == null || typeof v === "string" || typeof v === "number" || typeof v === "boolean";
}

function flattenChildren(children) {
  // non-recursive flatten optimized
  const out = [];
  for (let i = 0; i < children.length; i++) {
    const c = children[i];
    if (c == null || c === false || c === true) continue;
    if (Array.isArray(c)) {
      for (let j = 0; j < c.length; j++) {
        const n = c[j];
        if (n == null || n === false || n === true) continue;
        out.push(n);
      }
    } else {
      out.push(c);
    }
  }
  return out.length ? out : EMPTY_ARR;
}

/* ---------- createElement (VDOM) ---------- */
export function createElement(type, props, ...children) {
  const vnode = getPooledVNode();
  vnode.type = type;
  vnode.key = props?.key ?? null;

  if (props) {
    const p = {};
    for (const k in props) {
      if (k !== "key") p[k] = props[k];
    }
    p.children = children.length ? flattenChildren(children) : EMPTY_ARR;
    vnode.props = p;
  } else {
    vnode.props = children.length ? { children: flattenChildren(children) } : EMPTY_OBJ;
  }

  return vnode;
}

/* ---------- DOM creation & vnode cache ---------- */
function createDOMElement(vNode) {
  if (vNode == null || vNode === false || vNode === true) return document.createTextNode("");
  if (typeof vNode !== "object") return document.createTextNode(String(vNode));

  const { type, props = EMPTY_OBJ } = vNode;
  if (typeof type !== "string") return document.createTextNode(String(type));

  const el = document.createElement(type);

  // initialize listeners tracker
  el.__listeners = el.__listeners || new Map();

  // apply props then children (props first improves layout in some cases)
  applyPropsOptimized(el, EMPTY_OBJ, props);

  const children = props.children || EMPTY_ARR;
  if (children !== EMPTY_ARR && children.length) {
    const frag = document.createDocumentFragment();
    for (let i = 0; i < children.length; i++) {
      const c = children[i];
      if (c == null || c === false || c === true) continue;
      frag.appendChild(createDOMElement(c));
    }
    el.appendChild(frag);
  }

  // cache vnode on DOM for keyed lookup and later patching
  try { el.__vnode = vNode; } catch (e) { /* ignore readonly edge */ }
  return el;
}

/* ---------- Props application with listener tracking ---------- */
const eventCache = new Map();
function getEventName(key) {
  let cached = eventCache.get(key);
  if (!cached) {
    cached = key.slice(2).toLowerCase();
    eventCache.set(key, cached);
  }
  return cached;
}

function applyPropsOptimized(el, oldProps = EMPTY_OBJ, newProps = EMPTY_OBJ) {
  // ensure listener map exists
  el.__listeners = el.__listeners || new Map();

  // fast add/update path if oldProps is EMPTY_OBJ
  if (oldProps === EMPTY_OBJ) {
    for (const k in newProps) {
      if (k === "children") continue;
      setProp(el, k, newProps[k], undefined);
    }
    return;
  }

  // remove old props not present anymore
  for (const k in oldProps) {
    if (k === "children") continue;
    if (!(k in newProps)) removeProp(el, k, oldProps[k]);
  }

  // set/update new props
  for (const k in newProps) {
    if (k === "children") continue;
    const oldVal = oldProps[k];
    const newVal = newProps[k];
    if (oldVal !== newVal) {
      setProp(el, k, newVal, oldVal);
    }
  }
}

function setProp(el, key, value, oldValue) {
  // event handlers
  if (key[0] === "o" && key[1] === "n") {
    const ev = getEventName(key);
    if (typeof oldValue === "function") {
      try { el.removeEventListener(ev, oldValue); } catch (e) { }
      el.__listeners?.delete(ev);
    }
    if (typeof value === "function") {
      try { el.addEventListener(ev, value); } catch (e) { }
      el.__listeners = el.__listeners || new Map();
      el.__listeners.set(ev, value);
    }
    return;
  }

  if (key === "style") {
    // accept string or object
    const style = el.style;
    if (typeof oldValue === "object" && typeof value === "object") {
      // clear removed keys
      for (const p in oldValue) {
        if (!(p in value)) style[p] = "";
      }
      for (const p in value) style[p] = value[p];
    } else if (typeof value === "object") {
      // replace entirely if old was string or undefined
      el.removeAttribute("style");
      for (const p in value) style[p] = value[p];
    } else {
      // primitive style string
      el.setAttribute("style", value == null ? "" : String(value));
    }
    return;
  }

  if (key === "dangerouslySetInnerHTML") {
    el.innerHTML = value?.__html || "";
    return;
  }

  if (key === "className") {
    el.className = value || "";
    return;
  }

  // boolean attr
  if (typeof value === "boolean") {
    if (value) el.setAttribute(key, "");
    else el.removeAttribute(key);
    return;
  }

  if (value == null) {
    try { el.removeAttribute(key); } catch (e) { }
  } else {
    try { el.setAttribute(key, String(value)); } catch (e) { }
  }
}

function removeProp(el, key, oldValue) {
  if (!el) return;
  if (key[0] === "o" && key[1] === "n") {
    const ev = getEventName(key);
    try {
      const fn = el.__listeners?.get(ev);
      if (typeof fn === "function") el.removeEventListener(ev, fn);
    } catch (e) { }
    el.__listeners?.delete(ev);
    return;
  }

  if (key === "className") {
    el.className = "";
    return;
  }

  if (key === "style") {
    el.removeAttribute("style");
    return;
  }

  if (key === "dangerouslySetInnerHTML") {
    el.innerHTML = "";
    return;
  }

  try { el.removeAttribute(key); } catch (e) { }
}

/* ---------- Node cleanup (listeners & vnode) ---------- */
function cleanupDomNode(node) {
  if (!node) return;
  // remove listeners tracked
  const listeners = node.__listeners;
  if (listeners instanceof Map) {
    for (const [ev, fn] of listeners) {
      try { node.removeEventListener(ev, fn); } catch (e) { }
    }
    listeners.clear();
  }
  // recursively cleanup children
  const childCount = node.childNodes?.length || 0;
  for (let i = 0; i < childCount; i++) {
    cleanupDomNode(node.childNodes[i]);
  }
  // remove vnode cache
  if (node.__vnode) {
    releaseVNode(node.__vnode);
    node.__vnode = null;
  }
}

/* ---------- changed comparator ---------- */
function changed(a, b) {
  if (a === b) return false;
  if (typeof a !== typeof b) return true;
  if (typeof a !== "object") return a !== b;
  if (!a || !b) return true;
  if (a.type !== b.type) return true;
  if ((a.key ?? null) !== (b.key ?? null)) return true;
  return false;
}

/* ---------- reconcileChildren (robust keyed & non-keyed) ---------- */
function reconcileChildren(parentEl, oldVNode, newVNode) {
  const oldChildren = (oldVNode?.props?.children) || EMPTY_ARR;
  const newChildren = (newVNode?.props?.children) || EMPTY_ARR;

  const oldLen = oldChildren.length;
  const newLen = newChildren.length;

  if (newLen === 0) {
    // remove everything safely
    while (parentEl.firstChild) {
      cleanupDomNode(parentEl.firstChild);
      parentEl.removeChild(parentEl.firstChild);
    }
    return;
  }

  if (oldLen === 0) {
    const frag = document.createDocumentFragment();
    for (let i = 0; i < newLen; i++) {
      const c = newChildren[i];
      if (c == null || c === false || c === true) continue;
      frag.appendChild(createDOMElement(c));
    }
    parentEl.appendChild(frag);
    return;
  }

  // check keyed presence
  let hasKeys = false;
  for (let i = 0; i < newLen; i++) {
    if (newChildren[i]?.key != null) { hasKeys = true; break; }
  }

  if (!hasKeys) {
    const min = Math.min(oldLen, newLen);
    // patch existing in-place
    for (let i = 0; i < min; i++) {
      patchElement(parentEl.childNodes[i], parentEl, oldChildren[i], newChildren[i]);
    }
    // append new
    if (newLen > oldLen) {
      const frag = document.createDocumentFragment();
      for (let i = oldLen; i < newLen; i++) {
        const c = newChildren[i];
        if (c == null || c === false || c === true) continue;
        frag.appendChild(createDOMElement(c));
      }
      parentEl.appendChild(frag);
    } else if (oldLen > newLen) {
      for (let i = oldLen - 1; i >= newLen; i--) {
        const child = parentEl.childNodes[i];
        if (child) {
          cleanupDomNode(child);
          parentEl.removeChild(child);
        }
      }
    }
    return;
  }

  // Keyed algorithm
  const oldKeyed = new Map();
  for (let i = 0; i < oldLen; i++) {
    const ch = oldChildren[i];
    const dom = parentEl.childNodes[i];
    if (ch?.key != null) oldKeyed.set(ch.key, { vnode: ch, dom, index: i });
  }

  const usedKeys = new Set();
  const newDomNodes = new Array(newLen);

  for (let i = 0; i < newLen; i++) {
    const newC = newChildren[i];
    if (newC == null || newC === false || newC === true) {
      newDomNodes[i] = document.createTextNode("");
      continue;
    }

    if (newC.key != null) {
      const match = oldKeyed.get(newC.key);
      if (match) {
        usedKeys.add(newC.key);
        patchElement(match.dom, parentEl, match.vnode, newC);
        newDomNodes[i] = match.dom;
      } else {
        // new keyed node
        newDomNodes[i] = createDOMElement(newC);
      }
    } else {
      // non-keyed in keyed context -> create new
      newDomNodes[i] = createDOMElement(newC);
    }
  }

  // remove old keyed nodes that weren't reused
  for (let i = oldLen - 1; i >= 0; i--) {
    const och = oldChildren[i];
    if (och?.key != null && !usedKeys.has(och.key)) {
      const domn = parentEl.childNodes[i];
      if (domn) {
        cleanupDomNode(domn);
        parentEl.removeChild(domn);
      }
    }
  }

  // reorder/insert nodes to match newDomNodes (only when necessary)
  for (let i = 0; i < newLen; i++) {
    const desired = newDomNodes[i];
    const current = parentEl.childNodes[i];
    if (!desired) continue;
    // if identical node already in place, skip
    if (current === desired || (current && desired && current.isSameNode && desired.isSameNode && current.isSameNode(desired))) {
      continue;
    }
    parentEl.insertBefore(desired, current || null);
  }

  // remove excess DOM nodes
  while (parentEl.childNodes.length > newLen) {
    const last = parentEl.lastChild;
    cleanupDomNode(last);
    parentEl.removeChild(last);
  }
}

/* ---------- patchElement (single node) ---------- */
function patchElement(domNode, parent, oldVNode, newVNode) {
  // newVNode primitive / null handling
  if (newVNode == null || newVNode === false || newVNode === true) {
    if (domNode) {
      cleanupDomNode(domNode);
      parent.removeChild(domNode);
    }
    // release old vnode
    releaseVNode(oldVNode);
    return;
  }

  // mount if no oldVNode
  if (!oldVNode) {
    const newDom = createDOMElement(newVNode);
    if (domNode) parent.replaceChild(newDom, domNode);
    else parent.appendChild(newDom);
    return;
  }

  // type/key changed -> replace
  if (changed(oldVNode, newVNode)) {
    const newDom = createDOMElement(newVNode);
    if (domNode) {
      cleanupDomNode(domNode);
      parent.replaceChild(newDom, domNode);
    } else {
      parent.appendChild(newDom);
    }
    // release old vnode
    releaseVNode(oldVNode);
    return;
  }

  // both primitives (text) and equal type -> update text
  if (typeof newVNode !== "object") {
    if (domNode && domNode.nodeType === TEXT_NODE) {
      const txt = String(newVNode);
      if (domNode.nodeValue !== txt) domNode.nodeValue = txt;
    } else {
      const textNode = document.createTextNode(String(newVNode));
      if (domNode) {
        cleanupDomNode(domNode);
        parent.replaceChild(textNode, domNode);
      } else parent.appendChild(textNode);
    }
    releaseVNode(oldVNode);
    return;
  }

  // ensure domNode is element
  if (!domNode || domNode.nodeType !== ELEMENT_NODE) {
    const newDom = createDOMElement(newVNode);
    if (domNode) {
      cleanupDomNode(domNode);
      parent.replaceChild(newDom, domNode);
    } else parent.appendChild(newDom);
    releaseVNode(oldVNode);
    return;
  }

  // patch props
  applyPropsOptimized(domNode, oldVNode.props || EMPTY_OBJ, newVNode.props || EMPTY_OBJ);

  // update vnode cache
  domNode.__vnode = newVNode;

  // reconcile children
  reconcileChildren(domNode, oldVNode, newVNode);

  // release old vnode after patch (if pooling enabled)
  releaseVNode(oldVNode);
}

/* ---------- Batched rendering ---------- */
const renderQueue = new Map();
let scheduled = false;
let rafId = null;

function flushRender() {
  scheduled = false;
  rafId = null;

  const entries = Array.from(renderQueue.entries());
  renderQueue.clear();

  for (let i = 0; i < entries.length; i++) {
    const [container, renderFn] = entries[i];
    try {
      resetStateCursor();

      const oldVNode = container.__vnode || null;
      const newVNode = renderFn();

      if (!oldVNode) {
        // initial mount
        while (container.firstChild) {
          cleanupDomNode(container.firstChild);
          container.removeChild(container.firstChild);
        }
        const dom = createDOMElement(newVNode);
        container.appendChild(dom);
        container.__vnode = newVNode;
      } else if (changed(oldVNode, newVNode)) {
        // root changed: replace whole content
        while (container.firstChild) {
          cleanupDomNode(container.firstChild);
          container.removeChild(container.firstChild);
        }
        const dom = createDOMElement(newVNode);
        container.appendChild(dom);
        container.__vnode = newVNode;
        releaseVNode(oldVNode);
      } else {
        // incremental
        const rootDom = container.firstChild;
        patchElement(rootDom, container, oldVNode, newVNode);
        container.__vnode = newVNode;
      }

      // lifecycle
      runEffects();
      LoadOnVDOM();
      Config.componentState.set("renderd-state", renderFn);
    } catch (err) {
      console.error("Render Error:", err, container);
    }
  }
}

export function render(renderFn, container) {
  renderQueue.set(container, renderFn);
  if (!scheduled) {
    scheduled = true;
    rafId = requestAnimationFrame(flushRender);
  }
}

export function renderSync(renderFn, container) {
  if (scheduled && rafId) {
    cancelAnimationFrame(rafId);
    scheduled = false;
    rafId = null;
  }
  renderQueue.set(container, renderFn);
  flushRender();
}

/* ---------- Helpers to remove/replace external nodes ---------- */
export function removeElement(selector) {
  const el = typeof selector === "string" ? document.querySelector(selector) : selector;
  if (el?.parentNode) {
    cleanupDomNode(el);
    el.parentNode.removeChild(el);
  }
}

export function updateElement(selector, newVNode) {
  const el = typeof selector === "string" ? document.querySelector(selector) : selector;
  if (!el || !el.parentNode) return;
  const newEl = createDOMElement(newVNode);
  cleanupDomNode(el);
  el.parentNode.replaceChild(newEl, el);
}

/* ---------- Perf (dev) ---------- */
export const perf = {
  renderCount: 0,
  totalRenderTime: 0,
  avgRenderTime: 0,
  reset() {
    this.renderCount = 0; this.totalRenderTime = 0; this.avgRenderTime = 0;
  },
  track(time) {
    this.renderCount++; this.totalRenderTime += time; this.avgRenderTime = this.totalRenderTime / this.renderCount;
  },
  log() { console.log(`Renders: ${this.renderCount}, Avg: ${this.avgRenderTime.toFixed(2)}ms`); }
};

// optional dev wrapper for perf - safe approach:
if (typeof process !== "undefined" && process.env?.NODE_ENV === "development") {
  const originalFlush = flushRender;
  flushRender = function () {
    const start = performance.now();
    originalFlush();
    const t = performance.now() - start;
    perf.track(t);
  };
}
