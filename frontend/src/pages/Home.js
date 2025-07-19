import {useState} from "react";
import PageLayout from "./PageLayout";
import {DateCalendar, LocalizationProvider, MobileDatePicker} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/cs";
import dayjs from "dayjs";
import {useResponsive} from "../hooks/Responsive";
import {usePlan} from "../hooks/Plan";
import {Box, CircularProgress, Divider} from "@mui/material";
import WorkDay from "./components/WorkDay";

function Home() {
    const {mobile, fullScreen} =useResponsive();
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const {loading, plan, updatePlan} = usePlan();
    const [open, setOpen] = useState(false);

    const updateCalenderView = (date) => {
        setSelectedDate(date);
        setOpen(false);
        updatePlan(date);
    }

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
        >
            {mobile?
                <Box sx={{display:"flex", flexDirection: "column", width:'100%', height:"100%", alignItems:"stretch", boxSizing:"border-box"}}>
                    <Box sx={{padding: "10px", height:"10%"}}>
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="cs">
                            <MobileDatePicker value={selectedDate} onChange={updateCalenderView} open={open} onOpen={()=> setOpen(true)}/>
                        </LocalizationProvider>
                    </Box>
                    <Box sx={{boxSizing:"border-box", display:"flex", flexDirection:"column", alignItems:"stretch", height:"90%", maxHeight:"90%", overflowY:"auto", padding:"10px"}}>
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