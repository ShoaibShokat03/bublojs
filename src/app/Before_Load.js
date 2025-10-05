import Config from "../config/config.js";
import { render } from "../modules/dom.js";
import { Div, P, Span } from "../modules/html.js";

export default function BeforeLoad() {
  console.log("Before Loading Virtual DOM...");

  const loader = () => {
    return Div(
      { class: "loader" },
      Div(
        { class: "loader-content" },
        
        // Brand Section
        Div(
          { class: "loader-brand" },
          Span({ class: "loader-brand-icon" }, "🚀"),
          Span({ class: "loader-brand-text" }, Config.appName)
        ),
        
        // Spinner
        Div({ class: "loader-spinner" }, ""),
        
        // Loading Text
        P({ class: "loader-text" }, "Loading"),
        P({ class: "loader-subtitle" }, "Please wait while we prepare your dashboard..."),
        
        // Progress Bar
        Div(
          { class: "loader-progress" },
          Div({ class: "loader-progress-bar" }, "")
        )
      )
    );
  };

  render(loader, Config.appRoot);
}
