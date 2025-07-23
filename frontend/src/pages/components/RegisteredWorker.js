import {Avatar, Box, Chip, Dialog, Tooltip} from "@mui/material";
import {useState} from "react";
import {useProfile} from "../../hooks/UserProfile";
import RegisterShift from "./RegisterShift";
import {useResponsive} from "../../hooks/Responsive";
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

function getIcon(availability) {
    switch (availability) {
        case "WORKING":
            return <CheckCircleIcon sx={{color: "green"}}/>
        case "AVAILABLE":
            return <AccessibilityIcon sx={{color: "yellow"}}/>
        default:
            return <CancelIcon sx={{color: "red"}}/>
    }
}

const RegisteredWorker =(props) => {
    const [registeredWorker, setRegisteredWorker] = useState(props.registeredWorker);
    const hasNote = registeredWorker.note ? (registeredWorker.note!=="") : false;
    const profile = useProfile(st => st.profile);
    const [toolTipOpen, setToolTipOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const {mobile} = useResponsive();
    const [updatable, setUpdatable] = useState(false);

    const openDialog = (e) => {
        e.stopPropagation();

        let canAccess = false;

        if (["ADMIN", "MANAGER"].includes(profile.role)) {
            canAccess = true;
        }

        if (profile.nickName) {
            if (profile.nickName === registeredWorker.user) {
                canAccess = true;
            }
        } else {
            if (profile.name === registeredWorker.user) {
                canAccess = true;
            }
        }
        setUpdatable(canAccess);
        setDialogOpen(true);
    }



    const addWorker = async (newWorker, updatable) => {
        try {
            const update = await props.addWorker(newWorker, updatable);

            setRegisteredWorker(prevState => {return {...prevState, ...update}});
            setDialogOpen(false);
        } catch (e) {
            alert(e);
        }
    }

    return (
        <>
            <Tooltip title={<Box maxWidth="20vw">{registeredWorker.note}</Box>} open={toolTipOpen} onOpen={e=> hasNote && setToolTipOpen(true)} onClose={e => setToolTipOpen(false)} onClick={openDialog}>
                <Chip avatar={<Avatar src={registeredWorker.image} />} variant="filled" label={registeredWorker.user } icon={getIcon(registeredWorker.availability)} sx={{margin:"5px", ":hover":{scale:1.02}, backgroundColor:getColor(registeredWorker.availability)}}/>
            </Tooltip>
            <Dialog open={dialogOpen} onClose={e => {setDialogOpen(false); e.stopPropagation();}} PaperProps={{sx:{display:"flex", flexDirection:"column", minWidth: mobile? "80vw" :"50vw", maxWidth: mobile? "80vw" : "50vw",minHeight: "50vh", maxHeight:"90vh", padding:"10px", boxSizing:"border-box", overflowY:"auto"}}} onClick={e => e.stopPropagation()}>
                <RegisterShift updatable access={updatable} registeredWorker={registeredWorker} addWorker={addWorker} deleteWorker={props.deleteWorker}/>
            </Dialog>
        </>
    )
}

export default RegisteredWorker;