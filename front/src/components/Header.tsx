import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";

import "./Header.css"

function Header() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header>
            <h1>Block DNS</h1>
            <nav>
                <a href="/">Home</a>
                <a href="/add-domains">Add Domains</a>
                <a href="/view-domains">View Domains</a>
                <a onClick={handleLogout}>Logout</a>
            </nav>
        </header>
    );
}

export default Header;