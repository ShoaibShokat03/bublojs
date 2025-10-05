import {
  Div,
  H1,
  H2,
  H3,
  P,
  Button,
  Span,
  A,
  Section,
  Input,
  Textarea,
  Label,
  Form,
} from "../modules/html.js";
import { useState } from "../modules/hooks.js";
import { requests } from "../modules/requests.js";
import MainLayout from "./components/MainLayout.js";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    type: "general"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("");

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "", type: "general" });
    }, 2000);
  };

  const contactInfo = [
    {
      icon: "📧",
      title: "Email Us",
      description: "Send us an email and we'll respond within 24 hours",
      value: "hello@bublojs.com",
      action: "mailto:hello@bublojs.com"
    },
    {
      icon: "💬",
      title: "Discord Community",
      description: "Join our Discord server for real-time discussions",
      value: "Join Discord",
      action: "https://discord.gg/bublojs",
      target: "_blank"
    },
    {
      icon: "🐙",
      title: "GitHub",
      description: "Report issues, request features, or contribute",
      value: "GitHub Issues",
      action: "https://github.com/bublojs/bublojs/issues",
      target: "_blank"
    }
  ];

  const faqItems = [
    {
      question: "How do I get started with BUBLOJS?",
      answer: "Check out our documentation and try the interactive demo. You can start building immediately with just vanilla JavaScript!"
    },
    {
      question: "Is BUBLOJS suitable for large applications?",
      answer: "Absolutely! BUBLOJS is designed to scale from simple prototypes to complex, production-ready applications."
    },
    {
      question: "How does BUBLOJS compare to React?",
      answer: "BUBLOJS provides React-like features (hooks, components, Virtual DOM) but without the build tools or JSX complexity."
    },
    {
      question: "Can I contribute to BUBLOJS?",
      answer: "Yes! We welcome contributions. Check our GitHub repository for contribution guidelines and open issues."
    }
  ];

  return MainLayout(
    // Hero Section
    Section(
      { class: "section" },
      Div(
        { class: "container" },
        Div(
          { class: "text-center mb-16" },
          H1(
            { class: "text-5xl font-bold mb-6" },
            "Get in ",
            Span({ class: "heading-gradient-purple-pink" }, "Touch")
          ),
          P(
            { class: "text-xl text-secondary max-w-3xl mx-auto" },
            "Have questions about BUBLOJS? Need help with your project? We're here to help you succeed."
          )
        )
      )
    ),

    // Contact Methods Section
    Section(
      { class: "section bg-neutral-50" },
      Div(
        { class: "container" },
        Div(
          { class: "text-center mb-16" },
          H2(
            { class: "text-4xl font-bold mb-6" },
            "Contact Methods"
          ),
          P(
            { class: "text-xl text-secondary max-w-2xl mx-auto" },
            "Choose the way that works best for you."
          )
        ),

        Div(
          { class: "grid grid-3 gap-8" },
          ...contactInfo.map(item =>
            Div(
              { class: "card text-center" },
              Div(
                { class: "text-5xl mb-4" },
                item.icon
              ),
              H3(
                { class: "text-2xl font-bold mb-4" },
                item.title
              ),
              P(
                { class: "text-secondary mb-6" },
                item.description
              ),
              A(
                {
                  href: item.action,
                  class: "btn btn-outline",
                  target: item.target || (item.action.startsWith("http") ? "_blank" : undefined)
                },
                item.value
              )
            )
          )
        )
      )
    ),

    // Contact Form Section
    Section(
      { class: "section" },
      Div(
        { class: "container" },
        Div(
          { class: "max-w-2xl mx-auto" },
          Div(
            { class: "text-center mb-12" },
            H2(
              { class: "text-4xl font-bold mb-6" },
              "Send us a Message"
            ),
            P(
              { class: "text-xl text-secondary" },
              "Fill out the form below and we'll get back to you as soon as possible."
            )
          ),

          // Contact Form
          Div(
            { class: "card" },
            Form(
              { 
                class: "space-y-6",
                onsubmit: handleSubmit
              },

            // Name Field
            Div(
              { class: "form-group" },
                Label(
                  { class: "form-label" },
                  "Full Name"
                ),
              Input({
                type: "text",
                  class: "form-input",
                placeholder: "Your full name",
                value: formData.name,
                  onchange: (e) => updateFormData("name", e.target.value),
                  required: true
              })
            ),

            // Email Field
            Div(
              { class: "form-group" },
                Label(
                  { class: "form-label" },
                  "Email Address"
                ),
              Input({
                type: "email",
                  class: "form-input",
                  placeholder: "your@email.com",
                value: formData.email,
                  onchange: (e) => updateFormData("email", e.target.value),
                  required: true
              })
            ),

            // Subject Field
            Div(
              { class: "form-group" },
                Label(
                  { class: "form-label" },
                  "Subject"
                ),
              Input({
                type: "text",
                  class: "form-input",
                  placeholder: "What's this about?",
                value: formData.subject,
                  onchange: (e) => updateFormData("subject", e.target.value),
                  required: true
              })
            ),

            // Message Field
            Div(
              { class: "form-group" },
                Label(
                  { class: "form-label" },
                  "Message"
                ),
              Textarea({
                  class: "form-textarea",
                  placeholder: "Tell us more about your question or project...",
                value: formData.message,
                  onchange: (e) => updateFormData("message", e.target.value),
                  required: true
              })
            ),

            // Submit Button
            Div(
                { class: "form-group" },
              Button(
                {
                    type: "submit",
                    class: `btn btn-gradient btn-lg w-full ${isSubmitting ? "opacity-50" : ""}`,
                    disabled: isSubmitting
                  },
                isSubmitting ? "Sending..." : "Send Message"
              )
            ),

            // Success Message
              submitStatus === "success" && Div(
                { class: "p-4 bg-success text-white rounded-lg text-center" },
                P({ class: "font-medium" }, "Message sent successfully! We'll get back to you soon.")
              )
            )
          )
        )
      )
    ),

    // FAQ Section
    Section(
      { class: "section bg-neutral-50" },
      Div(
        { class: "container" },
        Div(
          { class: "text-center mb-16" },
          H2(
            { class: "text-4xl font-bold mb-6" },
            "Frequently Asked Questions"
          ),
          P(
            { class: "text-xl text-secondary max-w-2xl mx-auto" },
            "Quick answers to common questions about BUBLOJS."
          )
        ),

        Div(
          { class: "max-w-3xl mx-auto" },
          ...faqItems.map((item, index) =>
            Div(
              { class: "card mb-4" },
              Button(
                {
                  class: "w-full text-left p-6 bg-transparent border-none cursor-pointer",
                  onclick: () => setSubmitStatus(submitStatus === `faq-${index}` ? "" : `faq-${index}`)
                },
                Div(
                  { class: "flex justify-between items-center" },
                  H3(
                    { class: "text-xl font-bold" },
                    item.question
                  ),
                Span(
                    { class: "text-2xl" },
                    submitStatus === `faq-${index}` ? "−" : "+"
                  )
                )
              ),
              submitStatus === `faq-${index}` && Div(
                { class: "px-6 pb-6" },
                P(
                  { class: "text-secondary" },
                  item.answer
                )
              )
            )
          )
        )
      )
    )
  );
}

export default Contact;