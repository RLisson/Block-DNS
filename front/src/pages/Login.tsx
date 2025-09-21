import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";
import "./Login.css";

function Login() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [register, setRegister] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const { login, register: authRegister, authenticated } = useAuth();

    // Se já estiver autenticado, redirecionar
    if (authenticated) {
        return <Navigate to="/view-domains" replace />;
    }

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        setMessage("");
        setLoading(true);

        try {
            if (register) {
                // Handle registration logic
                const result = await authRegister(username, email, password);
                if (result.success) {
                    setMessage("Registro realizado com sucesso! Faça login.");
                    setRegister(false);
                    setPassword("");
                    setConfirmPassword("");
                } else {
                    setMessage(result.message || "Erro ao registrar");
                }
            } else {
                // Handle login logic
                const result = await login(email, password);
                if (result.success) {
                    setMessage("Login realizado com sucesso!");
                    // O redirecionamento será automático devido ao authenticated check acima
                } else {
                    setMessage(result.message || "Erro ao fazer login");
                }
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
            <h2>{register ? "Register" : "Login"}</h2>
            <form onSubmit={handleSubmit}>
                {register ? (
                    <>
                        <input
                            type="text"
                            placeholder="Username"
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
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <div className="btn-container">
                            <button 
                                className="custom-button" 
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? "Registrando..." : "Register"}
                            </button>
                            <button 
                                type="button" 
                                className="toggle-link"
                                onClick={() => setRegister(false)}
                                disabled={loading}
                            >
                                Already have an account? Login here
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <input
                            type="text"
                            placeholder="Usuario"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            <button 
                                type="button" 
                                className="toggle-link"
                                onClick={() => setRegister(true)}
                                disabled={loading}
                            >
                                Don't have an account? Register here
                            </button>
                        </div>
                    </>
                )}
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