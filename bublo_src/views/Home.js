import { createElement, updateElement } from "../modules/dom.js";
import {
  H1,
  H2,
  H3,
  P,
  Div,
  A,
  Section,
  Ul,
  Li,
  Form,
  Input,
  Button,
  Span,
} from "../modules/html.js";
import { requests } from "../modules/requests.js";
import Layout from "./components/Layout.js";
import { useState } from "../modules/hooks.js";
import Config from "../config/config.js";
import { events } from "../modules/Events.js";

export default function Home() {
  const [count, setCount] = useState(0);

  const increment = () => setCount(count() + 1);
  const decrement = () => setCount(count() > 0 ? count() - 1 : 0);

  const [fruits, setFruits] = useState([]);

  events.onBeforeVirtualDOMMount(() => {
    fetch(`${requests.url("/api/backend/fruits.json")}`)
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        setFruits(data);
        updateElement("#fruits", Ul({},fruits().map((fruit) => Li({},`${fruit.name}`))));
      })
      .catch((error) => console.error(error))                                         
      .finally(() => console.log("Request completed"));
  });

  return Layout(
    Section(
      {},
      Div({ class: "home-page" }, `Welcome to ${Config.appName}!`),
      Div(
        {},
        Div({}, Span({}, "Count: ", `${count()}`)),
        Button({ onClick: increment }, "Increment"),
        Button(
          {
            onClick: decrement,
            style: `${
              count() == 0 ? "background-color:red;" : "background-color:green;"
            }`,
          },
          "Decrement"
        )
      )
    ),
    Section({id: "fruits"},`${fruits().length}`)
  );
}
