<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { ChevronLeft, ChevronRight } from '@lucide/vue';
import { useShop } from '../store/shop';

const { categories, switchPanel, loadProducts, filters } = useShop();


const slides = [
  {
    title: 'Grab Upto 50% Off On Selected Items',
    text: 'Browse the catalog, save favorites, and check out in just a few clicks.',
    cta: 'Buy Now',
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80', 
  },
  {
    title: 'New Arrivals Just Dropped',
    text: 'Fresh styles added weekly. Be the first to shop the latest pieces.',
    cta: 'Shop New',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80', 
  },
  {
    title: 'Top Picks, Top Rated',
    text: 'Shop the highest-rated products in the catalog, hand-picked by customers like you.',
    cta: 'See Top Rated',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80', 
  },
];

const active = ref(0);
let timer = null;

function goTo(index) {
  active.value = (index + slides.length) % slides.length;
}
function next() {
  goTo(active.value + 1);
}
function prev() {
  goTo(active.value - 1);
}
function restartAutoplay() {
  clearInterval(timer);
  timer = setInterval(next, 5000);
}

onMounted(restartAutoplay);
onUnmounted(() => clearInterval(timer));

function shopCategory(category) {
  filters.category_id = category.id;
  switchPanel('shop');
  loadProducts();
}
</script>

<template>
  <section>
    <div class="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
      <div class="relative overflow-hidden rounded-xl2 bg-surface-100">

        <!-- Slides: only the active one is visible, so there is exactly one image on screen.
             Crossfade overlaps old/new slides while transitioning, so there's no blank
             flash in between — feels smooth instead of like a page refresh. -->
        <div class="relative">
          <Transition
            v-for="(slide, index) in slides"
            :key="slide.title"
            enter-active-class="transition-opacity duration-700 ease-in-out"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition-opacity duration-700 ease-in-out"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <div
              v-show="index === active"
              class="grid items-center gap-6 px-6 py-10 sm:px-10 lg:grid-cols-2"
              :class="index === active ? 'relative' : 'absolute inset-0'"
            >
              <div>
                <h1 class="font-display text-3xl font-bold leading-tight text-ink-900 sm:text-4xl lg:text-[2.6rem]">
                  {{ slide.title }}
                </h1>
                <p class="mt-3 max-w-sm text-sm text-ink-700">
                  {{ slide.text }}
                </p>
                <button
                  class="mt-6 rounded-full bg-primary-900 px-7 py-3 text-sm font-semibold text-surface-50 transition hover:bg-primary-800"
                  type="button"
                  @click="switchPanel('shop')"
                >
                  {{ slide.cta }}
                </button>
              </div>
              <div class="flex justify-center">
                <img
                  :src="slide.image"
                  :alt="slide.title"
                  class="h-56 w-full max-w-sm rounded-xl2 bg-white object-cover sm:h-72"
                />
              </div>
            </div>
          </Transition>
        </div>

        <!-- Prev / next controls -->
        <button
          type="button"
          aria-label="Previous slide"
          class="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink-900 shadow-card transition hover:bg-white"
          @click="prev(); restartAutoplay()"
        >
          <ChevronLeft :size="18" />
        </button>
        <button
          type="button"
          aria-label="Next slide"
          class="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink-900 shadow-card transition hover:bg-white"
          @click="next(); restartAutoplay()"
        >
          <ChevronRight :size="18" />
        </button>

        <!-- Dot indicators — the filled dot tells you exactly which slide is showing -->
        <div class="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          <button
            v-for="(slide, index) in slides"
            :key="slide.title + '-dot'"
            type="button"
            :aria-label="`Go to slide ${index + 1}`"
            class="h-2 rounded-full transition-all"
            :class="index === active ? 'w-6 bg-primary-900' : 'w-2 bg-ink-900/20 hover:bg-ink-900/35'"
            @click="goTo(index); restartAutoplay()"
          />
        </div>
      </div>
    </div>

    <!-- Popular categories -->
    <div v-if="categories.length" class="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
      <h2 class="mb-4 font-display text-lg font-semibold text-ink-900">Popular Categories</h2>
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <button
          v-for="category in categories.slice(0, 8)"
          :key="category.id"
          class="flex items-center gap-3 rounded-xl2 bg-white p-3 text-left shadow-card transition hover:-translate-y-0.5 hover:shadow-card-lg"
          type="button"
          @click="shopCategory(category)"
        >
          <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-100 text-lg">
            🛍️
          </span>
          <span>
            <strong class="block text-sm font-semibold text-ink-900">{{ category.name }}</strong>
            <span class="text-xs text-ink-700">{{ category.products_count ?? '' }} {{ category.products_count ? 'Products' : '' }}</span>
          </span>
        </button>
      </div>
    </div>
  </section>
</template>