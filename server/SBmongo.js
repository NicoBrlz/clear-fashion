const {MongoClient} = require('mongodb');
const fs = require('fs');
const { NONAME } = require('dns');

const file = './products.json';

const MONGODB_URI = 'mongodb+srv://Tacos:breakshop@api.0snggxh.mongodb.net/?retryWrites=true&writeConcern=majority';
const MONGODB_DB_NAME = 'API';

var db, client;

async function connection(){
    try {
        client = await MongoClient.connect(MONGODB_URI,{'useNewUrlParser': true});
        
        console.log('Database connected')

        db = client.db(MONGODB_DB_NAME);
        //collection = db.collection('products');

        return db;
        
        
    }
    catch (error) {
    console.error(error);
    } 

    /*
    finally {
    client.close();
    }
    */
}

async function insertion(){
    const db = await connection();
    //reading json file
    const data = JSON.parse(fs.readFileSync(file));
    console.log(data);

    //insert the data in products collection
    //console.log(await data);
    const result = await db.collection('products').insertMany(data, {upsert: true});

    console.log(`${result.insertedCount} documents insérés avec succès`);

    await db.collection('products').find();

    client.close();
    console.log('Database disconnected');
}


async function fliterProducts(id = null, brandFilter = null, less = null, price = false, date = false, weeks = false){
    const db = await connection();

    var query = {} //this will help mixing the filters
    var result;

    //filters
    //we add an id filter for later
    if(id!=null){
        query._id = id;
    }
    if(brandFilter != null){
        query.brand = brandFilter;
    }
    if(less != null){
        query.price = {$lt: less};
    }

    //we apply the filters here
    result = await db.collection('products').find(query);
    //note that we don't convert it into an array yet, in order to sort it first

    //sorting
    if(price==true){
        result = result.sort({price: 1});
    }
    if(date==true){
        result = result.sort({date: 1});
    }

    if(weeks==true){
        //do something
    }

    result = await result.toArray();

    
    console.log('resultat 1', result);
    console.log('Number of products: ', result.length);

    await client.close();
    console.log('Database disconnected');
    return result;
}


//insertion();
console.log(fliterProducts());

module.exports = {
    insertion,
    fliterProducts
}




