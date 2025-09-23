import Header from "../components/Header"
import "./Config.css"
export default function Config() {
    return (
        <>
        <Header />
        <main className="config-container">
            <h2>Configurações</h2>
            <li>
                <a href="create-user">Criar Usuário</a>
                <a href="gerenciar-usuarios">Gerenciar Usuários</a>
            </li>
        </main>
        </>
    );
}