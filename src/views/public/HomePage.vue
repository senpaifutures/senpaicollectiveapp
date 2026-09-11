<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowUpRightIcon, ArrowRightIcon, Bars3Icon, XMarkIcon, PlusIcon, CheckBadgeIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/auth'
import IntakePanel from '@/components/public/IntakePanel.vue'
import AlumniMarquee from '@/components/public/AlumniMarquee.vue'
import VerificationDemo from '@/components/public/VerificationDemo.vue'
import ProjectJourney from '@/components/public/ProjectJourney.vue'
import HomeAudience from '@/components/public/HomeAudience.vue'
import HomeBenefits from '@/components/public/HomeBenefits.vue'
import HomeStory from '@/components/public/HomeStory.vue'
import HomePlatform from '@/components/public/HomePlatform.vue'
import VerifiedTalentPreview from '@/components/public/VerifiedTalentPreview.vue'

const authStore = useAuthStore()
const menuOpen = ref(false)
const entryPath = computed(() => authStore.isAuthenticated ? '/dashboard' : '/join')
const entryLabel = computed(() => authStore.isAuthenticated ? 'Your dashboard' : 'Apply to join')
const questions = [
  { question: 'Who is the collective for?', answer: 'Designers, developers, artists, storytellers, founders, and systems thinkers who want to build with others. We look for skill, ambition, character, and a willingness to contribute. The collective works across culture, technology, business, art, and systems.' },
  { question: 'Do I need to be verified before I join?', answer: 'You apply with the skills and experience you have. Membership and skill verification are separate: your record grows through work and reviews inside the collective. Applying does not automatically verify your skills.' },
  { question: 'Is all project work paid?', answer: 'Paid client work is compensated in cash. Collective Projects and Member Projects are unpaid and earn Collective Pool units under the Pool policy. The type of work matters, so read the project brief and membership terms before committing.' },
  { question: 'Does joining give me equity?', answer: 'Membership alone does not give you equity. Eligible contributions earn Collective Pool units under the Pool policy. If SENPAI spins a Member Project out into a company, its founding team receives equity under the membership terms. A spinout and any future payout are not guaranteed.' },
]
</script>

<template>
  <div class="collective-home">
    <a class="skip-link" href="#main-content">Skip to content</a>
    <header class="site-header">
      <div class="shell header-inner">
        <RouterLink class="wordmark" to="/" aria-label="SENPAI COLLECTIVE home">
          <img class="collective-logo" src="/senpai_logo.svg" width="48" height="48" alt="" />
          <span>SENPAI<span class="wordmark-sub">COLLECTIVE</span></span>
        </RouterLink>
        <nav class="desktop-nav" aria-label="Main navigation">
          <RouterLink to="/manifesto">Manifesto</RouterLink>
          <RouterLink to="/submit-job">Post a job</RouterLink>
        </nav>
        <div class="header-actions">
          <RouterLink v-if="!authStore.isAuthenticated" class="sign-in" to="/login">Sign in</RouterLink>
          <RouterLink :to="entryPath" class="button button-small">{{ entryLabel }} <ArrowUpRightIcon /></RouterLink>
          <button class="menu-toggle" type="button" :aria-expanded="menuOpen" aria-controls="mobile-navigation" :aria-label="menuOpen ? 'Close navigation' : 'Open navigation'" @click="menuOpen = !menuOpen">
            <XMarkIcon v-if="menuOpen" /><Bars3Icon v-else />
          </button>
        </div>
      </div>
      <nav v-if="menuOpen" id="mobile-navigation" class="mobile-nav shell" aria-label="Mobile navigation" @keydown.esc="menuOpen = false">
        <RouterLink to="/manifesto" @click="menuOpen = false">Manifesto</RouterLink>
        <RouterLink to="/submit-job" @click="menuOpen = false">Post a job</RouterLink>
        <RouterLink v-if="!authStore.isAuthenticated" to="/login">Sign in</RouterLink>
      </nav>
    </header>

    <main id="main-content">
      <section class="hero shell" aria-labelledby="hero-title">
        <div class="hero-copy">
          <p class="eyebrow">A community. A platform. A shared ambition.</p>
          <h1 id="hero-title">Africa’s future systems.<br /><em>Built by us.</em></h1>
          <p class="hero-description">SENPAI COLLECTIVE is a selective community and platform for exceptional talent. Find collaborators, build shared projects, and earn verification through work that meets our standards. Our shared ambition: the future systems of Africa.</p>
          <a href="#the-record" class="hero-standard"><CheckBadgeIcon aria-hidden="true" /><span>Selective membership. Earned skill verification.</span><ArrowRightIcon aria-hidden="true" /></a>
          <div class="hero-actions">
            <RouterLink :to="entryPath" class="button">{{ entryLabel }} <ArrowUpRightIcon /></RouterLink>
            <a href="#shared-projects" class="text-link">What we build together <ArrowRightIcon /></a>
          </div>
          <IntakePanel compact />
        </div>
        <div id="community-history" class="hero-community">
          <div class="hero-community-heading">
            <p class="eyebrow">The people make the collective.</p>
            <span>Movers. Shapers. Thinkers.</span>
          </div>
          <AlumniMarquee />
          <p class="hero-gallery-caption">Faces from our alumni community. A history we’re building on.</p>
          <a class="parent-brand" href="https://senpaifutures.com/" target="_blank" rel="noopener noreferrer">
            <img src="/senpai.svg" width="42" height="38" alt="" />
            <span>A <strong>SENPAI FUTURES</strong> company<small>Building Africa’s creative infrastructure.</small></span>
            <ArrowUpRightIcon />
          </a>
        </div>
      </section>

      <div class="discipline-strip" aria-label="Our five pillars"><div class="shell"><span>Culture</span><PlusIcon /><span>Technology</span><PlusIcon /><span>Business</span><PlusIcon /><span>Art</span><PlusIcon /><span>Systems</span></div></div>

      <section class="section shell why-section" aria-labelledby="why-title">
        <div class="section-heading"><p class="eyebrow">Why we’re building this</p><span class="section-note">The conviction behind the collective.</span></div>
        <div class="intro-grid"><h2 id="why-title">The old way<br /><span class="muted-heading">is broken.</span></h2><p>Africa has no shortage of talent. What we lack is infrastructure.</p></div>
        <div class="broken-systems-grid">
          <ol class="system-barriers">
            <li><span class="barrier-number">01</span><div><h3>Schools don't prepare us</h3><p>Traditional education moves too slow. We graduate with degrees but not the skills the world actually needs.</p></div></li>
            <li><span class="barrier-number">02</span><div><h3>Investors don't fund us</h3><p>Capital flows elsewhere. African founders get overlooked. We're told to prove ourselves ten times over.</p></div></li>
            <li><span class="barrier-number">03</span><div><h3>Clients don't hire us</h3><p>Global opportunities go to the usual suspects. African creatives are invisible — not for lack of skill, but lack of access.</p></div></li>
            <li><span class="barrier-number">04</span><div><h3>Platforms ban us by default</h3><p>To the global work economy, our whole country is a risk score. Locked out before we type a word — no matter how good we are.</p></div></li>
          </ol>
          <aside class="cost-of-systems" aria-labelledby="cost-title">
            <p class="eyebrow">What’s at stake</p>
            <h3 id="cost-title">The Cost of<br />Broken Systems</h3>
            <p>When legitimate paths to success are blocked, talented people find other ways. Some give up. Others take shortcuts.</p>
            <p>Fraud. Scams. Quick money schemes. A generation of brilliant minds choosing degeneracy over value creation — not because they lack ambition, but because they lack <strong>infrastructure</strong>.</p>
            <p class="conviction">We refuse to accept this as inevitable. We believe that given real opportunity, real mentorship, and real community — our people will build, not destroy.</p>
          </aside>
        </div>
        <div class="our-response"><h3>So we’re building these systems ourselves.</h3><p>A community to build with. Shared projects that create opportunity. A verified record of work the world can inspect.</p><a href="#the-record" class="text-link">See how work becomes proof <ArrowRightIcon /></a></div>
      </section>

      <section id="the-collective" class="community-section" aria-labelledby="community-title">
        <div class="shell section">
          <div class="section-heading"><p class="eyebrow">01 / A community with a shared purpose</p><span class="section-note">Individual spirit. Collective ambition.</span></div>
          <div class="community-grid">
            <div><h2 id="community-title">Movers.<br />Shapers.<br /><em>Thinkers.</em></h2><p class="community-description">Africa’s future needs people who can imagine it and people who can build it. Designers, developers, artists, founders, storytellers, and systems thinkers. This is where we find each other—and get to work.</p><RouterLink to="/manifesto" class="text-link light-link">Meet our way of thinking <ArrowUpRightIcon /></RouterLink></div>
            <div class="community-right">
              <div class="collective-purpose">
                <img class="community-illustration" src="/illustrations/collective-orbit.svg" alt="Different creative disciplines connected around a shared centre" width="600" height="300" loading="lazy" />
                <p class="eyebrow">Shared ambition. Greater impact.</p>
                <h3>Together, our ambition<br /><em>has greater reach.</em></h3>
                <p>One ambitious person can build something remarkable. A collective of exceptional people, working towards a shared purpose, can shape how a whole generation learns, works, and creates.</p>
                <p>That takes more than gathering talent. It takes complementary skills, shared standards, and the structure to turn conviction into work. We bring our strengths together to build the future systems of Africa.</p>
                <div class="purpose-fields"><span>Culture & art</span><span>Technology & systems</span><span>Business & opportunity</span></div>
              </div>
              <div class="community-practices"><div><h3>Make each other better.</h3><p>Work with people who question your assumptions, bring strengths you don’t have, and hold your work to a higher standard. Do the same for them.</p></div><div><h3>Give ambition structure.</h3><p>Turn a shared idea into a project with clear roles, milestones, and accountability. Build a record of each contribution so the work can outlast any one person.</p></div></div>
            </div>
          </div>
          <div class="community-footer"><span>Rooted in Africa. Building for the world.</span><RouterLink to="/guidelines">Our community principles <ArrowUpRightIcon /></RouterLink></div>
        </div>
      </section>

      <HomePlatform />
      <HomeAudience />
      <HomeBenefits />

      <section id="shared-projects" class="section shell projects-section" aria-labelledby="projects-title">
        <div class="section-heading"><p class="eyebrow">02 / Shared ideas. Shared work.</p><span class="section-note">Big ideas need more than one pair of hands.</span></div>
        <div class="intro-grid">
          <h2 id="projects-title">That idea you keep<br /><span class="muted-heading">coming back to?</span></h2>
          <p>Give it a brief. Find your people. Make something that matters—together.</p>
        </div>
        <ProjectJourney />
        <div class="project-next"><p>Shared work builds your skills, your relationships, and your stake in what comes next.</p><a href="#ownership" class="text-link">Explore shared ownership <ArrowRightIcon /></a></div>
      </section>

      <section id="the-record" class="section shell" aria-labelledby="record-title">
        <div class="section-heading"><p class="eyebrow">03 / The SENPAI standard</p><span class="section-note">Exceptional talent. Accountable verification.</span></div>
        <div class="intro-grid"><h2 id="record-title">A high bar.<br /><span class="muted-heading">Our name behind it.</span></h2><p>We select for exceptional skill, ambition, and character. Membership earns you a place in the collective. The SENPAI verified mark is earned separately, skill by skill, through work that meets a demanding standard.</p></div>
        <div class="verification-standards">
          <div><span>01 / Evidence</span><h3>Prove it through the work.</h3><p>Multiple qualifying contributions build the record. Each review is tied to work you actually delivered.</p></div>
          <div><span>02 / Judgment</span><h3>Meet a shared standard.</h3><p>Reviews come from distinct people who shared the work, including someone already verified in that skill. Quality matters alongside consistency.</p></div>
          <div><span>03 / Accountability</span><h3>Earn the SENPAI mark.</h3><p>The evidence must qualify for nomination. SENPAI then confirms the skill and puts its name behind the result.</p></div>
        </div>
        <VerifiedTalentPreview />
        <h3 class="verification-process-heading">How a skill becomes SENPAI verified</h3>
        <VerificationDemo />
      </section>

      <section id="ownership" class="section shell" aria-labelledby="ownership-title">
        <div class="section-heading"><p class="eyebrow">04 / A stake in what comes next</p><span class="section-note">Contribution should count.</span></div>
        <div class="intro-grid"><h2 id="ownership-title">Build the future.<br /><span class="muted-heading">Share in its potential.</span></h2><p>We’re building paths from contribution to shared upside. Your work can grow your record, support the collective, and help bring a member’s idea into the world.</p></div>
        <div class="ownership-grid">
          <article class="ownership-card pool-card"><span class="eyebrow">Across the collective</span><img class="ownership-illustration" src="/illustrations/shared-foundation.svg" alt="Different contributions supporting one shared foundation" width="600" height="300" loading="lazy" /><h3>The Collective Pool.</h3><p>Eligible unpaid contributions earn Pool units: a way to participate in the value the collective may realise over time.</p><p class="ownership-note">Units represent economic participation under the Pool policy. They are not direct company shares, and a payout is not guaranteed.</p><RouterLink to="/pool" class="text-link">Understand the Pool <ArrowUpRightIcon /></RouterLink></article>
          <article class="ownership-card project-card"><span class="eyebrow">When a member project becomes a company</span><img class="ownership-illustration" src="/illustrations/shared-venture.svg" alt="Different building blocks forming a venture together" width="600" height="300" loading="lazy" /><h3>Build it. Be part of it.</h3><p>If SENPAI spins a Member Project out into a company, the founding team receives equity, with the split informed by recorded contributions.</p><p class="ownership-note">Member Projects are unpaid while being built. Spinout is not guaranteed; equity is governed by the membership terms.</p><RouterLink to="/terms" class="text-link">Read the project terms <ArrowUpRightIcon /></RouterLink></article>
        </div>
        <div class="client-callout"><div><p class="eyebrow">For teams & companies</p><h3>Find the people who can move your work forward.</h3><p>Tell us what you’re building. We’ll review your brief and connect you with members whose skills fit the work.</p></div><RouterLink to="/submit-job" class="button button-outline">Hire from the collective <ArrowUpRightIcon /></RouterLink></div>
      </section>

      <HomeStory />

      <section class="section shell faq-section" aria-labelledby="faq-title"><div><p class="eyebrow">Before you step in</p><h2 id="faq-title">A few good<br />questions.</h2></div><div class="faq-list"><details v-for="question in questions" :key="question.question"><summary>{{ question.question }}<PlusIcon /></summary><p>{{ question.answer }}</p></details><p class="faq-terms">The details live in our <RouterLink to="/terms">membership terms</RouterLink> and <RouterLink to="/pool">Pool policy</RouterLink>.</p></div></section>

      <section class="join-section" aria-labelledby="join-title">
        <div class="shell join-grid">
          <div class="join-copy">
            <p class="eyebrow">Join SENPAI COLLECTIVE</p>
            <h2 id="join-title">Build Africa’s future<br />with us.</h2>
            <p>Bring your skills and ambition. Find collaborators, build shared projects, and help shape the systems our communities need.</p>
          </div>
          <div class="join-actions">
            <RouterLink :to="entryPath" class="button">{{ entryLabel }} <ArrowUpRightIcon /></RouterLink>
            <p v-if="!authStore.isAuthenticated">Tell us about your work and what you want to build. We review every application for skill, ambition, and character.</p>
            <p v-else>Continue to your workspace to find your next contribution.</p>
          </div>
        </div>
      </section>
    </main>

    <footer class="site-footer"><div class="shell"><div class="footer-top"><RouterLink class="wordmark footer-brand" to="/" aria-label="SENPAI COLLECTIVE home"><img class="collective-logo" src="/senpai_logo.svg" width="56" height="56" alt="" /><span>SENPAI<span class="footer-wordmark-sub">COLLECTIVE</span></span></RouterLink><p>A community building the<br />future systems of Africa.</p><nav aria-label="Footer navigation"><RouterLink to="/manifesto">Manifesto</RouterLink><RouterLink to="/guidelines">Community guidelines</RouterLink><RouterLink to="/pool">The Collective Pool</RouterLink><RouterLink to="/submit-job">Hire from the collective</RouterLink></nav></div><div class="footer-bottom"><p>© {{ new Date().getFullYear() }} SENPAI FUTURES LTD · RC 9746107</p><div><RouterLink to="/terms">Terms</RouterLink><RouterLink to="/privacy">Privacy</RouterLink><a href="https://senpaifutures.com/" target="_blank" rel="noopener noreferrer">A SENPAI FUTURES company <ArrowUpRightIcon /></a></div></div></div></footer>
  </div>
</template>

<style scoped>

.collective-home { --ink: #242828; --paper: #fbfcfa; --teal: #41c0bf; --line: #d9e1dd; color: var(--ink); background: var(--paper); font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased; }
.hero > *, .intro-grid > *, .community-grid > *, .ownership-grid > *, .join-grid > * { min-width: 0; }
.shell { width: min(1280px, calc(100% - 96px)); margin-inline: auto; }
a, button, summary { -webkit-tap-highlight-color: transparent; }
a { text-decoration: none; }
button { font: inherit; cursor: pointer; }
svg { width: 20px; height: 20px; flex-shrink: 0; }
a:focus-visible, button:focus-visible, summary:focus-visible { outline: 3px solid #217674; outline-offset: 6px; }
.skip-link { position: fixed; left: 20px; top: -100px; z-index: 100; background: white; padding: 16px; }
.skip-link:focus { top: 12px; }
.site-header { position: sticky; top: 0; z-index: 40; background: rgb(251 252 250 / 96%); border-bottom: 1px solid var(--line); backdrop-filter: blur(12px); }
.header-inner { min-height: 90px; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
.wordmark { display: inline-flex; align-items: center; gap: 10px; font-size: 27px; font-weight: 800; letter-spacing: .2px; line-height: 1; }
.collective-logo { display: block; width: 48px; height: 48px; aspect-ratio: 1; flex: 0 0 48px; object-fit: contain; }
.wordmark-sub { display: block; font-size: 13px; font-weight: 500; letter-spacing: 1.2px; margin-top: 4px; }
.desktop-nav, .header-actions { display: flex; align-items: center; gap: 20px; }
.desktop-nav { margin-left: auto; }
.desktop-nav a, .sign-in { font-size: 14px; font-weight: 500; }
.desktop-nav a:hover, .sign-in:hover { color: #217674; }
.header-actions { gap: 22px; }
.button { display: inline-flex; align-items: center; justify-content: center; gap: 24px; padding: 18px 24px; background: var(--ink); color: white; font-size: 15px; font-weight: 600; border: 1px solid var(--ink); min-height: 52px; transition: background .2s, transform .2s; }
.button:hover { background: #2b4545; transform: translateY(-2px); }
.button-small { min-height: 44px; padding: 12px 16px; gap: 16px; font-size: 14px; }
.menu-toggle { display: none; border: 0; background: transparent; width: 44px; height: 44px; align-items: center; justify-content: center; }
.mobile-nav { display: none; }
.eyebrow { font-size: 12px; line-height: 1.6; font-weight: 600; letter-spacing: 1.7px; text-transform: uppercase; margin: 0; }
h2, h3, p { margin: 0; }
em { font-family: Georgia, 'Times New Roman', serif; font-weight: 400; }
.text-link { display: inline-flex; align-items: center; gap: 12px; font-size: 14px; font-weight: 600; padding-block: 8px; }
.text-link:hover { text-decoration: underline; text-underline-offset: 5px; }
.discipline-strip { background: #edf2ed; border-block: 1px solid var(--line); }
.discipline-strip .shell { display: flex; justify-content: space-between; align-items: center; gap: 16px; padding-block: 23px; }
.discipline-strip span { font-size: 14px; letter-spacing: 2px; text-transform: uppercase; font-weight: 500; }
.discipline-strip svg { width: 14px; color: #6e8880; }
.section { padding-block: 96px; scroll-margin-top: 88px; }
.section-heading { display: flex; justify-content: space-between; gap: 24px; align-items: center; padding-bottom: 22px; border-bottom: 1px solid var(--line); margin-bottom: 40px; }
.section-note { font-size: 12px; color: #627069; }
.intro-grid { display: grid; grid-template-columns: 1.3fr 1fr; gap: 70px; align-items: center; margin-bottom: 44px; }
h2 { font-size: clamp(34px, 3.5vw, 48px); letter-spacing: -1.8px; font-weight: 550; line-height: 1.12; }
.muted-heading { color: #718178; }
.intro-grid > p { font-size: 16px; line-height: 1.85; color: #5c6a62; }
.community-section { background: #192925; color: #f1f6ef; scroll-margin-top: 88px; }
.community-section .section-heading { border-color: #3c4c43; }
.community-section .section-note { color: #a8b9ab; }
.community-grid { display: grid; grid-template-columns: .9fr 1.2fr; gap: 96px; }
.community-grid h2 { font-size: clamp(60px, 6vw, 84px); letter-spacing: -3px; line-height: 1.03; }
.community-grid h2 em { color: #79d5c7; }
.community-description { font-size: 16px; line-height: 1.85; color: #b9c8bb; max-width: 345px; margin-top: 28px; margin-bottom: 22px; }
.light-link { color: #ebf3e8; }
.collective-purpose { padding: 32px; border: 1px solid #536357; background: #263b30; }
.collective-purpose h3 { font-size: 36px; line-height: 1.2; letter-spacing: -1px; margin-top: 25px; font-weight: 500; }
.collective-purpose h3 em { color: #85d6c7; }
.collective-purpose > p:not(.eyebrow) { color: #c8d7c9; font-size: 16px; line-height: 1.8; margin-top: 24px; }
.purpose-fields { display: flex; flex-wrap: wrap; gap: 10px 20px; border-top: 1px solid #536357; padding-top: 22px; margin-top: 28px; font-size: 12px; color: #d0e1d2; }
.project-next { display: flex; align-items: center; justify-content: space-between; gap: 28px; margin-top: 26px; }
.project-next p { font-size: 14px; line-height: 1.7; max-width: 590px; color: #526459; }
.project-next .text-link { flex-shrink: 0; }
.projects-section { padding-bottom: 0; }
.parent-story-link { display: flex; width: fit-content; }
.community-practices { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-top: 30px; }
.community-practices h3 { font-size: 18px; font-weight: 500; }
.community-practices p { font-size: 14px; line-height: 1.7; color: #b9c8bb; margin-top: 9px; }
.community-footer { display: flex; justify-content: space-between; gap: 24px; border-top: 1px solid #3c4c43; padding-top: 24px; margin-top: 56px; font-size: 14px; }
.community-footer a { display: inline-flex; align-items: center; gap: 12px; }
.ownership-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.ownership-card { padding: 36px; display: flex; flex-direction: column; border: 1px solid var(--line); }
.pool-card { background: #fff; }
.project-card { background: #f7f5ef; }
.ownership-card h3 { font-size: 32px; font-weight: 500; letter-spacing: -1px; margin-top: 32px; }
.ownership-card > p { font-size: 16px; line-height: 1.8; color: #526459; margin-top: 18px; }
.ownership-card > .ownership-note { font-size: 14px; line-height: 1.7; padding-top: 20px; border-top: 1px solid #cbd9cf; margin-bottom: 26px; }
.ownership-card .text-link { margin-top: auto; align-self: flex-start; }
.client-callout { display: flex; align-items: center; justify-content: space-between; gap: 40px; border-block: 1px solid var(--line); padding-block: 36px; margin-top: 54px; }
.client-callout h3 { font-size: 24px; letter-spacing: -.6px; font-weight: 500; margin-top: 12px; }
.client-callout p:not(.eyebrow) { max-width: 670px; font-size: 14px; line-height: 1.7; color: #627066; margin-top: 10px; }
.button-outline { background: transparent; color: var(--ink); flex-shrink: 0; }
.button-outline:hover { background: #e6eee7; }
.founder-caption { display: block; font-size: 12px; color: #627566; }
.faq-section { display: grid; grid-template-columns: .8fr 1.2fr; gap: 80px; }
.faq-section h2 { margin-top: 24px; }
.faq-list details { border-bottom: 1px solid var(--line); }
.faq-list details:first-child { border-top: 1px solid var(--line); }
.faq-list summary { cursor: pointer; list-style: none; padding-block: 24px; display: flex; justify-content: space-between; gap: 24px; font-size: 16px; font-weight: 500; }
.faq-list summary::-webkit-details-marker { display: none; }
.faq-list details[open] summary svg { transform: rotate(45deg); }
.faq-list details p { font-size: 15px; line-height: 1.85; color: #596b5e; padding-bottom: 26px; }
.faq-terms { font-size: 14px; color: #627366; line-height: 1.7; margin-top: 22px; }
.faq-terms a { text-decoration: underline; text-underline-offset: 3px; }
.join-section { padding-block: 64px; background: var(--teal); }
.join-grid { display: grid; grid-template-columns: minmax(0, 1.6fr) minmax(240px, 1fr); gap: 80px; align-items: center; }
.join-copy h2 { font-size: clamp(38px, 4.3vw, 58px); letter-spacing: -1.8px; margin-top: 20px; line-height: 1.12; }
.join-copy > p:not(.eyebrow) { max-width: 570px; font-size: 16px; line-height: 1.8; margin-top: 24px; }
.join-actions { border-left: 1px solid rgb(22 35 35 / 25%); padding-left: 40px; }
.join-actions .button { width: fit-content; }
.join-actions > p { max-width: 300px; font-size: 14px; line-height: 1.8; margin-top: 18px; }
.site-footer { padding-top: 52px; padding-bottom: 26px; background: #15231e; color: #f0f4ed; }
.footer-top { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 40px; align-items: start; padding-bottom: 50px; }
.footer-top .wordmark { display: flex; align-items: center; gap: 12px; font-size: 30px; }
.footer-brand .collective-logo { width: 56px; height: 56px; flex-basis: 56px; }
.footer-wordmark-sub { display: block; margin-top: 6px; font-size: 14px; letter-spacing: 1.5px; font-weight: 400; }
.footer-top p { font-size: 16px; line-height: 1.7; color: #bdcbbd; }
.footer-top nav { display: grid; gap: 14px; font-size: 14px; }
.footer-top a:hover, .footer-bottom a:hover { color: #75d9ce; }
.footer-bottom { display: flex; justify-content: space-between; gap: 24px; border-top: 1px solid #3a4a3f; padding-top: 24px; font-size: 12px; line-height: 1.6; color: #acbead; }
.footer-bottom > div { display: flex; gap: 24px; flex-wrap: wrap; }
.footer-bottom a { display: inline-flex; align-items: center; gap: 6px; }
.footer-bottom svg { width: 14px; height: 14px; }
@media (max-width: 1100px) { .desktop-nav { display: none; } .menu-toggle { display: inline-flex; } .mobile-nav { display: flex; flex-direction: column; gap: 4px; padding-bottom: 16px; } .mobile-nav a { padding-block: 10px; font-size: 16px; } .shell { width: calc(100% - 64px); } .desktop-nav { gap: 18px; } .header-actions { gap: 16px; } .community-grid { gap: 40px; } .intro-grid { gap: 40px; } .client-callout { align-items: flex-start; flex-direction: column; gap: 24px; } }
@media (max-width: 900px) { .desktop-nav { display: none; } .menu-toggle { display: inline-flex; } .mobile-nav { display: flex; flex-direction: column; gap: 4px; padding-bottom: 16px; } .mobile-nav a { padding-block: 10px; font-size: 16px; }       .intro-grid { gap: 32px; } .community-grid { grid-template-columns: 1fr 1.2fr; gap: 32px; } .community-grid h2 { font-size: 64px; }  .community-practices { grid-template-columns: 1fr; gap: 20px; } .section { padding-block: 70px; } .ownership-card { padding: 26px; } .ownership-card h3 { font-size: 28px; } .faq-section { gap: 36px; } .join-grid { gap: 40px; } }
@media (max-width: 640px) { .collective-logo { width: 36px; height: 36px; flex-basis: 36px; } .footer-brand .collective-logo { width: 40px; height: 40px; flex-basis: 40px; } .footer-top .wordmark { font-size: 22px; gap: 8px; } .footer-wordmark-sub { font-size: 12px; letter-spacing: .5px; } .project-next { align-items: flex-start; flex-direction: column; gap: 12px; } .collective-purpose { padding: 24px; } .collective-purpose h3 { font-size: 30px; } .shell { width: calc(100% - 40px); } .header-inner { min-height: 76px; gap: 12px; } .wordmark { font-size: 23px; gap: 7px; }  .wordmark-sub { font-size: 12px; } .sign-in { display: none; } .header-actions { gap: 4px; } .button-small { font-size: 12px; padding: 10px 12px; gap: 8px; } .button-small svg { width: 16px; }      .eyebrow { letter-spacing: 1.3px; } .discipline-strip .shell { flex-wrap: wrap; justify-content: center; gap: 12px 18px; padding-block: 18px; } .discipline-strip span { font-size: 12px; letter-spacing: 1.4px; } .discipline-strip svg { display: none; } .section { padding-block: 58px; scroll-margin-top: 75px; } .projects-section { padding-bottom: 0; } .section-heading { margin-bottom: 28px; padding-bottom: 16px; } .section-note { display: none; } .intro-grid, .community-grid, .ownership-grid, .faq-section, .join-grid { grid-template-columns: 1fr; gap: 30px; } h2 { font-size: 36px; letter-spacing: -1.5px; } .intro-grid { gap: 20px; margin-bottom: 30px; }      .community-grid h2 { font-size: 72px; } .community-description { max-width: none; }   .community-practices { grid-template-columns: 1fr 1fr; gap: 22px; } .community-footer { flex-direction: column; gap: 18px; margin-top: 36px; } .ownership-grid { gap: 18px; } .ownership-card { padding: 28px; } .client-callout { margin-top: 32px; } .faq-section { gap: 28px; } .faq-section h2 br { display: none; } .join-section { padding-block: 48px; } .join-copy h2 { font-size: 38px; } .join-actions { border-left: 0; padding-left: 0; } .join-actions > p { max-width: 420px; } .footer-top { grid-template-columns: 1fr 1fr; gap: 28px; } .footer-top > p { grid-column: 1; font-size: 14px; } .footer-top nav { grid-column: 2; grid-row: 1 / 3; } .footer-bottom { flex-direction: column; gap: 16px; } .footer-bottom > div { gap: 18px; } }
@media (max-width: 380px) { .header-inner { flex-wrap: wrap; padding-block: 14px; gap: 12px; } .header-actions { margin-left: auto; } .footer-top { grid-template-columns: 1fr; } .footer-top nav { grid-column: 1; grid-row: auto; } .shell { width: calc(100% - 32px); }     .community-practices { grid-template-columns: 1fr; } }
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { transition: none !important; } .button:hover { transform: none; } }

/* The hero owns the full width; community imagery sits below the message. */
.hero { display: block; padding-top: 64px; padding-bottom: 50px; }
.hero-copy { max-width: 1120px; margin-inline: auto; text-align: center; }
.hero .eyebrow { font-size: 12px; letter-spacing: 2px; }
h1 { font-size: clamp(3rem, 6.8vw, 6.25rem); line-height: 1.08; letter-spacing: -.045em; font-weight: 550; margin: 28px 0 0; }
h1 em { color: #278c89; }
.hero-description { max-width: 700px; margin: 26px auto 0; font-size: 18px; line-height: 1.8; color: #52625e; }
.hero-standard { display: flex; align-items: center; justify-content: center; gap: 12px; width: fit-content; max-width: 100%; margin: 22px auto 0; color: #266f6e; font-size: 13px; font-weight: 600; line-height: 1.6; text-align: left; padding-block: 8px; }
.hero-standard:hover span { text-decoration: underline; text-underline-offset: 4px; }
.hero-standard > svg:first-child { width: 24px; height: 24px; }
.verification-standards { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 36px; padding-block: 28px; border-block: 1px solid var(--line); }
.verification-standards span { color: #65766c; font-size: 11px; letter-spacing: 1.2px; text-transform: uppercase; }
.verification-standards h3 { font-size: 21px; line-height: 1.35; letter-spacing: -.4px; font-weight: 550; margin-top: 14px; }
.verification-standards p { font-size: 14px; line-height: 1.85; color: #596b5e; margin-top: 12px; }
.verification-process-heading { font-size: 24px; line-height: 1.35; letter-spacing: -.5px; font-weight: 550; margin-bottom: 24px; }
@media (max-width: 720px) { .verification-standards { grid-template-columns: 1fr; gap: 28px; } }
.hero-actions { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 30px; margin-top: 28px; }
.hero-community { margin-top: 52px; border-top: 1px solid var(--line); position: relative; scroll-margin-top: 110px; }
.hero-community-heading { display: flex; align-items: center; justify-content: space-between; gap: 20px; margin: 24px 0 12px; }
.hero-community-heading > span { font-size: 14px; color: #596e61; }
.hero-community :deep(.alumnus-card) { width: 8.5rem; height: 8.5rem; }
.hero-community :deep(.alumnus-photo) { filter: grayscale(1); transition: filter 300ms ease; }
.hero-community :deep(.alumnus-card:hover .alumnus-photo) { filter: grayscale(0); }
@media (prefers-reduced-motion: reduce) { .hero-community :deep(.alumnus-photo) { transition: none; } }
.hero-community :deep(.gallery-controls) { padding-right: 0; }
.hero-gallery-caption { font-size: 12px; color: #657366; margin: 18px 0 0; }
.parent-brand { display: flex; align-items: center; gap: 14px; width: fit-content; margin: 26px 0 0; font-size: 14px; text-align: left; }
.parent-brand img { width: 42px; height: 38px; object-fit: contain; flex-shrink: 0; }
.parent-brand small { display: block; font-size: 12px; line-height: 1.6; color: #637265; margin-top: 4px; }
.parent-brand > svg { width: 16px; height: 16px; margin-left: 12px; }
.parent-brand:hover { color: #227567; }
.broken-systems-grid { display: grid; grid-template-columns: 1.1fr 1fr; gap: 64px; align-items: stretch; }
.system-barriers { list-style: none; padding: 0; margin: 0; }
.system-barriers li { display: flex; align-items: flex-start; gap: 20px; padding: 24px 0; border-top: 1px solid var(--line); }
.system-barriers li:last-child { border-bottom: 1px solid var(--line); }
.barrier-number { font-size: 12px; font-family: monospace; color: #567b68; padding-top: 5px; }
.system-barriers h3 { font-size: 22px; font-weight: 550; letter-spacing: -.5px; }
.system-barriers p { margin-top: 10px; color: #596b5e; font-size: 16px; line-height: 1.8; }
.cost-of-systems { padding: 40px; color: #f5f8ef; background: #242828; }
.cost-of-systems h3 { font-size: 40px; letter-spacing: -1px; line-height: 1.12; font-weight: 500; margin-top: 24px; margin-bottom: 30px; }
.cost-of-systems > p:not(.eyebrow) { font-size: 16px; line-height: 1.85; color: #c4d5c5; margin-top: 22px; }
.cost-of-systems strong { color: white; }
.cost-of-systems > .conviction { color: #f2f7e9 !important; padding-top: 26px; border-top: 1px solid #58705b; }
.our-response { border-top: 1px solid var(--line); margin-top: 44px; padding-top: 30px; max-width: 850px; }
.our-response h3 { font-size: 30px; line-height: 1.25; letter-spacing: -.7px; font-weight: 550; }
.our-response p { font-size: 16px; line-height: 1.8; color: #596b5e; margin-top: 16px; max-width: 690px; }
.our-response .text-link { margin-top: 14px; }
.ownership-illustration { display: block; width: 100%; height: auto; aspect-ratio: 2; object-fit: contain; margin-top: 24px; }
.ownership-card h3 { margin-top: 14px; }
.community-illustration { display: block; width: 100%; height: auto; aspect-ratio: 2; object-fit: contain; margin-bottom: 24px; }
@media (max-width: 900px) {
  .hero { padding-top: 54px; }
  .broken-systems-grid { gap: 30px; }
  .cost-of-systems { padding: 30px; }
  .cost-of-systems h3 { font-size: 34px; }
}
@media (max-width: 640px) {
  .hero { padding-top: 42px; padding-bottom: 36px; }
  h1 { font-size: clamp(2.7rem, 10vw, 4rem); line-height: 1.1; letter-spacing: -.035em; margin-top: 22px; }
  .hero-description { font-size: 16px; line-height: 1.8; margin-top: 22px; }
  .hero-actions { gap: 16px; margin-top: 24px; }
  .hero-community { margin-top: 38px; }
  .hero-community-heading { align-items: flex-start; flex-direction: column; gap: 8px; }
  .hero-community :deep(.alumnus-card) { width: 7rem; height: 7.5rem; }
  .parent-brand { gap: 10px; }
  .parent-brand > svg { margin-left: 0; }
  .broken-systems-grid { grid-template-columns: 1fr; gap: 30px; }
  .system-barriers li { gap: 16px; }
  .system-barriers h3 { font-size: 20px; }
  .cost-of-systems { padding: 28px; }
  .our-response h3 { font-size: 27px; }
  .ownership-illustration { margin-top: 18px; }
}
</style>
