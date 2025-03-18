// routes/students.js
const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Hornet@sql#123',
    database: 'ta_maths'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL Database');
});

// CRUD routes for students

//get request

router.get('/', (req, res) => {
    const query = 'SELECT * FROM students';
    db.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});


//getting individual student id'

router.get('/:studId',(req,res)=>{
    const {studId}=req.params;
    const query='select * from students where studId=?';
    db.query(query,[studId],(err,result)=>{

        console.log(result)
        
        if(err){
            console.error("error retriving student",err);
            res.status(500).json({ message: 'Failed to add student' });
            return;

        }
        if(result.length===0){
            res.status(404).json({message:'student not found'});
            return;
        }
        res.json(result[0])
    })
})

//post request


router.post('/', (req, res) => {
    const { studId, studName, parentName, parentPhone, studClass } = req.body;
    const query = 'INSERT INTO students (studId, studName, parentName, parentPhone, studClass) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [studId, studName, parentName, parentPhone, studClass], (err, result) => {
        if (err) {
            console.error('Error adding student:', err);
            res.status(500).json({ message: 'Failed to add student' });
            return;
        }
        res.status(201).json({ message: 'Student added successfully' });
    });
});

// Update a student (UPDATE)

router.put('/:studId', (req, res) => {
    const { studId } = req.params;
    const { studName, parentName, parentPhone, studClass } = req.body;
    const query = 'UPDATE students SET studName = ?, parentName = ?, parentPhone = ?, studClass = ? WHERE studId = ?';
    db.query(query, [studName, parentName, parentPhone, studClass, studId], (err, result) => {
        if (err) {
            console.error('Error updating student:', err);
            res.status(500).json({ message: 'Failed to update student' });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Student not found' });
            return;
        }
        res.json({ message: 'Student updated successfully' });
    });
});


//delete method

// Delete a student (DELETE)
router.delete('/:studId', (req, res) => {
    const { studId } = req.params;
    const query = 'DELETE FROM students WHERE studId = ?';
    db.query(query, [studId], (err, result) => {

       
        if (err) {
            console.error('Error deleting student:', err);
            res.status(500).json({ message: 'Failed to delete student' });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Student not found' });
            return;
        }
        res.json({ message: 'Student deleted successfully' });
    });
});

module.exports = router;
