/* ═══════════════════════════════════════════════════════════════
   MIDNIGHT BILLIARDS — script.js  v3 Premium Progression
═══════════════════════════════════════════════════════════════ */
'use strict';
// ── Constants ──────────────────────────────────────────────────
const BALL_RADIUS = 11;
const FRICTION = 0.986;
const MIN_SPEED = 0.08;
const POCKET_RADIUS = 17;
const CUSHION_BOUNCE = 0.72;
const BALL_BOUNCE = 0.88;
const MAX_POWER = 22;
const CUSHION = 34;
// ── Rarity Config ──────────────────────────────────────────────
const RARITIES = {
  common:    { label: 'Common',    color: '#8a8a8a', glow: 'rgba(138,138,138,0.3)' },
  uncommon:  { label: 'Uncommon',  color: '#2ecc71', glow: 'rgba(46,204,113,0.3)' },
  rare:      { label: 'Rare',      color: '#3498db', glow: 'rgba(52,152,219,0.3)' },
  epic:      { label: 'Epic',      color: '#9b59b6', glow: 'rgba(155,89,182,0.3)' },
  legendary: { label: 'Legendary', color: '#f39c12', glow: 'rgba(243,156,18,0.3)' },
  mythic:    { label: 'Mythic',    color: '#e74c3c', glow: 'rgba(231,76,60,0.4)' },
};
// ── Ball Colors ────────────────────────────────────────────────
const BALL_COLORS = {
  1:{color:'#f5c518',stripe:false},2:{color:'#1a55c0',stripe:false},
  3:{color:'#cc2200',stripe:false},4:{color:'#6a1fc2',stripe:false},
  5:{color:'#e87a10',stripe:false},6:{color:'#1a8c2a',stripe:false},
  7:{color:'#7a1515',stripe:false},8:{color:'#111111',stripe:false},
  9:{color:'#f5c518',stripe:true},10:{color:'#1a55c0',stripe:true},
  11:{color:'#cc2200',stripe:true},12:{color:'#6a1fc2',stripe:true},
  13:{color:'#e87a10',stripe:true},14:{color:'#1a8c2a',stripe:true},
  15:{color:'#7a1515',stripe:true},
  16:{color:'#ff2020',stripe:false},17:{color:'#f0f0e8',stripe:false},
  18:{color:'#1a8c2a',stripe:false},19:{color:'#8B4513',stripe:false},
  20:{color:'#1a55c0',stripe:false},21:{color:'#ff69b4',stripe:false},
  22:{color:'#111111',stripe:false},
};
// ── XP Table ───────────────────────────────────────────────────
function xpForLevel(lvl) { return Math.floor(200 * Math.pow(lvl, 1.4)); }
// ── Cue Sticks Database (200+) ────────────────────────────────
const CUES_DB = (() => {
  const cueData = [
    // Common (50)
    {id:'oak_classic',name:'Oak Classic',rarity:'common',price:0,emoji:'🎱',desc:'A trusty oak cue for beginners.'},
    {id:'maple_standard',name:'Maple Standard',rarity:'common',price:100,emoji:'🟤',desc:'Smooth maple grain.'},
    {id:'ash_basic',name:'Ash Basic',rarity:'common',price:120,emoji:'🪵',desc:'Lightweight ash cue.'},
    {id:'pine_starter',name:'Pine Starter',rarity:'common',price:80,emoji:'🌲',desc:'A classic pine cue.'},
    {id:'birch_slim',name:'Birch Slim',rarity:'common',price:110,emoji:'🌳',desc:'Slim birch profile.'},
    {id:'walnut_plain',name:'Walnut Plain',rarity:'common',price:130,emoji:'🫘',desc:'Dark walnut finish.'},
    {id:'cedar_craft',name:'Cedar Craft',rarity:'common',price:90,emoji:'🪵',desc:'Handcrafted cedar.'},
    {id:'poplar_lite',name:'Poplar Lite',rarity:'common',price:100,emoji:'🌿',desc:'Featherlight poplar.'},
    {id:'hickory_grip',name:'Hickory Grip',rarity:'common',price:140,emoji:'🎋',desc:'Great grip control.'},
    {id:'spruce_tip',name:'Spruce Tip',rarity:'common',price:115,emoji:'🌄',desc:'Premium spruce tip.'},
    {id:'teak_basic',name:'Teak Basic',rarity:'common',price:125,emoji:'🏗',desc:'Durable teak build.'},
    {id:'bamboo_lean',name:'Bamboo Lean',rarity:'common',price:100,emoji:'🎍',desc:'Sustainable bamboo.'},
    {id:'ebony_entry',name:'Ebony Entry',rarity:'common',price:160,emoji:'🖤',desc:'Ebony accented tip.'},
    {id:'rosewood_plain',name:'Rosewood Plain',rarity:'common',price:150,emoji:'🌹',desc:'Rich rosewood tone.'},
    {id:'cherry_basic',name:'Cherry Basic',rarity:'common',price:130,emoji:'🍒',desc:'Classic cherry wood.'},
    {id:'iron_training',name:'Iron Training',rarity:'common',price:170,emoji:'⚙️',desc:'Steel-wrapped tip.'},
    {id:'silver_ring',name:'Silver Ring',rarity:'common',price:155,emoji:'💍',desc:'Silver ring ferrule.'},
    {id:'two_piece_a',name:'Two-Piece A',rarity:'common',price:140,emoji:'🔗',desc:'Convenient two-piece.'},
    {id:'linen_wrap',name:'Linen Wrap',rarity:'common',price:110,emoji:'🧵',desc:'Linen wrapped grip.'},
    {id:'leather_tip_a',name:'Leather Tip A',rarity:'common',price:120,emoji:'🥋',desc:'Soft leather tip.'},
    {id:'chalked_blue',name:'Chalked Blue',rarity:'common',price:95,emoji:'💙',desc:'Pre-chalked finish.'},
    {id:'chalked_green',name:'Chalked Green',rarity:'common',price:95,emoji:'💚',desc:'Pre-chalked green.'},
    {id:'chalked_red',name:'Chalked Red',rarity:'common',price:95,emoji:'❤️',desc:'Pre-chalked red.'},
    {id:'natural_grain',name:'Natural Grain',rarity:'common',price:105,emoji:'🪨',desc:'Raw natural grain.'},
    {id:'brass_collar',name:'Brass Collar',rarity:'common',price:135,emoji:'🔶',desc:'Brass collar detail.'},
    {id:'copper_tip',name:'Copper Tip',rarity:'common',price:145,emoji:'🔷',desc:'Copper tipped end.'},
    {id:'dual_tone',name:'Dual Tone',rarity:'common',price:130,emoji:'🎨',desc:'Two-tone wood.'},
    {id:'sport_line',name:'Sport Line',rarity:'common',price:120,emoji:'🏃',desc:'Sporty pinstripe.'},
    {id:'club_standard',name:'Club Standard',rarity:'common',price:140,emoji:'🎳',desc:'Official club grade.'},
    {id:'house_cue',name:'House Cue',rarity:'common',price:50,emoji:'🏠',desc:'The classic house cue.'},
    {id:'pearl_white',name:'Pearl White',rarity:'common',price:160,emoji:'🤍',desc:'Pearl white finish.'},
    {id:'matte_black',name:'Matte Black',rarity:'common',price:160,emoji:'🖤',desc:'Matte black design.'},
    {id:'graphite_a',name:'Graphite A',rarity:'common',price:150,emoji:'🔋',desc:'Graphite fiber weave.'},
    {id:'carbon_basic',name:'Carbon Basic',rarity:'common',price:170,emoji:'⚫',desc:'Entry carbon shaft.'},
    {id:'ivory_tip',name:'Ivory Tip',rarity:'common',price:140,emoji:'🦷',desc:'Ivory colored tip.'},
    {id:'varnished_a',name:'Varnished A',rarity:'common',price:110,emoji:'✨',desc:'High gloss varnish.'},
    {id:'antique_pool',name:'Antique Pool',rarity:'common',price:180,emoji:'🏺',desc:'Vintage styled cue.'},
    {id:'straight_shot',name:'Straight Shot',rarity:'common',price:125,emoji:'➡️',desc:'Perfectly balanced.'},
    {id:'beginner_pro',name:'Beginner Pro',rarity:'common',price:130,emoji:'🎓',desc:'Pro tips for newbies.'},
    {id:'simple_stripe',name:'Simple Stripe',rarity:'common',price:105,emoji:'〰️',desc:'Clean striped body.'},
    {id:'felt_green',name:'Felt Green',rarity:'common',price:115,emoji:'🍀',desc:'Matches the table.'},
    {id:'cotton_wrap',name:'Cotton Wrap',rarity:'common',price:100,emoji:'🧶',desc:'Soft cotton wrap.'},
    {id:'nylon_shaft',name:'Nylon Shaft',rarity:'common',price:135,emoji:'🔩',desc:'Nylon reinforced shaft.'},
    {id:'dark_cherry',name:'Dark Cherry',rarity:'common',price:155,emoji:'🍇',desc:'Deep dark cherry wood.'},
    {id:'light_maple',name:'Light Maple',rarity:'common',price:120,emoji:'🌰',desc:'Light maple wood.'},
    {id:'medium_oak',name:'Medium Oak',rarity:'common',price:125,emoji:'🟤',desc:'Medium weight oak.'},
    {id:'novice_plus',name:'Novice Plus',rarity:'common',price:145,emoji:'📚',desc:'Enhanced novice cue.'},
    {id:'practice_a',name:'Practice A',rarity:'common',price:90,emoji:'🏋️',desc:'Daily practice cue.'},
    {id:'practice_b',name:'Practice B',rarity:'common',price:90,emoji:'🏋️',desc:'Second practice cue.'},
    {id:'entry_gold',name:'Entry Gold',rarity:'common',price:175,emoji:'🥉',desc:'Bronze-gold trim.'},
    // Uncommon (40)
    {id:'silver_cue',name:'Silver Cue',rarity:'uncommon',price:300,emoji:'🥈',desc:'Sleek silver design.'},
    {id:'carbon_elite',name:'Carbon Elite',rarity:'uncommon',price:350,emoji:'⚡',desc:'Full carbon shaft build.'},
    {id:'midnight_blue',name:'Midnight Blue',rarity:'uncommon',price:320,emoji:'🌙',desc:'Deep midnight blue.'},
    {id:'forest_green',name:'Forest Green',rarity:'uncommon',price:310,emoji:'🌿',desc:'Forest green lacquer.'},
    {id:'crimson_tip',name:'Crimson Tip',rarity:'uncommon',price:330,emoji:'🔴',desc:'Hot crimson tip.'},
    {id:'ocean_wave',name:'Ocean Wave',rarity:'uncommon',price:340,emoji:'🌊',desc:'Ocean blue wave pattern.'},
    {id:'sunset_blaze',name:'Sunset Blaze',rarity:'uncommon',price:360,emoji:'🌅',desc:'Orange-red gradient.'},
    {id:'charcoal_x',name:'Charcoal X',rarity:'uncommon',price:315,emoji:'💨',desc:'Charcoal matte finish.'},
    {id:'chrome_shaft',name:'Chrome Shaft',rarity:'uncommon',price:370,emoji:'🔧',desc:'Chrome-plated shaft.'},
    {id:'jade_green',name:'Jade Green',rarity:'uncommon',price:325,emoji:'🍃',desc:'Polished jade green.'},
    {id:'royal_blue',name:'Royal Blue',rarity:'uncommon',price:345,emoji:'👑',desc:'Royal blue lacquer.'},
    {id:'tiger_stripe',name:'Tiger Stripe',rarity:'uncommon',price:355,emoji:'🐯',desc:'Tiger striped design.'},
    {id:'leopard_skin',name:'Leopard Skin',rarity:'uncommon',price:365,emoji:'🐆',desc:'Wild leopard print.'},
    {id:'emerald_grip',name:'Emerald Grip',rarity:'uncommon',price:340,emoji:'💎',desc:'Emerald wrapped grip.'},
    {id:'obsidian_tip',name:'Obsidian Tip',rarity:'uncommon',price:330,emoji:'⚫',desc:'Black obsidian tip.'},
    {id:'rose_gold',name:'Rose Gold',rarity:'uncommon',price:390,emoji:'🌸',desc:'Rose gold accents.'},
    {id:'platinum_a',name:'Platinum A',rarity:'uncommon',price:380,emoji:'⬜',desc:'Platinum anodized.'},
    {id:'cobalt_shaft',name:'Cobalt Shaft',rarity:'uncommon',price:320,emoji:'🔵',desc:'Cobalt blue shaft.'},
    {id:'sand_dune',name:'Sand Dune',rarity:'uncommon',price:305,emoji:'🏜️',desc:'Sandy tan design.'},
    {id:'neon_pink',name:'Neon Pink',rarity:'uncommon',price:350,emoji:'💗',desc:'Bright neon pink.'},
    {id:'mint_fresh',name:'Mint Fresh',rarity:'uncommon',price:310,emoji:'🌱',desc:'Cool mint finish.'},
    {id:'lavender_dream',name:'Lavender Dream',rarity:'uncommon',price:330,emoji:'💜',desc:'Soft lavender hue.'},
    {id:'camo_green',name:'Camo Green',rarity:'uncommon',price:315,emoji:'🪖',desc:'Military camo print.'},
    {id:'ice_white',name:'Ice White',rarity:'uncommon',price:325,emoji:'🧊',desc:'Cool ice white.'},
    {id:'fire_orange',name:'Fire Orange',rarity:'uncommon',price:340,emoji:'🔥',desc:'Blazing orange.'},
    {id:'galaxy_swirl',name:'Galaxy Swirl',rarity:'uncommon',price:370,emoji:'🌀',desc:'Galaxy spiral pattern.'},
    {id:'thunderbolt',name:'Thunderbolt',rarity:'uncommon',price:360,emoji:'⚡',desc:'Thunderbolt motif.'},
    {id:'chess_black',name:'Chess Black',rarity:'uncommon',price:345,emoji:'♟️',desc:'Checkered black design.'},
    {id:'chess_white',name:'Chess White',rarity:'uncommon',price:345,emoji:'♙',desc:'Checkered white design.'},
    {id:'turquoise_a',name:'Turquoise A',rarity:'uncommon',price:335,emoji:'🩵',desc:'Caribbean turquoise.'},
    {id:'bronze_tip',name:'Bronze Tip',rarity:'uncommon',price:300,emoji:'🥉',desc:'Bronze coated tip.'},
    {id:'amber_glow',name:'Amber Glow',rarity:'uncommon',price:320,emoji:'🟡',desc:'Warm amber glow.'},
    {id:'onyx_shaft',name:'Onyx Shaft',rarity:'uncommon',price:355,emoji:'🔮',desc:'Black onyx shaft.'},
    {id:'cream_wrap',name:'Cream Wrap',rarity:'uncommon',price:310,emoji:'🍦',desc:'Cream leather wrap.'},
    {id:'dark_steel',name:'Dark Steel',rarity:'uncommon',price:365,emoji:'🗡️',desc:'Brushed dark steel.'},
    {id:'shadow_blue',name:'Shadow Blue',rarity:'uncommon',price:330,emoji:'🌑',desc:'Deep shadow blue.'},
    {id:'sandstorm',name:'Sandstorm',rarity:'uncommon',price:340,emoji:'💨',desc:'Desert sandstorm.'},
    {id:'electric_green',name:'Electric Green',rarity:'uncommon',price:360,emoji:'💚',desc:'Electric neon green.'},
    {id:'wine_red',name:'Wine Red',rarity:'uncommon',price:325,emoji:'🍷',desc:'Deep wine red.'},
    {id:'slate_pro',name:'Slate Pro',rarity:'uncommon',price:350,emoji:'🪨',desc:'Slate grey pro build.'},
    // Rare (35)
    {id:'midnight_gold',name:'Midnight Gold',rarity:'rare',price:700,emoji:'🌙',desc:'Gold inlay on dark wood.'},
    {id:'diamond_tip',name:'Diamond Tip',rarity:'rare',price:750,emoji:'💎',desc:'Industrial diamond tip.'},
    {id:'black_widow',name:'Black Widow',rarity:'rare',price:800,emoji:'🕷️',desc:'Black widow web design.'},
    {id:'viper_strike',name:'Viper Strike',rarity:'rare',price:720,emoji:'🐍',desc:'Viper pattern wrap.'},
    {id:'cobalt_pro',name:'Cobalt Pro',rarity:'rare',price:780,emoji:'🔵',desc:'Pro cobalt carbon.'},
    {id:'arctic_frost',name:'Arctic Frost',rarity:'rare',price:760,emoji:'❄️',desc:'Arctic ice finish.'},
    {id:'lava_flow',name:'Lava Flow',rarity:'rare',price:810,emoji:'🌋',desc:'Molten lava design.'},
    {id:'sapphire_shaft',name:'Sapphire Shaft',rarity:'rare',price:790,emoji:'💙',desc:'Genuine sapphire blue.'},
    {id:'ruby_tip',name:'Ruby Tip',rarity:'rare',price:820,emoji:'❤️',desc:'Ruby-red ferrule.'},
    {id:'emerald_pro',name:'Emerald Pro',rarity:'rare',price:840,emoji:'💚',desc:'Emerald professional.'},
    {id:'topaz_blade',name:'Topaz Blade',rarity:'rare',price:800,emoji:'💛',desc:'Topaz crystal edge.'},
    {id:'amethyst_a',name:'Amethyst A',rarity:'rare',price:770,emoji:'💜',desc:'Amethyst hued body.'},
    {id:'opal_finish',name:'Opal Finish',rarity:'rare',price:850,emoji:'🟢',desc:'Iridescent opal.'},
    {id:'steel_serpent',name:'Steel Serpent',rarity:'rare',price:760,emoji:'🐉',desc:'Serpent etching.'},
    {id:'gold_wrap',name:'Gold Wrap',rarity:'rare',price:730,emoji:'🟡',desc:'24k gold wrap.'},
    {id:'platinum_pro',name:'Platinum Pro',rarity:'rare',price:900,emoji:'⚪',desc:'Platinum grade build.'},
    {id:'carbon_x',name:'Carbon X',rarity:'rare',price:880,emoji:'⚫',desc:'Advanced carbon X.'},
    {id:'ivory_pro',name:'Ivory Pro',rarity:'rare',price:820,emoji:'🦷',desc:'Pro ivory tip.'},
    {id:'titanium_a',name:'Titanium A',rarity:'rare',price:950,emoji:'🔩',desc:'Titanium alloy shaft.'},
    {id:'tungsten_b',name:'Tungsten B',rarity:'rare',price:920,emoji:'⚙️',desc:'Tungsten weighted.'},
    {id:'crusader',name:'Crusader',rarity:'rare',price:840,emoji:'⚔️',desc:'Medieval knight theme.'},
    {id:'samurai_edge',name:'Samurai Edge',rarity:'rare',price:880,emoji:'🗡️',desc:'Samurai sword inspired.'},
    {id:'lotus_bloom',name:'Lotus Bloom',rarity:'rare',price:760,emoji:'🌸',desc:'Lotus flower pattern.'},
    {id:'bamboo_elite',name:'Bamboo Elite',rarity:'rare',price:720,emoji:'🎍',desc:'Elite bamboo build.'},
    {id:'northern_lights',name:'Northern Lights',rarity:'rare',price:900,emoji:'🌌',desc:'Aurora borealis.'},
    {id:'crimson_dragon',name:'Crimson Dragon',rarity:'rare',price:960,emoji:'🔴',desc:'Dragon fire design.'},
    {id:'sterling_x',name:'Sterling X',rarity:'rare',price:870,emoji:'🥈',desc:'Sterling silver X.'},
    {id:'neptune_blue',name:'Neptune Blue',rarity:'rare',price:810,emoji:'🌊',desc:'Deep ocean neptune.'},
    {id:'solar_flare',name:'Solar Flare',rarity:'rare',price:840,emoji:'☀️',desc:'Solar burst design.'},
    {id:'toxic_green',name:'Toxic Green',rarity:'rare',price:780,emoji:'☢️',desc:'Radioactive green glow.'},
    {id:'shadow_runner',name:'Shadow Runner',rarity:'rare',price:800,emoji:'👤',desc:'Shadow silhouette.'},
    {id:'polar_ice',name:'Polar Ice',rarity:'rare',price:830,emoji:'🧊',desc:'Polar ice crystal.'},
    {id:'inferno',name:'Inferno',rarity:'rare',price:860,emoji:'🔥',desc:'Pure inferno heat.'},
    {id:'void_cue',name:'Void Cue',rarity:'rare',price:940,emoji:'🕳️',desc:'Endless void design.'},
    {id:'lucky_clover',name:'Lucky Clover',rarity:'rare',price:770,emoji:'🍀',desc:'Four leaf lucky.'},
    // Epic (30)
    {id:'phantom_shadow',name:'Phantom Shadow',rarity:'epic',price:2000,emoji:'👻',desc:'Ghost-like phantom design.'},
    {id:'frostbite',name:'Frostbite',rarity:'epic',price:2200,emoji:'🥶',desc:'Icy frostbite particles.'},
    {id:'thunderstrike',name:'Thunderstrike',rarity:'epic',price:2400,emoji:'⚡',desc:'Electric storm cue.'},
    {id:'blood_moon',name:'Blood Moon',rarity:'epic',price:2100,emoji:'🌕',desc:'Deep crimson moon.'},
    {id:'cyberpunk',name:'Cyberpunk',rarity:'epic',price:2300,emoji:'🤖',desc:'Neon cyberpunk lines.'},
    {id:'dragon_fang',name:'Dragon Fang',rarity:'epic',price:2500,emoji:'🐲',desc:'Dragon fang carved cue.'},
    {id:'serpent_king',name:'Serpent King',rarity:'epic',price:2350,emoji:'🐍',desc:'King cobra motif.'},
    {id:'galaxy_pro',name:'Galaxy Pro',rarity:'epic',price:2600,emoji:'🌌',desc:'Professional galaxy.'},
    {id:'midnight_edge',name:'Midnight Edge',rarity:'epic',price:2400,emoji:'🌃',desc:'Sharp midnight edge.'},
    {id:'aurora_pro',name:'Aurora Pro',rarity:'epic',price:2800,emoji:'🌠',desc:'Aurora particle trail.'},
    {id:'storm_bringer',name:'Storm Bringer',rarity:'epic',price:2700,emoji:'⛈️',desc:'Storm of lightning.'},
    {id:'dark_matter',name:'Dark Matter',rarity:'epic',price:3000,emoji:'🕳️',desc:'Dark matter essence.'},
    {id:'prism_break',name:'Prism Break',rarity:'epic',price:2500,emoji:'🔆',desc:'Light prism scatter.'},
    {id:'gold_viper',name:'Gold Viper',rarity:'epic',price:2200,emoji:'🐍',desc:'Golden viper scales.'},
    {id:'neon_samurai',name:'Neon Samurai',rarity:'epic',price:2600,emoji:'⚔️',desc:'Neon-lit katana.'},
    {id:'volcano_god',name:'Volcano God',rarity:'epic',price:2800,emoji:'🌋',desc:'Volcanic god power.'},
    {id:'plague_doctor',name:'Plague Doctor',rarity:'epic',price:2900,emoji:'🎭',desc:'Dark doctor style.'},
    {id:'cyber_wolf',name:'Cyber Wolf',rarity:'epic',price:2700,emoji:'🐺',desc:'Cybernetic wolf.'},
    {id:'quantum_cue',name:'Quantum Cue',rarity:'epic',price:3200,emoji:'⚛️',desc:'Quantum mechanics.'},
    {id:'obsidian_reaper',name:'Obsidian Reaper',rarity:'epic',price:3100,emoji:'💀',desc:'Dark reaper motif.'},
    {id:'solar_storm',name:'Solar Storm',rarity:'epic',price:2600,emoji:'☀️',desc:'Solar plasma burst.'},
    {id:'acid_rain',name:'Acid Rain',rarity:'epic',price:2400,emoji:'🌧️',desc:'Corrosive acid rain.'},
    {id:'bio_hazard',name:'Bio Hazard',rarity:'epic',price:2500,emoji:'☣️',desc:'Bio hazard design.'},
    {id:'angel_wing',name:'Angel Wing',rarity:'epic',price:2800,emoji:'👼',desc:'Divine angel wings.'},
    {id:'demon_claw',name:'Demon Claw',rarity:'epic',price:2900,emoji:'😈',desc:'Demonic claw marks.'},
    {id:'time_bender',name:'Time Bender',rarity:'epic',price:3000,emoji:'⏰',desc:'Time distortion.'},
    {id:'void_walker',name:'Void Walker',rarity:'epic',price:3200,emoji:'🌑',desc:'Walker of the void.'},
    {id:'ice_phoenix',name:'Ice Phoenix',rarity:'epic',price:2700,emoji:'🦅',desc:'Phoenix of ice.'},
    {id:'magma_core',name:'Magma Core',rarity:'epic',price:2600,emoji:'🔴',desc:'Molten magma core.'},
    {id:'neon_specter',name:'Neon Specter',rarity:'epic',price:3100,emoji:'👾',desc:'Neon ghost specter.'},
    // Legendary (30)
    {id:'cosmic_storm',name:'Cosmic Storm',rarity:'legendary',price:8000,emoji:'🌪️',desc:'Cosmic storm swirling.'},
    {id:'nebula_master',name:'Nebula Master',rarity:'legendary',price:9000,emoji:'🌠',desc:'Master of nebulae.'},
    {id:'omega_blade',name:'Omega Blade',rarity:'legendary',price:10000,emoji:'⚔️',desc:'The final blade.'},
    {id:'god_of_pool',name:'God of Pool',rarity:'legendary',price:12000,emoji:'👑',desc:'Deity of the table.'},
    {id:'eternal_flame',name:'Eternal Flame',rarity:'legendary',price:9500,emoji:'🔥',desc:'Never extinguished.'},
    {id:'galaxy_destroyer',name:'Galaxy Destroyer',rarity:'legendary',price:11000,emoji:'💥',desc:'Destroys galaxies.'},
    {id:'black_hole',name:'Black Hole',rarity:'legendary',price:13000,emoji:'🌑',desc:'Swallows everything.'},
    {id:'supernova',name:'Supernova',rarity:'legendary',price:12500,emoji:'💫',desc:'Stellar explosion.'},
    {id:'thunder_god',name:'Thunder God',rarity:'legendary',price:10000,emoji:'⚡',desc:'God of thunder.'},
    {id:'poseidon_trident',name:'Poseidon',rarity:'legendary',price:11500,emoji:'🔱',desc:'Trident of Poseidon.'},
    {id:'phoenix_reborn',name:'Phoenix Reborn',rarity:'legendary',price:9000,emoji:'🦅',desc:'Reborn from ashes.'},
    {id:'kraken_depth',name:'Kraken Depth',rarity:'legendary',price:10500,emoji:'🦑',desc:'From the deep.'},
    {id:'dragon_lord',name:'Dragon Lord',rarity:'legendary',price:11000,emoji:'🐉',desc:'Lord of all dragons.'},
    {id:'demon_king',name:'Demon King',rarity:'legendary',price:12000,emoji:'😈',desc:'King of demons.'},
    {id:'archangel',name:'Archangel',rarity:'legendary',price:11500,emoji:'😇',desc:'Holy archangel.'},
    {id:'titan_force',name:'Titan Force',rarity:'legendary',price:10000,emoji:'💪',desc:'Titanic strength.'},
    {id:'zeus_bolt',name:'Zeus Bolt',rarity:'legendary',price:9500,emoji:'⚡',desc:'Zeus thunderbolt.'},
    {id:'ares_fury',name:'Ares Fury',rarity:'legendary',price:10500,emoji:'⚔️',desc:'War god fury.'},
    {id:'athena_wisdom',name:'Athena Wisdom',rarity:'legendary',price:9000,emoji:'🦉',desc:'Goddess of wisdom.'},
    {id:'apollo_sun',name:'Apollo Sun',rarity:'legendary',price:9500,emoji:'☀️',desc:'Sun god radiance.'},
    {id:'hades_shadow',name:'Hades Shadow',rarity:'legendary',price:11000,emoji:'💀',desc:'Lord of shadows.'},
    {id:'chronos_edge',name:'Chronos Edge',rarity:'legendary',price:13000,emoji:'⏳',desc:'Time itself cut.'},
    {id:'universe_end',name:'Universe End',rarity:'legendary',price:15000,emoji:'🌌',desc:'End of the cosmos.'},
    {id:'crystal_genesis',name:'Crystal Genesis',rarity:'legendary',price:12000,emoji:'💎',desc:'Creation crystal.'},
    {id:'rainbow_bridge',name:'Rainbow Bridge',rarity:'legendary',price:10000,emoji:'🌈',desc:'Bridge of colors.'},
    {id:'solar_divinity',name:'Solar Divinity',rarity:'legendary',price:11000,emoji:'☀️',desc:'Divine solar power.'},
    {id:'lunar_empress',name:'Lunar Empress',rarity:'legendary',price:10500,emoji:'🌙',desc:'Empress of the moon.'},
    {id:'star_forged',name:'Star Forged',rarity:'legendary',price:12500,emoji:'⭐',desc:'Forged in stars.'},
    {id:'void_infinity',name:'Void Infinity',rarity:'legendary',price:14000,emoji:'∞',desc:'Infinite void power.'},
    {id:'absolute_zero',name:'Absolute Zero',rarity:'legendary',price:15000,emoji:'❄️',desc:'Temperature of zero.'},
    // Mythic (20)
    {id:'midnight_legend',name:'Midnight Legend',rarity:'mythic',price:50000,emoji:'🏆',desc:'The ultimate cue. A legend.'},
    {id:'time_rifter',name:'Time Rifter',rarity:'mythic',price:55000,emoji:'⏰',desc:'Tears through time.'},
    {id:'universe_shaper',name:'Universe Shaper',rarity:'mythic',price:60000,emoji:'🌌',desc:'Shapes the universe.'},
    {id:'god_mode',name:'God Mode',rarity:'mythic',price:75000,emoji:'👑',desc:'Omnipotent power.'},
    {id:'singularity',name:'Singularity',rarity:'mythic',price:65000,emoji:'⚫',desc:'A point of no return.'},
    {id:'omnipotent',name:'Omnipotent',rarity:'mythic',price:80000,emoji:'✨',desc:'All-powerful cue.'},
    {id:'eternity_blade',name:'Eternity Blade',rarity:'mythic',price:70000,emoji:'⚔️',desc:'Cuts through eternity.'},
    {id:'creation_wand',name:'Creation Wand',rarity:'mythic',price:72000,emoji:'🪄',desc:'Creates new worlds.'},
    {id:'omega_point',name:'Omega Point',rarity:'mythic',price:68000,emoji:'🔮',desc:'The final point.'},
    {id:'perfect_shot',name:'Perfect Shot',rarity:'mythic',price:90000,emoji:'🎯',desc:'Every shot is perfect.'},
    {id:'infinity_cue',name:'Infinity Cue',rarity:'mythic',price:100000,emoji:'∞',desc:'Infinite and beyond.'},
    {id:'alpha_omega',name:'Alpha & Omega',rarity:'mythic',price:85000,emoji:'⚡',desc:'First and last.'},
    {id:'cosmos_breaker',name:'Cosmos Breaker',rarity:'mythic',price:78000,emoji:'💥',desc:'Breaks the cosmos.'},
    {id:'divine_strike',name:'Divine Strike',rarity:'mythic',price:82000,emoji:'⚡',desc:'Blessed by divinity.'},
    {id:'quantum_god',name:'Quantum God',rarity:'mythic',price:95000,emoji:'⚛️',desc:'God of quantum.'},
    {id:'entropy_lord',name:'Entropy Lord',rarity:'mythic',price:88000,emoji:'🌀',desc:'Lord of all entropy.'},
    {id:'primordial',name:'Primordial',rarity:'mythic',price:92000,emoji:'🌋',desc:'Before all things.'},
    {id:'annihilator',name:'Annihilator',rarity:'mythic',price:97000,emoji:'💀',desc:'Annihilates opponents.'},
    {id:'rebirth_cue',name:'Rebirth Cue',rarity:'mythic',price:86000,emoji:'🌟',desc:'Born again each shot.'},
    {id:'transcendence',name:'Transcendence',rarity:'mythic',price:99999,emoji:'🌠',desc:'Beyond all limits.'},
    // Event (25)
    {id:'halloween_cue',name:'Halloween Cue',rarity:'epic',price:3500,emoji:'🎃',desc:'Spooky Halloween special.'},
    {id:'christmas_cue',name:'Christmas Cue',rarity:'epic',price:3500,emoji:'🎄',desc:'Festive Christmas cue.'},
    {id:'new_year_cue',name:'New Year Cue',rarity:'rare',price:1800,emoji:'🎆',desc:'New Year fireworks.'},
    {id:'valentine_cue',name:'Valentine Cue',rarity:'rare',price:1600,emoji:'💝',desc:'Love & roses.'},
    {id:'st_patrick',name:"St. Patrick's",rarity:'rare',price:1700,emoji:'🍀',desc:'Lucky shamrock cue.'},
    {id:'summer_beach',name:'Summer Beach',rarity:'uncommon',price:500,emoji:'🏖️',desc:'Sandy summer vibes.'},
    {id:'winter_frost',name:'Winter Frost',rarity:'rare',price:1500,emoji:'❄️',desc:'Winter frosted cue.'},
    {id:'spring_blossom',name:'Spring Blossom',rarity:'uncommon',price:450,emoji:'🌺',desc:'Spring cherry blossom.'},
    {id:'autumn_maple',name:'Autumn Maple',rarity:'uncommon',price:480,emoji:'🍂',desc:'Autumn maple leaves.'},
    {id:'lunar_new_year',name:'Lunar New Year',rarity:'epic',price:4000,emoji:'🧧',desc:'Lucky red envelope.'},
    {id:'diwali_light',name:'Diwali Light',rarity:'epic',price:3800,emoji:'🪔',desc:'Festival of lights.'},
    {id:'easter_egg',name:'Easter Egg',rarity:'rare',price:1900,emoji:'🥚',desc:'Easter egg pattern.'},
    {id:'thanksgiving',name:'Thanksgiving',rarity:'uncommon',price:520,emoji:'🦃',desc:'Harvest celebration.'},
    {id:'independence',name:'Independence',rarity:'rare',price:1600,emoji:'🗽',desc:'Stars and stripes.'},
    {id:'oktoberfest',name:'Oktoberfest',rarity:'uncommon',price:490,emoji:'🍺',desc:'German celebration.'},
    {id:'mardi_gras',name:'Mardi Gras',rarity:'rare',price:1700,emoji:'🎭',desc:'Carnival celebration.'},
    {id:'cinco_mayo',name:'Cinco de Mayo',rarity:'uncommon',price:460,emoji:'🌮',desc:'Festive fiesta.'},
    {id:'pride_cue',name:'Pride Cue',rarity:'rare',price:2000,emoji:'🌈',desc:'Rainbow pride.'},
    {id:'golden_week',name:'Golden Week',rarity:'rare',price:1800,emoji:'🌸',desc:'Japanese golden week.'},
    {id:'carnival',name:'Carnival',rarity:'epic',price:3200,emoji:'🎡',desc:'Bright carnival fun.'},
    {id:'space_day',name:'Space Day',rarity:'epic',price:3600,emoji:'🚀',desc:'Space exploration day.'},
    {id:'earth_day',name:'Earth Day',rarity:'uncommon',price:500,emoji:'🌍',desc:'Protect our planet.'},
    {id:'crown_jewel',name:'Crown Jewel',rarity:'legendary',price:20000,emoji:'💎',desc:'The crown jewel event.'},
    {id:'midnight_special',name:'Midnight Special',rarity:'legendary',price:18000,emoji:'🌙',desc:'Limited midnight run.'},
    {id:'champions_cup',name:'Champions Cup',rarity:'mythic',price:75000,emoji:'🏆',desc:'Tournament champions.'},
  ];
  return cueData;
})();
// ── Avatars Database (200+) ────────────────────────────────────
const AVATARS_DB = (() => {
  const sets = [
    { prefix:'Beginner', emojis:['🎱','👶','🎓','🌱','⭐','🔵','🟢','🔴','🟡','🟣','🟠','⚪','⚫','🔶','🔷','💠','🔹','🔸','▪️','▫️','◼️','◻️','🟥','🟦','🟧'], rarity:'common', price:100 },
    { prefix:'Sports', emojis:['🏊','⚽','🏀','🎾','🏈','⚾','🏐','🏉','🎿','⛷️','🏋️','🤸','🚴','🏇','🤺','🥊','🏹','🥋','🎯','🏑','🏒','🥍','🏓','🏸','🥅'], rarity:'uncommon', price:300 },
    { prefix:'Luxury', emojis:['👑','💎','🥂','🍾','🎩','🪙','💰','💳','🏆','🌟','✨','💫','⚡','🔮','🪄','🎭','🌹','🦢','🦚','🎪','🎠','🎡','🎢','🃏','🀄'], rarity:'rare', price:800 },
    { prefix:'Neon', emojis:['🟢','💚','🩵','💙','💜','🩷','❤️','🧡','💛','🤍','🖤','🔥','⚡','🌈','🎆','🎇','✨','💥','🌟','⭐','🌠','☄️','🌌','🎑','🎨'], rarity:'rare', price:900 },
    { prefix:'Galaxy', emojis:['🌌','🌠','⭐','💫','🌟','☄️','🪐','🌍','🌙','☀️','🌞','🌝','🌚','🌛','🌜','🌗','🌖','🌕','🌔','🌓','🌒','🌑','🌏','🌎','🚀'], rarity:'epic', price:2500 },
    { prefix:'Anime', emojis:['🦊','🐺','🦁','🐯','🦝','🐱','🐶','🐻','🐼','🐨','🦊','🦌','🦘','🦙','🦏','🐘','🦍','🐬','🦈','🐙','🦑','🦀','🦞','🦐','🦦'], rarity:'epic', price:3000 },
    { prefix:'Legendary', emojis:['🐉','🔱','⚔️','🛡️','🏹','🪄','👑','💎','🌋','🌊','⚡','🔥','❄️','🌪️','☄️','🌈','🌟','💫','✨','🎆','🎇','🌠','🌌','💥','🎯'], rarity:'legendary', price:10000 },
    { prefix:'Seasonal', emojis:['🎃','🎄','🎆','💝','🍀','🌺','🍂','❄️','🧧','🪔','🥚','🦃','🗽','🍺','🎭','🌮','🌈','🌸','🎡','🚀','🌍','💎','🌙','🏆','🎊'], rarity:'rare', price:1500 },
  ];
  const avatars = [];
  sets.forEach((set, si) => {
    set.emojis.forEach((emoji, ei) => {
      avatars.push({
        id: `avatar_${si}_${ei}`,
        name: `${set.prefix} ${ei + 1}`,
        emoji,
        rarity: set.rarity,
        price: set.price + ei * 20,
      });
    });
  });
  return avatars;
})();
// ── Titles Database (100+) ─────────────────────────────────────
const TITLES_DB = [
  {id:'rookie',name:'Rookie',price:0,rarity:'common',unlockReq:null},
  {id:'challenger',name:'Challenger',price:200,rarity:'common',unlockReq:'5 wins'},
  {id:'shot_maker',name:'Shot Maker',price:400,rarity:'uncommon',unlockReq:'20 wins'},
  {id:'table_runner',name:'Table Runner',price:600,rarity:'uncommon',unlockReq:'50 balls pocketed'},
  {id:'pool_veteran',name:'Pool Veteran',price:1000,rarity:'rare',unlockReq:'100 wins'},
  {id:'bank_king',name:'Bank Shot King',price:1200,rarity:'rare',unlockReq:'50 bank shots'},
  {id:'champion',name:'Champion',price:2000,rarity:'epic',unlockReq:'Level 20'},
  {id:'grandmaster',name:'Grandmaster',price:5000,rarity:'legendary',unlockReq:'Level 50'},
  {id:'midnight_legend',name:'Midnight Legend',price:20000,rarity:'mythic',unlockReq:'Level 100'},
  {id:'pocket_wizard',name:'Pocket Wizard',price:800,rarity:'rare',unlockReq:null},
  {id:'cue_master',name:'Cue Master',price:1500,rarity:'epic',unlockReq:null},
  {id:'break_specialist',name:'Break Specialist',price:700,rarity:'rare',unlockReq:null},
  {id:'safety_king',name:'Safety King',price:600,rarity:'uncommon',unlockReq:null},
  {id:'combo_lord',name:'Combo Lord',price:1100,rarity:'rare',unlockReq:null},
  {id:'the_shark',name:'The Shark',price:2500,rarity:'epic',unlockReq:null},
  {id:'snooker_pro',name:'Snooker Pro',price:1800,rarity:'epic',unlockReq:null},
  {id:'nine_ball_ace',name:'Nine Ball Ace',price:1600,rarity:'epic',unlockReq:null},
  {id:'straight_shooter',name:'Straight Shooter',price:400,rarity:'uncommon',unlockReq:null},
  {id:'trickster',name:'Trickster',price:2000,rarity:'epic',unlockReq:null},
  {id:'hustler',name:'Hustler',price:3000,rarity:'legendary',unlockReq:null},
  {id:'the_surgeon',name:'The Surgeon',price:3500,rarity:'legendary',unlockReq:null},
  {id:'iron_bridge',name:'Iron Bridge',price:500,rarity:'uncommon',unlockReq:null},
  {id:'masse_king',name:'Massé King',price:2200,rarity:'epic',unlockReq:null},
  {id:'max_english',name:'Max English',price:1400,rarity:'rare',unlockReq:null},
  {id:'century_break',name:'Century Break',price:8000,rarity:'mythic',unlockReq:null},
  {id:'pool_wizard',name:'Pool Wizard',price:4000,rarity:'legendary',unlockReq:null},
  {id:'ghost_ball',name:'Ghost Ball',price:2800,rarity:'epic',unlockReq:null},
  {id:'dead_stroke',name:'Dead Stroke',price:5500,rarity:'legendary',unlockReq:null},
  {id:'efren_style',name:'Efren Style',price:7000,rarity:'mythic',unlockReq:null},
  {id:'alex_the_cannon',name:'The Cannon',price:6500,rarity:'legendary',unlockReq:null},
  {id:'money_ball',name:'Money Ball',price:3200,rarity:'legendary',unlockReq:null},
  {id:'rack_breaker',name:'Rack Breaker',price:900,rarity:'rare',unlockReq:null},
  {id:'run_out',name:'Run Out Artist',price:4500,rarity:'legendary',unlockReq:null},
  {id:'cluster_buster',name:'Cluster Buster',price:1300,rarity:'rare',unlockReq:null},
  {id:'diamond_system',name:'Diamond System',price:2500,rarity:'epic',unlockReq:null},
  {id:'one_pocket_king',name:'One Pocket King',price:3800,rarity:'legendary',unlockReq:null},
  {id:'bank_pool_boss',name:'Bank Pool Boss',price:3500,rarity:'legendary',unlockReq:null},
  {id:'the_professor',name:'The Professor',price:2000,rarity:'epic',unlockReq:null},
  {id:'mental_game',name:'Mental Game',price:1800,rarity:'epic',unlockReq:null},
  {id:'silky_smooth',name:'Silky Smooth',price:2200,rarity:'epic',unlockReq:null},
  {id:'pressure_player',name:'Pressure Player',price:3000,rarity:'legendary',unlockReq:null},
  {id:'ice_cold',name:'Ice Cold',price:2800,rarity:'epic',unlockReq:null},
  {id:'never_miss',name:'Never Miss',price:6000,rarity:'legendary',unlockReq:null},
  {id:'nine_dart',name:'Nine Darter',price:4000,rarity:'legendary',unlockReq:null},
  {id:'perfect_game',name:'Perfect Game',price:10000,rarity:'mythic',unlockReq:null},
  {id:'straight_pool_god',name:'Straight Pool God',price:8000,rarity:'mythic',unlockReq:null},
  {id:'hall_of_famer',name:'Hall of Famer',price:15000,rarity:'mythic',unlockReq:null},
  {id:'absolute_legend',name:'Absolute Legend',price:20000,rarity:'mythic',unlockReq:null},
  {id:'untouchable',name:'Untouchable',price:18000,rarity:'mythic',unlockReq:null},
  {id:'greatest_ever',name:'Greatest Ever',price:25000,rarity:'mythic',unlockReq:null},
  // Additional 50 simpler titles
  ...[
    'Sharpshooter','Corner Pocketer','Speed Demon','Slow Burner','Positional Genius',
    'Tight Pockets','Lucky Shot','Clutch Player','On The Hill','Last Pocket',
    'Center Table','Rail Bird','Long Ranger','Short Game','The Mechanic',
    'Cue Ball Control','Spin Doctor','Angle Hunter','Draw Shot','Follow Through',
    'Power Break','Soft Touch','Finesse Player','Calculated Risk','Safety Wizard',
    'Table General','Aggressive Line','Conservative','Methodical','Instinctive',
    'Left Hander','Right Hander','Ambidextrous','The Technician','Pure Stroker',
    'Rhythm Player','Head Down','In the Zone','Laser Focus','Machine Mode',
    'Never Nervous','Steady Hands','Eagle Eye','Hawk Vision','Predator Mode',
    'Apex Predator','Silent Assassin','Smooth Operator','Stone Cold','All Business'
  ].map((name, i) => ({
    id: `title_gen_${i}`, name, price: 200 + i * 80,
    rarity: i < 15 ? 'common' : i < 30 ? 'uncommon' : i < 45 ? 'rare' : 'epic',
    unlockReq: null
  })),
];
// ── Achievements Database (200+) ───────────────────────────────
const ACHIEVEMENTS_DB = (() => {
  const list = [];
  const push = (id,name,desc,icon,cat,coins,xp,target,statKey) => list.push({id,name,desc,icon,cat,coins,xp,target,statKey});
  // Beginner (25)
  push('first_game','First Game','Play your first game','🎱','beginner',50,100,1,'gamesPlayed');
  push('first_win','First Victory','Win your first game','🏆','beginner',100,200,1,'wins');
  push('first_pocket','First Pocket','Pocket your first ball','🎯','beginner',25,50,1,'ballsPocketed');
  push('first_break','Break Shot','Complete your first break','💥','beginner',50,100,1,'gamesPlayed');
  push('play_5','Warming Up','Play 5 games','🔥','beginner',75,150,5,'gamesPlayed');
  push('play_10','Getting Serious','Play 10 games','📈','beginner',100,200,10,'gamesPlayed');
  push('play_25','Regular Player','Play 25 games','📅','beginner',200,400,25,'gamesPlayed');
  push('pocket_10','10 Balls','Pocket 10 balls total','⚽','beginner',50,100,10,'ballsPocketed');
  push('pocket_50','50 Balls','Pocket 50 balls total','⚽','beginner',100,200,50,'ballsPocketed');
  push('pocket_100','Century','Pocket 100 balls','💯','beginner',200,400,100,'ballsPocketed');
  push('earn_100','First Coins','Earn 100 coins','🪙','beginner',50,100,100,'totalCoinsEarned');
  push('earn_500','Coin Collector','Earn 500 coins','🪙','beginner',100,150,500,'totalCoinsEarned');
  push('earn_1000','Getting Rich','Earn 1,000 coins','💰','beginner',150,300,1000,'totalCoinsEarned');
  push('try_modes','Explorer','Try 3 different game modes','🗺️','beginner',100,200,3,'modesTried');
  push('first_ai','AI Challenger','Play vs AI for the first time','🤖','beginner',75,150,1,'aiGamesPlayed');
  push('first_2p','Friendly Match','Play a 2-player game','⚔️','beginner',75,150,1,'pvpGamesPlayed');
  push('win_2','Double Win','Win 2 games','✌️','beginner',100,200,2,'wins');
  push('win_5','Five Wins','Win 5 games','🖐️','beginner',150,300,5,'wins');
  push('buy_item','Shopkeeper','Buy your first item','🏪','beginner',100,200,1,'itemsBought');
  push('claim_daily','Daily Habitué','Claim daily reward','📅','beginner',50,100,1,'dailyClaims');
  push('reach_lvl2','Level 2','Reach Level 2','⭐','beginner',100,0,2,'level');
  push('reach_lvl5','Level 5','Reach Level 5','⭐','beginner',250,0,5,'level');
  push('reach_lvl10','Level 10','Reach Level 10','🌟','beginner',500,0,10,'level');
  push('chat_challenge','Challenge Accepted','Complete your first challenge','📋','beginner',150,300,1,'challengesDone');
  push('open_shop','Window Shopping','Open the shop','🛒','beginner',25,50,1,'shopOpens');
  // Skill (40)
  push('bank_5','Bank Shot','Make 5 bank shots','↗️','skill',100,200,5,'bankShots');
  push('bank_25','Bank Artist','Make 25 bank shots','🎨','skill',250,500,25,'bankShots');
  push('bank_100','Bank Master','Make 100 bank shots','💯','skill',1000,2000,100,'bankShots');
  push('bank_500','Bank Legend','Make 500 bank shots','👑','skill',5000,8000,500,'bankShots');
  push('combo_5','Combo','Pocket 2+ balls in one shot 5 times','🎯','skill',200,400,5,'combos');
  push('combo_25','Combo Artist','25 multi-ball shots','🎨','skill',500,1000,25,'combos');
  push('perfect_break','Perfect Break','Pocket a ball on the break','💥','skill',300,600,1,'perfectBreaks');
  push('eight_ball_win','Eight Ball Pro','Win an 8-ball game','8️⃣','skill',200,400,1,'eightballWins');
  push('nine_ball_win','Nine Ball Pro','Win a 9-ball game','9️⃣','skill',200,400,1,'nineballWins');
  push('snooker_win','Snooker Pro','Win a snooker frame','🔴','skill',300,600,1,'snookerWins');
  push('straight_win','Straight Pool Pro','Win a straight pool game','15️⃣','skill',300,600,1,'straightpoolWins');
  push('one_pocket_win','One Pocket Pro','Win a one pocket game','◎','skill',300,600,1,'onepocketWins');
  push('bankpool_win','Bank Pool Pro','Win a bank pool game','↗️','skill',300,600,1,'bankpoolWins');
  push('tenball_win','Ten Ball Pro','Win a 10-ball game','🔟','skill',200,400,1,'tenballWins');
  push('sevenball_win','Seven Ball Pro','Win a 7-ball game','7️⃣','skill',200,400,1,'sevenballWins');
  push('blackball_win','Blackball Pro','Win a blackball game','⚫','skill',200,400,1,'blackballWins');
  push('all_modes','Mode Master','Win in all 9 game modes','🎱','skill',2000,5000,9,'modeWins');
  push('flawless_8','Flawless 8','Win 8-ball without giving ball-in-hand','🔒','skill',500,1000,1,'flawlessGames');
  push('break_run','Break & Run','Pocket all balls without opponent shooting','🏃','skill',800,1600,1,'breakRuns');
  push('defensive_master','Safety Player','Play 50 safety shots','🛡️','skill',400,800,50,'safeties');
  push('power_break','Power Break','Use max power on a break','💪','skill',100,200,1,'powerBreaks');
  push('low_power','Soft Touch','Win a game with average power under 40%','🤏','skill',300,600,1,'softWins');
  push('pocket_500','500 Balls','Pocket 500 balls total','🔥','skill',1000,2000,500,'ballsPocketed');
  push('pocket_1000','1000 Balls','Pocket 1,000 balls total','💫','skill',2000,4000,1000,'ballsPocketed');
  push('pocket_5000','5000 Balls','Pocket 5,000 balls total','⭐','skill',5000,10000,5000,'ballsPocketed');
  push('beat_hard_ai','Hard Mode','Beat the hard AI','🤖','skill',500,1000,1,'hardAIWins');
  push('beat_medium_ai','Medium Mode','Beat the medium AI 10 times','🤖','skill',300,600,10,'mediumAIWins');
  push('no_scratch','Clean Game','Win without scratching','✅','skill',200,400,1,'cleanGames');
  push('cushion_master','Rail Work','Hit 3 cushions in a single shot','🏓','skill',400,800,1,'threeRailShots');
  push('precise_position','Positional Expert','Leave cue ball within 5% of ideal','🎯','skill',600,1200,10,'perfectPositions');
  push('speed_win','Speed Demon','Win a game in under 5 minutes','⚡','skill',400,800,1,'speedWins');
  push('long_game','Marathon','Play a game lasting over 30 minutes','⏰','skill',300,600,1,'longGames');
  push('ai_easy_10','AI Farmer','Beat easy AI 10 times','🤖','skill',200,400,10,'easyAIWins');
  push('ai_hard_5','Hard Grinder','Beat hard AI 5 times','😤','skill',1000,2000,5,'hardAIWins');
  push('snooker_century','Century Break','Score 50+ in a snooker frame','💯','skill',1000,2000,1,'snookerCentury');
  push('trick_shot','Trick Shot','Pull off an unlikely pocket','🪄','skill',300,600,1,'trickShots');
  push('eight_on_break','Break and Win','Pocket 8-ball on the break (house rules)','⭐','skill',500,1000,1,'eightOnBreak');
  push('nine_on_break','Nine on Break','Pocket 9-ball on the break','⭐','skill',400,800,1,'nineOnBreak');
  push('run_out_8','Run Out','Pocket all 8 balls in a row','🏃','skill',600,1200,1,'runOuts');
  push('all_stripes','Full Stripes','Pocket all 7 stripes in a row','↕️','skill',400,800,1,'fullStripes');
  // Win Achievements (30)
  push('win_10','Ten Wins','Win 10 games','🏅','wins',300,600,10,'wins');
  push('win_25','25 Wins','Win 25 games','🥉','wins',500,1000,25,'wins');
  push('win_50','50 Wins','Win 50 games','🥈','wins',1000,2000,50,'wins');
  push('win_100','Century Winner','Win 100 games','🥇','wins',2000,4000,100,'wins');
  push('win_250','250 Wins','Win 250 games','🏆','wins',4000,8000,250,'wins');
  push('win_500','500 Wins','Win 500 games','👑','wins',8000,15000,500,'wins');
  push('win_1000','Thousand Wins','Win 1,000 games','💎','wins',15000,30000,1000,'wins');
  push('win_rate_60','60% Win Rate','Maintain 60% win rate (min 20 games)','📈','wins',500,1000,60,'winRate');
  push('win_rate_70','70% Win Rate','Maintain 70% win rate','📈','wins',1000,2000,70,'winRate');
  push('win_rate_80','80% Win Rate','Maintain 80% win rate','📈','wins',2000,4000,80,'winRate');
  push('ai_easy_win','AI Easy Win','Beat easy AI','🤖','wins',50,100,1,'easyAIWins');
  push('ai_med_win','AI Medium Win','Beat medium AI','🤖','wins',100,200,1,'mediumAIWins');
  push('ai_hard_win','AI Hard Win','Beat hard AI','🤖','wins',300,600,1,'hardAIWins');
  push('ai_hard_10','AI Dominator','Beat hard AI 10 times','🤖','wins',2000,4000,10,'hardAIWins');
  push('ai_hard_50','AI Destroyer','Beat hard AI 50 times','💥','wins',8000,15000,50,'hardAIWins');
  push('win_8ball_10','8-Ball Veteran','Win 10 eight-ball games','8️⃣','wins',400,800,10,'eightballWins');
  push('win_9ball_10','9-Ball Veteran','Win 10 nine-ball games','9️⃣','wins',400,800,10,'nineballWins');
  push('win_snooker_5','Snooker Veteran','Win 5 snooker frames','🔴','wins',500,1000,5,'snookerWins');
  push('win_consecutive_3','3-Game Streak','Win 3 games in a row','🔥','wins',200,400,3,'currentStreak');
  push('win_consecutive_5','5-Game Streak','Win 5 games in a row','🔥','wins',400,800,5,'currentStreak');
  push('win_consecutive_10','10-Game Streak','Win 10 games in a row','🔥','wins',800,1600,10,'currentStreak');
  push('pvp_win_10','PvP Veteran','Win 10 multiplayer games','⚔️','wins',500,1000,10,'pvpWins');
  push('pvp_win_50','PvP Warrior','Win 50 multiplayer games','⚔️','wins',2000,4000,50,'pvpWins');
  push('comeback_win','Comeback Kid','Win after being behind','💪','wins',300,600,1,'comebacks');
  push('whitewash','Whitewash','Win without opponent pocketing','😤','wins',400,800,1,'whitewashes');
  push('dominant','Dominant','Win 5 games without opponent scoring','💎','wins',1000,2000,5,'whitewashes');
  push('win_all_modes','Renaissance','Win all 9 modes at least once','🎱','wins',2000,5000,9,'modeWins');
  push('daily_win','Daily Winner','Win on 7 consecutive days','📅','wins',500,1000,7,'loginStreak');
  push('monthly_win','Monthly Grinder','Win 50 games in a month','📆','wins',2000,4000,50,'monthlyWins');
  push('yearly_champion','Yearly Champ','Win 365 games total','🏆','wins',10000,20000,365,'wins');
  // Streak Achievements (20)
  push('streak_2','Hot Pair','Win 2 in a row','🔥','streak',100,200,2,'bestStreak');
  push('streak_3','Hat Trick','Win 3 in a row','🔥','streak',200,400,3,'bestStreak');
  push('streak_5','On Fire','Win 5 in a row','🔥','streak',500,1000,5,'bestStreak');
  push('streak_7','Lucky Seven','Win 7 in a row','🍀','streak',700,1400,7,'bestStreak');
  push('streak_10','Unstoppable','Win 10 in a row','⚡','streak',1000,2000,10,'bestStreak');
  push('streak_15','Fifteen','Win 15 in a row','💫','streak',2000,4000,15,'bestStreak');
  push('streak_20','Legendary Streak','Win 20 in a row','👑','streak',3000,6000,20,'bestStreak');
  push('streak_25','Godlike','Win 25 in a row','🌟','streak',5000,10000,25,'bestStreak');
  push('streak_30','Hall of Fame','Win 30 in a row','🏆','streak',8000,16000,30,'bestStreak');
  push('streak_50','Undefeated Run','Win 50 in a row','💎','streak',20000,40000,50,'bestStreak');
  push('daily_2','2-Day Streak','Login 2 days in a row','📅','streak',50,100,2,'loginStreak');
  push('daily_3','3-Day Streak','Login 3 days in a row','📅','streak',75,150,3,'loginStreak');
  push('daily_7','Weekly Login','Login 7 days in a row','📅','streak',200,400,7,'loginStreak');
  push('daily_14','Two Weeks','Login 14 days in a row','📅','streak',400,800,14,'loginStreak');
  push('daily_30','Monthly Login','Login 30 days in a row','📅','streak',1000,2000,30,'loginStreak');
  push('challenge_3','Challenge Streak','Complete 3 challenges in a row','📋','streak',300,600,3,'challengesDone');
  push('win_daily_3','Daily Triple','Win 3 games today','📅','streak',200,400,3,'dailyWins');
  push('win_daily_5','Daily Five','Win 5 games today','📅','streak',400,800,5,'dailyWins');
  push('no_loss_10','Unbroken','Play 10 games without losing','🛡️','streak',1000,2000,10,'noLossStreak');
  push('no_foul_5','Clean Streak','Play 5 games without a foul','✅','streak',500,1000,5,'noFoulGames');
  // Coin Achievements (20)
  push('earn_100c','Penny Saved','Earn 100 coins','🪙','coins',25,50,100,'totalCoinsEarned');
  push('earn_1000c','Four Figures','Earn 1,000 coins','🪙','coins',100,200,1000,'totalCoinsEarned');
  push('earn_5000c','High Roller','Earn 5,000 coins','💰','coins',300,600,5000,'totalCoinsEarned');
  push('earn_10000c','Ten Grand','Earn 10,000 coins','💰','coins',500,1000,10000,'totalCoinsEarned');
  push('earn_50000c','Fifty K','Earn 50,000 coins','💎','coins',1500,3000,50000,'totalCoinsEarned');
  push('earn_100000c','Six Figures','Earn 100,000 coins','💎','coins',3000,6000,100000,'totalCoinsEarned');
  push('earn_500000c','Half Million','Earn 500,000 coins','👑','coins',8000,16000,500000,'totalCoinsEarned');
  push('earn_1mc','Millionaire','Earn 1,000,000 coins','🏆','coins',20000,40000,1000000,'totalCoinsEarned');
  push('spend_1000c','First Purchase','Spend 1,000 coins','🛒','coins',100,200,1000,'totalCoinsSpent');
  push('spend_10000c','Big Spender','Spend 10,000 coins','🛒','coins',300,600,10000,'totalCoinsSpent');
  push('spend_100000c','Whale','Spend 100,000 coins','🐋','coins',2000,4000,100000,'totalCoinsSpent');
  push('daily_7x','Week of Rewards','Claim daily reward 7 times','📅','coins',200,400,7,'dailyClaims');
  push('daily_30x','Monthly Earner','Claim daily reward 30 times','📆','coins',800,1600,30,'dailyClaims');
  push('win_streak_coins','Streak Bonus','Earn a streak bonus','🔥','coins',100,200,1,'streakBonuses');
  push('challenge_coins','Challenge Earner','Earn 1,000 coins from challenges','📋','coins',200,400,1000,'challengeCoinsEarned');
  push('ach_coins','Achievement Earner','Earn 500 coins from achievements','🏆','coins',100,200,500,'achievementCoinsEarned');
  push('save_5000','Saver','Save up 5,000 coins at once','🐖','coins',200,400,5000,'currentCoins');
  push('save_50000','Big Saver','Save up 50,000 coins at once','🐖','coins',1000,2000,50000,'currentCoins');
  push('save_100000','Vault','Save 100,000 coins at once','🏦','coins',2000,4000,100000,'currentCoins');
  push('rich_get_richer','Rich Get Richer','Have 500,000 coins at once','💸','coins',5000,10000,500000,'currentCoins');
  // Collection (20)
  push('buy_cue','First Cue','Buy your first cue stick','🎱','collection',100,200,1,'cuesOwned');
  push('own_5_cues','Cue Starter','Own 5 cue sticks','🎱','collection',300,600,5,'cuesOwned');
  push('own_10_cues','Cue Collector','Own 10 cue sticks','🎱','collection',600,1200,10,'cuesOwned');
  push('own_25_cues','Cue Enthusiast','Own 25 cue sticks','🎱','collection',1200,2400,25,'cuesOwned');
  push('own_50_cues','Cue Hoarder','Own 50 cue sticks','🎱','collection',2500,5000,50,'cuesOwned');
  push('own_100_cues','Cue Museum','Own 100 cue sticks','🎱','collection',5000,10000,100,'cuesOwned');
  push('buy_avatar','First Avatar','Buy your first avatar','👤','collection',100,200,1,'avatarsOwned');
  push('own_5_avatars','Avatar Collector','Own 5 avatars','👤','collection',300,600,5,'avatarsOwned');
  push('own_25_avatars','Avatar Hoarder','Own 25 avatars','👤','collection',1200,2400,25,'avatarsOwned');
  push('own_title','First Title','Unlock your first title','🏅','collection',100,200,1,'titlesOwned');
  push('own_5_titles','Title Collector','Own 5 titles','🏅','collection',300,600,5,'titlesOwned');
  push('own_legendary_cue','Legendary Cue','Own a legendary cue','👑','collection',2000,4000,1,'legendaryCues');
  push('own_mythic_cue','Mythic Cue','Own a mythic cue','💫','collection',5000,10000,1,'mythicCues');
  push('own_legendary_avatar','Legendary Avatar','Own a legendary avatar','👑','collection',1500,3000,1,'legendaryAvatars');
  push('equip_all','Outfit Complete','Equip cue, avatar and title','✅','collection',200,400,1,'outfitComplete');
  push('rare_cue','Rare Collector','Own a rare cue','💎','collection',500,1000,1,'rareCues');
  push('epic_cue','Epic Collector','Own an epic cue','💜','collection',1000,2000,1,'epicCues');
  push('own_event_item','Event Hunter','Own an event item','🎉','collection',500,1000,1,'eventItems');
  push('full_set','Full Set','Own a cue, avatar and title of same rarity','🎯','collection',1500,3000,1,'fullSets');
  push('all_rarities','Rainbow Collector','Own items of all rarities','🌈','collection',3000,6000,6,'raritiesOwned');
  // Challenge (15)
  push('ch_1','First Challenge','Complete 1 challenge','📋','challenge',100,200,1,'challengesDone');
  push('ch_5','Challenge Starter','Complete 5 challenges','📋','challenge',300,600,5,'challengesDone');
  push('ch_10','Challenge Seeker','Complete 10 challenges','📋','challenge',500,1000,10,'challengesDone');
  push('ch_25','Challenge Veteran','Complete 25 challenges','📋','challenge',1000,2000,25,'challengesDone');
  push('ch_50','Challenge Expert','Complete 50 challenges','📋','challenge',2000,4000,50,'challengesDone');
  push('ch_100','Challenge Master','Complete 100 challenges','📋','challenge',4000,8000,100,'challengesDone');
  push('daily_ch_3','Daily Devotion','Complete all daily challenges','📋','challenge',300,600,3,'dailyChallengesDone');
  push('weekly_ch','Weekly Champion','Complete all weekly challenges','📋','challenge',1000,2000,1,'weeklyChallengesDone');
  push('monthly_ch','Monthly Beast','Complete a monthly challenge','📋','challenge',2000,4000,1,'monthlyChallengesDone');
  push('ch_coins_1000','Challenge Earner','Earn 1000 coins from challenges','📋','challenge',200,400,1000,'challengeCoinsEarned');
  push('ch_xp_5000','XP Farmer','Earn 5000 XP from challenges','⭐','challenge',500,1000,5000,'challengeXpEarned');
  push('ch_streak_5','Challenge Streak','Complete challenges 5 days in a row','🔥','challenge',500,1000,5,'challengeStreak');
  push('ch_variety','Variety Show','Complete daily, weekly and monthly','📋','challenge',800,1600,3,'challengeTypesDone');
  push('ch_fast','Speed Chalenger','Complete a challenge in 1 game','⚡','challenge',400,800,1,'fastChallenges');
  push('ch_200','Challenge God','Complete 200 total challenges','👑','challenge',10000,20000,200,'challengesDone');
  // Trick Shot (20)
  push('ts_1','Trickster','Pull off 1 trick shot','🪄','trickshot',200,400,1,'trickShots');
  push('ts_5','Magician','Pull off 5 trick shots','🪄','trickshot',500,1000,5,'trickShots');
  push('ts_25','Illusionist','Pull off 25 trick shots','🎩','trickshot',1000,2000,25,'trickShots');
  push('ts_100','Trick Master','Pull off 100 trick shots','✨','trickshot',3000,6000,100,'trickShots');
  push('ts_long','Long Shot','Pocket from maximum distance','📏','trickshot',400,800,1,'longShots');
  push('ts_3rail','Three Rails','Pocket after 3 cushion contacts','🏓','trickshot',600,1200,1,'threeRailShots');
  push('ts_masse','Massé','Apply massive spin','🌀','trickshot',500,1000,1,'masseShots');
  push('ts_jump','Jump Shot','Pocket over an obstacle','⬆️','trickshot',800,1600,1,'jumpShots');
  push('ts_combo3','Triple Combo','Pocket 3 balls in one shot','🎯','trickshot',1000,2000,1,'tripleCombos');
  push('ts_swerve','Swerve','Pocket via a curved path','🌊','trickshot',500,1000,1,'swerveShots');
  push('ts_all_bank','All Banks','Win bank pool without a direct pocket','↗️','trickshot',2000,4000,1,'allBankWins');
  push('ts_full_spin','Full Spin','Use maximum side spin','🌀','trickshot',300,600,1,'fullSpins');
  push('ts_perfect_shape','Perfect Shape','Leave cue ball exactly in planned spot','📐','trickshot',600,1200,5,'perfectShapes');
  push('ts_double','Double Kiss','Pocket two different balls','💋','trickshot',700,1400,1,'doubleKisses');
  push('ts_no_look','No Look','Pocket a ball on an extreme angle','😎','trickshot',800,1600,10,'extremeAnglePockets');
  push('ts_max_power','Full Power','Use max power and still pocket','💪','trickshot',400,800,5,'maxPowerPockets');
  push('ts_feather','Featherlight','Use minimum power and pocket','🪶','trickshot',400,800,5,'minPowerPockets');
  push('ts_around','Around the Table','Pocket after hitting all 4 rails','🔄','trickshot',2000,4000,1,'allRailShots');
  push('ts_10_combo','10-Ball Combo','Pocket 10+ balls in one game without miss','🎱','trickshot',3000,6000,1,'tenBallRuns');
  push('ts_god','Shot God','Master all types of shots','🌟','trickshot',10000,20000,1,'shotTypes');
  return list;
})();
// ── Challenges Database ────────────────────────────────────────
const CHALLENGES_TEMPLATES = {
  daily: [
    {id:'d_win_1',name:'Win 1 Game',desc:'Win any game mode.',icon:'🏆',coins:50,xp:100,target:1,statKey:'dailyWins',type:'daily'},
    {id:'d_win_3',name:'Win 3 Games',desc:'Win 3 games today.',icon:'🏆',coins:150,xp:300,target:3,statKey:'dailyWins',type:'daily'},
    {id:'d_pocket_10',name:'Pocket 10 Balls',desc:'Pocket 10 balls today.',icon:'🎱',coins:50,xp:100,target:10,statKey:'dailyBalls',type:'daily'},
    {id:'d_pocket_25',name:'Pocket 25 Balls',desc:'Pocket 25 balls.',icon:'🎱',coins:100,xp:200,target:25,statKey:'dailyBalls',type:'daily'},
    {id:'d_pocket_50',name:'Pocket 50 Balls',desc:'Pocket 50 balls today.',icon:'🎱',coins:200,xp:400,target:50,statKey:'dailyBalls',type:'daily'},
    {id:'d_earn_200',name:'Earn 200 Coins',desc:'Earn 200 coins today.',icon:'🪙',coins:50,xp:100,target:200,statKey:'dailyCoins',type:'daily'},
    {id:'d_earn_500',name:'Earn 500 Coins',desc:'Earn 500 coins today.',icon:'🪙',coins:100,xp:200,target:500,statKey:'dailyCoins',type:'daily'},
    {id:'d_earn_1000',name:'Earn 1,000 Coins',desc:'Earn 1,000 coins today.',icon:'🪙',coins:200,xp:400,target:1000,statKey:'dailyCoins',type:'daily'},
    {id:'d_play_3',name:'Play 3 Games',desc:'Play 3 games today.',icon:'🎱',coins:75,xp:150,target:3,statKey:'dailyGames',type:'daily'},
    {id:'d_play_5',name:'Play 5 Games',desc:'Play 5 games today.',icon:'🎱',coins:100,xp:200,target:5,statKey:'dailyGames',type:'daily'},
    {id:'d_bank_3',name:'3 Bank Shots',desc:'Make 3 bank shots.',icon:'↗️',coins:100,xp:200,target:3,statKey:'dailyBanks',type:'daily'},
    {id:'d_bank_10',name:'10 Bank Shots',desc:'Make 10 bank shots.',icon:'↗️',coins:300,xp:600,target:10,statKey:'dailyBanks',type:'daily'},
    {id:'d_win_ai',name:'Beat the AI',desc:'Win vs AI today.',icon:'🤖',coins:100,xp:200,target:1,statKey:'dailyAIWins',type:'daily'},
    {id:'d_win_hard_ai',name:'Beat Hard AI',desc:'Beat hard AI today.',icon:'🤖',coins:300,xp:600,target:1,statKey:'dailyHardAIWins',type:'daily'},
    {id:'d_claim_reward',name:'Claim Daily Reward',desc:'Claim your daily login reward.',icon:'🎁',coins:25,xp:50,target:1,statKey:'dailyClaims',type:'daily'},
    {id:'d_8ball',name:'Play 8-Ball',desc:'Play a game of 8-Ball.',icon:'8️⃣',coins:50,xp:100,target:1,statKey:'daily8BallGames',type:'daily'},
    {id:'d_9ball',name:'Play 9-Ball',desc:'Play a game of 9-Ball.',icon:'9️⃣',coins:50,xp:100,target:1,statKey:'daily9BallGames',type:'daily'},
    {id:'d_snooker',name:'Play Snooker',desc:'Play a snooker frame.',icon:'🔴',coins:75,xp:150,target:1,statKey:'dailySnookerGames',type:'daily'},
    {id:'d_no_scratch',name:'No Scratch',desc:'Win a game without scratching.',icon:'✅',coins:150,xp:300,target:1,statKey:'dailyCleanWins',type:'daily'},
    {id:'d_combo',name:'Combo Shot',desc:'Pocket 2+ balls in one shot.',icon:'💥',coins:100,xp:200,target:1,statKey:'dailyCombos',type:'daily'},
  ],
  weekly: [
    {id:'w_win_10',name:'Win 10 Games',desc:'Win 10 games this week.',icon:'🏆',coins:500,xp:1000,target:10,statKey:'weeklyWins',type:'weekly'},
    {id:'w_win_25',name:'Win 25 Games',desc:'Win 25 games this week.',icon:'🏆',coins:1000,xp:2000,target:25,statKey:'weeklyWins',type:'weekly'},
    {id:'w_pocket_100',name:'100 Balls This Week',desc:'Pocket 100 balls.',icon:'🎱',coins:500,xp:1000,target:100,statKey:'weeklyBalls',type:'weekly'},
    {id:'w_pocket_250',name:'250 Balls This Week',desc:'Pocket 250 balls.',icon:'🎱',coins:1000,xp:2000,target:250,statKey:'weeklyBalls',type:'weekly'},
    {id:'w_earn_2000',name:'Earn 2,000 Coins',desc:'Earn 2,000 coins this week.',icon:'🪙',coins:400,xp:800,target:2000,statKey:'weeklyCoins',type:'weekly'},
    {id:'w_earn_5000',name:'Earn 5,000 Coins',desc:'Earn 5,000 coins this week.',icon:'🪙',coins:1000,xp:2000,target:5000,statKey:'weeklyCoins',type:'weekly'},
    {id:'w_play_modes',name:'Try 3 Modes',desc:'Play 3 different game modes.',icon:'🎱',coins:500,xp:1000,target:3,statKey:'weeklyModes',type:'weekly'},
    {id:'w_beat_hard',name:'Beat Hard AI 3x',desc:'Beat hard AI 3 times.',icon:'🤖',coins:800,xp:1600,target:3,statKey:'weeklyHardWins',type:'weekly'},
    {id:'w_bank_25',name:'25 Bank Shots',desc:'Make 25 bank shots this week.',icon:'↗️',coins:600,xp:1200,target:25,statKey:'weeklyBanks',type:'weekly'},
    {id:'w_streak_5',name:'Win Streak 5',desc:'Win 5 games in a row this week.',icon:'🔥',coins:1000,xp:2000,target:5,statKey:'currentStreak',type:'weekly'},
    {id:'w_login_7',name:'Login 7 Days',desc:'Login every day this week.',icon:'📅',coins:500,xp:1000,target:7,statKey:'loginStreak',type:'weekly'},
    {id:'w_challenges_5',name:'5 Daily Challenges',desc:'Complete 5 daily challenges.',icon:'📋',coins:700,xp:1400,target:5,statKey:'weeklyDailyChallenges',type:'weekly'},
    {id:'w_snooker_2',name:'Snooker x2',desc:'Win 2 snooker frames.',icon:'🔴',coins:600,xp:1200,target:2,statKey:'weeklySnookerWins',type:'weekly'},
    {id:'w_clean_5',name:'5 Clean Wins',desc:'Win 5 games without scratching.',icon:'✅',coins:800,xp:1600,target:5,statKey:'weeklyCleanWins',type:'weekly'},
    {id:'w_spend_1000',name:'Spend 1,000 Coins',desc:'Purchase items worth 1,000 coins.',icon:'🛒',coins:200,xp:400,target:1000,statKey:'weeklySpend',type:'weekly'},
    {id:'w_all_modes',name:'Play All Modes',desc:'Play all 9 game modes this week.',icon:'🎱',coins:2000,xp:4000,target:9,statKey:'weeklyModes',type:'weekly'},
    {id:'w_win_ai_all',name:'All AI Difficulties',desc:'Beat easy, medium and hard AI.',icon:'🤖',coins:1500,xp:3000,target:3,statKey:'weeklyAIDiffs',type:'weekly'},
    {id:'w_pocket_500',name:'500 Balls This Week',desc:'Pocket 500 total balls.',icon:'🎱',coins:2000,xp:4000,target:500,statKey:'weeklyBalls',type:'weekly'},
    {id:'w_earn_10k',name:'Earn 10,000 Coins',desc:'Earn 10,000 coins this week.',icon:'💰',coins:2000,xp:4000,target:10000,statKey:'weeklyCoins',type:'weekly'},
    {id:'w_perfect_week',name:'Perfect Week',desc:'Complete all daily challenges every day.',icon:'🌟',coins:3000,xp:6000,target:7,statKey:'perfectDays',type:'weekly'},
  ],
  monthly: [
    {id:'m_win_50',name:'Win 50 Games',desc:'Win 50 games this month.',icon:'🏆',coins:2000,xp:4000,target:50,statKey:'monthlyWins',type:'monthly'},
    {id:'m_win_100',name:'Win 100 Games',desc:'Win 100 games this month.',icon:'🏆',coins:4000,xp:8000,target:100,statKey:'monthlyWins',type:'monthly'},
    {id:'m_pocket_500',name:'500 Balls Month',desc:'Pocket 500 balls this month.',icon:'🎱',coins:2000,xp:4000,target:500,statKey:'monthlyBalls',type:'monthly'},
    {id:'m_pocket_1000',name:'1,000 Balls Month',desc:'Pocket 1,000 balls this month.',icon:'🎱',coins:4000,xp:8000,target:1000,statKey:'monthlyBalls',type:'monthly'},
    {id:'m_earn_20k',name:'Earn 20,000 Coins',desc:'Earn 20,000 coins this month.',icon:'💰',coins:3000,xp:6000,target:20000,statKey:'monthlyCoins',type:'monthly'},
    {id:'m_earn_50k',name:'Earn 50,000 Coins',desc:'Earn 50,000 coins this month.',icon:'💰',coins:6000,xp:12000,target:50000,statKey:'monthlyCoins',type:'monthly'},
    {id:'m_challenges_20',name:'20 Challenges Done',desc:'Complete 20 challenges this month.',icon:'📋',coins:3000,xp:6000,target:20,statKey:'monthlyChallenges',type:'monthly'},
    {id:'m_login_30',name:'Login 30 Days',desc:'Login every day this month.',icon:'📅',coins:5000,xp:10000,target:30,statKey:'loginStreak',type:'monthly'},
    {id:'m_level_up',name:'Level Up x3',desc:'Level up 3 times this month.',icon:'⭐',coins:2500,xp:5000,target:3,statKey:'monthlyLevelUps',type:'monthly'},
    {id:'m_bank_100',name:'100 Bank Shots',desc:'Make 100 bank shots this month.',icon:'↗️',coins:3000,xp:6000,target:100,statKey:'monthlyBanks',type:'monthly'},
    {id:'m_beat_hard_10',name:'Beat Hard AI x10',desc:'Beat hard AI 10 times.',icon:'🤖',coins:4000,xp:8000,target:10,statKey:'monthlyHardWins',type:'monthly'},
    {id:'m_spend_5k',name:'Spend 5,000 Coins',desc:'Purchase 5,000 coins worth of items.',icon:'🛒',coins:1000,xp:2000,target:5000,statKey:'monthlySpend',type:'monthly'},
    {id:'m_snooker_10',name:'Snooker Champion',desc:'Win 10 snooker frames.',icon:'🔴',coins:3500,xp:7000,target:10,statKey:'monthlySnookerWins',type:'monthly'},
    {id:'m_streak_10',name:'10-Game Streak',desc:'Win 10 games in a row this month.',icon:'🔥',coins:5000,xp:10000,target:10,statKey:'bestStreak',type:'monthly'},
    {id:'m_all_modes',name:'Complete Tour',desc:'Win all 9 game modes this month.',icon:'🎱',coins:8000,xp:16000,target:9,statKey:'monthlyModeWins',type:'monthly'},
  ]
};
// ── Rules Database ─────────────────────────────────────────────
const RULES_DB = {
  eightball:{title:'8-Ball Pool',icon:'8',sub:'Standard Rules',rules:[{h:'Objective',p:'Pocket all your group (solids or stripes) then legally pocket the 8-ball to win.'},{h:'Break',p:'The breaking player must hit the rack. If no balls pocket, opponent may accept or re-rack.'},{h:'Group Assignment',p:'Groups assigned on first legal pocket after break. Solid pockets = solids; stripe pockets = stripes.'},{h:'8-Ball',p:'The 8-ball may only be shot after clearing your group. Early 8-ball or scratch = loss.'},{h:'Ball in Hand',p:'On a foul, opponent gets ball-in-hand anywhere.'}],tips:[{icon:'🎯',title:'Break Power',text:'Hit the lead ball dead-center with max power for the best spread.'},{icon:'🔵',title:'Play Safe',text:'If no clear shot, play a safety.'},{icon:'🧮',title:'Plan Ahead',text:'Think two shots ahead.'},{icon:'8️⃣',title:'8-Ball Timing',text:"Don't rush the 8-ball."}],fouls:[{title:'Scratch',text:'Cue ball pocketed → Ball in hand.'},{title:'No Rail',text:'No ball touches cushion → Ball in hand.'},{title:'Wrong Ball First',text:"Hitting opponent's ball first → Ball in hand."},{title:'8-Ball Foul',text:'Early 8-ball or scratch on 8-ball → Immediate loss.'}]},
  nineball:{title:'9-Ball Pool',icon:'9',sub:'Standard Rules',rules:[{h:'Objective',p:'Legally pocket the 9-ball to win. Must contact lowest ball first.'},{h:'Break',p:'9-ball on break = immediate win.'},{h:'Combo Wins',p:'Combo the 9-ball legally at any time to win.'},{h:'Push Out',p:'After break, shooter may push out once.'}],tips:[{icon:'🎯',title:'Lowest First',text:'Always hit the lowest ball first.'},{icon:'🔢',title:'9-Ball Combos',text:'Always look for 9-ball combinations.'},{icon:'💨',title:'Aggressive Break',text:'A powerful break can win immediately.'}],fouls:[{title:'Scratch',text:'Ball in hand anywhere.'},{title:'Wrong Ball First',text:'Ball in hand.'},{title:'No Rail',text:'Ball in hand.'},{title:'3 Fouls',text:'Opponent wins.'}]},
  tenball:{title:'10-Ball Pool',icon:'10',sub:'Call Shot Rules',rules:[{h:'Objective',p:'Pocket the 10-ball legally. Call-shot required.'},{h:'Call Shot',p:'Must call ball and pocket each shot.'},{h:'Break',p:'2 balls must hit cushions on break.'},{h:'Lowest First',p:'Must hit lowest ball first.'}],tips:[{icon:'📢',title:'Call Shot',text:'Announce ball and pocket every shot.'},{icon:'🔟',title:'Patience',text:'10-Ball rewards patience.'}],fouls:[{title:'Scratch',text:'Ball in hand.'},{title:'Wrong Ball First',text:'Ball in hand.'},{title:'Uncalled',text:'Ball spotted, no point.'}]},
  sevenball:{title:'7-Ball Pool',icon:'7',sub:'Speed Rules',rules:[{h:'Objective',p:'Pocket the 7-ball to win.'},{h:'Win Condition',text:'Pocket 7-ball after hitting lowest first.'}],tips:[{icon:'⚡',title:'Fast Paced',text:'Always look for 7-ball combos.'}],fouls:[{title:'Scratch',text:'Ball in hand behind head string.'},{title:'Wrong Ball First',text:'Ball in hand.'}]},
  blackball:{title:'Blackball',icon:'●',sub:'British Pool Rules',rules:[{h:'Objective',p:'Pocket all your group then the black.'},{h:'Two Shots',p:'Foul = opponent gets two visits.'}],tips:[{icon:'🎯',title:'Call Your Black',text:'Always declare pocket for the black ball.'}],fouls:[{title:'Foul',text:'Two visits.'},{title:'Black Wrong Pocket',text:'Immediate loss.'}]},
  straightpool:{title:'Straight Pool',icon:'15',sub:'Continuous Pool',rules:[{h:'Objective',p:'First to reach target score wins. Each ball = 1pt.'},{h:'Call Shot',p:'Must call every shot.'}],tips:[{icon:'📋',title:'Call Every Shot',text:'Slop shots score nothing.'}],fouls:[{title:'Scratch',text:'-1 point, ball in hand.'}]},
  onepocket:{title:'One Pocket',icon:'◎',sub:'Strategic Pool',rules:[{h:'Objective',p:'First to pocket 8 balls in your designated pocket wins.'}],tips:[{icon:'🛡️',title:'Defense First',text:'Deny your opponent their pocket.'}],fouls:[{title:'Scratch',text:'One spotted ball returned.'}]},
  bankpool:{title:'Bank Pool',icon:'↗',sub:'Bank Shot Rules',rules:[{h:'Objective',p:'First to bank 5 balls wins.'},{h:'Bank Only',text:'All shots must be banks.'}],tips:[{icon:'📐',title:'Use the Diamonds',text:'Read the diamond dots for bank angles.'}],fouls:[{title:'No Bank',text:'Ball spotted, no score.'}]},
  snooker:{title:'Snooker',icon:'S',sub:'Full Rules',rules:[{h:'Objective',p:'Score more points than opponent.'},{h:'Values',p:'Red=1, Yellow=2, Green=3, Brown=4, Blue=5, Pink=6, Black=7.'},{h:'Sequence',p:'Alternate red then color. Reds stay down, colors re-spotted.'}],tips:[{icon:'🎯',title:'Cue Ball Control',text:"Snooker is 90% position."},{icon:'🔴',title:'Black After Red',text:'Always target the black (7pts).'}],fouls:[{title:'Foul',text:'Minimum 4 pts to opponent.'},{title:'In-Off',text:'4pt penalty.'}]},
};
// ── Game Tips ──────────────────────────────────────────────────
const GAME_TIPS = [
  "Click and drag from the cue ball to aim. Further = more power.",
  "Use top spin (aim high on cue) for forward roll after contact.",
  "Back spin pulls the cue ball back after impact.",
  "Side spin (English) changes the angle off cushions.",
  "Plan your next shot before taking the current one.",
  "A safety is smarter than a low-percentage pot.",
  "Speed control is just as important as direction.",
  "Break clusters early to avoid trouble later.",
  "The ghost ball method: visualize where the cue ball must contact.",
  "Bank shots: angle in = angle out (at equal speed).",
  "In 9-ball, always look for a 9-ball combo opportunity.",
  "In snooker, position for the black after every red.",
  "Bank pool rewards reading the table diamonds.",
  "In one pocket, defense is as powerful as offense.",
];
// ── Daily Login Rewards ────────────────────────────────────────
const DAILY_REWARDS = [50, 75, 100, 125, 150, 200, 300];
// ══════════════════════════════════════════════════════════════
//  PLAYER DATA / SAVE SYSTEM
// ══════════════════════════════════════════════════════════════
const SAVE_KEY = 'midnight_billiards_save_v3';
function defaultPlayer() {
  return {
    username: 'Player',
    email: '',
    isGuest: false,
    loggedIn: true,
    avatar: 'avatar_0_0',
    equippedCue: 'oak_classic',
    equippedTitle: 'rookie',
    level: 1,
    xp: 0,
    coins: 500,
    totalCoinsEarned: 500,
    totalCoinsSpent: 0,
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    ballsPocketed: 0,
    bankShots: 0,
    bestStreak: 0,
    currentStreak: 0,
    noLossStreak: 0,
    aiGamesPlayed: 0,
    pvpGamesPlayed: 0,
    pvpWins: 0,
    easyAIWins: 0,
    mediumAIWins: 0,
    hardAIWins: 0,
    eightballWins: 0,
    nineballWins: 0,
    tenballWins: 0,
    sevenballWins: 0,
    blackballWins: 0,
    straightpoolWins: 0,
    onepocketWins: 0,
    bankpoolWins: 0,
    snookerWins: 0,
    combos: 0,
    trickShots: 0,
    perfectBreaks: 0,
    flawlessGames: 0,
    breakRuns: 0,
    safeties: 0,
    powerBreaks: 0,
    cleanGames: 0,
    threeRailShots: 0,
    perfectPositions: 0,
    speedWins: 0,
    longGames: 0,
    comebacks: 0,
    whitewashes: 0,
    runOuts: 0,
    modesTried: 0,
    modeWins: 0,
    monthlyWins: 0,
    challengesDone: 0,
    dailyClaims: 0,
    loginStreak: 0,
    lastLoginDate: null,
    lastDailyDate: null,
    itemsBought: 0,
    shopOpens: 0,
    streakBonuses: 0,
    challengeCoinsEarned: 0,
    achievementCoinsEarned: 0,
    challengeXpEarned: 0,
    dailyChallengesDone: 0,
    weeklyChallengesDone: 0,
    monthlyChallengesDone: 0,
    challengeStreak: 0,
    challengeTypesDone: 0,
    fastChallenges: 0,
    longShots: 0,
    masseShots: 0,
    jumpShots: 0,
    tripleCombos: 0,
    swerveShots: 0,
    allBankWins: 0,
    fullSpins: 0,
    perfectShapes: 0,
    doubleKisses: 0,
    extremeAnglePockets: 0,
    maxPowerPockets: 0,
    minPowerPockets: 0,
    allRailShots: 0,
    tenBallRuns: 0,
    shotTypes: 0,
    fullStripes: 0,
    softWins: 0,
    hardWins: 0,
    nineOnBreak: 0,
    eightOnBreak: 0,
    snookerCentury: 0,
    monthlyLevelUps: 0,
    monthlyBanks: 0,
    monthlySnookerWins: 0,
    monthlyHardWins: 0,
    monthlySpend: 0,
    weeklyWins: 0,
    weeklyBalls: 0,
    weeklyCoins: 0,
    weeklyBanks: 0,
    weeklyModes: 0,
    weeklyHardWins: 0,
    weeklyDailyChallenges: 0,
    weeklySnookerWins: 0,
    weeklyCleanWins: 0,
    weeklySpend: 0,
    weeklyAIDiffs: 0,
    perfectDays: 0,
    monthlyChallenges: 0,
    dailyWins: 0,
    dailyBalls: 0,
    dailyCoins: 0,
    dailyGames: 0,
    dailyBanks: 0,
    dailyAIWins: 0,
    dailyHardAIWins: 0,
    dailyCombos: 0,
    daily8BallGames: 0,
    daily9BallGames: 0,
    dailySnookerGames: 0,
    dailyCleanWins: 0,
    cuesOwned: ['oak_classic'],
    avatarsOwned: ['avatar_0_0'],
    titlesOwned: ['rookie'],
    achievementsUnlocked: [],
    activeChallenges: [],
    completedChallengeIds: [],
    currentCoins: 500,
    legendaryCues: 0,
    mythicCues: 0,
    legendaryAvatars: 0,
    rareCues: 0,
    epicCues: 0,
    eventItems: 0,
    raritiesOwned: 0,
    outfitComplete: 0,
    winRate: 0,
    dailyWinCount: 0,
    noFoulGames: 0,
    monthlyModeWins: 0,
  };
}
let player = defaultPlayer();
function savePlayer() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(player)); } catch(e) {}
}
function loadPlayer() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      player = { ...defaultPlayer(), ...saved };
    }
  } catch(e) { player = defaultPlayer(); }
}
// ══════════════════════════════════════════════════════════════
//  CHALLENGE SYSTEM
// ══════════════════════════════════════════════════════════════
function generateChallenges() {
  const today = new Date().toDateString();
  const week = getWeekKey();
  const month = getMonthKey();
  if (!player.activeChallenges) player.activeChallenges = [];
  // Remove expired
  player.activeChallenges = player.activeChallenges.filter(c => {
    if (c.type === 'daily') return c.dateKey === today;
    if (c.type === 'weekly') return c.dateKey === week;
    if (c.type === 'monthly') return c.dateKey === month;
    return false;
  });
  // Generate daily (4 random)
  const hasDailies = player.activeChallenges.filter(c => c.type === 'daily').length > 0;
  if (!hasDailies) {
    const shuffled = shuffle([...CHALLENGES_TEMPLATES.daily]);
    shuffled.slice(0, 4).forEach(tmpl => {
      player.activeChallenges.push({ ...tmpl, progress: 0, complete: false, dateKey: today });
    });
  }
  // Weekly (3)
  const hasWeeklies = player.activeChallenges.filter(c => c.type === 'weekly').length > 0;
  if (!hasWeeklies) {
    const shuffled = shuffle([...CHALLENGES_TEMPLATES.weekly]);
    shuffled.slice(0, 3).forEach(tmpl => {
      player.activeChallenges.push({ ...tmpl, progress: 0, complete: false, dateKey: week });
    });
  }
  // Monthly (2)
  const hasMonthlies = player.activeChallenges.filter(c => c.type === 'monthly').length > 0;
  if (!hasMonthlies) {
    const shuffled = shuffle([...CHALLENGES_TEMPLATES.monthly]);
    shuffled.slice(0, 2).forEach(tmpl => {
      player.activeChallenges.push({ ...tmpl, progress: 0, complete: false, dateKey: month });
    });
  }
  savePlayer();
}
function getWeekKey() {
  const d = new Date();
  const jan1 = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((d - jan1) / 86400000 + jan1.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${week}`;
}
function getMonthKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}`;
}
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
function updateChallengeProgress(statKey, amount = 1) {
  if (!player.activeChallenges) return;
  const newlyComplete = [];
  player.activeChallenges.forEach(ch => {
    if (ch.complete) return;
    if (ch.statKey === statKey) {
      ch.progress = Math.min(ch.target, (ch.progress || 0) + amount);
      if (ch.progress >= ch.target) {
        ch.complete = true;
        player.coins += ch.coins;
        player.totalCoinsEarned += ch.coins;
        player.currentCoins = player.coins;
        player.challengeCoinsEarned += ch.coins;
        addXP(ch.xp);
        player.challengesDone++;
        player.challengeXpEarned += ch.xp;
        if (ch.type === 'daily') player.dailyChallengesDone++;
        if (ch.type === 'weekly') player.weeklyChallengesDone++;
        if (ch.type === 'monthly') player.monthlyChallengesDone++;
        if (!player.completedChallengeIds) player.completedChallengeIds = [];
        player.completedChallengeIds.push(ch.id);
        newlyComplete.push(ch);
      }
    }
  });
  if (newlyComplete.length) {
    newlyComplete.forEach(ch => showToast(`📋 Challenge Complete: ${ch.name} +${ch.coins}🪙`, 'success'));
    checkAchievements();
    savePlayer();
    updateNavCoins();
    renderChallengesPanel();
  }
}
// ══════════════════════════════════════════════════════════════
//  ACHIEVEMENT SYSTEM
// ══════════════════════════════════════════════════════════════
function checkAchievements() {
  const newlyUnlocked = [];
  ACHIEVEMENTS_DB.forEach(ach => {
    if (player.achievementsUnlocked.includes(ach.id)) return;
    let val = 0;
    if (ach.statKey === 'winRate') {
      val = player.gamesPlayed >= 20 ? Math.round((player.wins / player.gamesPlayed) * 100) : 0;
    } else if (ach.statKey === 'level') {
      val = player.level;
    } else if (ach.statKey === 'currentCoins') {
      val = player.coins;
    } else {
      val = player[ach.statKey] || 0;
    }
    if (val >= ach.target) {
      player.achievementsUnlocked.push(ach.id);
      player.coins += ach.coins;
      player.totalCoinsEarned += ach.coins;
      player.currentCoins = player.coins;
      player.achievementCoinsEarned += ach.coins;
      addXP(ach.xp);
      newlyUnlocked.push(ach);
    }
  });
  if (newlyUnlocked.length) {
    newlyUnlocked.forEach(ach => {
      showRewardPopup(`🏆 ${ach.name}`, ach.desc, `+${ach.coins}🪙 +${ach.xp}⭐`);
    });
    savePlayer();
    updateNavCoins();
    return newlyUnlocked;
  }
  return [];
}
// ══════════════════════════════════════════════════════════════
//  XP & LEVEL SYSTEM
// ══════════════════════════════════════════════════════════════
function addXP(amount) {
  player.xp += amount;
  let leveled = false;
  while (player.xp >= xpForLevel(player.level)) {
    player.xp -= xpForLevel(player.level);
    player.level++;
    leveled = true;
    player.monthlyLevelUps++;
    // Level up rewards
    const bonusCoins = player.level * 50;
    player.coins += bonusCoins;
    player.totalCoinsEarned += bonusCoins;
    player.currentCoins = player.coins;
  }
  if (leveled) {
    updateNavCoins();
    renderPlayPanel();
  }
}
// ══════════════════════════════════════════════════════════════
//  COIN SYSTEM
// ══════════════════════════════════════════════════════════════
function awardCoins(amount, reason) {
  player.coins += amount;
  player.totalCoinsEarned += amount;
  player.currentCoins = player.coins;
  player.dailyCoins = (player.dailyCoins || 0) + amount;
  player.weeklyCoins = (player.weeklyCoins || 0) + amount;
  player.monthlyCoins = (player.monthlyCoins || 0) + amount;
  updateNavCoins();
  savePlayer();
}
function spendCoins(amount) {
  player.coins -= amount;
  player.currentCoins = player.coins;
  player.totalCoinsSpent += amount;
  player.weeklySpend = (player.weeklySpend || 0) + amount;
  player.monthlySpend = (player.monthlySpend || 0) + amount;
  updateNavCoins();
  savePlayer();
}
function updateNavCoins() {
  const els = document.querySelectorAll('#navCoins,#shopCoins');
  els.forEach(el => { if (el) el.textContent = player.coins.toLocaleString(); });
}
// ══════════════════════════════════════════════════════════════
//  DAILY LOGIN REWARDS
// ══════════════════════════════════════════════════════════════
function checkDailyLogin() {
  const today = new Date().toDateString();
  if (player.lastLoginDate !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (player.lastLoginDate !== yesterday.toDateString()) {
      player.loginStreak = 0;
    }
    player.lastLoginDate = today;
    // Reset daily stats
    player.dailyWins = 0; player.dailyBalls = 0; player.dailyCoins = 0;
    player.dailyGames = 0; player.dailyBanks = 0; player.dailyAIWins = 0;
    player.dailyHardAIWins = 0; player.dailyCombos = 0;
    player.daily8BallGames = 0; player.daily9BallGames = 0;
    player.dailySnookerGames = 0; player.dailyCleanWins = 0;
    savePlayer();
  }
  renderDailyLoginCard();
}
function claimDailyReward() {
  const today = new Date().toDateString();
  if (player.lastDailyDate === today) {
    showToast('Already claimed today!', 'error'); return;
  }
  player.loginStreak = Math.min((player.loginStreak || 0) + 1, 7);
  const dayIdx = (player.loginStreak - 1) % 7;
  const reward = DAILY_REWARDS[dayIdx];
  player.lastDailyDate = today;
  player.dailyClaims = (player.dailyClaims || 0) + 1;
  awardCoins(reward, 'Daily Login');
  addXP(reward);
  updateChallengeProgress('dailyClaims', 1);
  showToast(`🎁 Day ${player.loginStreak} Reward: +${reward} 🪙`, 'success');
  renderDailyLoginCard();
  checkAchievements();
  savePlayer();
}
function renderDailyLoginCard() {
  const card = document.getElementById('dailyLoginCard');
  if (!card) return;
  const today = new Date().toDateString();
  const alreadyClaimed = player.lastDailyDate === today;
  const streak = player.loginStreak || 0;
  const daysEl = document.getElementById('dlcDays');
  daysEl.innerHTML = '';
  DAILY_REWARDS.forEach((coins, i) => {
    const dot = document.createElement('div');
    dot.className = 'dlc-day-dot';
    const dayNum = i + 1;
    if (dayNum < streak || (dayNum === streak && alreadyClaimed)) dot.classList.add('done');
    else if (dayNum === streak + (alreadyClaimed ? 0 : 0) && !alreadyClaimed && dayNum === streak + 1) dot.classList.add('today');
    else if (dayNum === (streak % 7) + 1 && !alreadyClaimed) dot.classList.add('today');
    dot.textContent = dayNum;
    dot.title = `+${coins} 🪙`;
    daysEl.appendChild(dot);
  });
  const claimBtn = document.getElementById('btnClaimDaily');
  const daySpan = document.getElementById('dlcDay');
  const nextDay = (streak % 7) + 1;
  if (daySpan) daySpan.textContent = nextDay;
  if (alreadyClaimed) {
    claimBtn.disabled = true;
    claimBtn.textContent = '✓ Claimed Today';
    claimBtn.style.opacity = '0.5';
  } else {
    claimBtn.disabled = false;
    claimBtn.textContent = `Claim Day ${nextDay} (+${DAILY_REWARDS[nextDay - 1]}🪙)`;
    claimBtn.style.opacity = '1';
  }
}
// ══════════════════════════════════════════════════════════════
//  HUB UI RENDERING
// ══════════════════════════════════════════════════════════════
function renderHubUI() {
  updateNavCoins();
  renderNavAvatar();
  renderPlayPanel();
  renderShopPanel();
  renderChallengesPanel();
  renderAchievementsPanel();
  renderProfilePanel();
  renderDailyLoginCard();
  renderActiveChallengesSidebar();
  renderRecentAchievementsSidebar();
  updateChallengeTimers();
}
function renderNavAvatar() {
  const av = AVATARS_DB.find(a => a.id === player.avatar);
  const emoji = av ? av.emoji : '🎱';
  const navAv = document.getElementById('navAvatar');
  if (navAv) navAv.textContent = emoji;
  const hubAv = document.getElementById('hubAvatar');
  if (hubAv) hubAv.textContent = emoji;
  const profileAv = document.getElementById('profileAvatar');
  if (profileAv) profileAv.textContent = emoji;
}
function renderPlayPanel() {
  const av = AVATARS_DB.find(a => a.id === player.avatar);
  const emoji = av ? av.emoji : '🎱';
  set('hubAvatar', emoji);
  set('hubUsername', player.username);
  const title = TITLES_DB.find(t => t.id === player.equippedTitle);
  set('hubTitle', title ? title.name : 'Rookie');
  set('hubLevel', player.level);
  const curXP = player.xp;
  const maxXP = xpForLevel(player.level);
  set('hubXpCur', curXP);
  set('hubXpMax', maxXP);
  const fill = document.getElementById('hubXpFill');
  if (fill) fill.style.width = Math.min(100, (curXP / maxXP * 100)) + '%';
  // Quick stats
  set('qsWins', player.wins);
  const wr = player.gamesPlayed > 0 ? Math.round(player.wins / player.gamesPlayed * 100) : 0;
  set('qsWinRate', wr + '%');
  set('qsStreak', player.bestStreak);
  set('qsBalls', player.ballsPocketed);
}
function renderShopPanel() {
  updateNavCoins();
}
let currentShopTab = 'cues';
let currentShopSearch = '';
let currentShopRarity = 'all';
let currentShopOwner = 'all';
function renderShopGrid() {
  const grid = document.getElementById('shopGrid');
  if (!grid) return;
  grid.innerHTML = '';
  let items = [];
  if (currentShopTab === 'cues') {
    items = CUES_DB.map(c => ({
      id: c.id, name: c.name, rarity: c.rarity, price: c.price,
      emoji: c.emoji, desc: c.desc, type: 'cue',
      owned: player.cuesOwned.includes(c.id),
      equipped: player.equippedCue === c.id,
    }));
  } else if (currentShopTab === 'avatars') {
    items = AVATARS_DB.map(a => ({
      id: a.id, name: a.name, rarity: a.rarity, price: a.price,
      emoji: a.emoji, desc: `${RARITIES[a.rarity]?.label || ''} avatar`, type: 'avatar',
      owned: player.avatarsOwned.includes(a.id),
      equipped: player.avatar === a.id,
    }));
  } else if (currentShopTab === 'titles') {
    items = TITLES_DB.map(t => ({
      id: t.id, name: t.name, rarity: t.rarity, price: t.price,
      emoji: '🏅', desc: t.unlockReq ? `Requires: ${t.unlockReq}` : 'Available for purchase', type: 'title',
      owned: player.titlesOwned.includes(t.id),
      equipped: player.equippedTitle === t.id,
    }));
  } else if (currentShopTab === 'featured') {
    // Mix of higher-rarity items
    const featuredCues = CUES_DB.filter(c => c.rarity === 'legendary' || c.rarity === 'mythic').slice(0, 6);
    const featuredAvatars = AVATARS_DB.filter(a => a.rarity === 'legendary').slice(0, 4);
    items = [
      ...featuredCues.map(c => ({id:c.id,name:c.name,rarity:c.rarity,price:Math.floor(c.price*0.9),emoji:c.emoji,desc:'⭐ Featured Deal! 10% off',type:'cue',owned:player.cuesOwned.includes(c.id),equipped:player.equippedCue===c.id})),
      ...featuredAvatars.map(a => ({id:a.id,name:a.name,rarity:a.rarity,price:Math.floor(a.price*0.9),emoji:a.emoji,desc:'⭐ Featured Deal! 10% off',type:'avatar',owned:player.avatarsOwned.includes(a.id),equipped:player.avatar===a.id})),
    ];
  }
  // Filter
  if (currentShopSearch) {
    const q = currentShopSearch.toLowerCase();
    items = items.filter(i => i.name.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q));
  }
  if (currentShopRarity !== 'all') items = items.filter(i => i.rarity === currentShopRarity);
  if (currentShopOwner === 'owned') items = items.filter(i => i.owned);
  if (currentShopOwner === 'unowned') items = items.filter(i => !i.owned);
  items.forEach(item => {
    const el = document.createElement('div');
    el.className = `shop-item${item.owned ? ' owned' : ''}${item.equipped ? ' equipped' : ''}`;
    const rarColor = RARITIES[item.rarity]?.color || '#888';
    el.innerHTML = `
      <div class="item-preview">${item.emoji}</div>
      <div class="item-name">${item.name}</div>
      <div class="item-rarity rarity-${item.rarity}">${RARITIES[item.rarity]?.label || item.rarity}</div>
      <div class="item-price"><span class="coin-icon">🪙</span>${item.owned ? 'Owned' : item.price.toLocaleString()}</div>
      ${item.equipped ? '<div class="item-badge badge-equipped">Equipped</div>' : ''}
      ${item.owned && !item.equipped ? '<div class="item-badge badge-owned">Owned</div>' : ''}
    `;
    el.style.setProperty('--rarity-glow', rarColor);
    el.addEventListener('click', () => openPurchaseModal(item));
    grid.appendChild(el);
  });
  if (items.length === 0) {
    grid.innerHTML = '<div style="color:var(--text-dim);padding:40px;text-align:center;grid-column:1/-1">No items found.</div>';
  }
}
let pendingPurchaseItem = null;
function openPurchaseModal(item) {
  pendingPurchaseItem = item;
  document.getElementById('purchasePreview').textContent = item.emoji;
  document.getElementById('purchaseName').textContent = item.name;
  const rarEl = document.getElementById('purchaseRarity');
  rarEl.textContent = RARITIES[item.rarity]?.label || item.rarity;
  rarEl.className = `purchase-rarity rarity-${item.rarity}`;
  document.getElementById('purchaseDesc').textContent = item.desc || '';
  document.getElementById('purchasePrice').textContent = item.price.toLocaleString();
  const confirmBtn = document.getElementById('btnConfirmPurchase');
  if (item.owned) {
    if (item.equipped) {
      confirmBtn.textContent = '✓ Equipped';
      confirmBtn.disabled = true;
    } else {
      confirmBtn.textContent = '⚡ Equip';
      confirmBtn.disabled = false;
    }
  } else {
    confirmBtn.textContent = `Buy for 🪙${item.price.toLocaleString()}`;
    confirmBtn.disabled = false;
  }
  document.getElementById('purchaseModal').classList.add('active');
}
function confirmPurchase() {
  const item = pendingPurchaseItem;
  if (!item) return;
  if (item.owned) {
    // Equip
    if (item.type === 'cue') player.equippedCue = item.id;
    else if (item.type === 'avatar') player.avatar = item.id;
    else if (item.type === 'title') player.equippedTitle = item.id;
    showToast(`⚡ Equipped: ${item.name}`, 'success');
    savePlayer();
    renderHubUI();
    document.getElementById('purchaseModal').classList.remove('active');
    return;
  }
  if (player.coins < item.price) {
    showToast('❌ Not enough coins!', 'error'); return;
  }
  spendCoins(item.price);
  player.itemsBought++;
  if (item.type === 'cue') {
    player.cuesOwned.push(item.id);
    player.cuesOwned = [...new Set(player.cuesOwned)];
    player.equippedCue = item.id;
    const cue = CUES_DB.find(c => c.id === item.id);
    if (cue) {
      if (cue.rarity === 'rare') player.rareCues++;
      if (cue.rarity === 'epic') player.epicCues++;
      if (cue.rarity === 'legendary') player.legendaryCues++;
      if (cue.rarity === 'mythic') player.mythicCues++;
      if (cue.id.includes('halloween') || cue.id.includes('christmas') || cue.id.includes('new_year')) player.eventItems++;
    }
  } else if (item.type === 'avatar') {
    player.avatarsOwned.push(item.id);
    player.avatarsOwned = [...new Set(player.avatarsOwned)];
    player.avatar = item.id;
    const av = AVATARS_DB.find(a => a.id === item.id);
    if (av && av.rarity === 'legendary') player.legendaryAvatars++;
  } else if (item.type === 'title') {
    player.titlesOwned.push(item.id);
    player.titlesOwned = [...new Set(player.titlesOwned)];
    player.equippedTitle = item.id;
  }
  // Update rarity coverage
  const rarities = new Set([
    ...player.cuesOwned.map(id => CUES_DB.find(c => c.id === id)?.rarity),
    ...player.avatarsOwned.map(id => AVATARS_DB.find(a => a.id === id)?.rarity),
  ].filter(Boolean));
  player.raritiesOwned = rarities.size;
  player.outfitComplete = player.equippedCue && player.avatar && player.equippedTitle ? 1 : 0;
  showToast(`🎉 Purchased: ${item.name}!`, 'success');
  checkAchievements();
  savePlayer();
  renderHubUI();
  document.getElementById('purchaseModal').classList.remove('active');
  updateChallengeProgress('itemsBought', 1);
}
function renderChallengesPanel(type = 'daily') {
  const grid = document.getElementById('challengesGrid');
  if (!grid) return;
  grid.innerHTML = '';
  const challenges = (player.activeChallenges || []).filter(c => c.type === type);
  challenges.forEach(ch => {
    const pct = Math.min(100, Math.round((ch.progress / ch.target) * 100));
    const el = document.createElement('div');
    el.className = `challenge-card${ch.complete ? ' complete' : ''}`;
    el.innerHTML = `
      <div class="ch-top">
        <div class="ch-info">
          <div class="ch-name">${ch.icon} ${ch.name}</div>
          <div class="ch-desc">${ch.desc}</div>
        </div>
        <div class="ch-rewards">
          <div class="ch-reward-item">🪙 ${ch.coins}</div>
          <div class="ch-reward-item">⭐ ${ch.xp} XP</div>
        </div>
      </div>
      <div class="ch-progress-wrap">
        <div class="ch-progress-bar"><div class="ch-progress-fill" style="width:${pct}%"></div></div>
        <div class="ch-progress-label"><span>${ch.progress}/${ch.target}</span><span>${pct}%</span></div>
        ${ch.complete ? '<div class="ch-complete-badge">✓ Complete</div>' : ''}
      </div>
    `;
    grid.appendChild(el);
  });
  if (challenges.length === 0) {
    grid.innerHTML = '<div style="color:var(--text-dim);padding:40px;text-align:center">No challenges available.</div>';
  }
}
function renderAchievementsPanel() {
  const grid = document.getElementById('achievementsGrid');
  if (!grid) return;
  const catFilter = document.getElementById('achCatFilter')?.value || 'all';
  const statusFilter = document.getElementById('achStatusFilter')?.value || 'all';
  let filtered = ACHIEVEMENTS_DB;
  if (catFilter !== 'all') filtered = filtered.filter(a => a.cat === catFilter);
  if (statusFilter === 'unlocked') filtered = filtered.filter(a => player.achievementsUnlocked.includes(a.id));
  if (statusFilter === 'locked') filtered = filtered.filter(a => !player.achievementsUnlocked.includes(a.id));
  grid.innerHTML = '';
  filtered.forEach(ach => {
    const unlocked = player.achievementsUnlocked.includes(ach.id);
    const val = player[ach.statKey] || 0;
    const pct = Math.min(100, Math.round((val / ach.target) * 100));
    const el = document.createElement('div');
    el.className = `ach-card${unlocked ? ' unlocked' : ''}`;
    el.innerHTML = `
      <div class="ach-icon">${ach.icon}</div>
      <div class="ach-info">
        <div class="ach-name">${ach.name}</div>
        <div class="ach-desc">${ach.desc}</div>
        <div class="ach-progress-bar"><div class="ach-progress-fill" style="width:${pct}%"></div></div>
        <div class="ach-rewards-row">
          <span class="ach-reward-chip">🪙 ${ach.coins}</span>
          <span class="ach-reward-chip">⭐ ${ach.xp} XP</span>
          <span class="ach-reward-chip">${val}/${ach.target}</span>
          ${unlocked ? '<span style="color:var(--neon-green);font-size:10px">✓ DONE</span>' : ''}
        </div>
      </div>
    `;
    grid.appendChild(el);
  });
  // Update stats
  const total = player.achievementsUnlocked.length;
  const pct = Math.round(total / ACHIEVEMENTS_DB.length * 100);
  set('achTotal', total);
  set('achPercent', pct + '%');
  set('achCoins', player.achievementCoinsEarned || 0);
}
function renderProfilePanel() {
  const av = AVATARS_DB.find(a => a.id === player.avatar);
  set('profileAvatar', av ? av.emoji : '🎱');
  set('profileUsername', player.username);
  const title = TITLES_DB.find(t => t.id === player.equippedTitle);
  set('profileTitle', title ? title.name : 'Rookie');
  set('profileTitleEquip', title ? title.name : 'Rookie');
  set('profileLevel', player.level);
  const cue = CUES_DB.find(c => c.id === player.equippedCue);
  set('profileCue', cue ? `${cue.emoji} ${cue.name}` : '🎱 Oak Classic');
  set('stGames', player.gamesPlayed);
  set('stWins', player.wins);
  set('stLosses', player.losses);
  const wr = player.gamesPlayed > 0 ? Math.round(player.wins / player.gamesPlayed * 100) : 0;
  set('stWinRate', wr + '%');
  set('stStreak', player.bestStreak);
  set('stBalls', player.ballsPocketed);
  set('stBanks', player.bankShots);
  set('stCoins', player.totalCoinsEarned.toLocaleString());
  set('stAch', player.achievementsUnlocked.length);
  set('stChal', player.challengesDone);
  set('stXP', player.xp + (player.level > 1 ? Array.from({length:player.level-1},(_,i)=>xpForLevel(i+1)).reduce((a,b)=>a+b,0) : 0));
  set('stLevel', player.level);
}
function renderActiveChallengesSidebar() {
  const list = document.getElementById('activeChallengesList');
  if (!list) return;
  list.innerHTML = '';
  const active = (player.activeChallenges || []).filter(c => !c.complete).slice(0, 3);
  active.forEach(ch => {
    const pct = Math.min(100, Math.round((ch.progress / ch.target) * 100));
    const el = document.createElement('div');
    el.className = 'ch-mini';
    el.innerHTML = `<div class="ch-mini-icon">${ch.icon}</div><div class="ch-mini-info"><div class="ch-mini-name">${ch.name}</div><div class="ch-mini-sub">${ch.progress}/${ch.target} (${pct}%)</div></div>`;
    list.appendChild(el);
  });
  if (active.length === 0) list.innerHTML = '<div style="color:var(--text-dim);font-size:11px;padding:8px">No active challenges.</div>';
}
function renderRecentAchievementsSidebar() {
  const list = document.getElementById('recentAchievementsList');
  if (!list) return;
  list.innerHTML = '';
  const recent = player.achievementsUnlocked.slice(-3).reverse();
  recent.forEach(id => {
    const ach = ACHIEVEMENTS_DB.find(a => a.id === id);
    if (!ach) return;
    const el = document.createElement('div');
    el.className = 'ach-mini';
    el.innerHTML = `<div class="ach-mini-icon">${ach.icon}</div><div class="ach-mini-info"><div class="ach-mini-name">${ach.name}</div><div class="ach-mini-sub">${ach.desc}</div></div>`;
    list.appendChild(el);
  });
  if (recent.length === 0) list.innerHTML = '<div style="color:var(--text-dim);font-size:11px;padding:8px">No achievements yet.</div>';
}
function updateChallengeTimers() {
  const now = new Date();
  const midnight = new Date(now); midnight.setHours(24,0,0,0);
  const diffD = Math.round((midnight - now) / 1000);
  const endOfWeek = new Date(now);
  const dayOfWeek = now.getDay();
  endOfWeek.setDate(now.getDate() + (7 - dayOfWeek));
  endOfWeek.setHours(0,0,0,0);
  const diffW = Math.round((endOfWeek - now) / 1000);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const diffM = Math.round((endOfMonth - now) / 1000);
  const fmt = s => {
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
    return `${h}h ${m}m`;
  };
  const dt = document.getElementById('dailyTimer'); if (dt) dt.textContent = fmt(diffD);
  const wt = document.getElementById('weeklyTimer'); if (wt) wt.textContent = fmt(diffW);
  const mt = document.getElementById('monthlyTimer'); if (mt) mt.textContent = fmt(diffM);
}
// ══════════════════════════════════════════════════════════════
//  TOAST NOTIFICATIONS
// ══════════════════════════════════════════════════════════════
function showToast(msg, type = '') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}
// ══════════════════════════════════════════════════════════════
//  REWARD POPUP
// ══════════════════════════════════════════════════════════════
function showRewardPopup(title, sub, rewards) {
  const popup = document.getElementById('rewardPopup');
  document.getElementById('rpTitle').textContent = title;
  document.getElementById('rpSub').textContent = sub;
  document.getElementById('rpRewards').textContent = rewards;
  popup.style.display = 'flex';
  setTimeout(() => { popup.style.display = 'none'; }, 3500);
}
// ══════════════════════════════════════════════════════════════
//  AUTH LOGIC
// ══════════════════════════════════════════════════════════════
function switchAuthTab(tab) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
  if (tab === 'login') document.getElementById('loginForm').classList.add('active');
  else if (tab === 'signup') document.getElementById('signupForm').classList.add('active');
}
function calcPasswordStrength(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (pw.length >= 14) score++;
  return score;
}
function updateStrengthMeter(pw) {
  const score = calcPasswordStrength(pw);
  const fill = document.getElementById('strengthFill');
  const label = document.getElementById('strengthLabel');
  if (!fill || !label) return;
  const pct = (score / 5) * 100;
  fill.style.width = pct + '%';
  if (score <= 1) { fill.style.background = 'var(--neon-red)'; label.textContent = 'Weak'; }
  else if (score <= 2) { fill.style.background = '#f39c12'; label.textContent = 'Fair'; }
  else if (score <= 3) { fill.style.background = '#f1c40f'; label.textContent = 'Good'; }
  else if (score <= 4) { fill.style.background = 'var(--neon-green)'; label.textContent = 'Strong'; }
  else { fill.style.background = 'var(--gold)'; label.textContent = 'Excellent'; }
}
function handleLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const pw = document.getElementById('loginPassword').value;
  if (!email || !pw) { showToast('Please fill in all fields.', 'error'); return; }
  // Simulate login (Firebase-ready stub)
  const savedEmail = localStorage.getItem('mb_email');
  const savedPw = localStorage.getItem('mb_pw');
  if (savedEmail && savedPw && email === savedEmail && pw === savedPw) {
    loadPlayer();
    player.loggedIn = true;
    enterHub();
  } else {
    showToast('Invalid email or password.', 'error');
  }
}
function handleSignup() {
  const username = document.getElementById('signupUsername').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const pw = document.getElementById('signupPassword').value;
  if (!username || !email || !pw) { showToast('Please fill in all fields.', 'error'); return; }
  if (pw.length < 8) { showToast('Password must be at least 8 characters.', 'error'); return; }
  if (calcPasswordStrength(pw) < 2) { showToast('Please choose a stronger password.', 'error'); return; }
  // Simulate registration (Firebase-ready stub)
  localStorage.setItem('mb_email', email);
  localStorage.setItem('mb_pw', pw);
  player = defaultPlayer();
  player.username = username;
  player.email = email;
  player.loggedIn = true;
  savePlayer();
  showToast(`Welcome, ${username}! 🎉`, 'success');
  enterHub();
}
function handleGuest() {
  player = defaultPlayer();
  player.username = 'Guest_' + Math.floor(Math.random() * 9999);
  player.isGuest = true;
  player.loggedIn = true;
  enterHub();
}
function handleGoogleAuth() {
  // Firebase-ready stub — simulate Google login
  const name = 'Pooler' + Math.floor(Math.random() * 9999);
  const existing = localStorage.getItem(SAVE_KEY);
  if (existing) {
    loadPlayer();
  } else {
    player = defaultPlayer();
    player.username = name;
  }
  player.loggedIn = true;
  showToast('✓ Signed in with Google', 'success');
  enterHub();
}
function enterHub() {
  generateChallenges();
  checkDailyLogin();
  savePlayer();
  showScreen('hubScreen');
  renderHubUI();
}
function handleLogout() {
  savePlayer();
  showScreen('authScreen');
}
// ══════════════════════════════════════════════════════════════
//  GAME STATE
// ══════════════════════════════════════════════════════════════
let canvas = null, ctx = null, W, H;
let state = {
  mode:'eightball', gameMode:null, aiDifficulty:'medium',
  currentPlayer:0, balls:[], cueBall:null, pockets:[],
  shooting:false, ballsMoving:false, aimAngle:0, power:0,
  isCharging:false, mousePos:{x:0,y:0}, dragStart:{x:0,y:0},
  scores:[0,0], playerGroups:[null,null], breakTaken:false,
  firstHitBall:null, ballsPocketed:[], consecutiveFouls:[0,0],
  gameOver:false, foulActive:false, ballInHand:false, placingBall:false,
  snookerRedPotted:false, onePocketScores:[0,0],
  straightPoolTarget:50, straightPoolScores:[0,0],
  soundOn:true, animFrame:null, tipRotateInterval:null,
  gameStartTime:0, gameBallsPocketed:0, gameFouls:0,
  gameMode2:'',
};
// ── Physics Constants ──────────────────────────────────────────
function dist(a,b){return Math.hypot(a.x-b.x,a.y-b.y);}
function clamp(v,lo,hi){return Math.max(lo,Math.min(hi,v));}
function lightenColor(hex,a){const n=parseInt(hex.slice(1),16);return`rgb(${Math.min(255,(n>>16)+a)},${Math.min(255,((n>>8)&0xff)+a)},${Math.min(255,(n&0xff)+a)})`;}
function darkenColor(hex,a){const n=parseInt(hex.slice(1),16);return`rgb(${Math.max(0,(n>>16)-a)},${Math.max(0,((n>>8)&0xff)-a)},${Math.max(0,(n&0xff)-a)})`;}
function setupTable(){
  const wrap=document.getElementById('tableWrap');
  let tW=Math.min(wrap.clientWidth*0.92,wrap.clientHeight*1.9*0.92);
  let tH=tW/1.9;
  if(tH>wrap.clientHeight*0.92){tH=wrap.clientHeight*0.92;tW=tH*1.9;}
  canvas.width=Math.floor(tW); canvas.height=Math.floor(tH);
  W=canvas.width; H=canvas.height;
  const px=CUSHION, py=CUSHION;
  state.pockets=[
    {x:px,y:py},{x:W/2,y:py},{x:W-px,y:py},
    {x:px,y:H-py},{x:W/2,y:H-py},{x:W-px,y:H-py},
  ];
}
function makeBall(num,x,y){
  const info=BALL_COLORS[num]||{color:'#888',stripe:false};
  return{num,x,y,vx:0,vy:0,active:true,pocketed:false,color:info.color,stripe:info.stripe,radius:BALL_RADIUS};
}
function getRackPos(mode){
  const rackX=W*0.72,rackY=H/2,r=BALL_RADIUS*2.04,positions=[];
  const triangle=(nums)=>{let i=0;for(let row=0;row<5;row++)for(let col=0;col<=row;col++)positions.push({x:rackX+row*r*Math.cos(Math.PI/6),y:rackY+(col-row/2)*r,num:nums[i++]});};
  if(mode==='eightball'||mode==='blackball'){triangle([1,9,2,10,8,3,11,4,12,5,13,6,14,7,15]);}
  else if(mode==='nineball'){const nums=[1,2,3,4,9,5,6,7,8];[[0,0],[-1,-1],[1,-1],[-1,1],[1,1],[0,-2],[0,2],[-2,0],[2,0]].forEach(([dx,dy],i)=>positions.push({x:rackX+dx*r*0.87,y:rackY+dy*r*0.87,num:nums[i]}));}
  else if(mode==='tenball'){let i=0;for(let row=0;row<4;row++)for(let col=0;col<=row;col++){positions.push({x:rackX+row*r*Math.cos(Math.PI/6),y:rackY+(col-row/2)*r,num:[1,2,3,4,5,10,6,7,8,9][i++]});}positions.push({x:rackX+r*Math.cos(Math.PI/6)*2,y:rackY,num:10});}
  else if(mode==='sevenball'){[[0,0],[0,-1],[1,-0.5],[1,0.5],[0,1],[-1,0.5],[-1,-0.5]].forEach(([dx,dy],i)=>positions.push({x:rackX+dx*r,y:rackY+dy*r,num:i+1}));}
  else if(mode==='straightpool'){triangle([1,9,2,10,3,11,4,12,5,13,6,14,7,15,8]);}
  else if(mode==='onepocket'||mode==='bankpool'){triangle([1,9,2,10,8,3,11,4,12,5,13,6,14,7,15]);}
  else if(mode==='snooker'){
    let i=0;for(let row=0;row<5;row++)for(let col=0;col<=row;col++){positions.push({x:rackX+row*r*Math.cos(Math.PI/6),y:rackY+(col-row/2)*r,num:16});i++;}
    [{x:W*0.25,y:H/2-r*1.5,num:17},{x:W*0.25,y:H/2,num:18},{x:W*0.25,y:H/2+r*1.5,num:19},{x:W*0.5,y:H/2,num:20},{x:W*0.66,y:H/2,num:21},{x:W*0.86,y:H/2,num:22}].forEach(p=>positions.push(p));
  }
  return positions;
}
function initGame(mode,gameMode){
  state.mode=mode; state.gameMode=gameMode;
  state.aiDifficulty=document.getElementById('aiDifficulty').value;
  state.currentPlayer=0; state.scores=[0,0]; state.playerGroups=[null,null];
  state.breakTaken=false; state.firstHitBall=null; state.ballsPocketed=[];
  state.consecutiveFouls=[0,0]; state.gameOver=false; state.foulActive=false;
  state.ballInHand=false; state.placingBall=false; state.shooting=false;
  state.ballsMoving=false; state.isCharging=false; state.power=0;
  state.onePocketScores=[0,0]; state.straightPoolScores=[0,0];
  state.straightPoolTarget=50; state.snookerRedPotted=false;
  state.gameStartTime=Date.now(); state.gameBallsPocketed=0; state.gameFouls=0;
  setupTable();
  state.cueBall=makeBall(0,W*0.27,H/2);
  state.cueBall.color='#f0ece0';
  const rackPositions=getRackPos(mode);
  state.balls=[state.cueBall,...rackPositions.map(p=>makeBall(p.num,p.x,p.y))];
  updateHUD(); updateBallRacks();
  showScreen('gameScreen');
  // Update daily game counters
  player.dailyGames++;
  if(mode==='eightball') player.daily8BallGames++;
  if(mode==='nineball') player.daily9BallGames++;
  if(mode==='snooker') player.dailySnookerGames++;
  if(gameMode==='ai') player.aiGamesPlayed++;
  if(gameMode==='2player') player.pvpGamesPlayed++;
  player.gamesPlayed++;
  updateChallengeProgress('dailyGames',1);
  savePlayer();
  rotateTips();
  if(!state.animFrame) gameLoop();
}
// ── Audio ──────────────────────────────────────────────────────
let audioCtx=null;
function getAC(){if(!audioCtx)audioCtx=new(window.AudioContext||window.webkitAudioContext)();return audioCtx;}
function playSound(type){
  if(!state.soundOn)return;
  try{
    const ac=getAC();const o=ac.createOscillator();const g=ac.createGain();
    o.connect(g);g.connect(ac.destination);
    if(type==='hit'){o.frequency.setValueAtTime(200,ac.currentTime);o.frequency.exponentialRampToValueAtTime(80,ac.currentTime+0.1);g.gain.setValueAtTime(0.3,ac.currentTime);g.gain.exponentialRampToValueAtTime(0.001,ac.currentTime+0.15);}
    else if(type==='pocket'){o.frequency.setValueAtTime(520,ac.currentTime);o.frequency.exponentialRampToValueAtTime(200,ac.currentTime+0.3);g.gain.setValueAtTime(0.4,ac.currentTime);g.gain.exponentialRampToValueAtTime(0.001,ac.currentTime+0.35);}
    else if(type==='cushion'){o.frequency.setValueAtTime(140,ac.currentTime);g.gain.setValueAtTime(0.15,ac.currentTime);g.gain.exponentialRampToValueAtTime(0.001,ac.currentTime+0.08);}
    else if(type==='cue'){o.type='sawtooth';o.frequency.setValueAtTime(120+state.power*8,ac.currentTime);o.frequency.exponentialRampToValueAtTime(40,ac.currentTime+0.2);g.gain.setValueAtTime(0.25,ac.currentTime);g.gain.exponentialRampToValueAtTime(0.001,ac.currentTime+0.25);}
    else if(type==='win'){[523,659,784,1047].forEach((f,i)=>{const o2=ac.createOscillator();const g2=ac.createGain();o2.connect(g2);g2.connect(ac.destination);o2.frequency.value=f;g2.gain.setValueAtTime(0,ac.currentTime+i*0.1);g2.gain.linearRampToValueAtTime(0.3,ac.currentTime+i*0.1+0.05);g2.gain.exponentialRampToValueAtTime(0.001,ac.currentTime+i*0.1+0.3);o2.start(ac.currentTime+i*0.1);o2.stop(ac.currentTime+i*0.1+0.35);});return;}
    o.