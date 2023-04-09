import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context";
import Link from "next/link";
import { useRouter } from "next/router";


const Nav = () => {
    const [current, setCurrent] = useState(""); // to store the path name for active links
    const [state, setState] = useContext(UserContext);

    useEffect(() =>{
        // process.browser --> this is true when we are in clint mode
        process.browser && setCurrent(window.location.pathname);
    },[process.browser && window.location.pathname]);
    


    const router = useRouter();
    
    //logout function
    const logout = () => {
        window.localStorage.removeItem("auth");
        setState(null);
        router.push("/login");
    };
    return (
        <nav
            className="nav d-flex justify-content-between"
            style={{ backgroundColor: "blue" }}
        >
            <Link href="/" className="nav-link text-light logo">
                SocialBridge
            </Link>

            {state !== null ? (
                <>
                    <Link href="/user/dashboard" className={`nav-link text-light ${current === '/user/dashboard' && "active"}`}>
                        {state && state.user && state.user.name}
                    </Link>
                    <a
                        onClick={logout}
                        className="nav-link text-light"
                        style={{ cursor: "pointer" }}
                    >
                        Logout{" "}
                    </a>
                </>
            ) : (
                <>
                    <Link href="/login" className={`nav-link text-light ${current === '/login' && "active"}`}>
                        Login
                    </Link>

                    <Link href="/register" className={`nav-link text-light ${current === '/register' && "active"}`}>
                        Register
                    </Link>
                </>
            )}
        </nav>
    );
};

export default Nav;
