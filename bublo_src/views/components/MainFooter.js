import time from "../../modules/time.js";
import { Footer, Div, P, A, Ul, Li, Span, H3 } from "../../modules/html.js";
import { requests } from "../../modules/requests.js";
import Config from "../../config/config.js";

export default function MainFooter() {
  const currentYear = time.year();
  
  const socialLinks = [
    {
      name: "GitHub",
      url: "https://github.com/bublojs",
      icon: "fab fa-github",
      color: "#333"
    },
    {
      name: "Twitter",
      url: "https://twitter.com/bublojs",
      icon: "fab fa-twitter",
      color: "#1DA1F2"
    },
    {
      name: "Discord",
      url: "https://discord.gg/bublojs",
      icon: "fab fa-discord",
      color: "#5865F2"
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com/company/bublojs",
      icon: "fab fa-linkedin",
      color: "#0077B5"
    },
    {
      name: "YouTube",
      url: "https://youtube.com/@bublojs",
      icon: "fab fa-youtube",
      color: "#FF0000"
    }
  ];

  const quickLinks = [
    { name: "Documentation", url: requests.url("/doc") },
    { name: "About", url: requests.url("/about") },
    { name: "FAQ", url: requests.url("/faq") },
    { name: "Contact", url: requests.url("/contact") },
    { name: "Demo", url: requests.url("/crud") }
  ];

  const resources = [
    { name: "Getting Started", url: requests.url("/doc") },
    { name: "API Reference", url: requests.url("/doc") },
    { name: "Examples", url: requests.url("/crud") },
    { name: "GitHub Repository", url: "https://github.com/bublojs", external: true },
    { name: "Report Issues", url: "https://github.com/bublojs/issues", external: true }
  ];

  return Footer(
    { class: "main-footer" },
    Div(
      { class: "footer-container" },
      
      // Main Footer Content
      Div(
        { class: "footer-main" },
        Div(
          { class: "footer-section footer-brand" },
          Div(
            { class: "footer-logo" },
            Span({ class: "logo-icon" }, "🚀"),
            Span({ class: "logo-text" }, Config.appName)
          ),
          P(
            { class: "footer-description" },
            "A modern, lightweight vanilla JavaScript SPA framework that brings React-like features without the overhead. Build fast, scalable applications with zero dependencies."
          ),
          Div(
            { class: "footer-social" },
            H3({ class: "social-title" }, "Follow Us"),
            Ul(
              { class: "social-links" },
              ...socialLinks.map(link =>
                Li(
                  { class: "social-item" },
                  A(
                    {
                      href: link.url,
                      class: "social-link",
                      target: "_blank",
                      rel: "noopener noreferrer",
                      "aria-label": `Follow us on ${link.name}`,
                      style: `--social-color: ${link.color}`
                    },
                    Span({ class: `social-icon ${link.icon}` }),
                    Span({ class: "social-name" }, link.name)
                  )
                )
              )
            )
          )
        ),
        
        Div(
          { class: "footer-section" },
          H3({ class: "footer-title" }, "Quick Links"),
          Ul(
            { class: "footer-links" },
            ...quickLinks.map(link =>
              Li(
                { class: "footer-item" },
                A(
                  {
                    href: link.url,
                    class: "footer-link"
                  },
                  link.name
                )
              )
            )
          )
        ),
        
        Div(
          { class: "footer-section" },
          H3({ class: "footer-title" }, "Resources"),
          Ul(
            { class: "footer-links" },
            ...resources.map(link =>
              Li(
                { class: "footer-item" },
                A(
                  {
                    href: link.url,
                    class: "footer-link",
                    target: link.external ? "_blank" : undefined,
                    rel: link.external ? "noopener noreferrer" : undefined
                  },
                  link.name,
                  link.external ? Span({ class: "external-icon" }, "↗") : ""
                )
              )
            )
          )
        ),
        
        Div(
          { class: "footer-section" },
          H3({ class: "footer-title" }, "Community"),
          Div(
            { class: "community-stats" },
            Div(
              { class: "stat-item" },
              Span({ class: "stat-number" }, "1.2k+"),
              Span({ class: "stat-label" }, "GitHub Stars")
            ),
            Div(
              { class: "stat-item" },
              Span({ class: "stat-number" }, "500+"),
              Span({ class: "stat-label" }, "Developers")
            ),
            Div(
              { class: "stat-item" },
              Span({ class: "stat-number" }, "50+"),
              Span({ class: "stat-label" }, "Projects")
            )
          ),
          Div(
            { class: "newsletter" },
            H3({ class: "newsletter-title" }, "Stay Updated"),
            P({ class: "newsletter-description" }, "Get the latest updates and news about BUBLOJS."),
            A(
              {
                href: "https://github.com/bublojs",
                class: "btn btn-outline btn-sm",
                target: "_blank"
              },
              "Subscribe on GitHub"
            )
          )
        )
      ),
      
      // Footer Bottom
      Div(
        { class: "footer-bottom" },
        Div(
          { class: "footer-bottom-content" },
          P(
            { class: "copyright" },
            `© ${currentYear} ${Config.appName}. All rights reserved. Built with `,
            Span({ class: "heart" }, "❤️"),
            " by the BUBLOJS team."
          ),
          Div(
            { class: "footer-bottom-links" },
            A(
              {
                href: "https://github.com/bublojs/blob/main/LICENSE",
                class: "footer-bottom-link",
                target: "_blank"
              },
              "License"
            ),
            A(
              {
                href: "https://github.com/bublojs/blob/main/PRIVACY.md",
                class: "footer-bottom-link",
                target: "_blank"
              },
              "Privacy"
            ),
            A(
              {
                href: "https://github.com/bublojs/blob/main/CODE_OF_CONDUCT.md",
                class: "footer-bottom-link",
                target: "_blank"
              },
              "Code of Conduct"
            )
          )
        )
      )
    )
  );
}
