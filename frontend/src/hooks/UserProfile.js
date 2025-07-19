import { useState, useEffect } from "react";
import API from "../api/API";
import {useNavigate} from "react-router-dom";

export const useProfile = () => {
    const [profile, setProfile] = useState(null);
    const redirect = useNavigate();

    useEffect(() => {
        const getProfile = async () => {
            try {
                const newProfile = await API.getUserData();
                setProfile(newProfile);
            } catch (err) {
                redirect("/");
            }
        };
        getProfile();
    }, []);

    return {profile};
};
