import { requests } from "./requests.js";
import { router } from "./router.js";

export default class Forms {
  constructor(selector) {
    this.self = document.querySelector(selector);
    this.data = new FormData(this.self);
  }
  navigateOnSubmit(pathname = null) {
    this.self.addEventListener("submit", (event) => {
      event.preventDefault();
      const button = this.self.querySelector("button[type='submit']");
      const btnText = button.innerHTML;
      button.textContent = "Submitting...";
      if (pathname == null) {
        pathname = this.self.action;
      }
      let newUrlPath = pathname;
      console.log(newUrlPath);
      const names = this.self.querySelectorAll("*[name]");
      console.log(names.length);
      names.forEach((element) => {
        const name = element.getAttribute("name");
        const value = element.value;
        requests.setNewUrl(pathname, name, value);
      });
      console.log(window.location.pathname);
      router.navigate(window.location.pathname);
      button.textContent = btnText;
    });
  }
/*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Attaches a submit event listener to the form element. 
   * If a callback is provided, it will be executed when the form is submitted.
   * The form submission is prevented by default.
   *
   * @param {Function|null} callback - A function to be called upon form submission.
   */

/*******  afaba3f9-87d8-4484-ae22-1adac4302071  *******/
  onSubmit(callback = null) {
    this.self.addEventListener("submit", (event) => {
      event.preventDefault();
      if (callback != null) {
        callback();
      }
    });
  }
}
