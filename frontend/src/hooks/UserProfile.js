import API from "../api/API";
import {create} from "zustand/react";
import CONF from "../api/CONF";

export const useProfile = create( (set)  => ({
    profile:null,
    getProfile: async () => {
            try {
                const newProfile = await API.getUserData();
                set({profile:newProfile});
            } catch (err) {
                window.location.href = CONF.origin;
            }
        }
    })
);
