import {useEffect, useState} from "react";
import API from "./api/API";

function Home() {

    const [hello, setHello] = useState("");
    useEffect(() => {
        API.getUserData()
            .then(res => {
                setHello(res);
            })
            .catch(err => {
                setHello(err.message);
            })
    });
    return (
        <h1>{hello}</h1>
    )
}

export default Home;