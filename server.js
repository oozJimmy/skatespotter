const PORT = 5000
const express = require('express')
const app = express()
const fs = require('fs')
const url = require('url')


// serve your css as static
app.use(express.static(__dirname));

app.get('/',(req,res) =>{
    var filename = '/index.html'
  res.sendFile(__dirname+filename)
})



app.listen(PORT, () => console.log(`Server running on port ${PORT}`))