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
    //console.log(data);

    //products we already have
    const prod = await db.collection('products').find({}).toArray();
    let res = [];
    let check = false;

    //check if the name is already in our collection (can't work with _id bc it changes whenever we scrape products, so if we scrape the same twice, it will have a different id)
    for(let elem of data) {
        if(!prod.some(item => item.name == elem.name)) {
            res.push(elem);
            check = true;
        }
    }

    if(check==false) {
        client.close();
        console.log('No new products');
        console.log('Database disconnected');
        
    }
    else {
        //insert the data in products collection
        const result = await db.collection('products').insertMany(res);

        //console.log(await data);
    

        console.log(`${result.insertedCount} documents insérés avec succès`);

        //console.log('ICI4',await db.collection('products').find());
        //client.close();
        //console.log('Database disconnected');

    }

    
    
}


async function filterProducts(id = null, brandFilter = null, less = null, price = false, date = false, weeks = false){
    const db = await connection();

    var query = {} //this will help mixing the filters
    var result;

    //var test = await db.collection('products').find(query);
    //test= test.toArray();
    //console.log('TEST', test);

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
    result = db.collection('products').find(query);
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
    //console.log(result)
    //console.log(query);
    
    //console.log('resultat 1', result);
    console.log('Number of products: ', result.length);

    //await client.close();
    //console.log('Database disconnected');
    return result;
}

async function brandsList() {
    const db = await connection();
    let brands = await db.collection('products').distinct('brand');
    brands = await brands;
    return brands;
}


/*
brandsList().then(list => {
    console.log(list);
})
*/
//insertion();
//console.log(fliterProducts());

/*
fliterProducts(null, 'dedicated').then(list => {
    console.log(list);
});
*/


module.exports = {
    insertion,
    filterProducts,
    brandsList
}




