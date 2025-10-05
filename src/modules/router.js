import Config from "../config/config.js";
import { render } from "./dom.js";
import { A, Button, Div, H1, P, Strong } from "./html.js";
import { requests } from "./requests.js";

const isAuthenticated = () =>
  Config.storage.get(Config.session.userProfile) !== null;
const getUserRole = () =>
  Config.storage.get(Config.session.userRoleKey) || "guest";

const notFound = () => {
  return Div(
    {
      style: "width: 100%; height: 100vh; display: flex; justify-content: center; align-items: center; background-color: #f8f9fa;"
    },
    Div(
      { style: "text-align: center; color: #343a40;" },
      H1(
        {
          style: "font-size: 3rem; font-weight: 700; margin-bottom: 1rem;",
        },
        "404"
      ),
      P({ style: "font-size: 1.1rem;" }, "Page not found"),
      A(
        {
          href: requests.url("/"),
          style: " margin-top: 1rem; color: #007bff; text-decoration: none;",
        },
        "Go Home"
      )
    )
  );
}

const errorPage = (error) => {
  return Div(
    {
      style: "width: 100%, height: 100vh, display: flex, justifyContent: center, alignItems: center, backgroundColor: '#f8f9fa'",
    },
    Div(
      { style: "text-align: center; color: #721c24;" },
      H1(
        {
          style: "font-size: 3rem; font-weight: 700; margin-bottom: 1rem;",
        },
        "Error"
      ),
      P({ style: "font-size: 1.1rem;" }, error),
      Button(
        {
          onclick: () => router.go("/"),
          style: " margin-top: 1rem; color: #007bff; text-decoration: none;",
        },
        "Go Home"
      )
    )
  );
}

const unauthorized = () =>
  Div(
    {
      style: {
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8f9fa",
      },
    },
    Div(
      { style: { textAlign: "center", color: "#343a40" } },
      H1(
        {
          style: { fontSize: "3rem", fontWeight: "700", marginBottom: "1rem" },
        },
        "Unauthorized"
      ),
      P(
        { style: { fontSize: "1.1rem" } },
        "You don’t have permission to access this page."
      ),
      A(
        {
          href: requests.url("/login"),
          style: {
            marginTop: "1rem",
            color: "#007bff",
            textDecoration: "none",
          },
        },
        "Login"
      )
    )
  );

function setPageProps(routeObj) {
  document.title = `${routeObj.title} - ${Config.appName}`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.content = routeObj.description || "";
}

export const router = {
  async go(route) {
    const newRoute = route.includes(requests.url(""))
      ? route
      : requests.url(route);
    window.history.pushState({}, "", newRoute);
    console.log("Pushed to history:", newRoute);
    await this.navigate(newRoute);
  },

  async navigate(route) {
    let cleanRoute = route.replace(requests.url(""), "").toLowerCase() || "/";
    Config.appState.clear();

    if (cleanRoute.endsWith("/") && cleanRoute.length > 1) {
      cleanRoute = "/" + cleanRoute.slice(0, -1);
    }
    if (!cleanRoute.startsWith("/")) {
      cleanRoute = "/" + cleanRoute;
    }

    const routeObj = Config.routes[cleanRoute];
    if (!routeObj) {
      setPageProps({ title: "404 - Page Not Found", description: "" });
      return render(notFound, Config.appRoot);
    }

    if (routeObj.auth && !isAuthenticated()) {
      Config.appRoot.innerHTML = "";
      return this.go("/login");
    }

    if (routeObj.role && getUserRole() !== routeObj.role) {
      return render(unauthorized, Config.appRoot);
    }

    try {
      setPageProps(routeObj);
      const module = await routeObj.component();
      if (Config.componentState.has("component-state")) {
        Config.componentState.delete("component-state");
      }
      Config.componentState.set("component-state", module.default);
      render(module.default, Config.appRoot);
    } catch (error) {
      console.error("Error loading route:", error);
      setPageProps({ title: "Error", description: "" });
      Config.appRoot.innerHTML = "";
      render(errorPage(error.message), Config.appRoot);
    }
  },
};
