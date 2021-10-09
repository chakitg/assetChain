import React from 'react';
import Sawo from 'sawo';
import {useState, useEffect} from 'react';
import {useHistory} from "react-router-dom";

const Login = () => {
    let history = useHistory();
    const [userPayload, setUserPayload] = useState({});
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoggedOut, setIsLoggedOut] = useState(true);

    useEffect(() => {
    const onLoginSuccess = async(payload) => {
        setUserPayload(payload);
        setIsLoggedIn(true);
        sessionStorage.setItem("user_id", payload.user_id);
        console.log("Payload Object: ", payload);
    };
    const sawoConfig = {
        containerID: "sawo-container", 
        identifierType: "phone_number_sms",
        apiKey: "8366dcdc-84f6-4394-921e-b45660f58531",
        onSuccess: onLoginSuccess,
    };
    
    let sawo = new Sawo(sawoConfig);
    sawo.showForm();

    }, []);

    return (
        <React.Fragment>
            {!isLoggedIn && (
                <div id="sawo-container" style={{height: "100%", width: "300px", margin: "auto"}}></div>

            )}
            {isLoggedIn && (
                history.push("/dashboard")
            )}
        </React.Fragment>
    )
}

export default Login
