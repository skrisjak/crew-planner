import {Box, IconButton, InputAdornment, MenuItem, Select, TextField, Typography} from "@mui/material";
import {useState} from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";
import API from "../../../api/API";

const getUnit = (u) => {
    switch (u) {
        case "MILLILITRES":
            return "ml";
        case "LITRES":
            return "l";
        case "GRAMS":
            return "g";
        case "KILOGRAMS":
            return "kg"
        default:
            return "ks";
    }
}

const Item = (props) => {

    const [item, setItem] = useState(props.item);
    const editable = props.editable;

    const [updateName, setUpdateName] = useState(item.name);
    const [updateUnit, setUpdateUnit] = useState(item.unit);
    const [updateCategory, setUpdateCategory] = useState(item.category);
    const [rem, setRem] = useState(false);

    const update = async () => {
        try {
            const updated =  {
                ...item, name: updateName, unit: updateUnit, categoryId: updateCategory?.id, category: updateCategory
            };
            await API.updateItem(updated);
            props.updateItem(updated)
            setItem(updated);
        } catch (error) {
            alert(error);
        }
    }

    const del = async () => {
        try {
            await API.deleteItem(item.id);
        } catch (error) {
            alert(error);
        }
    }

    return (
        rem? null :
        <Box sx={{marginTop:"5px", paddingX:"5px", display:"flex", justifyContent:"space-between", alignItems:"center"}}>

            {editable?
                <Box sx={{display:"flex", flexDirection:"row", gap:"5px"}}>
                    <TextField variant="outlined" value={updateName} onChange={(e) => setUpdateName(e.target.value)}/>
                    <Select variant="outlined" onChange={(e) => setUpdateUnit(e.target.value)} value={updateUnit}>
                        <MenuItem value="PIECES">ks</MenuItem>
                        <MenuItem value="GRAMS">g</MenuItem>
                        <MenuItem value="KILOGRAMS">kg</MenuItem>
                        <MenuItem value="MILLILITRES">ml</MenuItem>
                        <MenuItem value="LITRES">l</MenuItem>
                    </Select>
                    <Select variant="outlined" onChange={(e) => setUpdateCategory(e.target.value)} value={updateCategory}>
                        <MenuItem value={null} selected={updateCategory===null}> </MenuItem>
                        {props.categories.map(category => (
                            <MenuItem value={category} key={category.id} selected={category.id === updateCategory?.id}>{category.name}</MenuItem>
                        ))}
                    </Select>

                </Box>:
                <Typography variant="h6" sx={{fontSize:"1em"}}> {item.name}</Typography>
            }
            {editable ?
                <Box>
                    <IconButton onClick={update} sx={{color:"green"}}>
                        <DoneIcon />
                    </IconButton>
                    <IconButton onClick={del} sx={{color:"red"}}>
                        <DeleteIcon />
                    </IconButton>
                </Box>
                :
                <Box>
                    <TextField type="number" sx={{padding:0}} variant="outlined" slotProps={{input: {endAdornment: <InputAdornment position="end">{getUnit(item.unit)}</InputAdornment>}}} />
                </Box>
            }
        </Box>
    )
}

export default Item;