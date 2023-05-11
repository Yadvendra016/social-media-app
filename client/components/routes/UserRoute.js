import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { SyncOutlined } from "@ant-design/icons";
import { UserContext } from "../../context";

// this context is used for check if userToken is verified or not (current-user)
const UserRoute = ({ children }) => {
  const [ok, setOk] = useState(false);
  const router = useRouter();

  const [state, setState] = useContext(UserContext);

  useEffect(() => {
    if(state && state.token) getCurrentUser();
  }, [state && state.token]);

  const getCurrentUser = async () => {
    try {
      const { data } = await axios.get(
        `/current-user`,
        //  {
        //     headers: {
        //         "Authorization": `Bearer ${state.token}`,
        //     }
        // }
      );

      if (data.ok) setOk(true);
    } catch (err) {
      router.push("/login");
    }
  };
  // it will run when we are in client side and there nothing in the state 
  process.browser && state === null && setTimeout(() =>{
    getCurrentUser();
  },1000);

  return !ok ? (
    <SyncOutlined
      spin
      className="d-flex justify-content-center display-1 text-primary p-5"
    />
  ) : (
    <>{ children }</>
  );
};

export default UserRoute;
