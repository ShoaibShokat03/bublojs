import { removeElement } from "../modules/dom.js";

export default function AfterLoad() {
  console.log("After Loading Virtual DOM...");
  removeElement("#loader");
}
