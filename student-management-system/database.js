const sqlite3 = require('sqlite3').verbose();

const DBSOURCE = "students.db";

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message);
      throw err;
    } else {
        console.log('Connected to the SQLite database.');
        db.run(`CREATE TABLE students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nim TEXT UNIQUE,
            name TEXT,
            major TEXT,
            year INTEGER
            )`,
        (err) => {
            if (err) {
                // Table already created
            } else {
                // Table just created, creating some rows
                var insert = 'INSERT INTO students (nim, name, major, year) VALUES (?,?,?,?)'
                db.run(insert, ["101", "John Doe", "Computer Science", 2023])
                db.run(insert, ["102", "Jane Smith", "Mathematics", 2022])
            }
        });
    }
});

module.exports = db;
