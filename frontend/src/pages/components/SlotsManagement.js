import {Autocomplete, Avatar, Box, Button, MenuItem, Select, TextField, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import {useResponsive} from "../../hooks/Responsive";
import {useUsers} from "../../hooks/Users";

const AddUserToShift = (props) => {

    const users = useUsers(s=> s.users);
    const [selectedUser, setSelectedUser] = useState(null);
    const slots = props.slots;

    return (
        <Box container sx={{width:'100%', display:"flex", flexDirection: "column"}}>
            <Typography variant="h6" sx={{width:"100%"}}>
                Směny
            </Typography>
            <Box sx={{width:"100%"}}>

                {slots.map(slot =>
                <Box sx={{width:'100%', display:"flex", flexDirection:"row", justifyContent:"space-between"}}>
                    <Box sx={{width:"75%"}}>
                        <Select
                            label="Uživatel"
                            value={users.find(user => (user.email === selectedUser?.email))}
                            onChange={(e) => setSelectedUser(e.target.value)}
                            variant="standard"
                            options={users}
                            sx={{width:"100%"}}
                        >
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
                    <Button sx={{width:"20%"}} variant="contained">
                        Přidat
                    </Button>

                </Box>
                )}
            </Box>
        </Box>
    )
}

export default AddUserToShift;