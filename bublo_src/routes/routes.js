import Config from "../config/config.js";

const routes = {
  "/": {
    title: "Home",
    description: "Welcome to MyApp - A fast and scalable SPA",
    component: () => import("../views/Home.js"),
    auth: false,
  },
  "/crud": {
    title: "CRUD",
    description: "Welcome to MyApp - A fast and scalable SPA",
    component: () => import("../views/Crud.js"),
    auth: false,
  },
  "/about": {
    title: "About",
    description: "Learn more about MyApp",
    component: () => import("../views/About.js"),
    auth: false,
  },
  "/contact": {
    title: "Contact",
    description: "Get in touch with us",
    component: () => import("../views/Contact.js"),
    auth: false,
  },
  "/doc": {
    title: "Docs",
    description: "Read our documentation",
    component: () => import("../views/Doc.js"),
    auth: false,
  },
  "/faq": {
    title: "FAQ's",
    description: "Read FAQ's",
    component: () => import("../views/Faq.js"),
    auth: false,
  },
};

export default routes;
