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
        <Box container sx={{backgroundColor:"#f8fafd", height:"100vh",width:"100vw",minWidth:"100vw", maxWidth:"100vw", minHeight:"100vh", maxHeight:"100vh"}}>
            <Box sx={{padding:"10px", display:"flex", justifyContent:"space-between", flexDirection:"row", alignItems:"center", height:"auto", minWidth:"100vw",  maxWidth:"100vw", boxSizing: "border-box", maxHeight: mobile? "10%": null}}>
                <Box sx={{display:"inline-flex", alignItems:'center'}}>
                    {mobile ?
                        <IconButton onClick={() => setOpen(true)}><MenuIcon /></IconButton> :
                        <span className="material-symbols-outlined">calendar_month</span>
                    }
                    <Typography variant="h4" fontFamily="Nova Mono">
                            ShiftBoard
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
                            <ListItem key="plan" sx={{padding:0, margin:0}}>
                                <ListItemButton>
                                    <ListItemText>Plán směn</ListItemText>
                                </ListItemButton>
                            </ListItem>
                            <ListItem key="shift" sx={{padding:0, margin:0}}>
                                <ListItemButton>
                                    <ListItemText>Hodiny</ListItemText>
                                </ListItemButton>
                            </ListItem>
                        </List>
                        </Box>
                    </SwipeableDrawer>
                    {props.children}
                </Box>
                :
                <Box container sx={{display:"flex", flexDirection:"row", justifyContent:"space-evenly",boxSizing:"border-box", minHeight:"90vh", maxHeight:"90vh",}}>
                    <Box container sx={{height:"100%", minWidth:"15%", maxWidth:"15%"}}>
                        <List>
                            <ListItem key="plan" sx={{padding:0, margin:0}}>
                                <ListItemButton>
                                    <ListItemText>Plán směn</ListItemText>
                                </ListItemButton>
                            </ListItem>
                            <ListItem key="hey" sx={{padding:0, margin:0}}>
                                <ListItemButton>
                                    <ListItemText>Hodiny</ListItemText>
                                </ListItemButton>
                            </ListItem>
                        </List>
                        {(!mobile && props.calendar) && props.calendar}
                    </Box>
                    <Box container sx={{borderRadius:"5px", backgroundColor:"white", padding:"10px",  minHeight:"100%", minWidth:"80%", maxWidth:"80%", overflow:"scroll"}}>{props.children}</Box>
                </Box>
            }
        </Box>
    );
}

export default PageLayout;