import json

p = 'oficina-data.json'
d = json.load(open(p, encoding='utf-8'))

d['updated_at'] = '2026-11-22 05:47'

d['resumen'] = (
    '05:47 — Sin cambios: ningún agente de Dana Games en marcha; nada nuevo en los repos (ls-remote OK con flags del almacén: '
    'Monster e0d8a60, Sushi 92eae16, Spot 3838cbd, Seagull cbe5e7a (descartado), Futbol Tycoon f52a9dd, Slice 4ea2167, '
    'todos iguales a las 05:17); la difusión del Paper Soccer de Grok sigue BLOQUEADA (login de Facebook rechazado 20:24; 0 grupos, '
    '0 publicaciones). Faltan de Daniel: link final del juego, cuenta de Reddit y arreglar el login de Facebook. Desenfunda r8 y '
    'Vecinos r3 pendientes. Fuera de ventana (05:47): sin mensaje a Daniel.'
)

d['factory'].append(
    'Verificado 05:47: sin cambios en nada (Monster e0d8a60, Sushi 92eae16, Spot 3838cbd; Anita: Slice 4ea2167, Cyber 08abde42, '
    'barista-r7 1a23f6a, estampida-r13 dde1b80; Grid y Cofre sin rama; ls-remote OK con flags del almacén). Difusión Paper Soccer sigue '
    'BLOQUEADA (login FB rechazado 20:24). Ningún agente de Dana Games en marcha. Fuera de ventana: sin mensaje a Daniel.'
)

d['anita']['paso'] += (
    ' Verificado 05:47: sin cambios (Slice 4ea2167, Cyber 08abde42, barista-r7 1a23f6a, estampida-r13 dde1b80; Grid y Cofre sin rama '
    'en dana-games-juegos; ls-remote OK). Ningún agente de Anita en marcha.'
)

json.dump(d, open(p, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print('OK escrito')
