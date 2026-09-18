// People Like Me — example data. Every provider, member and review here is invented for the demo.
window.PLM_DATA = (() => {
  const HAIR = ['1a','1b','1c','2a','2b','2c','3a','3b','3c','4a','4b','4c'];
  const TEX = ['fine','medium','coarse'];
  const CHEM = ['virgin','color-treated','relaxed','keratin'];
  const SKIN = ['I','II','III','IV','V','VI'];
  const UNDER = ['cool','neutral','warm','olive'];
  const EYE = ['monolid','hooded','almond','round','deep-set','downturned'];
  const HOOD = ['Williamsburg','Greenpoint','LES','SoHo','West Village','Chelsea','UES','UWS'];
  const BUDGET = ['$','$$','$$$'];

  const FACETS = [
    { k:'hair',   label:'Hair type',          opts:HAIR,   hint:'Andre Walker scale, 1a straight to 4c coily.' },
    { k:'tex',    label:'Hair texture',       opts:TEX,    hint:'Strand thickness, not density.' },
    { k:'chem',   label:'Chemical history',   opts:CHEM,   hint:'What is on your hair right now.' },
    { k:'skin',   label:'Skin tone',          opts:SKIN,   hint:'Fitzpatrick I (very fair) to VI (deep).' },
    { k:'under',  label:'Undertone',          opts:UNDER,  hint:'Vein test: blue is cool, green is warm, both is neutral.' },
    { k:'eye',    label:'Eye shape',          opts:EYE,    hint:'The highest-signal facet for lash and brow work.' },
    { k:'hood',   label:'Neighborhood',       opts:HOOD,   hint:'Where you actually want to go.' },
    { k:'budget', label:'Budget band',        opts:BUDGET, hint:'$ under 80, $$ 80 to 200, $$$ over 200 per visit.' },
  ];

  // Which facets decide the outcome, per vertical.
  const WEIGHTS = {
    colorist: { hair:.35, tex:.25, chem:.25, hood:.10, budget:.05 },
    nails:    { hood:.40, budget:.30, skin:.20, under:.10 },
    brows:    { eye:.45, skin:.20, hood:.20, budget:.15 },
  };
  const VERTICALS = { colorist:'Colorists', nails:'Nail techs', brows:'Brow & lash' };
  const SINGULAR = { colorist:'colorist', nails:'nail tech', brows:'brow or lash tech' };

  const DEFAULT_YOU = { hair:'2a', tex:'fine', chem:'color-treated', skin:'III', under:'warm', eye:'monolid', hood:'Williamsburg', budget:'$$' };

  const PROVIDERS = [
    { id:'p1', vert:'colorist', name:'Dani Okafor', studio:'Suite 4, Greenpoint', hood:'Greenpoint', budget:'$$$', lic:true, exp:{hair:['3c','4a','4b','4c'],chem:['virgin','color-treated'],tex:['coarse','medium']}, tags:['gloss on 4C','lived-in color on coily hair','silk press'], moved:'Was at Bushwick Color Bar until Aug 2026', book:'Booksy' },
    { id:'p2', vert:'colorist', name:'Mei Lin Chou', studio:'Lin Studio, LES', hood:'LES', budget:'$$$', lic:true, exp:{hair:['1b','1c','2a','2b'],chem:['virgin','color-treated','keratin'],tex:['fine','medium']}, tags:['lived-in balayage on level 2 Asian hair','fine-hair toning','cool ash without brass'], book:'Square' },
    { id:'p3', vert:'colorist', name:'Sasha Reyes', studio:'Warren St Collective, Williamsburg', hood:'Williamsburg', budget:'$$', lic:true, exp:{hair:['2a','2b','2c','3a'],chem:['color-treated','relaxed'],tex:['fine','medium','coarse']}, tags:['money-piece + gloss','wavy hair cutting','warm brunette'], book:'Fresha' },
    { id:'p4', vert:'colorist', name:'Priya Nair', studio:'Chair rental, UES', hood:'UES', budget:'$$', lic:false, exp:{hair:['1a','1b','2a'],chem:['virgin','keratin'],tex:['coarse','medium']}, tags:['gray coverage on dark hair','keratin-safe color','South Asian hair'], book:'Instagram DM' },
    { id:'p5', vert:'nails', name:'Jules Tran', studio:'Home studio, Williamsburg', hood:'Williamsburg', budget:'$$', lic:true, exp:{skin:['II','III','IV'],under:['warm','olive']}, tags:['builder gel','sheer nudes for olive undertones','no e-file damage'], book:'Booksy' },
    { id:'p6', vert:'nails', name:'Renata Silva', studio:'Bowery Nails, LES', hood:'LES', budget:'$', lic:true, exp:{skin:['IV','V','VI'],under:['warm','neutral']}, tags:['chrome + cat-eye','deep-skin nude matching','structured manicure'], book:'Square' },
    { id:'p7', vert:'nails', name:'Hana Kim', studio:'Studio K, SoHo', hood:'SoHo', budget:'$$$', lic:true, exp:{skin:['I','II','III'],under:['cool','neutral']}, tags:['Korean gel art','short-nail shaping','milky pinks'], moved:'Moved from Chelsea in Jul 2026', book:'Fresha' },
    { id:'p8', vert:'brows', name:'Aya Nakamura', studio:'Brow room, SoHo', hood:'SoHo', budget:'$$$', lic:true, exp:{eye:['monolid','hooded'],skin:['II','III','IV']}, tags:['lash lift on straight lashes','monolid mapping','brow lamination for sparse brows'], book:'Booksy' },
    { id:'p9', vert:'brows', name:'Tasha Bell', studio:'Greenpoint Ave', hood:'Greenpoint', budget:'$$', lic:true, exp:{eye:['almond','round','downturned'],skin:['IV','V','VI']}, tags:['wispy hybrids','henna brows on deep skin','threading'], book:'Square' },
    { id:'p10', vert:'brows', name:'Cora Whitfield', studio:'W 4th St, West Village', hood:'West Village', budget:'$$', lic:true, exp:{eye:['hooded','deep-set'],skin:['I','II','III']}, tags:['hooded-eye lash mapping','microblading on light brows','tint only'], book:'Fresha' },
  ];

  const MEMBERS = {
    m1:{ name:'Renée',    f:{hair:'4b',tex:'coarse',chem:'color-treated',skin:'V', under:'warm',   eye:'almond',    hood:'Greenpoint',  budget:'$$$'} },
    m2:{ name:'Grace',    f:{hair:'2a',tex:'fine',  chem:'color-treated',skin:'III',under:'warm',   eye:'monolid',   hood:'LES',         budget:'$$$'} },
    m3:{ name:'Ines',     f:{hair:'2c',tex:'medium',chem:'virgin',       skin:'IV', under:'olive',  eye:'hooded',    hood:'Williamsburg',budget:'$$'} },
    m4:{ name:'Priyanka', f:{hair:'1b',tex:'coarse',chem:'keratin',      skin:'IV', under:'warm',   eye:'round',     hood:'UES',         budget:'$$'} },
    m5:{ name:'Ji-woo',   f:{hair:'1a',tex:'fine',  chem:'color-treated',skin:'II', under:'cool',   eye:'monolid',   hood:'SoHo',        budget:'$$$'} },
    m6:{ name:'Amara',    f:{hair:'4c',tex:'coarse',chem:'virgin',       skin:'VI', under:'neutral',eye:'downturned',hood:'Greenpoint',  budget:'$$'} },
    m7:{ name:'Lena',     f:{hair:'2b',tex:'fine',  chem:'color-treated',skin:'II', under:'cool',   eye:'hooded',    hood:'West Village',budget:'$$'} },
  };

  const REVIEWS = [
    { p:'p1', m:'m1', v:true,  rebook:true,  price:260, when:'Aug 2026', t:'Gloss and trim. First colorist who did not try to "soften" my texture. Toned exactly to the swatch.' },
    { p:'p1', m:'m6', v:true,  rebook:true,  price:180, when:'Jul 2026', t:'Silk press without heat damage. Back to curls in one wash.' },
    { p:'p1', m:'m3', v:false, rebook:false, price:240, when:'Jun 2026', t:'Great at what she does, but my 2c waves are not her lane. Ended up brassier than I wanted.' },
    { p:'p2', m:'m2', v:true,  rebook:true,  price:420, when:'Aug 2026', t:'Lived-in balayage that stayed ash for eight weeks on fine hair. Zero breakage.' },
    { p:'p2', m:'m5', v:true,  rebook:true,  price:380, when:'Jul 2026', t:'Understands level 2 lift on Asian hair. No orange stage, no drama.' },
    { p:'p2', m:'m1', v:false, rebook:false, price:400, when:'May 2026', t:'Lovely studio, but she said herself she does not do much with 4b. Honest, so I left.' },
    { p:'p3', m:'m3', v:true,  rebook:true,  price:210, when:'Sep 2026', t:'Money piece and gloss. Understood wavy hair and cut it dry.' },
    { p:'p3', m:'m2', v:true,  rebook:true,  price:190, when:'Aug 2026', t:'Solid gloss, close to home, cheaper than LES. Not as precise on ash as Mei but most of the way there.' },
    { p:'p3', m:'m7', v:true,  rebook:false, price:200, when:'Jun 2026', t:'Fine. Nothing wrong, just not worth switching from my old colorist.' },
    { p:'p4', m:'m4', v:true,  rebook:true,  price:150, when:'Aug 2026', t:'Only person who covers my grays without turning them red. Keratin-safe.' },
    { p:'p5', m:'m3', v:true,  rebook:true,  price:85,  when:'Sep 2026', t:'Sheer nude that matches an olive undertone. Builder gel lasted four weeks.' },
    { p:'p5', m:'m2', v:true,  rebook:true,  price:90,  when:'Aug 2026', t:'No e-file on the natural nail, which is rare. Walkable from the L.' },
    { p:'p6', m:'m1', v:true,  rebook:true,  price:60,  when:'Aug 2026', t:'Deep-skin nude matching is a real skill and she has it. Best value in LES.' },
    { p:'p6', m:'m6', v:true,  rebook:true,  price:65,  when:'Jul 2026', t:'Structured mani, chrome held three weeks.' },
    { p:'p7', m:'m5', v:true,  rebook:true,  price:140, when:'Sep 2026', t:'Korean gel art on short nails. Milky pink, perfect for a cool undertone.' },
    { p:'p7', m:'m7', v:false, rebook:true,  price:130, when:'Jun 2026', t:'Pricey, but the shaping on short nails is unmatched.' },
    { p:'p8', m:'m5', v:true,  rebook:true,  price:160, when:'Aug 2026', t:'Lash lift on straight monolid lashes finally held a curl. Mapping is the difference.' },
    { p:'p8', m:'m2', v:true,  rebook:true,  price:150, when:'Jul 2026', t:'Brow lamination on sparse brows. She did not over-fluff them.' },
    { p:'p8', m:'m1', v:true,  rebook:false, price:160, when:'May 2026', t:'Good technician, but her lash maps are built for monolids and my almond eyes read heavy.' },
    { p:'p9', m:'m6', v:true,  rebook:true,  price:95,  when:'Sep 2026', t:'Henna brows on deep skin without the ashy cast. Wispy hybrids look natural.' },
    { p:'p9', m:'m1', v:true,  rebook:true,  price:110, when:'Aug 2026', t:'Threading is fast and clean. Hybrids lasted three weeks.' },
    { p:'p10', m:'m7', v:true, rebook:true,  price:120, when:'Aug 2026', t:'Hooded-eye mapping so the lashes show when my eyes are open. First time anyone got it.' },
    { p:'p10', m:'m3', v:true, rebook:true,  price:115, when:'Jul 2026', t:'Tint only, no drama, understood hooded lids.' },
  ];

  const POSTS = [
    { id:'q1', m:'m1', when:'2h',  vert:'colorist', kind:'move', pv:'p1',  replies:6,  t:'Dani Okafor moved from Bushwick Color Bar to a suite in Greenpoint. Same prices, no more walk-in chaos. Updated her profile.' },
    { id:'q2', m:'m2', when:'5h',  vert:'colorist', replies:9,  t:'2a fine color-treated in LES: does anyone have a gloss that stays ash past week six? Mei Lin is perfect but $420 every eight weeks adds up.' },
    { id:'q3', m:'m5', when:'1d',  vert:'brows',    pv:'p8',  replies:4,  t:'Monolid lash-lift people: Aya Nakamura at the SoHo brow room is the only one who has held a curl on my straight lashes. Mapping is the whole thing.' },
    { id:'q4', m:'m6', when:'1d',  vert:'nails',    pv:'p6',  replies:3,  t:'4c virgin, VI neutral, Greenpoint: Renata Silva has the best deep-skin nude match I have had in NYC. $65.' },
    { id:'q5', m:'m3', when:'2d',  vert:'colorist', pv:'p3',  replies:11, t:'Heads up for wavy 2c hair: Dani is incredible on coils but my gloss came out brass. Not her lane, she said so herself. Sasha Reyes in Williamsburg was the fix.' },
    { id:'q6', m:'m7', when:'3d',  vert:'brows',    pv:'p10', replies:5,  t:'Hooded eyes: Cora Whitfield on W 4th maps so the lashes actually show when your eyes are open. $120 well spent.' },
  ];

  const UPKEEP = [
    { n:'Brow tint + lamination', m:'Aya Nakamura · every 6 weeks', due:'in 4 days',   state:'soon', pv:'p8' },
    { n:'Gloss refresh',          m:'Mei Lin Chou · every 8 weeks', due:'12 days over', state:'over', pv:'p2' },
    { n:'Builder gel fill',       m:'Jules Tran · every 4 weeks',   due:'in 11 days',  state:'ok',   pv:'p5' },
    { n:'Tretinoin refill',       m:'Derm · every 3 months',        due:'in 2 weeks',  state:'ok' },
    { n:'Dentist cleaning',       m:'Every 6 months',               due:'in 5 weeks',  state:'ok' },
    { n:'Annual labs',            m:'Ferritin, vitamin D, thyroid', due:'in 9 weeks',  state:'ok' },
  ];

  return { HAIR, TEX, SKIN, BUDGET, FACETS, WEIGHTS, VERTICALS, SINGULAR, DEFAULT_YOU, PROVIDERS, MEMBERS, REVIEWS, POSTS, UPKEEP };
})();
