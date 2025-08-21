import {
    Avatar,
    Box,
    ListItem,
    List,
    SwipeableDrawer,
    ListItemText,
    IconButton, ListItemButton, Typography, MenuItem, Menu, LinearProgress,
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import React, {useEffect, useState} from "react";
import {useProfile} from "../hooks/UserProfile";
import {useResponsive} from "../hooks/Responsive";
import {useNavigate} from "react-router-dom";


function PageLayout(props) {
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchor] = useState(null);
    const loadProfile = useProfile((set)=> set.getProfile);
    const profile = useProfile((set)=> set.profile);
    const redirect = useNavigate();
    const {mobile, width} = useResponsive();

    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

    return (
        <Box container sx={{backgroundColor:"#f8fafd", height:"100%",width:"100%", maxHeight:"100%", maxWidth:"100%"}}>
            <Box sx={{padding:"10px", display:"flex", justifyContent:"space-between", flexDirection:"row", alignItems:"center", height:"auto", minWidth:"100%",  maxWidth:"100%", boxSizing: "border-box", maxHeight: mobile? "10%": null}}>
                <Box sx={{display:"inline-flex", alignItems:'center'}}>
                    {mobile ?
                        <IconButton onClick={() => setOpen(true)}><MenuIcon /></IconButton> :
                        <span className="material-symbols-outlined">calendar_month</span>
                    }
                    <Typography variant="h4" fontFamily="Nova Mono">
                            Beach Směny
                    </Typography>
                </Box>
                {profile?
                    <>
                        <Box display="flex" alignItems="center" gap={1} id="profile" onClick={(e) => setAnchor(e.currentTarget)} sx={{ cursor: 'pointer', padding: 1, borderRadius: 2, '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' } }}>
                            <Avatar src={profile.image} sx={{ width: 32, height: 32 }} />
                            {!mobile &&<Typography>{profile.name? profile.name : profile.email}</Typography>}
                        </Box>
                        <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={() => setAnchor(null)}>
                            <MenuItem onClick={() => {
                                localStorage.removeItem("token");
                                redirect("/");
                            }}>Odhlásit se</MenuItem>
                        </Menu>
                    </>
                    : <LinearProgress />
                }
            </Box>
            {mobile?
                <Box container sx={{boxSizing:"border-box", width:"100%", maxHeight:"90%", height:"90%", overflow:"hidden"}}>
                    <SwipeableDrawer open={open} onClose={() => setOpen(false)} onOpen={()=>setOpen(true)}>
                        <Box sx={{width: width/2}}>
                        <List>
                            <ListItem key="home" sx={{padding:0, margin:0}} onClick={()=> redirect("/home")}>
                                <ListItemButton>
                                    <ListItemText>Plán směn</ListItemText>
                                </ListItemButton>
                            </ListItem>
                            <ListItem key="hours" sx={{padding:0, margin:0}} onClick={()=> redirect("/hours")}>
                                <ListItemButton>
                                    <ListItemText>Hodiny</ListItemText>
                                </ListItemButton>
                            </ListItem>
                            <ListItem key="shoplist" sx={{padding:0, margin:0}}>
                                <ListItemButton>
                                    Nákup
                                </ListItemButton>
                            </ListItem>

                            {
                                profile && ["ADMIN", "MANAGER"].includes(profile.role) && (
                                    <ListItem key="users" sx={{padding:0, margin:0}} onClick={()=> redirect("/users")}>
                                        <ListItemButton>
                                            <ListItemText>Uživatelé</ListItemText>
                                        </ListItemButton>
                                    </ListItem>
                                )
                            }

                        </List>
                        </Box>
                    </SwipeableDrawer>
                    {props.children}
                </Box>
                :
                <Box container sx={{display:"flex", flexDirection:"row", justifyContent:"space-evenly",boxSizing:"border-box", minHeight:"90svh", maxHeight:"90svh",}}>
                    <Box container sx={{height:"100%", minWidth:"15%", maxWidth:"15%"}}>
                        <List>
                            <ListItem key="home" sx={{padding:0, margin:0}} onClick={()=> redirect("/home")}>
                                <ListItemButton>
                                    <ListItemText>Plán směn</ListItemText>
                                </ListItemButton>
                            </ListItem>
                            <ListItem key="hours" sx={{padding:0, margin:0}} onClick={()=> redirect("/hours")}>
                                <ListItemButton>
                                    <ListItemText>Hodiny</ListItemText>
                                </ListItemButton>
                            </ListItem>

                            <ListItem key="shoplist" sx={{padding:0, margin:0}}>
                                <ListItemButton>
                                    Nákup
                                </ListItemButton>
                            </ListItem>

                            {
                                profile && ["ADMIN", "MANAGER"].includes(profile.role) && (
                                    <ListItem key="users" sx={{padding:0, margin:0}} onClick={()=> redirect("/users")}>
                                        <ListItemButton>
                                            <ListItemText>Uživatelé</ListItemText>
                                        </ListItemButton>
                                    </ListItem>
                                )
                            }
                        </List>
                        {(!mobile && props.calendar) && props.calendar}
                        {profile && ["ADMIN", "MANAGER"].includes(profile.role) && props.otherChildren && props.otherChildren}
                    </Box>
                    <Box container sx={{borderRadius:"5px", backgroundColor:"white", padding:"10px",  minHeight:"100%", minWidth:"80%", maxWidth:"80%", overflow:"scroll"}}>{props.children}</Box>
                </Box>
            }
        </Box>
    );
}

export default PageLayout;