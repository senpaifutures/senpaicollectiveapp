import { computed, type Component } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  HomeIcon, ClipboardDocumentListIcon, RocketLaunchIcon, UsersIcon,
  ChatBubbleLeftRightIcon, ArrowPathRoundedSquareIcon, BriefcaseIcon,
  DocumentTextIcon, ChartBarSquareIcon, SparklesIcon, EnvelopeIcon,
  AcademicCapIcon, Squares2X2Icon, UserGroupIcon, CheckBadgeIcon,
  Cog6ToothIcon, UserCircleIcon, ClipboardDocumentCheckIcon,
} from '@heroicons/vue/24/outline'

export interface AppNavItem { name: string; href: string; icon: Component }
export interface AppNavGroup { label: string; items: AppNavItem[] }

const memberGroups: AppNavGroup[] = [
  { label: 'Workspace', items: [
    { name: 'Overview', href: '/dashboard', icon: HomeIcon },
    { name: 'My tasks', href: '/tasks', icon: ClipboardDocumentListIcon },
    { name: 'Open tasks', href: '/tasks/open', icon: Squares2X2Icon },
    { name: 'Projects', href: '/projects', icon: RocketLaunchIcon },
    { name: 'Programs', href: '/programs', icon: AcademicCapIcon },
  ] },
  { label: 'Community', items: [
    { name: 'Community wall', href: '/wall', icon: ChatBubbleLeftRightIcon },
    { name: 'Circles', href: '/circles', icon: ArrowPathRoundedSquareIcon },
    { name: 'Member directory', href: '/members', icon: UsersIcon },
    { name: 'My invites', href: '/invites', icon: EnvelopeIcon },
  ] },
  { label: 'Opportunities', items: [
    { name: 'Job board', href: '/jobs', icon: BriefcaseIcon },
    { name: 'My applications', href: '/my-applications', icon: DocumentTextIcon },
    { name: 'Assigned jobs', href: '/assigned-jobs', icon: ClipboardDocumentCheckIcon },
    { name: 'Performance', href: '/performance', icon: ChartBarSquareIcon },
  ] },
]
const adminGroups: AppNavGroup[] = [
  { label: 'Workspace', items: [{ name: 'Overview', href: '/admin', icon: HomeIcon }] },
  { label: 'People', items: [
    { name: 'Applications', href: '/admin/applications', icon: ClipboardDocumentCheckIcon },
    { name: 'Members', href: '/admin/members', icon: UsersIcon },
    { name: 'Cohorts', href: '/admin/cohorts', icon: UserGroupIcon },
    { name: 'Scouts', href: '/admin/scouts', icon: SparklesIcon },
  ] },
  { label: 'Work & development', items: [
    { name: 'Tasks', href: '/admin/tasks', icon: ClipboardDocumentListIcon },
    { name: 'Programs', href: '/admin/programs', icon: AcademicCapIcon },
    { name: 'Circles', href: '/admin/circles', icon: ArrowPathRoundedSquareIcon },
    { name: 'Projects', href: '/admin/projects', icon: RocketLaunchIcon },
    { name: 'Jobs', href: '/admin/jobs', icon: BriefcaseIcon },
  ] },
  { label: 'Standards & insights', items: [
    { name: 'Job roles', href: '/admin/job-roles', icon: UserCircleIcon },
    { name: 'Skill verification', href: '/admin/skill-verification', icon: CheckBadgeIcon },
    { name: 'Analytics', href: '/admin/analytics', icon: ChartBarSquareIcon },
  ] },
]

export function useAppNavigation() {
  const route = useRoute()
  const auth = useAuthStore()
  const isAdminSpace = computed(() => route.path === '/admin' || route.path.startsWith('/admin/'))
  const groups = computed<AppNavGroup[]>(() => {
    if (isAdminSpace.value) {
      if (auth.isAdmin) return adminGroups
      if (auth.isCommunityLead) return [{ label: 'Community review', items: adminGroups[1]!.items.filter(i => i.href === '/admin/applications') }]
      return []
    }
    const available = auth.isApproved ? memberGroups : [{ label: 'Workspace', items: memberGroups[0]!.items.slice(0, 1) }]
    const scouting: AppNavItem[] = []
    if (auth.isScout) scouting.push({ name: 'Scout dashboard', href: '/scout', icon: SparklesIcon })
    if (auth.isApproved) scouting.push({ name: 'Scout guide', href: '/scout/guide', icon: AcademicCapIcon })
    return [...available, ...(scouting.length ? [{ label: 'Scouting', items: scouting }] : [])]
  })
  const accountItems: AppNavItem[] = [
    { name: 'My profile', href: '/profile', icon: UserCircleIcon },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
  ]
  const allItems = computed(() => [...groups.value.flatMap(g => g.items), ...accountItems])
  const currentItem = computed(() => allItems.value.filter(i => route.path === i.href || (i.href !== '/admin' && route.path.startsWith(i.href + '/'))).sort((a, b) => b.href.length - a.href.length)[0])
  const pageTitle = computed(() => currentItem.value?.name ?? 'Workspace')
  const isActive = (href: string) => currentItem.value?.href === href
  return { groups, accountItems, isAdminSpace, isActive, pageTitle }
}
