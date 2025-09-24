import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import Header from "../components/Header";
import "./CreateUser.css";

export default function CreateUser() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [passWordMatch, setPasswordMatch] = useState(true);

    const navigate = useNavigate();

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
        setPasswordMatch(e.target.value === password);
    };

    const { register } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (password !== confirmPassword) {
                alert("Passwords do not match");
                setLoading(false);
                return;
            }
            const result = await register(username, email, password);
            if (result.success) {
                alert("User registered successfully!");
                setUsername("");
                setEmail("");
                setPassword("");
                setConfirmPassword("");
                navigate("/manage-users");
            } else {
                alert(result.message || "Error registering user");
            }
        } catch (error) {
            console.error("Registration error:", error);
            alert("Connection error. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Header />
            <div className="create-user-container">

                <h2>Criar usuario</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Usuario"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Confirmar Senha"
                        value={confirmPassword}
                        className={passWordMatch ? "" : "input-error"}
                        onChange={handleConfirmPasswordChange}
                    />
                    <div className="btn-container">
                        <button
                            className="custom-button"
                            type="submit"
                            disabled={loading || !passWordMatch}
                        >
                            {loading ? "Registrando..." : passWordMatch ? "Registrar" : "Senhas não coincidem"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}