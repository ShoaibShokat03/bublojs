import { createElement } from "../modules/dom.js";
import {
  H1,
  H2,
  H3,
  P,
  Div,
  A,
  Section,
  Form,
  Label,
  Input,
  Textarea,
  Button,
  Ul,
  Li,
  Span,
} from "../modules/html.js";
import { requests } from "../modules/requests.js";
import Layout from "./components/Layout.js";

export default function Contact() {
  return Layout(
    createElement(
      "div",
      { class: "contact-page" },
      // Hero Section

      // Contact Form Section
      Section(
        { class: "contact-form-section" },
        Div(
          { class: "contact-form card" },
          H2({}, "Send Us a Message"),
          Form(
            {
              class: "form",
              onsubmit: (e) => {
                e.preventDefault();
                const formData = {
                  name: e.target.name.value,
                  email: e.target.email.value,
                  message: e.target.message.value,
                };
                // Placeholder for backend integration
                console.log("Form submitted:", formData);
                // Optional: requests.post("/api/contact", formData);
                e.target.reset();
              },
            },
            Div(
              { class: "form-group" },
              Label({ for: "name" }, "Name"),
              Input({
                type: "text",
                id: "name",
                name: "name",
                placeholder: "Your name",
                required: true,
                class: "input",
              })
            ),
            Div(
              { class: "form-group" },
              Label({ for: "email" }, "Email"),
              Input({
                type: "email",
                id: "email",
                name: "email",
                placeholder: "your.email@example.com",
                required: true,
                class: "input",
              })
            ),
            Div(
              { class: "form-group" },
              Label({ for: "message" }, "Message"),
              Textarea({
                id: "message",
                name: "message",
                placeholder: "Your feedback or question",
                required: true,
                class: "textarea",
              })
            ),
            Button({ type: "submit", class: "btn btn-primary" }, "Send Message")
          )
        )
      )
    )
  );
}
