/* People Like Me — facet-segmented provider directory + community (demo). No build step. */
(() => {
  const D = window.PLM_DATA;
  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));

  // ---------- State ----------
  const S = { tab:'find', vert:'colorist', plm:true, open:null, feedVert:'all', q:'', follows:new Set(['p2','p8']), posts:[...D.POSTS], you:{ ...D.DEFAULT_YOU } };
  try { const saved = JSON.parse(localStorage.getItem('plm.you') || 'null'); if (saved) S.you = { ...D.DEFAULT_YOU, ...saved }; } catch (e) {}
  const save = () => { try { localStorage.setItem('plm.you', JSON.stringify(S.you)); } catch (e) {} };

  // ---------- Similarity engine ----------
  const ORD = { hair:D.HAIR, skin:D.SKIN, budget:D.BUDGET, tex:D.TEX };
  function fs(k, a, b) {
    if (a === b) return 1;
    const o = ORD[k]; if (!o) return 0;
    const d = Math.abs(o.indexOf(a) - o.indexOf(b));
    if (d === 1) return k === 'hair' ? .7 : .5;
    if (d === 2 && k === 'hair') return .3;
    return 0;
  }
  const sim = (vert, a, b) => Object.entries(D.WEIGHTS[vert]).reduce((s, [k, w]) => s + w * fs(k, a[k], b[k]), 0);
  // A provider's "experienced with" lists become a proxy facet set: the closest value they cover.
  function proxy(p) {
    const o = { ...S.you };
    for (const k of Object.keys(D.WEIGHTS[p.vert])) {
      if (p.exp[k]) o[k] = p.exp[k].includes(S.you[k]) ? S.you[k] : p.exp[k].reduce((b, v) => fs(k, v, S.you[k]) > fs(k, b, S.you[k]) ? v : b, p.exp[k][0]);
      else if (k === 'hood') o.hood = p.hood;
      else if (k === 'budget') o.budget = p.budget;
    }
    return o;
  }
  const score = p => sim(p.vert, S.you, proxy(p));
  const LIKE = .6; // reviewer similarity threshold for "people like you"
  function likeYou(p) {
    const rs = D.REVIEWS.filter(r => r.p === p.id);
    const lk = rs.filter(r => sim(p.vert, S.you, D.MEMBERS[r.m].f) >= LIKE);
    return { n:rs.length, lk:lk.length, rb:lk.filter(r => r.rebook).length };
  }

  // ---------- Small renderers ----------
  const HUES = { p1:'#2F6B4F', p2:'#4F7A2E', p3:'#B58A1E', p4:'#2E7A6B', p5:'#6A8F2A', p6:'#1E6B5C', p7:'#8A9A1E', p8:'#3A8A5A', p9:'#C29A2A', p10:'#4A7F3F' };
  const hue = id => HUES[id] || `hsl(${80 + [...id].reduce((a, c) => a + c.charCodeAt(0), 0) % 90} 38% 42%)`;
  const initials = n => n.split(' ').map(w => w[0]).slice(0, 2).join('');
  const av = (id, name, cls = '') => `<div class="av ${cls}" style="background:${hue(id)}">${initials(name)}</div>`;
  function ring(s) {
    const pct = Math.round(s * 100), c = pct >= 75 ? 'hi' : pct >= 45 ? 'mid' : '';
    const C = 2 * Math.PI * 20;
    return `<div class="ring ${c}" title="${pct}% like you"><svg viewBox="0 0 48 48"><circle class="bg" cx="24" cy="24" r="20"/><circle class="fg" cx="24" cy="24" r="20" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${(C * (1 - s)).toFixed(1)}"/></svg><div class="v">${pct}%</div></div>`;
  }
  const snap = (vert, f, s) => `<div class="snap">${Object.keys(D.WEIGHTS[vert]).map(k => `<span class="${f[k] === S.you[k] ? 'hit' : ''}">${esc(f[k])}</span>`).join('')}${s != null ? `<span class="pct">${Math.round(s * 100)}% like you</span>` : ''}</div>`;
  const lic = p => p.lic ? '<span class="badge">NYS license ✓</span>' : '<span class="badge warn">license pending</span>';
  const youSummary = () => `${S.you.hair} · ${S.you.tex} · ${S.you.chem} · ${S.you.skin} ${S.you.under} · ${S.you.eye} · ${S.you.hood}`;

  // ---------- Screens ----------
  function find() {
    if (S.open) return provider(S.open);
    const q = S.q.trim().toLowerCase();
    let list = D.PROVIDERS.filter(p => p.vert === S.vert)
      .filter(p => !q || [p.name, p.studio, p.hood, ...p.tags].join(' ').toLowerCase().includes(q))
      .map(p => ({ p, s: score(p) }));
    list.sort(S.plm ? (a, b) => b.s - a.s : (a, b) => a.p.name.localeCompare(b.p.name));
    const w = Object.keys(D.WEIGHTS[S.vert]).map(k => D.FACETS.find(f => f.k === k).label.toLowerCase());
    return `
      <div class="eyebrow">NYC · ${D.PROVIDERS.filter(p => p.vert === S.vert).length} vetted</div>
      <h1>Find a ${D.SINGULAR[S.vert]}</h1>
      <p class="sub">Ranked for your ${w.slice(0, -1).join(', ')} and ${w.slice(-1)}. Providers tag what they are experienced with; they never see your facets.</p>
      <div class="seg" role="tablist">${Object.entries(D.VERTICALS).map(([v, l]) => `<button role="tab" aria-selected="${v === S.vert}" class="${v === S.vert ? 'on' : ''}" data-vert="${v}">${l}</button>`).join('')}</div>
      <label class="search"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg><input id="q" type="search" placeholder="Search names, studios, specialties" value="${esc(S.q)}" autocomplete="off"></label>
      <div class="switch"><div><div class="l">People like me</div><div class="d">${S.plm ? 'Sorted by similarity, nothing hidden' : 'Alphabetical'}</div></div><button class="tog" role="switch" aria-checked="${S.plm}" aria-label="People like me" data-plm></button></div>
      ${list.length ? list.map(({ p, s }) => { const ly = likeYou(p); return `
        <button class="card" data-open="${p.id}">
          ${av(p.id, p.name)}
          <div>
            <div class="name">${esc(p.name)} ${lic(p)}${S.follows.has(p.id) ? '<span class="badge muted">following</span>' : ''}</div>
            <div class="meta">${esc(p.studio)} · ${p.budget}</div>
            <div class="tags">${p.tags.map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>
            <div class="stats"><span><b>${ly.lk}</b> of <b>${ly.n}</b> reviews from people like you</span><span><b>${ly.lk ? Math.round(ly.rb / ly.lk * 100) + '%' : '–'}</b> would rebook</span></div>
          </div>
          ${ring(s)}
          ${p.moved ? `<div class="moved">↪ ${esc(p.moved)}</div>` : ''}
        </button>`; }).join('') : '<div class="empty">No one matches that search yet. Ask the community on the Ask tab.</div>'}
      <div class="note"><b>Why this works:</b> one directory serves every segment. Segmentation is a lens over shared listings, weighted per vertical, so no segment ever lands in an empty room.</div>`;
  }

  function provider(id) {
    const p = D.PROVIDERS.find(x => x.id === id); if (!p) { S.open = null; return find(); }
    const s = score(p), keys = Object.keys(D.WEIGHTS[p.vert]);
    const rs = D.REVIEWS.filter(r => r.p === id).map(r => ({ r, m: D.MEMBERS[r.m], s: sim(p.vert, S.you, D.MEMBERS[r.m].f) })).sort((a, b) => b.s - a.s);
    const ly = likeYou(p), fol = S.follows.has(id);
    return `
      <button class="back" data-back>← ${D.VERTICALS[p.vert]}</button>
      <div class="phead">${av(p.id, p.name, 'big')}<div><h1>${esc(p.name)}</h1><div class="meta" style="color:var(--muted);font-size:13px;margin-top:2px">${esc(p.studio)} · ${p.budget} · ${lic(p)}</div></div>${ring(s)}</div>
      ${p.moved ? `<div class="moved" style="margin-top:12px">↪ ${esc(p.moved)}. ${fol ? 'You will hear about the next move.' : 'Follow to hear about the next move.'}</div>` : ''}
      <div class="tags" style="margin-top:12px">${p.tags.map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>
      <div class="actions">
        <button class="btn ${fol ? '' : 'primary'}" data-follow="${p.id}">${fol ? '✓ Following' : 'Follow'}</button>
        <button class="btn" data-toast="Booking opens in ${esc(p.book)}. The directory never owns the calendar.">Book via ${esc(p.book)} ↗</button>
        <button class="btn ghost" data-ask="${p.id}">Ask about ${esc(p.name.split(' ')[0])}</button>
      </div>
      <div class="stats" style="margin-top:0"><span><b>${ly.lk}</b> of <b>${ly.n}</b> reviews from people like you</span><span><b>${ly.lk ? Math.round(ly.rb / ly.lk * 100) + '%' : '–'}</b> would rebook</span></div>
      <h2>Reviews, people like you first</h2>
      <p class="sub">Sorted by how much each reviewer shares your ${keys.map(k => D.FACETS.find(f => f.k === k).label.toLowerCase()).join(', ')}. Others are dimmed, never hidden.</p>
      <div class="legend"><span><i></i>matches your facet</span><span>verified = tied to a real transaction in the spend tracker</span></div>
      ${rs.map(({ r, m, s }) => `
        <div class="review ${s < LIKE ? 'dim' : ''}">
          ${av('m' + m.name, m.name)}
          <div>
            <div class="who"><span><b>${esc(m.name)}</b> · ${r.when} · $${r.price} · ${r.rebook ? 'would rebook' : 'would not rebook'}</span>${r.v ? '<span class="badge">verified spend</span>' : '<span class="badge muted">unverified</span>'}</div>
            ${snap(p.vert, m.f, s)}
            <p>${esc(r.t)}</p>
          </div>
        </div>`).join('')}`;
  }

  function ask() {
    const list = S.posts.filter(p => S.feedVert === 'all' || p.vert === S.feedVert)
      .map(p => ({ p, m: p.m === 'you' ? { name:'You', f:p.f } : D.MEMBERS[p.m], s: sim(p.vert, S.you, p.m === 'you' ? p.f : D.MEMBERS[p.m].f) }));
    if (S.plm) list.sort((a, b) => b.s - a.s);
    const target = S.feedVert === 'all' ? S.vert : S.feedVert;
    return `
      <div class="eyebrow">One feed · every segment</div>
      <h1>Ask people like you</h1>
      <p class="sub">Every post carries a frozen snapshot of the author's facets, so answers come from the right people even after your hair changes.</p>
      <div class="composer">
        <textarea id="q-text" placeholder="${esc(S.you.hair)} ${esc(S.you.tex)} ${esc(S.you.chem)} in ${esc(S.you.hood)}: who does your…"></textarea>
        <div class="foot">${snap(target, S.you)}<button class="btn primary" data-post="${target}">Post</button></div>
      </div>
      <div class="chipgrid" style="margin-bottom:12px"><button class="chip small ${S.feedVert === 'all' ? 'on' : ''}" data-feed="all">All</button>${Object.entries(D.VERTICALS).map(([v, l]) => `<button class="chip small ${S.feedVert === v ? 'on' : ''}" data-feed="${v}">${l}</button>`).join('')}</div>
      <div class="switch"><div><div class="l">People like me first</div><div class="d">Distant segments dim instead of disappearing</div></div><button class="tog" role="switch" aria-checked="${S.plm}" aria-label="People like me first" data-plm></button></div>
      ${list.map(({ p, m, s }) => { const pv = p.pv ? D.PROVIDERS.find(x => x.id === p.pv) : null; const text = pv ? esc(p.t).replace(esc(pv.name), `<button class="pv" data-open="${pv.id}">${esc(pv.name)}</button>`) : esc(p.t); return `
        <div class="post ${s < .4 ? 'dim' : ''}">
          ${av('m' + m.name, m.name)}
          <div>
            <div class="who"><b>${esc(m.name)}</b> · ${p.when} · ${D.VERTICALS[p.vert]} ${p.kind === 'move' ? '<span class="badge warn">provider moved</span>' : ''}</div>
            ${snap(p.vert, m.f, s)}
            <p>${text}</p>
            <div class="foot"><span>${p.replies} ${p.replies === 1 ? 'reply' : 'replies'}</span>${pv ? `<span>linked to ${esc(pv.name)}'s page</span>` : ''}</div>
          </div>
        </div>`; }).join('')}`;
  }

  function upkeep() {
    return `
      <div class="eyebrow">Ops for body</div>
      <h1>Upkeep</h1>
      <p class="sub">Recurring maintenance pulled from bookings and spend. Rebook in one tap when the provider is on the directory.</p>
      ${D.UPKEEP.map(o => `<div class="up ${o.state}"><div class="stripe"></div><div><div class="n">${esc(o.n)}</div><div class="m">${esc(o.m)}</div></div>${o.pv ? `<button class="due" data-open="${o.pv}" title="Open provider">${esc(o.due)} →</button>` : `<span class="due">${esc(o.due)}</span>`}</div>`).join('')}
      <div class="note">Later layers land here: labs and biomarkers on the same timeline, and the spend tracker correlating what you paid with what actually changed.</div>`;
  }

  function me() {
    return `
      <div class="eyebrow">Your facets · stored on this device only</div>
      <h1>People like you</h1>
      <p class="sub">Each facet changes who counts as "like you" across the whole app. All optional. Providers never see them and can never filter by them.</p>
      ${D.FACETS.map(f => `
        <div class="facet"><div class="h"><b>${f.label}</b><span>${esc(S.you[f.k])}</span></div>
        <div class="chipgrid" role="radiogroup" aria-label="${f.label}">${f.opts.map(o => `<button class="chip small ${S.you[f.k] === o ? 'on' : ''}" role="radio" aria-checked="${S.you[f.k] === o}" data-facet="${f.k}" data-val="${esc(o)}">${esc(o)}</button>`).join('')}</div>
        <div class="hint">${f.hint}</div></div>`).join('')}
      <div class="actions"><button class="btn" data-reset>Reset to the demo profile</button></div>
      <div class="note"><b>Try it:</b> set hair to 4c and texture to coarse, then open Find. Dani Okafor jumps to the top and Mei Lin Chou's reviews dim. Set eye shape to hooded and Cora Whitfield wins brow &amp; lash.</div>`;
  }

  // ---------- Render ----------
  const SCREENS = { find, ask, upkeep, me };
  function render() {
    $('#screen').innerHTML = SCREENS[S.tab]();
    document.querySelectorAll('[data-tab]').forEach(b => b.classList.toggle('on', b.dataset.tab === S.tab));
    $('#you-summary').textContent = youSummary();
    $('#side-facets').innerHTML = D.FACETS.map(f => `<span>${esc(S.you[f.k])}</span>`).join('');
    document.title = `People Like Me · ${{ find:'Find', ask:'Ask', upkeep:'Upkeep', me:'Me' }[S.tab]}`;
  }
  let toastT;
  function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2200); }
  const scrollTop = () => window.scrollTo({ top:0 });

  // ---------- Events ----------
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-tab],[data-vert],[data-feed],[data-open],[data-back],[data-plm],[data-follow],[data-post],[data-facet],[data-reset],[data-toast],[data-ask]');
    if (!t) return;
    const d = t.dataset;
    if (d.tab) { S.tab = d.tab; S.open = null; scrollTop(); }
    else if (d.vert) { S.vert = d.vert; S.q = ''; }
    else if (d.feed) { S.feedVert = d.feed; }
    else if (d.open) { S.open = d.open; S.tab = 'find'; scrollTop(); }
    else if ('back' in d) { S.open = null; }
    else if ('plm' in d) { S.plm = !S.plm; }
    else if (d.follow) { S.follows.has(d.follow) ? S.follows.delete(d.follow) : S.follows.add(d.follow); toast(S.follows.has(d.follow) ? 'Following. You will hear when they move.' : 'Unfollowed.'); }
    else if (d.ask) { const p = D.PROVIDERS.find(x => x.id === d.ask); S.tab = 'ask'; S.feedVert = p.vert; S.open = null; render(); $('#q-text').value = `Has anyone with ${S.you[Object.keys(D.WEIGHTS[p.vert])[0]]} ${D.FACETS.find(f => f.k === Object.keys(D.WEIGHTS[p.vert])[0]).label.toLowerCase()} been to ${p.name}? `; $('#q-text').focus(); return; }
    else if (d.post) { const ta = $('#q-text'); const q = ta.value.trim(); if (!q) { ta.focus(); return; } S.posts.unshift({ id:'you' + Date.now(), m:'you', f:{ ...S.you }, when:'now', vert:d.post, replies:0, t:q }); toast('Posted with your facet snapshot.'); }
    else if (d.facet) { S.you[d.facet] = d.val; save(); }
    else if ('reset' in d) { S.you = { ...D.DEFAULT_YOU }; save(); toast('Back to the demo profile.'); }
    else if (d.toast) { toast(d.toast); return; }
    render();
  });
  document.addEventListener('input', e => { if (e.target.id === 'q') { S.q = e.target.value; const pos = e.target.selectionStart; render(); const el = $('#q'); el.focus(); el.setSelectionRange(pos, pos); } });

  render();
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});
})();
