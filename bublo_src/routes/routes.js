import Config from "../config/config.js";

// Component imports for better organization
const components = {
  // Main Views
  Home: () => import("../views/Home.js"),
  About: () => import("../views/About.js"),
  Contact: () => import("../views/Contact.js"),
  Docs: () => import("../views/Docs.js"),
  Demo: () => import("../views/Demo.js"),
};

const routes = {
  // Public Routes
  "/": {
    title: "Home",
    description: "Welcome to BUBLOJS - A modern vanilla JavaScript SPA framework",
    component: components.Home,
    auth: false,
    category: "main"
  },
  "/about": {
    title: "About",
    description: "Learn about BUBLOJS - A lightweight JavaScript framework with React-like features",
    component: components.About,
    auth: false,
    category: "main"
  },
  "/contact": {
    title: "Contact",
    description: "Get in touch with the BUBLOJS team - Support, feedback, and community",
    component: components.Contact,
    auth: false,
    category: "main"
  },
  "/docs": {
    title: "Documentation",
    description: "BUBLOJS Documentation - Complete guide to building modern web applications",
    component: components.Docs,
    auth: false,
    category: "main"
  },
  "/demo": {
    title: "Demo",
    description: "BUBLOJS Live Demos - Interactive examples showcasing framework capabilities",
    component: components.Demo,
    auth: false,
    category: "main"
  },
};
export default routes;
