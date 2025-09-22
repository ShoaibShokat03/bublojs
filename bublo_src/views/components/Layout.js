import { Div, Main } from "../../modules/html.js";
import MainHeader from "./MainHeader.js";
import MainFooter from "./MainFooter.js";
import Ai from "./Ai.js";

export default function Layout(...children) {
  return Div(
    { class: "layout-container" },
    MainHeader(),
    Main({}, ...children),
    MainFooter(),
    Ai()
  );
}
