import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function initDb() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS allowed_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  // 초기 허용 사용자 등록
  await db.execute({
    sql: `INSERT OR IGNORE INTO allowed_users (email) VALUES (?)`,
    args: ['23@kookmin.ac.kr'],
  });
}

export async function isAllowedUser(email: string): Promise<boolean> {
  const result = await db.execute({
    sql: 'SELECT email FROM allowed_users WHERE email = ?',
    args: [email],
  });
  return result.rows.length > 0;
}

export async function getAllowedUsers(): Promise<string[]> {
  const result = await db.execute('SELECT email FROM allowed_users ORDER BY created_at DESC');
  return result.rows.map((row) => row.email as string);
}

export default db;
