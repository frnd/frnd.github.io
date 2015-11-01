---
title: "NodeJS-Express: Agrupar mensajes en los logs mediante ID único"
template: post.html
date: 2015-09-28
author: Fernando González
tags: uuid, trace, logs, request, express, nodejs, winston
---

Recientemente, en un proyecto personal en NodeJs, me encontré con la necesidad de trazar logs agrupando todos los mensajes provenientes de la misma request. Buscando, vi varias alternativas pero necesitaba incluir varias dependencias que al final no encajaban del todo bien.

Como solo necesitaba una excusa para crear mi primera extensión para nodejs, pues me puse manos a la obra. El resultado [winston-express-logger](https://github.com/frnd/winston-express-logger)  

Este paquete es un 'middleware' para Express que crea un logger de Winston en el objeto request, que si lo usamos añadirá a los metadatos propios de la llamada a log los siguientes:

 * requesId: identificador único para cada request.
 * method: El método HTTP usado en la llamada
 * url: la URL a la que se dirige la petición
 * ip: dirección ip origen de la petición
 * userAgent: navegador que ha realizado la petición.

De momento está en fase beta y le faltan por completar algunos de los tests, pero ya puedes usarlo en tu proyecto:

Para instalarlo:
```sh
$ npm install --save https://github.com/frnd/winston-express-logger.git
```

En la inicialización de express:

```js
var winston = require('winston');
var express = require('express');
var winstonExpressLogger = require('winston-express-logger');

// Initialize express app
var app = express();

// Add the request logger.
app.use(winstonExpressLogger.create(logger));
```

A partir de ahora en el objeto request de express tendrás un atributo log que será un logger de Winston, pudiéndolo usar de la siguiente forma:

```js
exports.controller = function(req, res) {
    [...]
    req.logger.info('Doing something');
    [...]
}
```

Que generará un mensaje en el log de la siguiente forma:

```
2015-09-28T21:56:52.064Z - info: Doing something method=GET, url=/api/doing, ip=127.0.0.1, userAgent=Chrome 46.0.2490 / Linux 0.0.0, requestId=7a91efe1-e851-421c-b86a-f1cb2c3f2d25
```
