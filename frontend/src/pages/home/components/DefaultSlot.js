import {Box, IconButton, TextField, Tooltip} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import {useResponsive} from "../../../hooks/Responsive";
import {useState} from "react";
import API from "../../../api/API";

const DefaultSlot = (props) => {

    const slot = props.slot;
    const [slotName, setSlotName] = useState(slot.slotName);

    const {mobile} = useResponsive();

    const update = async () => {
        try {
            await API.updateDefaultSlot({
                id:slot.id,
                slotName: slotName,
                user: null,
                workDayId: null,
            });
            props.update(slot.id, {
                ...slot,
                slotName: slotName,
            })
            props.refreshPlan();
        } catch (error) {
            alert(error.message);
        }
    }

    const del = async () => {
        try {
            await API.deleteDefaultSlot(slot.id);
            props.del(slot.id);
            props.refreshPlan();
        } catch (error) {
            alert(error.message);
        }
    }

    return (
        <Box sx={{width:'100%', alignItems:"center", marginBottom:"10px", display:"flex", flexWrap:"wrap"}}>

            <Box sx={{width: "68%", padding:"5px", display:"inline-flex", justifyContent:"space-between"}}>
                <TextField value={slotName} onChange={e => setSlotName(e.target.value)} />
            </Box>
            <Box sx={{width: "28%", display:"flex", justifyContent: mobile? "flex-end" : undefined}}>
                <Box sx={{gap:"2%",display:"flex", justifyContent:"space-evenly"}}>
                    <Tooltip title="Upravit">
                        <IconButton color="primary" onClick={update}>
                            <CheckCircleIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Smazat">
                        <IconButton color="primary" onClick={del}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>
        </Box>
    )
}

export default DefaultSlot;