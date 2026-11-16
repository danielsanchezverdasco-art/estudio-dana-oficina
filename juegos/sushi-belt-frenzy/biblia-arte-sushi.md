# Biblia de arte — Sushi Belt Frenzy · Dana Games

**Fecha:** 16/11/2026. **Autor:** Anita (Súper Anita). **Juego:** Sushi Belt Frenzy / Cinta de Sushi Glotona.
**Base:** concepto + mockup aprobados por Daniel 16/11 ~06:36 («Quiero todos para hoy», «Perfectamente diseñados»).
Concepto: `niky/fabrica-conceptos-1511`, `comunicacion-ias/lista-ideas-2026-11-15.md` §4.
Mockup: `mockups/mockup-sushi-belt-frenzy.webp` — partida, LEVEL 4, SCORE 840, COMBO x5, 3 corazones,
mano que señala el plato de salmón, +30, PAUSE y BOOST. Verificado a la vista por Niky: chef gato, cinta
con sushi, tres gatos por colores, HUD completo y legible, sin barra de estado ni relojes falsos ni
elementos cortados. APTO.

**Nota de trabajo:** el mockup se vio a la vista 16/11 ~06:59 vía browser.open (1152×2048, vertical):
restaurante cálido, HUD superior (LEVEL 4, SCORE 840, 3 corazones, PAUSE), chef gato blanco con gorro
detrás de la barra de madera, cinta con platos de sushi (salmón visible, mano señalándolo), tres gatos
abajo sobre alfombras de color (naranja izq., gris centro, blanco y negro dcha.), burbuja +30, COMBO x5
con llamas, botón BOOST. La descarga local sigue bloqueada por EPERM (0 bytes), pero la biblia ya está
verificada contra la imagen vista, no solo contra la descripción.

## 1. Estilo (art bible común de la lista, § «Estilo de arte común»)

Arte de videojuego pulido estilo juguete 3D: personajes con volumen y expresiones, contornos gruesos,
colores saturados, luz cálida, sombras suaves reales, texturas (madera, metal, tela, baldosas), sin dibujo
plano ni clip-art. **El arte ES la mecánica:** el estado del juego se lee en la escena, no en un texto.
Un dedo, un verbo, a jugar en menos de 10 segundos. Sello Dana Games: la mascota (pulpo morado) como
cameo escondido en cada juego.

**Técnica (lección de Ramp Physics r2):** todo el arte es procedural en canvas a 4x el tamaño de
pantalla y Phaser lo reduce — nada de bitmap escalado, nada pixelado. Contorno negro grueso (4–6 px a
4x), borde de volumen (franja superior más clara), sombra suave real debajo de cada elemento.

## 2. Paleta — cada color tiene un rol de juego

| Color | Hex | Rol |
|---|---|---|
| Papel crema | #FFF3D6 | fondo del restaurante, paredes cálidas |
| Madera clara | #E8B06A | barra, marcos, mesas |
| Madera oscura | #8A5A2B | cinta (base), bordes |
| Cinta (fieltro) | #3D2B1F | banda de la cinta transportadora |
| Naranja gato | #F97316 | gato 1 (izquierda) + sus platos |
| Gris gato | #94A3B8 | gato 2 (centro) + sus platos |
| Blanco/negro gato | #1F2937 | gato 3 (derecha) + sus platos (plato blanco con borde negro) |
| Salmón | #FF8A65 | sushi de salmón (el más reconocible) |
| Atún | #E23B2E | sushi de atún |
| Wasabi | #22C55E | plato trampa verde (sin gato: ningún color lo quiere) |
| Dorado | #FACC15 | plato dorado (vale triple), monedas, estrellas |
| Hoja verde | #22C55E | ganar / ir / correcto |
| Coral | #E23B2E | peligro / perder / corazón roto |
| Crema UI | #FFF8E7 | paneles |
| Tinta | #141414 | contornos, texto |
| Pulpo morado | #7C3AED | cameo Dana Games (escondido: en la pared, en un plato) |

**Seguridad daltónica:** el color NUNCA va solo. Cada gato lleva además un símbolo en su alfombra
(● naranja = sol, ▲ gris = triángulo, ◆ blanco/negro = rombo) y cada plato lleva el mismo símbolo en
el borde. El wasabi lleva «WASABI» + cara de «¡picante!» (llamas verdes). El plato dorado lleva «★».

## 3. Escena de partida (390×844, fiel al mockup)

- **HUD superior (y 0–96):** LEVEL (burbuja izquierda), SCORE (píldora centro), 3 corazones (derecha),
  PAUSE (icono arriba derecha). BOOST (botón naranja, 2 cargas) abajo derecha de la cinta.
- **Chef gato (y ~96–190):** detrás de la barra, centro. Gato blanco con gorro de chef y pañuelo rojo.
  Gesticula: señala a la izquierda/derecha cuando viene un wasabi o un dorado (aviso 1,2 s antes).
  Expresión: contento (combo ≥ 5), preocupado (1 corazón), celebrando (victoria).
- **Cinta (y ~210–330):** banda horizontal de madera oscura con fieltro, rodillos en los extremos,
  platos de ~54 px que entran por la izquierda y salen por la derecha. Un plato a la vez en pantalla al
  principio; hasta 3–4 simultáneos en niveles altos. Flecha de dirección grabada en la banda.
- **Gatos (y ~470–720):** tres gatos sentados sobre alfombras de su color, boca abierta pidiendo.
  Gato naranja (izquierda, gordo y feliz), gato gris (centro, serio con bigotes), gato blanco y negro
  (derecha, elegante con pajarita). Cada uno: cuerpo con volumen, sombra suave, ojos grandes,
  animación de respiración (sube/baja 4 px), boca que se abre más cuando su plato está cerca.
- **Fondo:** restaurante japonés cálido: pared crema con papel japonés, lámpara de papel (chōchin)
  roja, ventana con cerezo, suelo de madera. Noren (cortina) azul con el logo del restaurante.
- **Feedback de comer:** el gato se traga el plato con un salto (+30 en burbuja cómic, chispas doradas,
  maullido). Combo: número en llamas junto al gato (COMBO x5). Fallo: gato enfadado (cejas, «¡MIAU!»),
  corazón que se rompe, vibración corta. Wasabi: gato tose (nube verde, «¡COF COF!»), 1,5 s aturdido.

## 4. Menú principal (escena animada e interactiva, no título estático)

El chef gato saluda detrás de la barra con la cinta girando y los tres gatos pidiendo con la boca
abierta; tocar un gato lo hace ronronear (vibración + «PRRR» + corazón). Título «SUSHI BELT FRENZY»
en letras cómic con borde negro, subtítulo «Feed the cats!», botones PLAY / LEVELS / SHOP, reto diario,
monedas, toggles de idioma y sonido, sello Dana Games (badge). El pulpo morado asoma tras la lámpara.

## 5. Personajes y assets (todos procedurales, canvas 4x)

1. `cat-orange` / `cat-grey` / `cat-bw` — cuerpo entero sentado (3 estados: idle, happy, angry, cough,
   stunned) dibujados por código, no por textura separada: un solo sprite base por gato + overlays de
   expresión (boca/ojos) como gráficos Phaser.
2. `chef-cat` — medio cuerpo detrás de la barra + brazo que señala (2 poses: idle, pointing).
3. `plate-salmon` / `plate-tuna` / `plate-shrimp` / `plate-egg` — plato circular con borde de color +
   símbolo + pieza de sushi con volumen (arroz blanco, pescado con brillo, alga verde).
4. `plate-wasabi` — plato verde con montículo de wasabi + llamas + «!».
5. `plate-golden` — plato dorado con «★» + brillo animado.
6. `belt` — banda + rodillos (textura repetible).
7. `bg-menu` / `bg-play` / `bg-play-land` — restaurante completo (retrato + paisaje).
8. `coin`, `chest`, `dot` — reutilizados de la plantilla (recoloreados).
9. `badge` — foto Dana Games (se mantiene).

## 6. Reglas de legibilidad (art-direction-and-readability, directing-game-visuals)

- Cada elemento responde una pregunta de juego: ¿qué plato? (color + símbolo), ¿a qué gato?
  (mismo color + símbolo), ¿cuánto falta? (contador de servicios + barra de progreso), ¿qué viene?
  (chef señala), ¿cuánto combo? (llamas + número).
- Legibilidad primero, personalidad después, fidelidad nunca: un gato precioso que no se distingue
  del de al lado es un defecto, no un estilo.
- Un protagonista (el plato que se mueve), un peligro (wasabi / salida por la derecha), una
  recompensa (el gato comiendo +30). Nada más compite por la atención.
- Contraste: platos y gatos sobre fondo crema/madera con contorno negro; el HUD nunca se mueve
  (no se sacude con el juice).

## 7. Comparativa con Metro Nightmare (lado a lado, antes de enseñar nada)

Metro Nightmare: arte premium, volumen, luz, sombra, textura, animación, game feel. Sushi Belt
Frenzy debe igualarlo en: volumen de los gatos (sombra + brillo, no plano), textura de madera de la
cinta, animación viva (respiración, masticar, toser), feedback por acción (cada servicio tiene su
momento de satisfacción). Si un frame del juego, puesto junto a uno de Metro, parece plano o cutre,
no se enseña.

## 8. Sonido (sintetizado, sin ficheros)

Maullido alegre (sine ascendente + vibrato), masticar (ruido corto), «pop» al servir, tos de wasabi
(sawtooth descendente), campana de combo cada 5, moneda, victoria (arpegio), derrota (descendente).
Sin bucle de música (pregunta abierta: la música ambiental de restaurante queda para la r2 si Daniel
la pide; el audio ambiental de la plantilla es ruido, no música — no se usa).
