// i18n: English first (Playgama default), Spanish second.
// The platform language (en/fr/de/pt/it/ja/empty -> English; es/es-MX ->
// Spanish) picks the initial language; the menu toggle overrides it.
import { Save } from './save';

export type Lang = 'en' | 'es';

const STRINGS: Record<Lang, Record<string, string>> = {
  en: {
    title: 'KITCHEN HOLE',
    subtitle: 'Hungry Hole in the Kitchen',
    tagline: 'Drag the hole. Swallow the kitchen!',
    play: 'PLAY',
    map: 'KITCHENS',
    shop: 'SHOP',
    daily: 'Daily',
    level: 'Level',
    streak: 'day streak',
    size: 'SIZE',
    leftObjects: '{n} LEFT',
    pause: 'PAUSED',
    resume: 'RESUME',
    restart: 'RESTART',
    quit: 'MENU',
    winTitle: 'KITCHEN CLEAN!',
    failTitle: 'TIME UP!',
    failSub: 'The kitchen is still messy. Eat faster next time!',
    failOut: 'The timer ran out with food still on the table.',
    next: 'NEXT',
    replay: 'REPLAY',
    menu: 'MENU',
    retry: 'RETRY',
    extraTime: 'EXTRA TIME',
    watchAd: 'Watch a short ad for +15 seconds on this level.',
    dragHint: 'Drag to move the hole!',
    swallowHint: 'Swallow everything that fits!',
    growHint: 'Eat to grow — then the fridge fits too!',
    timeUp: "TIME'S UP!",
    kitchenClean: 'KITCHEN CLEAN!',
    newBest: 'NEW BEST!',
    dailyDone: 'Daily done!',
    shopTitle: 'SHOP',
    skins: 'HOLE SKINS',
    owned: 'OWNED',
    equipped: 'EQUIPPED',
    buy: 'BUY',
    notEnough: 'Not enough coins!',
    extraTimeShop: 'Extra time (+15 s)',
    chestTitle: 'TREASURE!',
    coins: 'coins',
    sound: 'SOUND',
    music: 'MUSIC',
    shake: 'SHAKE',
    language: 'LANGUAGE',
    back: 'BACK',
    levelComplete: 'KITCHEN CLEAN',
    starsEarned: 'stars',
    coinsEarned: 'coins earned',
    howToPlay: 'HOW TO PLAY',
    howTo1: '1. Drag the hole with your finger.',
    howTo2: '2. Swallow everything that fits inside it.',
    howTo3: '3. Grow big enough to eat the fridge!',
    // Teaching hints (one line, zero reading beyond the level itself).
    hintPet: 'The pet steals your coins — keep away from it!',
    hintGolden: 'Golden food is worth x3 — grab it fast, it vanishes!',
    hintMover: 'The mouse runs away — corner it against the wall!',
    hintFridge: 'Too big to swallow yet — eat everything small first!',
    cat: 'Cat',
    dog: 'Dog',
  },
  es: {
    title: 'AGUJERO TRAGÓN',
    subtitle: 'Agujero Hambriento en la Cocina',
    tagline: '¡Arrastra el agujero. Trágate la cocina!',
    play: 'JUGAR',
    map: 'COCINAS',
    shop: 'TIENDA',
    daily: 'Diario',
    level: 'Nivel',
    streak: 'días de racha',
    size: 'TAMAÑO',
    leftObjects: 'QUEDAN {n}',
    pause: 'PAUSA',
    resume: 'SEGUIR',
    restart: 'REINICIAR',
    quit: 'MENÚ',
    winTitle: '¡COCINA LIMPIA!',
    failTitle: '¡TIEMPO!',
    failSub: 'La cocina sigue sucia. ¡Come más rápido la próxima vez!',
    failOut: 'Se acabó el tiempo con comida aún en la mesa.',
    next: 'SIGUIENTE',
    replay: 'REPETIR',
    menu: 'MENÚ',
    retry: 'REINTENTAR',
    extraTime: 'TIEMPO EXTRA',
    watchAd: 'Mira un anuncio corto para +15 segundos en este nivel.',
    dragHint: '¡Arrastra para mover el agujero!',
    swallowHint: '¡Trágate todo lo que quepa!',
    growHint: '¡Come para crecer: luego la nevera también cabe!',
    timeUp: '¡TIEMPO!',
    kitchenClean: '¡COCINA LIMPIA!',
    newBest: '¡NUEVO RÉCORD!',
    dailyDone: '¡Reto diario hecho!',
    shopTitle: 'TIENDA',
    skins: 'AGUJEROS',
    owned: 'COMPRADO',
    equipped: 'PUESTO',
    buy: 'COMPRAR',
    notEnough: '¡No tienes monedas suficientes!',
    extraTimeShop: 'Tiempo extra (+15 s)',
    chestTitle: '¡TESORO!',
    coins: 'monedas',
    sound: 'SONIDO',
    music: 'MÚSICA',
    shake: 'VIBRACIÓN',
    language: 'IDIOMA',
    back: 'ATRÁS',
    levelComplete: 'COCINA LIMPIA',
    starsEarned: 'estrellas',
    coinsEarned: 'monedas ganadas',
    howToPlay: 'CÓMO SE JUEGA',
    howTo1: '1. Arrastra el agujero con el dedo.',
    howTo2: '2. Trágate todo lo que quepa dentro.',
    howTo3: '3. ¡Crece lo suficiente para comerte la nevera!',
    hintPet: '¡La mascota te roba las monedas: aléjate de ella!',
    hintGolden: '¡La comida dorada vale x3: agárrala rápido, desaparece!',
    hintMover: '¡El ratón huye: acorrálalo contra la pared!',
    hintFridge: '¡Aún es demasiado grande: come primero todo lo pequeño!',
    cat: 'Gato',
    dog: 'Perro',
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
