# BUBLOJS - Vanilla JavaScript SPA Framework

A lightweight, fast, and scalable Single Page Application framework built with vanilla JavaScript. BUBLOJS provides React-like features including Virtual DOM, hooks, routing, and component-based architecture without the overhead of external dependencies.

## 🚀 Features

- **Virtual DOM**: Efficient DOM diffing and updates
- **React-like Hooks**: `useState`, `useEffect`, `useRef`, `useMemo`
- **Component-based Architecture**: Reusable components with props
- **Client-side Routing**: Hash-based and history API routing
- **State Management**: Global and component-level state
- **Event System**: Lifecycle events and custom event handling
- **Styling System**: Dynamic CSS injection and management
- **HTTP Client**: Advanced fetch wrapper with progress tracking
- **Authentication**: Built-in session management
- **Utility Functions**: Comprehensive helper functions
- **TypeScript Ready**: Modern ES6+ modules

## 📁 Project Structure

```
bublojs/
├── bublo_src/
│   ├── app/                    # Application entry points
│   │   ├── main.js            # Main application bootstrap
│   │   ├── AppHelper.js       # Utility functions
│   │   ├── Before_Load.js     # Pre-loading setup
│   │   ├── After_Load.js      # Post-loading cleanup
│   │   └── Load_On_VDOM.js    # VDOM lifecycle hooks
│   ├── config/
│   │   └── config.js          # Application configuration
│   ├── modules/               # Core framework modules
│   │   ├── dom.js            # Virtual DOM implementation
│   │   ├── html.js           # HTML element factories
│   │   ├── hooks.js          # React-like hooks
│   │   ├── router.js         # Routing system
│   │   ├── Events.js         # Event system
│   │   ├── requests.js       # URL utilities
│   │   ├── route_navigator.js # Navigation handling
│   │   ├── style.js          # Dynamic styling
│   │   └── fetchRequest.js   # HTTP client
│   ├── routes/
│   │   └── routes.js         # Route definitions
│   ├── views/                # Application views/components
│   │   ├── components/       # Reusable components
│   │   ├── Home.js          # Home page
│   │   ├── Crud.js          # CRUD example
│   │   └── ...
│   ├── styles/
│   │   └── style.css        # Global styles
│   └── data/               # Static data
├── backend/                # Backend data
├── index.php              # Entry point
└── README.md
```

## 🛠️ Installation & Setup

1. **Clone or download the framework**
2. **Set up a local server** (required for ES6 modules):
   ```bash
   # Using PHP built-in server
   php -S localhost:8000
   
   # Or using Node.js serve
   npx serve .
   
   # Or using Python
   python -m http.server 8000
   ```

3. **Access the application**:
   ```
   http://localhost:8000
   ```

## 🎯 Quick Start

### Basic Component

```javascript
// views/MyComponent.js
import { Div, H1, Button } from "../modules/html.js";
import { useState } from "../modules/hooks.js";

export default function MyComponent() {
  const [count, setCount] = useState(0);
  
  return Div(
    {},
    H1({}, `Count: ${count}`),
    Button(
      { onClick: () => setCount(count + 1) },
      "Increment"
    )
  );
}
```

### Adding a Route

```javascript
// routes/routes.js
const routes = {
  "/my-page": {
    title: "My Page",
    description: "A custom page",
    component: () => import("../views/MyComponent.js"),
    auth: false, // Optional: require authentication
    role: "user" // Optional: require specific role
  }
};
```

## 📚 Core Concepts

### Virtual DOM

BUBLOJS uses a Virtual DOM for efficient updates:

```javascript
import { createElement, render } from "../modules/dom.js";

// Create virtual elements
const vNode = createElement("div", { class: "container" }, "Hello World");

// Render to DOM
render(() => vNode, document.getElementById("app"));
```

### HTML Element Factories

Use capitalized HTML element functions for JSX-like syntax:

```javascript
import { Div, H1, Button, Input } from "../modules/html.js";

const component = Div(
  { class: "container" },
  H1({}, "Welcome"),
  Input({ type: "text", placeholder: "Enter name" }),
  Button({ onClick: handleClick }, "Submit")
);
```

### State Management with Hooks

#### useState Hook

```javascript
import { useState } from "../modules/hooks.js";

function Counter() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("Anonymous");
  
  return Div(
    {},
    H1({}, `Hello ${name}`),
    P({}, `Count: ${count}`),
    Button({ onClick: () => setCount(count + 1) }, "Increment"),
    Button({ onClick: () => setName("John") }, "Change Name")
  );
}
```

#### useEffect Hook

```javascript
import { useEffect } from "../modules/hooks.js";

function DataComponent() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch("/api/data")
      .then(response => response.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, []); // Empty dependency array = run once
  
  if (loading) return Div({}, "Loading...");
  
  return Div({}, data.map(item => Div({}, item.name)));
}
```

#### useRef Hook

```javascript
import { useRef } from "../modules/hooks.js";

function InputComponent() {
  const inputRef = useRef(null);
  
  const focusInput = () => {
    inputRef.current.focus();
  };
  
  return Div(
    {},
    Input({ ref: inputRef, placeholder: "Type here" }),
    Button({ onClick: focusInput }, "Focus Input")
  );
}
```

#### useMemo Hook

```javascript
import { useMemo } from "../modules/hooks.js";

function ExpensiveComponent({ items }) {
  const expensiveValue = useMemo(() => {
    return items.reduce((sum, item) => sum + item.value, 0);
  }, [items]); // Recalculate only when items change
  
  return Div({}, `Total: ${expensiveValue}`);
}
```

### Routing System

#### Route Configuration

```javascript
// routes/routes.js
const routes = {
  "/": {
    title: "Home",
    description: "Welcome page",
    component: () => import("../views/Home.js"),
    auth: false
  },
  "/dashboard": {
    title: "Dashboard",
    description: "User dashboard",
    component: () => import("../views/Dashboard.js"),
    auth: true,
    role: "user"
  },
  "/admin": {
    title: "Admin Panel",
    description: "Administrative interface",
    component: () => import("../views/Admin.js"),
    auth: true,
    role: "admin"
  }
};
```

#### Navigation

```javascript
import { router } from "../modules/router.js";
import { requests } from "../modules/requests.js";

// Programmatic navigation
router.go("/dashboard");

// Using links
A({ href: requests.url("/dashboard") }, "Go to Dashboard");

// With route attribute
Button({ route: "/dashboard" }, "Navigate");
```

### Event System

```javascript
import { events } from "../modules/Events.js";

function MyComponent() {
  events.onVirtualDOMLoad(() => {
    console.log("Component mounted");
  });
  
  events.onVirtualDOMUpdate(() => {
    console.log("Component updated");
  });
  
  events.onBeforeVirtualDOMMount(() => {
    console.log("Before mounting");
  });
  
  return Div({}, "My Component");
}
```

### Styling System

#### Dynamic Styles

```javascript
import { Style, AddStyle } from "../modules/style.js";

// Simple CSS string
Style(`
  .my-component {
    background: #f0f0f0;
    padding: 20px;
  }
`);

// Advanced styling with pseudo-classes and media queries
AddStyle([
  {
    selector: ".button",
    styles: {
      backgroundColor: "#007bff",
      color: "white",
      padding: "10px 20px",
      border: "none",
      borderRadius: "4px"
    },
    hover: {
      backgroundColor: "#0056b3"
    },
    mediaQueries: [
      {
        condition: "max-width: 768px",
        styles: {
          padding: "8px 16px",
          fontSize: "14px"
        }
      }
    ]
  }
]);
```

### HTTP Requests

```javascript
import { fetchRequest } from "../modules/fetchRequest.js";

// Simple GET request
const data = await fetchRequest({
  url: "/api/users",
  onSuccess: (response) => console.log("Success:", response),
  onError: (error) => console.error("Error:", error)
});

// POST request with progress tracking
const result = await fetchRequest({
  url: "/api/upload",
  method: "POST",
  body: { name: "John", email: "john@example.com" },
  headers: { "Content-Type": "application/json" },
  onProgress: (progress) => {
    console.log(`Upload: ${progress.progress}%`);
  },
  timeout: 10000
});
```

### Configuration

```javascript
// config/config.js
const Config = {
  appName: "My App",
  appVersion: "1.0.0",
  baseUrl: "http://localhost:8000",
  
  api: {
    baseUrl: "http://localhost:8000/api",
    endpoints: {
      users: () => `${Config.api.baseUrl}/users`,
      posts: () => `${Config.api.baseUrl}/posts`
    }
  },
  
  session: {
    tokenKey: "authToken",
    userProfile: "userProfile"
  },
  
  storage: {
    set(key, value) {
      localStorage.setItem(`${Config.appKey}-${key}`, JSON.stringify(value));
    },
    get(key) {
      const item = localStorage.getItem(`${Config.appKey}-${key}`);
      return item ? JSON.parse(item) : null;
    }
  }
};
```

## 🎨 Advanced Examples

### CRUD Application

```javascript
// views/CrudExample.js
import { useState, useEffect } from "../modules/hooks.js";
import { Div, Form, Input, Button, Ul, Li, H1 } from "../modules/html.js";
import { fetchRequest } from "../modules/fetchRequest.js";

export default function CrudExample() {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [editingId, setEditingId] = useState(null);
  
  useEffect(() => {
    loadItems();
  }, []);
  
  const loadItems = async () => {
    try {
      const data = await fetchRequest({
        url: "/api/items",
        onSuccess: (response) => setItems(response.data)
      });
    } catch (error) {
      console.error("Failed to load items:", error);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        // Update existing item
        await fetchRequest({
          url: `/api/items/${editingId}`,
          method: "PUT",
          body: formData
        });
      } else {
        // Create new item
        await fetchRequest({
          url: "/api/items",
          method: "POST",
          body: formData
        });
      }
      
      setFormData({ name: "", email: "" });
      setEditingId(null);
      loadItems();
    } catch (error) {
      console.error("Failed to save item:", error);
    }
  };
  
  const handleEdit = (item) => {
    setFormData(item);
    setEditingId(item.id);
  };
  
  const handleDelete = async (id) => {
    try {
      await fetchRequest({
        url: `/api/items/${id}`,
        method: "DELETE"
      });
      loadItems();
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };
  
  return Div(
    {},
    H1({}, "CRUD Example"),
    
    Form(
      { onSubmit: handleSubmit },
      Input({
        type: "text",
        placeholder: "Name",
        value: formData.name,
        onInput: (e) => setFormData({ ...formData, name: e.target.value })
      }),
      Input({
        type: "email",
        placeholder: "Email",
        value: formData.email,
        onInput: (e) => setFormData({ ...formData, email: e.target.value })
      }),
      Button({ type: "submit" }, editingId ? "Update" : "Create")
    ),
    
    Ul(
      {},
      items.map(item => 
        Li(
          { key: item.id },
          `${item.name} - ${item.email}`,
          Button({ onClick: () => handleEdit(item) }, "Edit"),
          Button({ onClick: () => handleDelete(item.id) }, "Delete")
        )
      )
    )
  );
}
```

### Authentication System

```javascript
// views/Login.js
import { useState } from "../modules/hooks.js";
import { Div, Form, Input, Button, H1 } from "../modules/html.js";
import { fetchRequest } from "../modules/fetchRequest.js";
import { router } from "../modules/router.js";
import Config from "../config/config.js";

export default function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetchRequest({
        url: Config.api.endpoints.login(),
        method: "POST",
        body: credentials
      });
      
      // Store authentication data
      Config.login(response);
      
      // Redirect to dashboard
      router.go("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return Div(
    { class: "login-container" },
    Form(
      { onSubmit: handleLogin },
      H1({}, "Login"),
      Input({
        type: "email",
        placeholder: "Email",
        value: credentials.email,
        onInput: (e) => setCredentials({ ...credentials, email: e.target.value }),
        required: true
      }),
      Input({
        type: "password",
        placeholder: "Password",
        value: credentials.password,
        onInput: (e) => setCredentials({ ...credentials, password: e.target.value }),
        required: true
      }),
      Button(
        { type: "submit", disabled: loading },
        loading ? "Logging in..." : "Login"
      )
    )
  );
}
```

### Layout Component

```javascript
// views/components/Layout.js
import { Div, Header, Main, Footer } from "../../modules/html.js";
import MainHeader from "./MainHeader.js";
import MainFooter from "./MainFooter.js";

export default function Layout(...children) {
  return Div(
    { class: "app-layout" },
    Header({}, MainHeader()),
    Main({ class: "main-content" }, ...children),
    Footer({}, MainFooter())
  );
}
```

## 🔧 Utility Functions

BUBLOJS includes a comprehensive set of utility functions in `AppHelper.js`:

```javascript
import AppHelper from "../app/AppHelper.js";

// String utilities
const camelCase = AppHelper.toCamelCase("hello-world"); // "helloWorld"
const slug = AppHelper.toSlug("Hello World!"); // "hello-world"
const titleCase = AppHelper.toTitleCase("hello world"); // "Hello World"

// Date utilities
const formattedDate = AppHelper.formatDate(new Date()); // "January 1, 2024"
const currentDate = AppHelper.getCurrentDate(); // "2024-01-01"

// Array utilities
const unique = AppHelper.removeDuplicates([1, 2, 2, 3]); // [1, 2, 3]
const randomItem = AppHelper.getRandomItemFromArray([1, 2, 3]); // Random item

// Object utilities
const cloned = AppHelper.deepClone({ name: "John", age: 30 });
const isEmpty = AppHelper.isEmptyObject({}); // true

// Validation
const isValidEmail = AppHelper.isValidEmail("user@example.com"); // true
const isValidURL = AppHelper.isValidURL("https://example.com"); // true

// Performance utilities
const debouncedFn = AppHelper.debounce(() => console.log("Hello"), 300);
const throttledFn = AppHelper.throttle(() => console.log("Hello"), 1000);
```

## 🚀 Performance Tips

1. **Use keys for list items** to optimize Virtual DOM diffing:
   ```javascript
   Ul({}, items.map(item => Li({ key: item.id }, item.name)))
   ```

2. **Memoize expensive calculations**:
   ```javascript
   const expensiveValue = useMemo(() => {
     return heavyCalculation(data);
   }, [data]);
   ```

3. **Optimize useEffect dependencies**:
   ```javascript
   useEffect(() => {
     // Only runs when specific values change
   }, [dependency1, dependency2]);
   ```

4. **Use CSS classes instead of inline styles** for better performance:
   ```javascript
   Div({ class: "my-component" }, "Content")
   ```

## 🐛 Debugging

Enable debug mode in the browser console:

```javascript
// Access global state
console.log(Config.appState);
console.log(Config.componentState);

// Monitor route changes
router.navigate = (route) => {
  console.log("Navigating to:", route);
  return originalNavigate(route);
};
```

## 📝 Best Practices

1. **Component Structure**: Keep components small and focused
2. **State Management**: Use local state for component-specific data, global state for shared data
3. **Error Handling**: Always handle errors in async operations
4. **Code Organization**: Group related functionality in modules
5. **Performance**: Use keys for dynamic lists and memoization for expensive operations
6. **Accessibility**: Include proper ARIA labels and semantic HTML

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

For questions, issues, or contributions, please:
- Open an issue on GitHub
- Check the documentation
- Review the example code

---

**BUBLOJS** - Building fast, scalable SPAs with vanilla JavaScript! 🚀
