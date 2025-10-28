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
  Img,
  Code,
  Pre,
  Form,
  Input,
  Textarea,
} from "../modules/html.js";
import { useState, useEffect } from "../modules/hooks.js";
import { requests } from "../modules/requests.js";
import MainLayout from "./components/MainLayout.js";
import CodeModal from "./components/CodeModal.js";

function Home() {
  const [count, setCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const incrementCounter = () => setCount(count + 1);
  const decrementCounter = () => setCount(count > 1 ? count - 1 : 0);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const counterCode = `import { useState } from "../modules/hooks.js";
import { Div, Button } from "../modules/html.js";

function Counter() {
  const [count, setCount] = useState(0);

  const incrementCounter = () => setCount(count + 1);
  const decrementCounter = () => setCount(count > 1 ? count - 1 : 0);

  return Div(
    { class: "counter-container flex flex-col items-center gap-4 p-6" },
    Div(
      { class: "counter-display text-4xl font-bold text-secondary-600" },
      count
    ),
    Div(
      { class: "counter-controls flex gap-4" },
      Button(
        {
          class: "btn btn-outline btn-lg",
          onclick: decrementCounter,
        },
        "−"
      ),
      Button(
        {
          class: "btn btn-gradient btn-lg", 
          onclick: incrementCounter,
        },
        "+"
      )
    )
  );
}

// Usage in a component
function HomePage() {
  return Div(
    { class: "page-container" },
    H1({}, "My Counter App"),
    Counter()
  );
}`;


  function Welcome({ name }) {
    return Div(
      { class: "welcome-card" },
      H1({}, `Hello, ${name}!`),
      P({}, "Welcome to BUBLOJS")
    );
  }

  function TodoList({ todos }) {
    return Div(
      { class: "todo-list" },
      H2({}, "My Todos"),
      ...todos.map(todo =>
        Div(
          { class: "todo-item" },
          Span({}, todo.text),
          Button(
            { onclick: () => deleteTodo(todo.id) },
            "Delete"
          )
        )
      )
    );
  }
  const [todoData, setTodoData] = useState([]);

  useEffect(() => {
    setTodoData([{ id: 1, text: 'Task 1' }]);
  }, [])

  function deleteTodo(id) {
    const items = [];
    todoData.forEach(item => {
      if (item.id !== id) {
        items.push(item);
      }
    });
    setTodoData(items)
  }

  return MainLayout(
    // Hero Section with Two-Column Layout
    Section(
      { class: "section" },
      Div(
        { class: "container" },
        Div(
          { class: "grid grid-2 gap-16 items-center min-h-screen" },

          // Left Column - Text Content and CTA
          Div(
            { class: "flex flex-col justify-center" },
            H1(
              { class: "text-5xl font-bold mb-2" },
              "Build Modern SPAs with",
              Span(
                { class: "text-6xl font-bold mb-6 heading-gradient-purple-pink" },
                "Vanilla JavaScript"
              ),
            ),
            P(
              { class: "text-xl text-secondary mb-8" },
              "BUBLOJS is a lightweight, fast, and scalable Single Page Application framework that brings React-like features to vanilla JavaScript without the overhead."
            ),
            Div(
              { class: "flex gap-4" },
              A(
                { href: requests.url("/docs"), class: "btn btn-gradient btn-lg" },
                "Get Started"
              ),
              A(
                { href: requests.url("/demo"), class: "btn btn-outline btn-lg" },
                "View Demos"
              )
            )
          ),

          // Right Column - Interactive Counter Demo
          Div(
            { class: "card" },
            Div(
              { class: "card-header text-center" },
              H2({ class: "card-title text-lg" }, "Interactive Counter")
            ),

            Div(
              { class: "card-body" },
              // Counter Preview
              Div(
                { class: "flex flex-col items-center gap-6 p-8" },
                Div(
                  { class: "text-center" },
                  Div(
                    { class: "text-6xl font-bold text-secondary-600 mb-4" },
                    count.toString()
                  ),
                  P({ class: "text-secondary mb-6" }, "Click the buttons to interact with the counter")
                ),
                Div(
                  { class: "flex gap-4" },
                  Button(
                    {
                      class: "btn btn-outline btn-xl",
                      onclick: decrementCounter,
                    },
                    "−"
                  ),
                  Button(
                    {
                      class: "btn btn-gradient btn-xl",
                      onclick: incrementCounter,
                    },
                    "+"
                  )
                ),

                // View Code Button
                Div(
                  { class: "mt-4" },
                  Button(
                    {
                      class: "btn btn-ghost btn-sm",
                      onclick: openModal,
                    },
                    "📋 View Code"
                  )
                )
              )
            )
          )
        ),),
    ),

    Section({ class: "section" },
      // Features Section
      Div(
        { class: "mt-6" },
        H2(
          { class: "text-center text-3xl font-bold mb-12" },
          "Why Choose BUBLOJS?"
        ),
        Div(
          { class: "grid grid-3 gap-8" },
          Div(
            { class: "card text-center" },
            Div({ class: "text-4xl mb-4" }, "⚡"),
            H3({ class: "card-title" }, "Lightning Fast"),
            P(
              { class: "text-secondary" },
              "Built for performance with minimal overhead and optimized rendering."
            )
          ),
          Div(
            { class: "card text-center" },
            Div({ class: "text-4xl mb-4" }, "🎯"),
            H3({ class: "card-title" }, "Simple & Intuitive"),
            P(
              { class: "text-secondary" },
              "Clean API design that makes web development enjoyable and productive."
            )
          ),
          Div(
            { class: "card text-center" },
            Div({ class: "text-4xl mb-4" }, "🔧"),
            H3({ class: "card-title" }, "Developer Friendly"),
            P(
              { class: "text-secondary" },
              "Great developer experience with modern tooling and comprehensive documentation."
            )
          )
        )
      ),
    ),
    Section({ class: "section" },
      // BUBLOJS Syntax Examples Section
      Div(
        { class: "mt-6" },
        H2(
          { class: "text-center text-3xl font-bold mb-12" },
          "BUBLOJS Syntax Examples"
        ),
        Div(
          { class: "grid grid-2 gap-8" },
          // Basic Component Example
          Div(
            { class: "card" },
            Div(
              { class: "card-header" },
              H3({ class: "card-title" }, "Basic Component")
            ),
            Div(
              { class: "card-body" },
              P(
                { class: "text-secondary mb-4" },
                "Simple component with props and children:"
              ),
              Pre(
                { class: "bg-neutral-100 p-4 rounded-lg overflow-x-auto" },
                Code(
                  { class: "text-sm" },
                  `function Welcome({ name }) {
  return Div(
    { class: "welcome-card" },
    H1({}, \`Hello, \${name}!\`),
    P({}, "Welcome to BUBLOJS")
  );
}

// Usage
return Welcome({ name: "World" });`
                ),
              )
            ),
            Div({},
              Welcome({ name: "world" })
            )
          ),

          // List Component Example
          Div(
            { class: "card" },
            Div(
              { class: "card-header" },
              H3({ class: "card-title" }, "Dynamic List")
            ),
            Div(
              { class: "card-body" },
              P(
                { class: "text-secondary mb-4" },
                "Creating dynamic lists with BUBLOJS:"
              ),
              Pre(
                { class: "bg-neutral-100 p-4 rounded-lg overflow-x-auto" },
                Code(
                  { class: "text-sm" },
                  `function TodoList({ todos }) {
  return Div(
    { class: "todo-list" },
    H2({}, "My Todos"),
    ...todos.map(todo => 
      Div(
        { class: "todo-item" },
        Span({}, todo.text),
        Button(
          { onclick: () => deleteTodo(todo.id) },
          "Delete"
        )
      )
    )
  );
}
//Usage
TodoList([{id:1,text:'Task 1'}])`
                )
              )
            ),
            TodoList({ todos: todoData })
          ),

          // Form Component Example
          Div(
            { class: "card" },
            Div(
              { class: "card-header" },
              H3({ class: "card-title" }, "Form Component")
            ),
            Div(
              { class: "card-body" },
              P(
                { class: "text-secondary mb-4" },
                "Interactive form with state management:"
              ),
              Pre(
                { class: "bg-neutral-100 p-4 rounded-lg overflow-x-auto" },
                Code(
                  { class: "text-sm" },
                  `function ContactForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, message });
  };

  return Div(
    { class: "contact-form" },
    H2({}, "Contact Us"),
    Form(
      { onsubmit: handleSubmit },
      Input({
        type: "email",
        placeholder: "Your email",
        value: email,
        onchange: (e) => setEmail(e.target.value)
      }),
      Textarea({
        placeholder: "Your message",
        value: message,
        onchange: (e) => setMessage(e.target.value)
      }),
      Button({ type: "submit" }, "Send Message")
    )
  );
}`
                )
              )
            )
          ),

          // Conditional Rendering Example
          Div(
            { class: "card" },
            Div(
              { class: "card-header" },
              H3({ class: "card-title" }, "Conditional Rendering")
            ),
            Div(
              { class: "card-body" },
              P(
                { class: "text-secondary mb-4" },
                "Conditional rendering with BUBLOJS:"
              ),
              Pre(
                { class: "bg-neutral-100 p-4 rounded-lg overflow-x-auto" },
                Code(
                  { class: "text-sm" },
                  `function UserProfile({ user }) {
  return Div(
    { class: "user-profile" },
    H1({}, \`Welcome, \${user.name}\`),
    user.isAdmin && Div(
      { class: "admin-panel" },
      H3({}, "Admin Panel"),
      Button({}, "Manage Users")
    ),
    !user.isVerified && Div(
      { class: "warning" },
      P({}, "Please verify your email address")
    )
  );
}`
                )
              )
            )
          )
        )
      )
    ),

    // Code Modal
    CodeModal({
      isOpen: isModalOpen,
      onClose: closeModal,
      title: "Counter Component Code",
      code: counterCode,
      language: "javascript"
    })
  )
}

export default Home;
