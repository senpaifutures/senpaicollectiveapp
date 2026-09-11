<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { Role, Skill } from '@/types'
import SkillStatusChips from './SkillStatusChips.vue'
import ReviewsReceived from './ReviewsReceived.vue'
import {
  UserCircleIcon,
  PencilIcon,
  GlobeAltIcon,
  LinkIcon,
  AcademicCapIcon,
  BriefcaseIcon
} from '@heroicons/vue/24/outline'
import {
  ShieldCheckIcon,
  StarIcon,
  SparklesIcon as SparklesSolidIcon
} from '@heroicons/vue/24/solid'

// One shared presentational layout for "a member's profile" — used for both
// your own profile (full data, editable) and another member's profile in the
// directory (public-safe subset, read-only). Sections simply don't render
// when their data isn't passed in, so the two callers can differ in content
// without forking the template.
interface Props {
  fullName?: string
  photoUrl?: string
  isOGMember?: boolean
  roles?: Role[]
  mbti?: string
  subtitle?: string
  experienceLabel?: string
  memberSince?: string
  editHref?: string
  goal?: string
  bio?: string
  schoolLine?: string
  skills?: Skill[]
  primarySkillId?: number
  recentWork?: string
  workLine?: string
  uniqueView?: string
  links?: { label: string; url: string }[]
  logisticsLine?: string
  memberId?: string
}

const props = withDefaults(defineProps<Props>(), {
  roles: () => [],
  skills: () => [],
  links: () => []
})

const initials = computed(() => {
  const name = props.fullName?.trim()
  if (!name) return '?'
  const parts = name.split(/\s+/)
  return parts.length > 1 ? ((parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "")).toUpperCase() : (parts[0]?.slice(0, 2).toUpperCase() ?? '?')
})

const getRoleStyle = (roleName: string) => {
  switch (roleName.toLowerCase()) {
    case 'admin':
      return { bg: 'bg-red-50', text: 'text-red-700', icon: ShieldCheckIcon, iconColor: 'text-red-500' }
    case 'scout':
      return { bg: 'bg-amber-50', text: 'text-amber-700', icon: StarIcon, iconColor: 'text-amber-500' }
    default:
      return { bg: 'bg-senpai-50', text: 'text-senpai-700', icon: SparklesSolidIcon, iconColor: 'text-senpai-500' }
  }
}

const hasAnyContent = computed(() =>
  !!props.bio || !!props.recentWork || !!props.uniqueView || !!props.goal ||
  props.skills!.length > 0 || props.links!.length > 0
)
</script>

<template>
  <div class="member-profile-display">
    <header class="profile-identity-panel">
      <div class="profile-identity">
        <div class="profile-portrait"><img v-if="photoUrl" :src="photoUrl" :alt="fullName" /><span v-else-if="fullName">{{ initials }}</span><UserCircleIcon v-else /></div>
        <div class="profile-identity-copy"><h1>{{ fullName || 'Member profile' }}</h1><p v-if="subtitle" class="profile-subtitle">{{ subtitle }}</p><p v-if="memberSince" class="profile-membership">{{ memberSince }}</p>
          <div class="profile-badges"><span v-if="isOGMember" class="profile-badge bg-senpai-50 text-senpai-700"><SparklesSolidIcon />OG member</span><span v-for="role in roles" :key="role.id" :class="['profile-badge', getRoleStyle(role.name).bg, getRoleStyle(role.name).text]"><component :is="getRoleStyle(role.name).icon" />{{ role.name.charAt(0).toUpperCase() + role.name.slice(1) }}</span><span v-if="mbti" class="profile-badge bg-gray-100 text-gray-600">{{ mbti }}</span></div>
        </div>
        <RouterLink v-if="editHref" :to="editHref" class="profile-edit-action"><PencilIcon />Edit profile</RouterLink>
      </div>
    </header>
    <div class="profile-content-grid">
      <div class="profile-main">
        <section v-if="goal" class="profile-goal"><h2>What I’m working toward</h2><p>{{ goal }}</p></section>
        <section v-if="bio || schoolLine" class="profile-section"><h2>About</h2><p v-if="bio" class="profile-body">{{ bio }}</p><p v-if="schoolLine" class="profile-context"><AcademicCapIcon />{{ schoolLine }}</p></section>
        <section v-if="recentWork || workLine" class="profile-section"><h2>What I’m building</h2><p v-if="recentWork" class="profile-body">{{ recentWork }}</p><p v-if="workLine" class="profile-context"><BriefcaseIcon />{{ workLine }}</p></section>
        <section v-if="uniqueView" class="profile-section"><h2>My perspective</h2><p class="profile-body">{{ uniqueView }}</p></section>
        <div v-if="memberId" class="profile-record"><SkillStatusChips :member-id="memberId" /><ReviewsReceived :member-id="memberId" /></div>
        <section v-if="!hasAnyContent" class="profile-empty"><UserCircleIcon /><h2>{{ editHref ? 'Your profile is just getting started' : 'More about this member, soon' }}</h2><p>{{ editHref ? "Add a bio, your skills, and a few links so the collective can see what you're about." : "This member hasn't filled in their profile yet." }}</p><RouterLink v-if="editHref" :to="editHref" class="profile-edit-action"><PencilIcon />Edit your profile</RouterLink></section>
      </div>
      <aside v-if="skills.length || links.length || experienceLabel || logisticsLine" class="profile-details">
        <section v-if="skills.length || experienceLabel" class="profile-section"><h2>Skills & experience</h2><p v-if="experienceLabel" class="profile-experience">{{ experienceLabel }}<small>Self-described experience</small></p><div class="profile-skills"><span v-for="skill in skills" :key="skill.id" :class="['profile-skill', { 'profile-primary-skill': skill.id === primarySkillId }]">{{ skill.name }}<small v-if="skill.id === primarySkillId">Primary</small></span></div></section>
        <section v-if="links.length" class="profile-section"><h2>Portfolio & links</h2><div class="profile-links"><a v-for="link in links" :key="link.url" :href="link.url" target="_blank" rel="noopener noreferrer"><GlobeAltIcon v-if="link.label === 'Portfolio'" /><LinkIcon v-else /><span>{{ link.label }}</span><span aria-hidden="true">↗</span></a></div></section>
        <section v-if="logisticsLine" class="profile-section"><h2>A little more about me</h2><p class="profile-body">{{ logisticsLine }}</p></section>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.member-profile-display { width: 100%; container-type: inline-size; color: #344054; }
.profile-identity-panel { background: #fff; border: 1px solid #e3e9ef; border-radius: 12px; overflow: hidden; }
.profile-identity-panel::before { content: ''; display: block; height: 7px; background: #b7dfdf; }
.profile-identity { padding: 30px; display: flex; align-items: flex-start; gap: 22px; }
.profile-portrait { display: grid; place-items: center; width: 88px; height: 88px; flex: 0 0 88px; border-radius: 20px; background: #eaf4f5; color: #397d88; overflow: hidden; }
.profile-portrait img { width: 100%; height: 100%; object-fit: cover; }
.profile-portrait span { font-size: 28px; font-weight: 600; }
.profile-portrait svg { width: 45px; height: 45px; }
.profile-identity-copy { min-width: 0; flex: 1; }
.profile-identity h1 { font-size: 27px; line-height: 1.2; letter-spacing: -.65px; font-weight: 650; overflow-wrap: anywhere; }
.profile-subtitle { font-size: 13px; line-height: 1.7; color: #607086; margin-top: 8px; }
.profile-membership { font-size: 11px; line-height: 1.7; color: #738195; margin-top: 5px; }
.profile-badges { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 13px; }
.profile-badge { display: inline-flex; align-items: center; gap: 5px; font-size: 10px; font-weight: 550; padding: 4px 8px; border-radius: 5px; }
.profile-badge svg { width: 12px; height: 12px; }
.profile-edit-action { display: inline-flex; align-items: center; justify-content: center; gap: 7px; padding: 9px 12px; font-size: 12px; font-weight: 550; white-space: nowrap; color: #4f6074; background: #fff; border: 1px solid #d7e0e8; border-radius: 7px; }
.profile-edit-action svg { width: 15px; height: 15px; }
.profile-edit-action:hover { background: #f6f9fb; }
.profile-content-grid { display: grid; grid-template-columns: minmax(0, 1fr) 280px; gap: 22px; margin-top: 22px; align-items: start; }
.profile-main, .profile-details { display: grid; gap: 18px; min-width: 0; }
.profile-main:only-child { grid-column: 1 / -1; }
.profile-section, .profile-empty { border: 1px solid #e3e9ef; background: #fff; padding: 24px; border-radius: 10px; min-width: 0; }
.member-profile-display h2 { font-size: 13px; line-height: 1.5; font-weight: 650; color: #3b485e; margin-bottom: 14px; }
.profile-body { font-size: 13px; line-height: 1.85; color: #5c6c82; white-space: pre-line; overflow-wrap: anywhere; }
.profile-context { display: flex; align-items: flex-start; gap: 8px; margin-top: 18px; color: #6d7e90; font-size: 11px; line-height: 1.7; }
.profile-context svg { width: 16px; height: 16px; flex-shrink: 0; }
.profile-goal { background: #edf7f7; border: 1px solid #d5e9e8; border-radius: 10px; padding: 22px 24px; }
.profile-goal h2 { color: #437f81; font-size: 11px; margin-bottom: 8px; }
.profile-goal p { color: #375d69; font-size: 16px; line-height: 1.65; overflow-wrap: anywhere; }
.profile-experience { font-size: 12px; color: #566579; padding-bottom: 16px; margin-bottom: 16px; border-bottom: 1px solid #edf0f4; }
.profile-experience small { display: block; font-size: 10px; color: #738195; margin-top: 4px; }
.profile-skills { display: flex; flex-wrap: wrap; gap: 7px; }
.profile-skill { display: inline-flex; flex-wrap: wrap; gap: 6px; align-items: center; font-size: 11px; line-height: 1.6; padding: 5px 8px; border: 1px solid #e6ebf0; background: #f8fafc; border-radius: 5px; color: #5c6c82; }
.profile-primary-skill { border-color: #c5e4e2; color: #1b7b7d; background: #eff9f8; }
.profile-skill small { font-size: 9px; opacity: .8; }
.profile-links { display: grid; gap: 8px; }
.profile-links a { display: flex; align-items: center; gap: 9px; padding: 10px; border: 1px solid #e5eaf0; border-radius: 7px; font-size: 12px; color: #576b80; }
.profile-links a svg { width: 15px; height: 15px; flex-shrink: 0; }
.profile-links a span:nth-child(2) { flex: 1; overflow-wrap: anywhere; }
.profile-links a:hover { color: #087d7e; border-color: #a4d6d5; }
.profile-record { display: contents; }
.profile-record :deep(> div) { border: 1px solid #e3e9ef; background: #fff; padding: 24px; border-radius: 10px; }
.profile-record :deep(h2) { text-transform: none; letter-spacing: 0; }
.profile-empty > svg { width: 32px; height: 32px; color: #9aa9b6; margin-bottom: 16px; }
.profile-empty p { font-size: 13px; color: #708195; line-height: 1.8; margin-bottom: 18px; }
@container (max-width: 760px) { .profile-content-grid { grid-template-columns: 1fr; } .profile-details { grid-template-columns: repeat(auto-fit, minmax(min(230px, 100%), 1fr)); } .profile-identity { flex-wrap: wrap; padding: 22px; gap: 16px; } .profile-identity h1 { font-size: 24px; } .profile-portrait { width: 68px; height: 68px; flex-basis: 68px; border-radius: 15px; } .profile-edit-action { margin-left: auto; } }
@container (max-width: 400px) { .profile-identity { padding: 20px; gap: 14px; } .profile-identity-copy { flex-basis: calc(100% - 84px); } .profile-identity > .profile-edit-action { width: 100%; } .profile-section, .profile-empty { padding: 20px; } .profile-identity h1 { font-size: 22px; } }
</style>
