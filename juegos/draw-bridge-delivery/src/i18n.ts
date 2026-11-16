// i18n: English first (Playgama default), Spanish second.
// The platform language (en/fr/de/pt/it/ja/empty -> English; es/es-MX ->
// Spanish) picks the initial language; the menu toggle overrides it.
import { Save } from './save';

export type Lang = 'en' | 'es';

const STRINGS: Record<Lang, Record<string, string>> = {
  en: {
    title: 'DRAW BRIDGE',
    subtitle: 'Delivery',
    tagline: 'Draw the bridge. Deliver the pizza!',
    play: 'PLAY',
    map: 'LEVELS',
    shop: 'SHOP',
    daily: 'Daily',
    level: 'Level',
    streak: 'day streak',
    ink: 'INK',
    inkLeft: 'ink left',
    draw: 'Draw a bridge!',
    launch: 'PLAY!',
    undo: 'UNDO',
    erase: 'ERASE',
    clear: 'CLEAR',
    pause: 'PAUSED',
    resume: 'RESUME',
    restart: 'RESTART',
    quit: 'MENU',
    winTitle: 'DELIVERED!',
    failTitle: 'SPLASH!',
    failSub: 'The pizza never arrived. Redraw and try again!',
    failOut: 'The scooter ran out of ink and never reached the flag.',
    next: 'NEXT',
    replay: 'REPLAY',
    menu: 'MENU',
    retry: 'RETRY',
    extraInk: 'EXTRA INK',
    watchAd: 'Watch a short ad for +150 ink on this level.',
    tutorialDraw: 'Drag to draw a bridge',
    tutorialLaunch: 'Tap PLAY and the scooter drives!',
    tutorialInk: 'Watch your ink — shorter bridges earn more stars!',
    outOfInk: 'OUT OF INK!',
    goal: 'Get the scooter to the flag!',
    newBest: 'NEW BEST!',
    dailyDone: 'Daily done!',
    shopTitle: 'SHOP',
    skins: 'SCOOTER SKINS',
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
    howTo1: '1. Draw bridges with your finger.',
    howTo2: '2. Tap PLAY and the scooter drives over.',
    howTo3: '3. Deliver the pizza using as little ink as you can!',
    // Teaching hints (one line, zero reading beyond the level itself).
    hintDraw: 'Draw a bridge from cliff to cliff, then tap PLAY!',
    hintWind: 'Wind pushes the scooter — draw low and steady!',
    hintTramp: 'Bounce on the trampoline to fly over the wall!',
    hintTurbo: 'Turbo ink is slippery and fast — it climbs steep hills!',
    hintMoving: 'Time it! Tap PLAY when the moving bridge lines up!',
    hintDual: 'Two scooters, two pizzas — draw a bridge for each!',
    hintBouncy: 'Bouncy ink springs — bounce over the wall!',
    hintInk: 'Almost no ink left — draw it straight and short!',
    drawFirst: 'Draw a bridge first!',
  },
  es: {
    title: 'DIBUJA EL PUENTE',
    subtitle: 'Reparto',
    tagline: '¡Dibuja el puente. Entrega la pizza!',
    play: 'JUGAR',
    map: 'NIVELES',
    shop: 'TIENDA',
    daily: 'Reto',
    level: 'Nivel',
    streak: 'días seguidos',
    ink: 'TINTA',
    inkLeft: 'tinta restante',
    draw: '¡Dibuja un puente!',
    launch: '¡A JUGAR!',
    undo: 'DESHACER',
    erase: 'BORRAR',
    clear: 'LIMPIAR',
    pause: 'PAUSA',
    resume: 'SEGUIR',
    restart: 'REINICIAR',
    quit: 'MENÚ',
    winTitle: '¡ENTREGADO!',
    failTitle: '¡AL AGUA!',
    failSub: 'La pizza no llegó. ¡Redibuja e inténtalo de nuevo!',
    failOut: 'La moto se quedó sin tinta y no llegó a la bandera.',
    next: 'SIGUIENTE',
    replay: 'REPETIR',
    menu: 'MENÚ',
    retry: 'REINTENTAR',
    extraInk: 'TINTA EXTRA',
    watchAd: 'Mira un anuncio corto y consigue +150 de tinta en este nivel.',
    tutorialDraw: 'Arrastra para dibujar un puente',
    tutorialLaunch: '¡Toca JUGAR y la moto arranca!',
    tutorialInk: 'Cuida la tinta: ¡los puentes cortos dan más estrellas!',
    outOfInk: '¡SIN TINTA!',
    goal: '¡Lleva la moto hasta la bandera!',
    newBest: '¡NUEVO RÉCORD!',
    dailyDone: '¡Reto hecho!',
    shopTitle: 'TIENDA',
    skins: 'MOTOS',
    owned: 'TUYA',
    equipped: 'EN USO',
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
    howTo1: '1. Dibuja puentes con el dedo.',
    howTo2: '2. Toca JUGAR y la moto cruza por encima.',
    howTo3: '3. ¡Entrega la pizza usando la menor tinta posible!',
    hintDraw: '¡Dibuja un puente de acantilado a acantilado y toca JUGAR!',
    hintWind: 'El viento empuja la moto: ¡dibuja bajo y firme!',
    hintTramp: '¡Rebota en el trampolín para volar sobre el muro!',
    hintTurbo: '¡La tinta turbo es rápida y resbala: sube cuestas empinadas!',
    hintMoving: '¡Calcula el momento! Toca JUGAR cuando el puente móvil se alinee.',
    hintDual: '¡Dos motos, dos pizzas: un puente para cada una!',
    hintBouncy: '¡La tinta saltarina rebota: salta por encima del muro!',
    hintInk: '¡Casi no queda tinta: dibuja recto y corto!',
    drawFirst: '¡Dibuja primero un puente!',
  },
};

let lang: Lang = 'en';

export function initLang(platformLang: string): void {
  lang = platformLang.toLowerCase().startsWith('es') ? 'es' : 'en';
}

export function setLang(l: Lang): void {
  lang = l;
}

export function currentLang(): Lang {
  return lang;
}

export function t(key: string): string {
  return STRINGS[lang][key] ?? STRINGS.en[key] ?? key;
}

/** Level name in the current language. */
export function levelName(nameEn: string, nameEs: string): string {
  return lang === 'es' ? nameEs : nameEn;
}

export function langFromSave(): Lang {
  return Save.data.settings.lang === 'es' ? 'es' : Save.data.settings.lang === 'en' ? 'en' : lang;
}
