import './App.css';
import {useEffect} from "react";
import {useLocation, useNavigate} from "react-router-dom";


function Login() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const hash = location.hash;

        if (hash) {
            const params = new URLSearchParams(hash.substring(1));
            const token = params.get("token");
            if (token) {
                console.log(token);
                localStorage.setItem("token", token);
                navigate("/home");
            }
        }
    }, [location, navigate]);
    return (
      <>
        <button onClick={() => window.location.href="http://localhost:8080/login/oauth2/google"}>Log in</button>
      </>
  );
}

export default Login;
