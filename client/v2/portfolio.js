// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

/*
Description of the available api
GET https://clear-fashion-api.vercel.app/
Search for specific products
This endpoint accepts the following optional query string parameters:
- `page` - page of products to return
- `size` - number of products to return
GET https://clear-fashion-api.vercel.app/brands
Search for available brands list
*/

// current products on the page
let currentProducts = [];
let currentPagination = {};

// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');

// All selectors that we added
const selectBrand = document.querySelector('#brand-select');
const selectSort = document.querySelector('#sort-select');
const spanNbBrands = document.querySelector('#nbBrands')


// Particular selectors (+ creation of buttons)
const recentlyReleased = document.querySelector('#filters > span:nth-of-type(2)');
const button = document.createElement('button');
button.setAttribute('name', 'released2');
button.setAttribute('id', 'released2');
button.textContent = '2 weeks';
recentlyReleased.insertAdjacentElement('afterend', button);
const buttonReleased = document.querySelector('#released2');
button.style.marginLeft = "10px";


const reasonablePrice = document.querySelector('#filters > span:nth-of-type(1)');
const button2 = document.createElement('button');
button2.setAttribute('name', 'price');
button2.setAttribute('id', 'price');
button2.textContent = '-100€';
reasonablePrice.insertAdjacentElement('afterend', button2);
button2.style.marginLeft = "10px";
const buttonPrice = document.querySelector('#price');

// Indicators selectors
const idNbNew = document.querySelector('#indicators div:nth-child(4) span:nth-child(2)');
idNbNew.setAttribute('id', 'nbNew');
const spanNbNew = document.querySelector('#nbNew');


const idLast = document.querySelector('#indicators div:last-child span:nth-child(2)');
idLast.setAttribute('id', 'last');
const spanLast = document.querySelector('#last');


//Creation of a Fav filter button
const parentSection = document.getElementById("options");

const newDiv= document.createElement("div");
newDiv.setAttribute("favs", "Favorites");
parentSection.appendChild(newDiv);

const label = document.createElement('label');
label.textContent = 'Filter by favorites : ';

const button3 = document.createElement('button')
button3.textContent = 'By fav';
button3.setAttribute('name', 'favs');
button3.setAttribute('id', 'byFav');
button3.style.marginLeft = "10px";

newDiv.appendChild(label);
newDiv.appendChild(button3);

const byFav = document.querySelector('#byFav');


/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ({result, meta}) => {
  currentProducts = result;
  currentPagination = meta;
  //console.log('set', result)
};

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchProducts = async (page = 1, size = 12, brand = "") => {
  try {
    const response = await fetch(
      `https://clear-fashion-api.vercel.app?page=${page}&size=${size}&brand=${brand}`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};

/*test
fetchProducts().then(res => {
  console.log('test', res);
});
*/

/**
 * Fetch brands from api
 * @return {Array}
 */
const fetchBrands = async () => {
  try {
    const response = await fetch(
      `https://clear-fashion-api.vercel.app/brands`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return body.data.result;
    }
    
    //console.log('4', body.data.result);
    return body.data.result;
  } catch (error) {
    console.error(error);
    return body.data.result;
  }
};

/**
 * Render list of products
 * @param  {Array} products
 */

const renderProducts = products => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = products
    .map(product => {
      return `
      <div class="product" id=${product.uuid}>
        <span>${product.brand}</span>
        <a href="${product.link}">${product.name}</a>
        <span>${product.price}€</span>
        <button type="button" name="fav" id=${product.uuid} onclick="EditFav(this.id)" style="margin left: 10px;"> fav </button> 
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2>Products</h2>';
  sectionProducts.appendChild(fragment);
};
/**
 * Render page selector
 * @param  {Object} pagination
 */

const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');
  
  //console.log("1", options); 
  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};


/**
 * Render page selector
 * @param  {Array} brands
 */
const renderBrand = brands => {
  const options = [`<option value=>All</option>`];
  //console.log('2', brands);
  for(let i=0; i<brands.length; i++) {
    options.push(`<option value="${brands[i]}">${brands[i]}</option>`)
  }
  options.join();
  //console.log("3", options);
  selectBrand.innerHTML = options;
};


//Since fetchBrands returns a promise and not the actual Array, we use .then()
fetchBrands().then(brands => {
  renderBrand(brands);
});


/**
 * Render page selector
 * @param  {Object} pagination
 */

const renderIndicators = (pagination, products, brands) => {
  const {count} = pagination;
  //console.log("count", count);
  spanNbProducts.innerHTML = count;
  spanNbBrands.innerHTML = brands.length;
  let l = 0;
  /*
  
  */
  
  products.then((prod) => {
    for(const elem of prod.result) {
      const weeks = 1000*3600*24*14*16;
      console.log(new Date(elem.released).getTime(), weeks)
      if(Math.abs(new Date(elem.released).getTime() - new Date().getTime() < weeks)){
        console.log('date', elem.released)
        console.log('VERIFIED')
        l = l + 1;
      }
        
    }
    console.log('NEWS', l); 
    spanNbNew.innerHTML = l;
  });
  
  
  
  
  

  
  /*
  let nbNew = 0;
  for(let i = 0; i<222; i++){
    if(Math.abs(new Date() - new Date(products.result[i].released)) < 1000*3600*24*7){
      nbNew++;
    }
  }
  */

};



const render = (products, pagination) => {
  renderProducts(products);
  renderPagination(pagination);
  //renderIndicators(pagination);
  fetchBrands().then(brands => {
    renderIndicators(pagination, fetchProducts(), brands);
  });
  

};

//Funtions fav

const EditFav = async id => {
  const val = await allStorage();
  let fav = [];
  fav.push(currentProducts.find(item => item.uuid == id));
  if(val.some(item => item.uuid === id)) {
    localStorage.removeItem(fav[0].name, JSON.stringify(fav[0]));
  }
  else {
    localStorage.setItem(fav[0].name, JSON.stringify(fav[0]));
  }
  
}

//Helps to check if our local storage already contains a value
async function allStorage() {
    var values = [],
        keys = Object.keys(localStorage),
        i = keys.length;
    while ( i-- ) {
        values.push(JSON.parse(localStorage.getItem(keys[i])));
    }
    console.log('local', values);
    return values;
}


/**
 * Declaration of all Listeners
 */

/**
 * Select the number of products to display
 */
selectShow.addEventListener('change', async (event) => {
  const products = await fetchProducts(selectPage.value, parseInt(event.target.value), selectBrand.value);

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

selectPage.addEventListener('change', async (event) => {
  const products = await fetchProducts(parseInt(event.target.value), selectShow.value, selectBrand.value);

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});


selectBrand.addEventListener('change', async (event) => {
  
  const products = await fetchProducts(selectPage.value, selectShow.value, String(event.target.value));
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
  
  //console.log(event.target.value)
});

buttonReleased.addEventListener('click', async () => {
  let filtered = {"result": [], "meta": []};
  const products = await fetchProducts(selectPage.value, selectShow.value, selectBrand.value);

  for (let i=0; i<products.result.length; i++) {
    //on test ajd-released (ou released-ajd) après avoir convertit released en date ou les 2 en une même unité
    //puis on ajoute le produit à filtered
    const weeks = 1000*3600*24*14;
    if(Math.abs(new Date(products.result[i].released).getTime() - new Date().getTime()) < weeks) {
      console.log('test result', products.result[i]);
      filtered.result.push(products.result[i]);
    }
  }
  filtered.meta.push(products.meta)
  setCurrentProducts(filtered);
  render(currentProducts, currentPagination);

});

buttonPrice.addEventListener('click', async () => {
  let filtered = {"result": [], "meta": []};
  const products = await fetchProducts(selectPage.value, selectShow.value, selectBrand.value);
  for (let i=0; i<products.result.length; i++) {
    if(products.result[i].price < 100) {
      console.log('test result 2', products.result[i])
      filtered.result.push(products.result[i]);
    }
  }
  filtered.meta.push(products.meta)
  setCurrentProducts(filtered);
  console.log('FILTERED fzfz', filtered)
  render(currentProducts, currentPagination);

});

//Not an event listener, to change a bit
byFav.addEventListener('click', async() => {
  let filtered = {"result": [], "meta": []};
  //const products = await fetchProducts(selectPage.value, selectShow.value, selectBrand.value);
  console.log('AQUI NIÑO', allStorage());
  filtered.result = await allStorage();
  filtered.meta.push(products.meta)
  setCurrentProducts(filtered);
  console.log('FILTERED', filtered)
  render(currentProducts, currentPagination);

});

selectSort.addEventListener('change', async (event) => {
  let products = await fetchProducts(selectPage.value, selectShow.value, selectBrand.value);
  if (String(event.target.value) == "price-asc") {
    const sorted = products.result.sort((a,b) => (a.price - b.price));
    products={"result": sorted, "meta": currentPagination};
  }
  if (event.target.value == "price-desc") {
    const sorted = products.result.sort((a,b) => (b.price -a.price));
    products.result=sorted;
  }
  if (event.target.value == "date-asc") {
    const sorted = products.result.sort((a,b) => (Date(a.released) - Date(b.released)));
    products.result=sorted;
  }
  if (event.target.value == "date-desc") {
    const sorted = products.result.sort((a,b) => (new Date(b.released) - new Date(a.released)));
    products.result=sorted;
  }
  //console.log('sort', event.target.value, products.result)
  setCurrentProducts(products);
  render(currentProducts, currentPagination);



})




document.addEventListener('DOMContentLoaded', async () => {
  const products = await fetchProducts();

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});




//Feature 1 : On ajoute un eventListener au selector selectPage 
//il marche comme celui de selectProduct et on change les paramètres de fetchProduct (à savoir page et size)
//la page devient celle qu'on choisit dans le menu déroulant et la taille (size) devient celle de currentPagination


//Feature 2 : On crée un selector selectBrand et un fecthBrand qui marche comme fetchProducts mais pour aller chercher la liste de
//brands sur l'autre API
//on modifie l'url qu'on fecth dans fetchProducts pour y ajouter un filtre sur les marques
//on crée aussi un renderBrand qui permet d'afficher les marques qu'on a fecth dans le menu déroulant
//enfin, on crée l'event listener associé à selectBrand qui changer les produits affichés selon la marque choisie
//et on modifie au passage les autres listener pour que la fonction fetchProducts ait tous ses paramètres de remplis


//Feature 3 - 4
//3 -> devrait être bon
//4 -> done mais checker les qlq pb sur le bloc notes



//Feature 5 - 6
//both done


//Feature 8
//done


//Feature 9 : Nb of new prods
//still some issues to fix : parameters when calling fetchProd in the render method? Dates?

//Feature 10 : p50,p90 and p95

//Feature 12 : Open prod link
//on peut déjà cliquer sur le nom du produit

//Feature 13 : Save as fav
//can save if we click once and remove if twice
//using local storage

//Feature 14 : Filter by fav
//create a button in the 1st section & add an event listener that sets the currentProducts on the fav list