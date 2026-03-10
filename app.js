/* ================= NAV & FAQ ================= */
let currentCategory = 'all';
let currentSort = 'default';

function toggleMenu() {
    const navMenu = document.getElementById('navMenu');
    if (navMenu) navMenu.classList.toggle('open');
}

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.nav-link').forEach(link => {


        link.addEventListener('click', function () {
            let nav = document.getElementById('navMenu');
            if (nav) nav.classList.remove('open');
        });
    });

    document.querySelectorAll('.faq-q').forEach(q => {
        q.onclick = function () {
            let item = this.parentNode;
            let open = item.classList.toggle('open');
            if (open) {
                document.querySelectorAll('.faq-item').forEach(el => {
                    if (el !== item) el.classList.remove('open');
                });
            }
        };
    });

    // Add default users
    if (!localStorage.getItem('user_admin@example.com')) {
        localStorage.setItem('user_admin@example.com', JSON.stringify({ email: 'admin@example.com', pass: 'admin123', role: 'admin' }));
    }
    if (!localStorage.getItem('user_user@example.com')) {
        localStorage.setItem('user_user@example.com', JSON.stringify({ email: 'user@example.com', pass: 'user123', role: 'user' }));
    }

    updateCartCount();
    updateUserArea();
    loadProducts();
    populateCategories();
    applyFilters();
    renderHomeProducts();

    // Search functionality
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') performSearch();
        });
    }
});

/* ================= PRODUCTS ================= */
let products = [];

function loadProducts() {
    let stored = localStorage.getItem('products');
    if (stored) {
        products = JSON.parse(stored);
    } else {
        products = [
            { id: 1, name: "Collection of makeup products and brushes", desc: "Glamorous beauty essentials Free Photo.", price: 150, img: "https://th.bing.com/th/id/OIP.6hT0OW4gqGPBbeS7_UHsbwHaEJ?w=321&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3", category: "makeup" },
            { id: 2, name: "Blue Jeans", desc: "Premium denim, slim fit.", price: 45, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRV02YD6kRax9TblMoCpsEbm77qH0dkQe7L_g&s", category: "Clothing" },
            { id: 3, name: "Variety of Nivea products including creme and soap", desc: "For all skin type use ", price: 69, img: "https://th.bing.com/th/id/OIP.m5IBgYunKT0SSYcxC9uTJAHaF4?w=270&h=214&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3", category: "Skin Care" },
            { id: 4, name: "Leather Bag", desc: "Handcrafted, stylish & durable.", price: 59, img: "https://rukminim2.flixcart.com/image/850/1000/xif0q/backpack/7/9/o/7-for-men-and-women-vegan-leather-school-college-bag-15-bp-right-original-imah9a59skvhyqhy.jpeg?q=90&crop=false", category: "Bags" },
            { id: 5, name: "Cap", desc: "Adjustable, unisex design.", price: 12, img: "https://thehatproject.com.au/cdn/shop/products/mens-brown-flat-cap.jpg?v=1632980316", category: "Accessories" },
            { id: 6, name: "Wrist Watch", desc: "Minimalist, water-resistant.", price: 110, img: "https://www.titan.co.in/dw/image/v2/BKDD_PRD/on/demandware.static/-/Sites-titan-master-catalog/default/dwa7b344a2/images/Titan/Catalog/90110WL04_1.jpg?sw=800&sh=800", category: "Accessories" },
            { id: 7, name: "Canvas Tote", desc: "Eco-friendly, 18L capacity.", price: 35, img: "https://nestasia.in/cdn/shop/products/DSCF5779_57d8db53-bd8e-43e8-96fb-67b494266156.jpg?v=1677496063&width=600", category: "Bags" },
            { id: 8, name: "Sunglasses", desc: "UV400 protection, retro style.", price: 30, img: "https://funkytradition.com/cdn/shop/files/0_2019-Fashion-Round-Sunglasses-Women-Brand-Designer-Luxury-Metal-Sun-Glasses-Classic-Retro-Outdoor-Eyewear-Oculos_0079d389-153f-48a8-8d3a-928126597c19.jpg?v=1723512244", category: "Accessories" },
            { id: 9, name: "Hoodie", desc: "Fleece lined, relaxed fit.", price: 38, img: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/624708/01/mod01/fnd/IND/fmt/png/PUMA-x-X-GIRL-Women's-Hoodie", category: "Clothing" },
            { id: 10, name: "wholesale cup tea set", desc: "kitchen tea and coffe set", price: 200, img: "https://th.bing.com/th/id/OIP.m2Jihn0mj4g9ejiv6_9XJwHaHa?w=149&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3", category: "Accessories" },
            { id: 11, name: "Running Shoes", desc: "Ultra-light, shock absorbent.", price: 85, img: "https://m.media-amazon.com/images/I/81o8bHAXG3L._UY1000_DpWeblab_.jpg", category: "Footwear" },
            { id: 12, name: "Silk Scarf", desc: "Elegant, pure silk.", price: 29, img: "https://m.media-amazon.com/images/I/71+Toi2pEAL._UY350_.jpg", category: "Accessories" },
            { id: 13, name: "Graphic Tee", desc: "Trendy prints, all sizes.", price: 29, img: "https://assets.ajio.com/medias/sys_master/root/20230629/nDDs/649cd4e8a9b42d15c91c7cc3/-473Wx593H-466021226-black-MODEL.jpg", category: "Clothing" },
            { id: 14, name: "Flip-Flops", desc: "Waterproof & colorful.", price: 16, img: "https://imagescdn.thecollective.in/img/app/product/3/349145-3632955.jpg?w=500&auto=format", category: "Footwear" },
            { id: 15, name: "Messenger Bag", desc: "Urban, water-resistant.", price: 55, img: "https://images-cdn.ubuy.co.in/6368124f0a547006b811d1aa-newhey-mens-laptop-shoulder-canvas.jpg", category: "Bags" },
            { id: 16, name: "Leather Wallet", desc: "Slim, RFID blocking.", price: 25, img: "https://www.glidinggearcompany.com/cdn/shop/files/IMG_3164.jpg?v=1682422929", category: "Accessories" },
            { id: 17, name: "Combat Boots", desc: "Rugged, all-weather.", price: 120, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjTxsbi9rXKcD7aE_qiftPiVD4w2N-rt0DIQ&s", category: "Footwear" },
            { id: 18, name: "Polo Shirt", desc: "Breathable, casual style.", price: 28, img: "https://www.iconicindia.com/cdn/shop/files/202303-2210-468-model-fv-1_4b5f4fe7-abcd-453d-945a-50aed27f323b.jpg?v=1746296789", category: "Clothing" },
            { id: 19, name: "Travel Duffel", desc: "Spacious, lightweight.", price: 63, img: "https://www.furjaden.com/cdn/shop/files/DUFF50_Green_0e2d46c4-1bc7-4cb8-82ad-3f1377575fdb.jpg?v=1682437077", category: "Bags" },
            { id: 20, name: "Wool Beanie", desc: "Warm, one size fits all.", price: 14, img: "https://rukminim2.flixcart.com/image/750/900/xif0q/cap/r/w/z/free-caps-scarf-set-moderic-original-imag8zs55achxgqq.jpeg?q=90&crop=false", category: "Accessories" },
        ];
        localStorage.setItem('products', JSON.stringify(products));
    }
}

/* ================= CART ================= */
function getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');

}

function getPendingCart() { return JSON.parse(localStorage.getItem('pendingCart') || '[]'); }
function savePendingCart(pending) { localStorage.setItem('pendingCart', JSON.stringify(pending)); }

function saveCart(cart) { localStorage.setItem('cart', JSON.stringify(cart)); }
function getOrders() { return JSON.parse(localStorage.getItem('orders') || '[]'); }
function saveOrders(orders) { localStorage.setItem('orders', JSON.stringify(orders)); }
function updateCartCount() {
    let cart = getCart();
    let count = cart.reduce((s, i) => s + i.qty, 0);
    let el = document.getElementById('cartCount');
    if (el) el.textContent = count || '';
}

function mergePendingCart() {
    let pending = getPendingCart();
    if (pending.length > 0) {
        let cart = getCart();
        pending.forEach(pid => {
            let item = cart.find(i => i.id === pid);
            if (item) item.qty++;
            else cart.push({ ...products.find(p => p.id === pid), qty: 1 });
        });
        saveCart(cart);
        savePendingCart([]);
        updateCartCount();
        renderProducts();
        renderFavorites();
    }
}

/* ================= FAVORITES ================= */
function getFavs() { return JSON.parse(localStorage.getItem('favs') || '[]'); }
function saveFavs(favs) { localStorage.setItem('favs', JSON.stringify(favs)); }
function toggleFav(pid) {
    let favs = getFavs();
    let index = favs.indexOf(pid);

    if (index > -1) favs.splice(index, 1);
    else favs.push(pid);

    saveFavs(favs);
    updateFavCount();
    renderProducts();
    renderHomeProducts();
    renderFavorites();
}

/* ================= RECENTLY VIEWED ================= */
function getRecentlyViewed() { return JSON.parse(localStorage.getItem('recentlyViewed') || '[]'); }
function saveRecentlyViewed(recent) { localStorage.setItem('recentlyViewed', JSON.stringify(recent)); }

/* ================= SEARCH ================= */
function performSearch() {
    const query = document.getElementById('searchInput').value.trim();
    if (query) {
        window.location.href = `products.html?search=${encodeURIComponent(query)}`;
    }
}

/* ================= USER LOGIN ================= */
function getUser() { return localStorage.getItem('user'); }
function setUser(user) { if (user) localStorage.setItem('user', user); else localStorage.removeItem('user'); }
function updateUserArea() {
    let user = getUser();
    let el = document.getElementById('userArea');
    if (!el) return;
    let role = localStorage.getItem('role') || 'user';
    el.innerHTML = user
        ? `👤 ${user.split('@')[0]} (${role}) <a href="#" onclick="logout()">Logout</a>`
        : `<a href="#" onclick="showLogin()">Login</a>`;
}
function showLogin() { document.getElementById('loginModal').style.display = 'block'; document.getElementById('signUpModal').style.display = 'none'; }
function showSignUp() { document.getElementById('signUpModal').style.display = 'block'; document.getElementById('loginModal').style.display = 'none'; }
function login() {
    let email = document.getElementById('loginEmail').value;
    let pass = document.getElementById('loginPass').value;
    let role = document.querySelector('input[name="role"]:checked').value;
    let userData = localStorage.getItem('user_' + email);
    if (!userData) return alert("User not found");
    let user = JSON.parse(userData);
    if (user.pass !== pass || user.role !== role) return alert("Invalid login");
    setUser(email);
    localStorage.setItem('role', role);
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('signUpModal').style.display = 'none';
    updateUserArea();
    mergePendingCart();
}
function signUp() {
    let email = document.getElementById('signUpEmail').value;
    let pass = document.getElementById('signUpPass').value;
    let role = document.querySelector('input[name="signUpRole"]:checked').value;
    if (!email.includes('@') || pass.length < 3) return alert("Invalid sign up");
    if (localStorage.getItem('user_' + email)) return alert("User already exists");
    localStorage.setItem('user_' + email, JSON.stringify({ email, pass, role }));
    alert("Sign up successful");
    // Auto login after sign up
    setUser(email);
    localStorage.setItem('role', role);
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('signUpModal').style.display = 'none';
    updateUserArea();
    mergePendingCart();
}
function logout() { setUser(null); localStorage.removeItem('role'); updateUserArea(); }


/* ================= PRODUCTS RENDER ================= */
function populateCategories() {
    let filter = document.getElementById('filterCategory');
    if (!filter) return;
    let cats = ["all", ...new Set(products.map(p => p.category))];
    filter.innerHTML = cats.map(c => `<option value="${c}">${c === "all" ? "All Categories" : c}</option>`).join('');
}

function filterProducts(cat) {
    currentCategory = cat;
    applyFilters();
}

function sortProducts(sort) {
    currentSort = sort;
    applyFilters();
}

function applyFilters() {
    let filtered = products;
    if (currentCategory !== 'all') {
        filtered = filtered.filter(p => p.category === currentCategory);
    }
    // apply search
    let urlParams = new URLSearchParams(window.location.search);
    let searchQuery = urlParams.get('search');
    if (searchQuery) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.desc.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    // apply sort
    if (currentSort !== 'default') {
        filtered = [...filtered].sort((a, b) => {
            switch (currentSort) {
                case 'priceAsc': return a.price - b.price;
                case 'priceDesc': return b.price - a.price;
                case 'nameAsc': return a.name.localeCompare(b.name);
                case 'nameDesc': return b.name.localeCompare(a.name);
                default: return 0;
            }
        });
    }
    renderProducts(filtered);
    // Update select values
    let filterSelect = document.getElementById('filterCategory');
    if (filterSelect) filterSelect.value = currentCategory;
    let sortSelect = document.getElementById('sortProducts');
    if (sortSelect) sortSelect.value = currentSort;
}

function renderProducts(filtered) {
    if (filtered === undefined) {
        applyFilters();
        return;
    }
    let list = document.getElementById('productList');
    if (!list) return;
    let cart = getCart(), favs = getFavs(), userLoggedIn = !!getUser();
    list.innerHTML = '';
    filtered.forEach(prod => {
        let inCart = cart.find(i => i.id === prod.id), isFav = favs.includes(prod.id);
        let card = document.createElement('div');
        card.className = 'product';
        card.innerHTML = `
            <img src="${prod.img}" width="100">
            <div>
                <div><b>${prod.name}</b></div>
                <div>${prod.desc}</div>
                <div>Price: $${prod.price}</div>
                <button onclick="${userLoggedIn ? `addToCart(${prod.id})` : `showLogin()`}" ${inCart ? 'disabled' : ''}>${inCart ? 'Added' : 'Add to Cart'}</button>
                <button class="fav-btn" onclick="toggleFav(${prod.id})">${isFav ? '❤️' : '🤍'}</button>
                <button class="view" onclick="viewProduct(${prod.id})">View</button>
            </div>
        `;
        list.appendChild(card);
    });
}

function renderHomeProducts() {
    let list = document.getElementById('homeProductList');
    if (!list) return;
    let favs = getFavs();
    list.innerHTML = '';
    products.slice(0, 3).forEach(prod => {
        let isFav = favs.includes(prod.id);
        let card = document.createElement('div');
        card.style.margin = "10px";
        card.innerHTML = `
            <img src="${prod.img}" width="100">
            <p>${prod.name}</p>
            <button onclick="toggleFav(${prod.id})">${isFav ? '❤️' : '🤍'}</button>
               <button class="view" onclick="viewProduct(${prod.id})">View</button>
        `;
        list.appendChild(card);
    });
}

function updateFavCount() {
    let favs = getFavs();
    let el = document.getElementById('favCount');
    if (el) el.textContent = favs.length || '';
}

/* ================= VIEW / SINGLE PRODUCT ================= */
function viewProduct(pid) {
    window.location.href = `product.html?id=${pid}`;
}

function renderProductPage() {
    let params = new URLSearchParams(window.location.search);
    let id = parseInt(params.get('id'));
    if (!id) return;
    let prod = products.find(p => p.id === id);
    if (!prod) return;
    // Save to recently viewed
    let recent = getRecentlyViewed();
    recent = recent.filter(rid => rid !== prod.id);
    recent.unshift(prod.id);
    if (recent.length > 10) recent = recent.slice(0, 10);
    saveRecentlyViewed(recent);
    let container = document.getElementById('productView');
    if (!container) return;
    let favs = getFavs(), cart = getCart(), userLoggedIn = !!getUser();
    let isFav = favs.includes(prod.id);
    let inCart = cart.find(i => i.id === prod.id);
    container.innerHTML = `
        <div class="product-single">
            <img src="${prod.img}" alt="${prod.name}" />
            <div class="product-info">
                <h2>${prod.name}</h2>
                <p>${prod.desc}</p>
                <p><b>Price: $${prod.price}</b></p>
                <button onclick="${userLoggedIn ? `addToCart(${prod.id})` : `showLogin()`}" ${inCart ? 'disabled' : ''}>${inCart ? 'Added' : 'Add to Cart'}</button>
                <button onclick="toggleFav(${prod.id})">${isFav ? '❤️' : '🤍'}</button>
            </div>
        </div>
    `;
}

function renderFavorites() {
    let container = document.getElementById('favoritesList');
    if (!container) return;
    let favs = getFavs();
    let favProducts = products.filter(p => favs.includes(p.id));
    let cart = getCart(), userLoggedIn = !!getUser();
    container.innerHTML = '';
    if (favProducts.length === 0) {
        container.innerHTML = '<p>No favorites yet.</p>';
        return;
    }
    favProducts.forEach(prod => {
        let inCart = cart.find(i => i.id === prod.id);
        let card = document.createElement('div');
        card.className = 'product';
        card.innerHTML = `
            <img src="${prod.img}" width="100">
            <div>
                <div><b>${prod.name}</b></div>
                <div>${prod.desc}</div>
                <div>Price: $${prod.price}</div>
                <button onclick="${userLoggedIn ? `addToCart(${prod.id})` : `showLogin()`}" ${inCart ? 'disabled' : ''}>${inCart ? 'Added' : 'Add to Cart'}</button>
                <button onclick="toggleFav(${prod.id})">Remove</button>
                <button onclick="viewProduct(${prod.id})">View</button>
            </div>
        `;
        container.appendChild(card);
    });
}


/* ================= CART ACTIONS ================= */
function addToCart(pid) {
    if (!getUser()) {
        let pending = getPendingCart();
        if (!pending.includes(pid)) {
            pending.push(pid);
            savePendingCart(pending);
        }
        alert("Please login to add items to cart.");
        return;
    }
    let cart = getCart();
    let item = cart.find(i => i.id === pid);
    if (item) item.qty++;
    else cart.push({ ...products.find(p => p.id === pid), qty: 1 });
    saveCart(cart);
    updateCartCount();
    renderProducts();
    renderFavorites();
}

/* ================= CART PAGE ================= */
function renderCart() {
    let cart = getCart();
    console.log(cart);
    let container = document.getElementById('cartItems');
    let totalEl = document.getElementById('cartTotal');
    if (!container || !totalEl) return;
    if (cart.length === 0) { container.innerHTML = "<p>Your cart is empty.</p>"; totalEl.textContent = ""; return; }
    container.innerHTML = ''; let total = 0;
    cart.forEach(item => {
        total += item.price * item.qty;
        let div = document.createElement('div'); div.className = 'cart-item';
        div.innerHTML = `
            <img src="${item.img}">
            <div>
                <p><b>${item.name}</b></p>
                <p>Price: $${item.price}</p>
                <p>Qty: <button onclick="changeQty(${item.id},-1)">-</button> ${item.qty} <button onclick="changeQty(${item.id},1)">+</button></p>
                <button onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;
        container.appendChild(div);
    });
    totalEl.textContent = `Total: $${total.toFixed(2)}`;
}

renderCart()
function changeQty(pid, delta) {
    let cart = getCart();
    let item = cart.find(i => i.id === pid);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) cart = cart.filter(i => i.id !== pid);
    saveCart(cart);
    updateCartCount();
    renderCart();
}

function removeFromCart(pid) {
    let cart = getCart().filter(i => i.id !== pid);
    saveCart(cart);
    updateCartCount();
    renderCart();
}

/* ================= CHECKOUT ================= */
function renderCheckout() {
    let cart = getCart();
    let container = document.getElementById('checkoutItems');
    let totalEl = document.getElementById('checkoutTotal');
    if (!container || !totalEl) return;
    if (cart.length === 0) { container.innerHTML = "<p>Your cart is empty.</p>"; totalEl.textContent = ""; return; }
    container.innerHTML = ''; let total = 0;
    cart.forEach(item => {
        total += item.price * item.qty;
        let div = document.createElement('div'); div.className = 'checkout-item';
        div.innerHTML = `
            <img src="${item.img}" width="50">
            <div>
                <p><b>${item.name}</b></p>
                <p>Price: $${item.price} x ${item.qty}</p>
            </div>
        `;
        container.appendChild(div);
    });
    totalEl.textContent = `Total: $${total.toFixed(2)}`;
}

function payNow() {
    let name = document.getElementById('c_name').value;
    let address = document.getElementById('c_address').value;
    let email = document.getElementById('c_email').value;
    let paymentMethod = document.getElementById('paymentMethod').value;
    if (!name || !address || !email || !paymentMethod) {
        alert('Please fill all required fields.');
        return;
    }
    if (paymentMethod === 'creditcard' || paymentMethod === 'debitcard') {
        let cardNum = document.getElementById('cardNumber').value;
        let expiry = document.getElementById('cardExpiry').value;
        let cvv = document.getElementById('cardCVV').value;
        if (!cardNum || !expiry || !cvv) {
            alert('Please fill all card details.');
            return;
        }
    }
    if (paymentMethod === 'upi') {
        let upiId = document.getElementById('upiId').value;
        if (!upiId) {
            alert('Please enter UPI ID.');
            return;
        }
    }
    if (paymentMethod === 'netbanking') {
        let bankName = document.getElementById('bankName').value;
        if (!bankName) {
            alert('Please enter Bank Name.');
            return;
        }
    }
    // Simulate payment processing
    if (paymentMethod === 'gpay') {
        alert('Redirecting to Google Pay... Payment successful via Google Pay!');
    } else {
        alert(`Payment successful via ${paymentMethod}!`);
    }
    // Save order to history
    let cart = getCart();
    let total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    let order = {
        id: Date.now(),
        date: new Date().toISOString(),
        items: cart,
        total: total,
        name: name,
        address: address,
        email: email,
        paymentMethod: paymentMethod
    };
    let orders = getOrders();
    orders.push(order);
    saveOrders(orders);
    // Clear cart
    saveCart([]);
    updateCartCount();
    document.getElementById('checkoutMsg').textContent = 'Order placed successfully!';
    document.getElementById('checkoutForm').reset();
    renderCheckout();
    togglePaymentFields(); // Reset fields visibility
}

function togglePaymentFields() {
    let method = document.getElementById('paymentMethod').value;
    document.getElementById('cardFields').style.display = (method === 'creditcard' || method === 'debitcard') ? 'block' : 'none';
    document.getElementById('upiFields').style.display = (method === 'upi') ? 'block' : 'none';
    document.getElementById('netBankingFields').style.display = (method === 'netbanking') ? 'block' : 'none';
}

/* ================= ORDER HISTORY ================= */
function renderOrderHistory() {
    let orders = getOrders();
    let container = document.getElementById('orderHistory');
    if (!container) return;
    if (orders.length === 0) {
        container.innerHTML = '<p>No orders yet.</p>';
        return;
    }
    container.innerHTML = '';
    orders.forEach(order => {
        let orderDiv = document.createElement('div');
        orderDiv.className = 'order';
        orderDiv.innerHTML = `
            <h3>Order #${order.id} - ${new Date(order.date).toLocaleDateString()}</h3>
            <p>Total: $${order.total.toFixed(2)}</p>
            <p>Name: ${order.name}, Address: ${order.address}, Email: ${order.email}</p>
            <p>Payment: ${order.paymentMethod}</p>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <img src="${item.img}" width="50">
                        <div>
                            <p><b>${item.name}</b></p>
                            <p>Price: $${item.price} x ${item.qty} = $${(item.price * item.qty).toFixed(2)}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        container.appendChild(orderDiv);
    });
}
