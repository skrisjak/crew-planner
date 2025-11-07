import {Box, Button, Divider, TextField, Typography} from "@mui/material";
import {useResponsive} from "../../../hooks/Responsive";
import {useState} from "react";

const AddNote = (props) => {
    const {mobile} = useResponsive();
    const [label, setLabel] = useState("");
    const [note, setNote] = useState("");
    const addNote = props.addNote;
    const [loading, setLoading] = useState(false);

    return(
    <Box container sx={{width:'100%', display:"flex", flexDirection: mobile? "column" :"row", flexWrap: mobile? undefined :"wrap", gap:"1%"}}>
        <Typography variant="h6" sx={{width:"100%"}}>
            Přidat poznámku
        </Typography>
        <TextField sx={{width: mobile? "100%": "28%"}} id="label" variant="outlined" value={label} onChange={(e) => setLabel(e.target.value)} label="Nadpis" margin="dense"/>
        <TextField sx={{width: mobile? "100%": "68%"}} id="note" variant="outlined" value={note} onChange={(e) => setNote(e.target.value)} label="Poznámky" multiline margin="dense" />
        <Box sx={{display:"flex", flexDirection:"row-reverse", width:mobile? '100%': "96%"}}>
            <Button
                loading={loading}
                onClick={async ()=> {
                    setLoading(true);
                    await addNote(label, note);
                    setLoading(false)
                }}
                variant="contained">
                Přidat poznámku
            </Button>
        </Box>
        <Divider sx={{marginBottom:"10px", marginTop:"10px"}}/>
    </Box>
    )
}

export default AddNote;