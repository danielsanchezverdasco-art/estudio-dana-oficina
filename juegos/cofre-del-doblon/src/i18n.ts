// Doubloon Rush — i18n. English first, Spanish second (EN default per manual).

export type Lang = 'en' | 'es';

export const STRINGS = {
  en: {
    title: 'DOUBLOON RUSH',
    subtitle: 'Tap the chests before they sink!',
    play: 'PLAY',
    map: 'MAP',
    howTo: 'HOW TO PLAY',
    level: 'LEVEL',
    score: 'SCORE',
    best: 'BEST',
    coins: 'COINS',
    lives: 'LIVES',
    combo: 'COMBO',
    time: 'TIME',
    doubloonOdds: 'Golden Doubloon odds',
    tapChests: 'Tap the chests that pop out of the sand!',
    avoidBombs: 'Avoid the bombs!',
    scareCrab: 'Tap the crab to scare it away!',
    goldenDoubloon: 'The GOLDEN DOUBLOON is rare… watch the odds!',
    levelComplete: 'LEVEL COMPLETE!',
    levelFailed: 'OUT OF LIVES!',
    timeUp: "TIME'S UP!",
    stars: 'STARS',
    next: 'NEXT',
    retry: 'RETRY',
    menu: 'MENU',
    pause: 'PAUSED',
    resume: 'RESUME',
    restart: 'RESTART',
    sound: 'SOUND',
    on: 'ON',
    off: 'OFF',
    luck: 'LUCK x2',
    luckDesc: 'Double coins for 30 s',
    continueAfterBomb: 'CONTINUE',
    continueDesc: 'Keep playing after a bomb',
    watchAd: 'WATCH AD',
    noThanks: 'NO THANKS',
    daily: 'DAILY CHALLENGE',
    streak: 'STREAK',
    newBest: 'NEW BEST!',
    doubloonFound: 'GOLDEN DOUBLOON!',
    doubloonFoundSub: '+500 coins — one in {n}!',
    bombHit: 'BOOM! -1 life',
    crabStole: 'The crab stole coins!',
    tutorialTap: 'Tap the chest!',
    tutorialBomb: 'Never tap a bomb!',
    tutorialCrab: 'Scare the crab!',
    locked: 'LOCKED',
    playAgain: 'PLAY AGAIN',
    loading: 'LOADING…',
    adLoading: 'Loading ad…',
    adNotAvailable: 'Ad not available right now',
    tapToStart: 'TAP TO START',
  },
  es: {
    title: 'DOUBLOON RUSH',
    subtitle: '¡Toca los cofres antes de que se hundan!',
    play: 'JUGAR',
    map: 'MAPA',
    howTo: 'CÓMO SE JUEGA',
    level: 'NIVEL',
    score: 'PUNTOS',
    best: 'RÉCORD',
    coins: 'MONEDAS',
    lives: 'VIDAS',
    combo: 'COMBO',
    time: 'TIEMPO',
    doubloonOdds: 'Probabilidad del Doblón Dorado',
    tapChests: '¡Toca los cofres que salen de la arena!',
    avoidBombs: '¡Evita las bombas!',
    scareCrab: '¡Toca el cangrejo para asustarlo!',
    goldenDoubloon: '¡El DOBLÓN DORADO es raro… mira la probabilidad!',
    levelComplete: '¡NIVEL COMPLETADO!',
    levelFailed: '¡SIN VIDAS!',
    timeUp: '¡TIEMPO AGOTADO!',
    stars: 'ESTRELLAS',
    next: 'SIGUIENTE',
    retry: 'REINTENTAR',
    menu: 'MENÚ',
    pause: 'PAUSA',
    resume: 'SEGUIR',
    restart: 'REINICIAR',
    sound: 'SONIDO',
    on: 'SÍ',
    off: 'NO',
    luck: 'SUERTE x2',
    luckDesc: 'Monedas dobles durante 30 s',
    continueAfterBomb: 'CONTINUAR',
    continueDesc: 'Sigue jugando tras una bomba',
    watchAd: 'VER ANUNCIO',
    noThanks: 'NO, GRACIAS',
    daily: 'RETO DIARIO',
    streak: 'RACHA',
    newBest: '¡NUEVO RÉCORD!',
    doubloonFound: '¡DOBLÓN DORADO!',
    doubloonFoundSub: '¡+500 monedas — uno entre {n}!',
    bombHit: '¡BOOM! -1 vida',
    crabStole: '¡El cangrejo robó monedas!',
    tutorialTap: '¡Toca el cofre!',
    tutorialBomb: '¡Nunca toques una bomba!',
    tutorialCrab: '¡Asusta al cangrejo!',
    locked: 'BLOQUEADO',
    playAgain: 'JUGAR OTRA VEZ',
    loading: 'CARGANDO…',
    adLoading: 'Cargando anuncio…',
    adNotAvailable: 'Anuncio no disponible ahora',
    tapToStart: 'TOCA PARA EMPEZAR',
  },
} as const;

export type StringKey = keyof (typeof STRINGS)['en'];

let currentLang: Lang = 'en';

export function setLang(lang: string | null | undefined): Lang {
  const l = (lang || 'en').toLowerCase();
  currentLang = l.startsWith('es') ? 'es' : 'en';
  return currentLang;
}

export function getLang(): Lang {
  return currentLang;
}

export function t(key: StringKey, vars?: Record<string, string | number>): string {
  let s: string = STRINGS[currentLang][key] ?? STRINGS.en[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, String(v));
  }
  return s;
}
