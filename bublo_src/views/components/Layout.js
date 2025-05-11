import { Div, Main } from "../../modules/html.js";
import MainHeader from "./MainHeader.js";
import MainFooter from "./MainFooter.js";

export default function Layout(...children) {
  return Div({ class: "" }, MainHeader(), Main({}, ...children), MainFooter());
}
