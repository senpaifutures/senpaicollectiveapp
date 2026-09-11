<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { ArrowUpRightIcon, Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const route = useRoute()
const menuOpen = ref(false)
const entryPath = computed(() => auth.isAuthenticated ? '/dashboard' : '/join')
const entryLabel = computed(() => auth.isAuthenticated ? 'Your dashboard' : 'Apply to join')
const navigation = [
  { to: '/manifesto', label: 'Manifesto' },
  { to: '/submit-job', label: 'Post a job' },
]
watch(() => route.fullPath, () => { menuOpen.value = false })
</script>

<template>
  <div class="public-page">
    <a class="public-skip" href="#public-content">Skip to content</a>
    <header class="public-header">
      <div class="public-shell public-header-inner">
        <RouterLink to="/" class="public-brand" aria-label="SENPAI COLLECTIVE home">
          <img src="/senpai_logo.svg" width="44" height="44" alt="" />
          <span>SENPAI<small>COLLECTIVE</small></span>
        </RouterLink>
        <nav class="public-desktop-nav" aria-label="Main navigation">
          <RouterLink v-for="item in navigation" :key="item.to" :to="item.to">{{ item.label }}</RouterLink>
        </nav>
        <div class="public-actions">
          <RouterLink v-if="!auth.isAuthenticated" class="public-sign-in" to="/login">Sign in</RouterLink>
          <RouterLink :to="entryPath" class="public-button public-entry">{{ entryLabel }}<ArrowUpRightIcon /></RouterLink>
          <button class="public-menu" type="button" :aria-expanded="menuOpen" aria-controls="public-mobile-nav" :aria-label="menuOpen ? 'Close navigation' : 'Open navigation'" @click="menuOpen = !menuOpen"><XMarkIcon v-if="menuOpen" /><Bars3Icon v-else /></button>
        </div>
      </div>
      <nav v-if="menuOpen" id="public-mobile-nav" class="public-mobile-nav public-shell" aria-label="Mobile navigation" @keydown.esc="menuOpen = false">
        <RouterLink v-for="item in navigation" :key="item.to" :to="item.to">{{ item.label }}</RouterLink>
        <RouterLink v-if="!auth.isAuthenticated" to="/login">Sign in</RouterLink>
      </nav>
    </header>
    <main id="public-content" tabindex="-1"><slot /></main>
    <footer class="public-footer">
      <div class="public-shell">
        <div class="public-footer-top">
          <div><RouterLink to="/" class="public-brand"><img src="/senpai_logo.svg" width="44" height="44" alt="" /><span>SENPAI<small>COLLECTIVE</small></span></RouterLink><p>Independent minds.<br />A shared future.</p></div>
          <nav aria-label="Explore the collective"><RouterLink to="/manifesto">Our manifesto</RouterLink><RouterLink to="/pool">Collective Pool</RouterLink><RouterLink to="/submit-job">Hire from the collective</RouterLink><RouterLink to="/job-status">Check job status</RouterLink></nav>
          <nav aria-label="Community policies"><RouterLink to="/guidelines">Community guidelines</RouterLink><RouterLink to="/terms">Terms of membership</RouterLink><RouterLink to="/privacy">Privacy policy</RouterLink></nav>
        </div>
        <div class="public-footer-bottom"><p>Operated by SENPAI FUTURES LTD (RC 9746107). © {{ new Date().getFullYear() }}</p><a href="https://senpaifutures.com/" target="_blank" rel="noopener noreferrer"><img src="/senpai.svg" width="30" height="28" alt="" /><span>A <strong>SENPAI FUTURES</strong> company</span><ArrowUpRightIcon /></a></div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.public-page { background: #fbfcfa; color: #162b23; min-height: 100vh; font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased; }
.public-shell { width: min(1260px, calc(100% - 80px)); margin-inline: auto; }
.public-header { border-bottom: 1px solid #d5dfd4; background: #fbfcfa; }
.public-header-inner { display: flex; align-items: center; justify-content: space-between; gap: 28px; min-height: 88px; }
.public-brand { display: inline-flex; align-items: center; gap: 11px; color: #162b23; font-size: 25px; line-height: 1; font-weight: 800; text-decoration: none; flex-shrink: 0; }
.public-brand img { width: 44px; height: 44px; object-fit: contain; flex-shrink: 0; }
.public-brand small { display: block; margin-top: 5px; font-size: 12px; font-weight: 500; letter-spacing: 1.3px; }
.public-desktop-nav, .public-actions { display: flex; align-items: center; gap: 24px; font-size: 13px; }
.public-desktop-nav { margin-left: auto; }
.public-desktop-nav a, .public-sign-in { color: #536559; padding-block: 8px; }
.public-desktop-nav .router-link-exact-active { color: #206853; text-decoration: underline; text-underline-offset: 7px; }
.public-page :deep(.public-button) { display: inline-flex; align-items: center; justify-content: center; gap: 12px; background: #242828; color: #fff; border: 1px solid #242828; padding: 14px 22px; font-size: 14px; font-weight: 550; line-height: 1.5; text-decoration: none; border-radius: 2px; }
.public-page :deep(.public-button:hover) { background: #383e3e; }
.public-button svg { width: 18px; height: 18px; }
.public-menu { display: none; padding: 10px; color: #244c3d; }
.public-menu svg { width: 24px; height: 24px; }
.public-mobile-nav { display: none; }
.public-footer { border-top: 1px solid #d5dfd4; padding-top: 52px; }
.public-footer-top { display: grid; grid-template-columns: 1.5fr 1fr 1fr; gap: 40px; padding-bottom: 44px; }
.public-footer-top p { font-size: 16px; line-height: 1.7; margin-top: 20px; color: #617267; }
.public-footer-top nav { display: flex; flex-direction: column; align-items: flex-start; gap: 15px; font-size: 14px; color: #54665a; }
.public-footer a:hover { color: #27816a; }
.public-footer-bottom { border-top: 1px solid #d5dfd4; display: flex; align-items: center; justify-content: space-between; gap: 24px; padding-block: 24px; font-size: 11px; color: #647267; }
.public-footer-bottom a { display: flex; align-items: center; gap: 10px; }
.public-footer-bottom img { width: 30px; height: 28px; object-fit: contain; }
.public-footer-bottom svg { width: 15px; height: 15px; }
.public-page :deep(a:focus-visible), .public-page :deep(button:focus-visible), .public-page :deep(summary:focus-visible) { outline: 3px solid #27816a; outline-offset: 4px; }
.public-skip { position: absolute; left: 20px; top: -100px; z-index: 100; background: #242828; color: white; padding: 12px 20px; }
.public-skip:focus { top: 12px; }
@media (max-width: 1100px) { .public-desktop-nav { display: none; } .public-menu { display: block; } .public-mobile-nav { display: flex; flex-direction: column; padding-block: 4px 20px; } .public-mobile-nav a { padding-block: 10px; font-size: 15px; } }
@media (max-width: 640px) { .public-shell { width: calc(100% - 40px); } .public-header-inner { min-height: 76px; gap: 12px; } .public-brand { font-size: 22px; gap: 8px; } .public-brand img { width: 36px; height: 36px; } .public-sign-in { display: none; } .public-actions { gap: 4px; } .public-page .public-entry { padding: 10px 12px; font-size: 12px; gap: 6px; } .public-entry svg { width: 15px; } .public-menu { padding: 8px; } .public-footer-top { grid-template-columns: 1fr 1fr; gap: 32px; } .public-footer-top > div { grid-column: 1 / -1; } .public-footer-bottom { flex-direction: column; align-items: flex-start; } }
@media (max-width: 380px) { .public-header-inner { flex-wrap: wrap; padding-block: 14px; } .public-actions { margin-left: auto; } }
</style>
