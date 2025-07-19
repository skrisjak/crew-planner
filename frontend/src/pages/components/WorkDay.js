import {Box, Chip, Dialog, Divider, Paper, TextField, Typography} from "@mui/material";
import {getDateText} from "../../util/days";
import {useResponsive} from "../../hooks/Responsive";
import {useState} from "react";
import dayjs from "dayjs";
import {useProfile} from "../../hooks/UserProfile";

export default function WorkDay (props) {
    const workDay = props.workDay;
    const {mobile} = useResponsive();
    const [actionDialogOpen, setActionDialogOpen] = useState(false);
    const {profile} = useProfile();

    const [label, setLabel] = useState("");
    const [note, setNote] = useState("");

    return (
        <>
            <Paper id={dayjs(workDay.date).format("YYYY-MM-DD")}
                   sx={{minWidth: mobile? undefined : "30%", minHeight: mobile? "30%" : undefined, padding: "10px", marginRight: mobile ? undefined : "10px", marginBottom: mobile ? "10px" : undefined, cursor: "pointer", transition: "0.3s", "&:hover": {backgroundColor: "#f5f5f5",transform: "scale(1.01)",}}}
                   onClick={()=> {setActionDialogOpen(true)}}
            >
                <Typography sx={{marginBottom:"10px"}}>{getDateText(workDay.date)}</Typography>
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
            <Dialog open={actionDialogOpen} onClose={()=>{setActionDialogOpen(false)}} PaperProps={{sx:{display:"flex", flexDirection:"column", minWidth: mobile? "80vw" :"50vw", maxWidth: mobile? "80vw" : "50vw",height: "50vh", padding:"10px", boxSizing:"border-box", overflowY:"auto"}}}>
                <Typography variant="h5">{getDateText(workDay.date)}</Typography>
                <Divider sx={{marginBottom:"10px"}}/>
                {profile && ["ADMIN", "MANAGER"].includes(profile.role) && (
                    <Box container sx={{width:'100%', display:"flex", flexDirection: mobile? "column" :"row", flexWrap: mobile? undefined :"wrap", gap:"1%"}}>
                        <Typography variant="h6" sx={{width:"100%"}}>
                            Přidat poznámku
                        </Typography>
                        <TextField sx={{width: mobile? "100%": "28%"}} id="label" variant="outlined" value={label} onChange={(e) => setLabel(e.target.value)} label="Popisek" margin="dense"/>
                        <TextField sx={{width: mobile? "100%": "68%"}} id="note" variant="outlined" value={note} onChange={(e) => setNote(e.target.value)} label="Poznámka" multiline margin="dense" />
                        <Divider sx={{marginBottom:"10px"}}/>
                    </Box>
                )}
            </Dialog>
        </>
    )
}