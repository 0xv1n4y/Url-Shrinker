const express = require('express')
const app = express()
const mongoose = require('mongoose')
const port = 4000
require('dotenv').config()


const ShortUrl=require("./models/shortUrls")


// view -engine ejs

app.set('view-engine','ejs')

app.use(express.urlencoded({extended:false}))

app.get("/",async(req,res)=> {

    const shortUrls= await ShortUrl.find()
    res.render('index.ejs',{shortUrls:shortUrls})
})

//Routes
app.post('/shortUrls',async(req,res)=>{
     await ShortUrl.create({full:req.body.fullUrl})

     res.redirect("/")

})

app.get("/:shortUrl",async(req,res)=>{
    const shortUrl=await ShortUrl.findOne({short:req.params.shortUrl})

    if(shortUrl == null )
    return res.sendStatus(404)

    shortUrl.clicks++
    shortUrl.save()
    res.redirect(shortUrl.full)
})

//Database Connection
mongoose.connect(process.env.MONGO_URL).then(console.log("Connected to Database")).catch((err)=>console.log(err))

app.listen(port, () => console.log(`Server is Running in port ${port}!`))