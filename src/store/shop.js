import { computed, reactive, ref } from 'vue';
import api, { setAuthToken } from '../api';

// Module-level state acts as a simple singleton store shared by every
// component that imports useShop(). No Pinia/Vuex needed for this size.
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
const profileTab = ref('info');

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
  sort: 'featured',
  min_rating: '',
  price_max: '',
});

const authForm = reactive({
  name: '',
  email: '',
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

let searchDebounce = null;

const isLoggedIn = computed(() => Boolean(token.value && user.value));
const cartCount = computed(() => cartItems.value.reduce((sum, item) => sum + Number(item.quantity), 0));
const cartTotal = computed(() =>
  cartItems.value.reduce((sum, item) => sum + Number(item.quantity) * Number(item.product?.price || 0), 0)
);
const wishlistProductIds = computed(() => new Set(wishlist.value.map((item) => item.product_id)));

const sortedProducts = computed(() => {
  let list = [...products.value];

  if (filters.min_rating) {
    list = list.filter((product) => averageRating(product) >= Number(filters.min_rating));
  }
  if (filters.price_max) {
    list = list.filter((product) => Number(product.price) <= Number(filters.price_max));
  }

  switch (filters.sort) {
    case 'price_asc':
      return list.sort((a, b) => Number(a.price) - Number(b.price));
    case 'price_desc':
      return list.sort((a, b) => Number(b.price) - Number(a.price));
    case 'name_asc':
      return list.sort((a, b) => a.name.localeCompare(b.name));
    case 'newest':
      return list.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    default:
      return list;
  }
});

const userInitials = computed(() => {
  const name = user.value?.name || '';
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || 'U'
  );
});

const memberSince = computed(() => {
  const date = user.value?.created_at;
  if (!date) return null;
  return new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'long' });
});

const totalSpent = computed(() => orders.value.reduce((sum, order) => sum + Number(order.total || 0), 0));

const passwordsMismatch = computed(
  () => Boolean(profileForm.password) && profileForm.password !== profileForm.password_confirmation
);

function averageRating(product) {
  const value = Number(product.reviews_avg_rating ?? product.average_rating ?? 0);
  return Number.isFinite(value) ? value : 0;
}

function money(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value || 0));
}

function productImage(product) {
  return product.image_url || `https://picsum.photos/seed/product-${product.id}/640/480`;
}

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

function persistUser(nextUser) {
  user.value = nextUser;
  localStorage.setItem('commerce_user', JSON.stringify(nextUser));
  profileForm.name = nextUser?.name || '';
  profileForm.email = nextUser?.email || '';
}

function onSearchInput() {
  switchPanel('shop');
  window.clearTimeout(searchDebounce);
  searchDebounce = window.setTimeout(() => loadProducts(), 420);
}

function resetFilters() {
  filters.search = '';
  filters.category_id = '';
  filters.sort = 'featured';
  filters.min_rating = '';
  filters.price_max = '';
  loadProducts();
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

function closeProduct() {
  selectedProduct.value = null;
}

function requireLogin(panel = 'login') {
  if (isLoggedIn.value) return true;
  authMode.value = panel;
  activePanel.value = 'auth';
  error.value = 'Please login first.';
  return false;
}

// Admin accounts are routed to the server-rendered Blade admin panel
// instead of staying in the SPA storefront.
function redirectAdminToBlade(adminToken) {
  const base = import.meta.env.VITE_API_BASE_URL?.replace(/\/api\/?$/, '') || '';
  window.location.href = `${base}/admin?token=${encodeURIComponent(adminToken)}`;
}

async function submitAuth() {
  loading.action = true;
  try {
    const payload =
      authMode.value === 'login' ? { email: authForm.email, password: authForm.password } : { ...authForm };

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

    // openProduct only refreshes the review list — the star average shown on
    // the product card/grid lives on the product object itself, so recompute
    // it here from the fresh reviews and patch it in place. Since this is the
    // same reactive object referenced in `products`, the grid updates live.
    if (reviews.value.length) {
      const total = reviews.value.reduce((sum, review) => sum + Number(review.rating || 0), 0);
      selectedProduct.value.reviews_avg_rating = total / reviews.value.length;
    } else {
      selectedProduct.value.reviews_avg_rating = 0;
    }
    selectedProduct.value.reviews_count = reviews.value.length;

    notify('Review saved.');
  } catch (err) {
    fail(err, 'Could not save review.');
  } finally {
    loading.action = false;
  }
}

function switchPanel(panel) {
  activePanel.value = panel;
  if (panel === 'cart') loadCart();
  if (panel === 'orders') loadOrders();
  if (panel === 'wishlist') loadWishlist();
}

async function bootstrap() {
  await Promise.all([loadCategories(), loadProducts()]);
  if (isLoggedIn.value) {
    await Promise.all([loadWishlist(), loadCart(), loadOrders()]);
    persistUser(user.value);
  }
}

export function useShop() {
  return {
    // state
    token,
    user,
    categories,
    products,
    wishlist,
    cartItems,
    orders,
    reviews,
    selectedProduct,
    activePanel,
    authMode,
    profileTab,
    loading,
    message,
    error,
    filters,
    authForm,
    profileForm,
    checkoutForm,
    reviewForm,
    // computed
    isLoggedIn,
    cartCount,
    cartTotal,
    wishlistProductIds,
    sortedProducts,
    userInitials,
    memberSince,
    totalSpent,
    passwordsMismatch,
    // helpers
    averageRating,
    money,
    productImage,
    notify,
    fail,
    onSearchInput,
    resetFilters,
    // actions
    loadCategories,
    loadProducts,
    loadWishlist,
    loadCart,
    loadOrders,
    openProduct,
    closeProduct,
    requireLogin,
    submitAuth,
    logout,
    addToCart,
    updateCart,
    removeCartItem,
    toggleWishlist,
    checkout,
    updateProfile,
    submitReview,
    switchPanel,
    bootstrap,
  };
}