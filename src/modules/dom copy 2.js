// dom.js (Refined, robust & performant)
// Author: Mishi-style quickfix for Shoaib's BUBLOJS
import Config from "../config/config.js";
import LoadOnVDOM from "../app/Load_On_VDOM.js";
import { resetStateCursor, runEffects } from "../modules/hooks.js";

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

  // safety: type must be string (tag)
  if (typeof type !== "string") {
    // fallback: render as text node to avoid throwing in production
    return document.createTextNode(String(type));
  }

  const el = document.createElement(type);
  applyProps(el, {}, props);

  // append children safely (text nodes allowed)
  const children = props.children || [];
  for (let i = 0; i < children.length; i++) {
    const c = children[i];
    if (c == null) continue;
    const childEl = createDOMElement(c);
    // only ELEMENT_NODE can have children appended; text nodes accept text nodes via replace/append
    if (el.nodeType === Node.ELEMENT_NODE) {
      el.appendChild(childEl);
    }
  }

  // small cache for debug/inspect
  try { el.__vnode = vNode; } catch (e) { }
  return el;
}

/* ---------- Props ---------- */
function applyProps(el, oldProps = {}, newProps = {}) {
  oldProps = oldProps || {};
  newProps = newProps || {};

  // merge keys from both to handle removals
  const keys = { ...oldProps, ...newProps };

  for (const key in keys) {
    if (key === "children") continue;

    const oldVal = oldProps[key];
    const newVal = newProps[key];

    if (oldVal === newVal) continue;

    // event handlers: onClick, onMouse...
    if (key.startsWith("on")) {
      const ev = key.slice(2).toLowerCase();
      if (typeof oldVal === "function") el.removeEventListener(ev, oldVal);
      if (typeof newVal === "function") el.addEventListener(ev, newVal);
      continue;
    }

    // style object merge
    if (key === "style" && typeof newVal === "object") {
      const oldStyle = oldVal || {};
      // clear removed styles
      for (const p in oldStyle) {
        if (!(p in newVal)) el.style[p] = "";
      }
      for (const p in newVal) {
        // apply style (string or number)
        el.style[p] = newVal[p];
      }
      continue;
    }

    // dangerouslySetInnerHTML
    if (key === "dangerouslySetInnerHTML") {
      el.innerHTML = newVal?.__html || "";
      continue;
    }

    // attributes removal/add
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

/* ---------- updateDOM (robust, safe) ---------- */
function updateDOM(parent, oldVNode, newVNode, index = 0) {
  // parent must be element or document fragment
  const parentNodeType = parent?.nodeType;
  if (!parent || (parentNodeType !== Node.ELEMENT_NODE && parentNodeType !== Node.DOCUMENT_FRAGMENT_NODE)) {
    // nothing we can do safely
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

  // text node handling (both are text or primitive)
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

  // At this point both oldVNode and newVNode are objects with same type
  // Ensure existing is an ELEMENT_NODE, else replace it
  if (!existing || existing.nodeType !== Node.ELEMENT_NODE) {
    // either missing or wrong node-type (text/comment) -> replace with correct element
    const newEl = createDOMElement(newVNode);
    if (existing) parent.replaceChild(newEl, existing);
    else parent.appendChild(newEl);
    return;
  }

  // same element type -> patch props
  applyProps(existing, oldVNode?.props || {}, newVNode?.props || {});

  // children diffing (keyed support + index fallback)
  const oldChildren = (oldVNode?.props?.children) || [];
  const newChildren = (newVNode?.props?.children) || [];

  // build map of old keyed children for O(n) moves
  const oldKeyIndexMap = new Map();
  for (let i = 0; i < oldChildren.length; i++) {
    const c = oldChildren[i];
    if (c && c.key != null) oldKeyIndexMap.set(c.key, i);
  }

  // iterate newChildren and update/insert/move
  let currentIndex = 0;
  for (let i = 0; i < newChildren.length; i++) {
    const newC = newChildren[i];
    let oldC = oldChildren[currentIndex];

    if (newC && newC.key != null) {
      // keyed path
      const foundOldIndex = oldKeyIndexMap.has(newC.key) ? oldKeyIndexMap.get(newC.key) : -1;
      if (foundOldIndex > -1) {
        oldC = oldChildren[foundOldIndex];
        const domNode = existing.childNodes[foundOldIndex];
        // move node if needed
        if (domNode && domNode !== existing.childNodes[currentIndex]) {
          existing.insertBefore(domNode, existing.childNodes[currentIndex] || null);
        }
        updateDOM(existing, oldC, newC, currentIndex);
      } else {
        // new keyed node, mount at currentIndex
        updateDOM(existing, null, newC, currentIndex);
      }
    } else {
      // non-keyed: best-effort index match
      updateDOM(existing, oldChildren[currentIndex], newC, currentIndex);
    }
    currentIndex++;
  }

  // remove any extra old nodes
  while (existing.childNodes.length > newChildren.length) {
    existing.removeChild(existing.lastChild);
  }
}

/* ---------- Render (batched) ---------- */
/*
  Use Map to avoid duplicate container entries.
  Map<containerElement, renderFunction>
*/
let renderQueue = new Map();
let scheduled = false;

function flushRender() {
  scheduled = false;

  // iterate entries snapshot to avoid mutation issues
  const entries = Array.from(renderQueue.entries());
  for (const [container, fun] of entries) {
    try {
      resetStateCursor();
      const oldVNode = container._vNode || null;
      const newVNode = fun();

      if (changed(oldVNode, newVNode)) {
        // clear container to avoid hierarchy errors (text vs element mismatch)
        // using innerHTML = "" is fast and simpler; safe because we control DOM
        container.innerHTML = "";
        container.appendChild(createDOMElement(newVNode));
      } else {
        updateDOM(container, oldVNode, newVNode, 0);
      }

      container._vNode = newVNode;

      // run hooks/effects after DOM stable
      runEffects();
      LoadOnVDOM();
      Config.componentState.set("renderd-state", fun);
    } catch (err) {
      // log error but don't break others
      console.error("Render Error:", err);
    }
  }

  renderQueue.clear();
}

export function render(fun, container) {
  // queue by container to prevent duplicate renders for same mount
  renderQueue.set(container, fun);
  if (!scheduled) {
    scheduled = true;
    Promise.resolve().then(flushRender); // microtask batching (fast)
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