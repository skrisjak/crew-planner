import {
    Avatar,
    Box,
    ListItem,
    List,
    SwipeableDrawer,
    ListItemText,
    IconButton, ListItemButton, Chip, Typography, MenuItem, Menu
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";


function PageLayout(props) {
    const [mobile, setMobile] = useState(window.innerWidth <= 800);

    const [width, setWidth] = useState(window.innerWidth);

    const [open, setOpen] = useState(false);

    const [anchor, setAnchor] = useState(null);

    const menuOpen = Boolean(anchor);

    const logout = useNavigate();

    window.addEventListener("resize", ()=> {
        setMobile(window.innerWidth <= 800);
        setWidth(window.innerWidth);
    });


    return (
        <Box container sx={{backgroundColor:"#f8fafd", height:"100vh",width:"100vw",minWidth:"100vw", maxWidth:"100vw", minHeight:"100vh", maxHeight:"100vh"}}>
            <Box sx={{padding:"10px", display:"flex", justifyContent:"space-between", flexDirection:"row", alignItems:"center", height:"auto", minWidth:"100vw",  maxWidth:"100vw", boxSizing: "border-box"}}>
                <Box sx={{display:"inline-flex", alignItems:'center'}}>
                    {mobile ?
                        <IconButton onClick={() => setOpen(true)}><MenuIcon /></IconButton> :
                        <span className="material-symbols-outlined">calendar_month</span>
                    }
                    <Typography variant="h4" fontFamily="Nova Mono">
                            ShiftBoard
                    </Typography>
                </Box>
                <Box>
                    {props.profile && <Chip avatar={<Avatar src={props.profile.image} onClick={(event) => {
                        setAnchor(event.currentTarget);
                    }}/>} label={props.profile.name}/>}
                    <Menu open ={menuOpen} anchorEl={anchor} onClose={()=>{setAnchor(null)}}>
                        <MenuItem onClick={() => {
                            localStorage.removeItem("token");
                            logout("/");
                        }}>Odhlásit se</MenuItem>
                    </Menu>
                </Box>
            </Box>
            {mobile?
                <>
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
                    <Box>{props.children}</Box>
                </>
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
                    <Box sx={{borderRadius:"5px", backgroundColor:"white", padding:"10px",  height:"100%", minWidth:"80%", maxWidth:"80%", boxSizing:"border-box"}}>{props.children}</Box>
                </Box>
            }
        </Box>
    );
}

export default PageLayout;