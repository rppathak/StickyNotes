import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import "../App.css"


const Login = (props) => {
    const [credentials, setCredentials] = useState({ email: "", password: "" })
    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: credentials.email, password: credentials.password })
        });
        const json = await response.json()
        console.log(json);
        if (json.success) {
            // Save the auth token and redirect
            localStorage.setItem('token', json.authtoken);
            props.showAlert("logged in Successfully", "success", { marginTop: "auto" })
            navigate("/");

        }
        else {
            props.showAlert("invalid credentials", "danger", { marginTop: "auto" })
        }
    }

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    return (
        <>
            <div style={{ marginTop: "100px" }}>
                <div className="container text-center my-4"><h2>Login To Continue</h2></div>
                <div className="col-md-5 mx-auto my-auto">
                    <div className="card shadow p-3 mb-5 rounded card-body ">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email address</label>
                                <input type="email" className="form-control" value={credentials.email} onChange={onChange} id="email" name="email" aria-describedby="emailHelp" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input type="password" className="form-control" value={credentials.password} onChange={onChange} name="password" id="password" />
                            </div>
                            <div className="container text-center pt-1"><button type="submit" className="btn btn-primary btn-block">Login</button>
                            </div>

                        </form>
                        <p className="small-xl pt-3 text-center">
                            <span className="text-muted">Not a member?</span>
                            <Link to="/signup">Sign up</Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login