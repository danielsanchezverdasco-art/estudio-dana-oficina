// i18n: English first (Playgama default), Spanish second.
// The platform language (en/fr/de/pt/it/ja/empty -> English; es/es-MX ->
// Spanish) picks the initial language; the menu toggle overrides it.
import { Save } from './save';

export type Lang = 'en' | 'es';

const STRINGS: Record<Lang, Record<string, string>> = {
  en: {
    title: 'WHO IS THE ROBOT?',
    subtitle: 'Find the impostor!',
    tagline: 'Slide the scanner. Reveal the robot. Tap it!',
    play: 'PLAY',
    map: 'LEVELS',
    shop: 'SHOP',
    daily: 'Daily',
    level: 'Level',
    streak: 'day streak',
    pause: 'PAUSED',
    resume: 'RESUME',
    restart: 'RESTART',
    quit: 'MENU',
    winTitle: 'ROBOT CAUGHT!',
    failTitle: 'IT ESCAPED!',
    failSub: 'The robot slipped away. Scan again!',
    failHearts: 'Out of hearts! The crowd hid the robot.',
    next: 'NEXT',
    replay: 'REPLAY',
    menu: 'MENU',
    retry: 'RETRY',
    extraHint: 'EXTRA HINT',
    watchAd: 'Watch a short ad for +1 hint on this level.',
    tutorialScan: 'Drag to move the scanner',
    tutorialTap: 'Tap the robot when it glows!',
    tutorialHearts: 'Wrong taps cost a heart!',
    goal: 'Find the robot!',
    hintUsed: 'HINT',
    scanFirst: 'Scan it first!',
    shinyNotRobot: 'Shiny is not the robot — look for the antenna!',
    newBest: 'NEW BEST!',
    dailyDone: 'Daily done!',
    shopTitle: 'SHOP',
    scanners: 'SCANNER BEAMS',
    owned: 'OWNED',
    equipped: 'EQUIPPED',
    buy: 'BUY',
    notEnough: 'Not enough coins!',
    extraHintShop: 'Extra hint (+1)',
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
    timeLeft: 'time left',
    howToPlay: 'HOW TO PLAY',
    howTo1: '1. Drag your finger to move the scanner.',
    howTo2: '2. The robot flashes when the beam touches it.',
    howTo3: '3. Tap the robot before time runs out!',
    cityNY: 'NEW YORK',
    cityTokyo: 'TOKYO',
    cityParis: 'PARIS',
    robotsCaught: 'robots caught',
    revealed: 'REVEALED!',
  },
  es: {
    title: '¿QUIÉN ES EL ROBOT?',
    subtitle: '¡Pilla al infiltrado!',
    tagline: '¡Desliza el escáner. Revela al robot. Tócalo!',
    play: 'JUGAR',
    map: 'NIVELES',
    shop: 'TIENDA',
    daily: 'Diario',
    level: 'Nivel',
    streak: 'días de racha',
    pause: 'PAUSA',
    resume: 'SEGUIR',
    restart: 'REINICIAR',
    quit: 'MENÚ',
    winTitle: '¡ROBOT PILLADO!',
    failTitle: '¡SE ESCAPÓ!',
    failSub: 'El robot se escurrió. ¡Escanea otra vez!',
    failHearts: '¡Sin corazones! La multitud escondió al robot.',
    next: 'SIGUIENTE',
    replay: 'REPETIR',
    menu: 'MENÚ',
    retry: 'REINTENTAR',
    extraHint: 'PISTA EXTRA',
    watchAd: 'Mira un anuncio corto para +1 pista en este nivel.',
    tutorialScan: 'Arrastra para mover el escáner',
    tutorialTap: '¡Toca al robot cuando brille!',
    tutorialHearts: '¡Los toques fallidos cuestan un corazón!',
    goal: '¡Encuentra al robot!',
    hintUsed: 'PISTA',
    scanFirst: '¡Escánealo primero!',
    shinyNotRobot: '¡Brillar no es ser robot: busca la antena!',
    newBest: '¡NUEVO RÉCORD!',
    dailyDone: '¡Reto diario hecho!',
    shopTitle: 'TIENDA',
    scanners: 'HACES DE ESCÁNER',
    owned: 'COMPRADO',
    equipped: 'PUESTO',
    buy: 'COMPRAR',
    notEnough: '¡No tienes monedas suficientes!',
    extraHintShop: 'Pista extra (+1)',
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
    timeLeft: 'tiempo restante',
    howToPlay: 'CÓMO SE JUEGA',
    howTo1: '1. Arrastra el dedo para mover el escáner.',
    howTo2: '2. El robot destella cuando el haz lo toca.',
    howTo3: '3. ¡Toca al robot antes de que se acabe el tiempo!',
    cityNY: 'NUEVA YORK',
    cityTokyo: 'TOKIO',
    cityParis: 'PARÍS',
    robotsCaught: 'robots pillados',
    revealed: '¡REVELADO!',
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
