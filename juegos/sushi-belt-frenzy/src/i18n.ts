// i18n: English first (Playgama default), Spanish second.
// The platform language (en/fr/de/pt/it/ja/empty -> English; es/es-MX ->
// Spanish) picks the initial language; the menu toggle overrides it.
import { Save } from './save';

export type Lang = 'en' | 'es';

const STRINGS: Record<Lang, Record<string, string>> = {
  en: {
    title: 'SUSHI BELT FRENZY',
    subtitle: 'Feed the Hungry Cats!',
    tagline: 'Tap a plate — serve it to the cat of its colour!',
    play: 'PLAY',
    map: 'LEVELS',
    shop: 'SHOP',
    daily: 'Daily',
    level: 'Level',
    streak: 'day streak',
    score: 'SCORE',
    combo: 'COMBO',
    serves: 'SERVED',
    pause: 'PAUSED',
    resume: 'RESUME',
    restart: 'RESTART',
    quit: 'MENU',
    winTitle: 'CATS ARE FULL!',
    failTitle: 'OUT OF HEARTS!',
    failSub: 'The cats are still hungry. Try again!',
    next: 'NEXT',
    replay: 'REPLAY',
    menu: 'MENU',
    retry: 'RETRY',
    extraHeart: 'EXTRA HEART',
    watchAd: 'Watch a short ad for +1 heart on this level.',
    tutorialTap: 'Tap a plate to feed its cat!',
    tutorialDrag: 'Or drag it to the cat of its colour!',
    tutorialWasabi: 'Wasabi has no cat — let it pass!',
    tutorialGolden: 'Golden plate: triple points!',
    tutorialBoost: 'BOOST slows the belt — use it when it gets fast!',
    boost: 'BOOST',
    outOfHearts: 'OUT OF HEARTS!',
    goal: 'Serve the cats!',
    newBest: 'NEW BEST!',
    dailyDone: 'Daily done!',
    shopTitle: 'SHOP',
    skins: 'CAT SKINS',
    themes: 'RESTAURANTS',
    owned: 'OWNED',
    equipped: 'EQUIPPED',
    buy: 'BUY',
    notEnough: 'Not enough coins!',
    extraHeartShop: 'Extra heart (+1)',
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
    howToPlay: 'HOW TO PLAY',
    howTo1: '1. Plates ride the belt — each has a colour.',
    howTo2: '2. Tap a plate to serve it to the cat of its colour.',
    howTo3: '3. Wasabi has no cat — never serve it!',
    hintWasabi: 'Green plate = WASABI! Let it pass, never serve it!',
    hintGolden: 'Golden plate = TRIPLE points!',
    hintBoost: 'Belt too fast? Tap BOOST to slow it down!',
    hintChef: 'Watch the chef — he warns you what is coming!',
    meow: 'MEOW!',
    cough: 'COUGH COUGH!',
    yum: 'YUM!',
    wrongCat: 'WRONG CAT!',
  },
  es: {
    title: 'SUSHI BELT FRENZY',
    subtitle: '¡Alimenta a los Gatos Glotones!',
    tagline: '¡Toca un plato y sírveselo al gato de su color!',
    play: 'JUGAR',
    map: 'NIVELES',
    shop: 'TIENDA',
    daily: 'Diario',
    level: 'Nivel',
    streak: 'días de racha',
    score: 'PUNTOS',
    combo: 'COMBO',
    serves: 'SERVIDOS',
    pause: 'PAUSA',
    resume: 'SEGUIR',
    restart: 'REINICIAR',
    quit: 'MENÚ',
    winTitle: '¡GATOS LLENOS!',
    failTitle: '¡SIN CORAZONES!',
    failSub: 'Los gatos siguen hambrientos. ¡Inténtalo de nuevo!',
    next: 'SIGUIENTE',
    replay: 'REPETIR',
    menu: 'MENÚ',
    retry: 'REINTENTAR',
    extraHeart: 'CORAZÓN EXTRA',
    watchAd: 'Mira un anuncio corto para +1 corazón en este nivel.',
    tutorialTap: '¡Toca un plato para alimentar a su gato!',
    tutorialDrag: '¡O arrástralo al gato de su color!',
    tutorialWasabi: '¡El wasabi no tiene gato: déjalo pasar!',
    tutorialGolden: '¡Plato dorado: puntos triples!',
    tutorialBoost: '¡BOOST frena la cinta: úsalo cuando vaya rápido!',
    boost: 'BOOST',
    outOfHearts: '¡SIN CORAZONES!',
    goal: '¡Sirve a los gatos!',
    newBest: '¡NUEVO RÉCORD!',
    dailyDone: '¡Reto diario hecho!',
    shopTitle: 'TIENDA',
    skins: 'TRAJES DE GATO',
    themes: 'RESTAURANTES',
    owned: 'COMPRADO',
    equipped: 'PUESTO',
    buy: 'COMPRAR',
    notEnough: '¡No tienes monedas suficientes!',
    extraHeartShop: 'Corazón extra (+1)',
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
    howToPlay: 'CÓMO SE JUEGA',
    howTo1: '1. Los platos van por la cinta, cada uno con un color.',
    howTo2: '2. Toca un plato para servirlo al gato de su color.',
    howTo3: '3. El wasabi no tiene gato: ¡no lo sirvas nunca!',
    hintWasabi: '¡Plato verde = WASABI! ¡Déjalo pasar, no lo sirvas!',
    hintGolden: '¡Plato dorado = puntos TRIPLES!',
    hintBoost: '¿La cinta va muy rápido? ¡Toca BOOST para frenarla!',
    hintChef: '¡Mira al chef: te avisa de lo que viene!',
    meow: '¡MIAU!',
    cough: '¡COF COF!',
    yum: '¡ÑAM!',
    wrongCat: '¡GATO EQUIVOCADO!',
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
