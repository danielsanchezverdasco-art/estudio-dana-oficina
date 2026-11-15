// Localization. English is the source language; Spanish second.
// Language comes from Bridge platform.language (read once at boot), with a
// manual EN/ES toggle in the menu stored in the save file.
export type Lang = 'en' | 'es';

const STRINGS = {
  title: { en: 'SEAGULL ATTACK', es: '¡QUE NO ME ROBEN EL BOCATA!' },
  subtitle: { en: 'Save the Sandwich', es: 'Salva el bocata' },
  play: { en: 'PLAY', es: 'JUGAR' },
  map: { en: 'LEVELS', es: 'NIVELES' },
  shop: { en: 'SHOP', es: 'TIENDA' },
  tapGull: { en: 'Tap the gull!', es: '¡Toca la gaviota!' },
  level: { en: 'Level', es: 'Nivel' },
  daily: { en: 'Daily challenge', es: 'Reto diario' },
  streak: { en: 'day streak', es: 'días seguidos' },
  drawHint: {
    en: 'Draw a line to shield your sandwich!',
    es: '¡Dibuja una línea para proteger tu bocata!',
  },
  drawHint2: {
    en: 'The gulls are coming — hold out 10 seconds!',
    es: '¡Vienen las gaviotas! ¡Aguanta 10 segundos!',
  },
  winTitle: { en: 'SANDWICH SAVED!', es: '¡BOCATA A SALVO!' },
  failTitle: { en: 'THE GULLS GOT IT!', es: '¡SE LO HAN LLEVADO!' },
  failSub: {
    en: 'Your sandwich is gone… try again!',
    es: 'Tu bocata ha volado… ¡inténtalo otra vez!',
  },
  next: { en: 'NEXT', es: 'SIGUIENTE' },
  replay: { en: 'REPLAY', es: 'REPETIR' },
  menu: { en: 'MENU', es: 'MENÚ' },
  retry: { en: 'TRY AGAIN', es: 'OTRA VEZ' },
  paused: { en: 'PAUSED', es: 'PAUSA' },
  resume: { en: 'RESUME', es: 'SEGUIR' },
  restart: { en: 'RESTART', es: 'REINICIAR' },
  quit: { en: 'QUIT TO MENU', es: 'SALIR AL MENÚ' },
  extraInk: { en: 'EXTRA INK', es: 'TINTA EXTRA' },
  watchAd: { en: 'Watch an ad for +150 ink', es: 'Mira un anuncio y gana +150 de tinta' },
  coins: { en: 'Coins', es: 'Monedas' },
  chest: { en: 'Treasure chest!', es: '¡Cofre del tesoro!' },
  chestClaim: { en: 'Tap to open', es: 'Toca para abrir' },
  locked: { en: 'Finish the previous level to unlock', es: 'Termina el nivel anterior para desbloquear' },
  sound: { en: 'Sound', es: 'Sonido' },
  music: { en: 'Music', es: 'Música' },
  shake: { en: 'Screen shake', es: 'Vibración' },
  language: { en: 'Language', es: 'Idioma' },
  ink: { en: 'Ink', es: 'Tinta' },
  crumbsLeft: { en: 'Crumbs left', es: 'Migas restantes' },
  levelComplete: { en: 'Level complete!', es: '¡Nivel completado!' },
  newRecord: { en: 'New record!', es: '¡Nuevo récord!' },
  towel: { en: 'Beach towel', es: 'Toalla de playa' },
  plate: { en: 'Picnic plate', es: 'Plato de picnic' },
  rimRed: { en: 'Red rim', es: 'Borde rojo' },
  rimBlue: { en: 'Ocean rim', es: 'Borde azul' },
  rimYellow: { en: 'Sunny rim', es: 'Borde amarillo' },
  topperOlive: { en: 'Olive', es: 'Aceituna' },
  topperCherry: { en: 'Cherry', es: 'Cereza' },
  topperStar: { en: 'Gold star', es: 'Estrella dorada' },
  topper: { en: 'Sandwich topper', es: 'Adorno del bocata' },
  owned: { en: 'Owned', es: 'Tuyo' },
  buy: { en: 'Buy', es: 'Comprar' },
  notEnough: { en: 'Not enough coins', es: 'No tienes monedas suficientes' },
  use: { en: 'Use', es: 'Usar' },
  inUse: { en: 'In use', es: 'En uso' },
  wind: { en: 'Wind!', es: '¡Viento!' },
  pelican: { en: 'Pelican boss!', es: '¡Jefe pelícano!' },
  umbrella: { en: 'No drawing through the umbrella!', es: '¡No se puede dibujar por la sombrilla!' },
  tapCoin: { en: 'Tap the coins!', es: '¡Toca las monedas!' },
  back: { en: 'BACK', es: 'ATRÁS' },
  howToPlay: { en: 'HOW TO PLAY', es: 'CÓMO SE JUEGA' },
  howTo1: {
    en: '1. Draw a line with your finger.',
    es: '1. Dibuja una línea con el dedo.',
  },
  howTo2: {
    en: '2. Gulls bounce off your line.',
    es: '2. Las gaviotas rebotan en tu línea.',
  },
  howTo3: {
    en: '3. Protect the sandwich for 10 seconds!',
    es: '3. ¡Protege el bocata durante 10 segundos!',
  },
  seconds: { en: 's', es: 's' },
} as const;

export type StringKey = keyof typeof STRINGS;

let lang: Lang = 'en';

export function initLang(detected: string): void {
  lang = detected.toLowerCase().startsWith('es') ? 'es' : 'en';
}

export function setLang(l: Lang): void {
  lang = l;
}

export function currentLang(): Lang {
  return lang;
}

export function t(key: StringKey): string {
  const entry = STRINGS[key];
  return entry[lang] ?? entry.en;
}
