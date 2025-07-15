import {useEffect, useState} from "react";
import API from "../api/API";
import {useNavigate} from "react-router-dom";
import PageLayout from "./PageLayout";
import {DateCalendar, DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/cs";
import dayjs from "dayjs";

function Home() {
    const [mobile, setMobile] = useState(window.innerWidth <= 800);
    const [fullScreen, setFullScreen] = useState(window.innerWidth === window.screen.width);
    const redirect = useNavigate();
    const [profile, setProfile] = useState(null);

    window.addEventListener("resize", ()=> {
        setMobile(window.innerWidth <= 800);
        setFullScreen(window.innerWidth === window.screen.width);
    })

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
        <PageLayout
            profile={profile}
            calendar={
                mobile? null :
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="cs">
                        {fullScreen ?
                            <DateCalendar defaultValue={dayjs()} showDaysOutsideCurrentMonth fixedWeekNumber={6} sx={{width:"100%", aspectRatio:1}}/> :
                            <DatePicker/>
                        }
                    </LocalizationProvider>
            }
        >
            něco bla bla bla
        </PageLayout>
    )
}

export default Home;