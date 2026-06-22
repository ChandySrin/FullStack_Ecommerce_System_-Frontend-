<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import {
  Heart,
  LogOut,
  Menu,
  Minus,
  Search,
  ShoppingBag,
  ShoppingCart,
  Star,
  User,
  X,
} from '@lucide/vue';
import api, { setAuthToken } from './api';

const token = ref(localStorage.getItem('commerce_token'));
const user = ref(JSON.parse(localStorage.getItem('commerce_user') || 'null'));
const categories = ref([]);
const products = ref([]);
const wishlist = ref([]);
const cartItems = ref([]);
const orders = ref([]);
const reviews = ref([]);
const selectedProduct = ref(null);
const activePanel = ref('shop');
const authMode = ref('login');
const showMobileNav = ref(false);
const loading = reactive({
  products: false,
  cart: false,
  orders: false,
  action: false,
});
const message = ref('');
const error = ref('');

const filters = reactive({
  search: '',
  category_id: '',
});

const authForm = reactive({
  name: '',
  email: 'admin@gmail.com',
  password: '',
  password_confirmation: '',
});

const profileForm = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
});

const checkoutForm = reactive({
  shipping_address: '',
  payment_method: 'Cash on delivery',
});

const reviewForm = reactive({
  rating: 5,
  comment: '',
});

const isLoggedIn = computed(() => Boolean(token.value && user.value));
const cartCount = computed(() => cartItems.value.reduce((sum, item) => sum + Number(item.quantity), 0));
const cartTotal = computed(() => cartItems.value.reduce((sum, item) => sum + Number(item.quantity) * Number(item.product?.price || 0), 0));
const wishlistProductIds = computed(() => new Set(wishlist.value.map((item) => item.product_id)));

function notify(text) {
  message.value = text;
  error.value = '';
  window.setTimeout(() => {
    if (message.value === text) message.value = '';
  }, 2800);
}

function fail(err, fallback = 'Something went wrong.') {
  error.value = err?.response?.data?.message || err?.response?.data?.errors?.email?.[0] || fallback;
  message.value = '';
}

function money(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value || 0));
}

function productImage(product) {
  return product.image_url || `https://picsum.photos/seed/product-${product.id}/640/480`;
}

function persistUser(nextUser) {
  user.value = nextUser;
  localStorage.setItem('commerce_user', JSON.stringify(nextUser));
  profileForm.name = nextUser?.name || '';
  profileForm.email = nextUser?.email || '';
}

function redirectAdminToBlade(apiToken) {
  setAuthToken(null);
  token.value = null;
  user.value = null;
  localStorage.removeItem('commerce_user');
  window.location.href = `http://127.0.0.1:8000/admin/api-login?token=${encodeURIComponent(apiToken)}`;
}

async function loadCategories() {
  const response = await api.get('/categories');
  categories.value = response.data.data.data || response.data.data || [];
}

async function loadProducts() {
  loading.products = true;
  try {
    const response = await api.get('/products', { params: filters });
    products.value = response.data.data.data || response.data.data || [];
  } catch (err) {
    fail(err, 'Could not load products.');
  } finally {
    loading.products = false;
  }
}

async function loadWishlist() {
  if (!isLoggedIn.value) return;
  const response = await api.get('/wishlist');
  wishlist.value = response.data.data || [];
}

async function loadCart() {
  if (!isLoggedIn.value) return;
  loading.cart = true;
  try {
    const response = await api.get('/cart');
    cartItems.value = response.data.data.items || [];
  } finally {
    loading.cart = false;
  }
}

async function loadOrders() {
  if (!isLoggedIn.value) return;
  loading.orders = true;
  try {
    const response = await api.get('/orders');
    orders.value = response.data.data.data || response.data.data || [];
  } finally {
    loading.orders = false;
  }
}

async function openProduct(product) {
  selectedProduct.value = product;
  reviewForm.rating = 5;
  reviewForm.comment = '';
  const response = await api.get(`/products/${product.id}/reviews`);
  reviews.value = response.data.data.data || response.data.data || [];
}

async function submitAuth() {
  loading.action = true;
  try {
    const payload = authMode.value === 'login'
      ? { email: authForm.email, password: authForm.password }
      : { ...authForm };
    const response = await api.post(authMode.value === 'login' ? '/login' : '/register', payload);

    if (authMode.value === 'login' && response.data.user?.role === 'admin') {
      redirectAdminToBlade(response.data.token);
      return;
    }

    token.value = response.data.token;
    setAuthToken(response.data.token);
    persistUser(response.data.user);
    authForm.password = '';
    authForm.password_confirmation = '';
    activePanel.value = 'shop';
    await Promise.all([loadWishlist(), loadCart(), loadOrders()]);
    notify(`Welcome, ${user.value.name}.`);
  } catch (err) {
    fail(err, 'Authentication failed.');
  } finally {
    loading.action = false;
  }
}

async function logout() {
  try {
    await api.delete('/logout');
  } catch {
    // Token may already be expired; clear local session anyway.
  }
  setAuthToken(null);
  token.value = null;
  user.value = null;
  localStorage.removeItem('commerce_user');
  wishlist.value = [];
  cartItems.value = [];
  orders.value = [];
  activePanel.value = 'shop';
  notify('Logged out.');
}

function requireLogin(panel = 'login') {
  if (isLoggedIn.value) return true;
  authMode.value = panel;
  activePanel.value = 'auth';
  error.value = 'Please login first.';
  return false;
}

async function addToCart(product, quantity = 1) {
  if (!requireLogin()) return;
  loading.action = true;
  try {
    await api.post('/cart', { product_id: product.id, quantity });
    await loadCart();
    notify(`${product.name} added to cart.`);
  } catch (err) {
    fail(err, 'Could not add product to cart.');
  } finally {
    loading.action = false;
  }
}

async function updateCart(item, quantity) {
  if (quantity < 1) return removeCartItem(item);
  await api.put(`/cart/${item.id}`, { quantity });
  await loadCart();
}

async function removeCartItem(item) {
  await api.delete(`/cart/${item.id}`);
  await loadCart();
  notify('Cart updated.');
}

async function toggleWishlist(product) {
  if (!requireLogin()) return;
  const existing = wishlist.value.find((item) => item.product_id === product.id);
  if (existing) {
    await api.delete(`/wishlist/${existing.id}`);
    notify('Removed from wishlist.');
  } else {
    await api.post('/wishlist', { product_id: product.id });
    notify('Saved to wishlist.');
  }
  await loadWishlist();
}

async function checkout() {
  if (!requireLogin()) return;
  loading.action = true;
  try {
    await api.post('/checkout', checkoutForm);
    checkoutForm.shipping_address = '';
    await Promise.all([loadCart(), loadOrders(), loadProducts()]);
    activePanel.value = 'orders';
    notify('Checkout complete. Your order is now pending.');
  } catch (err) {
    fail(err, 'Checkout failed.');
  } finally {
    loading.action = false;
  }
}

async function updateProfile() {
  loading.action = true;
  try {
    const response = await api.put('/profile', profileForm);
    persistUser(response.data.data);
    profileForm.password = '';
    profileForm.password_confirmation = '';
    notify('Profile updated.');
  } catch (err) {
    fail(err, 'Could not update profile.');
  } finally {
    loading.action = false;
  }
}

async function submitReview() {
  if (!requireLogin() || !selectedProduct.value) return;
  loading.action = true;
  try {
    await api.post(`/products/${selectedProduct.value.id}/reviews`, reviewForm);
    await openProduct(selectedProduct.value);
    notify('Review saved.');
  } catch (err) {
    fail(err, 'Could not save review.');
  } finally {
    loading.action = false;
  }
}

function switchPanel(panel) {
  activePanel.value = panel;
  showMobileNav.value = false;
  if (panel === 'cart') loadCart();
  if (panel === 'orders') loadOrders();
  if (panel === 'wishlist') loadWishlist();
}

onMounted(async () => {
  await Promise.all([loadCategories(), loadProducts()]);
  if (isLoggedIn.value) {
    await Promise.all([loadWishlist(), loadCart(), loadOrders()]);
    persistUser(user.value);
  }
});
</script>

<template>
  <div class="app">
    <header class="site-header">
      <a class="brand" href="#" @click.prevent="switchPanel('shop')">
        <span class="brand-mark"><ShoppingBag :size="22" /></span>
        <span>Commerce Studio</span>
      </a>

      <button class="icon-button mobile-only" type="button" @click="showMobileNav = !showMobileNav" aria-label="Open menu">
        <Menu :size="21" />
      </button>

      <nav class="nav" :class="{ open: showMobileNav }">
        <button :class="{ active: activePanel === 'shop' }" @click="switchPanel('shop')">Shop</button>
        <button :class="{ active: activePanel === 'wishlist' }" @click="switchPanel('wishlist')">Wishlist</button>
        <button :class="{ active: activePanel === 'cart' }" @click="switchPanel('cart')">Cart <span v-if="cartCount">{{ cartCount }}</span></button>
        <button :class="{ active: activePanel === 'orders' }" @click="switchPanel('orders')">Orders</button>
        <button :class="{ active: activePanel === 'profile' }" @click="isLoggedIn ? switchPanel('profile') : switchPanel('auth')">Profile</button>
      </nav>

      <div class="header-actions">
        <button v-if="!isLoggedIn" class="button primary" type="button" @click="switchPanel('auth')">
          <User :size="17" /> Login
        </button>
        <button v-else class="button ghost" type="button" @click="logout">
          <LogOut :size="17" /> Logout
        </button>
      </div>
    </header>

    <main>
      <section class="hero">
        <div class="hero-copy">
          <p class="eyebrow">Customer storefront</p>
          <h1>Find products faster, checkout smoother.</h1>
          <p>Browse your Laravel catalog, manage a wishlist, build a cart, and place orders from a Vue interface connected directly to your API.</p>
          <div class="hero-actions">
            <button class="button primary" type="button" @click="switchPanel('shop')">Browse Products</button>
            <button class="button secondary" type="button" @click="switchPanel('cart')">View Cart</button>
          </div>
        </div>
        <div class="hero-visual">
          <div class="metric"><span>Cart</span><strong>{{ cartCount }}</strong></div>
          <div class="metric"><span>Wishlist</span><strong>{{ wishlist.length }}</strong></div>
          <div class="metric wide"><span>Orders</span><strong>{{ orders.length }}</strong></div>
        </div>
      </section>

      <div v-if="message" class="toast success">{{ message }}</div>
      <div v-if="error" class="toast error">{{ error }}</div>

      <section v-if="activePanel === 'shop'" class="content-grid">
        <aside class="filters">
          <div class="search-box">
            <Search :size="18" />
            <input v-model="filters.search" type="search" placeholder="Search products" @keyup.enter="loadProducts">
          </div>

          <label>Category
            <select v-model="filters.category_id" @change="loadProducts">
              <option value="">All categories</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </label>

          <button class="button primary full" type="button" @click="loadProducts">Apply Filters</button>
          <button class="button ghost full" type="button" @click="filters.search = ''; filters.category_id = ''; loadProducts()">Reset</button>
        </aside>

        <section class="products">
          <div class="section-head">
            <div>
              <p class="eyebrow">Catalog</p>
              <h2>Products</h2>
            </div>
            <span class="muted">{{ products.length }} shown</span>
          </div>

          <div v-if="loading.products" class="empty-state">Loading products...</div>
          <div v-else-if="!products.length" class="empty-state">No products yet. Add products from the admin panel.</div>

          <div v-else class="product-grid">
            <article v-for="product in products" :key="product.id" class="product-card">
              <button class="wishlist-button" type="button" @click="toggleWishlist(product)" :aria-label="`Wishlist ${product.name}`">
                <Heart :size="19" :fill="wishlistProductIds.has(product.id) ? 'currentColor' : 'none'" />
              </button>
              <img :src="productImage(product)" :alt="product.name">
              <div class="product-body">
                <p class="muted">{{ product.category?.name || 'Uncategorized' }}</p>
                <h3>{{ product.name }}</h3>
                <p>{{ product.description || 'No description yet.' }}</p>
                <div class="product-meta">
                  <strong>{{ money(product.price) }}</strong>
                  <span>{{ product.stock }} in stock</span>
                </div>
                <div class="card-actions">
                  <button class="button primary" type="button" @click="addToCart(product)" :disabled="!product.stock">
                    <ShoppingCart :size="17" /> Add
                  </button>
                  <button class="button secondary" type="button" @click="openProduct(product)">Details</button>
                </div>
              </div>
            </article>
          </div>
        </section>
      </section>

      <section v-if="activePanel === 'auth'" class="panel narrow">
        <div class="tabs">
          <button :class="{ active: authMode === 'login' }" @click="authMode = 'login'">Login</button>
          <button :class="{ active: authMode === 'register' }" @click="authMode = 'register'">Register</button>
        </div>
        <form class="form" @submit.prevent="submitAuth">
          <label v-if="authMode === 'register'">Name
            <input v-model="authForm.name" type="text" required>
          </label>
          <label>Email
            <input v-model="authForm.email" type="email" required>
          </label>
          <label>Password
            <input v-model="authForm.password" type="password" required>
          </label>
          <label v-if="authMode === 'register'">Confirm Password
            <input v-model="authForm.password_confirmation" type="password" required>
          </label>
          <button class="button primary full" type="submit" :disabled="loading.action">
            {{ authMode === 'login' ? 'Login' : 'Create Account' }}
          </button>
        </form>
      </section>

      <section v-if="activePanel === 'wishlist'" class="panel">
        <div class="section-head">
          <div>
            <p class="eyebrow">Saved</p>
            <h2>Wishlist</h2>
          </div>
        </div>
        <div v-if="!isLoggedIn" class="empty-state">Login to save favorite products.</div>
        <div v-else-if="!wishlist.length" class="empty-state">Your wishlist is empty.</div>
        <div v-else class="list">
          <article v-for="item in wishlist" :key="item.id" class="list-row">
            <img :src="productImage(item.product)" :alt="item.product.name">
            <div>
              <h3>{{ item.product.name }}</h3>
              <p class="muted">{{ money(item.product.price) }}</p>
            </div>
            <div class="row-actions">
              <button class="button primary" @click="addToCart(item.product)">Add to Cart</button>
              <button class="icon-button danger" @click="toggleWishlist(item.product)" aria-label="Remove"><X :size="18" /></button>
            </div>
          </article>
        </div>
      </section>

      <section v-if="activePanel === 'cart'" class="panel split-panel">
        <div>
          <div class="section-head">
            <div>
              <p class="eyebrow">Shopping</p>
              <h2>Cart</h2>
            </div>
            <strong>{{ money(cartTotal) }}</strong>
          </div>
          <div v-if="!isLoggedIn" class="empty-state">Login to manage your cart.</div>
          <div v-else-if="!cartItems.length" class="empty-state">Your cart is empty.</div>
          <div v-else class="list">
            <article v-for="item in cartItems" :key="item.id" class="list-row">
              <img :src="productImage(item.product)" :alt="item.product.name">
              <div>
                <h3>{{ item.product.name }}</h3>
                <p class="muted">{{ money(item.product.price) }}</p>
              </div>
              <div class="qty">
                <button @click="updateCart(item, item.quantity - 1)"><Minus :size="15" /></button>
                <span>{{ item.quantity }}</span>
                <button @click="updateCart(item, item.quantity + 1)">+</button>
              </div>
              <button class="icon-button danger" @click="removeCartItem(item)" aria-label="Remove"><X :size="18" /></button>
            </article>
          </div>
        </div>

        <form class="checkout-card" @submit.prevent="checkout">
          <h3>Checkout</h3>
          <label>Shipping Address
            <textarea v-model="checkoutForm.shipping_address" required placeholder="Street, city, postal code"></textarea>
          </label>
          <label>Payment Method
            <select v-model="checkoutForm.payment_method">
              <option>Cash on delivery</option>
              <option>Bank transfer</option>
              <option>Card on delivery</option>
            </select>
          </label>
          <div class="summary-line"><span>Total</span><strong>{{ money(cartTotal) }}</strong></div>
          <button class="button primary full" type="submit" :disabled="!cartItems.length || loading.action">Place Order</button>
        </form>
      </section>

      <section v-if="activePanel === 'orders'" class="panel">
        <div class="section-head">
          <div>
            <p class="eyebrow">History</p>
            <h2>Orders</h2>
          </div>
        </div>
        <div v-if="!isLoggedIn" class="empty-state">Login to view orders.</div>
        <div v-else-if="!orders.length" class="empty-state">No orders yet.</div>
        <div v-else class="orders">
          <article v-for="order in orders" :key="order.id" class="order-card">
            <div>
              <strong>{{ order.order_number }}</strong>
              <p class="muted">{{ order.created_at?.slice(0, 10) }}</p>
            </div>
            <span class="status">{{ order.status }}</span>
            <strong>{{ money(order.total) }}</strong>
            <p class="muted">{{ order.items?.length || 0 }} item(s)</p>
          </article>
        </div>
      </section>

      <section v-if="activePanel === 'profile'" class="panel narrow">
        <div class="section-head">
          <div>
            <p class="eyebrow">Account</p>
            <h2>Profile</h2>
          </div>
        </div>
        <form v-if="isLoggedIn" class="form" @submit.prevent="updateProfile">
          <label>Name
            <input v-model="profileForm.name" type="text" required>
          </label>
          <label>Email
            <input v-model="profileForm.email" type="email" required>
          </label>
          <label>New Password
            <input v-model="profileForm.password" type="password">
          </label>
          <label>Confirm New Password
            <input v-model="profileForm.password_confirmation" type="password">
          </label>
          <button class="button primary full" type="submit" :disabled="loading.action">Update Profile</button>
        </form>
        <div v-else class="empty-state">Login to edit your profile.</div>
      </section>
    </main>

    <div v-if="selectedProduct" class="modal-backdrop" @click.self="selectedProduct = null">
      <section class="modal">
        <button class="icon-button close" type="button" @click="selectedProduct = null" aria-label="Close"><X :size="19" /></button>
        <img :src="productImage(selectedProduct)" :alt="selectedProduct.name">
        <div>
          <p class="eyebrow">{{ selectedProduct.category?.name || 'Product' }}</p>
          <h2>{{ selectedProduct.name }}</h2>
          <p>{{ selectedProduct.description || 'No description yet.' }}</p>
          <div class="product-meta">
            <strong>{{ money(selectedProduct.price) }}</strong>
            <span>{{ selectedProduct.stock }} in stock</span>
          </div>
          <button class="button primary" type="button" @click="addToCart(selectedProduct)">Add to Cart</button>

          <div class="review-box">
            <h3>Reviews</h3>
            <form v-if="isLoggedIn" class="review-form" @submit.prevent="submitReview">
              <select v-model="reviewForm.rating">
                <option v-for="value in [5,4,3,2,1]" :key="value" :value="value">{{ value }} stars</option>
              </select>
              <input v-model="reviewForm.comment" type="text" placeholder="Write a quick review">
              <button class="button secondary" type="submit"><Star :size="16" /> Save</button>
            </form>
            <div v-if="!reviews.length" class="muted">No reviews yet.</div>
            <article v-for="review in reviews" :key="review.id" class="review">
              <strong>{{ review.user?.name || 'Customer' }}</strong>
              <span>{{ review.rating }}/5</span>
              <p>{{ review.comment || 'No comment.' }}</p>
            </article>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
