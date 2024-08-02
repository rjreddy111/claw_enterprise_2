const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const db = require("./database")
const cors = require("cors")


const router = express.Router()
require('dotenv').config()

router.use(express.json());
router.use(cors())

router.post("/register", (req,res)=>{
    const {username,password} = req.body; 

    if (!username || !password) {
        return res.status(400).send("Username and password are required.");
      }
    
      try {
        const hashedPassword = bcrypt.hashSync(password, 10);
        
    
        db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, hashedPassword], (err) => {
          if (err) {
            return res.status(500).send("User registration failed.");
          }
          res.status(200).send("User registered successfully.");
        });
      } catch (error) {
        res.status(500).send("An error occurred during registration.");
      }
    });

router.post("/login", (req,res)=> {
    const {username,password} = req.body 

    db.get(`SELECT * FROM users WHERE username = ?`,[username],(err,user)=> {
        if (err || !user) {
            return res.status(404).send("user not found.")
        }
        const validitatePassword = bcrypt.compareSync(password,user.password) ; 
        if (!validitatePassword) {
            return res.status(401).send("Invalid password")
        }
        const token = jwt.sign({id:user.id},process.env.JWT_SECRET, {
            expiresIn:172800

        });
        res.status(200).send({auth:true,token})
    })
})


module.exports = router


