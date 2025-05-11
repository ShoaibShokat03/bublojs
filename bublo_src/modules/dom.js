import Config from "../config/config.js";
import LoadOnVDOM from "../app/Load_On_VDOM.js";
import { resetStateCursor } from "../modules/hooks.js";

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

function changed(node1, node2) {
  if (typeof node1 !== typeof node2) return true;
  if (typeof node1 !== "object" || node1 == null || node2 == null) {
    return node1 !== node2;
  }
  if (node1.type !== node2.type) return true;
  if (node1.key !== node2.key) return true;
  return false;
}

function updateDOM(parent, oldVNode, newVNode, index = 0) {
  const existing = parent.childNodes[index];

  if (!oldVNode && newVNode) {
    parent.appendChild(createDOMElement(newVNode));
    return;
  }
  if (oldVNode && !newVNode) {
    if (existing) {
      parent.removeChild(existing);
    }
    return;
  }
  if (changed(oldVNode, newVNode)) {
    if (existing) {
      parent.replaceChild(createDOMElement(newVNode), existing);
    } else {
      parent.appendChild(createDOMElement(newVNode));
    }
    return;
  }

  if (newVNode.type) {
    applyProps(existing, oldVNode.props || {}, newVNode.props || {});

    const oldChildren = oldVNode.props.children || [];
    const newChildren = newVNode.props.children || [];

    // Keyed reconciliation
    const keyedOld = new Map();
    const keyedNew = new Map();
    oldChildren.forEach((child, i) => {
      if (child.key) keyedOld.set(child.key, { child, index: i });
    });
    newChildren.forEach((child, i) => {
      if (child.key) keyedNew.set(child.key, { child, index: i });
    });

    const visited = new Set();
    const maxLen = Math.max(oldChildren.length, newChildren.length);

    // Update or add children
    for (let i = 0; i < newChildren.length; i++) {
      const newChild = newChildren[i];
      const oldChild = oldChildren[i];

      if (newChild && newChild.key && keyedOld.has(newChild.key)) {
        const { child: matchingOldChild, index: oldIndex } = keyedOld.get(
          newChild.key
        );
        visited.add(newChild.key);

        // Reorder if necessary
        if (oldIndex !== i) {
          const oldElement = existing.childNodes[oldIndex];
          existing.insertBefore(oldElement, existing.childNodes[i] || null);
        }

        updateDOM(existing, matchingOldChild, newChild, i);
      } else {
        // Handle non-keyed children or new children
        updateDOM(existing, oldChild, newChild, i);
      }
    }

    // Remove excess children
    for (let i = newChildren.length; i < oldChildren.length; i++) {
      const oldChild = oldChildren[i];
      if (oldChild.key && !keyedNew.has(oldChild.key)) {
        const excessChild = existing.childNodes[i];
        if (excessChild) {
          existing.removeChild(excessChild);
        }
      } else if (!oldChild.key) {
        const excessChild = existing.childNodes[i];
        if (excessChild) {
          existing.removeChild(excessChild);
        }
      }
    }
  }
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

export function render(fun, container) {
  try {
    resetStateCursor();
    Config.appState.set("render-component-index", fun.name);
    const oldVNode = container._vNode || null;
    const newVNode = fun();
    updateDOM(container, oldVNode, newVNode);
    container._vNode = newVNode;
    LoadOnVDOM();
    Config.componentState.set("renderd-state", fun);
  } catch (error) {
    console.error("Render Error:", error);
  }
}

export function updateElement(selector, newVNode) {
  const oldElement = document.querySelector(selector);
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
