import { useState, createContext, useEffect } from "react";

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

    return(
        <UserContext.Provider value={[state, setState]}>
            {children}
        </UserContext.Provider>
    )

};

export {UserContext, UserProvider};