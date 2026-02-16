import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import CONF from "../../api/CONF";
import {Alert, Box, IconButton, Typography} from "@mui/material";

function Login() {
    const location = useLocation();
    const navigate = useNavigate();
    const [error, setError] = useState("");

    useEffect(() => {
        const hash = location.hash;

        if (hash) {
            const params = new URLSearchParams(hash.substring(1));
            const token = params.get("token");
            if (token) {
                localStorage.setItem("token", token);
                navigate("/home");
            }
            const error = params.get("error");
            if (error) {
                setError(error);
            }
        }
    }, [location, navigate]);
    return (
      <Box sx={{height:"100vh",width:"100vw",minWidth:"100vw", maxWidth:"100vw", minHeight:"100vh", maxHeight:"100vh", alignItems: 'center', display: 'flex', flexDirection:'column', justifyContent: 'space-evenly', boxSizing:"border-box", overflow:"hidden", padding:2}}>
          <Box sx={{display:"flex", flexDirection:"column", justifyContent:"space-between", alignItems:"center", boxSizing:"border-box", overflow:"hidden"}}>
              <Typography variant="h4" fontFamily="Nova Mono" sx={{marginBottom:"15px"}}>
                  <span className="material-symbols-outlined">calendar_month</span>
                  Beach směny
              </Typography>
            <IconButton onClick={() => window.location.href= (CONF.origin + "oauth2/authorization/google")} sx={{borderRadius:0, display:"inline-flex", justifyContent:"space-between"}}>
                <img src="/google.svg" alt="logo" color="white"/><Typography sx={{marginLeft:"15px"}}>Přihlásit se</Typography>
            </IconButton>
              {error!=="" && <Alert severity="error">{error}</Alert>}
          </Box>
          <a href="/privacy.html">Privacy policy</a>        
      </Box>
  );
}

export default Login;
