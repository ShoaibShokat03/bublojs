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
  Span,
  Button,
} from "../modules/html.js";
import { requests } from "../modules/requests.js";
import Layout from "./components/Layout.js";
import Config from "../config/config.js";

export default function About() {
  const features = [
    {
      icon: "⚡",
      title: "Lightning Performance",
      description: "Optimized Virtual DOM with efficient diffing algorithms for maximum speed and responsiveness."
    },
    {
      icon: "🎯",
      title: "React-like Experience",
      description: "Familiar hooks, components, and patterns that developers already know and love."
    },
    {
      icon: "🚀",
      title: "Zero Dependencies",
      description: "Pure vanilla JavaScript with no external dependencies, build tools, or complex setup required."
    },
    {
      icon: "📱",
      title: "Mobile First",
      description: "Built-in responsive design utilities and mobile-optimized performance out of the box."
    },
    {
      icon: "🔧",
      title: "Developer Friendly",
      description: "Comprehensive debugging tools, TypeScript support, and excellent developer experience."
    },
    {
      icon: "🌐",
      title: "SEO Optimized",
      description: "Server-side rendering capabilities and SEO optimization features for better search rankings."
    }
  ];

  const stats = [
    { number: "1.2k+", label: "GitHub Stars" },
    { number: "500+", label: "Active Developers" },
    { number: "50+", label: "Production Apps" },
    { number: "99.9%", label: "Uptime" }
  ];

  return Layout(
    // Hero Section
    Section(
      { class: "about-hero-section" },
      Div(
        { class: "about-hero-container" },
        Div(
          { class: "about-hero-content" },
          H1(
            { class: "about-hero-title" },
            "About ",
            Span({ class: "gradient-text" }, Config.appName)
          ),
          P(
            { class: "about-hero-subtitle" },
            "BUBLOJS is a revolutionary vanilla JavaScript Single Page Application framework that brings React-like features to vanilla JavaScript without the overhead. Built for developers who want modern development patterns with the simplicity and performance of vanilla JavaScript."
          ),
          Div(
            { class: "about-hero-actions" },
            Button(
              {
                class: "btn btn-primary btn-lg",
                onclick: () => window.location.href = requests.url("/doc")
              },
              "Read Documentation"
            ),
            Button(
              {
                class: "btn btn-outline btn-lg",
                onclick: () => window.open("https://github.com/bublojs", "_blank")
              },
              "View on GitHub"
            )
          )
        ),
        Div(
          { class: "about-hero-image" },
          Img({
            src: requests.url("/bublo_src/assets/hadi.jpg"),
            alt: "BUBLOJS Framework Creator",
            class: "creator-image"
          })
        )
      )
    ),

    // Stats Section
    Section(
      { class: "about-stats-section" },
      Div(
        { class: "about-stats-container" },
        ...stats.map(stat =>
          Div(
            { class: "stat-card" },
            Div({ class: "stat-number" }, stat.number),
            Div({ class: "stat-label" }, stat.label)
          )
        )
      )
    ),

    // Mission Section
    Section(
      { class: "about-mission-section" },
      Div(
        { class: "about-mission-container" },
        Div(
          { class: "mission-content" },
          H2({ class: "mission-title" }, "Our Mission"),
          P(
            { class: "mission-description" },
            "We believe that building modern web applications shouldn't require complex build tools, heavy frameworks, or steep learning curves. BUBLOJS was created to bridge the gap between vanilla JavaScript and modern development patterns, giving developers the best of both worlds."
          ),
          P(
            { class: "mission-description" },
            "Our goal is to make web development more accessible, performant, and enjoyable while maintaining the simplicity and power that vanilla JavaScript provides."
          )
        ),
        Div(
          { class: "mission-features" },
          H3({ class: "features-title" }, "Why BUBLOJS?"),
          Ul(
            { class: "mission-list" },
            Li({}, "🚀 Zero build tools or configuration required"),
            Li({}, "⚡ Lightning-fast performance with optimized Virtual DOM"),
            Li({}, "🎯 Familiar React-like hooks and patterns"),
            Li({}, "📱 Built-in responsive design utilities"),
            Li({}, "🔧 Excellent developer experience and debugging tools"),
            Li({}, "🌐 SEO-friendly with server-side rendering support")
          )
        )
      )
    ),

    // Features Grid Section
    Section(
      { class: "about-features-section" },
      Div(
        { class: "about-features-container" },
        H2({ class: "features-section-title" }, "Core Features"),
        P(
          { class: "features-section-subtitle" },
          "Everything you need to build modern, scalable web applications"
        ),
        Div(
          { class: "features-grid" },
          ...features.map(feature =>
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

    // CTA Section
    Section(
      { class: "about-cta-section" },
      Div(
        { class: "about-cta-container" },
        H2({ class: "cta-title" }, "Ready to Get Started?"),
        P(
          { class: "cta-subtitle" },
          "Join thousands of developers building amazing applications with BUBLOJS"
        ),
        Div(
          { class: "cta-actions" },
          Button(
            {
              class: "btn btn-primary btn-lg",
              onclick: () => window.location.href = requests.url("/doc")
            },
            "Get Started"
          ),
          Button(
            {
              class: "btn btn-outline btn-lg",
              onclick: () => window.location.href = requests.url("/crud")
            },
            "Try Demo"
          )
        )
      )
    )
  );
}
