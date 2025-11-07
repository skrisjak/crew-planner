import {Box, Button, MenuItem, Select, TextField, Typography} from "@mui/material";
import {useState} from "react";
import {useResponsive} from "../../../hooks/Responsive";
import {useProfile} from "../../../hooks/UserProfile";
import API from "../../../api/API";


const RegisterShift =(props) => {
    const {mobile} = useResponsive();
    const registeredWorker = props.registeredWorker;
    const [note, setNote] = useState(registeredWorker? registeredWorker.note : "");
    const profile = useProfile(st => st.profile);
    const updatable = props.updatable? props.updatable : false;
    const accessible = props.access? props.access : false;
    const [postLoading, setPostLoading] = useState(false);

    const addWorker = async (availability) => {
        try {
            const newWorker = {
                id : registeredWorker? registeredWorker.id : null,
                workDayId : registeredWorker? registeredWorker.workDayId : null,
                userEmail: profile.email,
                note: note,
                availability: availability,
            }

            setPostLoading(true);

            await props.addWorker(newWorker, updatable);

        } catch (e) {
            alert(e);
        } finally {
            setPostLoading(false);
        }
    }

    const acceptWorker = async () => {
        addWorker("AVAILABLE");
    }

    const rejectWorker = async () => {
        addWorker("UNAVAILABLE");
    }

    return (
        <Box container sx={{width:'100%', display:"flex", flexDirection: mobile? "column" :"row", flexWrap: mobile? undefined :"wrap", gap:"1%"}}>

            <TextField sx={{marginBottom:"10px"}} label="Poznámka" value={note} onChange={(e) => setNote(e.target.value)} variant="standard" fullWidth disabled={!accessible}/>
            <Box sx={{width:"100%", display:"flex", justifyContent:"space-evenly"}}>
                {accessible && (
                    <>
                        <Button variant="contained" onClick={acceptWorker}>Můžu</Button>
                        <Button variant="outlined" onClick={rejectWorker}>Nemůžu</Button>
                    </>
                )}
            </Box>
        </Box>
    )
}

export default RegisterShift;