// routes/class.js
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

// CRUD routes for classes

//get request

router.get('/', (req, res) => {
    const query = 'SELECT * FROM classes';
    db.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});


//getting individual classId'

router.get('/:classId',(req,res)=>{
    const {classId}=req.params;
    const query='select * from classes where classId=?';
    db.query(query,[classId],(err,result)=>{

        console.log(result)
        
        if(err){
            console.error("error retriving class",err);
            res.status(500).json({ message: 'Failed to retrieve class' });
            return;

        }
        if(result.length===0){
            res.status(404).json({message:'class not found'});
            return;
        }
        res.json(result[0])
    })
})

//post request


router.post('/', (req, res) => {
    const { classId} = req.body;
    const query = 'INSERT INTO class (classId, className, mentorId) VALUES (?, ?, ?)';
    db.query(query, [classId, className, mentorId], (err, result) => {
        if (err) {
            console.error('Error adding class:', err);
            res.status(500).json({ message: 'Failed to add class' });
            return;
        }
        res.status(201).json({ message: 'class added successfully' });
    });
});

// Update a class (UPDATE)

router.put('/:classId', (req, res) => {
    const { classId } = req.params;
    const {  className, mentorId} = req.body;
    const query = 'UPDATE class SET className = ?, mentorId = ? WHERE classId = ?';
    db.query(query, [className,mentorId  , classId], (err, result) => {
        if (err) {
            console.error('Error updating class:', err);
            res.status(500).json({ message: 'Failed to update class' });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'class not found' });
            return;
        }
        res.json({ message: 'class updated successfully' });
    });
});


//delete method

// Delete a clas (DELETE)
router.delete('/:classId', (req, res) => {
    const { classId } = req.params;
    const query = 'DELETE FROM class WHERE classId = ?';
    db.query(query, [classId], (err, result) => {

       
        if (err) {
            console.error('Error deleting class:', err);
            res.status(500).json({ message: 'Failed to delete class' });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'class not found' });
            return;
        }
        res.json({ message: 'class deleted successfully' });
    });
});

module.exports = router;
