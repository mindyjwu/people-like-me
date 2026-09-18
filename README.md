# People Like Me

A vetted provider directory plus a community for women who invest in themselves, organized around the facets that decide whether advice actually works for you: hair type, texture and chemical history, skin tone and undertone, eye shape, neighborhood, budget.

Reddit, TikTok and group chats serve this need badly because the advice is not segmented by those variables. Providers churn (nail techs move, colorists relocate), so re-discovery is recurring, not one-time. This is the second layer on top of a self-investment spend tracker; verified spend is what makes reviews trustworthy.

**Live demo:** https://mindyjwu.github.io/people-like-me/ · **Playbook:** https://mindyjwu.github.io/people-like-me/playbook.html

## What the demo shows

- **Find.** Ten example NYC providers across colorists, nail techs and brow/lash. "People like me" ranks them by a per-vertical weighted similarity over your facets. Hair facets carry the weight for colorists, eye shape for lash, neighborhood and undertone for nails. Nothing is hidden, only reordered.
- **Provider pages.** Reviews sort by how closely the reviewer's frozen facet snapshot matches yours. Non-matching reviews dim rather than disappear. Verified-spend badges come from the spend tracker. Booking links out; the directory never owns the calendar.
- **Ask.** One feed for every segment. Each post carries the author's facet snapshot and a match score, and provider mentions link to the provider page. Provider moves are a first-class post type.
- **Upkeep.** A sketch of the ops-for-body layer: recurring brows, gloss, nails, refills, dentist, labs.
- **Me.** Change a facet and every score in the app recomputes. Facets are stored in `localStorage` only.

## The mechanic

```
score(provider) = Σ weight[vertical][facet] × match(you[facet], provider[facet])
```

`match` gives full credit for an exact match and partial credit for adjacent ordinal values (hair 2a vs 2b, Fitzpatrick III vs IV). Providers tag what they are *experienced with*; the closest value they cover stands in for their facet. Reviewers count as "people like you" above a 0.6 similarity. Weights live in [`data.js`](data.js) under `WEIGHTS`.

Providers never see or filter by member facets. Members self-segment. Under the NYC Human Rights Law the opposite design is a liability.

## Run it

No build step. Open `index.html`, or serve the folder:

```bash
python3 -m http.server 4900
```

Installable as a PWA (manifest plus a cache-first service worker), works offline after first load, responsive from 360px phones to desktop, light and dark themes.

## Deploy

Static files. GitHub Pages, Vercel, Netlify or Cloudflare Pages all work with zero config. For GitHub Pages: Settings → Pages → Deploy from branch `main`, folder `/ (root)`.

## Files

| File | What |
|---|---|
| `index.html` | Shell: sidebar on desktop, tab bar on mobile |
| `app.js` | Similarity engine, screens, events |
| `data.js` | Facet vocabulary, weights, example providers, members, reviews, posts |
| `styles.css` | Tokens for both themes, layout, components |
| `playbook.html` | The execution plan: supply, taxonomy, cold start, moderation, 90 days, risks |
| `sw.js`, `manifest.webmanifest`, `icons/` | PWA |

Every provider, member and review is invented for the demo. Nothing here is a real business or person.
