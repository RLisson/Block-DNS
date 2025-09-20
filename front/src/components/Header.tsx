import "./Header.css"

function Header() {
    return (
        <header>
            <h1>Block DNS</h1>
            <nav>
                <a href="/">Home</a>
                <a href="/add-domains">Add Domains</a>
                <a href="/view-domains">View Domains</a>
            </nav>
        </header>
    );
}

export default Header;