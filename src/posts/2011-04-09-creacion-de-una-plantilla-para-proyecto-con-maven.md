---
title: Creación de una plantilla para proyecto con Maven.
draft: false
template: post.html
date: 2011-04-09
description: Maven
author: Fernando González
tags: archetype,java,maven,platilla,proyecto
---

Archetype: una plantilla para crear rapidamente la estructura de tu proyecto.

<!-- more -->

Maven es una herramienta muy útil para la gestión de proyectos. Facilita la gestión de dependencias del proyecto, pruebas unitarias, integración continua. Está basado en un sistema de plugins que ofrece la posibilidad de extender Maven para realizar cualquier tipo de tarea. En este artículo vamos a ver como se puede usar esta herramienta para generar una plantilla para acelerar el desarrollo de nuevos proyectos.

Como ya hemos dicho, Maven es una herramienta para compilar y gestionar proyectos.  Es muy usada en proyectos Java, aunque es genérica y podría ser usada para cualquier lenguaje. Está basada en que el proyecto tiene una estructura de directorios específica que veremos posteriormente, aunque es totalmente configurable.

## Creación de una plantilla vacía.

Una plantilla para Maven tiene la siguiente estructura:

    archetype
    |-- pom.xml
    `-- src
        `-- main
            `-- resources
                |-- META-INF
                |   `-- maven
                |       `--archetype.xml ó archetype-metadata.xml
                `-- archetype-resources
                    |-- pom.xml
                    `-- src
                        |-- main
                        |   `-- java
                        `-- test
                            `-- java

Como puedes ver, sigue la estructura de cualquier proyecto Maven. Hay varios ficheros que hay que tener en cuenta:

 - pom.xml en el directorio raíz se encuentra el fichero POM con la información para gestionar el proyecto para generar la plantilla.
 - pom.xml: Será el POM del proyecto que se genere usando la plantilla que estamos creando. Podemos decir que el contenido de la carpeta archetype-resources será el contenido del proyecto que generemos con esta platilla.
 - archetype.xml ó archetype-metadata.xml: Describe los ficheros que contendrá el proyecto que se genere con esta plantilla. El primero (archetype.xml) es para la versión 1 del plugin, mientras que el segundo (archetype-metadata.xml) se usa en la versión 2 o superiores.

En el directorio archetype-resources estarán los ficheros que contendrá el proyecto que generemos con esta plantilla.

En el directorio archetype-resources estarán los ficheros que contendrá el proyecto que generemos con esta plantilla.

Puedes crear esa estructura a mano, pero es más sencillo usar el [plugin Archetype](http://maven.apache.org/plugins/maven-archetype-plugin/usage.html "maven-archetype-plugin") que te permite crear esa estructura sin esfuerzo. Para esto usaremos el siguiente comando:

    mvn archetype:generate

## Creación de una plantilla basándose en un proyecto existente.

Si ya tienes un proyecto sobre el que quieras crear un modelo para poder generar proyectos similares puedes ejecutar el siguiente comando:

    mvn archetype:create-from-project

Una vez que Maven haya finalizado su ejecución, en la carpeta target/generated-source tendrás la plantilla para tu proyecto con los ficheros pom.xml, archetype.xml y archetype-metadata.xml generados de forma automática.

Es posible que necesites realizar alguna modificación en los ficheros para adaptar mejor la plantilla a tus necesidades. Por ejemplo:

 - Organizar el código en un paquete
 - Definir variables en el contenido del fichero para adaptar ciertos nombres a tus necesidades.
 - Personalizar los nombres de ficheros según unas variables.

## Organizar los ficheros en paquetes

Dentro del fichero archetype-metadata.xml encontraremos una serie de descriptores de los directorios en los que se compone nuestro proyecto. Un ejemplo sería:

  ```
  <fileSet filtered="true" packaged="true" encoding="UTF-8">
     <directory>src/main/java</directory>
     <includes>
        <include>**/*.java</include>
     </includes>
  </fileSet>
  ```

Como vemos es bastante descriptivo, pero vamos a explicar la parte que nos interesa.  En el elemento fileSet vemos el atributo packaged="true", mediante este atributo indicamos a maven que al prosesar el contenido de ese directorio use una estructura de paquetes. Si por ejemplo, el contenido de ese directorio es

    src/main/java
              |-- common
              |    `-- Objeto.java
              |-- servicio
                    `-- Objeto.java

en el proyecto resultado estará dentro de una estructura de paquetes indicado mediante la variable ${package}. Si por ejemplo el contenido de esta variable es es.excelsit.miProyecto el resultado sería:

    src/main/java
        es
        `--excelsit
            `-- miProyecto
                  |-- common
                  |   `-- Objeto1.java
                  |-- servicio
                      `-- Objeto2.java

El fichero para la clase Objeto1 y Objeto2 deberá contener la instrucción package es.excelsit.miProyecto;. Para ello usaremos la siguiente sintaxis para la definición del paquete:

```
package ${package};
```

## Uso de variables en la plantilla.

Si abrimos alguno de los ficheros de nuestra plantilla veremos que todos comienzan con algo asi:

```
#set ( $symbol_pound = '#' )
#set ( $symbol_dollar = '$' )
#set ( $symbol_escape = '\' )
```

Como vemos por su sintaxis, el plugin usa de forma interna [Velocity]( http://velocity.apache.org/engine/devel/translations/user-guide_es.html) para la generación y adaptación de los ficheros de nuestra platilla de proyecto. Esto nos permite mucha libertad a la hora de crear el contenido del fichero. Hay que tener en cuenta que como  los símbolos almoadilla (#), dolar ($) y barra invertida (\\) son caracteres especiales, si los queremos usar deberemos hacerlo mediante sus variables `$symbol_pound`, `$symbol_dollar` y `$symbol_escape` correspondientes.

### Añadir propiedades propias.

Podremos crear propiedades propias de la siguiente forma:

    #set ( $miPropiedad = 'valor' )

En este punto tendremos toda la libertad que ofrece Velocity para concatenar cadenas, obtener la fecha del sistema, etc. Estas propiedades que creemos las podemos usar dentro del contenido del fichero mediante `$miPropiedad`.

También tenemos la posibilidad de renombrar ficheros según nuestras necesidades durante el proceso de generación de nuestro proyecto a partir de la plantilla. Para poder usar variables en el nombre del fichero usaremos dos careateres guión bajo (\_) rodeando el nombre de la varible para indicar que se debe sustituir por su vlaor. Por ejemplo:

```
__miPropiedad__App.java
__artifactId__-context.xml
__groupId__App.java
```

### Personalizar el nombre de ficheros con variables.

De forma predeterminada tenemos usa serie da variables ya predefinidas quepodemos usar para renombrar ficheros de nuestra plantilla, pero nos puede interesar crear variables en el momento de generar el proyecto para renombrar ficheros. Para poder hacer esto podemos valernos de que el primer fichero que se procesa es el pom.xml y crear en el las variebles con el valor que necesitemos. Posteriormente podremos hacer referencia a esas variables definidas en el nombre del fichero. Por ejemplo podemos definir el fichero pom.xml de la siguiente forma:

```
#set ( $customProperty = 'Excelsit' )
#set ( $theArtifactId = $artifactId )
#set ( $thegroupId = $groupId )
#set ( $theVersion = $version )
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <groupId>$thegroupId</groupId>
  <artifactId>$theArtifactId</artifactId>
  <version>$theVersion</version>

  <dependencies>
    <dependency>
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <version>3.8.1</version>
      <scope>test</scope>
    </dependency>
  </dependencies>
</project>
```

En la línea 1 hemos definido una propiedad a la que le hemos dado cierto valor. Pero recuerda que internamente funciona con Velocity, por lo que podremos generar ese valor de cualquier forma. Podremos usar esa propiedad para renombrar ficheros según la forma que hemos visto anteriormente \_\_customProperty\_\_App.java

## Usar la plantilla.

Para usar la plantilla lo más sencillo es realizar una instalación local. Usaremos el siguiente comando dentro de la carpeta de nuestro proyecto:

    $mvn install

Una vez instalado podremos usarlo meniante archetype:generate. Por defecto el plugin buscará en catalogo central de Maven. Para modificar este comportamiento usaremos el parámetro archetypeCatalog=local:

    mvn archetype:generate -DarchetypeCatalog=local

Si no aparece nuestra plantilla quizás deberamos actualizar el catalogo mediante el comando:

    mvn archetype:crawl

## Código de ejemplo

Descarga el ejemplo de plantilla: [example-archetype](/uploads/2011/04/09/frnd-example-archetype.zip).
