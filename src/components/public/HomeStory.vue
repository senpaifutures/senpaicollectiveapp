<script setup lang="ts">
import { ArrowUpRightIcon } from '@heroicons/vue/24/outline'
</script>

<template>
  <section id="our-story" class="story-section" aria-labelledby="story-title">
    <div class="story-shell">
      <header class="story-heading"><p class="story-eyebrow">The Story Behind This</p><h2 id="story-title">One person's belief.<br />It grew into a movement of 2,000.</h2></header>
      <figure class="story-photo"><img src="/henry-senpai-2017.webp" alt="The SENPAI community in 2017" width="1200" height="600" loading="lazy" /><figcaption>SENPAI, 2017. The community that started it all.</figcaption></figure>
      <div class="story-layout"><aside class="story-author"><a href="https://www.henryikoh.com" target="_blank" rel="noopener noreferrer">Henry Ikoh <ArrowUpRightIcon /></a><p>Founder, SENPAI</p><span>In my own words.</span></aside><div class="story-copy"><p>
            Nigeria has never lacked talent. What we lack are <strong>systems</strong> — real infrastructure that takes a young person with ability and actually gets them somewhere. I watched it play out over and over: designers, photographers, storytellers, artists with real skill and no one showing them how to turn that skill into a career.
          </p><p>
            When I moved into the Lagos tech community in January 2017, I found the same gap. Every community that existed was built for <em>developers</em>. If you were a creative using technology as your tool, there was still nowhere that felt built for you. <strong>So I built one.</strong>
          </p><p>
            I named it <strong>SENPAI</strong>, the Japanese word for an experienced guide who leads through example, not instruction. We started on Tuesday, August 22nd, 2017. Not a school. Not a bootcamp. A community of people who were a few steps ahead, pulling others forward.
          </p><p>
            Within the first year we had 574 registered members, growing four or five a day. I set a goal: <strong>2,000 people by the end of 2019</strong> — founders, artists, nerds, storytellers, anyone who believed a creative mind was as valuable in tech as a technical one.
          </p><p>
            Over four cohorts we hit it and kept going, past 2,000+ members. The first cohort alone put <strong>157 students into 13 mentor groups</strong>. 45 graduated, and about 35 of them are now earning in dollars or working at top firms.
          </p><p>
            I also got it wrong more than once. Early on I built a Slack group and <strong>300+ people joined almost overnight</strong>. Within weeks the channel went quiet, full of accounts that never engaged. I had introduced people to the brand faster than I could actually build relationships with them, and it diluted the culture I was trying to create. The lesson stuck: <em>you don't grow a real community by adding people faster. You grow it by going deep with a few people first.</em>
          </p><p>
            Running the curriculum, the mentors, the events, and the community all on my own taught me something else I couldn't unlearn: I hadn't yet built the internal capacity to lead the way the community deserved. If I was going to ask people to grow, I had to lead by example, which meant stepping back to build that foundation in myself first. <strong>SENPAI went quiet, on purpose.</strong>
          </p><p>
            The vision never died. For five years, I went into the wilderness. Not to pick up a new skill, but to build <strong>the internal structure strong enough to actually hold what I was asking for</strong>. That meant facing the parts of myself I'd been avoiding, doing the quieter work no one sees. Passion without that structure is just exhaustion waiting to happen.
          </p><p>
            Now I'm back. Not to restart SENPAI, but to <em>rebuild</em> it with the technical skills, the systems thinking, and the discipline to go deep with people instead of wide.
          </p><p>
            This time, we're building infrastructure that scales. Systems that don't depend on one person. A community that sustains itself.
          </p></div></div>
      <div class="story-history"><p class="story-eyebrow">From that first chapter</p><dl><div><dt>Community members</dt><dd>2,000+</dd></div><div><dt>Cohorts run</dt><dd>4</dd></div><div><dt>First-cohort students</dt><dd>157</dd></div><div><dt>First-cohort graduates</dt><dd>45</dd></div></dl><a href="#community-history" class="story-history-link">Meet some of the people from that history <ArrowUpRightIcon /></a></div>
      <div class="story-parent"><img src="/senpai.svg" width="42" height="38" alt="SENPAI" /><div><h3>The collective, within SENPAI</h3><p>SENPAI is a social ecosystem design company with a mission to build Africa’s creative infrastructure. SENPAI COLLECTIVE is the home for the people who bring that mission to life.</p><a href="https://senpaifutures.com/" target="_blank" rel="noopener noreferrer">Explore SENPAI <ArrowUpRightIcon /></a></div></div>
    </div>
  </section>
</template>

<style scoped>
.story-section { background: #eef1eb; padding-block: 88px; color: #162323; scroll-margin-top: 100px; }
.story-shell { width: min(1120px, calc(100% - 96px)); margin-inline: auto; }
.story-eyebrow { font-size: 12px; letter-spacing: 1.7px; font-weight: 600; text-transform: uppercase; color: #58735f; }
.story-heading h2 { font-size: clamp(36px, 4vw, 52px); line-height: 1.14; letter-spacing: -1.8px; font-weight: 550; margin-top: 22px; max-width: 860px; }
.story-photo { margin: 40px 0 54px; }
.story-photo img { display: block; width: 100%; height: auto; aspect-ratio: 2; object-fit: cover; border: 1px solid #d4dcd1; }
.story-photo figcaption { font-size: 11px; line-height: 1.6; color: #6b7b6b; margin-top: 12px; }
.story-layout { display: grid; grid-template-columns: 220px minmax(0, 740px); gap: 60px; align-items: start; }
.story-author { position: sticky; top: 122px; border-top: 1px solid #c8d4c6; padding-top: 20px; }
.story-author a { display: inline-flex; align-items: center; gap: 12px; font-size: 16px; font-weight: 600; color: #2c4d38; }
.story-author p { margin-top: 6px; font-size: 12px; color: #647963; }
.story-author span { display: block; margin-top: 24px; color: #71816c; font-size: 12px; }
.story-copy p { font-size: 17px; color: #52654f; line-height: 1.95; margin: 0 0 26px; }
.story-copy strong { color: #2d4631; font-weight: 600; }
.story-copy em { font-style: italic; }
.story-copy p:last-child { color: #284b33; font-size: 25px; line-height: 1.6; letter-spacing: -.5px; margin-top: 36px; }
.story-history { border-top: 1px solid #c8d4c6; margin-top: 44px; padding-top: 30px; }
.story-history dl { display: grid; grid-template-columns: repeat(4, 1fr); gap: 28px; margin-block: 24px; }
.story-history dl > div { display: flex; flex-direction: column-reverse; gap: 6px; }
.story-history dt { font-size: 12px; line-height: 1.6; color: #62785f; }
.story-history dd { font-size: 40px; line-height: 1.2; letter-spacing: -1.2px; color: #2a4b36; margin: 0; }
.story-history-link, .story-parent a { display: inline-flex; align-items: center; gap: 12px; font-size: 13px; color: #365a44; font-weight: 550; }
.story-section a { text-decoration: none; }
.story-section a:hover { text-decoration: underline; text-underline-offset: 4px; }
.story-section a:focus-visible { outline: 3px solid #217674; outline-offset: 5px; }
.story-section svg { width: 17px; height: 17px; flex-shrink: 0; }
.story-parent { display: flex; align-items: flex-start; gap: 24px; border-top: 1px solid #c8d4c6; padding-top: 34px; margin-top: 36px; }
.story-parent > img { width: 42px; height: 38px; object-fit: contain; flex-shrink: 0; }
.story-parent h3 { font-size: 20px; font-weight: 550; color: #34543a; margin-bottom: 14px; }
.story-parent p { font-size: 15px; line-height: 1.8; color: #63745f; max-width: 740px; margin-bottom: 18px; }
@media (max-width: 1100px) { .story-shell { width: calc(100% - 64px); } .story-layout { grid-template-columns: 180px minmax(0, 1fr); gap: 36px; } }
@media (max-width: 720px) { .story-shell { width: calc(100% - 40px); } .story-section { padding-block: 58px; } .story-heading h2 { font-size: 36px; } .story-photo { margin-block: 28px 32px; } .story-photo img { aspect-ratio: 4 / 3; } .story-layout { display: block; } .story-author { position: static; margin-bottom: 28px; } .story-author span { margin-top: 12px; } .story-copy p { font-size: 16px; line-height: 1.9; } .story-copy p:last-child { font-size: 23px; } .story-history dl { grid-template-columns: 1fr 1fr; gap: 24px; } .story-history dd { font-size: 34px; } .story-parent { gap: 16px; } }
</style>
