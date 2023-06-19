//Constant declarations
const PORT = 5000
const express = require('express')
const app = express()
const fs = require('fs')
const url = require('url')
const db = require('./mongoModule')
const favicon = require('serve-favicon')
const path = require('path')
const bcrypt = require('bcrypt')

//Express Middleware
app.use(express.static(__dirname)); //Send static files 
app.use(favicon(path.join(__dirname,'favicon.ico'))) //Send favicon
app.use(express.json()) //Set up JSON middleware

//-------------------GET routing-------------------
app.get('/',(req,res) =>{
    var filename = '/index.html'
    res.sendFile(__dirname+filename)
})

app.get('/spotlist',(req,res) => {
  db.connect(db.readAll,{collection:'spots'})
  .then((data) => {
    //console.log(data)
    res.send(data)},
    (error) => res.send(`ERROR:${error}`)
    )
})

app.get('/hello',(req,res) => {
  res.send('RESPONSE:'+db.hello())
})



//-------------------POST routing-------------------
app.post('/spot',(req,res) =>{
  //Passing from "request body" test
  console.log('/spot POST: request body:',req.body)
  db.connect(db.createListing,{listing:req.body})
  .then(
    (value)=>{
      console.log(`Mongo upload resolved:`+JSON.stringify(value))
      res.status(201).send(value)},
    (error)=>console.log('ERROR:',error))
  //res.status(200).send(JSON.stringify(req.body))
})

//Alt login NEW
app.post('/users/login',async (req,res)=>{
  const userQuery = {
    searchName:req.body.username,
    collection:'users'
  }

  //Check that username isn't empty string
  if(req.body.username === '')
    return res.status(406).send('Required fields missing')
  
  try{
    const user = await db.connect(db.readOne,userQuery)

    if(!user)
      return res.status(404).send('Can\'t find user')
    
    if(await bcrypt.compare(req.body.password, user.password))
      res.status(202).send('Success')
    else
      res.status(400).send('Wrong password')
  
    }catch{
    res.status(500).send('Error occurred.')
  }
})

//Alt signup NEW
app.post('/users',async (req,res)=>{
  const hashedPassword = await bcrypt.hash(req.body.password, 10)

  const searchObj = {
    searchName:req.body.username,
    collection:'users'
  }

  const listingObj = {
    collection:'users',
    listing:{
      name:req.body.username,
      password: hashedPassword//Hash the req user password
    }
  }
  //Check that username and pass not empty string
  if(req.body.username === '' || req.body.password === '')
    return res.status(406).send('Required fields missing')

  try{
    //Call database to find user with given username
    if(await db.connect(db.readOne,searchObj)){
      console.log(`${req.body.username} already exists.`)
      return res.status(400).send(`${req.body.username} already exists.`)
    }

    //No name conflicts, so create new user
    const result = await db.connect(db.createListing,listingObj)
    res.status(201).send(result)

  }catch{
    res.status(500).send('Error occurred')
  }
})

//-------------------DELETE routing-------------------
app.delete('/spot', (req,res)=>{
  db.connect(db.deleteListingByName,{searchName:req.body.searchName})
  .then((value)=>res.send(`Mongo delete resolved:\n${JSON.stringify(value)}`),
        (error)=>res.send(error))
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))