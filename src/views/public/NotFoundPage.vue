<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ArrowUpRightIcon } from '@heroicons/vue/24/outline'
import PublicLayout from '@/components/layout/PublicLayout.vue'
</script>

<template>
  <PublicLayout>
    <div class="not-found">
      <div><p class="not-found-code">404 / A wrong turn</p><h1>Page not found.</h1><p>Sorry, we couldn't find the page you're looking for.</p><RouterLink to="/" class="public-button">Go back home <ArrowUpRightIcon /></RouterLink></div>
      <img src="/illustrations/collective-orbit.svg" width="600" height="300" alt="" />
    </div>
  </PublicLayout>
</template>

<style scoped>
.not-found { display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: 60px; min-height: 60vh; width: min(1080px, calc(100% - 80px)); margin: auto; padding-block: 70px; }
.not-found .not-found-code { color: #668459; text-transform: uppercase; font-size: 12px; letter-spacing: 1.5px; margin-bottom: 22px; }
.not-found h1 { font-size: clamp(40px, 5vw, 64px); line-height: 1.1; letter-spacing: -2px; font-weight: 500; }
.not-found p { color: #617267; font-size: 16px; line-height: 1.8; margin-block: 22px 30px; }
.not-found img { width: 100%; height: auto; }
.not-found svg { width: 18px; height: 18px; }
@media (max-width: 640px) { .not-found { grid-template-columns: 1fr; width: calc(100% - 40px); padding-block: 48px; gap: 32px; } .not-found img { max-width: 360px; } }
</style>
