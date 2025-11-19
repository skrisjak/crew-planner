import {Box, Divider, IconButton, Paper, TextField, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import Item from "./Item";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DoneIcon from '@mui/icons-material/Done';
import API from "../../../api/API";
import DeleteIcon from "@mui/icons-material/Delete";
import {sortByOrder, useShopList} from "../../../hooks/ShopList";
import {SortableContext, useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {useDndMonitor} from "@dnd-kit/core";
import DropArea from "../../dragDrop/DropArea";

const Category = ({category, editable}) => {
    const [updateName, setUpdateName] = useState(category.name);
    const [expanded, setExpanded] = useState(false);
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: "cat"+category.id, disabled: !editable });

    const {
        updateCategory,
        removeCategory,
        items,
    } = useShopList();

    const [myItems, setMyItems] = useState([]);

    useEffect(() => {
        setMyItems(items.filter(item => item.category?.id === category.id));
    }, [items])

    const update = async () => {
        try {
            await updateCategory( {
                ...category, name: updateName
            });
        } catch (error) {
            alert(error);
        }
    }

    const del = async () => {
        try {
            await API.deleteCategory(category.id);
            removeCategory(category.id);
        } catch (error) {
            alert(error);
        }
    }

    const [over, setOver] = useState(0);
    useDndMonitor({
            onDragMove: ({over, active})=> {
                if (over?.id ==="cat"+category.id && over?.id !==active.id) {
                    if (active.id.startsWith("item")) {
                        setOver(1);
                    }
                    if (active.id.startsWith("cat")) {
                        setOver(2);
                    }
                } else {
                    setOver(0);
                }
            },
            onDragEnd: () => {setOver(0)},
            onDragCancel: () => {setOver(0)},
        }
    );

    return (
        <>
            {over===2 && <DropArea/>}
            <Paper sx={{padding:"10px", marginBottom:"10px"}} ref={setNodeRef} style={{
                transform: CSS.Transform.toString(transform),
                transition,
            }} {...attributes} {...listeners}>
                <Box sx={{display:"flex", flexDirection:"row", justifyContent:"space-between"}}>
                    {editable?
                        <TextField variant="outlined" value={updateName} onChange={(e) => setUpdateName(e.target.value)}/> :
                        <Typography variant="h6">{category.name}</Typography>
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
                        <IconButton onClick={(e)=> {e.stopPropagation(); setExpanded(prev => !prev)}}>
                            {expanded? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                    }
                </Box>
                {(expanded || editable) &&
                    <>
                        <Divider sx={{width:'100%',}}/>
                        {over===1 && <DropArea/>}
                        <SortableContext items={items.map(item => "item"+item.id)}>
                            {myItems
                                .sort(sortByOrder)
                                .map(item => (
                                    <Item item={item} editable={editable} key={item.id}/>
                            ))}
                        </SortableContext>
                    </>}
            </Paper>
        </>
    )
}

export default Category;