import {Avatar, Box, IconButton, MenuItem, Select, TextField, Tooltip} from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import {useUsers} from "../../../hooks/Users";
import {useState} from "react";
import {useResponsive} from "../../../hooks/Responsive";
import API from "../../../api/API";

const SlotManagement = (props) => {
    const slot = props.slot;
    const {mobile} = useResponsive();
    const users = useUsers(s=> s.users);
    const [selectedUser, setSelectedUser] = useState(
        slot.user
    );
    const [slotName, setSlotName] = useState(slot.slotName);

    const update = async () => {
        try {
            const updatedSlot = {
                ...slot,
                slotName: slotName,
                user: selectedUser,
            };

            await API.updateSlot({
                id: slot.id,
                workDayId: props.dayId,
                user: selectedUser ? selectedUser.email : null,
                slotName: slotName,
            });

            props.updateSlot(slot.id, updatedSlot);
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
        <Box sx={{width:'100%', alignItems:"center", marginBottom:"10px", display:"flex", flexWrap:"wrap"}}>

            <Box sx={{width: mobile? "100%" : "78%", padding:"5px", display:"inline-flex", justifyContent:"space-between"}}>
                <TextField sx={{width:"48%"}} value={slotName} onChange={e => setSlotName(e.target.value)} />

            <Box sx={{width:"48%"}}>
                <Select
                    value={selectedUser? selectedUser.email : ""}
                    onChange={(e) => setSelectedUser(users.find(u => u.email === e.target.value) ||"")}
                    sx={{width:"100%"}}
                >
                    <MenuItem value="">
                        Nikdo
                    </MenuItem>
                    {users.map(option => (
                        <MenuItem value={option.email}>
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
            <Box sx={{width: mobile? "100%":"20%", display:"flex", justifyContent: mobile? "flex-end" : undefined}}>
                <Box sx={{gap:"2%",display:"flex", justifyContent:"space-evenly", width: mobile? undefined : "100%"}}>
                <Tooltip title="Upravit">
                    <IconButton color="primary" onClick={update}>
                    <CheckCircleIcon />
                </IconButton>
                </Tooltip>
                    <Tooltip title="Smazat">

                <IconButton color="error" onClick={del}>
                    <DeleteIcon />
                </IconButton>
                        </Tooltip>
                </Box>
            </Box>
        </Box>
    )
}

export default SlotManagement;