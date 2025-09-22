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
    // Hero Section
    Section(
      { class: "page-hero" },
      Div(
        { class: "page-hero-container" },
        H1(
          { class: "page-title" },
          "Contact ",
          Span({ class: "gradient-text" }, "BUBLOJS")
        ),
        P(
          { class: "page-subtitle" },
          "Have questions about BUBLOJS? Want to contribute or report an issue? We'd love to hear from you!"
        ),
        Div(
          { class: "page-actions" },
          Button(
            {
              class: "btn btn-primary btn-lg",
              onclick: () => window.open("https://github.com/bublojs/issues", "_blank")
            },
            "Report Issue"
          ),
          Button(
            {
              class: "btn btn-outline btn-lg",
              onclick: () => window.open("https://github.com/bublojs", "_blank")
            },
            "GitHub"
          )
        )
      )
    ),

    // Contact Form Section
    Section(
      { class: "form-section" },
      Div(
        { class: "form-container" },
        Div(
          { class: "form-card" },
          H2({ class: "form-title" }, "Send Us a Message"),
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
            Div(
              { class: "form-actions" },
              Button({ type: "submit", class: "btn btn-primary btn-lg" }, "Send Message")
            )
          )
        )
      )
    )
  );
}
