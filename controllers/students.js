import { pool } from '../config/db.js';

export const getAllStudents = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email FROM students');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addStudent = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO students (name, email, password) VALUES ($1, $2, $3)',
      [name, email, hashedPassword]
    );
    res.status(201).json({ msg: 'Student added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateStudent = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    await pool.query(
      'UPDATE students SET name = $1, email = $2 WHERE id = $3',
      [name, email, id]
    );
    res.json({ msg: 'Student updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
