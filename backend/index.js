import express from 'express';
import cors from 'cors';
import { initDb, dbAll, dbGet, dbRun } from './db.js';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

initDb().then(() => {
  console.log('Database connected.');
}).catch(err => {
  console.error('Database connection failed:', err);
});

// GET /modules - list with filters
app.get('/modules', async (req, res) => {
  try {
    const { category, tag, collaborator, date } = req.query;
    let sql = 'SELECT * FROM modules';
    const params = [];
    const conditions = [];

    if (category) {
      conditions.push('category = ?');
      params.push(category);
    }
    if (tag) {
      conditions.push('tags LIKE ?');
      params.push(`%"${tag}"%`);
    }
    if (collaborator) {
      conditions.push('collaborators LIKE ?');
      params.push(`%"${collaborator}"%`);
    }
    if (date) {
      conditions.push('createdAt LIKE ?');
      params.push(`${date}%`);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    sql += ' ORDER BY createdAt DESC';

    const rows = await dbAll(sql, params);
    const result = rows.map(r => ({
      ...r,
      tags: JSON.parse(r.tags),
      collaborators: JSON.parse(r.collaborators)
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /modules/:id - view details
app.get('/modules/:id', async (req, res) => {
  try {
    const row = await dbGet('SELECT * FROM modules WHERE id = ?', [req.params.id]);
    if (!row) {
      return res.status(404).json({ error: 'Module not found.' });
    }
    res.json({
      ...row,
      tags: JSON.parse(row.tags),
      collaborators: JSON.parse(row.collaborators)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /modules - create
app.post('/modules', async (req, res) => {
  try {
    const { name, description, category, tags, collaborators } = req.body;
    if (!name || !category) {
      return res.status(400).json({ error: 'Name and Category are required.' });
    }

    const t = Array.isArray(tags) ? tags : [];
    const c = Array.isArray(collaborators) ? collaborators : [];
    const now = new Date().toISOString();

    const result = await dbRun(
      `INSERT INTO modules (name, description, category, tags, collaborators, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name.trim(), (description || '').trim(), category.trim(), JSON.stringify(t), JSON.stringify(c), now, now]
    );

    res.status(201).json({
      id: result.id,
      name,
      description,
      category,
      tags: t,
      collaborators: c,
      createdAt: now,
      updatedAt: now
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /modules/:id - edit
app.put('/modules/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, tags, collaborators } = req.body;
    
    const existing = await dbGet('SELECT * FROM modules WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Module not found.' });
    }

    const nextName = name !== undefined ? name.trim() : existing.name;
    const nextDesc = description !== undefined ? description.trim() : existing.description;
    const nextCat = category !== undefined ? category.trim() : existing.category;
    const nextTags = Array.isArray(tags) ? JSON.stringify(tags) : existing.tags;
    const nextCollabs = Array.isArray(collaborators) ? JSON.stringify(collaborators) : existing.collaborators;
    const now = new Date().toISOString();

    await dbRun(
      `UPDATE modules 
       SET name = ?, description = ?, category = ?, tags = ?, collaborators = ?, updatedAt = ?
       WHERE id = ?`,
      [nextName, nextDesc, nextCat, nextTags, nextCollabs, now, id]
    );

    res.json({
      id: Number(id),
      name: nextName,
      description: nextDesc,
      category: nextCat,
      tags: Array.isArray(tags) ? tags : JSON.parse(existing.tags),
      collaborators: Array.isArray(collaborators) ? collaborators : JSON.parse(existing.collaborators),
      createdAt: existing.createdAt,
      updatedAt: now
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
