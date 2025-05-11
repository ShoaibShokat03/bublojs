import { createElement } from "../modules/dom.js";
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
  Br,
  B,
} from "../modules/html.js";
import { requests } from "../modules/requests.js";
import Layout from "./components/Layout.js";
import { useState } from "../modules/hooks.js";
import { Style } from "../modules/style.js";

export default function Crud() {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({ id: "", name: "", email: "" });
  const [isEditing, setIsEditing] = useState(false);

  function add(e) {
    e.preventDefault();
    if (isEditing()) {
      e.target.reset();
      setData(
        data().map((item) =>
          item.id === formData().id ? { ...item, ...formData() } : item
        )
      );
      setFormData({ id: "", name: "", email: "" });
      setIsEditing(false);
    } else {
      const newId = Math.random().toString(36).substr(2, 9);
      setFormData({ ...formData(), id: newId });
      data().push(formData());
      setFormData({ id: "", name: "", email: "" });
      e.target.reset();
      setData(data());
    }
  }
  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormData({ ...formData(), [name]: value });
  }

  return Layout(
    Section(
      {},
      Div(
        {},
        H1({}, "CRUD Example"),
        P({}, "This is a simple CRUD example using Vanilla JavaScript Framework.")
      ),
      Div(
        {},
        Div(
          {},
          Form(
            { onsubmit: add },
            Input({
              type: "text",
              name: "name",
              value: formData().name,
              placeholder: "Name",
              oninput: handleInputChange,
            }),
            Input({
              type: "text",
              name: "email",
              value: formData().email,
              placeholder: "Email",
              oninput: handleInputChange,
            }),
            Button({ type: "submit" }, "Add")
          )
        ),
        Br(),
        Div(
          {},
          ...data().map((item) => {
            return Div(
              {},
              Span({}, item.name),
              Span({}, " | "),
              Span({}, item.email),
              Span({}, " | "),
              Button(
                {
                  onclick: () => {
                    setFormData(item);
                    setIsEditing(true);
                  },
                },
                "Edit"
              ),
              Button(
                {
                  onclick: () => {
                    setData(data().filter((i) => i.id !== item.id));
                  },
                },
                "Delete"
              )
            );
          })
        )
      )
    )
  );
}

Style(`
  
  input {
    margin: 5px;
    padding: 5px;
  }

  `);
