import CONF from "./CONF";

class API {

    static doRequest = async (endpoint, method = "GET",data = null ) => {

        const token = localStorage.getItem("token");

        if (token !== null) {
            const url = CONF.origin + endpoint;
            const body = JSON.stringify(data);

            console.log("→" + method + " " + url + (data? ("\n" + body) : ""));

            try {

                const headers = {"Authorization": `Bearer ${token.trim()}`};

                let init;
                if (data !== null) {
                    init = {
                        method: method,
                        headers: headers,
                        body: body,
                    }
                } else {
                    init = {
                        method: method,
                        headers: headers,
                    }
                }

                const response = await fetch(url, init);

                if (response.status === 403 && response.status === 401) {
                    localStorage.removeItem("token");
                    throw new Error("Unauthorized");
                } else {
                    const responded =  await response.json();
                    console.log("←" + method + " " + url + "\n" + JSON.stringify(responded));
                    return responded;
                }

            } catch (error) {
                throw new Error("Network Error");
            }

        } else {
            throw new Error("Unauthorized");
        }
    }

    static getUserData = async () => {
        return await API.doRequest("user/me");
    }
}

export default API;