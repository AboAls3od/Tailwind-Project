const productGrid = document.getElementById("productGrid");
const categoryFilter = document.getElementById("categoryFilter");
const priceFilter = document.getElementById("priceFilter");

let products = [];

const apiUrls = {
  phones: "https://dummyjson.com/products/category/smartphones",
  laptops: "https://dummyjson.com/products/category/laptops",
  airbuds: "https://dummyjson.com/products/category/mobile-accessories",
  all: "https://dummyjson.com/products?limit=30"
};



function loadProducts(category = "all") {
  fetch(apiUrls[category])
    .then(res => res.json())
    .then(data => {
      products = data.products;
      filterAndRender();
    });
}

function renderProducts(list) {
  if (!productGrid) return;

  productGrid.innerHTML = list.map(p => `
    <div class="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 border border-gray-100 overflow-hidden">
      <div class="relative overflow-hidden rounded-xl mb-4 bg-gradient-to-br from-light/50 to-white">
        <img src="${p.thumbnail}" class="w-full h-64 object-contain transform transition-transform duration-700 group-hover:scale-110">
        <div class="absolute top-4 right-4 bg-gradient-to-r from-primary to-[#1a3a3a] text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
          ${p.discountPercentage ? `${Math.round(p.discountPercentage)}% OFF` : 'NEW'}
        </div>
      </div>
      <h4 class="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300">${p.title}</h4>
      <div class="flex items-center justify-between mb-4">
        <p class="text-2xl font-bold text-primary">$${p.price}</p>
        <div class="flex items-center gap-1 text-yellow-400">
          <i class="ri-star-fill text-sm"></i>
          <span class="text-sm text-textlight">${p.rating || '4.5'}</span>
        </div>
      </div>
      <button class="w-full bg-gradient-to-r from-primary to-[#1a3a3a] text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:from-[#1a3a3a] hover:to-primary cursor-pointer flex items-center justify-center gap-2"
        data-id="${p.id}"
        data-name="${p.title}"
        data-price="${p.price}"
        data-image="${p.thumbnail}">
        <i class="ri-shopping-cart-line"></i>
        Add to Cart
      </button>
    </div>
  `).join("");

  bindBuyButtons();
}

function bindBuyButtons() {
  document.querySelectorAll(".buy-btn").forEach(btn => {
    btn.onclick = () => {
      addToCart({
        id: btn.dataset.id,
        name: btn.dataset.name,
        price: +btn.dataset.price,
        image: btn.dataset.image
      });
    };
  });
}

function filterAndRender() {
  let filtered = [...products];

  if (priceFilter && priceFilter.value !== "all") {
    filtered = filtered.filter(p => p.price <= +priceFilter.value);
  }

  renderProducts(filtered);
}


function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  loadCart();
}

function addToCart(product) {
  const cart = getCart();
  const found = cart.find(p => p.id == product.id);

  if (found) found.quantity++;
  else cart.push({ ...product, quantity: 1 });

  saveCart(cart);
  alert("Product Added Successfully to Your Cart")
}

function updateCartCount() {
  const badge = document.getElementById("cart-count");
  if (!badge) return;

  const count = getCart().reduce((s, i) => s + i.quantity, 0);
  badge.textContent = count;
}

function loadCart() {
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  if (!cartItems || !cartTotal) return;

  const cart = getCart();
  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const subtotal = item.price * item.quantity;
    total += subtotal;

    const row = document.createElement("tr");
    row.className = "block md:table-row bg-white mb-4 border-2 border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300";
row.innerHTML = `
  <td data-label="Product" class="p-4 border-b md:border-b-0 border-gray-200 md:table-cell flex justify-between items-center md:block">
    <span class="font-bold text-gray-800 md:hidden">Product:</span>
    <img src="${item.image}" class="w-20 h-20 md:w-16 md:h-16 object-cover rounded-xl shadow-md mx-auto md:mx-0">
  </td>

  <td data-label="Name" class="p-4 border-b md:border-b-0 border-gray-200 md:table-cell flex justify-between items-center">
    <span class="font-bold text-gray-800 md:hidden">Name:</span>
    <span class="font-semibold text-gray-900">${item.name}</span>
  </td>

  <td data-label="Price" class="p-4 border-b md:border-b-0 border-gray-200 md:table-cell flex justify-between items-center">
    <span class="font-bold text-gray-800 md:hidden">Price:</span>
    <span class="text-lg font-bold text-primary">$${item.price}</span>
  </td>

  <td data-label="Quantity" class="p-4 border-b md:border-b-0 border-gray-200 md:table-cell flex justify-between items-center">
    <span class="font-bold text-gray-800 md:hidden">Quantity:</span>
    <div class="flex justify-center items-center gap-3">
      <button class="w-8 h-8 flex items-center justify-center bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow-md hover:shadow-lg hover:scale-110 transition-all duration-300 font-bold" onclick="changeQty(${index}, -1)">−</button>
      <span class="w-10 text-center font-bold text-gray-900">${item.quantity}</span>
      <button class="w-8 h-8 flex items-center justify-center bg-gradient-to-r from-primary to-[#1a3a3a] text-white rounded-lg shadow-md hover:shadow-lg hover:scale-110 transition-all duration-300 font-bold" onclick="changeQty(${index}, 1)">+</button>
    </div>
  </td>

  <td data-label="Subtotal" class="p-4 border-b md:border-b-0 border-gray-200 md:table-cell flex justify-between items-center">
    <span class="font-bold text-gray-800 md:hidden">Subtotal:</span>
    <span class="text-xl font-bold text-primary">$${subtotal.toFixed(2)}</span>
  </td>

  <td data-label="Action" class="p-4 md:table-cell flex justify-between items-center">
    <span class="font-bold text-gray-800 md:hidden">Action:</span>
    <button class="bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-4 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold text-sm" onclick="removeItem(${index})">
      <i class="ri-delete-bin-line mr-1"></i>Remove
    </button>
  </td>
`;


    cartItems.appendChild(row);
  });

  cartTotal.textContent = total.toFixed(2);
}


function changeQty(index, delta) {
  const cart = getCart();
  cart[index].quantity += delta;

  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  saveCart(cart);
}

function removeItem(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
}



document.addEventListener("DOMContentLoaded", () => {
  if (productGrid) loadProducts();
  updateCartCount();
  loadCart();
});

if (categoryFilter)
  categoryFilter.onchange = e => loadProducts(e.target.value);

if (priceFilter)
  priceFilter.onchange = filterAndRender;
