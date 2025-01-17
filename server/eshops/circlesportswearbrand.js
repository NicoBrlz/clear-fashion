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

      const link = "https://shop.circlesportswear.com/"
        .concat($(element)
        .find('.full-unstyled-link')
        .attr('href'))

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
      
      //console.log("DATES", released);
                
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
