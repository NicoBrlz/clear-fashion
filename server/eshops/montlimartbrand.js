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

  return $('.products-list__block')
    .map((i, element) => {
      const _id = uuidv4();

      const link = $(element)
        .find('.product-miniature__thumb-link')
        .attr('href');

      const brand = 'montlimart';

      const name = $(element)
        .find('.product-miniature__title .text-reset')
        .text()
        .trim()
        .replace(/\s/g, ' ');

        
      const price = parseInt(
        $(element)
          .find('.product-miniature__pricing .price')
          .text()
      );
      if (isNaN(price)) {
        return null; 
      }
      
      function randomDate(start, end) {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
      }
      const startDate = new Date(2022, 0, 1);
      const endDate = new Date();
                 
      const released_d = randomDate(startDate, endDate);
       
      const released = released_d.getDate() + "/"
                + (released_d.getMonth()+1)  + "/" 
                + released_d.getFullYear() + " "  
                + released_d.getHours() + ":"  
                + released_d.getMinutes() + ":" 
                + released_d.getSeconds();

      return {_id, link, brand, name, price, released};
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
