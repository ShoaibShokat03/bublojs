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
  Code, 
  Pre, 
  Input, 
  Ul, 
  Li 
} from "../modules/html.js";
import { useState } from "../modules/hooks.js";
import { requests } from "../modules/requests.js";
import MainLayout from "./components/MainLayout.js";
import CodeModal from "./components/CodeModal.js";

function Docs() {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCode, setModalCode] = useState('');

  const docSections = [
    { id: 'getting-started', title: 'Getting Started', icon: '🚀' },
    { id: 'installation', title: 'Installation', icon: '📦' },
    { id: 'hooks', title: 'Hooks API', icon: '🎯' },
    { id: 'components', title: 'Components', icon: '🧩' },
    { id: 'routing', title: 'Routing', icon: '🛣️' },
    { id: 'examples', title: 'Examples', icon: '💡' },
    { id: 'api', title: 'API Reference', icon: '📚' }
  ];

  const searchContent = [
    { section: 'getting-started', title: 'What is BUBLOJS?', content: 'BUBLOJS is a lightweight JavaScript framework...' },
    { section: 'hooks', title: 'useState Hook', content: 'The useState hook allows you to add state...' },
    { section: 'hooks', title: 'useEffect Hook', content: 'The useEffect hook lets you perform side effects...' },
    { section: 'components', title: 'Creating Components', content: 'Components are the building blocks...' },
    { section: 'routing', title: 'Router Setup', content: 'BUBLOJS includes a simple routing system...' }
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length > 2) {
      const results = searchContent.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.content.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const showCodeModal = (code) => {
    setModalCode(code);
    setIsModalOpen(true);
  };

  const codeBlocks = {
    useState: "const [count, setCount] = useState(0);\nconst increment = () => setCount(count + 1);",
    useEffect: "useEffect(() => {\n  fetch('/api/data').then(setData);\n}, []);",
    customHook: "function useCounter(initial) {\n  const [count, setCount] = useState(initial);\n  return { count, setCount };\n}",
    component: "function Welcome({ name }) {\n  return Div({}, H1({}, 'Hello ' + name));\n}",
    todoList: "const [todos, setTodos] = useState([]);\nconst addTodo = (text) => setTodos([...todos, text]);"
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
            "BUBLOJS ",
            Span({ class: "heading-gradient-purple-pink" }, "Documentation")
          ),
          P(
            { class: "text-xl text-secondary max-w-3xl mx-auto mb-8" },
            "Learn how to build modern web applications with BUBLOJS. From getting started to advanced concepts."
          ),
          Div(
            { class: "flex gap-4 justify-center" },
            Button(
              { 
                class: "btn btn-gradient btn-lg",
                onclick: () => setActiveSection('getting-started')
              },
              "🚀 Quick Start"
            ),
            A(
              { href: requests.url("/demo"), class: "btn btn-outline btn-lg" },
              "👀 Try Demo"
            )
          )
        )
      )
    ),

    // Documentation Section
    Section(
      { class: "section" },
      Div(
        { class: "container" },
        Div(
          { class: "grid grid-4 gap-8" },
          
          // Sidebar
          Div(
            { class: "col-span-1" },
            Div(
              { class: "card p-6 sticky top-8" },
              
              // Search Box
              Div(
                { class: "mb-6" },
                Input({
                  type: "text",
                  placeholder: "Search documentation...",
                  class: "form-input w-full",
                  value: searchQuery,
                  onchange: (e) => handleSearch(e.target.value)
                }),
                searchResults.length > 0 && Div(
                  { class: "mt-2 space-y-2" },
                  ...searchResults.map((result, index) =>
                    Div(
                      { 
                        class: "p-3 bg-neutral-50 rounded cursor-pointer hover:bg-neutral-100",
                        onclick: () => setActiveSection(result.section)
                      },
                      H4(
                        { class: "text-sm font-bold mb-1" },
                        result.title
                      ),
                      P(
                        { class: "text-xs text-secondary" },
                        result.content.substring(0, 100) + "..."
                      )
                    )
                  )
                )
              ),
              
              // Navigation
              H3(
                { class: "text-lg font-bold mb-4" },
                "Documentation"
              ),
              Div(
                { class: "space-y-2" },
                ...docSections.map(section =>
                  Button(
                    { 
                      class: `w-full text-left p-3 rounded transition-all ${
                        activeSection === section.id 
                          ? 'bg-primary-100 text-primary-600' 
                          : 'hover:bg-neutral-50'
                      }`,
                      onclick: () => setActiveSection(section.id)
                    },
                    Span(
                      { class: "mr-3" },
                      section.icon
                    ),
                    section.title
                  )
                )
              ),
              
              // Quick Links
              Div(
                { class: "mt-8 pt-6 border-t border-neutral-200" },
                H4(
                  { class: "text-sm font-bold mb-3" },
                  "Quick Links"
                ),
                Div(
                  { class: "space-y-2" },
                  A(
                    { href: requests.url("/demo"), class: "block text-sm text-primary-600 hover:text-primary-700" },
                    "Live Demos"
                  ),
                  A(
                    { href: requests.url("/contact"), class: "block text-sm text-primary-600 hover:text-primary-700" },
                    "Get Support"
                  ),
                  A(
                    { href: "https://github.com/bublojs/bublojs", class: "block text-sm text-primary-600 hover:text-primary-700", target: "_blank" },
                    "GitHub Repository"
                  ),
                  A(
                    { href: requests.url("/about"), class: "block text-sm text-primary-600 hover:text-primary-700" },
                    "About BUBLOJS"
                  )
                )
              )
            )
          ),

          // Main Content
          Div(
            { class: "col-span-3" },
            Div(
              { class: "card p-8" },
              
              // Getting Started
              activeSection === 'getting-started' && Div(
                {},
                H2(
                  { class: "text-3xl font-bold mb-6" },
                  "Getting Started"
                ),
                P(
                  { class: "text-lg text-secondary mb-8" },
                  "BUBLOJS is a lightweight JavaScript framework that brings React-like features to vanilla JavaScript. It's designed to be simple, fast, and easy to learn."
                ),
                
                H3(
                  { class: "text-2xl font-bold mb-4" },
                  "What is BUBLOJS?"
                ),
                P(
                  { class: "text-secondary mb-6" },
                  "BUBLOJS provides:"
                ),
                Ul(
                  { class: "space-y-2 mb-8" },
                  Li({ class: "flex items-center" },
                    Span({ class: "text-primary-600 mr-3" }, "✓"),
                    "useState and useEffect hooks"
                  ),
                  Li({ class: "flex items-center" },
                    Span({ class: "text-primary-600 mr-3" }, "✓"),
                    "Component-based architecture"
                  ),
                  Li({ class: "flex items-center" },
                    Span({ class: "text-primary-600 mr-3" }, "✓"),
                    "Virtual DOM-like rendering"
                  ),
                  Li({ class: "flex items-center" },
                    Span({ class: "text-primary-600 mr-3" }, "✓"),
                    "Zero build configuration"
                  ),
                  Li({ class: "flex items-center" },
                    Span({ class: "text-primary-600 mr-3" }, "✓"),
                    "TypeScript support"
                  )
                ),

                H3(
                  { class: "text-2xl font-bold mb-6" },
                  "Why Choose BUBLOJS?"
                ),
                Div(
                  { class: "grid grid-2 gap-6" },
                  Div(
                    { class: "card p-6" },
                    H4(
                      { class: "text-lg font-bold mb-2" },
                      "Lightweight"
                    ),
                    P(
                      { class: "text-secondary" },
                      "Only 2KB gzipped with zero dependencies"
                    )
                  ),
                  Div(
                    { class: "card p-6" },
                    H4(
                      { class: "text-lg font-bold mb-2" },
                      "Familiar"
                    ),
                    P(
                      { class: "text-secondary" },
                      "React-like hooks API you already know"
                    )
                  ),
                  Div(
                    { class: "card p-6" },
                    H4(
                      { class: "text-lg font-bold mb-2" },
                      "Fast"
                    ),
                    P(
                      { class: "text-secondary" },
                      "Optimized rendering and minimal overhead"
                    )
                  ),
                  Div(
                    { class: "card p-6" },
                    H4(
                      { class: "text-lg font-bold mb-2" },
                      "Simple"
                    ),
                    P(
                      { class: "text-secondary" },
                      "No complex build tools or configuration"
                    )
                  )
                )
              ),

              // Installation
              activeSection === 'installation' && Div(
                {},
                H2(
                  { class: "text-3xl font-bold mb-6" },
                  "Installation"
                ),
                P(
                  { class: "text-lg text-secondary mb-8" },
                  "You can include BUBLOJS in your project in several ways:"
                ),
                
                H3(
                  { class: "text-2xl font-bold mb-4" },
                  "CDN (Recommended for learning)"
                ),
                Div(
                  { class: "bg-neutral-900 text-white p-4 rounded-lg mb-6" },
                  Code(
                    { class: "text-sm" },
                    '<script src="https://unpkg.com/bublojs@latest/dist/bublo.min.js"></script>'
                  )
                ),

                H3(
                  { class: "text-2xl font-bold mb-4" },
                  "NPM"
                ),
                Div(
                  { class: "bg-neutral-900 text-white p-4 rounded-lg mb-6" },
                  Code(
                    { class: "text-sm" },
                    `npm install bublojs

import { useState, useEffect } from 'bublojs'`
                  )
                ),

                H3(
                  { class: "text-2xl font-bold mb-4" },
                  "GitHub"
                ),
                Div(
                  { class: "bg-neutral-900 text-white p-4 rounded-lg mb-6" },
                  Code(
                    { class: "text-sm" },
                    `git clone https://github.com/bublojs/bublojs.git
cd bublojs
npm install`
                  )
                ),

                Div(
                  { class: "card p-6 bg-primary-50 border border-primary-200" },
                  H4(
                    { class: "text-lg font-bold mb-2 flex items-center" },
                    Span({ class: "mr-2" }, "📝"),
                    "Note"
                  ),
                  P(
                    { class: "text-secondary" },
                    "For production applications, we recommend using the CDN or NPM package for better performance and reliability."
                  )
                )
              ),

              // Hooks API
              activeSection === 'hooks' && Div(
                {},
                H2(
                  { class: "text-3xl font-bold mb-6" },
                  "Hooks API"
                ),
                P(
                  { class: "text-lg text-secondary mb-8" },
                  "BUBLOJS provides React-like hooks for state management and side effects."
                ),

                H3(
                  { class: "text-2xl font-bold mb-4" },
                  "useState"
                ),
                P(
                  { class: "text-secondary mb-4" },
                  "The useState hook allows you to add state to your components:"
                ),
                Button(
                  { 
                    class: "btn btn-outline mb-4",
                    onclick: () => showCodeModal(codeBlocks.useState)
                  },
                  "📋 View Full Example"
                ),

                H3(
                  { class: "text-2xl font-bold mb-4" },
                  "useEffect"
                ),
                P(
                  { class: "text-secondary mb-4" },
                  "The useEffect hook lets you perform side effects:"
                ),
                Button(
                  { 
                    class: "btn btn-outline mb-4",
                    onclick: () => showCodeModal(codeBlocks.useEffect)
                  },
                  "📋 View Full Example"
                ),

                H3(
                  { class: "text-2xl font-bold mb-4" },
                  "Custom Hooks"
                ),
                P(
                  { class: "text-secondary mb-4" },
                  "You can create custom hooks to share stateful logic between components:"
                ),
                Button(
                  { 
                    class: "btn btn-outline mb-4",
                    onclick: () => showCodeModal(codeBlocks.customHook)
                  },
                  "📋 View Full Example"
                )
              ),

              // Components
              activeSection === 'components' && Div(
                {},
                H2(
                  { class: "text-3xl font-bold mb-6" },
                  "Components"
                ),
                P(
                  { class: "text-lg text-secondary mb-8" },
                  "Components are the building blocks of BUBLOJS applications. They are functions that return HTML elements."
                ),

                H3(
                  { class: "text-2xl font-bold mb-4" },
                  "Creating Components"
                ),
                P(
                  { class: "text-secondary mb-4" },
                  "Components accept props as the first argument and return HTML elements:"
                ),
                Button(
                  { 
                    class: "btn btn-outline mb-4",
                    onclick: () => showCodeModal(codeBlocks.component)
                  },
                  "📋 View Full Example"
                ),

                H3(
                  { class: "text-2xl font-bold mb-4" },
                  "Component Props"
                ),
                P(
                  { class: "text-secondary mb-4" },
                  "Components can accept props to make them reusable and dynamic."
                ),

                H3(
                  { class: "text-2xl font-bold mb-4" },
                  "Component Composition"
                ),
                P(
                  { class: "text-secondary mb-4" },
                  "You can compose components together to build complex user interfaces."
                )
              ),

              // Examples
              activeSection === 'examples' && Div(
                {},
                H2(
                  { class: "text-3xl font-bold mb-6" },
                  "Examples"
                ),
                P(
                  { class: "text-lg text-secondary mb-8" },
                  "Here are some common patterns and examples:"
                ),

                H3(
                  { class: "text-2xl font-bold mb-4" },
                  "Todo List"
                ),
                P(
                  { class: "text-secondary mb-4" },
                  "A complete todo list implementation with state management:"
                ),
                Button(
                  { 
                    class: "btn btn-outline mb-4",
                    onclick: () => showCodeModal(codeBlocks.todoList)
                  },
                  "📋 View Full Example"
                ),

                H3(
                  { class: "text-2xl font-bold mb-4" },
                  "Data Fetching"
                ),
                P(
                  { class: "text-secondary mb-4" },
                  "Learn how to fetch data from APIs using useEffect."
                ),

                Div(
                  { class: "card p-6 bg-neutral-50" },
                  H4(
                    { class: "text-lg font-bold mb-3" },
                    "💡 Pro Tip"
                  ),
                  P(
                    { class: "text-secondary" },
                    "Try the interactive demos in the Demo section to see these examples in action!"
                  ),
                  A(
                    { href: requests.url("/demo"), class: "btn btn-primary mt-4" },
                    "Try Live Demos"
                  )
                )
              ),

              // API Reference
              activeSection === 'api' && Div(
                {},
                H2(
                  { class: "text-3xl font-bold mb-6" },
                  "API Reference"
                ),
                P(
                  { class: "text-lg text-secondary mb-8" },
                  "Complete API documentation for all BUBLOJS functions and hooks."
                ),

                H3(
                  { class: "text-2xl font-bold mb-6" },
                  "Hooks"
                ),
                Div(
                  { class: "space-y-4" },
                  Div(
                    { class: "card p-6" },
                    H4(
                      { class: "text-lg font-bold mb-2" },
                      "useState(initialValue)"
                    ),
                    P(
                      { class: "text-secondary" },
                      "Returns [state, setState] - Manages component state"
                    )
                  ),
                  Div(
                    { class: "card p-6" },
                    H4(
                      { class: "text-lg font-bold mb-2" },
                      "useEffect(callback, deps)"
                    ),
                    P(
                      { class: "text-secondary" },
                      "Runs side effects - Similar to React's useEffect"
                    )
                  ),
                  Div(
                    { class: "card p-6" },
                    H4(
                      { class: "text-lg font-bold mb-2" },
                      "useRef(initialValue)"
                    ),
                    P(
                      { class: "text-secondary" },
                      "Returns mutable ref object - Persists across renders"
                    )
                  ),
                  Div(
                    { class: "card p-6" },
                    H4(
                      { class: "text-lg font-bold mb-2" },
                      "useMemo(factory, deps)"
                    ),
                    P(
                      { class: "text-secondary" },
                      "Memoizes computed values - Optimizes performance"
                    )
                  ),
                  Div(
                    { class: "card p-6" },
                    H4(
                      { class: "text-lg font-bold mb-2" },
                      "useCallback(callback, deps)"
                    ),
                    P(
                      { class: "text-secondary" },
                      "Memoizes functions - Prevents unnecessary re-renders"
                    )
                  )
                ),

                H3(
                  { class: "text-2xl font-bold mb-6 mt-8" },
                  "HTML Elements"
                ),
                P(
                  { class: "text-secondary mb-6" },
                  "All standard HTML elements are available as functions:"
                ),
                Div(
                  { class: "space-y-4" },
                  Div(
                    { class: "card p-6" },
                    H4(
                      { class: "text-lg font-bold mb-2" },
                      "Div(props, ...children)"
                    ),
                    P(
                      { class: "text-secondary" },
                      "Creates div element with props and children"
                    )
                  ),
                  Div(
                    { class: "card p-6" },
                    H4(
                      { class: "text-lg font-bold mb-2" },
                      "Button(props, ...children)"
                    ),
                    P(
                      { class: "text-secondary" },
                      "Creates button element with props and children"
                    )
                  ),
                  Div(
                    { class: "card p-6" },
                    H4(
                      { class: "text-lg font-bold mb-2" },
                      "Input(props)"
                    ),
                    P(
                      { class: "text-secondary" },
                      "Creates input element with props"
                    )
                  ),
                  Div(
                    { class: "card p-6" },
                    H4(
                      { class: "text-lg font-bold mb-2" },
                      "P(props, ...children)"
                    ),
                    P(
                      { class: "text-secondary" },
                      "Creates paragraph element with props and children"
                    )
                  )
                )
              )
            )
          )
        )
      )
    ),

    // CTA Section
    Section(
      { class: "section bg-neutral-50" },
      Div(
        { class: "container" },
        Div(
          { class: "text-center" },
          H2(
            { class: "text-4xl font-bold mb-6" },
            "Ready to Start Building?"
          ),
          P(
            { class: "text-xl text-secondary max-w-2xl mx-auto mb-8" },
          "Now that you know the basics, it's time to build something amazing!"
        ),
          Div(
            { class: "flex gap-4 justify-center" },
            A(
              { href: requests.url("/demo"), class: "btn btn-gradient btn-lg" },
              "👀 Try Live Demos"
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
      title: "Code Example",
      subtitle: "Complete implementation example",
      code: modalCode,
      language: "javascript"
    })
  );
}

export default Docs;