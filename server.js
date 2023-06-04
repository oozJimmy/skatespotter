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
  db.connect(db.readAll,{})
  .then((data) => {
    //console.log(data)
    res.send(data)},
    (error) => res.send(`ERROR:${error}`)
    )
})

app.get('/server',(req,res) => {
  db.readUri()
  .then((data) => {
    //console.log(data)
    res.send(data)
  },(error)=> res.send(`ERROR:${error}`))
})

app.get('/hello',(req,res) => {
  res.send('RESPONSE:'+db.hello())
})

//-------------------POST routing-------------------
app.post('/posttest',(req,res)=>{
  console.log('/posttest request body',req.body)
  res.send('/posttest request body:\n' + JSON.stringify(req.body))
})

app.post('/spot',(req,res) =>{
  //Passing from "request body" test
  console.log('/spot POST: request body:',req.body)
  db.connect(db.createListing,req.body)
  .then((value)=>console.log(`Mongo upload resolved:`,value),
        (error)=>console.log('ERROR:',error))
  res.status(200).send(JSON.stringify(req.body))
})

//-------------------DELETE routing-------------------
app.delete('/spot', (req,res)=>{
  db.connect(db.deleteListingByName,'Court St. Bridge Mosaic')
  .then((value)=>console.log(`Mongo delete resolved:`,value),
        (error)=>console.log('ERROR:',error))

  res.send('Delete response, check console and database')
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))