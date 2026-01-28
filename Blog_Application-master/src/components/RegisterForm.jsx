import React, { useState } from 'react';
import axios from 'axios'
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { Link} from 'react-router';
import { useNavigate } from 'react-router-dom';
const RegisterForm = () => {
    const initialvalues = {
        name: "",
        email: "",
        password: "",
        confirmpassword: "",
        // role: ""
    };
    const navigate=useNavigate()
    const [formvalues, setFormvalues] = useState(initialvalues);
    const [message, setMessage] = useState('')
    const [errors, setErrors] = useState({});

    const inputChange = (event) => {
        setFormvalues({
            ...formvalues,
            [event.target.name]: event.target.value
        });
    };

    const validate = () => {
        let newErrors = {};

        if (!formvalues.name.trim()) {
            newErrors.name = "Name is required";
        }

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

        if (!formvalues.confirmpassword) {
            newErrors.confirmpassword = "Confirm password is required";
        } else if (formvalues.password !== formvalues.confirmpassword) {
            newErrors.confirmpassword = "Passwords do not match";
        }


        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const SubmitHandler = async (event) => {
        try {
            event.preventDefault();
            console.log(formvalues)
            if (!validate()) return;
            const response = await axios.post('http://localhost:5000/user/register', formvalues)
            if (response.status == 200 || response.status == 201) {
                setMessage(response.data.message)
                 localStorage.setItem("token", response.data.token);
                 localStorage.setItem("user", JSON.stringify(response.data.users));
                 navigate('/blog.com')

            }
        } catch (err) {
            setMessage("Invalid Registration")
            console.log(err)
        }
    };

    return (
        <div className="app-container">
            <div className="auth-wrapper">
                <div className="auth-card">
                    <div className="card-header">
                        <h2>Join Community</h2>
                        <p>Start publishing your discoveries</p>
                    </div>

                    <form onSubmit={SubmitHandler}>
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formvalues.name}
                                className="form-input"
                                placeholder='Enter Name'
                                onChange={inputChange}
                            />
                            {errors.name && <p className="error-text">{errors.name}</p>}
                        </div>

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

                        <div className="form-group">
                            <label className="form-label">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmpassword"
                                value={formvalues.confirmpassword}
                                className="form-input"
                                placeholder='Enter Confirm Password'
                                onChange={inputChange}
                            />
                            {errors.confirmpassword && <p className="error-text">{errors.confirmpassword}</p>}
                        </div>

                        {/* <div className="form-group">
                    <label className="form-label">Role</label>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <label>
                            <input
                                type="radio"
                                name="role"
                                value="Reader"
                                onChange={inputChange}
                            /> Reader
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="role"
                                value="Author"
                                onChange={inputChange}
                            /> Author
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="role"
                                value="Editor"
                                onChange={inputChange}
                            /> Editor
                        </label>
                    </div>
                    {errors.role && <p className="error-text">{errors.role}</p>}
                </div> */}

                        <button type="submit" className="btn-primary">
                            Register
                        </button>
                        <br />
                        <br />
                        {message && <p className="success-text">{message}</p>}

                    </form>

                    <div className="toggle-text">
                        Already have an account?{" "}
                        {/* <span className="toggle-link" onClick={onSwitch}>
                    Sign in
                </span> */}
                        <Link to="/login" className="toggle-link">Sign</Link>
                        <div className="divider">
                            <span>OR</span>
                        </div>

                        <div className="google-btn">
                            <GoogleLogin
                                onSuccess={async (credentialResponse) => {
                                    try {
                                        const decoded = jwtDecode(credentialResponse.credential);
                                        console.log(decoded);

                                        const res = await axios.post("http://localhost:5000/user/google-auth", {
                                            name: decoded.name,
                                            email: decoded.email,
                                            picture: decoded.picture,
                                            googleId: decoded.sub,
                                        });
                                        if (res.status == 200 || res.status == 201) {
                                            localStorage.setItem("token", res.data.token);
                                            localStorage.setItem("user", JSON.stringify(res.data.users));
                                            navigate('/blog.com')
                                        }
                                    } catch (error) {
                                        console.error("Google auth failed:", error);
                                    }
                                }}
                                onError={() => {
                                    console.log("Google Login Failed");
                                }}
                            />

                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default RegisterForm;
