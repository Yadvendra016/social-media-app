import { useState, createContext, useEffect } from "react";
import { useRouter } from 'next/router';
import axios from "axios";

const UserContext = createContext();

const UserProvider = ({children}) =>{ // this will use to wrap app component -- any thing wrap with this available at children prop
    // state when user log in then we uptade the state
    const [state, setState] = useState({
        user:{},
        token:"",
    });

    useEffect(() =>{
        setState(JSON.parse(window.localStorage.getItem('auth')))
    },[])

    const router = useRouter();

    // Adding token in the config
    const token = state && state.token ? state.token : "";
    axios.defaults.baseURL = process.env.NEXT_PUBLIC_API; // now I remove baseURl from everywhere and it works
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`; //now I can remove header section it works 

    // Adding axios interceptor request -> when token is expired then the user will force logout
    axios.interceptors.response.use(function (response) {
        // if everything is fine then I don't have to do anything
        return response;
      }, function (error) {
        // Do something with request error
        let res = error.response;
        if(res.status == 401 && req.config && !res.config._isRetryRequest){ // 401->unothorised error
            // then lougout user 
            setState(null);
            window.localStorage.removeItem("auth"); // remove the user from localstorage
            router.push('/login');
        }
      });
    return(
        <UserContext.Provider value={[state, setState]}>
            {children}
        </UserContext.Provider>
    )

};

export {UserContext, UserProvider};