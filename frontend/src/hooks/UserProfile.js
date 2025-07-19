import { useState, useEffect } from "react";
import API from "../api/API";
import CONF from "../api/CONF";

export const useProfile = () => {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const getProfile = async () => {
            try {
                const newProfile = await API.getUserData();
                setProfile(newProfile);
            } catch (err) {
                window.location.href = CONF.origin;
            }
        };
        getProfile();
    }, []);

    return {profile};
};
