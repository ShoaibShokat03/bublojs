import { AddStyle } from "../modules/style.js";
import Loader from "../views/components/Loader.js";
import { render } from "../modules/dom.js";

export default function BeforeLoad() {
  console.log("Before Loading Virtual DOM...");
  render(Loader, document.body); // Append loader to body
  AddStyle([
    {
      selector: ".typing-loading",
      styles: {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      },
    },
  ]);
}
