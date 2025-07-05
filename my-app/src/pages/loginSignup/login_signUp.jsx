import React, { useState } from "react";
import "./login_signUp.css"
const userIcon = require("../Assets/person.png")
const emailIcon = require("../Assets/email.png")
const passwordIcon = require("../Assets/password.png")

const LoginSinup = () => {
    const [action, setAction] = useState("Login")
    
    return (
        <div className="container">
            <div className="header">
                <div className="text">Sign Up</div>
            </div>
             <div className="submit-container">
                <div className={action === "Login" ? "submit gray" : "submit"} onClick={() => setAction("Sign Up")}>sign up</div>
                <div className={action === "Sign Up" ? "submit gray" : "submit"} onClick={() => setAction("Login")}>login</div>

            </div>
            <div className="inputs">
                {action === "Login" ? <div></div> :
                    <div className="input" >
                        <img src={userIcon} alt="" />
                        <input type="text" placeholder="name" />
                    </div>}
                {action === "Login" ? <div></div> :
                    <div className="input" >
                        <img src={userIcon} alt="" />
                        <input type="text" placeholder="User Name" />
                    </div>}
                <div className="input">
                    <img src={emailIcon} alt="" />
                    <input type="email" placeholder="email" />
                </div>
                <div className="input">
                    <img src={passwordIcon} alt="" />
                    <input type="password" placeholder="password" />
                </div>
            </div>
            <div className="submit">
                {action === "Login"?"login":"Sign Up"}
            </div>
           
        </div>

    );

}
export default LoginSinup;