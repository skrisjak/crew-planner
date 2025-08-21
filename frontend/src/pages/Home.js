import {useEffect, useState} from "react";
import PageLayout from "./PageLayout";
import {DateCalendar, LocalizationProvider, MobileDatePicker} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/cs";
import dayjs from "dayjs";
import {useResponsive} from "../hooks/Responsive";
import {usePlan} from "../hooks/Plan";
import {Box, CircularProgress} from "@mui/material";
import WorkDay from "./components/WorkDay";
import {useWeather} from "../hooks/Weather";
import {useUsers} from "../hooks/Users";
import {useProfile} from "../hooks/UserProfile";
import DefaultSlotManagement from "./components/DefaultSlotManagement";

function Home() {
    const {mobile, fullScreen} =useResponsive();
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const {loading, plan, updatePlan} = usePlan();
    const [open, setOpen] = useState(false);
    const user = useProfile(set => set.profile);
    const users = useUsers(st => st.users);
    const setUsers = useUsers(st => st.updateUsers);

    useEffect(() => {
        if (user && ["ADMIN", "MANAGER"].includes(user.role)) {
            if (users === null || users.length === 0) {
                setUsers();
            }
        }
        // eslint-disable-next-line
    }, [setUsers, user]);

    const updateCalenderView = (date) => {
        setSelectedDate(date);
        setOpen(false);
        updatePlan(date);
    }

    const weatherData = useWeather(state => state.weatherData);
    const getWeatherData = useWeather(state => state.getWeatherData);

    useEffect(() => {
        getWeatherData();
    }, [getWeatherData]);

    return (
        <PageLayout
            calendar={
                mobile? null :
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="cs">
                        {fullScreen ?
                            <DateCalendar value={selectedDate} defaultValue={selectedDate} showDaysOutsideCurrentMonth fixedWeekNumber={6} onChange={updateCalenderView} sx={{width:'100%', height:"auto"}}/> :
                            <MobileDatePicker value={selectedDate} onChange={updateCalenderView} sx={{width:"100%"}} open={open} onOpen={() => setOpen(true)}/>
                        }
                    </LocalizationProvider>
            }

            otherChildren={mobile? null : <DefaultSlotManagement/>}
        >
            {mobile?
                <Box sx={{display:"flex", flexDirection: "column", width:'100%', height:"100%", alignItems:"stretch", boxSizing:"border-box"}}>
                    <Box sx={{padding: "10px", height:"10%"}}>
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="cs">
                            <MobileDatePicker value={selectedDate} onChange={updateCalenderView} open={open} onOpen={()=> setOpen(true)}/>
                        </LocalizationProvider>
                        {user && ["ADMIN", "MANAGER"].includes(user.role) &&
                            <DefaultSlotManagement/>
                        }
                    </Box>
                    <Box sx={{boxSizing:"border-box", display:"block", flexDirection:"column", alignItems:"stretch", alignContent:"flex-start", height:"90%", overflow:"scroll", padding:"10px"}}>
                        {loading?
                            <CircularProgress/> :
                                plan.map(workDay => <WorkDay workDay={workDay} key={workDay.date}/>
                            )
                        }
                    </Box>
                </Box>
                :
                <Box sx={{display:"flex", flexDirection: "row", overflow:"scroll", width:'100%', height:"100%", paddingBottom: "10px", alignItems:"stretch", boxSizing:"border-box"}}>
                    {loading?
                        <CircularProgress/> :
                            plan.map(workDay => <WorkDay workDay={workDay} key={workDay.date}/>
                        )
                    }
                </Box>
            }
        </PageLayout>
    )
}

export default Home;