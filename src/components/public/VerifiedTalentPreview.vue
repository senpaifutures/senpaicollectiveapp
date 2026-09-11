<script setup lang="ts">
import VerifiedSkillMark from './VerifiedSkillMark.vue'

// Roles and skills are drawn from the real skill catalogue, so the sample
// badges show marks the platform can actually issue.
const profiles = [
  { role: 'Systems architect', skill: 'Systems architecture' },
  { role: 'Design engineer', skill: 'Design systems' },
  { role: 'Backend systems architect', skill: 'API design' },
]
</script>

<template>
  <div class="talent-preview" aria-labelledby="talent-preview-title">
    <header class="talent-preview-heading">
      <div><p class="preview-eyebrow">The mark we’re building</p><h3 id="talent-preview-title">A skill worth putting our name behind.</h3></div>
      <p class="preview-disclosure">Concept preview: fictional portraits and sample badges. These are not verified members.</p>
    </header>
    <div class="talent-preview-grid">
      <article v-for="(profile, index) in profiles" :key="profile.skill" class="talent-preview-card">
        <div class="talent-portrait">
          <img src="/illustrations/verified-talent-portraits.svg" :alt="`Fictional ${profile.role.toLowerCase()} portrait`" :style="{ left: `${index * -100}%` }" width="1536" height="384" loading="lazy" />
          <span class="profile-example-label">Illustrative profile</span>
        </div>
        <div class="talent-preview-details">
          <p>{{ profile.role }}</p>
          <VerifiedSkillMark :skill="profile.skill" />
        </div>
      </article>
    </div>
    <p class="talent-preview-caption">Our ambition is for this mark to carry weight wherever you take your work. Its value comes from the standard behind it.</p>
  </div>
</template>

<style scoped>
.talent-preview { padding-block: 38px 48px; }
.talent-preview-heading { display: flex; justify-content: space-between; align-items: end; gap: 36px; margin-bottom: 24px; }
.preview-eyebrow { font-size: 11px; line-height: 1.6; font-weight: 600; letter-spacing: 1.4px; text-transform: uppercase; color: #63706c; margin: 0 0 12px; }
.talent-preview-heading h3 { font-size: clamp(25px, 2.6vw, 34px); line-height: 1.2; font-weight: 550; letter-spacing: -.8px; margin: 0; color: #242828; }
.preview-disclosure { max-width: 300px; font-size: 12px; line-height: 1.8; color: #65706c; margin: 0; }
.talent-preview-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; }
.talent-preview-card { min-width: 0; border: 1px solid #d4ddda; background: #fff; }
.talent-portrait { aspect-ratio: 4 / 3; position: relative; overflow: hidden; background: #e8e7e4; }
.talent-portrait img { position: absolute; top: 0; width: 300%; max-width: none; height: 100%; object-fit: cover; object-position: center 30%; filter: grayscale(1); transition: filter .3s ease; }
.talent-preview-card:hover .talent-portrait img { filter: grayscale(0); }
.profile-example-label { position: absolute; top: 12px; left: 12px; font-size: 10px; line-height: 1.5; padding: 5px 8px; background: rgb(255 255 255 / 94%); color: #434b47; border: 1px solid #d8deda; }
.talent-preview-details { padding: 22px; }
.talent-preview-details > p { margin: 0 0 14px; font-size: 15px; font-weight: 550; color: #3a4540; }
.talent-preview-details :deep(.verified-skill-mark) { display: flex; }
.talent-preview-caption { max-width: 710px; font-size: 14px; line-height: 1.8; color: #5e6b65; margin: 22px 0 0; }
@media (max-width: 900px) { .talent-preview-grid { gap: 16px; } .talent-preview-details { padding: 16px; } .talent-preview-details :deep(.verified-skill-mark) { padding: 12px; gap: 8px; } }
@media (max-width: 720px) { .talent-preview-heading { display: block; } .preview-disclosure { max-width: none; margin-top: 16px; } .talent-preview-grid { grid-template-columns: 1fr; gap: 24px; } .talent-portrait { aspect-ratio: 4 / 3; } .talent-preview-details { padding: 22px; } }
@media (prefers-reduced-motion: reduce) { .talent-portrait img { transition: none; } }
</style>
