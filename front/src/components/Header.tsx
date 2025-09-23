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
                <a href="/config"><img className="header-icon" src="../src/assets/config.svg" alt="Config" /></a>
                <a onClick={handleLogout}><img className="header-icon" src="../src/assets/logout.svg" alt="Logout" /></a>
            </nav>
        </header>
    );
}

export default Header;