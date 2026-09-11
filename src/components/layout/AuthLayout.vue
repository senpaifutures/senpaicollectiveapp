<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { XMarkIcon } from '@heroicons/vue/24/outline'

withDefaults(defineProps<{ title: string; eyebrow?: string; wide?: boolean }>(), {
  eyebrow: 'Your account',
  wide: false,
})
</script>

<template>
  <div class="auth-page">
    <header class="auth-header">
      <RouterLink to="/" class="auth-brand" aria-label="SENPAI COLLECTIVE home">
        <img src="/senpai_logo.svg" width="44" height="44" alt="" />
        <span>SENPAI<small>COLLECTIVE</small></span>
      </RouterLink>
      <RouterLink to="/" class="auth-close" aria-label="Return to the homepage"><XMarkIcon /></RouterLink>
    </header>
    <div class="auth-layout" :class="{ 'auth-wide': wide }">
      <aside class="auth-aside">
        <p class="auth-eyebrow">SENPAI COLLECTIVE</p>
        <p class="auth-aside-title">A place to build,<br />belong, <em>and grow.</em></p>
        <img class="auth-illustration" src="/illustrations/collective-orbit.svg" width="600" height="300" alt="Creative disciplines connected through the collective" />
        <p class="auth-aside-caption">Independent minds.<br />Something bigger, together.</p>
        <a href="https://senpaifutures.com/" target="_blank" rel="noopener noreferrer" class="auth-parent"><img src="/senpai.svg" width="30" height="28" alt="" /><span>A <strong>SENPAI FUTURES</strong> company</span></a>
      </aside>
      <main class="auth-content">
        <header class="auth-heading"><p class="auth-eyebrow">{{ eyebrow }}</p><h1>{{ title }}</h1><div v-if="$slots.intro" class="auth-intro"><slot name="intro" /></div></header>
        <div class="auth-panel"><slot /></div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.auth-page { min-height: 100vh; background: #fbfcfa; color: #162b23; font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased; }
.auth-header { min-height: 88px; display: flex; justify-content: space-between; align-items: center; gap: 24px; padding: 18px max(32px, calc((100vw - 1260px) / 2)); border-bottom: 1px solid #d5dfd4; }
.auth-brand { display: inline-flex; gap: 11px; align-items: center; font-size: 25px; line-height: 1; letter-spacing: .2px; font-weight: 800; color: #162b23; text-decoration: none; }
.auth-brand > img { width: 44px; height: 44px; flex: 0 0 44px; object-fit: contain; }
.auth-brand small { display: block; font-size: 12px; letter-spacing: 1.3px; font-weight: 500; margin-top: 5px; }
.auth-close { display: grid; place-items: center; width: 42px; height: 42px; border: 1px solid #d5dfd4; color: #617267; }
.auth-close svg { width: 20px; height: 20px; }
.auth-close:hover { background: #eaf0e6; }
.auth-layout { display: grid; grid-template-columns: 340px minmax(0, 510px); gap: 80px; width: min(930px, calc(100% - 64px)); margin: 72px auto 0; padding-bottom: 72px; align-items: start; }
.auth-layout.auth-wide { grid-template-columns: 300px minmax(0, 740px); width: min(1120px, calc(100% - 64px)); gap: 60px; }
.auth-aside { padding: 34px 28px; background: #f4f5f2; border: 1px solid #d3dfcf; }
.auth-eyebrow { font-size: 12px; font-weight: 600; line-height: 1.6; letter-spacing: 1.7px; text-transform: uppercase; color: #587361; margin: 0; }
.auth-aside-title { font-size: 36px; line-height: 1.15; letter-spacing: -1.2px; font-weight: 500; margin: 28px 0 0; }
.auth-aside-title em { font-family: Georgia, 'Times New Roman', serif; color: #28786a; }
.auth-illustration { display: block; width: 100%; height: auto; aspect-ratio: 2; margin-top: 32px; }
.auth-aside-caption { font-size: 14px; line-height: 1.8; color: #576c58; margin: 24px 0 0; }
.auth-parent { display: flex; align-items: center; gap: 10px; padding-top: 24px; margin-top: 28px; border-top: 1px solid #c5d5c1; font-size: 12px; color: #647361; text-decoration: none; }
.auth-parent img { width: 30px; height: 28px; object-fit: contain; flex-shrink: 0; }
.auth-parent strong { color: #36543a; }
.auth-content { min-width: 0; }
.auth-heading { margin-bottom: 26px; }
.auth-heading h1 { font-size: 36px; letter-spacing: -1.1px; line-height: 1.15; font-weight: 550; margin: 14px 0 0; }
.auth-intro { margin-top: 15px; font-size: 14px; line-height: 1.8; color: #647267; }
.auth-intro :deep(a) { color: #26735d; font-weight: 600; margin-left: 4px; }
.auth-panel { padding: 34px; border: 1px solid #d5dfd4; background: #fff; }
.auth-panel :deep(p), .auth-panel :deep(li) { line-height: 1.8; }
.auth-panel :deep(h2), .auth-panel :deep(h3) { color: #243e2c; font-weight: 550; }
.auth-panel :deep(input:not([type='checkbox'])), .auth-panel :deep(textarea), .auth-panel :deep(button[aria-haspopup='listbox']) { min-height: 49px; border-radius: 3px; font-size: 16px; background: #fcfdf9; padding-top: 12px; padding-bottom: 12px; }
.auth-panel :deep(input.border-gray-300) { border-color: #c6d3c5; }
.auth-panel :deep(input::placeholder) { color: #889386; }
.auth-panel :deep(label) { font-size: 14px; line-height: 1.7; }
.auth-panel :deep(button[type='submit']), .auth-panel :deep(.auth-primary) { display: inline-flex; align-items: center; justify-content: center; gap: 12px; min-height: 50px; padding: 14px 22px; border-radius: 2px; border: 1px solid #242828; color: #fff; background: #242828; font-size: 15px; font-weight: 550; text-decoration: none; }
.auth-panel :deep(button[type='submit']:hover), .auth-panel :deep(.auth-primary:hover) { background: #383e3e; }
.auth-panel :deep(.auth-secondary) { display: inline-flex; align-items: center; justify-content: center; min-height: 48px; padding: 12px 20px; border: 1px solid #becfbc; border-radius: 2px; color: #36533c; background: transparent; font-size: 14px; }
.auth-panel :deep(.auth-note) { border: 1px solid #d2dfcb; background: #f7f6f2; border-radius: 2px; padding: 20px; }
.auth-panel :deep(.auth-note-label) { color: #54744c; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; }
.auth-panel :deep(.auth-status-icon) { color: #337c5b; background: #e3efdc; }
.auth-panel :deep(.pending-section) { padding: 24px 0; margin-bottom: 0; border-bottom: 1px solid #d5dfd4; background: transparent; box-shadow: none; border-radius: 0; }
.auth-panel :deep(.pending-creed) { background: #e7f0e1; padding: 26px; border: 1px solid #d0dfc8; border-radius: 2px; margin-block: 26px; }
.auth-panel :deep(.pending-reflection) { background: #242828; border-radius: 2px; }
.auth-panel :deep(.pending-reflection h3) { color: #fff; }
.auth-panel :deep(.pending-values) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.auth-panel :deep(.pending-values > div) { border-radius: 2px; }
.auth-page a:focus-visible, .auth-page :deep(button:focus-visible) { outline: 3px solid #2b8974; outline-offset: 4px; }
@media (max-width: 900px) { .auth-layout, .auth-layout.auth-wide { gap: 36px; grid-template-columns: 260px minmax(0, 1fr); } .auth-aside { padding: 28px 20px; } .auth-aside-title { font-size: 30px; } .auth-panel { padding: 28px; } .auth-heading h1 { font-size: 32px; } }
@media (max-width: 720px) { .auth-layout, .auth-layout.auth-wide { display: flex; flex-direction: column; width: min(560px, calc(100% - 40px)); margin-top: 36px; gap: 30px; } .auth-content { width: 100%; order: -1; } .auth-aside { width: 100%; padding: 24px; } .auth-illustration { display: none; } .auth-aside-title { font-size: 28px; margin-top: 14px; } .auth-aside-title br { display: none; } .auth-aside-caption { margin-top: 14px; } .auth-parent { padding-top: 18px; margin-top: 18px; } .auth-header { min-height: 76px; padding: 14px 20px; } .auth-brand { font-size: 22px; gap: 9px; } .auth-brand > img { width: 38px; height: 38px; flex-basis: 38px; } }
@media (max-width: 400px) { .auth-layout, .auth-layout.auth-wide { width: calc(100% - 28px); } .auth-panel { padding: 24px 20px; } .auth-heading h1 { font-size: 30px; } .auth-panel :deep(.pending-values) { grid-template-columns: 1fr; } }
</style>
