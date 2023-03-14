const cors = require('cors');
const { parse } = require('dotenv');
const express = require('express');
const helmet = require('helmet');
const Mongo = require('./SBmongo');

const PORT = 8092;

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
  response.send({'ack': true});
});

//filter by id
app.get('/products/:id', async (request, response) => {
  const id = request.params.id;
  const result = await Mongo.fliterProducts(id);
  response.send(result);
});

//other filters
app.get('/products/search', async (request, response) => {
  try {
    const limit = parseInt(request.query.limit);
    const brand = request.query.brand;
    const price = parseFloat(request.query.price);
    const products = await Mongo.filterProducts(null, brand, price, true);
    const results = products.slice(0, limit);
    response.send(results);
  } catch (error) {
    console.error(error);
    response.status(500).json({error: 'Internal server error'});
  }
});




app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);
