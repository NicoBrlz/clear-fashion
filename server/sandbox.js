/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./eshops/dedicatedbrand');
const circlesportswearbrand = require('./eshops/circlesportswearbrand');
const montlimartbrand = require('./eshops/montlimartbrand');


async function sandbox (eshop = 1) {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} eshop`);
    let products = {}
    switch(eshop) {
      case 1:
        products = await dedicatedbrand.scrape('https://www.dedicatedbrand.com/en/men/news');
        break;
      case 2:
        products = await circlesportswearbrand.scrape('https://shop.circlesportswear.com/collections/collection-homme');
        break;
      case 3:
        products = await montlimartbrand.scrape('https://www.montlimart.com/99-vetements');
        break;
      default:
        console.log('Veuillez choisir un paramètre entre 1 et 3')
        process.exit(0);
    }
    

    console.log(products);
    console.log('done');
    process.exit(0);
  } 
  catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [,, eshop] = process.argv;

sandbox(2);


const products = dedicatedbrand.scrape('https://www.dedicatedbrand.com/en/men/news');

/*
products.forEach(product => {
  console.log(products.name);
});
*/

