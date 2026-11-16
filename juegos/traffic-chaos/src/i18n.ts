// i18n: English first (Playgama default), Spanish second.
// The platform language (en/fr/de/pt/it/ja/empty -> English; es/es-MX ->
// Spanish) picks the initial language; the menu toggle overrides it.
// No text lives in images; every string here has a character limit in mind
// (HUD strings stay short — the mission chip is icons + numbers only).
import { Save } from './save';

export type Lang = 'en' | 'es';

const STRINGS: Record<Lang, Record<string, string>> = {
  en: {
    title: 'TRAFFIC CHAOS',
    subtitle: 'New York Rush',
    tagline: 'Tap the lights. Mind the patience. Survive rush hour!',
    play: 'PLAY',
    map: 'LEVELS',
    shop: 'SHOP',
    daily: 'Daily Rush',
    level: 'Level',
    streak: 'day streak',
    pause: 'PAUSED',
    resume: 'RESUME',
    restart: 'RESTART',
    quit: 'MENU',
    winTitle: 'RUSH HOUR CLEAR!',
    failCrash: 'CRASH!',
    failGridlock: 'GRIDLOCK!',
    failTime: "TIME'S UP!",
    failSubCrash: 'The chain crash stopped the city. Flip sooner next time!',
    failSubGridlock: 'One approach waited too long. Balance both directions!',
    failSubTime: 'Not enough cars cleared. Keep the flow going!',
    next: 'NEXT',
    replay: 'REPLAY',
    menu: 'MENU',
    retry: 'RETRY',
    coins: 'coins',
    sound: 'SOUND',
    music: 'MUSIC',
    shake: 'SHAKE',
    language: 'LANGUAGE',
    back: 'BACK',
    levelComplete: 'LEVEL COMPLETE',
    starsEarned: 'stars',
    coinsEarned: 'coins earned',
    carsCleared: 'cars cleared',
    howToPlay: 'HOW TO PLAY',
    howTo1: '1. Tap a traffic light to flip the intersection.',
    howTo2: '2. Watch the patience rings — empty means a crash!',
    howTo3: '3. Swipe a car up to boost it. BOOST doubles all cars!',
    newBest: 'NEW BEST!',
    dailyDone: 'Daily done!',
    shopTitle: 'GARAGE',
    vehicles: 'VEHICLES',
    owned: 'OWNED',
    equipped: 'EQUIPPED',
    buy: 'BUY',
    notEnough: 'Not enough coins!',
    skip: 'SKIP',
    watchAd: 'Watch a short ad to retry with +2s patience.',
    retryBoost: 'RETRY + PATIENCE',
    boost: 'BOOST 2×',
    closeCall: 'CLOSE!',
    ambulance: 'AMBULANCE!',
    tapTheLight: 'TAP THE LIGHT!',
    rushHour: 'Rush Hour',
    nightShift: 'Night Shift',
    morningRush: 'Morning Rush',
    lunchRush: 'Lunch Rush',
    eveningRush: 'Evening Rush',
    timesSquare: 'Times Square',
    brooklynBridge: 'Brooklyn Bridge',
    centralPark: 'Central Park',
    locked: 'LOCKED',
    tapToPlay: 'TAP TO PLAY',
  },
  es: {
    title: 'TRAFFIC CHAOS',
    subtitle: 'New York Rush',
    tagline: '¡Toca los semáforos. Vigila la paciencia. Sobrevive a la hora punta!',
    play: 'JUGAR',
    map: 'NIVELES',
    shop: 'TIENDA',
    daily: 'Hora punta diaria',
    level: 'Nivel',
    streak: 'días de racha',
    pause: 'PAUSA',
    resume: 'SEGUIR',
    restart: 'REINICIAR',
    quit: 'MENÚ',
    winTitle: '¡HORA PUNTA SUPERADA!',
    failCrash: '¡CHOQUE!',
    failGridlock: '¡ATASCO!',
    failTime: '¡TIEMPO!',
    failSubCrash: 'El choque en cadena paró la ciudad. ¡Cambia antes!',
    failSubGridlock: 'Un sentido esperó demasiado. ¡Equilibra ambos!',
    failSubTime: 'No pasaron suficientes coches. ¡Mantén el flujo!',
    next: 'SIGUIENTE',
    replay: 'REPETIR',
    menu: 'MENÚ',
    retry: 'REINTENTAR',
    coins: 'monedas',
    sound: 'SONIDO',
    music: 'MÚSICA',
    shake: 'VIBRACIÓN',
    language: 'IDIOMA',
    back: 'ATRÁS',
    levelComplete: 'NIVEL COMPLETADO',
    starsEarned: 'estrellas',
    coinsEarned: 'monedas ganadas',
    carsCleared: 'coches pasados',
    howToPlay: 'CÓMO SE JUEGA',
    howTo1: '1. Toca un semáforo para cambiar el cruce.',
    howTo2: '2. Vigila los anillos de paciencia: ¡vacío es choque!',
    howTo3: '3. Desliza un coche hacia arriba para acelerarlo. ¡BOOST duplica a todos!',
    newBest: '¡NUEVO RÉCORD!',
    dailyDone: '¡Reto diario hecho!',
    shopTitle: 'GARAJE',
    vehicles: 'VEHÍCULOS',
    owned: 'COMPRADO',
    equipped: 'PUESTO',
    buy: 'COMPRAR',
    notEnough: '¡No tienes monedas suficientes!',
    skip: 'SALTAR',
    watchAd: 'Mira un anuncio corto para reintentar con +2 s de paciencia.',
    retryBoost: 'REINTENTAR + PACIENCIA',
    boost: 'BOOST 2×',
    closeCall: '¡POR POCO!',
    ambulance: '¡AMBULANCIA!',
    tapTheLight: '¡TOCA EL SEMÁFORO!',
    rushHour: 'Hora punta',
    nightShift: 'Turno de noche',
    morningRush: 'Punta de la mañana',
    lunchRush: 'Punta del mediodía',
    eveningRush: 'Punta de la tarde',
    timesSquare: 'Times Square',
    brooklynBridge: 'Puente de Brooklyn',
    centralPark: 'Central Park',
    locked: 'BLOQUEADO',
    tapToPlay: 'TOCA PARA JUGAR',
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
