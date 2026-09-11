<template>
  <section id="who-its-for" class="audience-section" aria-labelledby="audience-title">
    <div class="audience-shell">
      <header class="audience-heading"><p class="audience-eyebrow">Who This Is For</p><h2 id="audience-title">You know you're capable of more.</h2><p class="audience-intro">You haven't found your people yet. And you know growth requires community, not just content.</p></header>
      <div class="audience-grid"><div class="audience-people"><div class="audience-person"><span class="audience-number">01</span><p><span>Designers</span> who want to <span>build products</span>, <span>not just push pixels</span></p></div><div class="audience-person"><span class="audience-number">02</span><p><span>Developers</span> who want to <span>create systems</span>, <span>not just write code</span></p></div><div class="audience-person"><span class="audience-number">03</span><p><span>Founders</span> who want <span>co-conspirators</span>, <span>not just connections</span></p></div><div class="audience-person"><span class="audience-number">04</span><p><span>Artists</span> who want <span>impact</span>, <span>not just applause</span></p></div><div class="audience-person"><span class="audience-number">05</span><p><span>Storytellers</span> who want to <span>shape culture</span>, <span>not just follow it</span></p></div><div class="audience-person"><span class="audience-number">06</span><p><span>Anyone</span> who <span>refuses to wait for permission</span> to build</p></div></div>
        <aside class="audience-standard"><h3>This is not for everyone.</h3><div><p>If you're looking for shortcuts, we're not it.</p><p>If you want to take without giving, look elsewhere.</p><p>If you're not serious about growth, don't apply.</p></div><p class="audience-conviction">But if you're ready to be challenged, supported, and transformed — keep reading.</p></aside>
      </div>
    </div>
  </section>
</template>

<style scoped>
.audience-section { background: #f7f6f2; padding-block: 88px; scroll-margin-top: 100px; color: #162323; }
.audience-shell { width: min(1280px, calc(100% - 96px)); margin-inline: auto; }
.audience-eyebrow { font-size: 12px; letter-spacing: 1.7px; font-weight: 600; text-transform: uppercase; color: #53705e; }
.audience-heading { max-width: 730px; margin-bottom: 44px; }
.audience-heading h2 { margin-top: 20px; font-size: clamp(36px, 4vw, 52px); line-height: 1.12; letter-spacing: -1.8px; font-weight: 550; text-wrap: balance; }
.audience-intro { font-size: 17px; color: #5e6e62; line-height: 1.8; margin-top: 24px; max-width: 570px; }
.audience-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 64px; align-items: start; }
.audience-person { display: flex; align-items: baseline; gap: 22px; padding-block: 20px; border-top: 1px solid #cfdacf; }
.audience-number { font-size: 11px; color: #7b9080; }
.audience-person p { font-size: 17px; line-height: 1.75; color: #5a6c60; margin: 0; }
.audience-person p span:first-child { color: #1f3a2d; font-weight: 650; }
.audience-person p span:nth-child(2) { color: #365c47; font-weight: 550; }
.audience-standard { background: #242828; padding: 34px; color: #ebf3e9; }
.audience-standard h3 { font-size: 28px; font-weight: 500; line-height: 1.2; letter-spacing: -.7px; margin: 0 0 24px; }
.audience-standard div p { color: #bacbbb; font-size: 14px; line-height: 1.8; margin: 0 0 12px; }
.audience-conviction { font-size: 17px; line-height: 1.7; color: #cce6b5; margin-top: 28px; padding-top: 24px; border-top: 1px solid #465d4a; }
@media (max-width: 1100px) { .audience-shell { width: calc(100% - 64px); } .audience-grid { gap: 36px; } }
@media (max-width: 720px) { .audience-shell { width: calc(100% - 40px); } .audience-section { padding-block: 58px; } .audience-grid { grid-template-columns: 1fr; gap: 28px; } .audience-heading { margin-bottom: 30px; } .audience-heading h2 { font-size: 38px; } .audience-person { gap: 16px; } .audience-person p { font-size: 16px; } .audience-standard { padding: 28px; } }
</style>
