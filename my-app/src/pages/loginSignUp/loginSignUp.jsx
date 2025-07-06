import React from "react";
import { useState} from "react";
import { useNavigate } from "react-router-dom"
import "./login.css"
import api from "../../API";
import axios from "axios"

const LoginSignUp = () => {
    const [action, setAction] = useState("Login");
    const [userRole, setUserRole] = useState("teacher")
    const [formData, setFormData] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    
    const handleForm = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        console.log(name + " changed to " + value)
    };

    const handelLogin = async () => {
        const email = formData.email;
        const password = formData.password;
        
        if (!email || !password) {
            console.log("required field missing")
            setError('Required fields missing');
            return; 
        }
        
        try {
            setLoading(true);
            setError("");
            
            const response = await axios.post(`${api}/login`, { email, password });
            console.log("Response:", response);
            
            const userData = response.data.user;
            const token = response.data.token;
            
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(userData));

            if (userData.userRole === "student") {
                navigate("/studentDashboard");
            } else {
                navigate("/teacherDashboard");
            }
            
            console.log('user logged in:', userData);
            setLoading(false);

        } catch (error) {
            setLoading(false);
            console.log(error);
            
            if (error.response) {
                const errorMessage = error.response.data.message || error.response.data.error || 'Login failed';
                setError(errorMessage);
            } else if (error.request) {
                setError('Network error. Please check your connection.');
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        }
    }

    const handleSingUp = async () => {
        const { name, userName, email, password } = formData;
        
        if (!name || !userName || !email || !password) {
            console.log("All fields are required for sign up");
            setError('All fields are required for sign up');
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await axios.post(`${api}/register`, {
                name:name,
                userName:userName,
                email:email,
                password:password,
                userRole:userRole
            });

            console.log("Sign up response:", response);

            const userData = response.data.user;
            const token = response.data.token;

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(userData));
            console.log('User signed up successfully:', userData);
            setLoading(false);

        } catch (error) {
            setLoading(false);
            console.log("Sign up error:", error);

            if (error.response) {
                const errorMessage = error.response.data.message || error.response.data.error || 'Sign up failed';
                setError(errorMessage);
            } else if (error.request) {
                setError('Network error. Please check your connection.');
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        }
    }

    return (
        <div className="container">
            <div className="header">
                <div className="text">Login/Sign Up</div>
            </div>
            <div className="submit-container">
                <div className={action === "Login" ? "submit gray" : "submit"} onClick={() => setAction("Sign Up")}>sign up</div>
                <div className={action === "Sign Up" ? "submit gray" : "submit"} onClick={() => setAction("Login")}>login</div>
            </div>
            <div className="inputs">
                {action === "Login" ? <div></div> :
                    <div className="input" >
                        <input type="text" placeholder="name" name="name" onChange={handleForm} />
                    </div>}
                {action === "Login" ? <div></div> :
                    <div className="input" >
                        <input type="text" placeholder="User Name" name="userName" onChange={handleForm} />
                    </div>}
                <div className="input">
                    <input type="email" placeholder="email" name="email" onChange={handleForm} />
                </div>
                <div className="input">
                    <input type="password" placeholder="password" name="password" onChange={handleForm} />
                </div>
                <div className="userRole">
                    <button className="role" onClick={() => { setUserRole("student") }}>student</button>
                    <button className="role" onClick={() => { setUserRole("teacher") }}>teacher</button>
                </div>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <div className="submit" onClick={action === "Login" ? handelLogin : handleSingUp} disabled={loading}>
                {loading ? "Loading..." : (action === "Login" ? "Login" : "Sign Up")}
            </div>
        </div>
    );
}

export default LoginSignUp;