import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";
import "./Login.css";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const { login, authenticated } = useAuth();

    // Se já estiver autenticado, redirecionar
    if (authenticated) {
        return <Navigate to="/view-domains" replace />;
    }

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        setMessage("");
        setLoading(true);

        try {
            // Handle login logic
            const result = await login(username, password);
            if (result.success) {
                setMessage("Login realizado com sucesso!");
                // O redirecionamento será automático devido ao authenticated check acima
            } else {
                setMessage(result.message || "Erro ao fazer login");
            }

        } catch (error) {
            console.error("Erro de autenticação:", error);
            setMessage("Erro de conexão. Tente novamente.");
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="login-container">
            <h2>{"Login"}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <div className="btn-container">
                    <button
                        className="custom-button"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Entrando..." : "Login"}
                    </button>
                </div>
            </form>

            {message && (
                <div className={`message ${message.includes("sucesso") ? "success-message" : "error-message"}`}>
                    {message}
                </div>
            )}
        </div>
    )
}

export default Login;