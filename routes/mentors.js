// routes/mentors.js
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

// CRUD routes for mentors

//get request

router.get('/', (req, res) => {
    const query = 'SELECT * FROM mentors';
    db.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// getting individual mentor details

router.get('/:mentorId',(req,res)=>{
    const {mentorId}=req.params;
    const query='select * from mentors where mentorId=?'
    db.query(query,[mentorId],(err,result)=>{
        if(err){
            console.error("error by retrieving mentor",err)
            res.status(500).json({message:"failed to retrieve mentor"});
            return;
        }
        if(result.length===0){
            console.log(result)
            res.status(404).json({message:"mentor not found"});
            return
        }
        res.json(result[0])
    }
    )
})


//post request


router.post('/', (req, res) => {
    const { mentorId,mentorName,mentorPhone } = req.body;
    const query = 'INSERT INTO mentors (mentorId,mentorName,mentorPhone) VALUES (?, ?, ?)';
    db.query(query, [mentorId,mentorName,mentorPhone], (err, result) => {
        if (err) {
            console.error('Error adding mentors:', err);
            res.status(500).json({ message: 'Failed to add mentors' });
            return;
        }
        res.status(201).json({ message: 'Mentor added successfully' });
    });
});

// Update a mentor (UPDATE)

// router.put('/:mentorId', (req, res) => {
//     const { mentorId } = req.params;
//     const { mentorName,mentorPhone} = req.body;
//     const query = 'UPDATE mentors SET mentorName = ?, mentorPhone = ? WHERE mentorId = ?';

//     //UPDATE mentors SET mentorName = ?, mentorPhone = ? WHERE mentorId = ?

//     db.query(query, [mentorName,mentorPhone,mentorId], (err, result) => {
//         if (err) {
//             console.error('Error updating mentor:', err);
//             res.status(500).json({ message: 'Failed to update mentor' });
//             return;
//         }
//         if (result.affectedRows === 0) {
//             res.status(404).json({ message: 'Mentor not found' });
//             return;
//         }
//         res.json({ message: 'Mentor updated successfully' });
//     });
// });


// Update a mentor (UPDATE)
router.put('/:mentorId', (req, res) => {
    const { mentorId } = req.params;
    const { mentorName, mentorPhone } = req.body;

    // Build the update query dynamically based on the fields present in the request body
    let query = 'UPDATE mentors SET ';
    const updates = [];
    const values = [];

    if (mentorName) {
        updates.push('mentorName = ?');
        values.push(mentorName);
    }
    if (mentorPhone) {
        updates.push('mentorPhone = ?');
        values.push(mentorPhone);
    }

    // Join the updates with commas and complete the query
    query += updates.join(', ') + ' WHERE mentorId = ?';
    values.push(mentorId);

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error updating mentor:', err);
            res.status(500).json({ message: 'Failed to update mentor' });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Mentor not found' });
            return;
        }
        res.json({ message: 'Mentor updated successfully' });
    });
});



//delete method

// Delete a mentors (DELETE)
router.delete('/:mentorId', (req, res) => {
    const { mentorId } = req.params;
    const query = 'DELETE FROM mentors WHERE mentorId = ?';
    db.query(query, [mentorId], (err, result) => {
        if (err) {
            console.error('Error deleting mentor:', err);
            res.status(500).json({ message: 'Failed to delete mentor' });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Mentor not found' });
            return;
        }
        res.json({ message: 'Mentor deleted successfully' });
    });
});

module.exports = router;
