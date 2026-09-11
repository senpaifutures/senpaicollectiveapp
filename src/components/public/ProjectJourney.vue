<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowRightIcon, CheckIcon, LightBulbIcon, PaintBrushIcon, CodeBracketIcon, PencilSquareIcon, ArrowUpRightIcon } from '@heroicons/vue/24/outline'

const selected = ref<'member' | 'collective'>('member')
const examples = {
  member: { title: 'Your idea. A team around it.', description: 'Bring an idea to the collective. Build it with people whose skills complement yours.', project: 'A tool for local makers', brief: 'Help independent makers find collaborators.', tags: ['Community', 'Product'], origin: 'An idea from a member' },
  collective: { title: 'Shared problems. Collective effort.', description: 'Build the products, platforms, and creative infrastructure initiated by SENPAI.', project: 'A shared learning library', brief: 'Make practical knowledge easier to find and share.', tags: ['Learning', 'Infrastructure'], origin: 'An initiative from SENPAI' },
}
const example = computed(() => examples[selected.value])
const roles = [{ name: 'Design', task: 'Shape the experience', icon: PaintBrushIcon }, { name: 'Build', task: 'Make it work', icon: CodeBracketIcon }, { name: 'Story', task: 'Give it a voice', icon: PencilSquareIcon }]
</script>

<template>
  <div class="project-demo">
    <div class="project-switch" aria-label="Explore types of shared project">
      <button type="button" :class="{ selected: selected === 'member' }" :aria-pressed="selected === 'member'" aria-controls="project-example" @click="selected = 'member'">Member projects <ArrowUpRightIcon /></button>
      <button type="button" :class="{ selected: selected === 'collective' }" :aria-pressed="selected === 'collective'" aria-controls="project-example" @click="selected = 'collective'">Collective projects <ArrowUpRightIcon /></button>
    </div>
    <div id="project-example" aria-live="polite" aria-atomic="true">
      <div class="project-intro"><h3>{{ example.title }}</h3><p>{{ example.description }}</p></div>
      <div :key="selected" class="journey-canvas">
        <article class="journey-panel idea-panel">
          <div class="panel-label"><span>01 / The idea</span><LightBulbIcon /></div>
          <div class="brief-card"><span class="brief-label">Project brief</span><h4>{{ example.project }}</h4><p>{{ example.brief }}</p><div class="project-tags"><span v-for="tag in example.tags" :key="tag">{{ tag }}</span></div></div>
          <p class="panel-caption">{{ example.origin }}</p>
        </article>
        <div class="journey-arrow" aria-hidden="true"><ArrowRightIcon /></div>
        <article class="journey-panel team-panel">
          <div class="panel-label"><span>02 / The team</span><span>Different skills. One brief.</span></div>
          <div class="team-roster"><div v-for="role in roles" :key="role.name" class="team-seat"><span class="role-icon"><component :is="role.icon" /></span><div><strong>{{ role.name }}</strong><span>{{ role.task }}</span></div><CheckIcon class="role-check" /></div></div>
          <p class="panel-caption">Everyone owns a part of the work.</p>
        </article>
        <div class="journey-arrow" aria-hidden="true"><ArrowRightIcon /></div>
        <article class="journey-panel shipped-panel">
          <div class="panel-label"><span>03 / The outcome</span><CheckIcon /></div>
          <div class="release-card"><span class="release-mark"><CheckIcon /></span><h4>Built together.<br />Ready for the world.</h4><div class="release-check"><CheckIcon />First release</div><div class="release-check"><CheckIcon />Team credited</div><div class="release-check"><CheckIcon />Contributions recorded</div></div>
          <p class="panel-caption">Your work. Your name on the record.</p>
        </article>
      </div>
      <p class="example-caption">Illustrative project journey · The people and roles depend on what you’re building.</p>
    </div>
  </div>
</template>

<style scoped>
.project-switch { display: flex; gap: 12px; flex-wrap: wrap; }
.project-switch button { display: inline-flex; align-items: center; gap: 20px; padding: 15px 20px; font: inherit; font-size: 14px; color: #264c3c; background: transparent; border: 1px solid #bdcfc1; cursor: pointer; transition: background .2s, color .2s; }
.project-switch button.selected { background: #242828; color: white; border-color: #242828; }
button:focus-visible { outline: 3px solid #28816e; outline-offset: 5px; }
svg { width: 20px; height: 20px; flex-shrink: 0; }
.project-intro { display: flex; align-items: center; justify-content: space-between; gap: 36px; margin: 28px 0; }
h3 { font-size: 28px; font-weight: 550; line-height: 1.2; letter-spacing: -.7px; margin: 0; }
.project-intro p { font-size: 16px; line-height: 1.7; color: #5c6e61; max-width: 460px; margin: 0; }
.journey-canvas { display: grid; grid-template-columns: minmax(0, 1fr) 36px minmax(0, 1fr) 36px minmax(0, 1fr); align-items: stretch; }
.journey-panel { min-width: 0; padding: 24px 20px; background: #fafaf8; border: 1px solid #cfdbcf; animation: panel-arrives .5s ease both; }
.team-panel { background: #f1f5f5; animation-delay: .12s; }
.shipped-panel { background: #242828; color: #f3faf2; border-color: #242828; animation-delay: .24s; }
.panel-label { min-height: 35px; display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; font-size: 12px; }
.panel-label > span:first-child { text-transform: uppercase; letter-spacing: 1px; }
.team-panel .panel-label > span:last-child { display: none; }
.brief-card { padding: 22px 18px; min-height: 255px; background: #fff; border: 1px solid #cdd9c9; box-shadow: 4px 5px 0 #d1ddcf; transform: rotate(-2deg); }
.brief-label { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #72826c; }
h4 { font-size: 25px; line-height: 1.2; letter-spacing: -.6px; font-weight: 550; margin: 20px 0 0; }
.brief-card p { font-size: 14px; line-height: 1.6; color: #637461; margin: 16px 0 22px; }
.project-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.project-tags span { padding: 5px 8px; font-size: 12px; background: #e7eee0; color: #425b3e; }
.team-roster { min-height: 255px; display: flex; flex-direction: column; gap: 12px; justify-content: center; }
.team-seat { display: flex; align-items: center; gap: 10px; background: #fff; padding: 16px 12px; border: 1px solid #c2d2c5; }
.role-icon { display: grid; place-items: center; width: 36px; height: 36px; flex: 0 0 36px; border-radius: 50%; background: #e8eccc; color: #3e5c30; }
.team-seat:nth-child(2) .role-icon { background: #cce7e1; color: #236b61; }
.team-seat:nth-child(3) .role-icon { background: #edddc9; color: #725338; }
.team-seat strong { display: block; font-size: 14px; font-weight: 550; }
.team-seat div > span { display: block; font-size: 12px; color: #687765; line-height: 1.5; margin-top: 3px; }
.role-check { margin-left: auto; width: 16px; color: #458371; }
.release-card { min-height: 255px; padding: 12px 0; }
.release-mark { display: grid; place-items: center; width: 40px; height: 40px; border-radius: 50%; background: #a4e0b6; color: #174c30; }
.release-card h4 { margin-top: 16px; margin-bottom: 22px; }
.release-check { display: flex; align-items: center; gap: 9px; font-size: 14px; margin-top: 10px; color: #cde3cf; }
.release-check svg { width: 16px; height: 16px; color: #a2dba9; }
.panel-caption { font-size: 12px; line-height: 1.6; margin: 22px 0 0; color: #586e59; }
.shipped-panel .panel-caption { color: #b7d4bf; }
.journey-arrow { display: grid; place-items: center; color: #407a65; }
.example-caption { color: #657666; font-size: 12px; line-height: 1.7; margin: 18px 0 0; }
@keyframes panel-arrives { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@media (max-width: 1100px) { .journey-canvas { grid-template-columns: minmax(0, 1fr) 22px minmax(0, 1fr) 22px minmax(0, 1fr); } .journey-panel { padding: 20px 14px; } .team-seat { gap: 8px; padding-inline: 8px; } .role-check { display: none; } .brief-card { padding: 20px 14px; } h4 { font-size: 23px; } }
@media (max-width: 760px) { .project-intro { flex-direction: column; align-items: flex-start; gap: 14px; } .journey-canvas { grid-template-columns: 1fr; max-width: 520px; margin-inline: auto; } .journey-arrow { height: 38px; transform: rotate(90deg); } .journey-panel { padding: 24px; } .brief-card, .team-roster, .release-card { min-height: auto; } .team-panel .panel-label > span:last-child { display: block; } .panel-label { margin-bottom: 14px; } .brief-card { transform: rotate(-1deg); padding: 24px; } .release-card { padding-top: 0; } .role-check { display: block; } .project-switch { gap: 8px; } .project-switch button { flex: 1; justify-content: space-between; padding: 14px 12px; gap: 8px; } }
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; transition: none !important; } }
</style>
