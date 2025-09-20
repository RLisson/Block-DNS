import "./Button.css"

function Button({ onClick, label }: { onClick?: () => void; label: string }) {
    return (
    <button type="submit" onClick={onClick}>{label}</button>
    );
}

export default Button;