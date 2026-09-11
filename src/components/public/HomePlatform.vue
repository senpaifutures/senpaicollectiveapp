<script setup lang="ts">
import { UsersIcon, Squares2X2Icon, CheckBadgeIcon, BriefcaseIcon } from '@heroicons/vue/24/outline'

const features = [
  { title: 'Find your collaborators', tools: 'Member directory · Circles', description: 'Explore member profiles and skills. Join circles around shared interests and meet people whose strengths complement yours.', icon: UsersIcon },
  { title: 'Put shared ambition to work', tools: 'Projects · Tasks', description: 'Find projects to contribute to, take on tasks, and keep the work moving with your team.', icon: Squares2X2Icon },
  { title: 'Build a record of your ability', tools: 'Your profile · Skill verification', description: 'Build your profile around your skills, and grow your verified record through reviewed contributions.', icon: CheckBadgeIcon },
  { title: 'Find your next opportunity', tools: 'Job board · Applications', description: 'Explore available roles, apply to opportunities, and track your applications in one place.', icon: BriefcaseIcon },
]
</script>

<template>
  <section class="platform-section" aria-labelledby="platform-title">
    <header class="platform-heading">
      <p class="platform-eyebrow">Inside the platform</p>
      <h2 id="platform-title">The community is the people.<br /><em>The platform helps us build.</em></h2>
      <p>Once you’re approved, your member workspace brings the people, projects, opportunities, and record of your work together. It gives our shared ambition a place to become action.</p>
    </header>
    <div class="platform-features">
      <article v-for="feature in features" :key="feature.title" class="platform-feature">
        <component :is="feature.icon" class="platform-icon" aria-hidden="true" />
        <div>
          <p class="platform-tools">{{ feature.tools }}</p>
          <h3>{{ feature.title }}</h3>
          <p class="platform-description">{{ feature.description }}</p>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.platform-section { width: min(1280px, calc(100% - 96px)); margin-inline: auto; padding-block: 88px; color: #242424; }
.platform-heading { max-width: 810px; }
.platform-eyebrow { color: #626262; font-size: 12px; line-height: 1.6; letter-spacing: 1.7px; text-transform: uppercase; font-weight: 600; }
.platform-heading h2 { margin-top: 20px; font-size: clamp(32px, 3.6vw, 48px); font-weight: 550; letter-spacing: -1.7px; line-height: 1.18; }
.platform-heading em { font-family: Georgia, 'Times New Roman', serif; font-weight: 400; color: #267d7c; }
.platform-heading > p:last-child { max-width: 690px; font-size: 16px; line-height: 1.85; color: #626262; margin-top: 24px; }
.platform-features { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); margin-top: 40px; border-top: 1px solid #dedede; }
.platform-feature { display: flex; gap: 22px; align-items: flex-start; padding: 30px 32px 30px 0; border-bottom: 1px solid #dedede; }
.platform-feature:nth-child(even) { padding-left: 32px; padding-right: 0; }
.platform-icon { width: 26px; height: 26px; flex-shrink: 0; color: #267d7c; margin-top: 3px; stroke-width: 1.5; }
.platform-tools { color: #737373; font-size: 12px; line-height: 1.7; }
.platform-feature h3 { font-size: 22px; line-height: 1.3; font-weight: 550; letter-spacing: -.5px; margin-top: 10px; }
.platform-description { color: #626262; font-size: 15px; line-height: 1.85; margin-top: 14px; max-width: 460px; }
@media (max-width: 1100px) { .platform-section { width: calc(100% - 64px); } }
@media (max-width: 720px) { .platform-section { width: calc(100% - 40px); padding-block: 58px; } .platform-features { grid-template-columns: 1fr; margin-top: 28px; } .platform-feature, .platform-feature:nth-child(even) { padding: 26px 0; gap: 18px; } }
</style>
