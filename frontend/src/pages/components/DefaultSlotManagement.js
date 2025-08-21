import {Box, Button, Dialog, IconButton, TextField, Typography} from "@mui/material";

import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import {useResponsive} from "../../hooks/Responsive";
import {useEffect, useState} from "react";
import API from "../../api/API";

const DefaultSlotManagement = () => {
    const mobile = useResponsive();
    const [open, setOpen] = useState(false);
    const [slots, setSlots] = useState([]);

    useEffect(() => {
        API.getDefaultSlots()
            .then((res) => {
                setSlots(res);
            })
            .catch((e) => {
                alert(e.message);
            })
    }, []);

    return (
        <>

            <Button onClick={() =>setOpen(true)} startIcon={<EditCalendarIcon />}>
                {!mobile && "Každodenní směnny"}
            </Button>
            <Dialog open={open} onClose={() => setOpen(false)} PaperProps={{sx:{display:"flex", flexDirection:"column", minWidth: mobile? "80vw" :"50vw", maxWidth: mobile? "90vw" : "50vw",height: "50vh", padding:"10px", boxSizing:"border-box", overflowY:"auto"}}}>
                <Typography variant="h6">Každodenní směny</Typography>
                <Box sx={{width:"100%", padding:"10px"}}>
                    {slots.map((slot) => (
                        <Box sx={{width:"100%"}}>
                            <TextField variant="outlined" value={slot.slotName}/>
                        </Box>
                    ))}
                </Box>
            </Dialog>
        </>
    )
}

export default DefaultSlotManagement;