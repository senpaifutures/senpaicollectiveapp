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
        <div class="talent-profile-summary">
          <div class="talent-portrait">
            <img src="/images/verification-preview-portraits.png" :alt="`AI-generated portrait of a fictional ${profile.role.toLowerCase()}`" :style="{ left: `${index * -100}%` }" width="1536" height="1024" loading="lazy" />
          </div>
          <div class="talent-profile-identity">
            <span class="profile-example-label">Illustrative profile</span>
            <p>{{ profile.role }}</p>
          </div>
        </div>
        <div class="talent-preview-details">
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
.talent-preview-card { min-width: 0; padding: 20px; border: 1px solid #d4ddda; background: #fff; display: flex; flex-direction: column; }
.talent-profile-summary { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
.talent-portrait { width: 72px; flex: 0 0 72px; aspect-ratio: 4 / 5; position: relative; overflow: hidden; background: #e8e7e4; }
.talent-portrait img { position: absolute; top: 0; width: 300%; max-width: none; height: 100%; object-fit: cover; object-position: center 8%; filter: grayscale(1); transition: filter .3s ease; }
.talent-preview-card:hover .talent-portrait img { filter: grayscale(0); }
.profile-example-label { display: block; font-size: 10px; line-height: 1.6; color: #63706c; }
.talent-profile-identity { min-width: 0; }
.talent-profile-identity > p { margin: 7px 0 0; font-size: 16px; line-height: 1.45; font-weight: 550; color: #3a4540; }
.talent-preview-details { margin-top: auto; }
.talent-preview-details :deep(.verified-skill-mark) { display: flex; }
.talent-preview-caption { max-width: 710px; font-size: 14px; line-height: 1.8; color: #5e6b65; margin: 22px 0 0; }
@media (max-width: 1000px) { .talent-preview-grid { gap: 16px; } .talent-preview-card { padding: 16px; } .talent-profile-summary { gap: 12px; } .talent-portrait { width: 56px; flex-basis: 56px; } .talent-profile-identity > p { font-size: 14px; } .talent-preview-details :deep(.verified-skill-mark) { padding: 12px; gap: 8px; } }
@media (max-width: 720px) { .talent-preview-heading { display: block; } .preview-disclosure { max-width: none; margin-top: 16px; } .talent-preview-grid { grid-template-columns: 1fr; gap: 16px; } .talent-preview-card { padding: 20px; } .talent-portrait { width: 64px; flex-basis: 64px; } .talent-profile-identity > p { font-size: 16px; } }
@media (prefers-reduced-motion: reduce) { .talent-portrait img { transition: none; } }
</style>
