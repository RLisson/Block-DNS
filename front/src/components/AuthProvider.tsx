import React, { useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import type { AuthContextType } from '../contexts/AuthContext';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<{ id: number; username: string; email: string } | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [authenticated, setAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            const response = await fetch(`${BACKEND_URL}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
                setAuthenticated(true);
            } else {
                throw new Error('Token inválido');
            }
        } catch (err) {
            console.error('Erro ao verificar autenticação:', err);
            localStorage.removeItem('token');
            setUser(null);
            setAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    const login = async (username: string, password: string): Promise<{ success: boolean; message?: string }> => {
        try {
            const response = await fetch(`${BACKEND_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                setUser(data.user);
                setAuthenticated(true);
                return { success: true };
            } else {
                return { success: false, message: data.error || 'Erro ao fazer login' };
            }
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer login';
            return { success: false, message: errorMessage };
        }
    };

    const register = async (username: string, email: string, password: string): Promise<{ success: boolean; message?: string }> => {
        try {
            const response = await fetch(`${BACKEND_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true };
            } else {
                return { success: false, message: data.error || 'Erro ao registrar usuário' };
            }
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao registrar usuário';
            return { success: false, message: errorMessage };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setAuthenticated(false);
    };

    const value: AuthContextType = {
        user,
        authenticated,
        loading,
        login,
        register,
        logout,
        checkAuthStatus
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};