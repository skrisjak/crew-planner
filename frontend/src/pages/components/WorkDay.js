import {
    Box,
    Button,
    Dialog,
    Divider,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography
} from "@mui/material";
import {getDateText} from "../../util/days";
import {useResponsive} from "../../hooks/Responsive";
import {useState} from "react";
import dayjs from "dayjs";
import {useProfile} from "../../hooks/UserProfile";
import API from "../../api/API";
import WorkDayNote from "./WorkDayNote";
import RegisteredWorker from "./RegisteredWorker";
import AddNote from "./AddNote";
import RegisterShift from "./RegisterShift";
import AddUserToShift from "./AddUserToShift";

export default function WorkDay (props) {
    const workDay = props.workDay;
    const [notes, setNotes] = useState(workDay.notes);
    const [workers, setWorkers] = useState(workDay.registeredWorkers);
    const {mobile} = useResponsive();
    const [actionDialogOpen, setActionDialogOpen] = useState(false);
    const profile = useProfile(set => set.profile);

    const addNote = async (label,note) => {
        try {
            const postData = {
                id: null,
                workDayId: workDay.id,
                label: label,
                description: note,
            }

            const newNote = await API.postNote(postData);
            setNotes( prevState => [...prevState, newNote]);

        } catch (ignored) {
            alert(ignored.message);
        } finally {
            setActionDialogOpen(false);
        }
    }

    const addWorker = async (data, update=false) => {
        try {
            let newWorker= {
                ...data,
                workDayId: workDay.id,
            };

            if (update) {
                await API.updateWorker(newWorker);
                return newWorker;
            } else {
                newWorker = await API.addWorker(newWorker);
                setWorkers(prevWorkers => [...prevWorkers, newWorker]);
                return newWorker;
            }
        } catch (e) {
            alert(e);
        } finally {
            setActionDialogOpen(false);
        }
    }

    const deleteNote = (noteId) => {
        let updatedNotes = notes.filter(note => note.id !== noteId);
        setNotes(updatedNotes);
    }

    const deleteWorker= (workerId) => {
        let updatedWorkers = workers.filter(worker => worker.id !== workerId);
        setWorkers(updatedWorkers);
    }

    return (
        <>
            <Paper id={dayjs(workDay.date).format("YYYY-MM-DD")}
                   sx={{minWidth: mobile? undefined : "30%", minHeight: mobile? "30%" : undefined, padding: "5px", marginRight: mobile ? undefined : "10px", marginBottom: mobile ? "10px" : undefined, cursor: "pointer", transition: "0.3s", "&:hover": {scale:1.01}, display:"inline", alignItems:"start"}}
                   onClick={()=> {setActionDialogOpen(true)}}
            >
                <Typography sx={{marginBottom:"10px", width:"100%"}}>{getDateText(workDay.date)}</Typography>
                <Divider sx={{width:'100%', marginBottom:'10px'}}/>

                {notes.length > 0 && (
                            notes.map(note => {
                                return <WorkDayNote key={note.id} note={note} deleteNote={deleteNote}/>
                            })
                )}

                {workers.length > 0 && (
                    workers.map(registeredWorker => {
                                return <RegisteredWorker key={registeredWorker.id} registeredWorker={registeredWorker} addWorker={addWorker} deleteWorker={deleteWorker}/>
                    })
                )}
            </Paper>
            <Dialog open={actionDialogOpen} onClose={()=>{setActionDialogOpen(false)}} PaperProps={{sx:{display:"flex", flexDirection:"column", minWidth: mobile? "80vw" :"50vw", maxWidth: mobile? "80vw" : "50vw",minHeight: "50vh", maxHeight:"90vh", padding:"10px", boxSizing:"border-box", overflowY:"auto"}}}>
                <Typography variant="h5">{getDateText(workDay.date)}</Typography>
                <Divider sx={{marginBottom:"10px"}}/>
                {profile && ["ADMIN", "MANAGER"].includes(profile.role) && (
                    <AddNote addNote={addNote}/>
                )}
                {profile && ["ADMIN", "EMPLOYEE"].includes(profile.role) && (
                    <RegisterShift addWorker={addWorker}/>
                )}

                {profile && ["ADMIN", "MANAGER"].includes(profile.role) && (
                    <AddUserToShift addWorker={addWorker}/>
                )}
            </Dialog>
        </>
    )
}