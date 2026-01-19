const express = require("express");
const app = express();
const db = require("./database.js");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Server port
const HTTP_PORT = 8000;
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT));
});

// Root endpoint
app.get("/", (req, res, next) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Get all students
app.get("/api/students", (req, res, next) => {
    const sql = "SELECT * FROM students";
    const params = [];
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
});

// Get a single student by id
app.get("/api/students/:id", (req, res, next) => {
    const sql = "SELECT * FROM students where id = ?";
    const params = [req.params.id];
    db.get(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":row
        })
      });
});

// Create a new student
app.post("/api/students/", (req, res, next) => {
    const errors = []
    if (!req.body.nim){
        errors.push("No NIM specified");
    }
    if (!req.body.name){
        errors.push("No Name specified");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    const data = {
        nim: req.body.nim,
        name: req.body.name,
        major: req.body.major,
        year: req.body.year
    }
    const sql ='INSERT INTO students (nim, name, major, year) VALUES (?,?,?,?)'
    const params =[data.nim, data.name, data.major, data.year]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
})

// Update a student
app.put("/api/students/:id", (req, res, next) => {
    const data = {
        nim: req.body.nim,
        name: req.body.name,
        major: req.body.major,
        year: req.body.year
    }
    db.run(
        `UPDATE students set
           nim = COALESCE(?,nim),
           name = COALESCE(?,name),
           major = COALESCE(?,major),
           year = COALESCE(?,year)
           WHERE id = ?`,
        [data.nim, data.name, data.major, data.year, req.params.id],
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({
                message: "success",
                data: data,
                changes: this.changes
            })
    });
})

// Delete a student
app.delete("/api/students/:id", (req, res, next) => {
    db.run(
        'DELETE FROM students WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({"message":"deleted", changes: this.changes})
    });
})

// Default response for any other request
app.use(function(req, res){
    res.status(404);
});
