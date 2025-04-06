const categoryEl = document.getElementById('category');
const minPriceEl = document.getElementById('minPrice');
const maxPriceEl = document.getElementById('maxPrice');
const searchBtn = document.getElementById('searchBtn');
const productGrid = document.getElementById('productGrid');
const status = document.getElementById('status');

searchBtn.addEventListener('click', () => {
  const category = categoryEl.value;
  const minPrice = minPriceEl.value;
  const maxPrice = maxPriceEl.value;

  let url = 'https://mockapi.io/products?';

  if (category) url += `category=${category}&`;
  if (minPrice) url += `min_price=${minPrice}&`;
  if (maxPrice) url += `max_price=${maxPrice}&`;

  url += `sort=asc`;

  fetchProducts(url);
});

async function fetchProducts(apiUrl) {
  status.textContent = 'Loading...';
  productGrid.innerHTML = '';

  try {
    const res = await fetch(apiUrl);

    if (!res.ok) throw new Error('Failed to fetch');

    const products = await res.json();

    if (products.length === 0) {
      status.textContent = 'No products found.';
      return;
    }

    status.textContent = '';

    products.forEach(product => {
      const div = document.createElement('div');
      div.className = 'product-card';
      div.innerHTML = `
        <img src="${product.image}" alt="${product.name}" />
        <h4>${product.name}</h4>
        <p>₹${product.price}</p>
      `;
      productGrid.appendChild(div);
    });
  } catch (err) {
    status.textContent = 'Error loading products.';
  }
}
