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
  return $('.grid__item .card__content')
    .map((i, element) => {
      const _id = uuidv4();
      const brand = 'circlesportswear'
      const name = $(element)
        .find('.card__heading')
        .text()
        .trim()
        .replace(/\s/g, ' ');

        
      const price = parseInt(
        $(element)
          .find('.money')
          .text()
          .replace('€', '')
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
    const response = await fetch(url);

    if (response.ok) {
      const body = await response.text();

      return parse(body);
    }

    console.error(response);

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};
