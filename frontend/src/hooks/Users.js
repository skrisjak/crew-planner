import {create} from "zustand/react";
import API from "../api/API";

export const useUsers = create( set => ({
    users: [],
    updateUsers: async () => {
        try {
            const rsp = await API.getUsers();
            set(prev => ({...prev, users: rsp}));
        } catch (error) {

        }
    },
}));