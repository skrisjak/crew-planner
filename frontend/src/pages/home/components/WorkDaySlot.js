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
import {useProfile} from "../../../hooks/UserProfile";
import {useResponsive} from "../../../hooks/Responsive";
import {getFullDateText} from "../../../util/days";
import API from "../../../api/API";
import {usePlan} from "../../../hooks/Plan";
import {useUsers} from "../../../hooks/Users";

const WorkDaySlot = (props) => {
    const slot = props.slot;
    const [dialogOpen, setDialogOpen] = useState(false);
    const profile = useProfile(set => set.profile);
    const users = useUsers(st => st.users);
    const [selectedUser, setSelectedUser] = useState(
        slot.user? slot.user.email : ""
    );
    const {refreshPlan} = usePlan();


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
                user: profile
            });
        } catch (error) {
            alert(error.message);
            await refreshPlan();
        }
    }

    const freeSlot = async () => {
        try {
            await API.removeUserFromSlot(slot.id);
            setDialogOpen(false);
            props.updateSlot(slot.id, {
                ...slot,
                user:null
            });
        } catch (error) {
            alert(error.message);
        }
    }

    const updateSlot = async () => {
        if (selectedUser) {
            try {
                await API.addUserToSlots({
                    user: selectedUser,
                    slotId: slot.id
                });
                setDialogOpen(false);
                props.updateSlot(slot.id, {
                    ...slot,
                    user: users.find(user => user.email === selectedUser),
                });
            } catch (e) {
                alert(e.message);
            }
        } else {
            freeSlot();
        }
    }

    useEffect(() => {
        setSelectedUser(slot.user? slot.user.email : "");
    }, [slot]);

    const {mobile} = useResponsive();

    return (
        <>
            <Chip
                variant={slot.user? undefined : "outlined"}
                sx={{width:'100%', borderRadius:"5px", justifyContent:"start", fontSize:"0.85em"}}
                label={slot.slotName + " - " +(slot.user? (slot.user.nickName? slot.user.nickName: slot.user.name) :"volné místo")}
                onClick={handleClick}
                avatar={slot.user? <Avatar src={slot.user.image? slot.user.image : ""}/> : undefined}
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

                {profile && profile.role ==="EMPLOYEE" && (

                    <Box sx={{width:'100%', display:"flex", flexDirection:"row-reverse", marginBottom:"10px"}}>
                        {
                            (slot.user === null || slot.user.email === profile.email) && (
                                slot.user ===  null ?
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
                            sx={{width:"100%"}}
                        >
                            <MenuItem value="">
                                Nikdo
                            </MenuItem>
                            {users.map(option => (
                                <MenuItem value={option.email}>
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