import {Avatar, Box, IconButton, MenuItem, Select, TextField, Tooltip} from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import {useUsers} from "../../hooks/Users";
import {useState} from "react";
import {useResponsive} from "../../hooks/Responsive";
import API from "../../api/API";

const SlotManagement = (props) => {
    const slot = props.slot;
    const mobile = useResponsive();
    const users = useUsers(s=> s.users);
    const [selectedUser, setSelectedUser] = useState(
        (users && slot.registeredWorkerName)
            ? users.find(u => u.nickName === slot.registeredWorkerName || u.name === slot.registeredWorkerName)
            : null
    );
    const [slotName, setSlotName] = useState(slot.slotName);

    const update = async () => {
        try {
            await API.updateSlot({
                ...slot,
                user: selectedUser? selectedUser.email : null,
                slotName: slotName,
            });
            props.updateSlot(slot.id,slot);
        } catch (e) {
            alert(e.message);
        }
    }

    const del = async () => {
        try {
            await API.deleteSlot(slot.id);
            props.deleteSlot(slot.id);
        } catch (e) {
            alert(e.message);
        }
    }

    return (
        <Box sx={{width:'100%', display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"space-between", marginBottom:"10px"}}>

            <Box sx={{width: mobile? "38%" : "48%", padding:"5px"}}>
                <TextField value={slotName} onChange={e => setSlotName(e.target.value)} />
            </Box>
            <Box sx={{width: mobile? "38%" : "48%"}}>
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
            <Box sx={{width:"20%", display:"flex", justifyContent:"space-evenly"}}>
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
    )
}

export default SlotManagement;