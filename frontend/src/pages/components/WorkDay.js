import {Box, Chip, Dialog, Divider, FormControl, Paper, Typography} from "@mui/material";
import {getDateText} from "../util/days";
import {useResponsive} from "../hooks/Responsive";
import {useState} from "react";
import dayjs from "dayjs";
import {useProfile} from "../hooks/UserProfile";

export default function WorkDay (props) {
    const workDay = props.workDay;
    const {mobile} = useResponsive();
    const [actionDialogOpen, setActionDialogOpen] = useState(false);
    const {admin} = useProfile()

    return (
        <>
            <Paper id={dayjs(workDay.date).format("YYYY-MM-DD")}
                   sx={{minWidth: mobile ? undefined : "30%", height: mobile ? "30%" : undefined, padding: "10px", marginRight: mobile ? undefined : "10px", marginBottom: mobile ? "10px" : undefined, cursor: "pointer", transition: "0.3s", "&:hover": {backgroundColor: "#f5f5f5",transform: "scale(1.01)",}}}
                   onClick={()=> {setActionDialogOpen(true)}}
            >
                <Typography sx={{marginBottom:"10px"}}>
                {getDateText(workDay.date)}
                    </Typography>
                <Divider/>
                {
                    workDay.notes.map( note => {
                        return <Chip key={note.id} note={note} />
                    }
                )}
                {
                    workDay.registeredWorkers.map(registeredWorker => {
                        return <Chip key={registeredWorker.id} registeredWorker={registeredWorker} />
                    })
                }

            </Paper>
            <Dialog open={actionDialogOpen} onClose={()=>{console.log("closed modal?");setActionDialogOpen(false)}}>
                <Box sx={{display:"flex", flexDirection:"column", width:mobile? "80vw" :"50vw", height: "50vh"}}>
                    {
                        getDateText(workDay.date)
                    }
                    <Divider/>
                    {admin &&
                        <FormControl>
                            <
                        </FormControl>
                    }
                </Box>
            </Dialog>
        </>
    )
}