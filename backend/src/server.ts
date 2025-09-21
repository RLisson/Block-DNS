import app from "./app.js";
import { config } from "./config/environment.js";
import pool from "./config/database.js";
import { start } from "repl";

const PORT = config.PORT;

const startServer = async () => {
    try {
        await pool.query("SELECT NOW()");
        console.log("✅ Conexão com o banc o de dados estabelecida com sucesso.");

        app.listen(PORT, () => {
            console.log(`✅ Servidor rodando na porta ${PORT}`);
        })
    } catch (error) {
        console.error("❌ Erro ao iniciar o servidor:", error);
        process.exit(1);
    }
};

process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM recebido, fechando servidor...');
  await pool.end();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🛑 SIGINT recebido, fechando servidor...');
  await pool.end();
  process.exit(0);
});

startServer();