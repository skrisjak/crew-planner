import '../App.css';
import {useEffect} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import CONF from "../api/CONF";


function Login() {
    const location = useLocation();
    const navigate = useNavigate();

    console.log("react_app_url : " + CONF.origin);

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
        <button onClick={() => window.location.href= ("https://beachsmeny.up.railway.app/login/oauth2/google")}>Log in</button>
      </>
  );
}

export default Login;
