import AppHelper from "../app/AppHelper.js";
import routes from "../routes/routes.js";

const Config = {
  // App State Management
  registeredComponents: {}, // Use Map for better performance with large state
  componentState: new Map(), // Use Map for better performance with large state
  appState: new Map(), // Use Map for better performance with large state
  webpCache: new Map(),
  appCache: new Set(), // Use Set for unique entries
  routes,

  // App Configuration
  appRoot: document.querySelector("#app"),
  appName: "BUBLOJS",
  appVersion: "1.0.0",
  appUrl: "http://localhost/apps/js/bublojs",
  baseUrl: AppHelper.appOrigin() + "/apps/js/bublojs",
  appKey: "ytca_1234",
  contactMail: "contact@getserv.online",

  api: {
    baseUrl: "http://localhost/apps/js/bublojs/api",
    endpoints: {
      signup: () => `${Config.api.baseUrl}/signup`,
      login: () => `${Config.api.baseUrl}/login`,
      logout: () => `${Config.api.baseUrl}/logout`,
      userProfile: () => `${Config.api.baseUrl}/profile`,
      userUpdate: () => `${Config.api.baseUrl}/update-profile`,
      userHistory: () => `${Config.api.baseUrl}/user-history`,
    },
  },

  session: {
    tokenKey: "authToken",
    refreshToken: "refreshToken",
    userRoleKey: "userRole",
    userProfile: "userProfile",
    timeout: "expired",
  },

  roles: { admin: "admin", user: "user", guest: "guest" },

  isLogged: () => !!Config.storage.get(Config.session.userProfile),

  user: () =>
    Config.isLogged()
      ? JSON.parse(Config.storage.get(Config.session.userProfile))
      : { username: "Guest", email: "" },

  login: async (data) => {
    Config.storage.set(Config.session.tokenKey, data.access_token);
    Config.storage.set(Config.session.refreshToken, data.refresh_token);
    Config.storage.set(Config.session.userRoleKey, data.role);
    Config.storage.set(Config.session.userProfile, JSON.stringify(data.user));
    Config.storage.set(Config.session.timeout, data.timeout);
  },

  logout: async () => {
    Config.storage.remove(Config.session.tokenKey);
    Config.storage.remove(Config.session.refreshToken);
    Config.storage.remove(Config.session.userRoleKey);
    Config.storage.remove(Config.session.userProfile);
    Config.storage.remove(Config.session.timeout);
  },

  settings: {
    defaultLanguage: "en",
    supportedLanguages: ["en", "es", "fr"],
    theme: "light",
  },

  constants: {
    maxUploadSize: 5 * 1024 * 1024,
    paginationLimit: 10,
  },

  utils: {
    getSessionToken: () => Config.storage.get(Config.session.tokenKey),
    isUserLoggedIn: () => !!Config.storage.get(Config.session.userProfile),
    getUserRole: () =>
      Config.storage.get(Config.session.userRoleKey) || "guest",
  },

  styles: {
    primaryColor: "#3498db",
    secondaryColor: "#2ecc71",
    errorColor: "#e74c3c",
    defaultFont: "Arial, sans-serif",
  },

  storage: {
    set(key, value) {
      localStorage.setItem(`${Config.appKey}-${key}`, JSON.stringify(value));
    },
    get(key) {
      const item = localStorage.getItem(`${Config.appKey}-${key}`);
      return item ? JSON.parse(item) : null;
    },
    check(key) {
      return localStorage.getItem(`${Config.appKey}-${key}`) !== null;
    },
    remove(key) {
      localStorage.removeItem(`${Config.appKey}-${key}`);
    },
  },
};


export default Config;
