import Config from "../../config/config.js";
import { useState, useEffect } from "../../modules/hooks.js";
import {
    A,
    Div,
    Footer,
    Header,
    Main,
    Nav,
    Button,
    Ul,
    Li,
    Span,
    P,
    H3,
    H4,
    Input,
} from "../../modules/html.js";
import { requests } from "../../modules/requests.js";

function MainLayout(...children) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    function toggleMobileMenu() {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    }


    return Div(
        { class: "layout-container" },
        // Header Section
        Header(
            { class: "header" },
            Div(
                { class: "header-container" },
                // Logo Section
                A(
                    { href: requests.url("/"), class: "logo", "aria-label": "BUBLOJS Home" },
                    Span({ class: "logo-icon", "aria-hidden": "true" }, "🚀"),
                    Span({ class: "logo-text" }, Config.appName)
                ),

                // Navigation Section
                Nav(
                    {
                        class: `nav ${isMobileMenuOpen ? 'mobile-open' : ''}`,
                        role: "navigation",
                        "aria-label": "Main navigation",
                        id: "main-navigation"
                    },
                    A({
                        href: requests.url("/"),
                        class: `nav-link ${window.location.pathname === "/" ? 'active' : ''}`,
                        "aria-current": window.location.pathname === "/" ? "page" : undefined
                    }, "Home"),
                    A({
                        href: requests.url("/about"),
                        class: `nav-link ${window.location.pathname === "/about" ? 'active' : ''}`,
                        "aria-current": window.location.pathname === "/about" ? "page" : undefined
                    }, "About"),
                    A({
                        href: requests.url("/contact"),
                        class: `nav-link ${window.location.pathname === "/contact" ? 'active' : ''}`,
                        "aria-current": window.location.pathname === "/contact" ? "page" : undefined
                    }, "Contact"),
                    A({
                        href: requests.url("/docs"),
                        class: `nav-link ${window.location.pathname === "/docs" ? 'active' : ''}`,
                        "aria-current": window.location.pathname === "/docs" ? "page" : undefined
                    }, "Docs"),
                    A({
                        href: requests.url("/demo"),
                        class: `nav-link btn btn-outline btn-sm ${window.location.pathname === "/demo" ? 'active' : ''}`,
                        "aria-current": window.location.pathname === "/demo" ? "page" : undefined
                    }, "Try Demo")
                ),

                // Header Actions (Desktop)
                Div(
                    { class: "flex gap-2" },
                    Button({ class: "btn btn-ghost btn-sm", "aria-label": "Sign in to your account" }, "Sign In"),
                    Button({ class: "btn btn-primary btn-sm", "aria-label": "Get started with BUBLOJS" }, "Get Started")
                ),

                // Mobile Menu Button
                Button(
                    {
                        class: `btn btn-ghost btn-sm hamburger ${isMobileMenuOpen ? 'active' : ''}`,
                        onclick: toggleMobileMenu,
                        "aria-label": isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu",
                        "aria-expanded": isMobileMenuOpen,
                        "aria-controls": "main-navigation"
                    },
                    Span({ class: "hamburger-icon", "aria-hidden": "true" }, isMobileMenuOpen ? "✕" : "☰")
                )
            )
        ),

        // Main Content Area
        Main({ class: "main" }, ...children),

        // Footer Section
        Footer(
            { class: "footer" },
            Div(
                { class: "container" },
                // Main Footer Content
                Div(
                    { class: "footer-content" },
                    // Brand Section
                    Div(
                        { class: "footer-section" },
                        Div(
                            { class: "flex items-center gap-2 mb-4" },
                            Span({ class: "logo-icon" }, "🚀"),
                            Span({ class: "logo-text" }, Config.appName)
                        ),
                        P(
                            { class: "mb-6 text-left" },
                            "A modern, lightweight JavaScript framework for building fast and responsive web applications. " +
                            "Simple, powerful, and developer-friendly."
                        ),
                        Div(
                            { class: "footer-social" },
                            H3({ class: "footer-section-title mb-4" }, "Follow Us"),
                            Ul(
                                { class: "flex gap-4" },
                                Li(
                                    { class: "social-item" },
                                    A(
                                        {
                                            href: "https://github.com",
                                            class: "footer-link flex items-center gap-2",
                                            target: "_blank",
                                        },
                                        Span({ class: "social-icon" }, "📱"),
                                        Span({ class: "social-name" }, "GitHub")
                                    )
                                ),
                                Li(
                                    { class: "social-item" },
                                    A(
                                        {
                                            href: "https://twitter.com",
                                            class: "footer-link flex items-center gap-2",
                                            target: "_blank",
                                        },
                                        Span({ class: "social-icon" }, "🐦"),
                                        Span({ class: "social-name" }, "Twitter")
                                    )
                                ),
                                Li(
                                    { class: "social-item" },
                                    A(
                                        {
                                            href: "https://discord.com",
                                            class: "footer-link flex items-center gap-2",
                                            target: "_blank",
                                        },
                                        Span({ class: "social-icon" }, "💬"),
                                        Span({ class: "social-name" }, "Discord")
                                    )
                                ),
                                Li(
                                    { class: "social-item" },
                                    A(
                                        {
                                            href: "https://youtube.com",
                                            class: "footer-link flex items-center gap-2",
                                            target: "_blank",
                                        },
                                        Span({ class: "social-icon" }, "📺"),
                                        Span({ class: "social-name" }, "YouTube")
                                    )
                                )
                            )
                        )
                    ),

                    // Quick Links Section
                    Div(
                        { class: "footer-section" },
                        H3({ class: "footer-section-title" }, "Quick Links"),
                        Ul(
                            { class: "footer-links" },
                            Li(
                                { class: "footer-item" },
                                A({ href: "/", class: "footer-link" }, "Home")
                            ),
                            Li(
                                { class: "footer-item" },
                                A({ href: "/about", class: "footer-link" }, "About")
                            ),
                            Li(
                                { class: "footer-item" },
                                A({ href: "/docs", class: "footer-link" }, "Documentation")
                            ),
                            Li(
                                { class: "footer-item" },
                                A({ href: "/demo", class: "footer-link" }, "Live Demo")
                            ),
                            Li(
                                { class: "footer-item" },
                                A({ href: "/contact", class: "footer-link" }, "Contact")
                            )
                        )
                    ),

                    // Resources Section
                    Div(
                        { class: "footer-section" },
                        H3({ class: "footer-section-title" }, "Resources"),
                        Ul(
                            { class: "footer-links" },
                            Li(
                                { class: "footer-item" },
                                A(
                                    { href: "/docs/getting-started", class: "footer-link" },
                                    "Getting Started"
                                )
                            ),
                            Li(
                                { class: "footer-item" },
                                A({ href: "/docs/api", class: "footer-link" }, "API Reference")
                            ),
                            Li(
                                { class: "footer-item" },
                                A({ href: "/docs/examples", class: "footer-link" }, "Examples")
                            ),
                            Li(
                                { class: "footer-item" },
                                A({ href: "/docs/guides", class: "footer-link" }, "Guides")
                            ),
                            Li(
                                { class: "footer-item" },
                                A({ href: "/faq", class: "footer-link" }, "FAQ")
                            )
                        )
                    ),

                    // Community Section
                    Div(
                        { class: "footer-section" },
                        H3({ class: "footer-section-title" }, "Community"),
                        Div(
                            { class: "grid grid-3 gap-4 mb-6" },
                            Div(
                                { class: "text-center" },
                                Span({ class: "text-2xl font-bold block" }, "1.2K"),
                                Span({ class: "text-sm" }, "GitHub Stars")
                            ),
                            Div(
                                { class: "text-center" },
                                Span({ class: "text-2xl font-bold block" }, "500+"),
                                Span({ class: "text-sm" }, "Developers")
                            ),
                            Div(
                                { class: "text-center" },
                                Span({ class: "text-2xl font-bold block" }, "50+"),
                                Span({ class: "text-sm" }, "Contributors")
                            )
                        ),
                        Div(
                            { class: "newsletter" },
                            H4({ class: "footer-section-title" }, "Stay Updated"),
                            P(
                                { class: "mb-4 text-left" },
                                "Get the latest updates, tutorials, and community news delivered to your inbox."
                            ),
                            Div(
                                { class: "form-group" },
                                Div(
                                    { class: "flex gap-2" },
                                    Input({
                                        type: "email",
                                        placeholder: "Enter your email",
                                        class: "form-input",
                                    }),
                                    Button({ class: "btn btn-primary btn-sm" }, "Subscribe")
                                )
                            )
                        )
                    )
                ),

                // Footer Bottom
                Div(
                    { class: "footer-bottom" },
                    Div(
                        { class: "flex justify-between items-center" },
                        P(
                            { class: "copyright" },
                            "© 2024 " + Config.appName + ". Made with ",
                            Span({ class: "heart" }, "❤️"),
                            " by developers, for developers."
                        ),
                        Div(
                            { class: "flex gap-4" },
                            A(
                                { href: "/privacy", class: "footer-link" },
                                "Privacy Policy"
                            ),
                            A(
                                { href: "/terms", class: "footer-link" },
                                "Terms of Service"
                            ),
                            A({ href: "/license", class: "footer-link" }, "License")
                        )
                    )
                )
            )
        )
    );
}

export default MainLayout;
