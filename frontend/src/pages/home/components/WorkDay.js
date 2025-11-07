import {
    Box,
    Dialog,
    Divider,
    Paper,
    Typography
} from "@mui/material";
import {getDateText} from "../../../util/days";
import {useResponsive} from "../../../hooks/Responsive";
import {useState} from "react";
import dayjs from "dayjs";
import {useProfile} from "../../../hooks/UserProfile";
import API from "../../../api/API";
import WorkDayNote from "./WorkDayNote";
import RegisteredWorker from "./RegisteredWorker";
import AddNote from "./AddNote";
import RegisterShift from "./RegisterShift";
import WorkDaySlot from "./WorkDaySlot";
import SlotsManagement from "./SlotsManagement";
import Weather from "./Weather";

export default function WorkDay (props) {
    const workDay = props.workDay;
    const [notes, setNotes] = useState(workDay.notes);
    const [workers, setWorkers] = useState(workDay.registeredWorkers);
    const [slots, setSlots] = useState(workDay.slots);
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
        const updatedNotes = notes.filter(note => note.id !== noteId);
        setNotes(updatedNotes);
    }

    const deleteWorker= (workerId) => {
        const updatedWorkers = workers.filter(worker => worker.id !== workerId);
        setWorkers(updatedWorkers);
    }

    const updateSlot = (slotId, updatedSlot) => {
        setSlots(prevState => {
            return prevState.map(slot => {
                if (slot.id === slotId) {
                    return updatedSlot;
                }
                return slot;
            })
        });
    }

    const deleteSlot = (slotId) => {
        setSlots(prevState => {
            return prevState.filter(slot => slot.id !== slotId);
        });
    }

    const addSlot = (slot) => {
        setSlots(prevState =>
            [...prevState, slot]
        )
    }

    return (
        <>
            <Paper id={dayjs(workDay.date).format("YYYY-MM-DD")}
                   sx={{ boxSizing:"border-box",minWidth: mobile? undefined : "30%", minHeight: mobile? "30%" : undefined,maxHeight:"100%", padding: "5px", marginRight: mobile ? undefined : "10px", marginBottom: mobile ? "10px" : undefined, cursor: "pointer", transition: "0.3s", "&:hover": {scale:1.01}, display:"flex", flexDirection:"row", flexWrap:"wrap", gap:1, alignItems:"flex-start", alignContent:"flex-start"}}
                   onClick={()=> {setActionDialogOpen(true)}}
            >
                <Box sx={{marginBottom:mobile? undefined:"10px", width:"100%", display:"inline-flex", alignItems:"flex-end", justifyContent:"space-between"}}>
                    <Typography>{getDateText(workDay.date)}</Typography>
                    <Weather date={workDay.date} />
                </Box>
                <Divider sx={{width:'100%'}}/>

                {notes? (notes.length > 0 && (
                            notes.map(note => {
                                return <WorkDayNote key={note.id} note={note} deleteNote={deleteNote}/>
                            })
                )): null}

                {slots? (slots?.length > 0 && (
                    slots?.map(slot => {
                        return <WorkDaySlot key={slot.id} slot={slot} updateSlot={updateSlot}/>
                    })
                )): null}

                {workers? (workers.length > 0 && (
                    <>
                        <Divider sx={{width:"100%"}}/>
                        {workers.map(registeredWorker => {
                                return <RegisteredWorker key={registeredWorker.id} registeredWorker={registeredWorker} addWorker={addWorker} deleteWorker={deleteWorker}/>
                        })
                        }
                    </>
                )) : null}
            </Paper>
            <Dialog open={actionDialogOpen} onClose={()=>{setActionDialogOpen(false)}} PaperProps={{sx:{display:"flex", flexDirection:"column", minWidth: mobile? "80vw" :"50vw", maxWidth: mobile? "90vw" : "50vw",minHeight: "50vh", maxHeight:"90vh", padding:"10px", boxSizing:"border-box", overflowY:"auto"}}}>
                <Typography variant="h5">{getDateText(workDay.date)}</Typography>
                <Divider sx={{marginBottom:"10px"}}/>
                {profile && ["ADMIN", "MANAGER"].includes(profile.role) && (
                    <AddNote addNote={addNote}/>
                )}

                {profile && ["ADMIN", "MANAGER"].includes(profile.role) && (
                    <SlotsManagement addWorker={addWorker} slots={slots} updateSlot={updateSlot} addSlot={addSlot} deleteSlot={deleteSlot} dayId={workDay.id}/>
                )}

                {profile && ["ADMIN", "EMPLOYEE"].includes(profile.role) && (
                    <RegisterShift access addWorker={addWorker}/>
                )}
            </Dialog>
        </>
    )
}