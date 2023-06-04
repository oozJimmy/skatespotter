const {MongoClient} = require('mongodb')
const fs = require('fs')
const database = 'skatespotter'
const collection = 'spots'
const path = require('path')
var uri = fs.readFileSync(path.join(__dirname,'mongodata.txt'),'utf8').toString()
var client = new MongoClient(uri)

exports.hello = () => {
    return uri
}

//MongoDB database connect function, calls accessor callback function to handle data operation
exports.connect =  async (accessor,arg) =>{
    //arg object layout:
    /* {
        listing:{ //New or updated data listing
            name:'Seven to Heaven',
            latitude: 34.57835,
            longitude: 83.2772522
        } 
        searchName: 'Sick Seven Stair' 
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

exports.createListing = async (newListing) => {
    const result = await client.db(database).collection(collection).insertOne(newListing);
    console.log(`New listing created with the following id: ${result.insertedId}`);
    console.log('TEST: createListing called')
}

exports.deleteListingByName = async (nameOfListing) => {
    const result = await client.db(database).collection(collection)
            .deleteOne({ name: nameOfListing });
    console.log(`${result.deletedCount} document(s) was/were deleted.`);
}

exports.readAll =  async () => {
    const cursor = await client.db(database).collection(collection).find({})
    const results = await cursor.toArray()

    //console.log(`PRINT:All from collection:\n${results}`)
    return results
}
