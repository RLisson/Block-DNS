import pool from '../config/database.js';
import fs from 'fs';
import path from 'path';

async function run() {
  const sqlPath = path.resolve(process.cwd(), 'init-db.sql');
  console.log('📄 Carregando script SQL:', sqlPath);
  if (!fs.existsSync(sqlPath)) {
    console.error('❌ Arquivo init-db.sql não encontrado. Abortando.');
    process.exit(1);
  }

  const sql = fs.readFileSync(sqlPath, 'utf-8');
  // Divide em statements simples (não perfeito, mas suficiente para o script atual)
  const statements = sql
    .split(/;\s*\n/)
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  const client = await pool.connect();
  try {
    console.log('🚀 Executando statements...');
    for (const stmt of statements) {
      try {
        await client.query(stmt);
        console.log('✅ OK:', stmt.split('\n')[0].slice(0, 80));
      } catch (err: any) {
        console.error('⚠️  Erro ao executar statement:', stmt, '\n', err.message);
      }
    }
    console.log('🎉 Inicialização concluída.');
  } finally {
    client.release();
    await pool.end();
  }
}

run().catch(err => {
  console.error('❌ Falha geral na inicialização:', err);
  process.exit(1);
});
