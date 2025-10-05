const Helper = {
  // Remove trailing slash from a path
  removeEndSlash(path) {
    if (path.length > 1 && path.endsWith("/")) {
      let removedSlashes = path.slice(0, path.length - 1);
      if (removedSlashes.length === 0) {
        removedSlashes = "/";
      }
      return removedSlashes;
    } else {
      if (path.length === 0) {
        path = "/";
      }
      return path;
    }
  },

  // Add leading slash if not present
  addLeadingSlash(path) {
    if (!path.startsWith("/")) {
      return `/${path}`;
    }
    return path;
  },

  // Format query parameters from an object
  formatQueryParams(params) {
    return Object.keys(params)
      .map(
        (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
      )
      .join("&");
  },

  // Parse query parameters into an object
  parseQueryParams(queryString) {
    return queryString
      .replace(/^\?/, "")
      .split("&")
      .reduce((acc, pair) => {
        const [key, value] = pair.split("=").map(decodeURIComponent);
        acc[key] = value;
        return acc;
      }, {});
  },

  // Check if a string is a valid URL
  isValidURL(str) {
    const pattern = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z0-9]{2,6}(\/[^\s]*)?$/;
    return pattern.test(str);
  },

  // Convert a string to camelCase
  toCamelCase(str) {
    return str
      .replace(/[-_ ]+./g, (match) =>
        match.charAt(match.length - 1).toUpperCase()
      )
      .replace(/^[A-Z]/, (match) => match.toLowerCase());
  },

  // Capitalize the first letter of a string
  capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  // Generate a UUID (Version 4)
  generateUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
      const random = (Math.random() * 16) | 0;
      const value = char === "x" ? random : (random & 0x3) | 0x8;
      return value.toString(16);
    });
  },

  // Deep clone an object
  deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  },

  // Check if two objects are deeply equal
  deepEqual(obj1, obj2) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  },

  // Debounce a function
  debounce(fn, delay) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), delay);
    };
  },

  // Throttle a function
  throttle(fn, limit) {
    let lastCall = 0;
    return function (...args) {
      const now = Date.now();
      if (now - lastCall >= limit) {
        lastCall = now;
        fn.apply(this, args);
      }
    };
  },

  // Get a query parameter value by name
  getQueryParam(name, queryString = window.location.search) {
    const params = new URLSearchParams(queryString);
    return params.get(name);
  },

  // Format a date to a readable string
  formatDate(
    date,
    options = { year: "numeric", month: "long", day: "numeric" }
  ) {
    return new Date(date).toLocaleDateString(undefined, options);
  },

  // Safely access a nested object property
  getNestedValue(obj, path, defaultValue = undefined) {
    return path
      .split(".")
      .reduce(
        (acc, key) => (acc && acc[key] !== undefined ? acc[key] : defaultValue),
        obj
      );
  },

  // Convert bytes to a readable size format (e.g., KB, MB, GB)
  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  },

  // Check if an object is empty
  isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
  },

  // Check if an email is valid
  isValidEmail(email) {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  },

  // Convert a number to currency format
  formatCurrency(amount, currency = "USD", locale = "en-US") {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(amount);
  },

  // Generate random integer between min and max
  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  // Convert an array to an object with keys as the values of a given property
  arrayToObject(array, key) {
    return array.reduce((obj, item) => {
      obj[item[key]] = item;
      return obj;
    }, {});
  },

  // Deep merge two objects (useful for state updates in frameworks like React)
  deepMerge(target, source) {
    for (const key in source) {
      if (source[key] && source[key].constructor === Object) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        this.deepMerge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
    return target;
  },

  // Get the current timestamp in a human-readable format
  getTimestamp() {
    const now = new Date();
    return `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
  },

  // Convert an array of objects to a Map (useful for key-value pairs)
  arrayToMap(array, key) {
    return new Map(array.map((item) => [item[key], item]));
  },

  // Format a phone number (assuming US format)
  formatPhoneNumber(phone) {
    const cleaned = ("" + phone).replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return null;
  },

  // Calculate the difference between two dates (in days)
  dateDiffInDays(date1, date2) {
    const diffTime = Math.abs(new Date(date2) - new Date(date1));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },

  // Check if a number is even
  isEven(number) {
    return number % 2 === 0;
  },

  // Check if a number is odd
  isOdd(number) {
    return number % 2 !== 0;
  },

  // Convert a string to lowercase and remove extra spaces
  cleanString(str) {
    return str.trim().toLowerCase().replace(/\s+/g, " ");
  },

  // Capitalize each word in a string
  capitalizeWords(str) {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  },

  // Convert a string to a slug (useful for URL-friendly strings)
  toSlug(str) {
    return str
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  },

  // Get the first X elements from an array
  getFirstXElements(array, x) {
    return array.slice(0, x);
  },

  // Get the last X elements from an array
  getLastXElements(array, x) {
    return array.slice(-x);
  },

  // Find the largest number in an array
  findMaxInArray(array) {
    return Math.max(...array);
  },

  // Find the smallest number in an array
  findMinInArray(array) {
    return Math.min(...array);
  },

  // Sort an array of numbers in ascending order
  sortNumbersAsc(array) {
    return array.sort((a, b) => a - b);
  },

  // Sort an array of numbers in descending order
  sortNumbersDesc(array) {
    return array.sort((a, b) => b - a);
  },

  // Check if a given string is a palindrome
  isPalindrome(str) {
    const cleanStr = str.replace(/[^a-z0-9]/gi, "").toLowerCase();
    return cleanStr === cleanStr.split("").reverse().join("");
  },

  // Convert seconds to a readable time format (HH:MM:SS)
  secondsToTimeFormat(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  },

  // Add a leading zero to single-digit numbers
  addLeadingZero(num) {
    return num < 10 ? `0${num}` : num;
  },

  // Generate a random hex color code
  generateRandomHexColor() {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return `#${randomColor.padStart(6, "0")}`;
  },

  // Get the last day of the current month
  getLastDayOfMonth() {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  },

  // Convert a string to title case
  toTitleCase(str) {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  },

  // Check if the number is a valid integer
  isValidInteger(num) {
    return Number.isInteger(num);
  },

  // Format a date to a custom format (e.g., 'YYYY-MM-DD')
  formatDateCustom(date, format = "YYYY-MM-DD") {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return format.replace("YYYY", year).replace("MM", month).replace("DD", day);
  },

  // Get the current date in ISO format (YYYY-MM-DD)
  getCurrentDate() {
    return new Date().toISOString().split("T")[0];
  },

  // Get the current time in HH:MM:SS format
  getCurrentTime() {
    return new Date().toLocaleTimeString();
  },

  // Check if a number is a prime number
  isPrime(num) {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) return false;
    }
    return true;
  },

  // Get the next n days from the current date
  getNextNDays(n) {
    const days = [];
    const currentDate = new Date();
    for (let i = 1; i <= n; i++) {
      const nextDate = new Date();
      nextDate.setDate(currentDate.getDate() + i);
      days.push(nextDate.toISOString().split("T")[0]);
    }
    return days;
  },

  // Generate a GUID (Globally Unique Identifier)
  generateGUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  },

  // a small uniq random string with timestamp
  generateUniqueString() {
    return `${Date.now().toString(36)}${Math.random()
      .toString(36)
      .substr(2, 9)}`;
  },

  // Convert a query string to an object
  queryStringToObject(queryString) {
    return queryString
      .slice(1)
      .split("&")
      .reduce((acc, pair) => {
        const [key, value] = pair.split("=");
        acc[decodeURIComponent(key)] = decodeURIComponent(value);
        return acc;
      }, {});
  },

  // Get the query string of the current page URL
  getQueryString() {
    return window.location.search;
  },

  // Generate a random boolean value (true or false)
  getRandomBoolean() {
    return Math.random() < 0.5;
  },

  // Convert an object to a query string
  objectToQueryString(obj) {
    return Object.keys(obj)
      .map(
        (key) => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`
      )
      .join("&");
  },

  // Get the day of the week (e.g., 'Monday')
  getDayOfWeek(date) {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[new Date(date).getDay()];
  },

  // Check if a number is within a specified range (inclusive)
  isWithinRange(num, min, max) {
    return num >= min && num <= max;
  },

  // Remove duplicate values from an array
  removeDuplicates(array) {
    return [...new Set(array)];
  },

  // Check if an object is empty (has no keys)
  isEmpty(obj) {
    return Object.keys(obj).length === 0;
  },

  // Return the current month and year as 'MM-YYYY'
  getCurrentMonthYear() {
    const date = new Date();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${month}-${year}`;
  },

  // Convert a string to a number
  stringToNumber(str) {
    return parseFloat(str);
  },

  // Convert a number to a string
  numberToString(num) {
    return num.toString();
  },

  // Get the previous n days from the current date
  getPreviousNDays(n) {
    const days = [];
    const currentDate = new Date();
    for (let i = 1; i <= n; i++) {
      const prevDate = new Date();
      prevDate.setDate(currentDate.getDate() - i);
      days.push(prevDate.toISOString().split("T")[0]);
    }
    return days;
  },

  // Create a new object with only the specified keys from an existing object
  pick(obj, keys) {
    return keys.reduce((acc, key) => {
      if (obj[key]) acc[key] = obj[key];
      return acc;
    }, {});
  },

  // Check if a string starts with a given substring
  startsWith(str, substring) {
    return str.startsWith(substring);
  },

  // Check if a string ends with a given substring
  endsWith(str, substring) {
    return str.endsWith(substring);
  },

  // Get the number of characters in a string (ignoring spaces)
  getStringLengthWithoutSpaces(str) {
    return str.replace(/\s+/g, "").length;
  },

  // Return a random item from an array
  getRandomItemFromArray(array) {
    return array[Math.floor(Math.random() * array.length)];
  },

  // Check if a string contains a given substring
  containsSubstring(str, substring) {
    return str.includes(substring);
  },

  // Remove a specified item from an array
  removeItemFromArray(array, item) {
    return array.filter((i) => i !== item);
  },

  // Find the index of an item in an array
  findIndexInArray(array, item) {
    return array.indexOf(item);
  },

  // Convert an array of objects to an array of a specific property values
  pluck(array, prop) {
    return array.map((item) => item[prop]);
  },

  // Check if a number is within a given range
  isNumberInRange(num, range) {
    return num >= range[0] && num <= range[1];
  },

  // Generate an array with the numbers in a given range
  rangeArray(min, max) {
    return Array.from({ length: max - min + 1 }, (_, i) => min + i);
  },

  // Compare two arrays (returns true if equal)
  arraysAreEqual(array1, array2) {
    return (
      array1.length === array2.length &&
      array1.every((value, index) => value === array2[index])
    );
  },

  // Add a class to an element
  addClassToElement(element, className) {
    element.classList.add(className);
  },

  // Remove a class from an element
  removeClassFromElement(element, className) {
    element.classList.remove(className);
  },

  // Toggle a class on an element
  toggleClassOnElement(element, className) {
    element.classList.toggle(className);
  },

  // Execute a function when the document is ready
  documentReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  },

  // Get the current viewport width
  getViewportWidth() {
    return window.innerWidth || document.documentElement.clientWidth;
  },

  // Get the current viewport height
  getViewportHeight() {
    return window.innerHeight || document.documentElement.clientHeight;
  },

  appOrigin: () => {
    const origin = window.location.origin;
    return origin.endsWith("/") ? origin.slice(0, -1) : origin;
  },
  appBaseDirectory: () => {
    const baseDir = document.querySelector("base")?.getAttribute("href") || "/";
    return baseDir.endsWith("/") ? baseDir.slice(0, -1) : baseDir;
  },
  getBaseUrl: () => {
    const baseURL = window.location.href;
    return baseURL.endsWith("/") ? baseURL.slice(0, -1) : baseURL;
  },

};


export default Helper;
