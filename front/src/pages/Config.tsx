import Header from "../components/Header"
import "./Config.css"
export default function Config() {
    return (
        <>
        <Header />
        <main className="config-container">
            <h2>Configurações</h2>
            <ul>
                <li><a href="create-user">Criar Usuário</a></li>
                <li><a href="gerenciar-usuarios">Gerenciar Usuários</a></li>
            </ul>
        </main>
        </>
    );
}