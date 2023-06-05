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
  .then((value)=>{console.log(`Mongo upload resolved:`+JSON.stringify(value))
                  res.send(`Mongo upload resolved:`+JSON.stringify(value) + JSON.stringify(req.body)+ 'uploaded')},
        (error)=>console.log('ERROR:',error))
  //res.status(200).send(JSON.stringify(req.body))
})

//-------------------DELETE routing-------------------
app.delete('/spot', (req,res)=>{
  db.connect(db.deleteListingByName,{searchName:req.body.searchName})
  .then((value)=>res.send(`Mongo delete resolved:\n${JSON.stringify(value)}`),
        (error)=>res.send(error))
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))