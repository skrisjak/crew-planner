import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import CONF from "../api/CONF";
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
      <Box sx={{width:"100vw",height:"100vh",alignItems: 'center', display: 'flex', flexDirection:'column', justifyContent: 'space-evenly', boxSizing:"border-box"}}>
          <Box sx={{padding:"10px", display:"flex", flexDirection:"column", justifyContent:"space-between", alignItems:"center", boxSizing:"border-box"}}>
              <Typography variant="h4" fontFamily="Nova Mono" sx={{marginBottom:"15px"}}>
                  <span className="material-symbols-outlined">calendar_month</span>
                  ShiftBoard
              </Typography>
            <IconButton onClick={() => window.location.href= (CONF.origin + "oauth2/authorization/google")} sx={{borderRadius:0, display:"inline-flex", justifyContent:"space-between"}}>
                <img src="/google.svg" alt="logo" color="white"/><Typography sx={{marginLeft:"15px"}}>Přihlásit se</Typography>
            </IconButton>
              {error!=="" && <Alert severity="error">{error}</Alert>}
          </Box>
      </Box>
  );
}

export default Login;
