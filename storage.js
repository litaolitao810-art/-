const fs = require('node:fs');
const path = require('node:path');
let pool;
let initialized;

async function database() {
  if (!pool) {
    const { Pool } = require('pg');
    pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 3 });
  }
  if (!initialized) {
    initialized = pool.query(
      'CREATE TABLE IF NOT EXISTS yezhou_store (id integer PRIMARY KEY, document jsonb NOT NULL, version integer NOT NULL DEFAULT 0)'
    ).catch(error => { initialized = undefined; throw error; });
  }
  await initialized;
  return pool;
}

function createStore(seed, filename) {
  async function read() {
    if (process.env.DATABASE_URL) {
      const db = await database();
      await db.query('INSERT INTO yezhou_store (id, document) VALUES (1, $1) ON CONFLICT DO NOTHING', [JSON.stringify(seed)]);
      const result = await db.query('SELECT document, version FROM yezhou_store WHERE id = 1');
      const data = result.rows[0].document;
      Object.defineProperty(data, '_version', { value: result.rows[0].version });
      return data;
    }
    if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
      throw new Error('请先配置 DATABASE_URL 数据库连接');
    }
    fs.mkdirSync(path.dirname(filename), { recursive: true });
    if (!fs.existsSync(filename)) fs.writeFileSync(filename, JSON.stringify(seed), { flag: 'wx' });
    return JSON.parse(fs.readFileSync(filename, 'utf8'));
  }

  async function write(data) {
    if (process.env.DATABASE_URL) {
      const db = await database();
      const result = await db.query(
        'UPDATE yezhou_store SET document = $1, version = version + 1 WHERE id = 1 AND version = $2',
        [JSON.stringify(data), data._version]
      );
      if (!result.rowCount) {
        const error = new Error('数据刚被更新，请刷新后重试');
        error.status = 409;
        throw error;
      }
      return;
    }
    if (process.env.VERCEL || process.env.NODE_ENV === 'production') throw new Error('请先配置数据库');
    const temporary = filename + '.tmp';
    fs.writeFileSync(temporary, JSON.stringify(data));
    fs.renameSync(temporary, filename);
  }
  return { read, write };
}
module.exports = { createStore };
