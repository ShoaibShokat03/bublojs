import { 
  Div, 
  H1, 
  H2, 
  H3, 
  H4, 
  P, 
  Button, 
  Span, 
  A, 
  Section, 
  Input, 
  Label, 
  Code, 
  Pre 
} from "../modules/html.js";
import { useState, useEffect } from "../modules/hooks.js";
import { requests } from "../modules/requests.js";
import MainLayout from "./components/MainLayout.js";
import CodeModal from "./components/CodeModal.js";

function Demo() {
  const [activeDemo, setActiveDemo] = useState('counter');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [todos, setTodos] = useState([]);
  const [todoInput, setTodoInput] = useState('');
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // Counter functions
  const incrementCounter = () => setCount(count + 1);
  const decrementCounter = () => setCount(Math.max(0, count - 1));

  // Todo functions
  const addTodo = () => {
    if (todoInput.trim()) {
      setTodos([...todos, { id: Date.now(), text: todoInput, done: false }]);
      setTodoInput('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, done: !todo.done } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Timer functions
  const startTimer = () => setIsRunning(true);
  const stopTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setTimer(0);
    setIsRunning(false);
  };

  // Form functions
  const updateFormData = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const submitForm = () => {
    alert(`Form submitted:\nName: ${formData.name}\nEmail: ${formData.email}\nMessage: ${formData.message}`);
  };

  const demos = [
    { 
      id: 'counter', 
      title: 'Counter Demo', 
      icon: '🔢', 
      description: 'Basic state management with useState hook' 
    },
    { 
      id: 'todo', 
      title: 'Todo List', 
      icon: '✅', 
      description: 'Complex state management with arrays and objects' 
    },
    { 
      id: 'timer', 
      title: 'Timer', 
      icon: '⏱️', 
      description: 'useEffect hook for side effects and intervals' 
    },
    { 
      id: 'form', 
      title: 'Form Demo', 
      icon: '📝', 
      description: 'Form handling with controlled inputs' 
    }
  ];

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentCode = () => {
    switch (activeDemo) {
      case 'counter':
        return `import { Div, Button, Span } from "../modules/html.js";
import { useState } from "../modules/hooks.js";

function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(Math.max(0, count - 1));

  return Div(
    { class: "card text-center p-8" },
    Div(
      { class: "text-6xl font-bold text-secondary-600 mb-4" },
      count.toString()
    ),
    Div(
      { class: "flex gap-4 justify-center" },
      Button(
        { 
          class: "btn btn-outline btn-lg px-8 py-3 text-2xl font-bold",
          onclick: decrement
        },
        "−"
      ),
      Button(
        { 
          class: "btn btn-gradient btn-lg px-8 py-3 text-2xl font-bold",
          onclick: increment
        },
        "+"
      )
    )
  );
}

export default Counter;`;

      case 'todo':
        return `import { Div, Input, Button, Span } from "../modules/html.js";
import { useState } from "../modules/hooks.js";

function TodoList() {
  const [todos, setTodos] = useState([]);
const [input, setInput] = useState('');

const addTodo = () => {
  if (input.trim()) {
    setTodos([...todos, { 
      id: Date.now(), 
      text: input, 
      done: false 
    }]);
    setInput('');
  }
};

const toggleTodo = (id) => {
  setTodos(todos.map(todo => 
    todo.id === id ? { ...todo, done: !todo.done } : todo
  ));
};

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return Div(
    { class: "card p-6" },
    Div(
      { class: "flex gap-2 mb-6" },
  Input({ 
        class: "form-input",
    value: input, 
        onchange: (e) => setInput(e.target.value),
        placeholder: "Add a new todo...",
        onkeypress: (e) => e.key === 'Enter' && addTodo()
      }),
      Button(
        { class: "btn btn-primary", onclick: addTodo },
        "Add"
      )
    ),
    Div(
      { class: "space-y-2" },
      todos.length === 0 ? (
        P({ class: "text-secondary text-center" }, "No todos yet. Add one above!")
      ) : (
        ...todos.map(todo =>
          Div(
            { 
              class: \`card p-4 flex items-center justify-between \${todo.done ? 'opacity-50' : ''}\`
            },
            Div(
              { class: "flex items-center gap-3" },
              Input({
                type: "checkbox",
                checked: todo.done,
                onchange: () => toggleTodo(todo.id)
              }),
              Span(
                { class: \`\${todo.done ? 'line-through text-secondary' : ''}\` },
                todo.text
              )
            ),
            Button(
              { 
                class: "btn btn-outline btn-sm",
                onclick: () => deleteTodo(todo.id)
              },
              "Delete"
            )
          )
        )
      )
    )
  );
}

export default TodoList;`;

      case 'timer':
        return `import { Div, Button, Span } from "../modules/html.js";
import { useState, useEffect } from "../modules/hooks.js";

function Timer() {
  const [timer, setTimer] = useState(0);
const [isRunning, setIsRunning] = useState(false);

useEffect(() => {
  let interval;
  if (isRunning) {
    interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
  }
  return () => clearInterval(interval);
}, [isRunning]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return \`\${mins.toString().padStart(2, '0')}:\${secs.toString().padStart(2, '0')}\`;
  };

  const start = () => setIsRunning(true);
  const stop = () => setIsRunning(false);
  const reset = () => {
  setTimer(0);
  setIsRunning(false);
};

  return Div(
    { class: "card text-center p-8" },
    Div(
      { class: "text-6xl font-bold text-secondary-600 mb-6" },
      formatTime(timer)
    ),
    Div(
      { class: "flex gap-4 justify-center" },
      Button(
        { 
          class: "btn btn-primary",
          onclick: start,
          disabled: isRunning
        },
        "Start"
      ),
      Button(
        { 
          class: "btn btn-secondary",
          onclick: stop,
          disabled: !isRunning
        },
        "Stop"
      ),
      Button(
        { 
          class: "btn btn-outline",
          onclick: reset
        },
        "Reset"
      )
    )
  );
}

export default Timer;`;

      case 'form':
        return `import { Div, Input, Button, Label, P } from "../modules/html.js";
import { useState } from "../modules/hooks.js";

function ContactForm() {
  const [formData, setFormData] = useState({ 
  name: '', 
  email: '', 
  message: '' 
});

const updateFormData = (field, value) => {
  setFormData({ ...formData, [field]: value });
};

const submitForm = () => {
  console.log('Form submitted:', formData);
    alert(\`Form submitted:\\nName: \${formData.name}\\nEmail: \${formData.email}\\nMessage: \${formData.message}\`);
  };

  return Div(
    { class: "card p-6" },
    Div(
      { class: "grid grid-2 gap-6" },
      
      // Form
      Div(
        { class: "space-y-4" },
        Div(
          { class: "form-group" },
          Label({ class: "form-label" }, "Name"),
  Input({ 
            class: "form-input",
            type: "text",
    value: formData.name,
            onchange: (e) => updateFormData('name', e.target.value),
            placeholder: "Enter your name"
          })
        ),
        Div(
          { class: "form-group" },
          Label({ class: "form-label" }, "Email"),
          Input({ 
            class: "form-input",
            type: "email",
            value: formData.email,
            onchange: (e) => updateFormData('email', e.target.value),
            placeholder: "Enter your email"
          })
        ),
        Div(
          { class: "form-group" },
          Label({ class: "form-label" }, "Message"),
          Input({ 
            class: "form-input",
            type: "text",
            value: formData.message,
            onchange: (e) => updateFormData('message', e.target.value),
            placeholder: "Enter your message"
          })
        ),
        Button(
          { 
            class: "btn btn-primary w-full",
            onclick: submitForm
          },
          "Submit Form"
        )
      ),

      // Preview
      Div(
        { class: "bg-neutral-50 p-4 rounded-lg" },
        H3({ class: "text-lg font-bold mb-4" }, "Form Data Preview:"),
        P({ class: "text-sm mb-2" }, \`Name: \${formData.name || 'Not set'}\`),
        P({ class: "text-sm mb-2" }, \`Email: \${formData.email || 'Not set'}\`),
        P({ class: "text-sm" }, \`Message: \${formData.message || 'Not set'}\`)
      )
    )
  );
}

export default ContactForm;`;

      default:
        return '';
    }
  };

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
            "Interactive ",
            Span({ class: "heading-gradient-purple-pink" }, "Demos")
          ),
          P(
            { class: "text-xl text-secondary max-w-3xl mx-auto mb-8" },
            "Explore live examples showcasing BUBLOJS capabilities. See hooks, state management, and component patterns in action."
          ),
          Div(
            { class: "flex gap-4 justify-center" },
            A(
              { href: requests.url("/docs"), class: "btn btn-gradient btn-lg" },
              "📚 Read Documentation"
            ),
            A(
              { href: requests.url("/contact"), class: "btn btn-outline btn-lg" },
              "💬 Get Support"
            )
          )
        )
      )
    ),

    // Demo Navigation
    Section(
      { class: "section bg-neutral-50" },
      Div(
        { class: "container" },
        Div(
          { class: "text-center mb-12" },
          H2(
            { class: "text-4xl font-bold mb-6" },
            "Choose a Demo"
          ),
          P(
            { class: "text-xl text-secondary" },
            "Click on any demo to explore BUBLOJS features"
          )
        ),

        Div(
          { class: "grid grid-4 gap-4" },
          ...demos.map(demo =>
            Button(
              { 
                class: `card p-6 text-center transition-all cursor-pointer ${
                  activeDemo === demo.id 
                    ? 'ring-2 ring-primary-500 bg-primary-50' 
                    : 'hover:shadow-lg'
                }`,
                onclick: () => setActiveDemo(demo.id)
              },
              Div(
                { class: "text-4xl mb-3" },
                demo.icon
              ),
              H3(
                { class: "text-lg font-bold mb-2" },
                demo.title
              ),
              P(
                { class: "text-sm text-secondary" },
                demo.description
              )
            )
          )
        )
      )
    ),

    // Demo Content
    Section(
      { class: "section" },
      Div(
        { class: "container" },
        Div(
          { class: "grid grid-2 gap-16 items-start" },
          
          // Demo Preview
          Div(
            {},
            Div(
              { class: "card" },
              H3(
                { class: "text-2xl font-bold mb-4" },
                demos.find(d => d.id === activeDemo)?.title || "Demo"
              ),
              P(
                { class: "text-secondary mb-6" },
                demos.find(d => d.id === activeDemo)?.description || ""
              ),

              // Counter Demo
              activeDemo === 'counter' && Div(
                { class: "text-center p-8" },
                Div(
                  { class: "text-6xl font-bold text-secondary-600 mb-4" },
                  count.toString()
                ),
                P(
                  { class: "text-secondary mb-6" },
                  "Click the buttons to interact with the counter"
                ),
                Div(
                  { class: "flex gap-4 justify-center" },
                  Button(
                    { 
                      class: "btn btn-outline btn-lg px-8 py-3 text-2xl font-bold",
                      onclick: decrementCounter
                    },
                    "−"
                  ),
                  Button(
                    { 
                      class: "btn btn-gradient btn-lg px-8 py-3 text-2xl font-bold",
                      onclick: incrementCounter
                    },
                    "+"
                  )
                )
              ),

              // Todo Demo
              activeDemo === 'todo' && Div(
                { class: "p-6" },
                Div(
                  { class: "flex gap-2 mb-6" },
                  Input({
                    class: "form-input",
                    value: todoInput,
                    onchange: (e) => setTodoInput(e.target.value),
                    placeholder: "Add a new todo...",
                    onkeypress: (e) => e.key === 'Enter' && addTodo()
                  }),
                  Button(
                    { class: "btn btn-primary", onclick: addTodo },
                    "Add"
                  )
                ),
                Div(
                  { class: "space-y-2" },
                  todos.length === 0 ? (
                    P(
                      { class: "text-secondary text-center py-8" },
                      "No todos yet. Add one above!"
                    )
                  ) : (
                    ...todos.map(todo =>
                      Div(
                        { 
                          class: `card p-4 flex items-center justify-between ${
                            todo.done ? 'opacity-50' : ''
                          }`
                        },
                        Div(
                          { class: "flex items-center gap-3" },
                          Input({
                            type: "checkbox",
                            checked: todo.done,
                            onchange: () => toggleTodo(todo.id)
                          }),
                          Span(
                            { 
                              class: todo.done 
                                ? 'line-through text-secondary' 
                                : ''
                            },
                            todo.text
                          )
                        ),
                        Button(
                          { 
                            class: "btn btn-outline btn-sm",
                            onclick: () => deleteTodo(todo.id)
                          },
                          "Delete"
                        )
                      )
                    )
                  )
                )
              ),

              // Timer Demo
              activeDemo === 'timer' && Div(
                { class: "text-center p-8" },
                Div(
                  { class: "text-6xl font-bold text-secondary-600 mb-6" },
                  formatTime(timer)
                ),
                Div(
                  { class: "flex gap-4 justify-center" },
                  Button(
                    { 
                      class: "btn btn-primary",
                      onclick: startTimer,
                      disabled: isRunning
                    },
                    "Start"
                  ),
                  Button(
                    { 
                      class: "btn btn-secondary",
                      onclick: stopTimer,
                      disabled: !isRunning
                    },
                    "Stop"
                  ),
                  Button(
                    { 
                      class: "btn btn-outline",
                      onclick: resetTimer
                    },
                    "Reset"
                  )
                )
              ),

              // Form Demo
              activeDemo === 'form' && Div(
                { class: "p-6" },
                Div(
                  { class: "grid grid-2 gap-6" },
                  
                  // Form
                  Div(
                    { class: "space-y-4" },
                    Div(
                      { class: "form-group" },
                      Label({ class: "form-label" }, "Name"),
                      Input({ 
                        class: "form-input",
                        type: "text",
                        value: formData.name,
                        onchange: (e) => updateFormData('name', e.target.value),
                        placeholder: "Enter your name"
                      })
                    ),
                    Div(
                      { class: "form-group" },
                      Label({ class: "form-label" }, "Email"),
  Input({ 
                        class: "form-input",
                        type: "email",
    value: formData.email,
                        onchange: (e) => updateFormData('email', e.target.value),
                        placeholder: "Enter your email"
                      })
                    ),
                    Div(
                      { class: "form-group" },
                      Label({ class: "form-label" }, "Message"),
                      Input({ 
                        class: "form-input",
                        type: "text",
                        value: formData.message,
                        onchange: (e) => updateFormData('message', e.target.value),
                        placeholder: "Enter your message"
                      })
                    ),
                    Button(
                      { 
                        class: "btn btn-primary w-full",
                        onclick: submitForm
                      },
                      "Submit Form"
                    )
                  ),

                  // Preview
                  Div(
                    { class: "bg-neutral-50 p-4 rounded-lg" },
                    H3(
                      { class: "text-lg font-bold mb-4" },
                      "Form Data Preview:"
                    ),
                    P(
                      { class: "text-sm mb-2" },
                      `Name: ${formData.name || 'Not set'}`
                    ),
                    P(
                      { class: "text-sm mb-2" },
                      `Email: ${formData.email || 'Not set'}`
                    ),
                    P(
                      { class: "text-sm" },
                      `Message: ${formData.message || 'Not set'}`
                    )
                  )
                )
              )
            )
          ),

          // Code Section
          Div(
            {},
            Div(
              { class: "card" },
              H3(
                { class: "text-2xl font-bold mb-4" },
                "Source Code"
              ),
              P(
                { class: "text-secondary mb-6" },
                "View the complete implementation for this demo"
              ),
              Button(
                { 
                  class: "btn btn-outline w-full",
                  onclick: () => setIsModalOpen(true)
                },
                "📋 View Full Code"
              )
            )
          )
        )
      )
    ),

    // Features Section
    Section(
      { class: "section bg-neutral-50" },
      Div(
        { class: "container" },
        Div(
          { class: "text-center mb-16" },
          H2(
            { class: "text-4xl font-bold mb-6" },
            "What You Can Build"
          ),
          P(
            { class: "text-xl text-secondary max-w-2xl mx-auto" },
          "These demos showcase the core capabilities of BUBLOJS"
          )
        ),

        Div(
          { class: "grid grid-4 gap-8" },
          
          Div(
            { class: "card text-center" },
            Div(
              { class: "text-5xl mb-4" },
              "🎯"
            ),
            H3(
              { class: "text-2xl font-bold mb-4" },
              "State Management"
            ),
            P(
              { class: "text-secondary" },
              "Use useState and useEffect hooks to manage component state and side effects."
            )
          ),

          Div(
            { class: "card text-center" },
            Div(
              { class: "text-5xl mb-4" },
              "🧩"
            ),
            H3(
              { class: "text-2xl font-bold mb-4" },
              "Component Architecture"
            ),
            P(
              { class: "text-secondary" },
              "Build reusable components with props and composition patterns."
            )
          ),

          Div(
            { class: "card text-center" },
            Div(
              { class: "text-5xl mb-4" },
              "⚡"
            ),
            H3(
              { class: "text-2xl font-bold mb-4" },
              "Performance"
            ),
            P(
              { class: "text-secondary" },
              "Optimized rendering and minimal overhead for fast user experiences."
            )
          ),

          Div(
            { class: "card text-center" },
            Div(
              { class: "text-5xl mb-4" },
              "🔧"
            ),
            H3(
              { class: "text-2xl font-bold mb-4" },
              "Developer Experience"
            ),
            P(
              { class: "text-secondary" },
              "Familiar patterns and excellent TypeScript support for productive development."
            )
          )
        )
      )
    ),

    // CTA Section
    Section(
      { class: "section" },
      Div(
        { class: "container" },
        Div(
          { class: "text-center" },
          H2(
            { class: "text-4xl font-bold mb-6" },
            "Ready to Build Your Own?"
          ),
          P(
            { class: "text-xl text-secondary max-w-2xl mx-auto mb-8" },
          "Start building amazing applications with BUBLOJS today."
        ),
          Div(
            { class: "flex gap-4 justify-center" },
            A(
              { href: requests.url("/docs"), class: "btn btn-gradient btn-lg" },
              "🚀 Get Started"
            ),
            A(
              { href: requests.url("/contact"), class: "btn btn-outline btn-lg" },
              "💬 Get Support"
            )
          )
        )
      )
    ),

    // Code Modal
    CodeModal({
      isOpen: isModalOpen,
      onClose: () => setIsModalOpen(false),
      title: `${demos.find(d => d.id === activeDemo)?.title || "Demo"} - Source Code`,
      subtitle: demos.find(d => d.id === activeDemo)?.description || "",
      code: getCurrentCode(),
      language: "javascript"
    })
  );
}

export default Demo;