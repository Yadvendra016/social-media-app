import { useState } from "react";
import axios from "axios";
import {toast} from "react-toastify";
import {Modal} from 'antd';
import Link from "next/link";
import{SyncOutlined} from "@ant-design/icons"

const Register = () =>{
    // Use State
    const[name, setName] = useState('');
    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');
    const[secret, setSecret] = useState(''); 
    const[ok, setOk] = useState(false); //initial it will false when i get data then it will true
    const[loading, setLoading] = useState(false);

// this function is call when form is submit
const handleSubmit = async (e) =>{
    e.preventDefault();

    try {
        setLoading(true);
       const {data} =  axios.post(`${process.env.NEXT_PUBLIC_API}/register`,{
        name,
        email,
        password,
        secret
    });
    setName('');
    setEmail('');
    setPassword('');
    setSecret('');
    setOk(data.ok);
    setLoading(false);
    } catch (error) {
        toast.error(error.response.data);
        setLoading(false);
    }
};

    return (
        // Header
        <div className="container-fluid">
            <div className="row py-5 bg-secondary text-light">
                <div className="col text-center">
                    <h1>Register</h1>
                </div>
            </div>
          


            <div className="row py-5">
                <div className="col-md-6 offset-md-3">
                    {/* FORM */}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group p-2">
                            <small>
                            <label className="text-muted">Your name</label>
                            </small>
                            <input value={name} onChange={e => setName(e.target.value)} type="text" className="form-control" placeholder="Enter you Name" />
                        </div>

                        <div className="form-group p-2">
                            <small>
                            <label className="text-muted">Email Address</label>
                            </small>
                            <input value={email} onChange={e => setEmail(e.target.value)} type="email" className="form-control" placeholder="Enter your Email" />
                        </div>

                        <div className="form-group p-2">
                            <small>
                            <label className="text-muted">Password</label>
                            </small>
                            <input value={password} onChange={e => setPassword(e.target.value)} type="password" className="form-control" placeholder="Enter you Password" />
                        </div>
                        {/* question */}
                        <div className="form-group p-2">
                            <small>
                                <label className="text-muted">Pick a question</label>
                            </small>
                            <select className="form-control">
                                <option>What is your favourite color?</option>
                                <option>What is your Best friend name?</option>
                                <option>What city you were born?</option>
                            </select>
                            
                            <small className="form-text text-muted">You can use this to reset your password if you forgotten</small>
                        </div>
                        {/* wirte answer */}
                        <div className="form-group p-2">
                            <input value={secret} onChange={e => setSecret(e.target.value)} type="text" className="form-control" placeholder="Write your answer here" />
                        </div>
                        <div className="form-group p-2">
                            <button disabled={!name || !email || !password || !secret} className="btn btn-primary col-12">{loading ? <SyncOutlined spin className="py-1" />:"Submit"}</button>
                        </div>

                    </form>


                </div>
            </div>
            <div className="row">
                <div className="col">
                    <Modal
                     title = "Congratulation" 
                    open={ok}
                    onCancel={() => setOk(false)}
                    footer={null}
                    >
                        <p>You have Successfully Registered.</p>
                        <Link href="/login" className="btn btn-primary btn-sm">
                                Login
                        </Link>

                    </Modal>
                </div>
            </div>
        </div>
    );
};

export default Register;