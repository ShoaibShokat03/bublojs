import { createElement } from "../modules/dom.js";
import {
  H1, H2, H3, H4, P, Div, A, Section, Ul, Li, Code, Pre, Button, Span, Strong, Em, Input, Form, Label, Textarea, Select
} from "../modules/html.js";
import { requests } from "../modules/requests.js";
import Layout from "./components/Layout.js";
import { useState, useEffect, useRef } from "../modules/hooks.js";

export default function Demo() {
  const [activeSection, setActiveSection] = useState("rendering");
  const [count, setCount] = useState(0);
  const [range, setRange] = useState(0);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [todos, setTodos] = useState([
    { id: 1, text: "Learn BUBLOJS", completed: false },
    { id: 2, text: "Build an app", completed: true },
    { id: 3, text: "Deploy to production", completed: false }
  ]);
  const [newTodo, setNewTodo] = useState("");
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const inputRef = useRef(null);

  const sections = [
    { id: "rendering", title: "Rendering Speed", icon: "⚡" },
    { id: "hooks", title: "React Hooks", icon: "🎣" },
    { id: "forms", title: "Form Handling", icon: "📝" },
    { id: "todos", title: "Todo List", icon: "✅" },
    { id: "timers", title: "Timers & Effects", icon: "⏱️" },
    { id: "dom-refs", title: "DOM References", icon: "🔗" }
  ];

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTimer(timer + 1);
        console.log(timer);
      }, 1000);
    } else if (!isRunning && timer !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, timer]);

  const handleRange = (e) => {
    setRange(e.target.value);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    alert(`Form submitted: ${JSON.stringify(formData, null, 2)}`);
    setFormData({ name: "", email: "", message: "" });
  };

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { 
        id: Date.now(), 
        text: newTodo, 
        completed: false 
      }]);
      setNewTodo("");
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const boxes = Array.from({ length: range }, (_, i) => i + 1);

  const renderContent = () => {
    switch(activeSection) {
      case "rendering":
        return (
          Div(
            { class: "demo-content" },
            H2({}, "Rendering Speed Demo"),
            P({}, "Test the virtual DOM performance by adjusting the slider to see how many elements can be rendered smoothly."),
            
            Div({ class: "demo-controls" },
              Div({ class: "range-container" },
                Label({ class: "range-label" }, `Elements: ${range}`),
                Input({
                  class: "range-slider",
                  type: 'range',
                  min: '0',
                  max: '100',
                  value: range,
                  oninput: handleRange
                })
              ),
              Div({ class: "boxes-container" },
                ...boxes.map((box) => 
                  Div({
                    class: "rendered-box"
                  }, box)
                )
              )
            )
          )
        );

      case "hooks":
        return (
          Div(
            { class: "demo-content" },
            H2({}, "React-like Hooks Demo"),
            P({}, "Experience useState and useEffect hooks in action with interactive examples."),
            
            Div({ class: "counter-demo" },
              H3({}, "useState Counter"),
              Div({ class: "counter-display" },
                Span({ class: "counter-value" }, `Count: ${count}`)
              ),
              Div({ class: "counter-controls" },
                Button({
                  class: "btn btn-primary",
                  onclick: () => setCount(count + 1)
                }, "Increment"),
                Button({
                  class: "btn btn-secondary",
                  onclick: () => setCount(count > 0 ? count - 1 : 0)
                }, "Decrement"),
                Button({
                  class: "btn btn-outline",
                  onclick: () => setCount(0)
                }, "Reset")
              )
            )
          )
        );

      case "forms":
        return (
          Div(
            { class: "demo-content" },
            H2({}, "Form Handling Demo"),
            P({}, "See how BUBLOJS handles form inputs, validation, and state management."),
            
            Form(
              { onsubmit: handleFormSubmit, class: "demo-form" },
              Div({ class: "form-group" },
                Label({ for: "name" }, "Name"),
                Input({
                  type: "text",
                  id: "name",
                  name: "name",
                  value: formData.name,
                  placeholder: "Enter your name",
                  oninput: handleFormChange,
                  required: true
                })
              ),
              Div({ class: "form-group" },
                Label({ for: "email" }, "Email"),
                Input({
                  type: "email",
                  id: "email",
                  name: "email",
                  value: formData.email,
                  placeholder: "Enter your email",
                  oninput: handleFormChange,
                  required: true
                })
              ),
              Div({ class: "form-group" },
                Label({ for: "message" }, "Message"),
                Textarea({
                  id: "message",
                  name: "message",
                  value: formData.message,
                  placeholder: "Enter your message",
                  oninput: handleFormChange,
                  rows: 4
                })
              ),
              Button({
                type: "submit",
                class: "btn btn-primary"
              }, "Submit Form")
            ),
            Div({ class: "form-preview" },
              H4({}, "Form Data Preview:"),
              Pre({ class: "code-block" },
                Code({}, JSON.stringify(formData, null, 2))
              )
            )
          )
        );

      case "todos":
        return (
          Div(
            { class: "demo-content" },
            H2({}, "Todo List Demo"),
            P({}, "A complete todo application showcasing dynamic lists and state management."),
            
            Div({ class: "todo-form" },
              Div({ class: "todo-input-group" },
                Input({
                  type: "text",
                  placeholder: "Add a new todo",
                  value: newTodo,
                  oninput: (e) => setNewTodo(e.target.value),
                  onkeypress: (e) => e.key === 'Enter' && addTodo(),
                  class: "todo-input"
                }),
                Button({
                  onclick: addTodo,
                  class: "btn btn-primary todo-add-btn"
                }, "Add Todo")
              )
            ),
            
            Div({ class: "todo-list" },
              ...todos.map(todo =>
                Div({
                  class: `todo-item ${todo.completed ? 'completed' : ''}`
                },
                  Div({ class: "todo-content" },
                    Input({
                      type: "checkbox",
                      checked: todo.completed,
                      onchange: () => toggleTodo(todo.id),
                      class: "todo-checkbox"
                    }),
                    Span({
                      class: todo.completed ? "todo-text completed" : "todo-text"
                    }, todo.text)
                  ),
                  Button({
                    onclick: () => deleteTodo(todo.id),
                    class: "btn btn-danger btn-sm todo-delete"
                  }, "Delete")
                )
              )
            )
          )
        );

      case "timers":
        return (
          Div(
            { class: "demo-content" },
            H2({}, "Timers & Effects Demo"),
            P({}, "See useEffect in action with a timer that demonstrates side effects and cleanup."),
            
            Div({ class: "timer-demo" },
              H3({}, "Stopwatch"),
              Div({ class: "timer-display" },
                Span({ class: "timer-value" }, `${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, '0')}`)
              ),
              Div({ class: "timer-controls" },
                Button({
                  class: "btn btn-primary",
                  onclick: () => setIsRunning(true),
                  disabled: isRunning
                }, "Start"),
                Button({
                  class: "btn btn-secondary",
                  onclick: () => setIsRunning(false),
                  disabled: !isRunning
                }, "Pause"),
                Button({
                  class: "btn btn-outline",
                  onclick: () => {
                    setTimer(0);
                    setIsRunning(false);
                  }
                }, "Reset")
              )
            )
          )
        );

      case "dom-refs":
        return (
          Div(
            { class: "demo-content" },
            H2({}, "DOM References Demo"),
            P({}, "Learn how to use useRef to directly access and manipulate DOM elements."),
            
            Div({ class: "ref-demo" },
              H3({}, "Input Focus Demo"),
              Input({
                ref: inputRef,
                type: "text",
                placeholder: "This input will be focused when you click the button",
                class: "ref-input"
              }),
              Button({
                onclick: focusInput,
                class: "btn btn-primary"
              }, "Focus Input"),
              P({ class: "ref-info" }, "Click the button to focus the input field above using useRef.")
            )
          )
        );

      default:
        return Div({}, "Select a demo to view");
    }
  };

  return Layout(
    // Demo Section
    Section(
      { class: "demo-section" },
      Div(
        { class: "demo-container" },
        Div(
          { class: "demo-sidebar" },
          H2({ class: "sidebar-title" }, "Demo Categories"),
          Ul(
            { class: "sidebar-nav" },
            ...sections.map(section =>
              Li(
                { class: "sidebar-item" },
                Button(
                  {
                    class: `sidebar-link ${activeSection === section.id ? "active" : ""}`,
                    onclick: () => setActiveSection(section.id)
                  },
                  Span({ class: "sidebar-icon" }, section.icon),
                  section.title
                )
              )
            )
          )
        ),
        Div(
          { class: "demo-main" },
          renderContent()
        )
      )
    )
  );
}
