---
author: Fernando González
title: PWA con Ionic3 y Workbox en 2 patadas.
datetime: 2018-05-01T19:00:00Z
description: En 2 sencillos pasos vamos a crear una aplicación web progresiva partiendo de un proyecto en ionic 3. Usaremos Workbox ya que ofrece muchas posibilidades.
tags:
  - pwa
  - ionic3
  - workbox
---

## Table of contents

Para este artículo vamos a partir de un proyecto de ionic 3 ya creado. Puedes crearte uno facilmente con ionic-cli:

```
ionic start ionic3-pwa-workbox blank
```

## Primera patada: Activar el service worker

Para este paso vamos al fichero `./src/index.html` y descomentamos el siguiente código:

```
<script>
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('service-worker.js')
        .then(() => console.log('service worker installed'))
        .catch(err => console.error('Error', err));
    }
</script>

```

Desde este momento ya tenemos el service worker activo con lo que ciertas rutas estarán cacheadas. Podemos verlo si lanzamos `ìonic serve` y vamos a la consola:

![service worker installed](/images/2018/05/pwa-ionic3-workbox-1.png "service worker installed")

## Segunda patada: usar Workbox

primero vamos a instalar workbox con npm:

```
npm i workbox-sw --save
```

Y ahora vamos a indicar a ionic que nos copie este fichero al hacer el build extendiendo la configuración por defecto. Crearemos un fichero al que lamaremos `/config/copy.config.js` con el siguiente contenido:

```
module.exports = {
  copyWorkboxSw: {
    src: ['{{ROOT}}/node_modules/workbox-sw/build/workbox-sw.js'],
    dest: '{{BUILD}}'
  }
}

```

Indicaremos en `package.json` el siguiente codigo para indicarle a ionic que tambien use la configuración que hemos creado:

```
"config": {
    "ionic_copy": "./config/copy.config.js"
  }
```

Y modificaremos el service worker creado por ionic en nuestro proyecto por uno usando Workbox:

```
'use strict';
importScripts('./build/workbox-sw.js');

/*
This is our code to cache static files.
*/
self.workbox.precaching.precacheAndRoute([
    './build/main.js',
    './build/vendor.js',
    './build/main.css',
    './build/polyfills.js',
    'index.html',
    'manifest.json'
    ]
);
```

## Para terminar: patapum pariba y test con Lighthouse.

Para este artículo voy a usar gh-pages pero cualquier otro hosting que ofrezcan https sería valido.

Mediante los siguientes comandos construiremos la aplicación para subirla a producción.

```
ionic cordova platform add browser
ionic cordova build browser --prod
```

Ahora tendremos nuestra aplicación en `./platforms/browser/www/` asi que subiremos este directorio a nuestra rama gh-pages (recuerda usar tu nombre de usuario y tu repositorio en github):

```
cd platforms/browser/www/
git init
git remote add origin https://github.com/frnd/ionic3-pwa-workbox.git
git add --all
git commit -m "production build"
git push origin master:gh-pages -f
```

Nuestra PWA está disponible en (https://frnd.github.io/ionic3-pwa-workbox/)[https://frnd.github.io/ionic3-pwa-workbox/]. En la siguiente captura puedes ver los resultados que da Lighthouse.

![Resultados Lighthouse](/images/2018/05/pwa-ionic3-workbox-2.png "Resultados Lighthouse")

## Codigo fuente y enlaces.

Puedes ver el codigo fuente de este royecto en (github)[https://github.com/frnd/ionic3-pwa-workbox] y acceder al ejemplo (ionic3-pwa-workbox)[https://frnd.github.io/ionic3-pwa-workbox/]. Mas información de interés:

- (ionic)[https://ionicframework.com/]
- (Progressive Web Apps)[https://developers.google.com/web/progressive-web-apps/]
- (Workbox)[https://developers.google.com/web/tools/workbox/#get-started]

Para problemas o comentarios, puedes crear un tema en el github del proyecto https://github.com/frnd/ionic3-pwa-workbox/issues/new
