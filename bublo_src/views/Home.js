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
  Code,
  Pre,
  Input,
} from "../modules/html.js";
import { requests } from "../modules/requests.js";
import Layout from "./components/Layout.js";
import { useState, useEffect } from "../modules/hooks.js";
import Config from "../config/config.js";
import { router } from "../modules/router.js";

export default function Home() {
  const [count, setCount] = useState(0);
  const [features] = useState([
    {
      icon: "⚡",
      title: "Lightning Fast",
      description:
        "Optimized Virtual DOM with efficient diffing algorithms for maximum performance.",
    },
    {
      icon: "🎯",
      title: "React-like Hooks",
      description:
        "Familiar useState, useEffect, useRef, and useMemo hooks for modern development.",
    },
    {
      icon: "🚀",
      title: "Zero Dependencies",
      description:
        "Pure vanilla JavaScript with no external dependencies or build tools required.",
    },
    {
      icon: "📱",
      title: "Responsive Design",
      description:
        "Built-in responsive utilities and modern CSS-in-JS styling system.",
    },
    {
      icon: "🔧",
      title: "Developer Friendly",
      description:
        "Comprehensive tooling, debugging utilities, and TypeScript support.",
    },
    {
      icon: "🌐",
      title: "SEO Ready",
      description:
        "Server-side rendering capabilities and SEO optimization features.",
    },
  ]);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count > 0 ? count - 1 : 0);

  const [range,setRange]=useState(0);

  const handleRange=(e)=>{
    setRange(e.target.value);
  }
  const boxes = Array.from({ length: range }, (_, i) => i + 1);

  return Layout(
    // Hero Section
    Div({style:"margin:20px"},
      Div({},
        Span({},`${range}%`)
      ),
      Div({},
        Input({style:"width:400px;height:40px;cursor:pointer;",type:'range',min:'0',max:'100',value:range,oninput:handleRange},'')
      ),
      Div({style:"width:100%;padding:20px;display:grid;grid-template-columns:repeat(20,1fr);grid-gap:20px;"},
        ...boxes.map((box)=>{
          return Div({style:"width:auto;align-content:center;height:30px;background:red"},box)
        })),
    ),
    Section(
      { class: "hero-section" },
      Div(
        { class: "hero-container" },
        Div(
          { class: "hero-content" },
          H1(
            { class: "hero-title" },
            "Build Modern SPAs with ",
            Span({ class: "gradient-text" }, "Vanilla JavaScript")
          ),
          P(
            { class: "hero-subtitle" },
            "BUBLOJS is a lightweight, fast, and scalable Single Page Application framework that brings React-like features to vanilla JavaScript without the overhead."
          ),
          Div(
            { class: "hero-actions" },
            Button(
              {
                class: "btn btn-primary btn-lg",
                onclick: () => (window.location.href = requests.url("/doc")),
              },
              "Get Started"
            ),
            Button(
              {
                class: "btn btn-outline btn-lg",
                onclick: () => (window.location.href = requests.url("/crud")),
              },
              "View Demo"
            )
          )
        ),
        Div(
          { class: "hero-demo" },
          Div(
            { class: "demo-container" },
            Div(
              { class: "demo-header" },
              H3({ class: "demo-title" }, "Interactive Counter Demo"),
              P({ class: "demo-subtitle" }, "See BUBLOJS hooks in action")
            ),
            Div(
              { class: "counter-demo" },
              Div(
                { class: "counter-display" },
                Span({ class: "counter-value" }, count)
              ),
              Div(
                { class: "counter-controls" },
                Button(
                  {
                    class: "btn btn-primary btn-counter",
                    onclick: increment,
                    "aria-label": "Increment counter"
                  },
                  Span({ class: "btn-icon" }, "+")
                ),
                Button(
                  {
                    class: "btn btn-secondary btn-counter",
                    onclick: decrement,
                    disabled: count === 0,
                    "aria-label": "Decrement counter"
                  },
                  Span({ class: "btn-icon" }, "-")
                )
              )
            ),
          )
        )
      )
    ),

    // Features Section
    Section(
      { class: "features-section" },
      Div(
        { class: "features-container" },
        H2({ class: "section-title" }, "Why Choose BUBLOJS?"),
        P(
          { class: "section-subtitle" },
          "Everything you need to build modern web applications"
        ),
        Div(
          { class: "features-grid" },
          ...features.map((feature) =>
            Div(
              { class: "feature-card" },
              Div({ class: "feature-icon" }, feature.icon),
              H3({ class: "feature-title" }, feature.title),
              P({ class: "feature-description" }, feature.description)
            )
          )
        )
      )
    ),

    // Code Example Section
    Section(
      { class: "code-section" },
      Div(
        { class: "code-container" },
        H2({ class: "section-title" }, "Simple & Powerful"),
        P(
          { class: "section-subtitle" },
          "Write components like you're used to, but with vanilla JavaScript"
        ),
        Div(
          { class: "code-example" },
          Pre(
            { class: "code-block" },
            Code(
              {},
              `// Create a component
import { useState } from "../modules/hooks.js";
import { Div, Button, H1 } from "../modules/html.js";

export default function Counter() {
  const [count, setCount] = useState(0);
  
  return Div(
    {},
    H1({}, \`Count: \${count}\`),
    Button(
      { onclick: () => setCount(count + 1) },
      "Increment"
    )
  );
}`
            )
          )
        )
      )
    ),

    // CTA Section
    Section(
      { class: "cta-section" },
      Div(
        { class: "cta-container" },
        H2({ class: "cta-title" }, "Ready to Get Started?"),
        P(
          { class: "cta-subtitle" },
          "Join thousands of developers building with BUBLOJS"
        ),
        Div(
          { class: "cta-actions" },
          Button(
            {
              class: "btn btn-primary btn-lg",
              onclick: () => (router.go("/doc")),
            },
            "Read Documentation"
          ),
          Button(
            {
              class: "btn btn-outline btn-lg",
              onclick: () => window.open("https://github.com", "_blank"),
            },
            "View on GitHub"
          )
        )
      )
    )
  );
}
