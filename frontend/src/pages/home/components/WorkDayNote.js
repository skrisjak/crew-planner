import {
    Box, Button,
    Dialog, Divider,
    IconButton, Paper,
    TextField,
    Typography
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import {useState} from "react";
import {useResponsive} from "../../../hooks/Responsive";
import API from "../../../api/API";
import {useProfile} from "../../../hooks/UserProfile";

const WorkDayNote = (props) => {
    const [note, setNote] = useState(props.note);
    const {mobile} = useResponsive();
    const [expanded, setExpanded] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [updateLabel, setUpdateLabel] = useState(note.label);
    const [updateDescription, setUpdateDescription] = useState(note.description);
    const [updating, setUpdating] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const profile = useProfile(prof => prof.profile);

    const toggle = () => {
        setExpanded(!expanded);
    }

    const updateNote = async (e) => {
        e.stopPropagation();
        setUpdating(true);
        try {

            const updateNote = {
                ...note,
                label: updateLabel,
                description: updateDescription,
            }
            await API.updateNote(updateNote);
            setNote(updateNote);
            setModalOpen(false);
            setUpdating(false);
        } catch (error) {
            alert(error.message);
        }
    }

    const deleteNote = async (e) => {
        e.stopPropagation();
        setDeleting(true);
        try {
            await API.deleteNote(note.id);
            setDeleting(false);
            props.deleteNote(note.id);
        } catch (error) {
            alert(error.message);
        }
    }

    return (
        <>
            <Paper onClick={(e)=> {e.stopPropagation(); toggle()}} sx={{":hover": {scale:1.01, backgroundColor:"lightgrey",}, display:"flex", flexDirection:"column", width:"100%", padding:"5px", boxSizing:"border-box"}}>
                <Box sx={{display:"flex", justifyContent:"space-between", flexDirection:"row", width:"100%", borderRadius:"5px", alignItems:"center"}}>
                    <Box sx={{alignItems:"center", display:"inline-flex", justifyContent:"space-between"}}>
                        <Typography sx={{fontWeight:500}}>
                            {note.label}
                        </Typography>
                    </Box>
                    {profile && ["ADMIN", "MANAGER"].includes(profile.role) &&
                    <Box>
                        <IconButton onClick={(e)=> {e.stopPropagation(); setModalOpen(true)}}>
                            <EditIcon fontSize="small"/>
                        </IconButton>
                    </Box>
                    }
                </Box>
                {expanded && <Divider/>}
                <Box sx={{whiteSpace: "pre-line",maxHeight: expanded? "auto" : 0, width:"100%", border:"0:5px solid grey", borderBottomRightRadius:"5px", borderBottomLeftRadius:"5px", transition:"max-height 0.3s ease-in-out, padding 0.3s ease"}}>{expanded && note.description}</Box>
            </Paper>
            <Dialog open={modalOpen} onClose={() => setModalOpen(false)} onClick={(e)=> e.stopPropagation()} PaperProps={{sx:{display:"flex", flexDirection:"column", minWidth: mobile? "80vw" :"50vw", maxWidth: mobile? "80vw" : "50vw",height: "50vh", padding:"10px", boxSizing:"border-box", overflowY:"auto"}}}>
                <Box container sx={{width:'100%', display:"flex", flexDirection: mobile? "column" :"row", flexWrap: mobile? undefined :"wrap", gap:"1%"}}>
                    <Typography variant="h6" sx={{width:"100%"}}>
                        Upravit poznámku
                    </Typography>
                    <TextField sx={{width: mobile? "100%": "28%"}} id="label" variant="outlined" value={updateLabel} onChange={(e) => setUpdateLabel(e.target.value)} label={undefined} margin="dense"/>
                    <TextField sx={{width: mobile? "100%": "68%"}} id="note" variant="outlined" value={updateDescription} onChange={(e) => setUpdateDescription(e.target.value)} label={undefined} multiline margin="dense" />
                    <Box sx={{display:"flex", flexDirection:"row-reverse", gap:"1%", width:mobile? '100%': "96%"}}>

                        <Button onClick={deleteNote} variant="outlined" loading={deleting}>
                            Smazat
                        </Button>

                        <Button onClick={updateNote} variant="contained" loading={updating}>
                            Upravit
                        </Button>

                    </Box>
                    <Divider sx={{marginBottom:"10px"}}/>
                </Box>
            </Dialog>
        </>
    )
}

export default WorkDayNote;