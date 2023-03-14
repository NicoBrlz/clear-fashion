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

    client.close();
    console.log('Database disconnected');
}


async function fliterProducts(brandFilter = null, less = null, price = false, date = false, weeks = false){
    const db = await connection();
    var query = {}
    var result;
    if(brandFilter != null){
        query.brand = brandFilter;
    }
    if(less != null){
        query.price = {$lt: less};
    }

    result = await db.collection('products').find(query);
    

    if(price==true){
        result = result.sort({price: 1});
    }
    if(date==true){
        result = result.sort({date: 1});
    }

    result = await result.toArray();

    console.log('resultat 1', result);
    console.log('Number of products: ', result.length);

    await client.close();
    console.log('Database disconnected');
}

fliterProducts(brandFilter = 'dedicated', less = 100.0, date = true);




