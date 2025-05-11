import Config from "../config/config.js";

// Link css dynamically to the document head
export function LinkCSS(url) {
  if (!Config.appCache.has[url]) {
    Config.appCache.add(url);
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    document.head.appendChild(link);
  }
}

export function Style(styles) {
  if (styles) {
    if (!Config.appCache.has[styles]) {
      Config.appCache.add(styles);
      const newStyleElement = document.createElement("style");
      newStyleElement.classList.add("custom-styles");
      newStyleElement.innerHTML = styles;
      document.head.appendChild(newStyleElement);
    }
  }
}

export function AddStyle(stylesArray) {
  if (!Config.appCache.has[stylesArray]) {
    Config.appCache.add(stylesArray);
    let styleText = "";

    stylesArray.forEach((styleObj) => {
      // Regular styles
      styleText += `${styleObj.selector} {\n`;
      for (let property in styleObj.styles) {
        styleText += `  ${toKebabCase(property)}: ${
          styleObj.styles[property]
        };\n`;
      }
      styleText += "}\n";

      // Pseudo-classes (e.g., hover, focus)
      const pseudoClasses = [
        // Basic User Interaction
        "hover",
        "active",
        "focus",
        "focus-visible",
        "focus-within",

        // Form and Input States
        "disabled",
        "enabled",
        "checked",
        "indeterminate",
        "placeholder-shown",
        "required",
        "optional",
        "valid",
        "invalid",
        "in-range",
        "out-of-range",
        "read-only",
        "read-write",

        // Structural
        "first-child",
        "last-child",
        "only-child",
        "nth-child", // Requires `(n)`
        "nth-last-child", // Requires `(n)`
        "first-of-type",
        "last-of-type",
        "only-of-type",
        "nth-of-type", // Requires `(n)`
        "nth-last-of-type", // Requires `(n)`

        // State and Condition
        "root",
        "empty",
        "not", // Requires `(selector)`
        "has", // Requires `(selector)`
        "is", // Requires `(selector, ...)`
        "where", // Requires `(selector, ...)`

        // Language and Directionality
        "lang", // Requires `(language)`
        "dir", // Requires `(ltr | rtl)`

        // Special
        "target",
        "target-within",
        "scope",

        // Motion and Time
        "current",
        "past",
        "future",
      ];

      pseudoClasses.forEach((pseudoClass) => {
        if (styleObj[pseudoClass]) {
          styleText += `${styleObj.selector}:${pseudoClass} {\n`;
          for (let property in styleObj[pseudoClass]) {
            styleText += `  ${toKebabCase(property)}: ${
              styleObj[pseudoClass][property]
            };\n`;
          }
          styleText += "}\n";
        }
      });

      // Media queries
      if (styleObj.mediaQueries) {
        styleObj.mediaQueries.forEach((query) => {
          styleText += `@media screen and (${query.condition}) {\n`;
          styleText += `  ${styleObj.selector} {\n`;
          for (let property in query.styles) {
            styleText += `    ${toKebabCase(property)}: ${
              query.styles[property]
            };\n`;
          }
          styleText += "  }\n";
          styleText += "}\n";
        });
      }

      // Keyframes
      if (styleObj.keyframes) {
        for (let keyframeName in styleObj.keyframes) {
          styleText += `@keyframes ${keyframeName} {\n`;
          let keyframe = styleObj.keyframes[keyframeName];
          for (let key in keyframe) {
            styleText += `  ${key} {\n`;
            for (let property in keyframe[key]) {
              styleText += `    ${toKebabCase(property)}: ${
                keyframe[key][property]
              };\n`;
            }
            styleText += "  }\n";
          }
          styleText += "}\n";
        }
      }

      // At-rules
      if (styleObj.atRules) {
        for (let atRule in styleObj.atRules) {
          styleText += `${atRule} {\n`;
          let atRuleStyles = styleObj.atRules[atRule];
          for (let property in atRuleStyles) {
            styleText += `  ${toKebabCase(property)}: ${
              atRuleStyles[property]
            };\n`;
          }
          styleText += "}\n";
        }
      }
    });

    // Create the <style> element and append it to the document head
    const style = document.createElement("style");
    style.classList.add("custom-styles");
    style.innerHTML = styleText;
    document.head.appendChild(style);
  }
}

function toKebabCase(str) {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
