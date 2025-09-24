import { useState } from "react";
import Header from "../components/Header";
import { useUsers } from "../hooks/useUsers";
import "./ManageUsers.css";

export default function ManageUsers() {
    const { users, loading, error, refresh, deleteUser, updateUser } = useUsers();

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editUserId, setEditUserId] = useState<number | null>(null);
    const [editedUsername, setEditedUsername] = useState<string>('');
    const [editedEmail, setEditedEmail] = useState<string>('');
    const [editedPassword, setEditedPassword] = useState<string>('');


    async function handleEditSubmit(event: React.FormEvent, id: number) {
        event.preventDefault();

        const passwordToSend = editedPassword.trim() == '' ? undefined : editedPassword;

        await updateUser(id, editedUsername, editedEmail, passwordToSend);

        setIsEditing(false);
        setEditUserId(null);
        setEditedUsername('');
        setEditedEmail('');
        setEditedPassword('');
    };

    function handleEdit(id: number, username: string, email: string) {
        setIsEditing(true);
        setEditUserId(id);
        setEditedUsername(username);
        setEditedEmail(email);
        setEditedPassword('');
    }

    async function handleDelete(id: number) {
        if (!confirm("Tem certeza que deseja excluir este usuário?")) {
            return;
        }
        try {
            await deleteUser(id);
        } catch (error) {
            console.error("Erro ao excluir usuário:", error);
            alert("Erro ao excluir usuário. Veja o console para mais detalhes.");
        }
    }

    if (loading) {
        return (
            <div>
                <Header />
                <div className="loading">Carregando usuários...</div>
            </div>
        );
    }
    if (error) {
        return (
            <div>
                <Header />
                <div className="error">Erro: {error}</div>
                <button onClick={refresh}>Tentar Novamente</button>
            </div>
        );
    }

    return (
        <>
            <Header />
            <div className="manage-users-container">
                <h2>Gerenciar Usuários</h2>
                <ul>
                    {users.map(user => (
                        <li key={user.id}>
                            <span>
                                {isEditing && editUserId === user.id ? (
                                    <form onSubmit={(e) => handleEditSubmit(e, user.id)}>
                                        <input type="text" name="username" onChange={(e) => setEditedUsername(e.target.value)} value={editedUsername} />
                                        <input type="email" name="email" onChange={(e) => setEditedEmail(e.target.value)} value={editedEmail} />
                                        <input type="password" name="password" onChange={(e) => setEditedPassword(e.target.value)} value={editedPassword} placeholder="Nova Senha" />
                                        <button type="submit">Salvar</button>
                                    </form>
                                ) : (
                                    <>
                                        {user.username} ({user.email})
                                    </>
                                )}
                            </span>
                            <span>
                                <button className="edit-button" onClick={() => { handleEdit(user.id, user.username, user.email ) }} >Editar</button>
                                <button className="delete-button" onClick={() => handleDelete(user.id)}>Excluir</button>
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}