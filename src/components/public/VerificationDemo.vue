<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { CheckIcon, CheckBadgeIcon, DocumentCheckIcon, UserGroupIcon, ShieldCheckIcon, ArrowPathIcon, PauseIcon, PlayIcon } from '@heroicons/vue/24/outline'
import VerifiedSkillMark from './VerifiedSkillMark.vue'

const stages = [
  { label: 'Do the work', description: 'A real contribution starts the record.', status: 'Claimed', icon: DocumentCheckIcon },
  { label: 'Get reviewed', description: 'People who shared the work review your skills.', status: 'Claimed', icon: UserGroupIcon },
  { label: 'Earn a nomination', description: 'Enough qualifying evidence puts a skill forward.', status: 'Nominated', icon: ShieldCheckIcon },
  { label: 'SENPAI confirms', description: 'Your skill is verified, with the evidence behind it.', status: 'Verified', icon: CheckBadgeIcon },
]
const stage = ref(0)
const current = computed(() => stages[stage.value]!)
const root = ref<HTMLElement | null>(null)
const visible = ref(false)
const pageVisible = ref(true)
const paused = ref(false)
const reducedMotion = ref(false)
const playing = computed(() => visible.value && pageVisible.value && !paused.value && !reducedMotion.value)
let timer: ReturnType<typeof setTimeout> | undefined
let observer: IntersectionObserver | undefined
let motionQuery: MediaQueryList | undefined

function clearTimer() {
  if (timer !== undefined) clearTimeout(timer)
  timer = undefined
}
function schedule() {
  clearTimer()
  if (!playing.value) return
  timer = setTimeout(() => {
    stage.value = (stage.value + 1) % stages.length
    schedule()
  }, stage.value === 3 ? 5200 : 3200)
}
function selectStage(index: number) {
  paused.value = true
  stage.value = index
}
function togglePlayback() {
  if (paused.value && stage.value === 3) stage.value = 0
  paused.value = !paused.value
}
function replay() {
  stage.value = 0
  paused.value = reducedMotion.value
  schedule()
}
function updateVisibility() { pageVisible.value = !document.hidden }
function updateMotion() { reducedMotion.value = motionQuery?.matches ?? false }
watch(playing, schedule)
onMounted(() => {
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  updateMotion()
  updateVisibility()
  motionQuery.addEventListener('change', updateMotion)
  document.addEventListener('visibilitychange', updateVisibility)
  observer = new IntersectionObserver(([entry]) => { visible.value = entry?.isIntersecting ?? false }, { threshold: 0.2 })
  if (root.value) observer.observe(root.value)
})
onBeforeUnmount(() => {
  clearTimer()
  observer?.disconnect()
  motionQuery?.removeEventListener('change', updateMotion)
  document.removeEventListener('visibilitychange', updateVisibility)
})
</script>

<template>
  <div ref="root" class="verification-demo" :class="{ 'is-playing': playing }">
    <div class="demo-guide">
      <div class="demo-label">From contribution to credibility</div>
      <div class="stage-list" aria-label="Explore the verification process">
        <button v-for="(item, index) in stages" :key="item.label" type="button" :class="{ active: stage === index, complete: stage > index }" :aria-pressed="stage === index" aria-controls="skill-record-demo" @click="selectStage(index)">
          <span class="stage-number"><CheckIcon v-if="stage > index" /><span v-else>0{{ index + 1 }}</span></span>
          <span class="stage-copy"><strong>{{ item.label }}</strong><span>{{ item.description }}</span></span>
        </button>
      </div>
      <div class="playback-controls">
        <button v-if="!reducedMotion" type="button" :aria-pressed="!paused" @click="togglePlayback"><PlayIcon v-if="paused" /><PauseIcon v-else />{{ paused ? 'Play animation' : 'Pause animation' }}</button>
        <button type="button" @click="replay"><ArrowPathIcon />Replay</button>
      </div>
    </div>

    <div id="skill-record-demo" class="record-stage" :aria-live="paused || reducedMotion ? 'polite' : 'off'" aria-atomic="true">
      <div class="record-topline"><span>Skill record / Example</span><span>0{{ stage + 1 }} — 04</span></div>
      <div class="skill-card" :class="{ verified: stage === 3 }">
        <div class="skill-heading"><span class="skill-monogram" aria-hidden="true">Aa</span><span class="skill-status" :class="{ earned: stage === 3 }"><CheckBadgeIcon v-if="stage === 3" />{{ current.status }}</span></div>
        <h3>Interface design</h3>
        <p class="skill-subtitle">The work behind the skill.</p>
        <div class="evidence-row" :class="{ revealed: stage >= 0 }"><DocumentCheckIcon /><div><strong>Contribution delivered</strong><span>A working interface and prototype</span></div><CheckIcon class="evidence-check" /></div>
        <div class="evidence-row" :class="{ revealed: stage >= 1 }"><UserGroupIcon /><div><strong>Reviewed by collaborators</strong><span>Feedback linked to the work</span></div><CheckIcon v-if="stage >= 1" class="evidence-check" /></div>
        <div class="evidence-row" :class="{ revealed: stage >= 2 }"><ShieldCheckIcon /><div><strong>Verification standard met</strong><span>Qualifying reviews across contributions</span></div><CheckIcon v-if="stage >= 2" class="evidence-check" /></div>
        <div class="verification-stamp" :class="{ confirmed: stage === 3 }">
          <VerifiedSkillMark v-if="stage === 3" skill="Interface design" />
          <template v-else><CheckBadgeIcon /><div><strong>Building the evidence</strong><span>Each reviewed contribution counts.</span></div></template>
        </div>
      </div>
      <div class="record-progress" aria-hidden="true"><span v-for="index in 4" :key="index" :class="{ filled: stage >= index - 1 }" /></div>
      <p class="example-note">Illustration of the process. Verification is earned across qualifying work and reviews.</p>
    </div>
  </div>
</template>

<style scoped>
.verification-demo { display: grid; grid-template-columns: .9fr 1.1fr; border: 1px solid #c9d8ce; background: #fafaf8; }
.demo-guide { padding: 38px; }
.demo-label, .record-topline { font-size: 12px; letter-spacing: 1px; text-transform: uppercase; color: #52675b; }
.stage-list { margin-top: 30px; }
.stage-list button { display: flex; align-items: flex-start; gap: 17px; width: 100%; padding: 23px 0; text-align: left; background: none; border: 0; border-bottom: 1px solid #d1dcd1; color: #69786d; cursor: pointer; font: inherit; }
.stage-number { display: grid; place-items: center; width: 36px; height: 36px; flex: 0 0 36px; border: 1px solid #b7c9bc; border-radius: 50%; font-size: 12px; transition: background .4s, color .4s; }
.active .stage-number { background: #267d7c; color: #fff; border-color: #267d7c; }
.complete .stage-number { background: #c3e7d9; color: #245c4b; border-color: #a8cdbd; }
.stage-copy strong { display: block; font-size: 20px; font-weight: 550; color: #1c3629; }
.stage-copy > span { display: block; font-size: 14px; line-height: 1.65; margin-top: 7px; max-width: 300px; }
.active .stage-copy strong { color: #116d5c; }
.playback-controls { display: flex; flex-wrap: wrap; gap: 20px; margin-top: 26px; }
.playback-controls button { display: inline-flex; align-items: center; gap: 8px; font: inherit; font-size: 14px; padding: 10px 0; color: #254c3c; background: transparent; border: 0; cursor: pointer; }
button:focus-visible { outline: 3px solid #237c6e; outline-offset: 5px; }
svg { width: 21px; height: 21px; flex-shrink: 0; }
.record-stage { padding: 30px 38px; background: #eef6f6; background-image: radial-gradient(#c1d4d4 1px, transparent 1px); background-size: 18px 18px; min-width: 0; }
.record-topline { display: flex; justify-content: space-between; gap: 20px; margin-bottom: 28px; }
.skill-card { padding: 28px; background: #fff; border: 1px solid #b9cebf; box-shadow: 8px 10px 0 #bed3c5; transition: border-color .5s, box-shadow .5s; }
.skill-card.verified { border-color: #247e68; box-shadow: 8px 10px 0 #a7d6bf; }
.skill-heading { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.skill-monogram { width: 46px; height: 46px; display: grid; place-items: center; background: #e5ece2; font-size: 25px; font-family: Georgia, serif; color: #314c36; }
.skill-status { display: inline-flex; align-items: center; gap: 6px; padding: 7px 10px; background: #edf0e8; font-size: 12px; color: #52614e; }
.skill-status.earned { color: #196141; background: #d0eedc; }
h3 { font-size: 30px; line-height: 1.2; letter-spacing: -.8px; font-weight: 550; margin: 20px 0 0; }
.skill-subtitle { font-size: 14px; color: #647665; margin: 6px 0 25px; }
.evidence-row { display: flex; align-items: center; gap: 12px; padding: 17px 0; border-top: 1px solid #dce4d9; opacity: .3; transform: translateY(3px); transition: opacity .6s, transform .6s; }
.evidence-row.revealed { opacity: 1; transform: translateY(0); }
.evidence-row > svg { color: #478273; }
.evidence-row strong { display: block; font-size: 14px; font-weight: 550; }
.evidence-row span { display: block; color: #677664; font-size: 12px; line-height: 1.6; margin-top: 4px; }
.evidence-check { margin-left: auto; }
.revealed .evidence-check { animation: check-arrives .5s ease both; }
.verification-stamp { margin-top: 18px; padding: 18px 14px; display: flex; align-items: center; gap: 12px; background: #eef2e9; color: #667762; transition: background .6s, color .6s; }
.verification-stamp > svg { width: 35px; height: 35px; }
.verification-stamp strong { display: block; font-size: 12px; letter-spacing: 1px; }
.verification-stamp span { display: block; font-size: 12px; margin-top: 4px; }
.verification-stamp.confirmed { background: #1d5744; color: #fff; }
.confirmed > svg { animation: badge-arrives .6s ease both; }
.record-progress { display: flex; gap: 8px; margin-top: 30px; }
.record-progress span { height: 4px; flex: 1; background: #b7cdbc; transition: background .5s; }
.record-progress .filled { background: #277c66; }
.example-note { font-size: 12px; line-height: 1.6; color: #496252; margin: 16px 0 0; }
@keyframes check-arrives { from { opacity: 0; transform: scale(.5); } to { opacity: 1; transform: scale(1); } }
@keyframes badge-arrives { 0% { transform: scale(.5) rotate(-15deg); } 70% { transform: scale(1.15); } 100% { transform: scale(1); } }
@media (max-width: 900px) { .demo-guide, .record-stage { padding: 26px; } .skill-card { padding: 20px; } .stage-copy strong { font-size: 18px; } }
@media (max-width: 640px) { .verification-demo { grid-template-columns: 1fr; } .demo-guide { padding: 26px 22px; } .stage-list { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 20px; } .stage-list button { padding: 14px 0; gap: 10px; } .stage-copy strong { font-size: 14px; } .stage-copy > span { display: none; } .stage-number { width: 28px; height: 28px; flex-basis: 28px; } .record-stage { padding: 26px 22px; } .skill-card { padding: 22px 18px; } .evidence-row { gap: 9px; } h3 { font-size: 27px; } }
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; transition: none !important; } }
</style>
