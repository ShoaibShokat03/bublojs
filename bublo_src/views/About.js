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
  Img,
} from "../modules/html.js";
import { requests } from "../modules/requests.js";
import Layout from "./components/Layout.js";

export default function About() {
  return Layout(
    createElement(
      "div",
      { class: "about-page" },
      // Hero Section
      Section(
        { class: "hero" },
        Div(
          { class: "hero-content card" },
          H1({}, "About"),
          P(
            { class: "tagline" },
            "This new framework is a brand-new, lightweight JavaScript framework designed to make building fast, modern single-page applications simple and enjoyable. Join us as we start this journey!"
          )
        )
      ),
      Div(
        {},
        Img({
          src: requests.url("/bublo_src/assets/hadi.jpg"),
          alt: "BubloJS Hero Image",
          class: "hero-image",
          width: "100",
        })
      )
    )
  );
}
