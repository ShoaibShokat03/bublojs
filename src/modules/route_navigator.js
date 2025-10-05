import Config from "../config/config.js";
import { render } from "./dom.js";
import { requests } from "./requests.js";
import { router } from "./router.js";

export function routeNavigator() {
  window.addEventListener("popstate", () => {
    router.navigate(requests.windowGetHref());
  });

  document.addEventListener("click", (event) => {
    const target = event.target.closest("a") || event.target;
    const route = target.getAttribute("route");
    const component = target.getAttribute("component");

    if (target.tagName === "A") {
      const href = target.href;
      if (
        !target.hasAttribute("refresh") &&
        !target.hasAttribute("download") &&
        !target.hasAttribute("target") &&
        !href.includes("mailto:") &&
        !href.includes("tel:") &&
        !href.startsWith("#") &&
        !href.includes("javascript:")
      ) {
        event.preventDefault();
        router.go(href);
      }
    } else if (route) {
      router.go(requests.url(route));
    } else if (component) {
      render(component(), Config.appRoot);
    }
  });
}
