import CONF from "./CONF";

class API {

    static doRequest = async (endpoint) => {

        const token = localStorage.getItem("token").trim();

        console.log("Executing call with " + token);

        if (token) {
            try {
                const response = await fetch(CONF.origin + endpoint, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (response.status !== 403) {
                    return response.json();
                }

            } catch (e) {
                throw new Error("Network Error");
            }

        }

        throw new Error("Unauthorized");
    }


    static getUserData = async () => {
        return await API.doRequest("hello");
    }
}

export default API;