import time from "../../modules/time.js";
import { Footer, Div, P, A, Ul, Li } from "../../modules/html.js";
import { requests } from "../../modules/requests.js";
import config from "../../config/config.js";

export default function MainFooter() {
  return Footer(
    { class: "main-footer" },
    Div(
      { class: "footer-content" },
      P({}, `© ${time.year()} ${config.appName}. All rights reserved.`),
      // A({href: "https://bublojs.com/", target: "_blank"}, "Built with BubloJS.")
    )
  );
}
