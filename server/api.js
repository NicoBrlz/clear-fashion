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

//Making the api look like the one from step 2
let ans = {"success": true};
let data = {"result": []};
let meta = {};


app.get('/', async (request, response) => {
  const results = await Mongo.filterProducts();

  data.result = results;
  data.meta.currentPage = 1;
  data.meta.pageCount = 1;
  data.meta.pageSize = results.length;
  data.meta.count = results.length;

  ans.data = data;
  response.send(ans);
});




//other filters
app.get('/products/search', async (request, response) => {
  console.log('/prod/search')
  const page = parseInt(request.query.page) || 1;
  const size = parseInt(request.query.size) || 12;
  const brand = request.query.brand || null;
  const price = parseFloat(request.query.price) || null;
  var products = await Mongo.filterProducts(null, brand, price);
  const results = products.slice((page - 1)*size, size*page);

  console.log('PAGE', page);
  console.log('SIZE', size);
  console.log('BRAND', brand);
  console.log('price', price);

  data.result = results;
  meta.currentPage=page;
  meta.pageCount = products.length/size;
  meta.pageSize = size;
  meta.count = products.length;

  data.meta = meta;
  ans.data = data;

  response.send(ans);

});

app.get('/brands', async (request, response) => {
  const brands = await Mongo.brandsList();
  data.result = brands;
  ans.data = data;

  response.send(ans);
});


//filter by id
app.get('/products/:id', async (request, response) => {
  console.log('/products/:id');
  const id = request.query.id;
  const results = await Mongo.filterProducts(id);

  console.log(id);
  data.result = results;
  meta.currentPage = 1;
  meta.pageCount = 1;
  meta.pageSize = 1;
  meta.count = 1;

  data.meta = meta;
  ans.data = data;
  response.send(ans);
});





app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);
