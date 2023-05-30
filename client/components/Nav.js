import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context";
import Link from "next/link";
import { useRouter } from "next/router";
import { Avatar } from "antd";

const Nav = () => {
  const [current, setCurrent] = useState(""); // to store the path name for active links
  const [state, setState] = useContext(UserContext);

  useEffect(() => {
    // process.browser --> this is true when we are in clint mode
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser && window.location.pathname]);

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
        <Avatar src={'/images/logo.png'}/> SocialBridge
      </Link>
     

      {state !== null ? (
        <>
           {/* Dropdown start */}
      <div className="dropdown">
        <button
          className="btn dropdown-toggle text-light"
          type="button"
          id="dropdownMenuButton1"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {state && state.user && state.user.name}
        </button>
        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
          {/* link for dashboard */}
          <li>
          <Link
            href="/user/dashboard"
            className={`nav-link dropdown-item ${
              current === "/user/dashboard" && "active"
            }`}
          >
            Dashboard
          </Link>
          </li>
          {/* Link for updatepage */}
          <li>
          <Link
            href="/user/profile/update"
            className={`nav-link dropdown-item ${
              current === "/user/profile/update" && "active"
            }`}
          >
            profile
          </Link>
          </li>
          <li>
          <a
            onClick={logout}
            className="nav-link dropdown-item "
            style={{ cursor: "pointer" }}
          >
            Logout{" "}
          </a>
          </li>
          
        </ul>
      </div>
       {/* Dropdown End */}
          
        </>
      ) : (
        <>
          <Link
            href="/login"
            className={`nav-link text-light ${
              current === "/login" && "active"
            }`}
          >
            Login
          </Link>

          <Link
            href="/register"
            className={`nav-link text-light ${
              current === "/register" && "active"
            }`}
          >
            Register
          </Link>
        </>
      )}
    </nav>
  );
};

export default Nav;
