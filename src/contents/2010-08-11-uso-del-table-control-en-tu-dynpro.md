---
author: Fernando González
title: Uso del Table Control en tu Dynpro.
datetime: 2010-08-11T15:22:00Z
description:
  El objetivo es conocer los conceptos más importantes a la hora de trabajar con un table control y crear uno mediante el asistente.
  También se estudiará el código que generado para las tareas más usuales y se darán alguno ejemplos.
tags:
  - abap
  - asistente
  - dynpro
  - module
  - PAI
  - PBO
  - SAP
  - subrutina
  - table control
---

Para usar correctamente este control hay que tener un punto clave muy claro. En cada ciclo PAI – PBO el Table Control
mostrara el contenido de la tabla interna al que se haya asociado. Por lo tanto, si se hace una modificación en los
datos que se están mostrando en la Dynpro estos hay que salvarlos en la tabla interna en el PAI para que al completarse
el ciclo se muestren las modificaciones.

Otra de las necesidades más comunes al usar un Table Control es el hecho de activar/desactivar alguna de sus celdas
según una condición en alguno de los campos de la fila en la que se encuentra o según el contenido de ese campo. Esta
tarea se realiza en el PBO ya que es algo que se debe realizar justo antes de mostrar la tabla.

En el siguiente esquema vemos cada una de las acciones que se pueden realizar para manejar un Table Control y donde se
deben realizar.

<img src="/images/2010/08/1.png" alt="Esquema general" title="Esquema general" itemprop="image">

## Pasos previos para crear un Table Control.

Crear un Table Control es un proceso muy sencillo usando el Wizard que tenemos en el entorno de desarrollo, pero antes
de ejecutar este Wizard hay que crear una serie de elementos en nuestro código:

Crear un tipo estructura que contendrá los campos que se mostrarán en la tabla junto con un campo oculto que se usará
de forma interna para marcar las filas seleccionadas. Para nuestro ejemplo quedará de la siguiente forma, donde el campo mark será el campo interno para marcar las filas seleccionadas:

    TYPES: BEGIN OF ty_s_tablecontrol,
    idemp TYPE ZEMPLEADOS-IDEMP,
    fecha TYPE ZDATGEN-FECHA,
    nombr TYPE ZEMPLEADOS-NOMBR,
    apel1 TYPE ZEMPLEADOS-APEL1,
    apel2 TYPE ZEMPLEADOS-APEL2,
    mark TYPE C,
    DELETE TYPE C,
    END OF ty_s_tablecontrol.

Definir un tipo tabla según la estructura anteriormente creada.

    TYPES ty_t_tablecontrol TYPE STANDARD TABLE OF ty_s_tablecontrol.

Definir una variable para la tabla interna y su área de trabajo.

    DATA wa_tablecontrol TYPE ty_s_tablecontrol.
    DATA it_tablecontrol TYPE ty_t_tablecontrol.

## Uso del Wizard

En este momento ya tenemos todos los elementos básicos para usar el Wizard y mostrar nuestro Table Control.

**Importante: Antes de usar el asistente hay que activar el programa por completo.**

Crearemos una Dynpro de tipo normal y cuya pantalla siguiente sea esa misma Dynpro. Para ejecutar dicho asistente
acudimos al Layout de nuestra Dynpro y pulsamos el botón Table Control mediante Wizard. Podemos realizar lo mismo sin el Asistente pero será trabajar de más y con mayores posibilidades de equivocarnos.

Para ejecutar el asistente tenemos usaremos el icono de la barra lateral del Layout.

![Alt Insertar un table control con el asistente](/images/2010/08/2.png "Insertar un table control con el asistente")

El primer paso del asistente pulsaremos el botón Continuar. De momento es sencillo.

![Alt Asistente - Inicio](/images/2010/08/3.png "Asistente - Inicio")

En el segundo paso es darle un nombre a nuestro Table Control. Es importante elegir un nombre no muy largo por que el
asistente creará subrutinas según ese nombre y si es muy largo se nos irá del número de caracteres máximo.

![Alt Asistente - Nombre del Table Control](/images/2010/08/4.png "Asistente - Nombre del Table Control")

En el tercer paso nos pide si el Table Control va a manejar directamente una tabla del diccionario de datos o una tabla
interna. Si seleccionamos la primera opción, con este Table Control vamos a modificar directamente el contenido de una
tabla de la base de datos. No es necesario decir que esto puede ser un poco peligroso.

![Alt Asistente - Nombre de la tabla](/images/2010/08/5.png "Asistente - Nombre de la tabla")

Si seleccionamos la segunda opción deberemos indicar la tabla interna que va a gestionar el Table Control y el área de
trabajo que usaremos. Estos datos son las variables que creamos anteriormente.

En el cuarto paso seleccionaremos las filas que queremos mostrar en la tabla. Dejaremos sin seleccionar el campo que
hemos creado para guardar las filas seleccionadas.

![Alt Asistente - Definición de columnas](/images/2010/08/6.png "Asistente - Definición de columnas")

En el siguiente paso seleccionaremos si la tabla será sólo de salida, es decir, no se podrán hacer modificaciones sobre el contenido de la tabla, de Entrada, que entonces permitirá realizar modificaciones sobre el contenido y crear nuevas líneas. Hay que tener en cuenta que esta configuración se podrá modificar posteriormente accediendo a la configuración desde el Layout o mediante código activando o desactivando la entrada de datos en el campo o la columna. Esto ya lo veremos posteriormente. En este ejemplo crearemos el Table Control de tipo Entrada y añadiremos la columna reservada en
los pasos anteriores para el Campo columna de selección. Habilitaremos la selección múltiple si queremos que esté
disponible al usuario.

![Alt Asistente - Atributos del Table Control](/images/2010/08/7.png "Asistente - Atributos del Table Control")

En el siguiente paso nos solicita que botones estándar tiene que crear para nuestro Table Control donde seleccionaremos
todas las casillas.

![Alt Asistente - Selección de funciones](/images/2010/08/8.png "Asistente - Selección de funciones")

En este penúltimo paso indicaremos el nombre de los includes que usamos en nuestro código y donde el asistenta
introducirá las partes de código necesarias. Si seguimos la nomenclatura estándar tendremos los siguientes includes
para cada caso:

- \*TOP – Definiciones de datos.
- \*O01 – PBO.
- \*I01 – PAI.
- \*F01 – Subrutinas.

![Alt Asistente - Especificación de includes](/images/2010/08/9.png "Asistente - Especificación de includes")

El último paso no sindicará las acciones que se van a realizar. Pulsaremos sobre finalizar y el asistente creará el
código necesario.

![Alt Asistente - Finalizar](/images/2010/08/10.png "Asistente - Finalizar")

En las siguientes secciones analizaremos el código para comprenderlo.

## Código generado por el asistente en el PBO

En la pestaña de la lógica de proceso se ha creado el siguiente código para el PBO.

    MODULE TC_VAC_CHANGE_TC_ATTR.
    MODULE TC_VAC_CHANGE_COL_ATTR.
    LOOP AT   IT_TABLECONTROL
         INTO WA_TABLECONTROL
         WITH CONTROL TC_VAC
         CURSOR TC_VAC-CURRENT_LINE.
      MODULE TC_VAC_GET_LINES.
      MODULE TC_VAC_CHANGE_FIELD_ATTR.
    ENDLOOP.

Ciertas líneas aparecerán comentadas pero en este manual expondremos para que se utilizara cada uno de los módulos.

Dentro del módulo TC_VAC_CHANGE_TC_ATTR de la línea 1 pondríamos el código para cambiar los atributos del Table Control por completo.

Dentro del módulo TC_VAC_CHANGE_COL_ATTR de la línea 2 pondríamos el código para cambiar los atributos de las columnas del Table Control.

Desde la línea 3 hasta la 9 hay un bucle que recorre cada una de las líneas de la tabla interna. Será en este bucle
donde se realizarán las diferentes acciones referentes a modificar el aspecto de cada una de las celdas de la tabla
como por ejemplo permitir o no la modificación de esa celda. Dentro del módulo TC_VAC_CHANGE_FIELD_ATTR será el punto
más idóneo para realizar esas tareas. En el siguiente trozo de código se puede ver un ejemplo de lo que podemos
realizar.

    MODULE TC_VAC_CHANGE_FIELD_ATTR OUTPUT.
      LOOP AT SCREEN.
        IF screen-NAME = 'WA_TABLECONTROL-FECHA'.
          IF WA_TABLECONTROL-FECHA > sy-datum.
            screen-INPUT = '1'.
          ENDIF.
        ENDIF.
        MODIFY SCREEN.
      ENDLOOP.
    ENDMODULE.

En el anterior código, se activan las casillas de la tabla que contengan una fecha mayor a la del día de hoy. En la
línea 2 se realiza un bucle sobre los campos de una fila de la tabla. En la línea 3 se comprueba si el capo actual de
la ventana es el que no s interesa y en la línea 4 se comprueba la condición sobre ese campo. Si la condición se
cumple, en la línea 5 se cambia la propiedad de la ventana que indica si el campo está disponible para operaciones de
entrada y salida. Finalmente en la línea 8 se realiza la modificación de los cambios que se han realizado en la ventana.

## Código generado por el asistente en el PAI

En la pestaña de la lógica de proceso se ha creado el siguiente código para el PBO.

    LOOP AT IT_TABLECONTROL.
        CHAIN.
          FIELD WA_TABLECONTROL-IDEMP.
          FIELD WA_TABLECONTROL-FECHA.
          FIELD WA_TABLECONTROL-NOMBR.
          FIELD WA_TABLECONTROL-APEL1.
          FIELD WA_TABLECONTROL-APEL2.
          MODULE TC_VAC_MODIFY ON CHAIN-REQUEST.
        ENDCHAIN.
        FIELD WA_TABLECONTROL-MARK
          MODULE TC_VAC_MARK ON REQUEST.
    ENDLOOP.
    MODULE TC_VAC_USER_COMMAND.
    MODULE TC_VAC_CHANGE_TC_ATTR.
    MODULE TC_VAC_CHANGE_COL_ATTR.

En la linea 8 se hace la llamada al módulo que realizará la modificación en la tabla interna de los cambios que se
hayan realizado en la ventana. En este paso sería importante antes de realizar dicha modificación, comprobar la validez
de los datos introducidos en la Dynpro Como en el siguiente ejemplo:

    MODULE TC_VAC_MODIFY INPUT.
     IF WA_TABLECONTROL-FECHA > sy-datum.
       MODIFY IT_TABLECONTROL
         FROM WA_TABLECONTROL
         INDEX TC_VAC-CURRENT_LINE.
     ELSE.
       MESSAGE 'Fecha anterior a la actual' TYPE 'W'.
     ENDIF.
    ENDMODULE.

Como vemos si la fecha solicitada es mayor que la actual (línea 2) se realiza la modificación. Si es anterior se
muestra el mensaje de error. Es importante notar que al estar el módulo dentro de un CHAIN … ENDCHAIN si se produce
un mensaje de error en el módulo se regresa a la Dynpro y se activarán únicamente para modificación los campos
declarados con la clausula FIELD .

En la línea 13 le realiza una llamada al módulo TC_VAC_USER_COMMAND. Este módulo es el encargado de gestionar los
botones propios del Table Control para insertar, borrar, avanzar o retroceder paginas o filas, marcar o desmarcar
una fila, etc.

Dentro del módulo TC_VAC_USER_COMMAND se llama a la subrutina USER_OK_TC que es la encargada de comprobar cual es el
botón que ha sido pulsado y encaminar la ejecución a la subrutina encargada de la lógica de ese botón. En el siguiente
diagrama se puede ver dicha lógica.

![Alt Flujo de la lógica de control para los botones del Table Control](/images/2010/08/11.png "Flujo de la lógica de control para los botones del Table Control")

El código estándar funciona para la mayoría de las necesidades, pero si por ejemplo necesitamos que la inserción de
nuevas filas en la tabla ciertos campos se completen por defecto, necesitaremos modificar el código de la subrutina
FCODE_INSERT_ROW.
