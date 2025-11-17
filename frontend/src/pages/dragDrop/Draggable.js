import {Box} from "@mui/material";
import {useRef, useState} from "react";
import React from "react";


const Draggable = (props) => {

    const draggable = props.draggable;

    const [dragged, setDragged] = useState(false);

    const ref = useRef();

    const onDragStartHandler = (event) => {
        setDragged(true);
        event.dataTransfer.setDragImage(ref.current, ref.current.offsetWidth /2, ref.current.offsetHeight/2);
        props.onDragStart?.(event);
    }

    const onDragEndHandler = (event) => {
        setDragged(false);
        props.onDragEnd?.(event);
    }


    return (
        <>
            <Box draggable={draggable} sx={{display:dragged?"none": "block"}} {...props} onDragStart={onDragStartHandler} onDragEnd={onDragEndHandler}>
                {props.children}
            </Box>
            <Box sx={{position:"absolute", top:"-1000px", opacity:1}} ref={ref}>
                {props.children}
            </Box>
        </>
    )
}

export default Draggable;