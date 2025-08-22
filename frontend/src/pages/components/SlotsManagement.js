import {Avatar, Box, IconButton, MenuItem, Select, TextField, Tooltip, Typography} from "@mui/material";
import {useUsers} from "../../hooks/Users";
import SlotManagement from "./SlotManagement";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {useResponsive} from "../../hooks/Responsive";
import {useState} from "react";
import API from "../../api/API";

const SlotsManagement = (props) => {
    const slots = props.slots;
    const users = useUsers(s=> s.users);
    const [slotName, setSlotName] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const {mobile}= useResponsive();

    const addSlot = async () => {
        try {
            const newSlot = await API.createSlot({
                id:null,
                slotName: slotName,
                user: selectedUser? selectedUser.email : null,
                workDayId:props.dayId,
            });
            props.addSlot(newSlot);
            setSlotName("");
            setSelectedUser(null);
        } catch (e) {
            alert(e.message);
        }
    }

    return (
        <Box container sx={{width:'100%', display:"flex", flexDirection: "column"}}>
            <Typography variant="h6" sx={{width:"100%"}}>
                Směny
            </Typography>
            <Box sx={{width:"100%"}}>
                {slots.map(slot =>
                    <SlotManagement slot={slot} updateSlot={props.updateSlot} deleteSlot={props.deleteSlot} key={slot.id} dayId={props.dayId}/>
                )}

                <Box sx={{width:'100%', display:"flex", flexWrap:"wrap", alignItems:"center", marginBottom:"10px",}}>
                    <Box sx={{width: mobile?'100%':"78%", display:"flex", justifyContent:"space-between", padding:"5px"}}>

                        <TextField sx={{width: "48%"}} value={slotName} onChange={e => setSlotName(e.target.value)} />
                        <Box sx={{width: "48%"}}>
                            <Select
                                value={selectedUser}
                                onChange={(e) => setSelectedUser(e.target.value)}
                                sx={{width:"100%"}}
                            >
                                <MenuItem value={null}>
                                    Nikdo
                                </MenuItem>
                                {users.map(option => (
                                    <MenuItem value={option}>
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            <Avatar
                                                src={option.image}
                                                sx={{ height: 24, width: 24, marginRight: "8px" }}
                                            />
                                            {option.nickName ? option.nickName : option.name}
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                        </Box>
                    </Box>
                    <Box sx={{width: mobile? "100%":"20%", display:"flex", justifyContent: mobile? "flex-end" : "space-evenly"}}>
                        <Tooltip title="Přidat">
                            <IconButton color="primary" onClick={addSlot}>
                                <AddCircleIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>
            </Box>

        </Box>
    )
}

export default SlotsManagement;