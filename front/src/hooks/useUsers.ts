import { useState, useEffect } from "react";
import { AuthService } from "../services/authService";
import type { User } from "../types/auth";

export const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const userData = await AuthService.getAllUsers();
            setUsers(userData);
        } catch (err: unknown) {
            const errorMessage = ((err as Error).message || 'Erro ao buscar usuários');
            setError(errorMessage);
            console.error('Erro ao buscar usuários:', err);
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (id: number) => {
        try {
            setLoading(true);
            setError(null);
            await AuthService.deleteUser(id);
            setUsers(prev => prev.filter(user => user.id !== id));
        } catch (err: unknown) {
            const errorMessage = ((err as Error).message || 'Erro ao deletar usuário');
            setError(errorMessage);
            console.error('Erro ao deletar usuário:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateUser = async (id: number, username: string, email: string, password?: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await AuthService.updateUser(id, username, email, password);
            setUsers(prev => {
                const newUsers = prev.map(user => 
                    user.id === id 
                    ? { ...user, username, email } 
                    : user);
                return newUsers;
            });
            return response;
        } catch (err: unknown) {
            const errorMessage = ((err as Error).message || 'Erro ao atualizar usuário');
            setError(errorMessage);
            console.error('Erro ao atualizar usuário:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const refresh = () => {
        fetchUsers();
    };


    return { users, loading, error, refresh, deleteUser, updateUser };
}