import { createElement } from "../modules/dom.js";
import {
  H1,
  H2,
  H3,
  P,
  Div,
  A,
  Section,
  Ul,
  Li,
  Code,
  Pre,
} from "../modules/html.js";
import { requests } from "../modules/requests.js";
import Layout from "./components/Layout.js";

export default function Docs() {
  return Layout(
    createElement(
      "div",
      { class: "docs-page" },
      // Hero Section
      Section(
        { class: "hero" },
        Div(
          { class: "hero-content card" },
          H1({}, "Coming Soon Documentation"),
          P(
            { class: "tagline" },
            "Welcome to the alpha docs for New Framework, a lightweight, dependency-free JavaScript framework. Soon will be available for you to explore and learn."
          )
        )
      )
    )
  );
}
