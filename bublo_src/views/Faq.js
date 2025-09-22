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
  Input,
  Textarea,
  H4,
} from "../modules/html.js";
import { requests } from "../modules/requests.js";
import Layout from "./components/Layout.js";
import { useState, useEffect } from "../modules/hooks.js";
import Config from "../config/config.js";

export default function FAQ() {
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "What is BUBLOJS and how is it different from React?",
      answer: "BUBLOJS is a vanilla JavaScript SPA framework that brings React-like features (hooks, components, Virtual DOM) to vanilla JavaScript without the overhead of build tools or external dependencies. Unlike React, BUBLOJS works directly in the browser without compilation, making it perfect for rapid prototyping and lightweight applications."
    },
    {
      id: 2,
      question: "Do I need to learn a new syntax or build tools?",
      answer: "No! BUBLOJS uses familiar JavaScript patterns and React-like hooks (useState, useEffect, useRef, useMemo). There are no build tools, webpack, or complex configuration required. You can start coding immediately with just vanilla JavaScript."
    },
    {
      id: 3,
      question: "How does the Virtual DOM work in BUBLOJS?",
      answer: "BUBLOJS implements an efficient Virtual DOM that creates a lightweight representation of your UI in memory. When state changes, it compares the new Virtual DOM with the previous one and only updates the actual DOM elements that have changed, resulting in optimal performance."
    },
    {
      id: 4,
      question: "Can I use BUBLOJS with TypeScript?",
      answer: "Yes! BUBLOJS has excellent TypeScript support. You can write your components in TypeScript and get full type checking, IntelliSense, and all the benefits of TypeScript while using BUBLOJS."
    },
    {
      id: 5,
      question: "Is BUBLOJS suitable for large-scale applications?",
      answer: "Absolutely! BUBLOJS is designed to scale from small prototypes to large enterprise applications. It includes features like code splitting, lazy loading, state management, and performance optimizations to handle complex applications efficiently."
    },
    {
      id: 6,
      question: "How does routing work in BUBLOJS?",
      answer: "BUBLOJS includes a powerful client-side router with features like nested routes, route guards, authentication, and role-based access control. It uses the History API for clean URLs and supports both programmatic and declarative navigation."
    },
    {
      id: 7,
      question: "What about SEO and server-side rendering?",
      answer: "BUBLOJS supports server-side rendering (SSR) for SEO optimization. You can pre-render your components on the server and hydrate them on the client, ensuring your content is crawlable by search engines while maintaining the SPA experience."
    },
    {
      id: 8,
      question: "How do I handle state management in BUBLOJS?",
      answer: "BUBLOJS provides multiple state management options: local component state with hooks, global app state, and component state management. You can also integrate with external state management libraries if needed."
    }
  ];



  const toggleFaq = (id) => {
    setActiveFaq(activeFaq === id ? null : id);
  };

  return Layout(
      // Hero Section
      Section(
      { class: "faq-hero-section" },
      Div(
        { class: "faq-hero-container" },
        H1(
          { class: "faq-hero-title" },
          "Frequently Asked Questions"
        ),
        P(
          { class: "faq-hero-subtitle" },
          "Got questions about BUBLOJS? Find answers below or ask our AI assistant for help!"
        )
      )
    ),

    // FAQ Section
    Section(
      { class: "faq-section" },
      Div(
        { class: "faq-container" },
        Div(
          { class: "faq-content" },
          H2({ class: "faq-section-title" }, "Common Questions"),
          Div(
            { class: "faq-list" },
            ...faqs.map(faq =>
              Div(
                { class: `faq-item ${activeFaq === faq.id ? 'active' : ''}` },
                Button(
                  {
                    class: "faq-question",
                    onclick: () => toggleFaq(faq.id)
                  },
                  Span({ class: "faq-question-text" }, faq.question),
                  Span({ class: "faq-icon" }, activeFaq === faq.id ? "−" : "+")
                ),
                Div(
                  { class: "faq-answer" },
                  P({}, faq.answer)
                )
              )
            )
          )
        ),
      )
    ),

    // Contact Section
    Section(
      { class: "faq-contact-section" },
      Div(
        { class: "faq-contact-container" },
        H2({ class: "contact-title" }, "Still Have Questions?"),
        P(
          { class: "contact-subtitle" },
          "Can't find the answer you're looking for? We're here to help!"
        ),
        Div(
          { class: "contact-actions" },
          Button(
            {
              class: "btn btn-primary btn-lg",
              onclick: () => window.location.href = requests.url("/contact")
            },
            "Contact Us"
          ),
          Button(
            {
              class: "btn btn-outline btn-lg",
              onclick: () => window.open("https://github.com/bublojs/issues", "_blank")
            },
            "Report an Issue"
          )
        )
      )
    ),

  );
}
