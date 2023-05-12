import { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Modal } from "antd";
import Link from "next/link";
import ForgotPasswordForm from "../components/forms/ForgotPasswordForm";
import { useRouter } from "next/router";
import { UserContext } from "../context";

const forgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [secret, setSecret] = useState("");
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useContext(UserContext); // Context state

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // console.log(name, email, password, secret);
      setLoading(true);
      const { data } = await axios.post(
        `/forgot-password`,
        {
         
          email,
          newPassword,
          secret,
        }
      );
    console.log("forgot Password data =>",data);
    
    if(data.error){
      toast.error(data.error);
      setLoading(false);
    }
    if(data.success){
        setEmail("");
        setNewPassword("");
        setSecret("");
        setOk(true);
        setLoading(false);
    }
      
    } catch (err) {
      toast.error(err.response.data);
      setLoading(false);
    }
  };

  // this is for if we user register so he can not access the login page by writing /register on url
  if (state && state.token) router.push("/"); // if user trying to access then it redirect to home page

  return (
    <div className="container-fluid">
      <div className="row py-5 text-light bg-default-image">
        <div className="col text-center">
          <h1>Forgot Password</h1>
        </div>
      </div>

      <div className="row py-5">
        <div className="col-md-6 offset-md-3">
          {/* FORM */}
          <ForgotPasswordForm
            handleSubmit={handleSubmit}
            email={email}
            setEmail={setEmail}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            secret={secret}
            setSecret={setSecret}
            loading={loading}
          />
        </div>
      </div>

      <div className="row">
        <div className="col">
          <Modal
            title="Congratulations!"
            open={ok}
            onCancel={() => setOk(false)}
            footer={null}
          >
            <p>Congrats! You can login with your new password</p>
            <Link href="/login" className="btn btn-primary btn-sm">
              Login
            </Link>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default forgotPassword;
