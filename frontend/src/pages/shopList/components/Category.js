import {Box, Divider, IconButton, Paper, TextField, Typography} from "@mui/material";
import {useState} from "react";
import Item from "./Item";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DoneIcon from '@mui/icons-material/Done';
import API from "../../../api/API";
import DeleteIcon from "@mui/icons-material/Delete";
import Draggable from "../../dragDrop/Draggable";
import DropArea from "../../dragDrop/DropArea";
import {sortByOrder, useShopList} from "../../../hooks/ShopList";

const Category = ({category, editable, index}) => {
    const [updateName, setUpdateName] = useState(category.name);
    const [expanded, setExpanded] = useState(false);

    const {
        updateCategory,
        removeCategory,
        items,
        dropCategory,
        setDropCategory,
        dropIndex,
        setDropIndex,
        setDraggedCategory
    } = useShopList();
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

    const [insert, setInsert] = useState(0);

    const onDragOverHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.getData("text/plain") === "item") {
            if (dropCategory === null || dropCategory.id !== category.id) {
                setDropCategory(category);
            }

            if (items.length === 0)  {
                setInsert(3);
            }

        } else if (e.dataTransfer.getData("text/plain") === "category") {
            const rect = e.currentTarget.getBoundingClientRect();
            const offsetY = e.clientY - rect.top;
            const newIndex = (offsetY < (rect.height / 2)) ? index : index+1;
            const newInsert = (offsetY < (rect.height / 2))? 1 :2;
            setInsert(newInsert);
            if (newIndex !== dropIndex) {
                setDropIndex(newIndex);
            }
        }
    }

    const onDragExitHandler = (e) => {
        e.preventDefault();
        setInsert(0);
    }

    const onDropHandler = (e) => {
        e.preventDefault();
        setInsert(0);
    }

    const onDragStartHandler = (e) => {
        e.stopPropagation();
        e.dataTransfer.setData("text/plain", "category");
        setDraggedCategory(category);
    }

    return (
        <Draggable draggable={editable} onDragOver={onDragOverHandler} onDrop={onDropHandler} onDragExit={onDragExitHandler} onDragStart={onDragStartHandler}>
            {insert === 1 && <DropArea/>}
            <Paper sx={{padding:"10px", marginBottom:"10px"}} >
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
                {insert===3 && <DropArea/>}
                {(expanded || editable) &&
                    <>
                        <Divider sx={{width:'100%',}}/>
                        {items
                            .filter(item => item.category?.id === category.id)
                            .sort(sortByOrder)
                            .map((item, index) => (
                                <Item item={item} editable={editable} key={item.id} index={index}/>
                            ))}
                    </>}
            </Paper>
            {insert===2 && <DropArea/>}
        </Draggable>
    )
}

export default Category;