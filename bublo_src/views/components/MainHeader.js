import { Header, A, Nav, Span, Div, Button } from "../../modules/html.js";
import { useState } from "../../modules/hooks.js";
import { requests } from "../../modules/requests.js";
import { render } from "../../modules/dom.js";
import Config from "../../config/config.js";
import { routeUtils } from "../../routes/routes.js";

export default function MainHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  function isActiveTab(pathname) {
    return requests.url(pathname) === requests.windowGetHref();
  }

  // Get navigation items from routes
  const navItems = routeUtils.getNavigationItems();

  return Header(
    { class: "main-header" },
    Div(
      { class: "header-container" },
      A({ href: requests.url("/"), class: "logo" }, 
        Span({ class: "logo-icon" }, "🚀"),
        Span({ class: "logo-text" }, Config.appName)
      ),
      
      Nav(
        { class: `main-nav ${isMenuOpen ? "active" : ""}` },
        ...navItems.map(item => 
          A(
            {
              href: requests.url(item.path),
              class: `nav-link ${isActiveTab(item.path) ? "active" : ""}`,
            },
            item.title
          )
        ),
        A(
          {
            href: requests.url("/crud"),
            class: `nav-link demo-link ${isActiveTab("/crud") ? "active" : ""}`,
          },
          "Demo"
        )
      ),
      
      Div(
        { class: "header-actions" },
        Button(
          {
            class: "btn btn-outline btn-sm",
            onclick: () => window.open("https://github.com", "_blank")
          },
          "GitHub"
        )
      ),
      
      Button(
        {
          class: "hamburger",
          onclick: toggleMenu,
          "aria-label": isMenuOpen ? "Close menu" : "Open menu",
        },
        Span({ class: "hamburger-icon" }, isMenuOpen ? "✕" : "☰")
      )
    )
  );
}
