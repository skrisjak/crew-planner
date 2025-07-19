import CONF from "./CONF";

class API {

    static doRequest = async (endpoint, method = "GET",data = null ) => {

        const token = localStorage.getItem("token");

        if (token !== null) {
            const url = CONF.origin + endpoint;
            const body = JSON.stringify(data);

            console.log("→" + method + " " + url + (data? ("\n" + body) : ""));

            const headers = {"Authorization": `Bearer ${token.trim()}`, ...(data !== null ? { "Content-Type": "application/json" } : {})};

            const init = {
                method,
                headers,
                ...(data !== null && { body: JSON.stringify(data) }),
            };
            try {
                const response = await fetch(url, init);

                if (response.status === 401) {
                    localStorage.removeItem("token");
                    window.location.href = CONF.origin + "#error=Unauthorized";
                } else if (response.status === 404 || response.status === 403) {
                    return null;
                } else {
                    const responded = await response.json();
                    console.log("←" + method + " " + url + "\n" + JSON.stringify(responded));
                    return responded;
                }
            } catch (error) {
                console.error(error);
                window.location.href = CONF.origin + "#error=NetworkError";
            }
        } else {
            window.location.href = CONF.origin + "#error=NoAuthorization";
        }
    }

    static getUserData = async () => {
        return await API.doRequest("user");
    }

    static getWeekPlan = async () => {
        return await API.doRequest("plan");
    }

    static getPlan = async (startDate, endDate) => {
        return await API.doRequest("plan?startDate=" + startDate.format("YYYY-MM-DD") + "&endDate=" + endDate.format("YYYY-MM-DD"));
    }
}

export default API;