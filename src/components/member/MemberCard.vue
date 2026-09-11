<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { PublicMemberProfile } from '@/types'
import { useSkillsStore } from '@/stores/skills'
import { UserCircleIcon, MapPinIcon, ArrowUpRightIcon } from '@heroicons/vue/24/outline'
import { ShieldCheckIcon, StarIcon, SparklesIcon } from '@heroicons/vue/24/solid'

interface Props {
  member: PublicMemberProfile & { profile?: any }
}

const props = defineProps<Props>()
const skillsStore = useSkillsStore()

// Handle both flat structure (from single member) and nested profile structure (from list)
const memberData = computed(() => {
  const m = props.member as any
  const p = m.profile

  // Check if member has a profile
  const hasProfile = !!p || !!m.full_name

  // Get primary skill - could be an object with name, or just an ID we need to look up
  let primarySkillName: string | null = null

  // First check if we have a skill object with name
  if (m.primary_skill?.name) {
    primarySkillName = m.primary_skill.name
  } else if (p?.primary_skill?.name) {
    primarySkillName = p.primary_skill.name
  } else {
    // Otherwise, look up by ID from skills store
    const skillId = m.primary_skill_id || p?.primary_skill_id
    if (skillId) {
      const skill = skillsStore.skills.find(s => s.id === skillId)
      primarySkillName = skill?.name || null
    }
  }

  // Normalize roles - could be array of objects {name: string} or array of strings
  const rawRoles = m.roles || []
  const roleNames = rawRoles.map((r: any) => typeof r === 'string' ? r : r.name).filter(Boolean)

  return {
    id: m.id,
    email: m.email,
    hasProfile,
    full_name: m.full_name || p?.full_name || null,
    photo_url: m.photo_url || p?.photo_url,
    city: m.city || p?.city || null,
    country: m.country || p?.country || null,
    bio: m.bio || p?.bio,
    experience_level: m.experience_level || p?.experience_level || 'none',
    primary_skill_name: primarySkillName,
    skills: m.skills || [],
    badges: m.badges || [],
    roles: roleNames,
    cohort_name: m.cohort_name || null,
    pod_name: m.pod_name || null
  }
})

// Display name - use full_name if available, otherwise email username
const displayName = computed(() => {
  if (memberData.value.full_name) {
    return memberData.value.full_name
  }
  // Extract username from email as fallback
  if (memberData.value.email) {
    return memberData.value.email.split('@')[0]
  }
  return 'Unknown Member'
})

// Display location
const displayLocation = computed(() => {
  const { city, country } = memberData.value
  if (city && country) return `${city}, ${country}`
  if (city) return city
  if (country) return country
  return null
})

// Check for special roles from roles array (normalized to strings)
const isAdmin = computed(() => {
  const roles = memberData.value.roles || []
  return roles.some((r: string) => r.toLowerCase() === 'admin')
})

const isScout = computed(() => {
  const roles = memberData.value.roles || []
  return roles.some((r: string) => r.toLowerCase() === 'scout')
})

// OG Member comes from badges, not roles
const isOG = computed(() => {
  const badges = memberData.value.badges || []
  return badges.some((b: string) => b.toLowerCase() === 'og member' || b.toLowerCase() === 'og')
})

const experienceLevelLabels: Record<string, string> = {
  none: 'New',
  junior: 'Junior',
  mid: 'Mid',
  senior: 'Senior'
}
</script>

<template>
  <RouterLink :to="`/members/${memberData.id}`" class="directory-member-card" :aria-label="`View ${displayName}’s profile`">
    <div class="member-card-identity"><div class="member-card-photo"><img v-if="memberData.photo_url" :src="memberData.photo_url" :alt="displayName" loading="lazy" /><UserCircleIcon v-else /></div><div class="member-card-name"><h3>{{ displayName }}</h3><p>{{ memberData.primary_skill_name || 'Collective member' }}</p></div><ArrowUpRightIcon class="member-card-arrow" /></div>
    <p v-if="displayLocation" class="member-card-location"><MapPinIcon />{{ displayLocation }}</p>
    <p v-if="memberData.bio" class="member-card-bio">{{ memberData.bio }}</p><p v-else class="member-card-bio member-card-placeholder">{{ memberData.hasProfile ? 'Get to know this member through their profile.' : 'Profile not yet completed' }}</p>
    <div v-if="memberData.skills.length" class="member-card-skills"><span v-for="skill in memberData.skills.slice(0, 3)" :key="skill.id">{{ skill.name }}</span><span v-if="memberData.skills.length > 3">+{{ memberData.skills.length - 3 }}</span></div>
    <p v-if="memberData.cohort_name" class="member-card-cohort">{{ memberData.cohort_name }}<span v-if="memberData.pod_name"> · {{ memberData.pod_name }}</span></p>
    <div class="member-card-footer"><span v-if="memberData.hasProfile" class="member-experience">{{ experienceLevelLabels[memberData.experience_level] || 'New' }}</span><div class="member-card-roles"><span v-if="isAdmin"><ShieldCheckIcon />Admin</span><span v-if="isScout"><StarIcon />Scout</span><span v-if="isOG"><SparklesIcon />OG</span></div></div>
  </RouterLink>
</template>

<style scoped>
.directory-member-card { display: flex; flex-direction: column; min-width: 0; height: 100%; padding: 22px; background: #fff; border: 1px solid #e2e8ef; border-radius: 12px; color: #344054; text-decoration: none; transition: border-color .15s, box-shadow .15s; }
.directory-member-card:hover { border-color: #9ccfd0; box-shadow: 0 4px 16px #20394d08; }
.directory-member-card:focus-visible { outline: 2px solid #148b8c; outline-offset: 3px; }
.member-card-identity { display: flex; gap: 13px; align-items: center; }
.member-card-photo { width: 54px; height: 54px; flex: 0 0 54px; border-radius: 14px; overflow: hidden; display: grid; place-items: center; background: #edf3f6; color: #8fa6b5; }
.member-card-photo img { width: 100%; height: 100%; object-fit: cover; }
.member-card-photo svg { width: 32px; height: 32px; }
.member-card-name { min-width: 0; flex: 1; }
.member-card-name h3 { font-size: 14px; font-weight: 650; line-height: 1.45; overflow-wrap: anywhere; }
.member-card-name p { font-size: 11px; color: #597184; line-height: 1.6; margin-top: 3px; overflow-wrap: anywhere; }
.member-card-arrow { width: 16px; height: 16px; flex-shrink: 0; color: #94a4b3; align-self: flex-start; }
.member-card-location { display: flex; align-items: center; gap: 5px; font-size: 11px; color: #718195; margin-top: 16px; }
.member-card-location svg { width: 13px; height: 13px; flex-shrink: 0; }
.member-card-bio { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; font-size: 12px; line-height: 1.8; color: #5e6e82; margin-top: 14px; min-height: 44px; overflow-wrap: anywhere; }
.member-card-placeholder { color: #738195; }
.member-card-skills { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 18px; margin-bottom: 16px; }
.member-card-skills span { font-size: 10px; line-height: 1.6; background: #f4f7fa; border: 1px solid #e8edf2; border-radius: 5px; padding: 4px 7px; color: #5e7186; }
.member-card-cohort { font-size: 10px; line-height: 1.7; color: #437f87; padding-bottom: 16px; }
.member-card-footer { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-top: auto; padding-top: 14px; border-top: 1px solid #edf0f4; }
.member-experience { font-size: 10px; color: #718195; }
.member-card-roles { display: flex; gap: 10px; flex-wrap: wrap; margin-left: auto; }
.member-card-roles span { display: inline-flex; align-items: center; gap: 4px; font-size: 10px; color: #587e8d; }
.member-card-roles svg { width: 12px; height: 12px; }
</style>
