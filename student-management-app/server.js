const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database Setup
const db = new sqlite3.Database('./student_db.sqlite', (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            studentId TEXT NOT NULL UNIQUE,
            class TEXT NOT NULL,
            grade INTEGER NOT NULL
        )`, (err) => {
            if (err) {
                console.error('Error creating table', err.message);
            }
        });
    }
});

// Routes

// Get all students
app.get('/api/students', (req, res) => {
    const sql = 'SELECT * FROM students';
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// Get single student
app.get('/api/students/:id', (req, res) => {
    const sql = 'SELECT * FROM students WHERE id = ?';
    const params = [req.params.id];
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});

// Create new student
app.post('/api/students', (req, res) => {
    const { name, studentId, class: studentClass, grade } = req.body;
    const sql = 'INSERT INTO students (name, studentId, class, grade) VALUES (?,?,?,?)';
    const params = [name, studentId, studentClass, grade];
    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: { id: this.lastID, name, studentId, class: studentClass, grade }
        });
    });
});

// Update student
app.put('/api/students/:id', (req, res) => {
    const { name, studentId, class: studentClass, grade } = req.body;
    const sql = `UPDATE students SET
                 name = COALESCE(?,name),
                 studentId = COALESCE(?,studentId),
                 class = COALESCE(?,class),
                 grade = COALESCE(?,grade)
                 WHERE id = ?`;
    const params = [name, studentId, studentClass, grade, req.params.id];
    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            changes: this.changes
        });
    });
});

// Delete student
app.delete('/api/students/:id', (req, res) => {
    const sql = 'DELETE FROM students WHERE id = ?';
    const params = [req.params.id];
    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'deleted',
            changes: this.changes
        });
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
