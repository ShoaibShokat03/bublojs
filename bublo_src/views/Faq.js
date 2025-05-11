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
  Button,
  Span,
} from "../modules/html.js";
import { requests } from "../modules/requests.js";
import Layout from "./components/Layout.js";
import { useState } from "../modules/hooks.js";

export default function FAQ() {
  return Layout(
    createElement(
      "div",
      { class: "faq-page" },
      // Hero Section
      Section(
        { class: "hero" },
        Div(
          { class: "hero-content card" },
          H1({}, "FAQ"),
          P(
            { class: "tagline" },
            "Got questions about our new JavaScript framework? Find answers below or reach out to help shape web dev future."
          )
        )
      )
    )
  );
}
