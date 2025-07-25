import PageLayout from "./PageLayout";
import {Autocomplete, Avatar, Box, Button, MenuItem, Select, TextField} from "@mui/material";
import {useResponsive} from "../hooks/Responsive";
import {useUsers} from "../hooks/Users";
import {useEffect, useState} from "react";
import AddIcon from '@mui/icons-material/Add';
import API from "../api/API";

const ADD_USER="Přidat uživatele"

const Users = () => {
    const {mobile} = useResponsive();
    const users = useUsers(st => st.users);
    const setUsers = useUsers(st => st.updateUsers);
    const [selectedUser, setSelectedUser] = useState(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [nickName, setNickName] = useState("");
    const [role, setRole] = useState("EMPLOYEE");

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (users === null || users.length === 0) {
            setUsers();
        }
        // eslint-disable-next-line
    }, [setUsers]);

    useEffect(() => {
        if (selectedUser === null || selectedUser === ADD_USER) {
            setEmail("");
            setNickName("");
            setRole("EMPLOYEE");
            setName("");
        } else {
            setEmail(selectedUser.email);
            setNickName(selectedUser.nickName || "");
            setRole(selectedUser.role);
            setName(selectedUser.name || "");
        }
    }, [selectedUser]);

    const addUser = async () => {
        try {
            const newUser = {
                email: email,
                name: name,
                nickName: nickName,
                role: role,
            }

            setLoading(true);
            const rsp = await API.addUser(newUser);
            users.push(rsp);
            setSelectedUser(rsp);
        } catch (error) {
            alert(error);
        } finally {
            setLoading(false);
        }
    }

    const updateUser = async () => {
        try {
            const updateUser = {
                email: email,
                name: name,
                nickName: nickName,
                role: role,
            }

            setLoading(true);
            await API.updateUser(updateUser);

        } catch (error) {
            alert(error);
        } finally {
            setLoading(false);
        }
    }

    const deleteUser = async () => {
        try {
            setLoading(true);
            await API.deleteUser(selectedUser.email);
            setSelectedUser(null);
        } catch (error) {
            alert(error)
        } finally {
            setLoading(false);
        }
    }


    return (
        <PageLayout>
            <Box sx={{display:"flex", flexDirection:"column", alignItems:"center", width:"100%", height:"100%", gap:3}}>
                <Autocomplete
                    label="Uživatel"
                    value={users.find(user => (user.email === selectedUser?.email) || (selectedUser === ADD_USER ? ADD_USER : null))}
                    onChange={(e, newValue) => setSelectedUser(newValue)}
                    variant="standard"
                    sx={{width: mobile? "95%": "50%"}}
                    options={[...users, ADD_USER]}
                    getOptionLabel={(option) => typeof option === "string" ? option : option.name || option.email}
                    renderInput={(params) => (<TextField label="Uživatel" {...params} />)}
                    renderOption={(props, option) => {
                        const isAddOption = option === ADD_USER;
                        return (
                            <Box component="li" {...props} sx={{ display: "flex", alignItems: "center" }}>
                                {isAddOption ? (
                                    <>
                                        <AddIcon sx={{ marginRight: "8px" }} />
                                        {ADD_USER}
                                    </>
                                ) : (
                                    <>
                                        <Avatar
                                            src={option.image}
                                            sx={{ height: 24, width: 24, marginRight: "8px" }}
                                        />
                                        {option.name ? option.name : option.email}
                                    </>
                                )}
                            </Box>
                        );
                    }}
                />
                {selectedUser && (
                    <>
                        <Avatar src={selectedUser.image}/>

                        <Box display="flex" flexDirection="column" gap={2} width={mobile? "95%": "50%"}>
                            <TextField fullWidth value={email} variant="standard" label="G-mail" margin="dense" onChange={(e)=> setEmail(e.target.value)} disabled={selectedUser !== ADD_USER}/>
                            <TextField fullWidth value={name} variant="standard" label="Jméno" margin="dense" onChange={(e) => setName(e.target.value)}/>
                            <TextField fullWidth value={nickName} variant="standard" label="Přezdívka" margin="dense" onChange={(e) => setNickName(e.target.value)} />
                            <Select fullWidth variant="standard" label="Oprávnění" value={role} onChange={(e) => setRole(e.target.value)}>
                                <MenuItem value="EMPLOYEE">Zaměstnanec</MenuItem>
                                <MenuItem value="ADMIN">Administrátor (vidí vše)</MenuItem>
                                <MenuItem value="MANAGER">Vedoucí (jako admin, ale nepíše se na směny)</MenuItem>
                            </Select>
                            <Box display="flex" flexDirection="row-reverse" gap={2}>

                                {selectedUser===ADD_USER? (
                                        <Button variant="contained" loading={loading} onClick={addUser}>
                                        Přidat
                                        </Button>
                                    ) : (
                                        <>
                                            <Button variant="contained" loading={loading} onClick={updateUser}>
                                            Upravit
                                            </Button>
                                            <Button variant="outlined" loading={loading} onClick={deleteUser}>
                                            Smazat
                                            </Button>
                                        </>
                                    )
                                }
                            </Box>
                        </Box>
                    </>
                    )
                    }
            </Box>
        </PageLayout>
    )
}
export default Users;