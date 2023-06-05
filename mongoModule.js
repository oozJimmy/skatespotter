const {MongoClient} = require('mongodb')
const fs = require('fs')
const path = require('path')
var uri = fs.readFileSync(path.join(__dirname,'mongodata.txt'),'utf8').toString()
var client = new MongoClient(uri)
const database = 'skatespotter'
const collection = 'spots'
const userCollection = 'users'

exports.hello = () => {
    return uri
}

//MongoDB database connect function, calls accessor callback function to handle data operation
exports.connect =  async (accessor,arg) =>{
    //arg object layout: UNIMPLEMENTED
    /* {
        listing:{ //MongoDB spot schema
            name:'Seven to Heaven',
            latitude: 34.57835,
            longitude: 83.2772522
        } 
        searchName: 'Sick Seven Stair' 
        collection: 'spots'
    } */
    try{
        //Open database connection
        await client.connect()

        //Make DB calls
        var result = await accessor(arg)
        .then((response)=>{
            //console.log(`.then callback:\n`,response)
            return response})
        //console.log(`MODULE: result : ${result}`)
        
    } catch{
        console.error()
    } finally {
        //Close database connection
        await client.close()
    }
    return result
}

//---------------------Create---------------------
exports.createListing = async (obj) => {
    const result = await client.db(database).collection(collection).insertOne(obj.listing);
    console.log(`New listing created with the following id: ${result.insertedId}`);
    console.log('TEST: createListing called')
    return result
}

//---------------------Read---------------------
exports.readOne = async (obj) => {
    const result = await client.db(database).collection(obj.collection).findOne({ name: obj.spotName });
}

exports.readAll =  async (obj) => {
    const cursor = await client.db(database).collection(obj.collection).find({})
    const results = await cursor.toArray()

    //console.log(`PRINT:All from collection:\n${results}`)

    return results
}

//---------------------Delete---------------------
exports.deleteListingByName = async (obj) => {
    console.log('Delete test: obj:\n',obj)
    const result = await client.db(database).collection(collection)
            .deleteOne({ name: obj.searchName });
    console.log(`${result.deletedCount} document(s) was/were deleted.`);
    return result
}