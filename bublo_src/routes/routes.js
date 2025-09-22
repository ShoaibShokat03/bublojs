import Config from "../config/config.js";

// Component imports for better organization
const components = {
  // Main Views
  Home: () => import("../views/Home.js"),
  Crud: () => import("../views/Crud.js"),
  About: () => import("../views/About.js"),
  Contact: () => import("../views/Contact.js"),
  Doc: () => import("../views/Doc.js"),
  Faq: () => import("../views/Faq.js"),
  
  // Layout Components
  Layout: () => import("../views/components/Layout.js"),
  MainHeader: () => import("../views/components/MainHeader.js"),
  MainFooter: () => import("../views/components/MainFooter.js"),
  Loader: () => import("../views/components/Loader.js"),
};

const routes = {
  // Public Routes
  "/": {
    title: "Home",
    description: "Welcome to BUBLOJS - A modern vanilla JavaScript SPA framework",
    component: components.Home,
    auth: false,
    category: "main",
  },
  "/about": {
    title: "About",
    description: "Learn more about BUBLOJS framework and its features",
    component: components.About,
    auth: false,
    category: "main",
  },
  "/doc": {
    title: "Documentation",
    description: "Complete documentation for BUBLOJS framework",
    component: components.Doc,
    auth: false,
    category: "main",
  },
  "/faq": {
    title: "FAQ",
    description: "Frequently Asked Questions about BUBLOJS",
    component: components.Faq,
    auth: false,
    category: "main",
  },
  
  // Demo Routes
  "/crud": {
    title: "CRUD Demo",
    description: "Interactive CRUD operations demo using BUBLOJS",
    component: components.Crud,
    auth: false,
    category: "demo",
  },
  
  // Protected Routes
  "/contact": {
    title: "Contact",
    description: "Get in touch with the BUBLOJS team",
    component: components.Contact,
    auth: true,
    category: "contact",
  },
  
  // Component Routes (for testing/development)
  "/components/layout": {
    title: "Layout Component",
    description: "Layout component demo",
    component: components.Layout,
    auth: false,
    category: "components",
    hidden: true, // Hidden from main navigation
  },
  "/components/header": {
    title: "Header Component",
    description: "Header component demo",
    component: components.MainHeader,
    auth: false,
    category: "components",
    hidden: true,
  },
  "/components/footer": {
    title: "Footer Component",
    description: "Footer component demo",
    component: components.MainFooter,
    auth: false,
    category: "components",
    hidden: true,
  },
  "/components/loader": {
    title: "Loader Component",
    description: "Loader component demo",
    component: components.Loader,
    auth: false,
    category: "components",
    hidden: true,
  },
};

// Route utility functions
export const routeUtils = {
  // Get all routes by category
  getRoutesByCategory: (category) => {
    return Object.entries(routes)
      .filter(([path, config]) => config.category === category)
      .reduce((acc, [path, config]) => {
        acc[path] = config;
        return acc;
      }, {});
  },

  // Get visible routes (not hidden)
  getVisibleRoutes: () => {
    return Object.entries(routes)
      .filter(([path, config]) => !config.hidden)
      .reduce((acc, [path, config]) => {
        acc[path] = config;
        return acc;
      }, {});
  },

  // Get public routes (no auth required)
  getPublicRoutes: () => {
    return Object.entries(routes)
      .filter(([path, config]) => !config.auth)
      .reduce((acc, [path, config]) => {
        acc[path] = config;
        return acc;
      }, {});
  },

  // Get protected routes (auth required)
  getProtectedRoutes: () => {
    return Object.entries(routes)
      .filter(([path, config]) => config.auth)
      .reduce((acc, [path, config]) => {
        acc[path] = config;
        return acc;
      }, {});
  },

  // Get route by path
  getRoute: (path) => {
    return routes[path] || null;
  },

  // Check if route exists
  routeExists: (path) => {
    return path in routes;
  },

  // Get navigation items for header
  getNavigationItems: () => {
    return Object.entries(routes)
      .filter(([path, config]) => !config.hidden && config.category === 'main')
      .map(([path, config]) => ({
        path,
        title: config.title,
        description: config.description,
        auth: config.auth
      }));
  }
};

// Export components for direct access
export { components };

export default routes;
