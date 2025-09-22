// dom.js (replace your existing file with this)
import Config from "../config/config.js";
import LoadOnVDOM from "../app/Load_On_VDOM.js";
import { resetStateCursor, runEffects } from "./hooks.js";

/* ---------- VDOM helpers ---------- */
export function createElement(type, props = {}, ...children) {
  return {
    type,
    key: props.key ?? null,
    props: { ...props, children: children.flat() },
  };
}

function sanitizeText(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/* ---------- create real DOM from vNode ---------- */
function createDOMElement(vNode) {
  if (vNode === undefined || vNode === null) return document.createTextNode("");
  if (typeof vNode !== "object") return document.createTextNode(String(vNode));

  const { type, props } = vNode;
  const el = document.createElement(type);

  // apply attributes / events
  applyProps(el, {}, props || {});

  // children
  (props.children || []).forEach((child) => {
    el.appendChild(createDOMElement(child));
  });

  // attach a reference for debugging (non-enumerable)
  try {
    Object.defineProperty(el, "__vnode", { value: vNode, writable: true });
  } catch (e) {
    el.__vnode = vNode;
  }

  return el;
}

/* ---------- compare nodes ---------- */
function isTextVNode(v) {
  return v === null || v === undefined || typeof v !== "object";
}

function changed(a, b) {
  // both text nodes
  if (isTextVNode(a) && isTextVNode(b)) return a !== b;
  if (isTextVNode(a) !== isTextVNode(b)) return true;
  // now both are objects
  if (!a || !b) return true;
  if (a.type !== b.type) return true;
  if ((a.key ?? null) !== (b.key ?? null)) return true;
  return false;
}

/* ---------- apply/patch props (attributes, events, style, special cases) ---------- */
function applyProps(element, oldProps = {}, newProps = {}) {
  const keys = new Set([...Object.keys(oldProps), ...Object.keys(newProps)]);
  for (const key of keys) {
    if (key === "children") continue;
    const oldVal = oldProps[key];
    const newVal = newProps[key];

    if (oldVal === newVal) continue;

    // event handlers (onClick -> click)
    if (key.startsWith("on") && typeof newVal === "function") {
      const ev = key.slice(2).toLowerCase();
      if (typeof oldVal === "function") element.removeEventListener(ev, oldVal);
      element.addEventListener(ev, newVal);
      continue;
    }

    // style object
    if (key === "style" && typeof newVal === "object") {
      // naive diff: override properties and remove obsolete
      const oldStyle = oldVal || {};
      for (const p of Object.keys(oldStyle)) {
        if (!(p in newVal)) element.style[p] = "";
      }
      for (const p of Object.keys(newVal)) {
        element.style[p] = newVal[p];
      }
      continue;
    }

    // dangerouslySetInnerHTML
    if (key === "dangerouslySetInnerHTML") {
      element.innerHTML = newVal?.__html || "";
      continue;
    }

    // img src special (lazy + webp convert handled if exists)
    if (key === "src" && element.tagName === "IMG") {
      element.loading = "lazy";
      // keep whatever conversion you had — call helper if present
      if (typeof window.convertImageToWebP === "function") {
        window.convertImageToWebP(newVal, (url) => (element.src = url || newVal));
      } else {
        element.src = newVal;
      }
      continue;
    }

    // boolean / null handling
    if (newVal == null || newVal === false) {
      element.removeAttribute(key);
    } else {
      element.setAttribute(key, String(newVal));
    }
  }
}

/* ---------- core diffing + patching ---------- */
function updateDOM(parent, oldVNode, newVNode, index = 0) {
  if (!parent) return;

  const existing = parent.childNodes[index];

  // 1) mount new node
  if (!oldVNode && newVNode) {
    parent.insertBefore(createDOMElement(newVNode), parent.childNodes[index] || null);
    return;
  }

  // 2) remove node
  if (oldVNode && !newVNode) {
    if (existing) parent.removeChild(existing);
    return;
  }

  // 3) if changed types/keys -> replace
  if (changed(oldVNode, newVNode)) {
    if (existing) {
      parent.replaceChild(createDOMElement(newVNode), existing);
    } else {
      parent.insertBefore(createDOMElement(newVNode), parent.childNodes[index] || null);
    }
    return;
  }

  // 4) now same "shape" — handle text or element
  if (isTextVNode(newVNode)) {
    // text update (fast path)
    if (existing && existing.nodeType === Node.TEXT_NODE) {
      if (existing.textContent !== String(newVNode)) existing.textContent = String(newVNode);
    } else {
      // replace existing element with text node
      const textNode = document.createTextNode(String(newVNode));
      if (existing) parent.replaceChild(textNode, existing);
      else parent.insertBefore(textNode, parent.childNodes[index] || null);
    }
    return;
  }

  // ensure existing DOM element is present
  if (!existing || existing.nodeType === Node.TEXT_NODE) {
    parent.insertBefore(createDOMElement(newVNode), parent.childNodes[index] || null);
    if (existing) parent.removeChild(existing);
    return;
  }

  // 5) update props
  applyProps(existing, oldVNode.props || {}, newVNode.props || {});

  // 6) reconcile children
  const oldChildren = (oldVNode.props && oldVNode.props.children) || [];
  const newChildren = (newVNode.props && newVNode.props.children) || [];

  // map keyed old children to their DOM nodes (best-effort)
  const oldKeyMap = new Map();
  for (let i = 0; i < oldChildren.length; i++) {
    const c = oldChildren[i];
    if (c && c.key != null) {
      const dom = existing.childNodes[i] || null;
      oldKeyMap.set(c.key, { vnode: c, domIndex: i, dom });
    }
  }

  // iterate through new children and patch/insert/move
  let currentDomIndex = 0;
  for (let i = 0; i < newChildren.length; i++) {
    const newChild = newChildren[i];
    const oldChildAtPos = oldChildren[i];

    if (newChild && newChild.key != null) {
      // keyed new child
      const keyed = oldKeyMap.get(newChild.key);
      if (keyed && keyed.dom) {
        const domNode = keyed.dom;
        const targetNode = existing.childNodes[currentDomIndex];
        if (domNode !== targetNode) {
          existing.insertBefore(domNode, targetNode || null);
        }
        // find actual index of domNode after moving
        const domIdx = Array.prototype.indexOf.call(existing.childNodes, domNode);
        updateDOM(existing, keyed.vnode, newChild, domIdx);
        currentDomIndex++;
      } else {
        // new keyed node — insert fresh at currentDomIndex
        existing.insertBefore(createDOMElement(newChild), existing.childNodes[currentDomIndex] || null);
        currentDomIndex++;
      }
    } else {
      // non-keyed: patch by position
      updateDOM(existing, oldChildAtPos, newChild, currentDomIndex);
      currentDomIndex++;
    }
  }

  // remove trailing old nodes if any
  while (existing.childNodes.length > newChildren.length) {
    const lastIndex = existing.childNodes.length - 1;
    existing.removeChild(existing.childNodes[lastIndex]);
  }
}

/* ---------- render (safe + fast) ---------- */
export function render(fun, container) {
  try {
    resetStateCursor();
    Config.appState.set("render-component-index", fun.name);

    const oldVNode = container._vNode || null;
    const newVNode = fun();

    // Fast path: if root type/key changed -> replace only root (not entire container clear)
    if (changed(oldVNode, newVNode)) {
      // replace the top-level node in container (preserve container element)
      if (container.firstChild) {
        container.replaceChild(createDOMElement(newVNode), container.firstChild);
      } else {
        container.appendChild(createDOMElement(newVNode));
      }
      container._vNode = newVNode;
      runEffects();
      LoadOnVDOM();
      Config.componentState.set("renderd-state", fun);
      return;
    }

    // Otherwise attempt fine-grained update
    updateDOM(container, oldVNode, newVNode, 0);
    container._vNode = newVNode;
    runEffects();
    LoadOnVDOM();
    Config.componentState.set("renderd-state", fun);
  } catch (error) {
    console.error("Render Error:", error);
  }
}

/* ---------- utilities used elsewhere ---------- */
export function updateElement(selector, newVNode) {
  const el = typeof selector === "string" ? document.querySelector(selector) : selector;
  if (el) {
    el.replaceWith(createDOMElement(newVNode));
  }
}

export function removeElement(selector) {
  const el = document.querySelector(selector);
  if (el) el.remove();
}

export function lazyLoadComponent(selector, component) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        render(component, entry.target);
        observer.disconnect();
      }
    });
  });
  const el = document.querySelector(selector);
  if (el) observer.observe(el);
}
