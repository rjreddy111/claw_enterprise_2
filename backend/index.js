const express = require("express")
const cors = require("cors")
require('dotenv').config()

const PORT =process.env.PORT || 4000 

const app = express()



  

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))


const userAuth = require("./user_auth")
const todos = require("./todos")

app.use("/api/userAuth",userAuth );
app.use("/api",todos)


app.listen(PORT,()=> {
    console.log(`server is ruunig at port ${PORT}`)
})