import {Box, IconButton, InputAdornment, MenuItem, Select, TextField, Typography} from "@mui/material";
import {useState} from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";
import API from "../../../api/API";
import Draggable from "../../dragDrop/Draggable";
import DropArea from "../../dragDrop/DropArea";
import {useShopList} from "../../../hooks/ShopList";

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

const Item = ({item, editable, index}) => {

    const [updateName, setUpdateName] = useState(item.name);
    const [updateUnit, setUpdateUnit] = useState(item.unit);
    const [updateCategory, setUpdateCategory] = useState(item.category);

    const [insert, setInsert] = useState(0);

    const {
        categories,
        updateItem,
        removeItem,
        setDraggedItem,
        dropIndex,
        setDropIndex
    } = useShopList();
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

    const onDragStartHandler = (e) => {
        e.stopPropagation();
        e.dataTransfer.setData("text/plain", "item");
        setDraggedItem(item);
    }

    const onDragOverHandler = (e) => {
        e.preventDefault();
        const rect = e.currentTarget.getBoundingClientRect();
        const offsetY = e.clientY - rect.top;
        if (e.dataTransfer.getData("text/plain") === "item") {
            const newIndex = (offsetY < (rect.height / 2)) ? index : index+1;
            const newInsert = (offsetY < (rect.height / 2))? 1 :2;
            setInsert(newInsert);
            if (newIndex !== dropIndex) {
                setDropIndex(newIndex);
            }
        }
    };
    
    const onDragExitHandler = (e) => {
        e.preventDefault();
        setInsert(0);
    }

    const onDropHandler = (e) => {
        e.preventDefault();
        setInsert(0);
    }

    return (
            <Draggable draggable={editable} onDragOver={onDragOverHandler} onDragExit={onDragExitHandler} onDrop={onDropHandler} onDragStart={onDragStartHandler}>
                <Box>
                    {insert ===1 && <DropArea/>}
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
                    {insert ===2 && <DropArea/>}
                </Box>
            </Draggable>
    )
}

export default Item;