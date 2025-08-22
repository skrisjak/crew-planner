import {useEffect, useState} from "react";
import {
    Avatar,
    Box,
    Button,
    Chip,
    Dialog,
    Divider,
    MenuItem,
    Select,
    Typography
} from "@mui/material";
import {useProfile} from "../../hooks/UserProfile";
import {useResponsive} from "../../hooks/Responsive";
import {getFullDateText} from "../../util/days";
import {useUsers} from "../../hooks/Users";
import API from "../../api/API";

const WorkDaySlot = (props) => {
    const slot = props.slot;
    const [dialogOpen, setDialogOpen] = useState(false);
    const profile = useProfile(set => set.profile);
    const users = useUsers(set => set.users);
    const [selectedUser, setSelectedUser] = useState(
        (users && slot.registeredWorkerName)
            ? users.find(u => u.nickName === slot.registeredWorkerName || u.name === slot.registeredWorkerName)
            : null
    );


    const handleClick =(event) => {
        event.stopPropagation();
        event.preventDefault();
        setDialogOpen(true);
    }

    const handleClose = (event) => {
        event.stopPropagation();
        event.preventDefault();
        setDialogOpen(false);
    }

    const registerSlot = async () => {
        try {
            await API.addUserToSlots({
                user: profile.email,
                slotId: slot.id
            });
            setDialogOpen(false);
            props.updateSlot(slot.id, {
                ...slot,
                registeredWorkerName: profile.nickName? profile.nickName : profile.name,
                registeredWorkerImage: profile.image || "",
            });
        } catch (error) {
            alert(error.message);
        }
    }

    const freeSlot = async () => {
        try {
            await API.removeUserFromSlot(slot.id);
            setDialogOpen(false);
            props.updateSlot(slot.id, {
                ...slot,
                registeredWorkerName: null,
                registeredWorkerImage: null,
            });
        } catch (error) {
            alert(error.message);
        }
    }

    const updateSlot = async () => {
        if (selectedUser) {
            try {
                await API.addUserToSlots({
                    user: selectedUser.email,
                    slotId: slot.id
                });
                setDialogOpen(false);
                props.updateSlot(slot.id, {
                    ...slot,
                    registeredWorkerName: selectedUser? (selectedUser.nickName? selectedUser.nickName :selectedUser.name) : null,
                    registeredWorkerImage: selectedUser ? (selectedUser.image ? selectedUser.image : "") : null,
                });
            } catch (e) {
                alert(e.message);
            }
        } else {
            freeSlot();
        }
    }

    useEffect(() => {
        setSelectedUser(users.find(u => (u.nickName === slot.registeredWorkerName || u.name === slot.registeredWorkerName)));
    }, [slot, users]);

    const {mobile} = useResponsive();

    return (
        <>
            <Chip
                variant={slot.registeredWorkerName? undefined : "outlined"}
                sx={{width:'100%', borderRadius:"5px", justifyContent:"start"}}
                label={slot.slotName + " - " +(slot.registeredWorkerName? slot.registeredWorkerName :"volné místo")}
                onClick={handleClick}
                avatar={slot.registeredWorkerName? <Avatar src={slot.registeredWorkerImage? slot.registeredWorkerImage : ""}/> : undefined}
            />
            <Dialog open={dialogOpen} onClose={handleClose} PaperProps={{sx:{display:"flex", flexDirection:"column", minWidth: mobile? "80vw" :"50vw", maxWidth: mobile? "90vw" : "50vw",height: "50vh", padding:"10px", boxSizing:"border-box", overflowY:"auto"}}} onClick={e => e.stopPropagation()}>
                <Box sx={{display:"inline-flex", justifyContent:"space-between"}}>
                    <Typography variant="h6">
                        {slot.slotName}
                    </Typography>
                    <Typography variant="h6">
                        {getFullDateText(slot.date)}
                    </Typography>
                </Box>

                <Divider sx={{width:"100%", marginBottom:"10px"}}/>

                {profile && ["EMPLOYEE", "ADMIN"].includes(profile.role) && (

                    <Box sx={{width:'100%', display:"flex", flexDirection:"row-reverse", marginBottom:"10px"}}>
                        {
                            (slot.registeredWorkerName === null || slot.registeredWorkerName === profile.name || slot.registeredWorkerName === profile.nickName) && (
                                slot.registeredWorkerName ===  null ?
                                    <Button variant="contained" onClick={registerSlot}>Zapsat se</Button> :
                                    <Button variant="outlined" onClick={freeSlot}>Odhlásit se</Button>

                            )
                        }
                    </Box>
                )}

                {profile && ["ADMIN", "MANAGER"].includes(profile.role) && (

                    <Box sx={{width:'100%', display:"flex", flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
                        <Box sx={{width:"75%"}}>
                        <Select
                            label="Uživatel"
                            value={selectedUser}
                            onChange={(e) => setSelectedUser(e.target.value)}
                            options={users}
                            sx={{width:"100%"}}
                        >
                            <MenuItem value={null}>
                                Nikdo
                            </MenuItem>
                            {users.map(option => (
                                <MenuItem value={option}>
                                    <Box component="li" {...props} sx={{ display: "flex", alignItems: "center" }}>
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
                        <Button variant="contained" onClick={updateSlot}>
                            Upravit
                        </Button>
                    </Box>
                )}
            </Dialog>
        </>
    )
}

export default WorkDaySlot;