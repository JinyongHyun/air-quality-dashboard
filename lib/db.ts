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
  await db.execute(`
    CREATE TABLE IF NOT EXISTS guestbook (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      author_email TEXT NOT NULL,
      author_name TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  const initialUsers = ['23@kookmin.ac.kr', 'wlsdyd4270@gmail.com', 'kts123@kookmin.ac.kr'];
  for (const email of initialUsers) {
    await db.execute({
      sql: `INSERT OR IGNORE INTO allowed_users (email) VALUES (?)`,
      args: [email],
    });
  }
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
