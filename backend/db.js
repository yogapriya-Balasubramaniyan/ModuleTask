import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, 'modules.db');
const db = new sqlite3.Database(dbPath);

export const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

export const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

export const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
};

export const initDb = async () => {
  await dbRun(`
    CREATE TABLE IF NOT EXISTS modules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL,
      tags TEXT NOT NULL,
      collaborators TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
  `);

  const countRow = await dbGet('SELECT COUNT(*) as count FROM modules');
  if (countRow.count === 0) {
    const defaultModules = [
      {
        name: 'Authentication Gateway',
        description: 'Handles OAuth2, JWT verification, and rate limiting for client requests.',
        category: 'Security',
        tags: JSON.stringify(['Auth', 'OAuth', 'JWT', 'Gateway']),
        collaborators: JSON.stringify(['Yogesh', 'Muthu']),
        createdAt: '2026-05-10T08:30:00.000Z',
        updatedAt: '2026-05-10T08:30:00.000Z'
      },
      {
        name: 'Analytics Dashboard Engine',
        description: 'Processes real-time telemetry events and compiles dashboard metrics.',
        category: 'Analytics',
        tags: JSON.stringify(['Dashboard', 'Metrics', 'Realtime']),
        collaborators: JSON.stringify(['Yogitha', 'Yogesh']),
        createdAt: '2026-06-01T14:15:00.000Z',
        updatedAt: '2026-06-03T11:20:00.000Z'
      },
      {
        name: 'Transactional Mail Service',
        description: 'Microservice for dispatching automated invoices, emails, and SMS alerts.',
        category: 'Messaging',
        tags: JSON.stringify(['Email', 'SMS', 'Push']),
        collaborators: JSON.stringify(['Gowtham']),
        createdAt: '2026-06-15T09:00:00.000Z',
        updatedAt: '2026-06-15T09:00:00.000Z'
      },
      {
        name: 'Stripe Billing Broker',
        description: 'Connects to billing webhooks and issues receipts for customer subscriptions.',
        category: 'Billing',
        tags: JSON.stringify(['Stripe', 'Transactions', 'Subscriptions']),
        collaborators: JSON.stringify(['Muthu', 'Gowtham']),
        createdAt: '2026-07-20T16:45:00.000Z',
        updatedAt: '2026-07-21T10:00:00.000Z'
      }
    ];

    for (const item of defaultModules) {
      await dbRun(
        `INSERT INTO modules (name, description, category, tags, collaborators, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [item.name, item.description, item.category, item.tags, item.collaborators, item.createdAt, item.updatedAt]
      );
    }
  }
};
