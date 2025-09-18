import { Header, A, Nav, Span, Div } from "../../modules/html.js";
import { useState } from "../../modules/hooks.js";
import { requests } from "../../modules/requests.js";
import { render } from "../../modules/dom.js";
import Config from "../../config/config.js";

export default function MainHeader() {
  // Register component for re-rendering;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  function isActiveTab(pathname) {
    return requests.url(pathname) === requests.windowGetHref();
  }

  return Header(
    { class: "main-header" },
    A({ href: requests.url("/"), class: "logo" }, Config.appName),
    Div({}, `${requests.windowGetHref()}`),
    Nav(
      { class: `main-nav ${isMenuOpen ? "active" : ""}` },
      A(
        {
          href: requests.url("/"),
          style: `${isActiveTab("/") ? "color:red;" : ""}`,
        },
        "Home"
      ),
      A(
        {
          href: requests.url("/crud"),
          style: `${isActiveTab("/crud") ? "color:red;" : ""}`,
        },
        "CRUD"
      ),
      A(
        {
          href: requests.url("/doc"),
          style: `${isActiveTab("/doc") ? "color:red;" : ""}`,
        },
        "Docs"
      ),
      A(
        {
          href: requests.url("/about"),
          style: `${isActiveTab("/about") ? "color:red;" : ""}`,
        },
        "About"
      ),
      A(
        {
          href: requests.url("/contact"),
          style: `${isActiveTab("/contact") ? "color:red;" : ""}`,
        },
        "Contact"
      )
    ),
    Span(
      {
        class: "hamburger",
        onclick: toggleMenu,
        "aria-label": isMenuOpen ? "Close menu" : "Open menu",
      },
      isMenuOpen ? "✕" : "☰"
    )
  );
}
