<script setup lang="ts">
import { BookOpenIcon, Squares2X2Icon, UserGroupIcon, CheckBadgeIcon } from '@heroicons/vue/24/outline'
const icons = [BookOpenIcon, Squares2X2Icon, UserGroupIcon, CheckBadgeIcon]
</script>

<template>
  <section id="what-you-get" class="benefits-section" aria-labelledby="benefits-title">
    <header class="benefits-heading"><p class="benefits-eyebrow">What You Actually Get</p><h2 id="benefits-title">Most creatives don't fail for lack of talent. They fail for lack of access.</h2></header>
    <div class="benefits-list"><article class="benefit"><div class="benefit-label"><span class="benefit-icon"><component :is="icons[0]" aria-hidden="true" /></span><h3>Information</h3></div><div class="benefit-copy"><p>
                How do you price your work? Negotiate a contract? Build a personal brand? Actually get clients?
              </p><p>
                The answers exist, but they're scattered, gatekept, or buried in expensive courses. We bring that knowledge together. Members share what works. No gatekeeping. No fluff.
              </p></div></article><article class="benefit"><div class="benefit-label"><span class="benefit-icon"><component :is="icons[1]" aria-hidden="true" /></span><h3>Structure</h3></div><div class="benefit-copy"><p>
                Talent without structure goes nowhere. You know what you want to do. The path from here to there isn't clear.
              </p><p>
                The collective provides frameworks, accountability, and a clear path forward, with people who hold you to it.
              </p></div></article><article class="benefit"><div class="benefit-label"><span class="benefit-icon"><component :is="icons[2]" aria-hidden="true" /></span><h3>People</h3></div><div class="benefit-copy"><p>
                Your environment shapes you. If no one around you has done what you want to do, you'll doubt it's possible.
              </p><p>
                The collective surrounds you with people who are building, shipping, growing: people who've walked the path you're on, and people walking it beside you.
              </p></div></article><article class="benefit"><div class="benefit-label"><span class="benefit-icon"><component :is="icons[3]" aria-hidden="true" /></span><h3>Proof</h3></div><div class="benefit-copy"><p>
                Anyone can claim a skill. Almost nobody can prove one.
              </p><p>
                A verified record of what you've actually built, reviewed by the people accountable for the work. The thing that gets you priced on your skill instead of your postcode.
              </p></div></article></div>
    <p class="benefits-closing">Not more content. Not another course. Real access. Real structure. Real people. Real proof.</p>
  </section>
</template>

<style scoped>
.benefits-section { width: min(1280px, calc(100% - 96px)); margin-inline: auto; padding-block: 88px; color: #162323; scroll-margin-top: 100px; }
.benefits-eyebrow { font-size: 12px; letter-spacing: 1.7px; font-weight: 600; text-transform: uppercase; color: #53705e; }
.benefits-heading { margin-bottom: 44px; max-width: 810px; }
.benefits-heading h2 { font-size: clamp(34px, 3.6vw, 48px); font-weight: 550; letter-spacing: -1.7px; line-height: 1.15; margin-top: 20px; }
.benefit { display: grid; grid-template-columns: 1fr 1.65fr; gap: 70px; padding-block: 34px; border-top: 1px solid #d9e1dd; }
.benefit-label { display: flex; align-items: center; gap: 20px; }
.benefit-icon { display: grid; place-items: center; width: 52px; height: 52px; flex-shrink: 0; border: 1px solid #ccdccc; background: #eff5ea; color: #447c65; }
.benefit-icon svg { width: 25px; height: 25px; stroke-width: 1.5; }
.benefit h3 { font-size: 30px; font-weight: 500; letter-spacing: -.8px; }
.benefit-copy p { font-size: 16px; line-height: 1.85; color: #607166; margin: 0; }
.benefit-copy p:first-child { font-weight: 550; color: #2b493b; margin-bottom: 12px; }
.benefits-closing { font-size: 23px; line-height: 1.5; letter-spacing: -.5px; color: #305344; border-top: 1px solid #d9e1dd; padding-top: 32px; max-width: 760px; }
@media (max-width: 1100px) { .benefits-section { width: calc(100% - 64px); } .benefit { gap: 40px; } }
@media (max-width: 720px) { .benefits-section { width: calc(100% - 40px); padding-block: 58px; } .benefit { grid-template-columns: 1fr; gap: 20px; padding-block: 28px; } .benefit-icon { width: 42px; height: 42px; } .benefit h3 { font-size: 26px; } .benefits-closing { font-size: 20px; } }
</style>
