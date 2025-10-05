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

function createDOMElement(vNode) {
  if (vNode == null) return document.createTextNode("");
  if (typeof vNode !== "object") return document.createTextNode(String(vNode));

  const { type, props } = vNode;
  const el = document.createElement(type);
  applyProps(el, {}, props);

  for (const c of props.children || []) {
    el.appendChild(createDOMElement(c));
  }

  el.__vnode = vNode; // cache link
  return el;
}

/* ---------- Props ---------- */
function applyProps(el, oldProps = {}, newProps = {}) {
  for (const key in { ...oldProps, ...newProps }) {
    if (key === "children") continue;
    const oldVal = oldProps[key];
    const newVal = newProps[key];

    if (oldVal === newVal) continue;

    if (key.startsWith("on")) {
      const ev = key.slice(2).toLowerCase();
      if (oldVal) el.removeEventListener(ev, oldVal);
      if (newVal) el.addEventListener(ev, newVal);
      continue;
    }

    if (key === "style" && typeof newVal === "object") {
      for (const p in oldVal || {}) if (!(p in newVal)) el.style[p] = "";
      for (const p in newVal) el.style[p] = newVal[p];
      continue;
    }

    if (key === "dangerouslySetInnerHTML") {
      el.innerHTML = newVal?.__html || "";
      continue;
    }

    if (newVal == null || newVal === false) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, String(newVal));
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

function updateDOM(parent, oldVNode, newVNode, index = 0) {
  const existing = parent.childNodes[index];

  // mount
  if (!oldVNode && newVNode) {
    parent.insertBefore(createDOMElement(newVNode), existing || null);
    return;
  }

  // remove
  if (oldVNode && !newVNode) {
    if (existing) parent.removeChild(existing);
    return;
  }

  // replace
  if (changed(oldVNode, newVNode)) {
    parent.replaceChild(createDOMElement(newVNode), existing);
    return;
  }

  // text node
  if (typeof newVNode !== "object") {
    if (existing.nodeType === Node.TEXT_NODE) {
      if (existing.textContent !== String(newVNode)) {
        existing.textContent = String(newVNode);
      }
    } else {
      parent.replaceChild(document.createTextNode(String(newVNode)), existing);
    }
    return;
  }

  // same element type
  applyProps(existing, oldVNode.props, newVNode.props);

  const oldChildren = oldVNode.props?.children || [];
  const newChildren = newVNode.props?.children || [];

  // keyed map for old children
  const keyed = new Map();
  oldChildren.forEach((c, i) => {
    if (c?.key != null) keyed.set(c.key, { vnode: c, index: i });
  });

  let childIndex = 0;
  for (let i = 0; i < newChildren.length; i++) {
    const newC = newChildren[i];
    let oldC = oldChildren[i];

    if (newC?.key != null && keyed.has(newC.key)) {
      const { vnode, index } = keyed.get(newC.key);
      oldC = vnode;
      const domNode = existing.childNodes[index];
      if (domNode !== existing.childNodes[childIndex]) {
        existing.insertBefore(domNode, existing.childNodes[childIndex] || null);
      }
      updateDOM(existing, oldC, newC, childIndex);
    } else {
      updateDOM(existing, oldC, newC, childIndex);
    }
    childIndex++;
  }

  // remove extra old nodes
  while (existing.childNodes.length > newChildren.length) {
    existing.removeChild(existing.lastChild);
  }
}

/* ---------- Render (batched) ---------- */
let renderQueue = new Set();
let scheduled = false;

function flushRender() {
  scheduled = false;
  for (const { fun, container } of renderQueue) {
    try {
      resetStateCursor();
      const oldVNode = container._vNode || null;
      const newVNode = fun();

      if (changed(oldVNode, newVNode)) {
        if (container.firstChild) {
          container.replaceChild(createDOMElement(newVNode), container.firstChild);
        } else {
          container.appendChild(createDOMElement(newVNode));
        }
      } else {
        updateDOM(container, oldVNode, newVNode, 0);
      }

      container._vNode = newVNode;
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
  renderQueue.add({ fun, container });
  if (!scheduled) {
    scheduled = true;
    Promise.resolve().then(flushRender); // microtask batch
  }
}
export function removeElement(selector) {
  const el = document.querySelector(selector);
  if (el) el.remove();
}
export function updateElement(selector, newVNode) {
  const el = typeof selector === "string" ? document.querySelector(selector) : selector;
  if (el) {
    el.replaceWith(createDOMElement(newVNode));
  }
}