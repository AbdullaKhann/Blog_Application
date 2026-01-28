import React, { useState } from 'react';
import axios from 'axios'
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { Link } from 'react-router';
import { useNavigate } from 'react-router-dom';
const LoginForm = () => {

    const initialvalues = {
        email: "",
        password: ""
    };
    const navigate=useNavigate()
    const [formvalues, setFormvalues] = useState(initialvalues);
    const [errors, setErrors] = useState("");
    const [message, setMessage] = useState("");

    const inputChange = (event) => {
        setFormvalues({
            ...formvalues,
            [event.target.name]: event.target.value
        });
    };

    const validate = () => {
        let newErrors = {};

        if (!formvalues.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formvalues.email)) {
            newErrors.email = "Invalid email format";
        }

        if (!formvalues.password) {
            newErrors.password = "Password is required";
        } else if (formvalues.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const SubmitHandler = async (event) => {
        try {
            event.preventDefault();
            if (!validate()) return;
            const token = localStorage.getItem("token");
            const response = await axios.post('http://localhost:5000/user/login', formvalues,{
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
            if (response.status == 200 || response.status == 201) {
                setMessage(response.data.message)
                localStorage.setItem("user", JSON.stringify(response.data.users));
                navigate("/blog.com")
            }
        } catch (err) {
            const errorMessage =err.response?.data?.message
             setMessage(errorMessage)
        }

    };

    return (
      <div className="app-container">
      <div className="auth-wrapper">
        <div className="auth-card">
            <div className="card-header">
                <h2>Welcome Back</h2>
                <p>Sign in to continue your research</p>
            </div>

            <form onSubmit={SubmitHandler}>
                <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                        type="email"
                        name="email"
                        value={formvalues.email}
                        className="form-input"
                        placeholder='Enter Email'
                        onChange={inputChange}
                    />
                    {errors.email && <p className="error-text">{errors.email}</p>}
                </div>

                <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formvalues.password}
                        className="form-input"
                        placeholder='Enter Password'
                        onChange={inputChange}
                    />
                    {errors.password && <p className="error-text">{errors.password}</p>}
                </div>

                <button type="submit" className="btn-primary">
                    Sign In
                </button>

                <br /><br />
                {message && <p className="success-text">{message}</p>}
            </form>

            <div className="toggle-text">
                New to the platform?{" "}
                <Link to="/register" className="toggle-link">Create an account</Link>
                <div className="divider">
                    <span>OR</span>
                </div>
            </div>
            <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
                <GoogleLogin
                    onSuccess={async (credentialResponse) => {
                        try {
                            const decoded = jwtDecode(credentialResponse.credential);
                            const token = localStorage.getItem("token");
                            const response = await axios.post(
                                "http://localhost:5000/user/google-login",
                                {
                                    // name: decoded.name,
                                    email: decoded.email
                                },{
                                    headers:{
                                        Authorization:`Bearer ${token}`
                                    }
                                }
                            );
                            if(response.status==200 || response.status==201)
                            {
                               setMessage(response.data.message);
                               localStorage.setItem("user", JSON.stringify(response.data.users));
                               navigate('/blog.com')
                            }

                        } catch (err) {
                        const errorMessage =err.response?.data?.message
                        setMessage(errorMessage)
                        }
                    }}
                    onError={() => {
                        setMessage("Google login failed");
                    }}
                />
            </div>
        </div>
    </div>
</div>
    );
};

export default LoginForm;
