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
  Label,
} from "../modules/html.js";
import { requests } from "../modules/requests.js";
import Layout from "./components/Layout.js";
import { useState } from "../modules/hooks.js";
import { Style } from "../modules/style.js";
import Demo from "./Demo.js";

export default function Crud() {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({ id: "", name: "", email: "" });
  const [isEditing, setIsEditing] = useState(false);

  function add(e) {
    e.preventDefault();
    if (isEditing) {
      e.target.reset();
      setData(
        data.map((item) =>
          item.id === formData.id ? { ...item, ...formData } : item
        )
      );
      setFormData({ id: "", name: "", email: "" });
      setIsEditing(false);
    } else {
      const newId = Math.random().toString(36).substr(2, 9);
      setFormData({ ...formData, id: newId });
      data.push(formData);
      setFormData({ id: "", name: "", email: "" });
      e.target.reset();
      setData(data);
    }
  }
  
  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  return Layout(
    // Hero Section
    Section(
      { class: "page-hero" },
      Div(
        { class: "page-hero-container" },
        H1(
          { class: "page-title" },
          "CRUD ",
          Span({ class: "gradient-text" }, "Demo")
        ),
        P(
          { class: "page-subtitle" },
          "Experience BUBLOJS in action with this interactive Create, Read, Update, Delete example. See how easy it is to build dynamic applications with our framework."
        ),
        Div(
          { class: "page-actions" },
          Button(
            {
              class: "btn btn-primary btn-lg",
              onclick: () => window.location.href = requests.url("/demo")
            },
            "View More Demos"
          ),
          Button(
            {
              class: "btn btn-outline btn-lg",
              onclick: () => window.open("https://github.com/bublojs", "_blank")
            },
            "View Source"
          )
        )
      )
    ),

    // Demo Section
    Demo(),

    // CRUD Section
    Section(
      { class: "crud-section" },
      Div(
        { class: "crud-container" },
        
        // Form Section
        Div(
          { class: "crud-form" },
          H2({ class: "crud-form-title" }, isEditing ? "Edit User" : "Add New User"),
          Form(
            { onsubmit: add },
            Div(
              { class: "crud-form-row" },
              Div(
                { class: "crud-form-group" },
                Label({ for: "name" }, "Name"),
                Input({
                  type: "text",
                  id: "name",
                  name: "name",
                  value: formData.name,
                  placeholder: "Enter name",
                  oninput: handleInputChange,
                  required: true
                })
              ),
              Div(
                { class: "crud-form-group" },
                Label({ for: "email" }, "Email"),
                Input({
                  type: "email",
                  id: "email",
                  name: "email",
                  value: formData.email,
                  placeholder: "Enter email",
                  oninput: handleInputChange,
                  required: true
                })
              )
            ),
            Div(
              { class: "form-actions" },
              Button(
                { type: "submit", class: "btn btn-primary" },
                isEditing ? "Update User" : "Add User"
              ),
              isEditing && Button(
                {
                  type: "button",
                  class: "btn btn-secondary",
                  onclick: () => {
                    setFormData({ id: "", name: "", email: "" });
                    setIsEditing(false);
                  }
                },
                "Cancel"
              )
            )
          )
        ),

        // List Section
        Div(
          { class: "crud-list" },
          H2({ class: "crud-list-title" }, "Users List"),
          data.length === 0 ? 
            Div({ class: "crud-empty" }, "No users added yet. Add your first user above!") :
            data.map((item) => 
              Div(
                { class: "crud-item" },
                Div(
                  { class: "crud-item-info" },
                  Div({ class: "crud-item-field" }, item.name),
                  Div({ class: "crud-item-field" }, item.email)
                ),
                Div(
                  { class: "crud-item-actions" },
                  Button(
                    {
                      class: "btn btn-outline btn-sm",
                      onclick: () => {
                        setFormData(item);
                        setIsEditing(true);
                      },
                    },
                    "Edit"
                  ),
                  Button(
                    {
                      class: "btn btn-secondary btn-sm",
                      onclick: () => {
                        setData(data.filter((i) => i.id !== item.id));
                      },
                    },
                    "Delete"
                  )
                )
              )
            )
        )
      )
    )
  );
}

