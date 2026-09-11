<script setup lang="ts">
import PublicLayout from './PublicLayout.vue'

defineProps<{
  title: string
  lastUpdated: string
  sections: { id: string; label: string }[]
  illustration?: string
}>()
</script>

<template>
  <PublicLayout>
    <div class="document-shell">
      <header class="document-heading" :class="{ 'document-illustrated': illustration }">
        <div><p class="document-eyebrow">SENPAI COLLECTIVE · Our agreements</p><h1>{{ title }}</h1><p class="document-date">Last updated: {{ lastUpdated }}</p></div>
        <img v-if="illustration" :src="illustration" width="600" height="300" alt="" />
      </header>
      <div class="document-layout">
        <aside class="document-sidebar">
          <nav class="document-desktop-contents" aria-label="On this page"><p class="document-eyebrow">On this page</p><a v-for="section in sections" :key="section.id" :href="`#${section.id}`">{{ section.label }}</a></nav>
          <details class="document-mobile-contents"><summary>On this page <span>{{ sections.length }} sections</span></summary><nav aria-label="On this page"><a v-for="section in sections" :key="section.id" :href="`#${section.id}`">{{ section.label }}</a></nav></details>
        </aside>
        <article class="document-copy"><slot /></article>
      </div>
    </div>
  </PublicLayout>
</template>

<style scoped>
.document-shell { width: min(1160px, calc(100% - 80px)); margin-inline: auto; padding-block: 70px 90px; }
.document-heading { padding-bottom: 45px; border-bottom: 1px solid #cbd8c8; }
.document-illustrated { display: grid; grid-template-columns: 1.2fr 1fr; align-items: center; gap: 40px; }
.document-heading img { width: 100%; height: auto; }
.document-eyebrow { color: #587361; font-size: 11px; font-weight: 600; line-height: 1.7; letter-spacing: 1.6px; text-transform: uppercase; }
.document-heading h1 { font-size: clamp(40px, 5.5vw, 66px); line-height: 1.08; letter-spacing: -2.5px; font-weight: 500; margin-top: 22px; max-width: 800px; }
.document-date { font-size: 13px; color: #677569; margin-top: 24px; }
.document-layout { display: grid; grid-template-columns: 240px minmax(0, 740px); gap: 72px; align-items: start; padding-top: 46px; }
.document-sidebar { position: sticky; top: 28px; max-height: calc(100vh - 56px); overflow-y: auto; padding-right: 12px; }
.document-desktop-contents { display: flex; flex-direction: column; align-items: flex-start; gap: 12px; }
.document-desktop-contents p { margin-bottom: 8px; }
.document-sidebar a { display: block; color: #5d6d60; font-size: 12px; line-height: 1.6; text-decoration: none; }
.document-sidebar a:hover { color: #226d57; text-decoration: underline; text-underline-offset: 3px; }
.document-mobile-contents { display: none; }
.document-copy { min-width: 0; font-size: 16px; line-height: 1.85; overflow-wrap: anywhere; }
.document-copy :deep(.prose) { color: #4f6054; margin-top: 0; }
.document-copy :deep(section) { scroll-margin-top: 30px; padding-top: 32px; margin-top: 32px; border-top: 1px solid #d5dfd4; }
.document-copy :deep(section:first-child) { border-top: 0; margin-top: 0; padding-top: 0; }
.document-copy :deep(.prose:not(:first-child)) { margin-top: 36px; }
.document-copy :deep(h2) { font-size: 25px; font-weight: 550; letter-spacing: -.7px; line-height: 1.35; color: #233f2d; margin-bottom: 18px; }
.document-copy :deep(h3) { color: #2a4834; font-size: 18px; line-height: 1.5; margin-top: 24px; }
.document-copy :deep(p), .document-copy :deep(li) { line-height: 1.85; }
.document-copy :deep(a) { color: #26735d; text-underline-offset: 3px; }
.document-copy :deep(strong) { font-weight: 600; }
.document-copy :deep(table) { min-width: 480px; font-size: 14px; }
.document-copy :deep(th) { background: #eaf0e5; color: #36543c; }
.document-copy :deep(td), .document-copy :deep(th) { padding: 14px; border-color: #d2decc; }
.document-copy :deep(.rounded-lg) { border-radius: 2px; }
.document-copy :deep(.bg-amber-50) { margin-top: 0; padding: 24px; }
@media (max-width: 900px) { .document-layout { grid-template-columns: 200px minmax(0, 1fr); gap: 36px; } .document-shell { width: calc(100% - 48px); } }
@media (max-width: 720px) { .document-shell { width: calc(100% - 40px); padding-block: 42px 60px; } .document-heading { padding-bottom: 30px; } .document-heading h1 { font-size: 42px; letter-spacing: -1.6px; } .document-illustrated { grid-template-columns: 1fr; gap: 24px; } .document-heading img { max-width: 380px; } .document-layout { display: block; padding-top: 24px; } .document-sidebar { position: static; max-height: none; padding: 0; margin-bottom: 32px; } .document-desktop-contents { display: none; } .document-mobile-contents { display: block; border-block: 1px solid #d5dfd4; padding: 16px 0; } .document-mobile-contents summary { cursor: pointer; font-size: 14px; } .document-mobile-contents summary span { font-size: 12px; color: #73816f; margin-left: 16px; } .document-mobile-contents nav { display: grid; gap: 12px; padding-top: 20px; } .document-copy { font-size: 15px; } .document-copy :deep(h2) { font-size: 23px; } }
</style>
