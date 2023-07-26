import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../App.css'

const Signup = (props) => {

    const [credentials, setCredentials] = useState({ name: "", email: "", password: "", cpassword: "" })
    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, password, cpassword } = credentials;
        if (cpassword === password) {
            const response = await fetch("http://localhost:5000/api/auth/createuser", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });
            const json = await response.json()
            console.log(json);
            if (json.success) {
                // Save the auth token and redirect
                localStorage.setItem('token', json.authtoken);
                props.showAlert("Account created Successfully", "success", { marginTop: "auto" })
                navigate("/");

            }
            else {
                props.showAlert("invalid credentials", "danger", { marginTop: "auto" })
            }
        }
        else {
            props.showAlert("Password and cpassword should be same", "danger", { marginTop: "auto" })
        }

    }

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }
    return (
        <div style={{ marginTop: "60px" }}>
            <div className="container text-center my-4"><h2>Signup To Continue</h2></div>
            <div>
                <div className="card shadow-sm p-3 mb-5 rounded card-body ">
                <img src='notes.png' alt='' style={{width:'40px',margin:'auto',marginTop:'10px',marginBottom:0}} className='logo'/>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Name</label>
                            <input type="text" className="form-control" id="name" name='name' onChange={onChange} aria-describedby="emailHelp" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email address</label>
                            <input type="email" className="form-control" id="email" name='email' onChange={onChange} aria-describedby="emailHelp" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input type="password" className="form-control" id="password" name='password' onChange={onChange} min={5} required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                            <input type="password" className="form-control" id="cpassword" name='cpassword' onChange={onChange} min={5} required />
                        </div>

                        <div className="container text-center pt-1"><button type="submit" className="btn btn-primary btn-block">Signup</button>
                        </div>
                    </form>
                    <p className="small-xl pt-3 text-center">
                        <span className="text-muted">Aleady a member?</span>
                        <Link to="/login">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Signup