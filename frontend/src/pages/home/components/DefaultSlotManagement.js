import {Box, Button, Dialog, IconButton, TextField, Tooltip, Typography} from "@mui/material";

import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import {useResponsive} from "../../../hooks/Responsive";
import {useEffect, useState} from "react";
import API from "../../../api/API";
import DefaultSlot from "./DefaultSlot";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const DefaultSlotManagement = (props) => {
    const {mobile} = useResponsive();
    const [open, setOpen] = useState(false);
    const [slots, setSlots] = useState([]);
    const [slotName, setSlotName] = useState("");

    useEffect(() => {
        API.getDefaultSlots()
            .then((res) => {
                setSlots(res);
            })
            .catch((e) => {
                alert(e.message);
            })
    }, []);

    const add = async () => {
        try {
            const newSlot = await API.createDefaultSlot({
                id:null,
                slotName: slotName,
                user: null,
                workDayId:null,
            })
            setSlots(prevState => [...prevState, newSlot]);
            setSlotName("");
            await props.refreshPlan();
        } catch (e) {
            alert(e);
        }
    }

    const update =  (slotId, slot) => {
        setSlots(prevState => {
            return prevState.map(s => {
                if (s.id === slotId) {
                    return slot;
                }
                return s;
            })
        })
    }

    const del = (slotId) => {
        setSlots(prevState => {
            return prevState.filter(s => s.id !== slotId);
        })
    }

    return (
        <>
            <Button variant="contained" onClick={() =>setOpen(true)} startIcon={<EditCalendarIcon />} sx={{marginTop:"10px"}}>
                {mobile? undefined : "Každodenní směny"}
            </Button>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <Box sx={{padding:"10px", boxSizing:"border-box"}}>
                    <Typography variant="h6">Každodenní směny</Typography>
                    {slots.map((slot) => (
                        <DefaultSlot slot={slot} refreshPlan={props.refreshPlan} update={update} del={del} key={slot.id}/>
                    ))}
                    <Box sx={{width:'100%', alignItems:"center", marginBottom:"10px", display:"flex", flexWrap:"wrap"}}>

                        <Box sx={{width: "68%", padding:"5px", display:"inline-flex", justifyContent:"space-between"}}>
                            <TextField value={slotName} onChange={e => setSlotName(e.target.value)} />
                        </Box>
                        <Box sx={{width: "28%", display:"flex", justifyContent: mobile? "flex-end" : undefined}}>
                            <Box sx={{gap:"2%",display:"flex", justifyContent:"space-evenly"}}>
                                <Tooltip title="Přidat">
                                    <IconButton color="primary" onClick={add}>
                                        <AddCircleIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Dialog>
        </>
    )
}

export default DefaultSlotManagement;