import { documentEvents } from "../modules/document.events.js";
import { routeNavigator } from "../modules/route_navigator.js";
import { router } from "../modules/router.js";
import { requests } from "../modules/requests.js";
import AfterLoad from "./After_Load.js";
import BeforeLoad from "./Before_Load.js";
import Helper from "../modules/Helper.js";

documentEvents.onDomContentLoaded(async () => {
  console.log("App Started...");
  BeforeLoad(); // Show loading state
  const currentPath = requests.windowGetHref();
  console.log(currentPath);
  await router.navigate(currentPath); // Navigate to initial route
  routeNavigator(); // Set up navigation listeners
  AfterLoad(); // Clean up loading state
});
