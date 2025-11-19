import {Box, IconButton, InputAdornment, MenuItem, Select, TextField, Typography} from "@mui/material";
import {useState} from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";
import API from "../../../api/API";
import {useShopList} from "../../../hooks/ShopList";
import {useSortable} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {useDndMonitor} from "@dnd-kit/core";
import DropArea from "../../dragDrop/DropArea";

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

const Item = ({item, editable}) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: "item"+item.id, disabled: !editable });

    const [updateName, setUpdateName] = useState(item.name);
    const [updateUnit, setUpdateUnit] = useState(item.unit);
    const [updateCategory, setUpdateCategory] = useState(item.category);

    const [over, setOver] = useState(false);

    const {
        categories,
        updateItem,
        removeItem,
    } = useShopList();

    useDndMonitor({
        onDragMove: ({over, active})=> {setOver((over?.id === "item"+item.id) && active.id.startsWith("item"))},
        onDragEnd: () => {setOver(false)},
        onDragCancel: () => {setOver(false)},
    });
    const update = async () => {
        try {
            const updated =  {
                ...item, name: updateName, unit: updateUnit, categoryId: updateCategory?.id, category: updateCategory
            };
            await updateItem(updated);
        } catch (error) {
            alert(error);
        }
    }

    const del = async () => {
        try {
            await API.deleteItem(item.id);
            removeItem(item.id);
        } catch (error) {
            alert(error);
        }
    }

    return (
        <>
            {over && <DropArea/>}
            <Box ref={setNodeRef} style={{
                transform: CSS.Transform.toString(transform),
                transition,
            }} {...attributes} {...listeners}>
                <Box sx={
                    {
                        marginTop:"5px", marginX:"5px", display:"flex",
                        justifyContent:"space-between", alignItems:"center", borderRadius:"5px",
                        ":hover":{backgroundColor: editable?"lightgray": undefined}}}
                >
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
                            <Select variant="outlined" onChange={(e) => setUpdateCategory(categories.find(cat => Number(e.target.value)===cat.id) || null)} value={updateCategory?.id || -1}>
                                <MenuItem value={-1}>{" "} </MenuItem>
                                {categories.map(category => (
                                    <MenuItem value={category.id} key={category.id}>{category.name}</MenuItem>
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
            </Box>
        </>
    )
}

export default Item;