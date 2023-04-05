import Link from "next/link";
const Nav = () => {
    return (
        <nav className="nav bg-dark d-flex justify-content-between">
           
                <Link href="/" className="nav-link text-light">
                    Home
                </Link>
            
           
                <Link href="/login" className="nav-link text-light">
                    Login
                </Link>
            
            
                <Link href="/register" className="nav-link text-light ">
                    Register
                </Link>
            
           
        </nav>

    )
}

export default Nav;