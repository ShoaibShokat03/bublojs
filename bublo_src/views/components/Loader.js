import { Div } from "../../modules/html.js";

export default function Loader() {
  return Div(
    { id: "loader", class: "page-loader" },
    Div({ class: "loading-container" }, "Loading...")
  );
}
