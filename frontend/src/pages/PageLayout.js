import {
    Avatar,
    Box,
    ListItem,
    List,
    SwipeableDrawer,
    ListItemText,
    Toolbar, IconButton, ListItemButton, Grid, AppBar
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import React, {useState} from "react";


function PageLayout(props) {
    const [mobile, setMobile] = useState(window.innerWidth <= 800);

    const [width, setWidth] = useState(window.innerWidth);

    const [open, setOpen] = useState(false);

    window.addEventListener("resize", ()=> {
        setMobile(window.innerWidth <= 800);
        setWidth(window.innerWidth);
    })


    return (
        <Grid container columns={12} sx={{padding:0, margin:0}}>
            <Grid container size={12}>
                <AppBar position="fixed" sx={{padding:"10px", display:"flex", justifyContent:"space-between", flexDirection:"row", alignItems:"center"}}>
                    <Box>
                        {mobile && <IconButton onClick={() => setOpen(true)}>
                            <MenuIcon />
                        </IconButton>}
                    </Box>
                    {props.profile && <Avatar src={props.profile.image} />}
                </AppBar>
                <Toolbar/>
            </Grid>
            {mobile?
                <>
                    <SwipeableDrawer open={open} onClose={() => setOpen(false)} onOpen={()=>setOpen(true)}>
                        <Box sx={{width: width}}>
                        <List>
                            <ListItem key="heya">
                                <ListItemButton>
                                    <MenuIcon />
                                    <ListItemText>Hey</ListItemText>
                                </ListItemButton>
                            </ListItem>
                            <ListItem key="hey">
                                <ListItemButton>
                                    <MenuIcon />
                                    <ListItemText>Hey</ListItemText>
                                </ListItemButton>
                            </ListItem>
                        </List>
                        </Box>
                    </SwipeableDrawer>
                    {props.children}
                </>
                :
                <Grid size={2} sx={{borderRight:" 1px solid grey"}}>
                    <List>
                        <ListItem key="heya">
                            <ListItemButton>
                                <MenuIcon />
                                <ListItemText>Hey</ListItemText>
                            </ListItemButton>
                        </ListItem>
                        <ListItem key="hey">
                            <ListItemButton>
                                <MenuIcon />
                                <ListItemText>Hey</ListItemText>
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Grid>
            }
        </Grid>
    );
}

export default PageLayout;