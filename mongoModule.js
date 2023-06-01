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
exports.readUri =async  ()=>{
    try {
        const data = fs.readFileSync(path.join(__dirname,'mongodata.txt'),'utf8');
        uri = data.toString()
        //console.log('MODULE SUCCESS:','URI:',uri)
        return uri
      } catch (err) {
        console.error('MODULE ERROR:',err);
        return err
      }
}

exports.connect =  async (accessor,arg) =>{

    
    try{
        //Open database connection
        await client.connect()

        //Make DB calls
        var result = await accessor(
        ).then((response)=>{
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
