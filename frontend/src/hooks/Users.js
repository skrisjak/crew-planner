import {create} from "zustand/react";
import API from "../api/API";

export const useUsers = create( set => ({
    users: [],
    updateUsers: async () => {
        try {
            const rsp = await API.getUsers();
            set({users: rsp});
        } catch (error) {
            alert(error);
        }
    },
}));