// i18n: English first (Playgama default), Spanish second.
// The platform language (en/fr/de/pt/it/ja/empty -> English; es/es-MX ->
// Spanish) picks the initial language; the menu toggle overrides it.
import { Save } from './save';

export type Lang = 'en' | 'es';

const STRINGS: Record<Lang, Record<string, string>> = {
  en: {
    title: 'RAMP PHYSICS',
    subtitle: 'Ragdoll Crash Test',
    tagline: 'Draw the ramp. Launch the dummy. Chain the crash!',
    play: 'PLAY',
    map: 'LEVELS',
    shop: 'SHOP',
    daily: 'Daily',
    level: 'Level',
    streak: 'day streak',
    ink: 'INK',
    inkLeft: 'ink left',
    draw: 'Draw a ramp!',
    launch: 'LAUNCH!',
    undo: 'UNDO',
    clear: 'CLEAR',
    pause: 'PAUSED',
    resume: 'RESUME',
    restart: 'RESTART',
    quit: 'MENU',
    winTitle: 'CRASH COMPLETE!',
    failTitle: 'STUCK!',
    failSub: 'The dummy never reached the flag. Redraw and try again!',
    failOut: 'The dummy ran out of ink and never reached the flag.',
    next: 'NEXT',
    replay: 'REPLAY',
    menu: 'MENU',
    retry: 'RETRY',
    extraInk: 'EXTRA INK',
    watchAd: 'Watch a short ad for +150 ink on this level.',
    tutorialDraw: 'Drag to draw a ramp',
    tutorialLaunch: 'Tap LAUNCH to drop the dummy!',
    tutorialInk: 'Watch your ink — shorter ramps earn more stars!',
    outOfInk: 'OUT OF INK!',
    goal: 'Get the dummy to the flag!',
    fan: 'Fan',
    dynamite: 'Dynamite!',
    portal: 'Gravity portal!',
    newBest: 'NEW BEST!',
    dailyDone: 'Daily done!',
    shopTitle: 'SHOP',
    skins: 'DUMMY SKINS',
    owned: 'OWNED',
    equipped: 'EQUIPPED',
    buy: 'BUY',
    notEnough: 'Not enough coins!',
    extraInkShop: 'Extra ink (+150)',
    chestTitle: 'TREASURE!',
    coins: 'coins',
    sound: 'SOUND',
    music: 'MUSIC',
    shake: 'SHAKE',
    language: 'LANGUAGE',
    back: 'BACK',
    levelComplete: 'LEVEL COMPLETE',
    starsEarned: 'stars',
    coinsEarned: 'coins earned',
    inkUsed: 'ink used',
    par: 'par',
    howToPlay: 'HOW TO PLAY',
    howTo1: '1. Draw ramps with your finger.',
    howTo2: '2. Tap LAUNCH to drop the dummy.',
    howTo3: '3. Reach the flag using as little ink as you can!',
    // r2 teaching hints (one line, zero reading beyond the level itself).
    hintFan: 'The fan lifts the dummy — draw into the wind!',
    hintDynamite: 'Dynamite blasts the dummy — touch it to explode!',
    hintPortal: 'Portals flip gravity — fall UP through it!',
    hintBoost: 'Boost ramps are slippery — steel stalls on gentle slopes!',
    hintBounce: 'Bouncy ramps spring — bounce over the wall!',
    boom: 'BOOM!',
  },
  es: {
    title: 'RAMP PHYSICS',
    subtitle: 'Prueba de Choque Ragdoll',
    tagline: '¡Dibuja la rampa. Lanza el muñeco. Encadena el choque!',
    play: 'JUGAR',
    map: 'NIVELES',
    shop: 'TIENDA',
    daily: 'Diario',
    level: 'Nivel',
    streak: 'días de racha',
    ink: 'TINTA',
    inkLeft: 'tinta restante',
    draw: '¡Dibuja una rampa!',
    launch: '¡LANZAR!',
    undo: 'DESHACER',
    clear: 'BORRAR',
    pause: 'PAUSA',
    resume: 'SEGUIR',
    restart: 'REINICIAR',
    quit: 'MENÚ',
    winTitle: '¡CHOQUE COMPLETADO!',
    failTitle: '¡ATASCADO!',
    failSub: 'El muñeco no llegó a la bandera. ¡Redibuja e inténtalo de nuevo!',
    failOut: 'Te quedaste sin tinta y el muñeco no llegó a la bandera.',
    next: 'SIGUIENTE',
    replay: 'REPETIR',
    menu: 'MENÚ',
    retry: 'REINTENTAR',
    extraInk: 'TINTA EXTRA',
    watchAd: 'Mira un anuncio corto para +150 de tinta en este nivel.',
    tutorialDraw: 'Arrastra para dibujar una rampa',
    tutorialLaunch: '¡Toca LANZAR para soltar el muñeco!',
    tutorialInk: '¡Vigila la tinta: rampas más cortas dan más estrellas!',
    outOfInk: '¡SIN TINTA!',
    goal: '¡Lleva el muñeco hasta la bandera!',
    fan: 'Ventilador',
    dynamite: '¡Dinamita!',
    portal: '¡Portal de gravedad!',
    newBest: '¡NUEVO RÉCORD!',
    dailyDone: '¡Reto diario hecho!',
    shopTitle: 'TIENDA',
    skins: 'TRAJES DEL MUÑECO',
    owned: 'COMPRADO',
    equipped: 'PUESTO',
    buy: 'COMPRAR',
    notEnough: '¡No tienes monedas suficientes!',
    extraInkShop: 'Tinta extra (+150)',
    chestTitle: '¡TESORO!',
    coins: 'monedas',
    sound: 'SONIDO',
    music: 'MÚSICA',
    shake: 'VIBRACIÓN',
    language: 'IDIOMA',
    back: 'ATRÁS',
    levelComplete: 'NIVEL COMPLETADO',
    starsEarned: 'estrellas',
    coinsEarned: 'monedas ganadas',
    inkUsed: 'tinta usada',
    par: 'par',
    howToPlay: 'CÓMO SE JUEGA',
    howTo1: '1. Dibuja rampas con el dedo.',
    howTo2: '2. Toca LANZAR para soltar el muñeco.',
    howTo3: '3. ¡Llega a la bandera gastando la menor tinta posible!',
    hintFan: '¡El ventilador levanta al muñeco: dibuja contra el viento!',
    hintDynamite: '¡La dinamita dispara al muñeco: tócala para explotar!',
    hintPortal: '¡Los portales invierten la gravedad: cae HACIA ARRIBA!',
    hintBoost: '¡Las rampas turbo resbalan: el acero se atasca en pendientes suaves!',
    hintBounce: '¡Las rampas elásticas rebotan: salta por encima del muro!',
    boom: '¡BOOM!',
  },
};

let lang: Lang = 'en';

export function currentLang(): Lang {
  return lang;
}

export function initLang(platformLang: string | null | undefined): void {
  if (Save.data.settings.lang && Save.data.settings.lang !== 'auto') {
    lang = Save.data.settings.lang;
    return;
  }
  const pl = (platformLang ?? '').toLowerCase();
  lang = pl === 'es' || pl === 'es-mx' ? 'es' : 'en';
  Save.data.settings.lang = lang;
}

export function setLang(next: Lang): void {
  lang = next;
}

export function t(key: string): string {
  return STRINGS[lang][key] ?? STRINGS.en[key] ?? key;
}
