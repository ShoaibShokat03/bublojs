export const events = {
  // Called when the virtual DOM is first loaded or created
  onVirtualDOMLoad(callback) {
    if (typeof callback === "function") {
      this._simulateLifecycleEvent("onVirtualDOMLoad", callback);
    } else {
      console.warn("onVirtualDOMLoad expects a function as a callback");
    }
  },

  // Called when the virtual DOM is updated or rerendered
  onVirtualDOMUpdate(callback) {
    if (typeof callback === "function") {
      this._simulateLifecycleEvent("onVirtualDOMUpdate", callback);
    } else {
      console.warn("onVirtualDOMUpdate expects a function as a callback");
    }
  },

  // Called before an element is added to the virtual DOM
  onBeforeVirtualDOMMount(callback) {
    if (typeof callback === "function") {
      this._simulateLifecycleEvent("onBeforeVirtualDOMMount", callback);
    } else {
      console.warn("onBeforeVirtualDOMMount expects a function as a callback");
    }
  },

  // Called after an element is mounted (added) to the virtual DOM
  onAfterVirtualDOMMount(callback) {
    if (typeof callback === "function") {
      this._simulateLifecycleEvent("onAfterVirtualDOMMount", callback);
    } else {
      console.warn("onAfterVirtualDOMMount expects a function as a callback");
    }
  },

  // Called before an element is updated in the virtual DOM
  onBeforeVirtualDOMUpdate(callback) {
    if (typeof callback === "function") {
      this._simulateLifecycleEvent("onBeforeVirtualDOMUpdate", callback);
    } else {
      console.warn("onBeforeVirtualDOMUpdate expects a function as a callback");
    }
  },

  // Called after an element is updated in the virtual DOM
  onAfterVirtualDOMUpdate(callback) {
    if (typeof callback === "function") {
      this._simulateLifecycleEvent("onAfterVirtualDOMUpdate", callback);
    } else {
      console.warn("onAfterVirtualDOMUpdate expects a function as a callback");
    }
  },

  // Called before an element is removed from the virtual DOM
  onBeforeVirtualDOMUnmount(callback) {
    if (typeof callback === "function") {
      this._simulateLifecycleEvent("onBeforeVirtualDOMUnmount", callback);
    } else {
      console.warn(
        "onBeforeVirtualDOMUnmount expects a function as a callback"
      );
    }
  },

  // Called after an element is removed from the virtual DOM
  onAfterVirtualDOMUnmount(callback) {
    if (typeof callback === "function") {
      this._simulateLifecycleEvent("onAfterVirtualDOMUnmount", callback);
    } else {
      console.warn("onAfterVirtualDOMUnmount expects a function as a callback");
    }
  },

  // Called when virtual DOM starts processing changes
  onVirtualDOMProcessingStart(callback) {
    if (typeof callback === "function") {
      this._simulateLifecycleEvent("onVirtualDOMProcessingStart", callback);
    } else {
      console.warn(
        "onVirtualDOMProcessingStart expects a function as a callback"
      );
    }
  },

  // Called when virtual DOM finishes processing changes
  onVirtualDOMProcessingEnd(callback) {
    if (typeof callback === "function") {
      this._simulateLifecycleEvent("onVirtualDOMProcessingEnd", callback);
    } else {
      console.warn(
        "onVirtualDOMProcessingEnd expects a function as a callback"
      );
    }
  },

  // Internal method to simulate lifecycle event triggering with state
  _simulateLifecycleEvent(eventName, callback) {
    // You can replace this with actual virtual DOM processing logic or framework logic
    console.log(`${eventName} is triggered`);
    setTimeout(() => {
      callback();
    }, 100); // Simulate virtual DOM timing

    // Example of adding some state tracking (like virtual DOM processing)
    if (eventName === "onVirtualDOMProcessingStart") {
      console.log("Virtual DOM is starting processing...");
    } else if (eventName === "onVirtualDOMProcessingEnd") {
      console.log("Virtual DOM has finished processing!");
    }
  },
};
