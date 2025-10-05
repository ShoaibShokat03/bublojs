export const documentEvents = {
  onDomContentLoaded(callback) {
      if (document.readyState === "loading") {
          document.addEventListener("DOMContentLoaded", callback);
      } else {
          callback();
      }
  }
};