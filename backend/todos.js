const express = require("express");
const db = require("./database");
const jwt = require("jsonwebtoken")
const router = express.Router()
require("dotenv").config();

function tokenVerification (req,res,next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(403).send("No token Provided")
    }
    jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=> {
        if (err){
            return res.status(500).send("Failted to authenticate the token");
        }
        req.userId = decoded.id ; 
        next();
    })
}



router.post("/todos",tokenVerification, (req,res)=> {
    const {description,status} = req.body ;
    db.run(`INSERT INTO todos (user_id,description,status) VALUES (?,?,?)`,[req.userId,description,status],(err)=> {
        if (err) {
            return res.status(500).send("Error creating todo item.")
        }
        res.status(200).send("Todo item created successfully")
    });
});


router.get("/todos", tokenVerification,(req,res)=> {
    db.all(`SELECT * FROM todos WHERE user_id = ?`,[req.userId], (err,rows)=> {
        if (err) {
            return res.status(500).send("Error retrieving todo items")
        }
        res.status(200).send(rows);
    })
})


router.put ("/todos/:id", tokenVerification, (req,res)=> {
    const {id} = req.params;
    const {description,status} = req.body ; 

    db.run (`UPDATE todos SET description =?, status = ? where id = ? and user_id = ?`, [description,status,id,req.userId],(err)=> {
        if (err) {
            res.status(500).send("Error updating todo item.")
        }
        res.status(200).send("Todo item has been updated successfully")
    })
});



router.delete("/todos/:id", tokenVerification, (req,res)=> {
    const {id} = req.params

    db.run (`DELETE FROM todos where id =? and user_id = ?`, [id,req.userId],(err)=> {
        if (err) {
            return res.status(500).send("Error deleting the todo item")
        }
        res.status(200).send("Todo item deleted successfully")
    })
})


module.exports = router



