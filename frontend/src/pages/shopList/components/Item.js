import {Box, IconButton, InputAdornment, MenuItem, Select, TextField, Typography, useMediaQuery} from "@mui/material";
import {useEffect, useState} from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import API from "../../../api/API";
import {useShopList} from "../../../hooks/ShopList";
import {useSortable} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {useDndMonitor} from "@dnd-kit/core";
import DropArea from "../../dragDrop/DropArea";
import {useSynchronizer} from "../../../hooks/Synchronizer";

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

    const [over, setOver] = useState(false);

    const {
        updateItem,
        removeItem,
        addToCart
    } = useShopList();

    const {registerTask, resolveTask} = useSynchronizer();

    useDndMonitor({
        onDragMove: ({over, active})=> {setOver((over?.id === "item"+item.id) && active.id.startsWith("item"))},
        onDragEnd: () => {setOver(false)},
        onDragCancel: () => {setOver(false)},
    });
    const update = async () => {
        const taskId = registerTask();
        try {
            const updated =  {
                ...item, name: updateName, unit: updateUnit,
            };
            await updateItem(updated);
        } catch (error) {
            alert(error);
        } finally {
            resolveTask(taskId);
        }
    }

    useEffect(() => {
        if (item.unit !== updateUnit) {
            update();
        }
    }, [updateUnit]);


    useEffect(() => {
        if (!editable || item.name === updateName) {
            return;
        }
        const timeout = setTimeout(() => update(), 1000);
        return () => {clearTimeout(timeout)}
    }, [updateName]);

    const [updateQuantity, setUpdateQuantity] = useState(item.shopCartItem?.quantity || 0);
    useEffect(() => {
        const updatedValue = Number(updateQuantity);

        addToCart({
            itemId: item.id,
            quantity: updatedValue
        });
    }, [updateQuantity]);

    useEffect(()=> {
        setUpdateQuantity(item.shopCartItem?.quantity || 0);
    }, [item.shopCartItem]);

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
            }} {...attributes} {...listeners} sx={{borderRadius:"5px",marginTop:"5px", marginX:"5px",paddingLeft:"0.5em"}}>
                <Box sx={
                    {
                        display:"flex",
                        justifyContent:"space-between", alignItems:"center",
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
                        </Box>:
                        <Typography variant="h6" sx={{fontSize:"1em"}}> {item.name}</Typography>
                    }
                    {editable ?
                        <IconButton onClick={del} sx={{color:"red"}}>
                            <DeleteIcon />
                        </IconButton>
                        :
                        <Box>
                            <TextField value={updateQuantity} onChange={e => setUpdateQuantity(e.target.value)} type="number" sx={{padding:0}} variant="outlined" slotProps={{input: {endAdornment: <InputAdornment position="end">{getUnit(item.unit)}</InputAdornment>}}} />
                        </Box>
                    }
                </Box>
            </Box>
        </>
    )
}

export default Item;