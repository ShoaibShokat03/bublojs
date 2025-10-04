import Config from "../config/config.js";
import { render } from "../modules/dom.js";
import { Div, P } from "../modules/html.js";

export default function BeforeLoad() {
  console.log("Before Loading Virtual DOM...");

  const loader = () => {
    return Div({ class: "loader" }, P({}, "BUBLOJS Loading..."));
  };

  render(loader,Config.appRoot);
}
