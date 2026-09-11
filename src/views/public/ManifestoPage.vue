<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { Component } from 'vue'
import { ArrowDownIcon, ArrowUpRightIcon, UsersIcon, CpuChipIcon, BuildingOffice2Icon, PaintBrushIcon, SquaresPlusIcon } from '@heroicons/vue/24/outline'
import { SENPAI_MANIFESTO } from '@/content/manifesto'
import PublicLayout from '@/components/layout/PublicLayout.vue'

const pillarIcons: Record<string, Component> = {
  Culture: UsersIcon,
  Technology: CpuChipIcon,
  Business: BuildingOffice2Icon,
  Art: PaintBrushIcon,
  Systems: SquaresPlusIcon,
}

const chapters = [
  { id: 'the-world', label: 'The world as it is' },
  { id: 'beliefs', label: 'What we believe' },
  { id: 'change', label: 'How we change this' },
  { id: 'rejections', label: 'What we reject' },
  { id: 'commitments', label: 'Our commitment' },
  { id: 'values', label: 'Core values' },
  { id: 'pillars', label: 'What we’re building' },
  { id: 'creed', label: 'The pledge' },
]
</script>

<template>
  <PublicLayout>
    <article class="manifesto">
      <header class="manifesto-hero manifesto-shell">
        <div class="manifesto-meta"><p class="chapter-label">Our manifesto</p><span>Est. {{ SENPAI_MANIFESTO.founding.established }} · A shared conviction</span></div>
        <h1>{{ SENPAI_MANIFESTO.declarationHeadline }}</h1>
        <div class="manifesto-opening">
          <div class="manifesto-emblem"><img src="/illustrations/collective-orbit.svg" width="600" height="300" alt="Different disciplines connected through a shared foundation" /><p>A declaration of who we are,<br />what we believe, and why we build.</p><a href="#the-world">Read the manifesto <ArrowDownIcon /></a></div>
          <p class="manifesto-prose">{{ SENPAI_MANIFESTO.declarationBody }}</p>
        </div>
      </header>

      <nav class="chapter-index manifesto-shell" aria-label="Manifesto chapters"><a v-for="(chapter, index) in chapters" :key="chapter.id" :href="`#${chapter.id}`"><span>0{{ index + 1 }}</span>{{ chapter.label }}</a></nav>

      <section id="the-world" class="manifesto-chapter manifesto-shell chapter-split">
        <header><p class="chapter-label">01 / The world as it is</p><h2>We do not accept<br /><em>this as inevitable.</em></h2></header>
        <div class="manifesto-prose"><p v-for="(paragraph, index) in SENPAI_MANIFESTO.worldAsItIs.split('\n\n')" :key="index" :class="{ 'world-conclusion': index === SENPAI_MANIFESTO.worldAsItIs.split('\n\n').length - 1 }">{{ paragraph }}</p></div>
      </section>

      <section id="beliefs" class="beliefs-section">
        <div class="manifesto-shell manifesto-chapter"><div class="chapter-heading"><p class="chapter-label">02 / What we believe</p><h2>Conviction comes<br /><em>before construction.</em></h2></div>
          <ol class="beliefs-list"><li v-for="(belief, index) in SENPAI_MANIFESTO.beliefs" :key="index"><span class="belief-number">0{{ index + 1 }}</span><p><strong>We believe</strong> {{ belief }}</p></li></ol>
        </div>
      </section>

      <section id="change" class="manifesto-chapter manifesto-shell chapter-split">
        <header><p class="chapter-label">03 / How we change this</p><h2>Individual talent.<br /><em>Collective power.</em></h2><img class="chapter-illustration" src="/illustrations/shared-foundation.svg" width="600" height="300" alt="Contributions building a shared foundation" /></header>
        <ol class="change-list"><li v-for="(line, index) in SENPAI_MANIFESTO.howWeChange" :key="index"><span>0{{ index + 1 }}</span><p>{{ line }}</p></li></ol>
      </section>

      <section id="rejections" class="rejections-section"><div class="manifesto-shell manifesto-chapter chapter-split"><header><p class="chapter-label">04 / What we reject</p><h2>Some things<br /><em>end with us.</em></h2></header><div class="rejections-list"><p v-for="(rejection, index) in SENPAI_MANIFESTO.rejections" :key="index"><strong>We reject</strong> {{ rejection }}</p></div></div></section>

      <section id="commitments" class="manifesto-chapter manifesto-shell">
        <div class="chapter-heading"><div><p class="chapter-label">05 / Our commitment</p><h2>You won’t build<br /><em>alone.</em></h2></div><p>To every member who joins this collective, we make these promises:</p></div>
        <div class="commitments-grid"><div v-for="(commitment, index) in SENPAI_MANIFESTO.commitments" :key="commitment.title"><span class="chapter-label">0{{ index + 1 }}</span><h3>{{ commitment.title }}</h3><p>{{ commitment.description }}</p></div></div>
      </section>

      <section id="values" class="values-section"><div class="manifesto-shell manifesto-chapter">
        <div class="chapter-heading"><div><p class="chapter-label">06 / Core values</p><h2>How we live.<br /><em>How we build.</em></h2></div><div class="values-intro"><img src="/corevalues.svg" width="64" height="64" alt="" /><p>These are not aspirations. These are how we live:</p></div></div>
        <div class="values-grid"><div v-for="(value, index) in SENPAI_MANIFESTO.values" :key="value.name"><span class="chapter-label">0{{ index + 1 }}</span><h3>{{ value.name }}</h3><p>{{ value.description }}</p></div></div>
      </div></section>

      <section id="pillars" class="manifesto-chapter manifesto-shell">
        <div class="chapter-heading"><div><p class="chapter-label">07 / What we’re building</p><h2>Five pillars.<br /><em>A continent of possibility.</em></h2></div><p>The SENPAI COLLECTIVE builds across five pillars. Not because we chose them arbitrarily, but because these are the domains that shape civilizations:</p></div>
        <div class="pillars-list"><div v-for="(pillar, index) in SENPAI_MANIFESTO.pillars" :key="pillar.name"><span class="chapter-label">0{{ index + 1 }}</span><h3><span class="pillar-icon" aria-hidden="true"><component :is="pillarIcons[pillar.name]" /></span>{{ pillar.name }}</h3><p>{{ pillar.description }}</p></div></div>
      </section>

      <section id="creed" class="pledge-section"><div class="manifesto-shell manifesto-chapter"><p class="chapter-label">08 / The pledge</p><img src="/senpai_logo.svg" width="64" height="64" alt="SENPAI COLLECTIVE" /><div class="pledge-lines"><p v-for="(line, index) in SENPAI_MANIFESTO.creed" :key="index" :class="{ 'pledge-final': index >= SENPAI_MANIFESTO.creed.length - 2 }">{{ line }}</p></div></div></section>

      <section class="manifesto-chapter manifesto-shell chapter-split invitation">
        <header><p class="chapter-label">The invitation</p><h2>If that’s you —<br /><em>we’re ready<br />when you are.</em></h2></header>
        <div class="manifesto-prose"><p>This manifesto is not a marketing document. It is a declaration of war — against mediocrity, against isolation, against the systems that have failed our people.</p><p>If you read this and felt something stir — that's the signal. That restlessness, that recognition, that sense of "finally, someone said it" — that's how you know you might belong here.</p><p>We are not looking for spectators. We are looking for builders. People who will show up, do the work, challenge themselves, and lift others as they climb.</p><RouterLink to="/join" class="public-button">Apply to join the collective <ArrowUpRightIcon /></RouterLink><p class="manifesto-signature">Est. {{ SENPAI_MANIFESTO.founding.established }}. Reaffirmed {{ new Date().getFullYear() }}.</p></div>
      </section>
    </article>
  </PublicLayout>
</template>

<style scoped>
.manifesto-shell { width: min(1160px, calc(100% - 80px)); margin-inline: auto; }
.manifesto-hero { padding-block: 52px 70px; }
.manifesto-meta { display: flex; justify-content: space-between; gap: 24px; align-items: center; }
.chapter-label { font-size: 11px; font-weight: 600; line-height: 1.7; letter-spacing: 1.6px; text-transform: uppercase; color: #56735d; }
.manifesto-meta > span { font-size: 12px; color: #7b8679; }
.manifesto h1 { font-size: clamp(58px, 8vw, 110px); line-height: .99; letter-spacing: -.06em; font-weight: 500; max-width: 1120px; margin-block: 42px 60px; text-wrap: balance; }
.manifesto-opening { display: grid; grid-template-columns: .85fr 1.15fr; gap: 90px; align-items: start; }
.manifesto-emblem img { width: 100%; height: auto; max-width: 360px; }
.manifesto-emblem > p { font-size: 14px; line-height: 1.7; color: #6c7a6c; margin-top: 16px; }
.manifesto-emblem a { display: inline-flex; align-items: center; gap: 20px; font-size: 13px; color: #256c53; padding-block: 16px; margin-top: 8px; }
.manifesto-emblem svg { width: 18px; height: 18px; }
.manifesto-prose { white-space: pre-line; font-size: 17px; line-height: 1.85; color: #536356; }
.manifesto-prose > p + p { margin-top: 24px; }
.chapter-index { display: grid; grid-template-columns: repeat(4, 1fr); border-block: 1px solid #cbd8c8; padding-block: 20px; gap: 12px 28px; }
.chapter-index a { display: flex; gap: 12px; align-items: baseline; padding-block: 8px; font-size: 12px; color: #4f6656; }
.chapter-index a:hover { text-decoration: underline; text-underline-offset: 4px; }
.chapter-index span { color: #889481; font-size: 10px; }
.manifesto-chapter { padding-block: 88px; scroll-margin-top: 24px; }
.chapter-split { display: grid; grid-template-columns: .85fr 1.15fr; gap: 90px; }
.manifesto h2 { font-size: clamp(34px, 4vw, 49px); line-height: 1.12; letter-spacing: -1.9px; font-weight: 500; margin-top: 24px; }
.manifesto em { font-family: Georgia, 'Times New Roman', serif; font-weight: 400; color: #2e7b64; }
.manifesto .world-conclusion { border-left: 2px solid #36866c; padding-left: 24px; color: #244c36; font-size: 22px; line-height: 1.6; margin-top: 36px; }
.beliefs-section { background: #e7f0e1; }
.chapter-heading { display: flex; justify-content: space-between; align-items: flex-end; gap: 60px; margin-bottom: 42px; }
.chapter-heading > p, .values-intro { max-width: 360px; font-size: 15px; line-height: 1.8; color: #63745e; }
.beliefs-section .chapter-heading { display: block; }
.beliefs-list { padding: 0; list-style: none; }
.beliefs-list li { display: grid; grid-template-columns: 64px 1fr; gap: 24px; border-top: 1px solid #c6d7bf; padding-block: 28px; }
.belief-number { color: #7e9a70; font-size: 13px; padding-top: 7px; }
.beliefs-list p { font-size: clamp(22px, 2.6vw, 30px); line-height: 1.5; letter-spacing: -.6px; max-width: 960px; color: #41583a; }
.beliefs-list strong { color: #233f28; font-weight: 600; }
.chapter-illustration { display: block; width: 100%; height: auto; margin-top: 40px; }
.change-list { padding: 0; list-style: none; }
.change-list li { display: flex; gap: 24px; padding-block: 24px; border-top: 1px solid #d5dfd4; font-size: 17px; line-height: 1.85; color: #536356; }
.change-list li:first-child { padding-top: 0; border: 0; }
.change-list span { font-size: 11px; padding-top: 6px; color: #698e61; }
.rejections-section { background: #f7f3ea; border-block: 1px solid #d8decd; }
.rejections-list p { font-size: 18px; line-height: 1.7; padding-block: 15px; border-bottom: 1px solid #d5dccd; color: #596450; }
.rejections-list p:first-child { padding-top: 0; }
.rejections-list strong { color: #36472c; font-weight: 600; }
.commitments-grid { display: grid; grid-template-columns: 1fr 1fr; column-gap: 64px; row-gap: 40px; }
.commitments-grid > div { border-top: 1px solid #cbd8c8; padding-top: 24px; }
.manifesto h3 { font-size: 25px; letter-spacing: -.7px; line-height: 1.35; font-weight: 500; margin-block: 16px; }
.commitments-grid p, .values-grid p { font-size: 15px; line-height: 1.85; color: #586b59; }
.values-section { background: #fafaf8; }
.values-intro img { margin-bottom: 18px; width: 56px; height: 56px; }
.values-grid { display: grid; grid-template-columns: repeat(3, 1fr); column-gap: 36px; row-gap: 40px; }
.values-grid > div { border-top: 1px solid #ccd9c3; padding-top: 24px; }
.values-grid h3 { font-size: 23px; }
.pillars-list > div { display: grid; grid-template-columns: 40px .8fr 1.2fr; align-items: baseline; gap: 24px; border-top: 1px solid #cbd8c8; padding-block: 22px; }
.pillars-list h3 { display: flex; align-items: center; gap: 18px; margin: 0; font-size: 32px; }
.pillar-icon { display: grid; place-items: center; width: 44px; height: 44px; flex: 0 0 44px; border: 1px solid #cadbc3; background: #edf3e7; color: #397458; border-radius: 3px; }
.pillar-icon svg { width: 24px; height: 24px; stroke-width: 1.5; }
.pillars-list p { font-size: 15px; line-height: 1.8; color: #5e705e; }
.pledge-section { background: #242828; text-align: center; }
.pledge-section .chapter-label { color: #b0c7a5; }
.pledge-section img { width: 64px; height: 64px; margin: 32px auto 40px; }
.pledge-lines { max-width: 760px; margin: auto; }
.pledge-lines p { font-size: 22px; line-height: 1.7; color: #c6d5c0; margin-bottom: 24px; }
.pledge-lines .pledge-final { color: #dfefc9; font-family: Georgia, 'Times New Roman', serif; font-size: 46px; letter-spacing: -1px; line-height: 1.2; margin: 40px 0 0; }
.pledge-lines .pledge-final:last-child { margin-top: 12px; }
.invitation .public-button { margin-top: 32px; white-space: normal; }
.invitation svg { width: 20px; height: 20px; flex-shrink: 0; }
.manifesto-prose .manifesto-signature { font-size: 12px; color: #788573; margin-top: 32px; }
@media (max-width: 900px) { .manifesto-opening, .chapter-split { gap: 40px; grid-template-columns: .8fr 1.2fr; } .values-grid { grid-template-columns: 1fr 1fr; } .chapter-heading { gap: 36px; } .chapter-index { grid-template-columns: repeat(2, 1fr); } .manifesto-shell { width: calc(100% - 48px); } }
@media (max-width: 640px) { .manifesto-shell { width: calc(100% - 40px); } .manifesto-hero { padding-block: 30px 40px; } .manifesto-meta { align-items: flex-start; } .manifesto-meta > span { font-size: 10px; text-align: right; } .manifesto h1 { font-size: clamp(46px, 11vw, 68px); margin-block: 32px; letter-spacing: -.055em; } .manifesto-opening, .chapter-split { grid-template-columns: 1fr; gap: 30px; } .manifesto-emblem { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 20px; align-items: center; } .manifesto-emblem img { grid-row: span 2; } .manifesto-emblem > p { font-size: 12px; margin: 0; } .manifesto-emblem a { font-size: 11px; gap: 8px; padding: 0; margin: 0; } .manifesto-prose { font-size: 16px; } .chapter-index { gap: 4px 16px; } .chapter-index a { font-size: 11px; gap: 8px; } .manifesto-chapter { padding-block: 54px; } .manifesto h2 { font-size: 38px; letter-spacing: -1.5px; margin-top: 16px; } .chapter-heading { flex-direction: column; align-items: flex-start; gap: 24px; } .chapter-heading > p, .values-intro { max-width: none; } .beliefs-list li { grid-template-columns: 22px 1fr; gap: 12px; padding-block: 22px; } .beliefs-list p { font-size: 21px; } .change-list li { font-size: 16px; gap: 16px; } .chapter-illustration { max-width: 350px; margin-top: 24px; } .commitments-grid, .values-grid { grid-template-columns: 1fr; gap: 30px; } .values-intro { display: flex; align-items: center; gap: 20px; } .values-intro img { margin: 0; } .pillars-list > div { grid-template-columns: 22px 1fr; gap: 10px 14px; } .pillars-list p { grid-column: 2; } .pillars-list h3 { font-size: 28px; } .pledge-lines p { font-size: 18px; } .pledge-lines .pledge-final { font-size: 34px; } }
</style>
