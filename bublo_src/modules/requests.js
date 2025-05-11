import Config from "../config/config.js";

export const requests = {
    url: (path = "") => `${Config.baseUrl}${path.startsWith("/") ? path : "/" + path}`,

    get(paramName) {
        return new URLSearchParams(window.location.search).get(paramName);
    },

    set(paramName, paramValue) {
        const url = new URL(window.location);
        url.searchParams.set(paramName, paramValue);
        window.history.pushState({}, "", url);
    },

    remove(paramName) {
        const url = new URL(window.location);
        url.searchParams.delete(paramName);
        window.history.pushState({}, "", url);
    },

    getAll() {
        return Object.fromEntries(new URLSearchParams(window.location.search));
    },

    windowGetHref: () => window.location.href
};