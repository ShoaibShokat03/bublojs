import Config from "./config.js";

const gateway = {
    baseUrl: "http://localhost/apps/js/bublojs/api",
    endpoints: {
        signup: () => `${gateway.baseUrl}/signup`,
        login: () => `${gateway.baseUrl}/login`,
        logout: () => `${gateway.baseUrl}/logout`,
        userProfile: () => `${gateway.baseUrl}/profile`,
        userUpdate: () => `${gateway.baseUrl}/update-profile`,
    },

    request: async (url, method = "GET", data = null, headers = {}) => {
        const options = {
            method,
            headers: {
                "Content-Type": "application/json",
                ...headers,
            },
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            return result;
        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
    },
    login: async (payload) => {

        console.log(payload);
        if (payload.email === "admin@gmail.com" && payload.password === "12345678") {
            Config.login(payload);
            return { success: true, message: "Login successful", user: Config.user() };
        }

        return { success: false, message: "Invalid credentials" };
        return await gateway.request(gateway.endpoints.login(), "POST", payload);
    }
}

export default gateway;