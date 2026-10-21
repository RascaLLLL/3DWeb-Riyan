// Original concept illustration; the accurate navigation map is inside the village.
export function VillageMap() {
  const trees = [[70,160],[100,110],[135,145],[180,85],[230,95],[470,120],[510,150],[550,210],[520,300],[480,390],[100,350],[65,290],[160,410],[390,430],[310,70],[425,80]];
  return <svg className="village-map" viewBox="0 0 620 520" role="img" aria-labelledby="map-title map-desc">
    <title id="map-title">An illustrated keepsake of the village</title><desc id="map-desc">A decorative woodland village with cottages, a winding path, and a hilltop tower. The live navigation map is available inside the village.</desc>
    <defs>
      <pattern id="map-grid" width="36" height="36" patternUnits="userSpaceOnUse"><path d="M36 0H0V36" fill="none" stroke="#786c47" strokeWidth=".5" opacity=".12" /></pattern>
      <g id="pine"><path d="M0 13V36" stroke="#6b6548" strokeWidth="3"/><path d="M0-20L-16 12H-10L-22 26H22L10 12H16Z" fill="#65715a" stroke="#3c4d3e" strokeWidth="1.4"/><path d="M0-16V23L16 23Z" fill="#3c5142" opacity=".45"/></g>
      <g id="cottage"><path d="M-27 0L0-14L30 0V36L0 51L-27 36Z" fill="#c6b488" stroke="#685e40" strokeWidth="1.5"/><path d="M0 9L30 0V36L0 51Z" fill="#a1906b"/><path d="M-35 1L-5-34L34-12L5 20Z" fill="#8c5941" stroke="#694936" strokeWidth="2"/><path d="M5 20L34-12L38 2L5 23Z" fill="#6e4835"/><path d="M-17 28V16L-7 21V34M10 36V25L20 20V31" fill="#514e3a"/><path d="M-16-19V-39L-8-35V-23" fill="#9b8a67" stroke="#685e40"/></g>
    </defs>
    <rect width="620" height="520" fill="url(#map-grid)" />
    <path d="M93 234Q62 126 214 93T493 143Q573 204 518 335T335 436Q147 465 92 343Z" fill="#a4ac7d" opacity=".17" stroke="#7b8663" strokeDasharray="4 6"/>
    <path d="M110 477C195 395 184 336 284 315S417 248 394 169S339 83 397 28" fill="none" stroke="#859d93" strokeWidth="18" opacity=".65"/>
    <path d="M110 477C195 395 184 336 284 315S417 248 394 169S339 83 397 28" fill="none" stroke="#d9dfc5" strokeWidth="2" strokeDasharray="12 9"/>
    <path d="M308 488Q272 405 310 346T310 246Q260 194 228 198M310 346Q404 364 440 306M310 246Q368 206 344 135" fill="none" stroke="#b5a377" strokeWidth="17"/>
    <path d="M308 488Q272 405 310 346T310 246Q260 194 228 198M310 346Q404 364 440 306M310 246Q368 206 344 135" fill="none" stroke="#e1d3ac" strokeWidth="12"/>
    {trees.map(([x,y], i) => <use key={i} href="#pine" transform={`translate(${x} ${y}) scale(${i % 3 === 0 ? 1.15 : .85})`} />)}
    <g transform="translate(338 132)"><path d="M-24 0V-70L17-83L38-67V0L0 19Z" fill="#a9a080" stroke="#615e47" strokeWidth="2"/><path d="M0 19V-60L38-67V0Z" fill="#8d8a70"/><path d="M-30-69L6-115L43-69L0-55Z" fill="#596951" stroke="#3f5142" strokeWidth="2"/><path d="M6-115V-140L35-135L6-125" fill="#986344" stroke="#625036"/><path d="M8-28V-43Q16-55 23-44V-33" fill="#434d40"/></g>
    <use href="#cottage" transform="translate(230 214) scale(1.1)"/><use href="#cottage" transform="translate(415 309) scale(.95)"/><use href="#cottage" transform="translate(236 353) scale(.75)"/>
    <use href="#cottage" transform="translate(365 224) scale(.65)"/>
    <g transform="translate(302 304) rotate(-18)"><path d="M-31-15H31V15H-31Z" fill="#9e8255" stroke="#63583a" strokeWidth="2"/><path d="M-24-15V15M-12-15V15M0-15V15M12-15V15M24-15V15" stroke="#665838" strokeWidth="2"/></g>
    <g fill="#55604b" fontFamily="Georgia, serif" fontSize="13" fontStyle="italic"><text x="267" y="58">The old library</text><text x="149" y="284">Guild square</text><text x="402" y="375">The forge</text><text x="324" y="454">Village gate</text></g>
    <g transform="translate(552 66)" fill="none" stroke="#7b714f"><circle r="26"/><path d="M0-35V35M-35 0H35M0-24L6 0L0 24L-6 0Z"/><path d="M0-24L6 0H0Z" fill="#7b714f"/><text y="-42" textAnchor="middle" fill="#7b714f" stroke="none" fontSize="12">N</text></g>
    <path d="M290 470L306 458L322 470V492H290Z" fill="#867251" stroke="#5c563d"/><path d="M300 492V478Q306 469 312 478V492" fill="#474d3d"/>
  </svg>;
}
