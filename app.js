const express=require("express")
const app=express()
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")
const cookieparser=require("cookie-parser")
const userSchema=require("../PR1/models/user-model")

app.set("viewing engine","ejs")

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieparser())


app.post("/create",async (req,res)=>{
    var user=await userSchema.findOne({email:req.body.email})
    if(user){
          return res.send("email already exist!")
    }
    let {password,name,username,email}=req.body
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password,salt,async (err,hash)=>{
           const userdata= await userSchema.create({
                name,
                username,
                password:hash,
                email
            })

           const token= jwt.sign({email:userdata.email,id:userdata._id},"secretkey")
                res.cookie("token",token)
                res.send("logged in!")
            
            
        })
    })
   
})

app.post("/login",async (req,res)=>{
    const user=await userSchema.findOne({email:req.body.email})
    if(!user){
        return res.send("no user found")
    }
    bcrypt.compare(req.body.password,user.password,(err,result)=>{
        if(!result){
            return res.send("invail email or passowrd")
        }
        var token=jwt.sign({email:req.body.email,id:user._id},"secretkey")
        res.cookie("token",token)
        res.send("logged in")
    })
})

app.get("/logout",(req,res)=>{
    res.cookie("token","")
    res.send("you are logged out!")
})

app.listen(3000)

