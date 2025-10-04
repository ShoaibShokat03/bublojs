import Config from "../config/config.js";
import { render } from "./dom.js";
import { A, Div, H1, P, Strong } from "./html.js";
import { requests } from "./requests.js";

const isAuthenticated = () =>
  Config.storage.get(Config.session.userProfile) !== null;
const getUserRole = () =>
  Config.storage.get(Config.session.userRoleKey) || "guest";

const notFound = () =>
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
        "404"
      ),
      P({ style: { fontSize: "1.25rem" } }, "Page not found"),
      A(
        {
          href: requests.url("/"),
          style: {
            marginTop: "1rem",
            color: "#007bff",
            textDecoration: "none",
          },
        },
        "Go Home"
      )
    )
  );

const errorPage = (error) =>
  Div(
    {
      style: {
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8d7da",
      },
    },
    Div(
      { style: { textAlign: "center", color: "#721c24" } },
      H1(
        {
          style: { fontSize: "3rem", fontWeight: "700", marginBottom: "1rem" },
        },
        "Error"
      ),
      P({ style: { fontSize: "1.1rem" } }, error),
      A(
        {
          href: requests.url("/"),
          style: {
            marginTop: "1rem",
            color: "#007bff",
            textDecoration: "none",
          },
        },
        "Go Home"
      )
    )
  );

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
    console.log("[[]] ROUTE [[]]", route);
    window.history.pushState({}, "", newRoute);
    await this.navigate(newRoute);
  },

  async navigate(route) {
    let cleanRoute = route.replace(requests.url(""), "").toLowerCase() || "/";
    Config.appState.clear();
    if (!cleanRoute.startsWith("/")) {
      cleanRoute = "/" + cleanRoute;
    }

    const routeObj = Config.routes[cleanRoute];
    if (!routeObj) {
      setPageProps({ title: "404 - Page Not Found", description: "" });
      return render(notFound, Config.appRoot);
    }

    if (routeObj.auth && !isAuthenticated()) {
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
      render(errorPage(error.message), Config.appRoot);
    }
  },
};
