import Config from "../config/config.js";
import LoadOnVDOM from "../app/Load_On_VDOM.js";
import { resetStateCursor, runEffects } from "../modules/hooks.js";

export function createElement(type, props = {}, ...children) {
  return {
    type,
    key: props.key || null,
    props: { ...props, children: children.flat() },
  };
}

function sanitizeText(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function createDOMElement(vNode) {
  if (!vNode) return document.createTextNode("");
  if (typeof vNode !== "object") return document.createTextNode(vNode);

  const { type, props } = vNode;
  const element = document.createElement(type);
  applyProps(element, {}, props);

  (props.children || []).forEach((child) => {
    element.appendChild(createDOMElement(child));
  });

  return element;
}


function applyProps(element, oldProps, newProps) {
  const allKeys = new Set([...Object.keys(oldProps), ...Object.keys(newProps)]);

  for (const key of allKeys) {
    const oldValue = oldProps[key];
    const newValue = newProps[key];

    if (oldValue === newValue) continue;
    if (key === "children") continue;

    if (key.startsWith("on") && typeof newValue === "function") {
      const eventName = key.slice(2).toLowerCase();
      if (oldValue) element.removeEventListener(eventName, oldValue);
      element.addEventListener(eventName, newValue);
      if (key === "onrender") setTimeout(() => newValue(element), 0);
    } else if (key === "style" && typeof newValue === "object") {
      Object.assign(element.style, newValue);
    } else if (key === "dangerouslySetInnerHTML") {
      element.innerHTML = newValue?.__html || "";
    } else if (key === "src" && element.tagName === "IMG") {
      element.loading = "lazy";
      convertImageToWebP(newValue, (webpUrl) => {
        element.src = webpUrl || newValue;
      });
    } else {
      if (newValue == null || newValue === false) {
        element.removeAttribute(key);
      } else {
        element.setAttribute(key, newValue);
      }
    }
  }
}

function convertImageToWebP(imageUrl, callback) {
  if (!window.createImageBitmap || imageUrl.includes(".webp")) {
    callback(imageUrl);
    return;
  }

  if (Config.webpCache.has(imageUrl)) {
    callback(Config.webpCache.get(imageUrl));
    return;
  }

  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = imageUrl;

  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    const webpUrl = canvas.toDataURL("image/webp", 0.8);
    Config.webpCache.set(imageUrl, webpUrl);
    callback(webpUrl);
  };

  img.onerror = () => callback(imageUrl);
}

// --- createDOMElement stays same as before ---
// (reuse your existing createDOMElement function)

function changed(node1, node2) {
  if (node1 === undefined && node2 === undefined) return false;
  if (typeof node1 !== typeof node2) return true;
  if (typeof node1 !== "object" || node1 == null || node2 == null) {
    return node1 !== node2;
  }
  if (node1.type !== node2.type) return true;
  if ((node1.key || null) !== (node2.key || null)) return true;
  return false;
}

function updateDOM(parent, oldVNode, newVNode, index = 0) {
  // safety guard
  if (!parent) {
    console.warn("updateDOM: parent is undefined", { oldVNode, newVNode, index });
    return;
  }

  const existing = parent.childNodes[index];

  // Case: mount new node where none existed
  if (!oldVNode && newVNode) {
    parent.insertBefore(createDOMElement(newVNode), parent.childNodes[index] || null);
    return;
  }

  // Case: remove old node
  if (oldVNode && !newVNode) {
    if (existing) parent.removeChild(existing);
    return;
  }

  // If nodes are different type / key -> replace whole node
  if (changed(oldVNode, newVNode)) {
    if (existing) {
      parent.replaceChild(createDOMElement(newVNode), existing);
    } else {
      parent.insertBefore(createDOMElement(newVNode), parent.childNodes[index] || null);
    }
    return;
  }

  // From here, nodes are same type (and not changed)
  // Ensure we have an actual DOM element to work with
  if (!existing) {
    // defensive: append newly created subtree
    parent.insertBefore(createDOMElement(newVNode), parent.childNodes[index] || null);
    return;
  }

  // Update props on existing element
  applyProps(existing, oldVNode.props || {}, newVNode.props || {});

  // Children reconciliation
  const oldChildren = (oldVNode.props && oldVNode.props.children) || [];
  const newChildren = (newVNode.props && newVNode.props.children) || [];

  // Build a key -> { vnode, domNode } map for old keyed children using actual DOM nodes
  const keyedOld = new Map();
  for (let i = 0; i < oldChildren.length; i++) {
    const c = oldChildren[i];
    if (c && c.key != null) {
      // attempt to get the DOM node that corresponds to this old child;
      // prefer existing.childNodes[i] but fall back to searching if needed
      const domAtIndex = existing.childNodes[i];
      if (domAtIndex && !domAtIndex.__vnodeMapped) {
        // Mark it tentatively — we'll still verify via sequence
        keyedOld.set(c.key, { vnode: c, dom: domAtIndex, index: i });
        domAtIndex.__vnodeMapped = true;
      } else {
        // Not found at the same index — search by matching tagName if possible
        // (best-effort; DOM may have been mutated externally)
        for (let j = 0; j < existing.childNodes.length; j++) {
          const maybe = existing.childNodes[j];
          if (!maybe.__vnodeMapped) {
            keyedOld.set(c.key, { vnode: c, dom: maybe, index: j });
            maybe.__vnodeMapped = true;
            break;
          }
        }
      }
    }
  }

  // Iterate new children and patch/insert/reorder as needed
  let runIndex = 0; // target DOM index inside `existing` for each new child
  for (let i = 0; i < newChildren.length; i++) {
    const newChild = newChildren[i];
    const oldChild = oldChildren[i];

    if (newChild && newChild.key != null) {
      // keyed new child
      const keyed = keyedOld.get(newChild.key);
      if (keyed) {
        const domNode = keyed.dom;
        const currentDomAtRun = existing.childNodes[runIndex];

        // If the node is not at desired index, move it
        if (domNode !== currentDomAtRun) {
          existing.insertBefore(domNode, currentDomAtRun || null);
        }

        // find the old vnode that matched this key (if any) to pass into updateDOM
        updateDOM(existing, keyed.vnode, newChild, Array.prototype.indexOf.call(existing.childNodes, domNode));
        runIndex++;
      } else {
        // new keyed node, insert a fresh DOM node at runIndex
        existing.insertBefore(createDOMElement(newChild), existing.childNodes[runIndex] || null);
        runIndex++;
      }
    } else {
      // non-keyed: update by position
      // If corresponding old child exists at same position, patch it
      if (oldChild) {
        updateDOM(existing, oldChild, newChild, runIndex);
      } else {
        // no old child at this position, create/insert
        existing.insertBefore(createDOMElement(newChild), existing.childNodes[runIndex] || null);
      }
      runIndex++;
    }
  }

  // Remove excess DOM nodes if any remain after runIndex
  while (existing.childNodes.length > newChildren.length) {
    const lastIndex = existing.childNodes.length - 1;
    const nodeToRemove = existing.childNodes[lastIndex];
    if (nodeToRemove) existing.removeChild(nodeToRemove);
  }

  // cleanup temporary markers
  for (let j = 0; j < existing.childNodes.length; j++) {
    if (existing.childNodes[j].__vnodeMapped) delete existing.childNodes[j].__vnodeMapped;
  }
}

// safer render: if root changed type or keys, replace container children entirely
export function render(fun, container) {
  try {
    resetStateCursor();
    Config.appState.set("render-component-index", fun.name);

    const oldVNode = container._vNode || null;
    const newVNode = fun();

    // If root changed drastically, it's safer to replace children
    if (changed(oldVNode, newVNode)) {
      // Replace whole container content in one shot (safe, avoids residual nodes)
      container.replaceChildren(); // clear
      container.appendChild(createDOMElement(newVNode));
      container._vNode = newVNode;
      runEffects();
      LoadOnVDOM();
      Config.componentState.set("renderd-state", fun);
      return;
    }

    // otherwise try fine-grained update
    updateDOM(container, oldVNode, newVNode);
    container._vNode = newVNode;
    runEffects();
    LoadOnVDOM();
    Config.componentState.set("renderd-state", fun);
  } catch (error) {
    console.error("Render Error:", error);
  }
}


export function updateElement(selector, newVNode) {
  const oldElement =typeof(selector)=="string"? document.querySelector(selector):selector;
  if (oldElement) {
    oldElement.replaceWith(createDOMElement(newVNode));
  }
}

export function removeElement(selector) {
  const element = document.querySelector(selector);
  if (element) element.remove();
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

  const element = document.querySelector(selector);
  if (element) observer.observe(element);
}
