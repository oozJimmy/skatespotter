//Constant declarations
const PORT = 5000
const express = require('express')
const app = express()
const fs = require('fs')
const url = require('url')
const db = require('./mongoModule')
const favicon = require('serve-favicon')
const path = require('path')

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
      res.send(`Mongo upload resolved:`+JSON.stringify(value) + JSON.stringify(req.body)+ 'uploaded')},
    (error)=>console.log('ERROR:',error))
  //res.status(200).send(JSON.stringify(req.body))
})

//Login
app.post('/login',(req,res)=>{
  db.connect(db.readOne,
    {
    searchName:req.body.username,
    collection:'users'
    })
    .then(
      (value)=>{
        if(value){
          if(value.password === req.body.password){
            res.status(202).send(value)
          }else
            res.status(201).send(`${req.body.username} has the wrong password.`)
        }else
          res.status(200).send(`No ${req.body.username} found who dat`)
      },
      (error)=>res.send(error))
})

//Signup
app.post('/signup',(req,res)=>{
  
  db.connect(db.readOne,
    {
    searchName:req.body.username,
    collection:'users'
    })
    .then(
      (value)=>{
        if(value){
            res.status(200).send(`${req.body.username} already exists.`)
            console.log('User already exists')
        }else{
          console.log(`No ${req.body.username} found,creating listing`)
          db.connect(db.createListing,
            {
              collection:'users',
              listing:{
                name:req.body.username,
                password:req.body.password
              }
            })
            .then((value)=>{
              console.log(value)
              res.status(200).send(`User creation successful:${JSON.stringify(value)}`)
            },
            (error)=>{
              console.log(error)
              res.status(400).send('Error creating user entry')
            })
        }
      },
      (error)=>res.send(error))
})

//-------------------DELETE routing-------------------
app.delete('/spot', (req,res)=>{
  db.connect(db.deleteListingByName,{searchName:req.body.searchName})
  .then((value)=>res.send(`Mongo delete resolved:\n${JSON.stringify(value)}`),
        (error)=>res.send(error))
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))