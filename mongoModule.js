const {MongoClient} = require('mongodb')
const database = 'skatespotter'
const collection = 'spots'
const uri = 'mongodb+srv://oozjimmy:TP5pd0BEN8hNG6Iy@cluster0.oibjqgz.mongodb.net/?retryWrites=true&w=majority'
var client = new MongoClient(uri)

exports.hello = ()=>{console.log('Hi from the module')}
exports.connect = async (accessor,arg) =>{

    try{
        //Open database connection
        await client.connect()

        //Make DB calls
        await accessor(arg).then((response)=>console.log(response))

        
    } catch{
        console.error()
    } finally {
        //Close database connection
        await client.close()
    }
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
