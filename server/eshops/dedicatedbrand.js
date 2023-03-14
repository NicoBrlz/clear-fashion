const fetch = require('node-fetch');
const cheerio = require('cheerio');
const { v4: uuidv4 } = require('uuid'); //will generate a random id

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  const $ = cheerio.load(data);

  return $('.productList-container .productList')
    .map((i, element) => {
      const _id = uuidv4();
      const brand = 'dedicated';
      const name = $(element)
        .find('.productList-title')
        .text()
        .trim()
        .replace(/\s/g, ' ');
      const price = parseInt(
        $(element)
          .find('.productList-price')
          .text()
      );
      var currentdate = new Date(); 
      const date = currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();

      return {_id, brand, name, price, date};
    })
    .get();
};

/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */
module.exports.scrape = async url => {
  try {

    /*
    const response = await fetch(url);

    if (response.ok) {
      const body = await response.text();

      // Scroll to the bottom of the page
      await document.evaluate(() => {
        window.scrollTo(0, body.scrollHeight);
      });

      return parse(body);
    }

    console.error(response);

    return null; 
    */
    /*
    let page = 1;
    url = url + String(page);
    let products = [];

    while (true) {
      const response = await fetch(url);
      if (response.ok) {
        const body = await response.text();
        if (body.length === 0) {
          break;
        } 
        products = products.concat(parse(body));
        page++;
        url = url + String(page);
      }
      console.log('PRODUCTS IN MODULE', products);
      return products;
    

  let pageUrl = url;
  let products = [];
  const response = await fetch(pageUrl);
  while (true) {
    
    if(response.ok) {
      
      const body = await response.text();
      products = parse(body)
      if (parse(body) === null || parse(body).length === 0) {
        break;
      }
      
      console.log('Proooood', products);
      products = products.push(parse(body));
      console.log('Proooood31323', products);
  
      const $ = cheerio.load(await fetch(pageUrl));
      const nextPageLink = $('#js-nextButtonSearch');
  
      if (nextPageLink.length === 0) {
        
        console.log('Erreur ici?'); 
        break;
      }
  
      pageUrl = nextPageLink.attr('#load-more-search-results');
    }
  
    return products;
    }

    console.error(response);
    return null;
    */



    const response = await fetch(url);

    if (response.ok) {
      const body = await response.text();

      return parse(body);
    }

    console.error(response);

    return null;
    
    } 
    catch(error) {
    console.error(error);
    return null;
  }
};

