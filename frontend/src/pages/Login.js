import '../App.css';
import {useEffect} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import CONF from "../api/CONF";


function Login() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const hash = location.hash;

        if (hash) {
            const params = new URLSearchParams(hash.substring(1));
            const token = params.get("token");
            if (token) {
                localStorage.setItem("token", token);
                navigate("/home");
            }
        }
    }, [location, navigate]);
    return (
      <>
        <button onClick={() => window.location.href= (CONF.origin+"login/oauth2/google")}>Log in</button>
      </>
  );
}

export default Login;
