import {Box, Button, MenuItem, Select, TextField, Typography} from "@mui/material";
import {useState} from "react";
import {useResponsive} from "../../hooks/Responsive";
import {useProfile} from "../../hooks/UserProfile";
import API from "../../api/API";


const RegisterShift =(props) => {
    const {mobile} = useResponsive();
    const registeredWorker = props.registeredWorker;
    const [availability, setAvailability] = useState(registeredWorker? registeredWorker.availability :"AVAILABLE");
    const [note, setNote] = useState(registeredWorker? registeredWorker.note : "");
    const profile = useProfile(st => st.profile);
    const updatable = props.updatable? props.updatable : false;
    const [postLoading, setPostLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const addWorker = async () => {
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

    const deleteWorker = async () => {
        try {
            if (registeredWorker && props.deleteWorker) {
                setDeleteLoading(true);
                await API.deleteWorker(registeredWorker.id);
                props.deleteWorker(registeredWorker.id);
            } else {
                throw new Error("No data");
            }
        } catch (e) {
            alert(e);
        } finally {
            setDeleteLoading(false);
        }
    }

    return (
        <Box container sx={{width:'100%', display:"flex", flexDirection: mobile? "column" :"row", flexWrap: mobile? undefined :"wrap", gap:"1%"}}>
            <Typography variant="h6" sx={{width:"100%"}}>
                {updatable? "Upravit směnu": "Zapsat se na směnu"}
            </Typography>

            <Select fullWidth onChange={(e) => setAvailability(e.target.value)} defaultValue={availability} value={availability} variant="standard">
                <MenuItem value="WORKING">Přijdu</MenuItem>
                <MenuItem value="AVAILABLE">Můžu přijít</MenuItem>
                <MenuItem value="UNAVAILABLE">Nemůžu</MenuItem>
            </Select>
            <TextField label="Poznámka" value={note} onChange={(e) => setNote(e.target.value)} variant="standard"/>
            <Box sx={{display:"flex", flexDirection:"row-reverse", width:mobile? '100%': "96%"}}>
                <Button onClick={addWorker} variant="contained" loading={postLoading}>
                    {updatable? "Upravit": "Zapsat"}
                </Button>
                {updatable && (
                    <Button onClick={deleteWorker} variant="outlined" loading={deleteLoading}>
                        Smazat
                    </Button>
                )}
        </Box>
    </Box>
    )
}

export default RegisterShift;