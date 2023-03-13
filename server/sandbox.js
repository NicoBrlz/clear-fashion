/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./eshops/dedicatedbrand');
const circlesportswearbrand = require('./eshops/circlesportswearbrand');
const montlimartbrand = require('./eshops/montlimartbrand');


async function sandbox (eshop) {
  try {
    /*
    let products = {};
    console.log(`🕵️‍♀️  browsing ${eshop} eshop`);
    if(eshop.includes('dedicated')){
      products = await dedicatedbrand.scrape(eshop);
    }
    if(eshop.includes('circlesportswear')){
      products = await circlesportswearbrand.scrape(eshop);
    }
    if(eshop.includes('montlimart')){
      products = await montlimartbrand.scrape(eshop);
    }
    else {
      process.exit(0);
    }
  


*/
    let products = {}
    switch(eshop) {
      case 'https://www.dedicatedbrand.com/en/men/all-men':
        products = await dedicatedbrand.scrape('https://www.dedicatedbrand.com/en/men/all-men');
        break;
      case 'https://shop.circlesportswear.com/collections/collection-homme':
        products = await circlesportswearbrand.scrape('https://shop.circlesportswear.com/collections/collection-homme');
        break;
      case 'https://www.montlimart.com/99-vetements':
        products = await montlimartbrand.scrape('https://www.montlimart.com/99-vetements');
        break;
      default:
        console.log('Veuillez choisir un paramètre valide')
        process.exit(0);
    }

    //console.log(products);
    console.log('done');
    return products;
  } 
  catch (e) {
    console.error(e);
    process.exit(1);
  }
}
    
const [,, eshop] = process.argv;

async function to_json(dict) {
  const jsonString = JSON.stringify(dict);
  const fs = require('fs');
  fs.writeFile('products.json', jsonString, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('File created successfully');
  });
}


async function main() {
  const result = [];
  const list=['https://www.dedicatedbrand.com/en/men/all-men','https://shop.circlesportswear.com/collections/collection-homme', 'https://www.montlimart.com/99-vetements'];
  for(let i=0; i<list.length; i++){
    console.log(list[i]);
    const products = await sandbox(list[i]);
    console.log(products);
    for(let k=0; k<products.length; k++) {
      result.push(products[k]);
  }
  
  } 

  console.log('Number of prod', result.length);

  let json = {"success": true};
  const data = {"result": result};
  json["data"]=data;
  to_json(result);
}


main();





