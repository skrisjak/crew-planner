import {Box, Divider, IconButton, Paper, TextField, Typography} from "@mui/material";
import {useState} from "react";
import Item from "./Item";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DoneIcon from '@mui/icons-material/Done';
import API from "../../../api/API";
import DeleteIcon from "@mui/icons-material/Delete";


const Category = (props) => {
    const [category, setCategory] = useState(props.category);
    const editable = props.editable;
    const items = props.items.filter(item => item.category?.id === category.id);
    const [updateName, setUpdateName] = useState(category.name);
    const [expanded, setExpanded] = useState(false);
    const [rem, setRem] = useState(false);
    const toggle = () => {
        setExpanded(!expanded);
    }

    const update = async () => {
        try {
            await API.updateCategory( {
                ...category, name: updateName
            });
            setCategory({...category, name: updateName});
        } catch (error) {
            alert(error);
        }
    }

    const del = async () => {
        try {
            await API.deleteCategory(category.id);
            setRem(true);
            props.deleteCategory(category.id);
        } catch (error) {
            alert(error);
        }
    }

    return (
            rem ? null :
            <Paper sx={{padding:"10px", marginBottom:"10px"}}>
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
                    <IconButton onClick={(e)=> {e.stopPropagation(); toggle()}}>
                        {expanded? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                    }
                </Box>
                {(expanded || editable) &&
                    <>
                        <Divider sx={{width:'100%',}}/>
                        {items.map((item) => (
                            <Item item={item} editable={props.editable} key={item.id} updateItem={props.updateItem} categories={props.categories} key={item.id}/>
                        ))}
                    </>
                }
            </Paper>
    )
}

export default Category;