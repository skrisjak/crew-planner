import {Autocomplete, Box, Button, TextField, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import {useResponsive} from "../../hooks/Responsive";
import {useUsers} from "../../hooks/Users";

const AddUserToShift = (props) => {
    const {mobile} = useResponsive();

    const users = useUsers(s=> s.users);
    const setUsers = useUsers(s => s.updateUsers);
    const [selectedUser, setSelectedUser] = useState(null);
    const [note, setNote] = useState("");


    useEffect(() => {
        setUsers();
    }, [setUsers]);

    const addWorker = async () => {

        const newWorker = {
            userEmail: selectedUser?.email,
            availability:"WORKING",
            note: note,
        }
        await props.addWorker(newWorker);
    }

    return (
        <Box container sx={{width:'100%', display:"flex", flexDirection: mobile? "column" :"row", flexWrap: mobile? undefined :"wrap", gap:"1%"}}>
            <Typography variant="h6" sx={{width:"100%"}}>
                Přidat zaměstnance
            </Typography>
            <Autocomplete sx={{width: mobile? "100%": "68%"}}
                options={users}
                getOptionLabel={(option) => option.name}
                getOptionKey={option => option.email}
                value={selectedUser}
                onChange={(e,value) => {setSelectedUser(value)}}
                renderInput={ (params) =>
                    <TextField {...params} sx={{width: "100%"}} id="user" variant="standard" label="Uživatel" margin="dense"/>
            }/>
            {selectedUser &&
                <TextField sx={{width: "100%"}} id="note2" label="Poznámka" margin="dense" value={note} onChange={(e) => setNote(e.target.value)} />
            }
            <Box sx={{display:"flex", flexDirection:"row-reverse", width:mobile? '100%': "96%"}}>
                <Button onClick={addWorker} variant="contained">
                    Přidat zaměstnance
                </Button>
            </Box>
        </Box>
    )
}

export default AddUserToShift;