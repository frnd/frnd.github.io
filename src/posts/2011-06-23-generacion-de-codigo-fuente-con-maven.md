---
title: Generación de código fuente con Maven.
draft: false
template: post.html
date: 2011-06-23
description: Maven
author: Fernando González
tags: maven,code,template
---

En este artículo veremos como mediante la capacidad de filtrado de archivos que dispone Maven podremos generar una clase java que posteriormente se compilará formando parte del proyecto como si fuera un fichero de código normal.

Este articulo requiere una serie de conocimientos sobre Maven. Para más información puedes visitar la [página del proyecto de Maven](http://maven.apache.org/).

Como ejemplo útil vamos a generar una clase con la información del nombre de proyecto y la versión que se han indicado en el fichero POM que luego podremos usar en nuestro código normal y así conseguir que ajustando la configuración
estándar de Maven, automáticamente estos cambios queden presentes en el código fuente.

## Estructura de directorios

La estructura de directorios del proyecto sera como la de cualquier proyecto Maven solo que con una carpeta añadida para contener los ficheros con las plantillas para los fuentes generados.

    .
    ├── pom.xml
    └── src
        └── main
            ├── java
            │   └── es
            │       └── excelsit
            │           └── sourceGenerationExample
            │               └── ClaseNormal.java
            └── source-templates
                └── es
                    └── excelsit
                        └── sourcesGenerationExample
                            └── Version.java

En la línea número 10 del listado de directorios anterior vemos una carpeta llamada source-template. Esta será la carpeta que contendrá las plantillas.

## Configuración de Maven

Para que Maven se entere de la existencia de esta carpeta hay que configurarlo en el POM.

    <resources>
      [...]
      <resource>
        <directory>src/main/source-templates</directory>
        <filtering>true</filtering>
        <targetPath>../generated-sources/filtering</targetPath>
      </resource>
      [...]
    </resources>

Mediante el código anterior incluiremos una carpeta de recursos que usará el filtrado de propiedades de Maven y que el resultado se copiará en la carpeta `/target/generated-sources/filtering`. Para el elemento `targetPath` hay que tener en cuenta que la ruta es relativa al directorio de compilación (más información sobre la estructura de directorios estandar de Maven) y que por defecto en el la generación de codigo se realiza dentro del directorio `/target/generated-sources/NOMBRE_PLUGIN`

El próximo paso es indicarle al plugin de compilación que existe un nuevo directorio con fuentes que también debe tener en cuenta.

```
<plugins>
    <plugin>
        <groupId>org.codehaus.mojo</groupId>
        <artifactId>build-helper-maven-plugin</artifactId>
        <executions>
            <execution>
                <id>add-source</id>
                <phase>generate-sources</phase>
                <goals>
                    <goal>add-source</goal>
                </goals>
                <configuration>
                    <sources>
                        <source>${basedir}/target/generated-sources/filtering</source>
                    </sources>
                </configuration>
            </execution>
        </executions>
    </plugin>
</plugins>
```

De la línea 12 a la 16 vemos la parte de configuración del plugin de compilación de Maven donde le hemos indicado una nueva carpeta con fuentes.

## Proyecto de ejemplo.

Para que tengais una visión de como quedaría el proyecto aquí tenéis el ejemplo sobre [generación de código mediante el filtrado de Maven](/uploads/2011/06/23/srcgen.zip) completo. Para ver el resultado podeis usar el siguiente comando:

    mvn -Dexec.classpathScope=runtime "-Dexec.args=-classpath %classpath es.frnd.srcgen.ClaseNormal" -Dexec.executable=java process-classes org.codehaus.mojo:exec-maven-plugin:1.2:exec
