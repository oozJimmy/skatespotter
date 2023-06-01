const PORT = 5000
const express = require('express')
const app = express()
const fs = require('fs')
const url = require('url')
const db = require('./mongoModule')
const favicon = require('serve-favicon')
const path = require('path')

// serve your css as static
app.use(express.static(__dirname));
app.use(favicon(path.join(__dirname,'favicon.ico')))

app.get('/',(req,res) =>{
    var filename = '/index.html'
    res.sendFile(__dirname+filename)
})

app.post('/spot',(req,res) =>{
  //Passing from "request body" test
  db.connect(db.createListing,{
    name: 'Court St. Bridge Mosaic',
    latitude:42.098575, 
    longitude:-75.915483
  }).then((value)=>console.log(`Mongo upload resolved:${value}`),
           (error)=>console.log('ERROR:' +error))
  

  res.send('Response, check database')
},)

app.delete('/spot', (req,res)=>{
  db.connect(db.deleteListingByName,'Court St. Bridge Mosaic')
  .then((value)=>console.log(`Mongo delete resolved:${value}`),
        (error)=>console.log('ERROR:' +error))

  res.send('Delete response, check console and database')
})


app.listen(PORT, () => console.log(`Server running on port ${PORT}`))