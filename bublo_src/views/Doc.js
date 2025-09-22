import { createElement } from "../modules/dom.js";
import {
  H1, H2, H3, H4, P, Div, A, Section, Ul, Li, Code, Pre, Button, Span, Strong, Em
} from "../modules/html.js";
import { requests } from "../modules/requests.js";
import Layout from "./components/Layout.js";
import { useState } from "../modules/hooks.js";

export default function Docs() {
  const [activeSection, setActiveSection] = useState("getting-started");

  const sections = [
    { id: "getting-started", title: "Getting Started", icon: "🚀" },
    { id: "components", title: "Components", icon: "🧩" },
    { id: "hooks", title: "Hooks", icon: "🎣" },
    { id: "routing", title: "Routing", icon: "🛣️" },
    { id: "styling", title: "Styling", icon: "🎨" },
    { id: "api", title: "API Reference", icon: "📚" }
  ];

  const renderContent = () => {
    switch(activeSection) {
      case "getting-started":
        return (
          Div(
            { class: "doc-content" },
            H2({}, "Getting Started"),
            P({}, "Welcome to BUBLOJS! This guide will help you get up and running with our vanilla JavaScript SPA framework."),
            
            H3({}, "Installation"),
            P({}, "BUBLOJS requires no build tools or package managers. Simply download the framework files and include them in your project."),
            
            Pre(
              { class: "code-block" },
              Code({}, `<!-- Include in your HTML -->
<script type="module" src="./bublo_src/app/main.js"></script>

<!-- Your app container -->
<div id="app"></div>`)
            ),
            
            H3({}, "Quick Start"),
            P({}, "Create your first component:"),
            
            Pre(
              { class: "code-block" },
              Code({}, `// views/MyComponent.js
import { useState } from "../modules/hooks.js";
import { Div, H1, Button } from "../modules/html.js";

export default function MyComponent() {
  const [count, setCount] = useState(0);
  
  return Div(
    {},
    H1({}, \`Count: \${count}\`),
    Button(
      { onclick: () => setCount(count + 1) },
      "Increment"
    )
  );
}`)
            ),
            
            H3({}, "Add a Route"),
            P({}, "Register your component in the routes:"),
            
            Pre(
              { class: "code-block" },
              Code({}, `// routes/routes.js
const routes = {
  "/my-page": {
    title: "My Page",
    component: () => import("../views/MyComponent.js"),
    auth: false
  }
};`)
            )
          )
        );
        
      case "components":
        return (
          Div(
            { class: "doc-content" },
            H2({}, "Components"),
            P({}, "Components are the building blocks of BUBLOJS applications. They are functions that return virtual DOM elements."),
            
            H3({}, "Creating Components"),
            P({}, "Components are JavaScript functions that return JSX-like elements:"),
            
            Pre(
              { class: "code-block" },
              Code({}, `import { Div, H1, P } from "../modules/html.js";

export default function Welcome({ name }) {
  return Div(
    { class: "welcome-card" },
    H1({}, \`Hello, \${name}!\`),
    P({}, "Welcome to BUBLOJS!")
  );
}`)
            ),
            
            H3({}, "HTML Element Factories"),
            P({}, "BUBLOJS provides factory functions for all HTML elements:"),
            
            Pre(
              { class: "code-block" },
              Code({}, `import { 
  Div, H1, H2, H3, P, A, Button, Input, 
  Form, Ul, Li, Span, Strong, Em 
} from "../modules/html.js";

// Use them like JSX
const element = Div(
  { class: "container" },
  H1({}, "Title"),
  P({}, "Content")
);`)
            ),
            
            H3({}, "Props and Attributes"),
            P({}, "Pass props as the first argument to element factories:"),
            
            Pre(
              { class: "code-block" },
              Code({}, `Button(
  { 
    class: "btn-primary",
    onclick: handleClick,
    disabled: isLoading 
  },
  "Click Me"
)`)
            )
          )
        );
        
      case "hooks":
        return (
          Div(
            { class: "doc-content" },
            H2({}, "Hooks"),
            P({}, "BUBLOJS provides React-like hooks for state management and side effects."),
            
            H3({}, "useState"),
            P({}, "Manage component state with useState:"),
            
            Pre(
              { class: "code-block" },
              Code({}, `import { useState } from "../modules/hooks.js";

function Counter() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("Anonymous");
  
  return Div(
    {},
    H1({}, \`Hello \${name}\`),
    P({}, \`Count: \${count}\`),
    Button(
      { onclick: () => setCount(count + 1) },
      "Increment"
    )
  );
}`)
            ),
            
            H3({}, "useEffect"),
            P({}, "Handle side effects with useEffect:"),
            
            Pre(
              { class: "code-block" },
              Code({}, `import { useEffect } from "../modules/hooks.js";

function DataComponent() {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    fetch("/api/data")
      .then(response => response.json())
      .then(data => setData(data));
  }, []); // Empty deps = run once
  
  return Div({}, data.map(item => 
    Div({}, item.name)
  ));
}`)
            ),
            
            H3({}, "useRef"),
            P({}, "Access DOM elements with useRef:"),
            
            Pre(
              { class: "code-block" },
              Code({}, `import { useRef } from "../modules/hooks.js";

function InputComponent() {
  const inputRef = useRef(null);
  
  const focusInput = () => {
    inputRef.current.focus();
  };
  
  return Div(
    {},
    Input({ ref: inputRef }),
    Button({ onclick: focusInput }, "Focus")
  );
}`)
            )
          )
        );
        
      case "routing":
        return (
          Div(
            { class: "doc-content" },
            H2({}, "Routing"),
            P({}, "BUBLOJS provides client-side routing with authentication and role-based access control."),
            
            H3({}, "Route Configuration"),
            P({}, "Define routes in the routes.js file:"),
            
            Pre(
              { class: "code-block" },
              Code({}, `const routes = {
  "/": {
    title: "Home",
    component: () => import("../views/Home.js"),
    auth: false
  },
  "/dashboard": {
    title: "Dashboard", 
    component: () => import("../views/Dashboard.js"),
    auth: true,
    role: "user"
  },
  "/admin": {
    title: "Admin Panel",
    component: () => import("../views/Admin.js"),
    auth: true,
    role: "admin"
  }
};`)
            ),
            
            H3({}, "Navigation"),
            P({}, "Navigate programmatically or with links:"),
            
            Pre(
              { class: "code-block" },
              Code({}, `import { router } from "../modules/router.js";
import { requests } from "../modules/requests.js";

// Programmatic navigation
router.go("/dashboard");

// Using links
A({ href: requests.url("/dashboard") }, "Go to Dashboard");

// With route attribute
Button({ route: "/dashboard" }, "Navigate")`)
            )
          )
        );
        
      case "styling":
        return (
          Div(
            { class: "doc-content" },
            H2({}, "Styling"),
            P({}, "BUBLOJS provides multiple ways to style your components."),
            
            H3({}, "CSS Classes"),
            P({}, "Use CSS classes for styling:"),
            
            Pre(
              { class: "code-block" },
              Code({}, `Div({ class: "my-component" }, "Content")

// In your CSS
.my-component {
  background: var(--surface-color);
  padding: var(--spacing-md);
  border-radius: var(--radius);
}`)
            ),
            
            H3({}, "Dynamic Styles"),
            P({}, "Inject styles dynamically:"),
            
            Pre(
              { class: "code-block" },
              Code({}, `import { Style, AddStyle } from "../modules/style.js";

// Simple CSS
Style(\`
  .my-component {
    background: #f0f0f0;
    padding: 20px;
  }
\`);

// Advanced styling
AddStyle([{
  selector: ".button",
  styles: {
    backgroundColor: "#007bff",
    color: "white",
    padding: "10px 20px"
  },
  hover: {
    backgroundColor: "#0056b3"
  }
}]);`)
            )
          )
        );
        
      case "api":
        return (
          Div(
            { class: "doc-content" },
            H2({}, "API Reference"),
            P({}, "Complete reference for BUBLOJS APIs and utilities."),
            
            H3({}, "Core Modules"),
            Ul(
              { class: "api-list" },
              Li({}, Strong({}, "dom.js"), " - Virtual DOM implementation"),
              Li({}, Strong({}, "hooks.js"), " - React-like hooks"),
              Li({}, Strong({}, "router.js"), " - Client-side routing"),
              Li({}, Strong({}, "html.js"), " - HTML element factories"),
              Li({}, Strong({}, "style.js"), " - Dynamic styling"),
              Li({}, Strong({}, "requests.js"), " - URL utilities"),
              Li({}, Strong({}, "fetchRequest.js"), " - HTTP client")
            ),
            
            H3({}, "Utility Functions"),
            P({}, "BUBLOJS includes comprehensive utility functions:"),
            
            Pre(
              { class: "code-block" },
              Code({}, `import AppHelper from "../app/AppHelper.js";

// String utilities
AppHelper.toCamelCase("hello-world"); // "helloWorld"
AppHelper.toSlug("Hello World!"); // "hello-world"

// Date utilities  
AppHelper.formatDate(new Date()); // "January 1, 2024"
AppHelper.getCurrentDate(); // "2024-01-01"

// Array utilities
AppHelper.removeDuplicates([1, 2, 2, 3]); // [1, 2, 3]

// Validation
AppHelper.isValidEmail("user@example.com"); // true
AppHelper.isValidURL("https://example.com"); // true`)
            )
          )
        );
        
      default:
        return Div({}, "Select a section to view documentation");
    }
  };

  return Layout(
    Section(
      { class: "docs-section" },
      Div(
        { class: "docs-container" },
        Div(
          { class: "docs-sidebar" },
          H2({ class: "sidebar-title" }, "Documentation"),
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
          { class: "docs-main" },
          renderContent()
        )
      )
    )
  );
}
