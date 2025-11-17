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

            const response = await fetch(url, init);

            if (response.status === 401) {
                localStorage.removeItem("token");
                window.location.assign("/?error=Unauthorized");
            } else if (response.status === 404 || response.status === 403) {
                throw new Error("Not found");
            } else {

                if (response.ok && ["POST", "GET"].includes(method)) {
                    const responded = await response.json();
                    console.log("←" + method + " " + url + "\n" + JSON.stringify(responded));
                    return responded;
                } else if (response.ok){
                    console.log("←" + method + " " + url + " OK");
                }
            }
        }
    }

    static getUserData = async () => {
        return await API.doRequest("user");
    }

    static addUser = async (userData) => {
        return await API.doRequest("user", "POST",userData);
    }

    static updateUser = async (userData) => {
        return await API.doRequest("user", "PUT", userData);
    }

    static deleteUser = async (userEmail) => {
        return await API.doRequest("user?userEmail="+userEmail, "DELETE");
    }

    static getUsers = async () => {
        return await API.doRequest("user/all");
    }

    static getWeekPlan = async () => {
        return await API.doRequest("plan");
    }

    static getPlan = async (startDate, endDate) => {
        return await API.doRequest("plan?startDate=" + startDate.format("YYYY-MM-DD") + "&endDate=" + endDate.format("YYYY-MM-DD"));
    }

    static postNote = async (note) => {
        return await API.doRequest("plan/note", "POST", note);
    }

    static updateNote = async (note) => {
        return await API.doRequest("plan/note", "PUT", note);
    }

    static deleteNote = async (id) => {
        return await API.doRequest("plan/note?noteId=" + id,"DELETE");
    }

    static addWorker = async (worker) => {
        return await API.doRequest("plan/worker", "POST", worker);
    }

    static updateWorker = async (worker) => {
        return await API.doRequest("plan/worker", "PUT", worker);
    }

    static deleteWorker = async (workerId) => {
        return await API.doRequest("plan/worker?planId=" + workerId, "DELETE");
    }

    static getDefaultSlots = async () => {
        return await API.doRequest("plan/defaultSlots");
    }

    static createDefaultSlot = async (postSlot) => {
        return await API.doRequest("plan/defaultSlot", "POST", postSlot);
    }

    static updateDefaultSlot = async (postSlot) => {
        return await API.doRequest("plan/defaultSlot", "PUT", postSlot);
    }

    static deleteDefaultSlot = async (slotId) => {
        return await API.doRequest("plan/defaultSlot?slotId=" + slotId, "DELETE");
    }

    static createSlot = async (postSlot) => {
        return await API.doRequest("plan/slot", "POST", postSlot);
    }

    static updateSlot = async (postSlot) => {
        return await API.doRequest("plan/slot", "PUT", postSlot);
    }

    static deleteSlot = async (slotId) => {
        return await API.doRequest("plan/slot?slotId=" +slotId, "DELETE");
    }

    static addUserToSlots = async (postSlotPlan) => {
        return await API.doRequest("plan/slot/user", "PUT", postSlotPlan);
    }

    static removeUserFromSlot = async (slotId) => {
        return await API.doRequest("plan/slot/user?slotId=" + slotId, "DELETE");
    }

    static subscribe = async (pushSubscription) => {
        return await API.doRequest("subscribe", "POST", pushSubscription);
    }

    static getItems = async () => {
        return await API.doRequest("shopping");
    }

    static addCategory = async (category) => {
        return await API.doRequest("shopping/category", "POST", category);
    }

    static updateCategory = async (category) => {
        return await API.doRequest("shopping/category", "PUT", category);
    }

    static deleteCategory = async (categoryId) => {
        return await API.doRequest("shopping/category/"+categoryId, "DELETE");
    }

    static addItem = async (item) => {
        return await API.doRequest("shopping/item", "POST", item);
    }

    static updateItem = async (item) => {
        return await API.doRequest("shopping/item", "PUT", item);
    }

    static deleteItem = async (itemId) => {
        return await API.doRequest("shopping/item/"+itemId, "DELETE");
    }
}

export default API;