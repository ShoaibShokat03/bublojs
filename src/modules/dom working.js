// dom.js (Refined, robust & performant - v2)
// For BUBLOJS - improved keyed moving, safer node checks, stable vnode caching
import Config from "../config/config.js";
import LoadOnVDOM from "../app/Load_On_VDOM.js";
import { resetStateCursor, runEffects } from "./hooks.js";

/* ---------- VDOM ---------- */
export function createElement(type, props = {}, ...children) {
  return {
    type,
    key: props.key ?? null,
    props: { ...props, children: children.flat() },
  };
}

/* ---------- Create real DOM from VNode (safe) ---------- */
function createDOMElement(vNode) {
  if (vNode == null) return document.createTextNode("");
  if (typeof vNode !== "object") return document.createTextNode(String(vNode));

  const { type, props = {} } = vNode;

  if (typeof type !== "string") {
    // fallback to text to avoid throwing
    return document.createTextNode(String(type));
  }

  const el = document.createElement(type);
  applyProps(el, {}, props);

  const children = props.children || [];
  for (let i = 0; i < children.length; i++) {
    const c = children[i];
    if (c == null) continue;
    const childEl = createDOMElement(c);
    // only append to element nodes
    if (el.nodeType === Node.ELEMENT_NODE) {
      el.appendChild(childEl);
    }
  }

  // set vnode cache on element for keyed lookup
  try { el.__vnode = vNode; } catch (e) { /* ignore */ }
  return el;
}

/* ---------- Props ---------- */
function applyProps(el, oldProps = {}, newProps = {}) {
  oldProps = oldProps || {};
  newProps = newProps || {};

  const keys = { ...oldProps, ...newProps };

  for (const key in keys) {
    if (key === "children") continue;

    const oldVal = oldProps[key];
    const newVal = newProps[key];

    if (oldVal === newVal) continue;

    if (key.startsWith("on")) {
      const ev = key.slice(2).toLowerCase();
      if (typeof oldVal === "function") el.removeEventListener(ev, oldVal);
      if (typeof newVal === "function") el.addEventListener(ev, newVal);
      continue;
    }

    if (key === "style" && typeof newVal === "object") {
      const oldStyle = oldVal || {};
      for (const p in oldStyle) {
        if (!(p in newVal)) el.style[p] = "";
      }
      for (const p in newVal) {
        el.style[p] = newVal[p];
      }
      continue;
    }

    if (key === "dangerouslySetInnerHTML") {
      el.innerHTML = newVal?.__html || "";
      continue;
    }

    if (newVal == null || newVal === false) {
      try { el.removeAttribute(key); } catch (e) { }
    } else {
      try { el.setAttribute(key, String(newVal)); } catch (e) { }
    }
  }
}

/* ---------- Diffing ---------- */
function changed(a, b) {
  if (a === b) return false;
  if (typeof a !== typeof b) return true;
  if (typeof a !== "object") return a !== b;
  if (!a || !b) return true;
  if (a.type !== b.type) return true;
  if ((a.key ?? null) !== (b.key ?? null)) return true;
  return false;
}

/* ---------- updateDOM (robust, safe, better keyed moves) ---------- */
function updateDOM(parent, oldVNode, newVNode, index = 0) {
  const parentNodeType = parent?.nodeType;
  if (!parent || (parentNodeType !== Node.ELEMENT_NODE && parentNodeType !== Node.DOCUMENT_FRAGMENT_NODE)) {
    return;
  }

  const existing = parent.childNodes[index] || null;

  // mount
  if (!oldVNode && newVNode) {
    parent.insertBefore(createDOMElement(newVNode), existing);
    return;
  }

  // remove
  if (oldVNode && !newVNode) {
    if (existing) parent.removeChild(existing);
    return;
  }

  // replace (type/key mismatch)
  if (changed(oldVNode, newVNode)) {
    const newEl = createDOMElement(newVNode);
    if (existing) parent.replaceChild(newEl, existing);
    else parent.appendChild(newEl);
    return;
  }

  // primitive/text node handling
  if (typeof newVNode !== "object") {
    if (existing && existing.nodeType === Node.TEXT_NODE) {
      if (existing.textContent !== String(newVNode)) existing.textContent = String(newVNode);
    } else if (existing) {
      parent.replaceChild(document.createTextNode(String(newVNode)), existing);
    } else {
      parent.appendChild(document.createTextNode(String(newVNode)));
    }
    return;
  }

  // both are objects with same type => ensure DOM element present
  if (!existing || existing.nodeType !== Node.ELEMENT_NODE) {
    const newEl = createDOMElement(newVNode);
    if (existing) parent.replaceChild(newEl, existing);
    else parent.appendChild(newEl);
    return;
  }

  // patch props
  applyProps(existing, oldVNode?.props || {}, newVNode?.props || {});

  const oldChildren = (oldVNode?.props?.children) || [];
  const newChildren = (newVNode?.props?.children) || [];

  // Build a map of DOM nodes keyed by vnode.key for robust moves
  const domKeyMap = new Map(); // key -> { node, domIndex, vnode }
  for (let i = 0; i < existing.childNodes.length; i++) {
    const node = existing.childNodes[i];
    const vnode = node?.__vnode;
    if (vnode && vnode.key != null) {
      domKeyMap.set(vnode.key, { node, domIndex: i, vnode });
    }
  }

  let currentIndex = 0;
  for (let i = 0; i < newChildren.length; i++) {
    const newC = newChildren[i];
    // non-keyed optimistic oldC lookup uses currentIndex
    const nonKeyOld = oldChildren[currentIndex];

    if (newC && newC.key != null) {
      const entry = domKeyMap.get(newC.key);
      if (entry) {
        const { node: domNode, domIndex, vnode: oldMatchedVNode } = entry;
        // move DOM node if necessary
        if (domNode && domNode !== existing.childNodes[currentIndex]) {
          existing.insertBefore(domNode, existing.childNodes[currentIndex] || null);
        }
        // update using the matched old vnode
        updateDOM(existing, oldMatchedVNode, newC, currentIndex);
      } else {
        // new keyed node - mount at currentIndex
        updateDOM(existing, null, newC, currentIndex);
      }
    } else {
      // non-keyed path - match by position
      updateDOM(existing, nonKeyOld, newC, currentIndex);
    }
    currentIndex++;
  }

  // remove extra nodes
  while (existing.childNodes.length > newChildren.length) {
    existing.removeChild(existing.lastChild);
  }
}

/* ---------- Render (batched) ---------- */
/* Map<containerElement, renderFunction> to dedupe */
let renderQueue = new Map();
let scheduled = false;

function flushRender() {
  scheduled = false;

  const entries = Array.from(renderQueue.entries());
  for (const [container, fun] of entries) {
    try {
      resetStateCursor();
      const oldVNode = container._vNode || null;
      const newVNode = fun();

      if (changed(oldVNode, newVNode)) {
        // reset container to avoid hierarchy errors (fast and simple)
        container.innerHTML = "";
        container.appendChild(createDOMElement(newVNode));
      } else {
        updateDOM(container, oldVNode, newVNode, 0);
      }

      container._vNode = newVNode;

      // after DOM stable
      runEffects();
      LoadOnVDOM();
      Config.componentState.set("renderd-state", fun);
    } catch (err) {
      console.error("Render Error:", err);
    }
  }

  renderQueue.clear();
}

export function render(fun, container) {
  renderQueue.set(container, fun);
  if (!scheduled) {
    scheduled = true;
    Promise.resolve().then(flushRender);
  }
}

export function removeElement(selector) {
  const el = document.querySelector(selector);
  if (el) el.remove();
}

export function updateElement(selector, newVNode) {
  const el = typeof selector === "string" ? document.querySelector(selector) : selector;
  if (el && el.parentNode) {
    el.replaceWith(createDOMElement(newVNode));
  }
}
