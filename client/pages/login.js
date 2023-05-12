import { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Link from "next/link";
import AuthForm from "../components/forms/AuthForm";
import { useRouter } from "next/router";
import { UserContext } from "../context";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const[state, setState] = useContext(UserContext);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // console.log(name, email, password, secret);
      setLoading(true);
      const { data } = await axios.post(
        `/login`,
        {
          email,
          password,
        }
      );
      // console.log(data);
      // using context - update context
      setState({
        user: data.user,
        token: data.token
      });
      // save in local storage
      window.localStorage.setItem('auth',JSON.stringify(data));
      router.push("/");
    } catch (err) {
      if (err.response && err.response.data) {
        // Check if err.response exists and has data property
        toast.error(err.response.data);
      } else {
        // Handle the error if err.response or err.response.data is undefined
        toast.error("An error occurred");
      }
      setLoading(false);
    }
  };
  // this is for if we user login so he can not access the login page by writing /login on url
  if(state && state.token) router.push("/") // if user trying to access then it redirect to home page

  return (
    <div className="container-fluid">
      <div className="row py-5 text-light bg-default-image">
        <div className="col text-center">
          <h1>Login</h1>
        </div>
      </div>

      <div className="row py-5">
        <div className="col-md-6 offset-md-3">
          <AuthForm
            handleSubmit={handleSubmit}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            loading={loading}
            page="login"
          />
        </div>
      </div>

      <div className="row">
        <div className="col">
          <p className="text-center">
            Not yet registered?{" "}
            <Link href="/register">
              Register
            </Link>
          </p>
        </div>
      </div>
      {/* for logout */}
      <div className="row">
        <div className="col">
        <p className="text-center">
            <Link className="text-danger" href="/forgot-password">
              Forgot Password
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
