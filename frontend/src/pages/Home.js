import {useEffect, useState} from "react";
import API from "../api/API";
import {useNavigate} from "react-router-dom";
import PageLayout from "./PageLayout";

function Home() {
    const redirect = useNavigate();
    const [profile, setProfile] = useState(null);

    useEffect(() => {

        const getProfile = async () => {
            try {
                const newProfile = await API.getUserData();
                setProfile(newProfile);
            } catch (err) {
                redirect("/");
            }
        }
        getProfile();
    },[redirect]);

    return (
        <PageLayout profile={profile}>

        </PageLayout>
    )
}

export default Home;