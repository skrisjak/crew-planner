import {Box} from "@mui/material";


const DropArea = (props) => {
    return (
        <Box {...props} sx={{borderStyle: "dashed", borderRadius:"5px", borderColor:"gray"}}>
            <Box sx={{width: props.sx?.width ||'100%', height: props.sx?.height || "30px",backgroundColor:"lightgray", border:"none", ...props.sx, margin: props.sx?.margin || "3px", borderRadius: props.sx?.borderRadius ||"5px"}}>
                {props.children}
            </Box>
        </Box>
    )
}

export default DropArea;