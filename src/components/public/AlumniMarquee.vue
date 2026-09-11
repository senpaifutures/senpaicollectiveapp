<script setup lang="ts">
import { ref } from 'vue'
import { ALUMNI } from '@/content/alumni'

// Two independent, oppositely-scrolling rows read better than one long belt —
// split the pool roughly in half.
const mid = Math.ceil(ALUMNI.length / 2)
const rowA = ALUMNI.slice(0, mid)
const rowB = ALUMNI.slice(mid)
const paused = ref(false)
</script>

<template>
  <div class="alumni-gallery" :class="{ 'is-paused': paused }">
    <div class="gallery-controls">
      <button type="button" :aria-pressed="paused" @click="paused = !paused">{{ paused ? 'Resume portraits' : 'Pause portraits' }}</button>
    </div>
    <div class="marquee-row" tabindex="0" role="region" aria-label="Alumni portraits, first row">
      <div class="marquee-track marquee-left">
        <div v-for="(person, i) in [...rowA, ...rowA]" :key="`a-${i}`" class="alumnus-card" :title="person.bio" :aria-hidden="i >= rowA.length ? true : undefined">
          <img :src="person.photoUrl" :alt="i < rowA.length ? person.name : ''" loading="lazy" class="alumnus-photo" />
          <div class="alumnus-scrim" />
          <p class="alumnus-name">{{ person.name }}</p>
        </div>
      </div>
    </div>
    <div class="marquee-row" tabindex="0" role="region" aria-label="Alumni portraits, second row">
      <div class="marquee-track marquee-right">
        <div v-for="(person, i) in [...rowB, ...rowB]" :key="`b-${i}`" class="alumnus-card" :title="person.bio" :aria-hidden="i >= rowB.length ? true : undefined">
          <img :src="person.photoUrl" :alt="i < rowB.length ? person.name : ''" loading="lazy" class="alumnus-photo" />
          <div class="alumnus-scrim" />
          <p class="alumnus-name">{{ person.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.alumni-gallery { min-width: 0; }
.gallery-controls { display: flex; justify-content: flex-end; padding: 0 20px 12px; }
.gallery-controls button { font: inherit; font-size: 12px; color: inherit; border: 1px solid currentColor; background: transparent; padding: 8px 12px; cursor: pointer; }
.gallery-controls button:focus-visible, .marquee-row:focus-visible { outline: 2px solid #217674; outline-offset: 3px; }
.marquee-row + .marquee-row { margin-top: 6px; }
.is-paused .marquee-track { animation-play-state: paused; }
.marquee-row:focus .marquee-track { animation: none; }
.marquee-row:focus { overflow-x: auto; }
.marquee-row {
  overflow: hidden;
}

.marquee-track {
  display: flex;
  gap: 3px;
  width: max-content;
  padding-right: 3px;
}

.marquee-left {
  animation: marquee-scroll-left 110s linear infinite;
}

.marquee-right {
  animation: marquee-scroll-right 110s linear infinite;
}

.marquee-row:hover .marquee-track {
  animation-play-state: paused;
}

.alumnus-card {
  position: relative;
  flex-shrink: 0;
  width: 9.5rem;
  height: 9.5rem;
  overflow: hidden;
}

.alumnus-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.alumnus-scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0) 55%);
}

.alumnus-name {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0.6rem;
  padding: 0 0.65rem;
  color: white;
  font-weight: 800;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.01em;
  line-height: 1.15;
}

@keyframes marquee-scroll-left {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@keyframes marquee-scroll-right {
  from { transform: translateX(-50%); }
  to { transform: translateX(0); }
}

@media (prefers-reduced-motion: reduce) {
  .gallery-controls { display: none; }
  .marquee-row { overflow-x: auto; }
  .marquee-track {
    animation: none !important;
  }
}
</style>
