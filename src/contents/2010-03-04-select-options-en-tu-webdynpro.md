---
author: Fernando González
datetime: 2010-03-14T15:22:00Z
title: Select Options en tu WebDynpro.
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
description:
  Las SELECT-OPTIONS en las Dynpro ABAP son una forma de crear filtros complejos para
  realizar consultas pero tambien se pueden usar en las WebDynpro.
---

## Table of contents

En las WebDynpro también disponemos de las capacidades que ofrece ese elemento de ABAP usando el componente WDR_SELECT_OPTIONS.

En este tutorial veremos un ejemplo sencillo y las diferentes opciones de personalización más comunes que ofrece.

El objetivo que perseguimos es obtener una pantalla de selección como la que sigue:

<img src="/images/2010/03/resultado-final.png" alt="Alt Resultado Final SELECT-OPTIONS en WebDynpro." title="Resultado Final SELECT-OPTIONS en WebDynpro." itemprop="image">

En esta pantalla se han eliminado las opciones de selección extendidas pero estas salen por defecto y solo tendrás que
eliminar unos parámetros para que aparezcan.

## Como usar el componente WDR_SELECT_OPTIONS

El primer paso será indicar el uso del componente. Esto se hace en la vista del componente mediante los botones añadir
y eliminar uso. Para este ejemplo usaremos tambien SALV_WD_TABLE para mostrar la tabla de materiales. El nombre que le
pongamos en la columna "Component Use" será importante ya que se usará posteriormente.

![Alt Vista de Componente.](/images/2010/03/componente.png "Vista de Componente.")

En nuestro component controller también indicaremos el uso del componente para manejar select options.

![Alt Vista del Component Controller](/images/2010/03/sowd.png "Vista del Component Controller")

En nuestra ventana principal crearemos un contenedor de vistas (ViewContainerUIElement) para nuestro conjunto de campos
de selección.

![Alt Vista MAIN](/images/2010/03/vista-main.png "Vista MAIN")

En la vista de la ventana incrustaremos la vista WND_SELECTION_SCREEN que nos facilita el componente WDR_SELECT_OPTIONS.
Esto es así por que en un mismo componente se pueden incluir varios campos de selección además de campos de entrada
simples (Input Fields, Check Boxes, etc.).

![Alt Vista de Ventana](/images/2010/03/vista-ventana.png "Vista de Ventana")

En este momento tenemos la vista vacia, y tenemos que añadir los campos de selección que queramos. Esto se hace
mediante 2 métodos que proporciona el componente en la interfaz if_wd_select_options. El primero crea la
tabla donde se guardan los rangos de selección:

```abap
lt_range_matnr = lr_helper->create_range_table( i_typename = 'NOMBRE_TIPO_DATOS' ).
```

El segundo crea los campos de selección en la vista:

```abap
lr_helper->add_selection_field( i_id = 'NOMBRE_CAMPO'
it_result = lt_range_matnr ).
```

En esta función se han puesto los parámetros imprescindibles para crear un SELECT-OPTIONS como en las Dynpro ABAP,
pero hay además otros parámetros que pueden resultar útiles como:

- i_no_extension = \[abap_true | abap_false\] Elimina la posibilidad de crear una tabla de selecciones múltiple.
- i_no_complex_restrictions = \[abap_true |abap_false\] Elimina la posibilidad de cambiar el operador relacional.

Estas tareas se realizarán en el método WDDOINIT de nuestro component controller, que es donde hemos declarado el uso del componente de sap para manejar select options, por lo que para nuestro ejemplo quedará como sigue:

```abap
METHOD wddoinit .

  DATA lr_select_options TYPE REF TO iwci_wdr_select_options.
  DATA lr_helper TYPE REF TO if_wd_select_options.
  DATA lt_range_matnr TYPE REF TO DATA.
  DATA lt_range_matkl TYPE REF TO DATA.
  DATA lt_range_mtart TYPE REF TO DATA.
  DATA lr_comp_usage TYPE REF TO if_wd_component_usage.
  DATA lv_otr_text TYPE STRING.

*this code is to instantiate the component wdr_select_options
  lr_comp_usage = wd_this->wd_cpuse_select_options( ).
  IF lr_comp_usage->has_active_component( ) IS INITIAL.
    lr_comp_usage->create_component( ).
  ENDIF.

* Call the interface controller method init_selection_screen to get the helper class
  lr_select_options = wd_this->wd_cpifc_select_options( ).
  lr_helper = lr_select_options->init_selection_screen( ).

* Set global options.
  lr_helper->set_global_options(
                              i_display_btn_cancel  = abap_false
                              i_display_btn_check   = abap_false
                              i_display_btn_reset   = abap_false
                              i_display_btn_execute = abap_false ).

*Use the helper class to create a range table for the data elements MATNR, MATKL and MTART.
  lt_range_matnr = lr_helper->create_range_table( i_typename = 'MARA-MATNR' ).
  lt_range_matkl = lr_helper->create_range_table( i_typename = 'MARA-MATKL' ).
  lt_range_mtart = lr_helper->create_range_table( i_typename = 'MARA-MTART' ).

*Add a Selection Screen Field
  lr_helper->add_selection_field( i_id = 'SO_MATNR'
                                  it_result = lt_range_matnr
                                  i_no_extension = abap_true             " Supress the multiple selection option.
                                  i_use_complex_restriction = abap_true  " Supress the relational operator button.
                                  ).
  lr_helper->add_selection_field( i_id = 'SO_MATKL'
                                  it_result = lt_range_matkl
                                  i_value_help_structure = 'MARA'        " Search help.
                                  i_value_help_structure_field = 'MATKL'
                                  i_no_extension = abap_true             " Supress the multiple selection option.
                                  i_use_complex_restriction = abap_true  " Supress the relational operator button.
                                  ).
  lr_helper->add_selection_field( i_id = 'SO_MTART'
                                  it_result = lt_range_mtart
                                  i_value_help_mode = '0'
                                  i_value_help_structure = 'MARA'        " Search help.
                                  i_value_help_structure_field = 'MTART'
                                  i_no_extension = abap_true             " Supress the multiple selection option.
                                  i_use_complex_restriction = abap_true  " Supress the relational operator button.
                                  ).
ENDMETHOD.
```

Es posible crear todo tipo de campos de entrada mediante el método add_parameter_field. Por ejemplo, para crear un check box:

```abap
lr_helper->add_parameter_field( i_id = 'NOMBRE_CAMPO'
                                  i_as_checkbox = abap_true
                                  i_description = lv_otr_text
                                  ).
```

En este momento ya tenemos una pantalla donde se muestra un conjunto de campos de selección para nuestras necesidades. Nos queda resolver la necesidad de chequear la corrección de los datos introducidos por el usuario y la obtención de estos para generar la consulta.

Para el primer paso, el componente ofrece el método check_all_selection_fields que devuelve el número de errores que se han producido. Posteriormente podemos usar un IF para comprobar si retorna 0 errores y continuar con el proceso o cancelar. El componente mostrará automáticamente los errores en la pantalla.

```abap
 CALL METHOD lr_helper->check_all_selection_fields
    IMPORTING
      e_num_error_msgs   = lv_num_error_msgs
*      e_num_warning_msgs = lv_num_warning_msgs
*      e_num_info_msgs    = lv_num_info_msgs
      .

  IF lv_num_error_msgs EQ 0
*     lv_num_warning_msgs eq 0
*     lv_num_info_msgs eq 0
  .
* No errors
  ELSE.
* At least one error.
  ENDIF.
```

El siguiente paso es obtener la tabla con las opciones de selección que ha realizado el usiario. Esto se hará de la siguiente forma:

```abap
DATA so_matnr TYPE REF TO DATA.
FIELD-SYMBOLS  TYPE ANY TABLE.
so_matnr = lr_helper->get_range_table_of_sel_field( i_id = 'SO_MATNR' ).
ASSIGN so_matnr->* TO .
```

El FIELD-SYMBOL es necesario para usarlo posteriormente en la consulta a la base de datos (sentencia SELECT … IN …) ya que de otra forma se producirá un error de compilación.

Para realizar el chequeo de los campos que no son SELECT-OPTIONS y obtener sus valores, usaremos los métodos check_all_parameter_fields y get_value_of_parameter_field de la interfaz if_wd_select_options.

Estos metodos se usarán en una acción asignada a un botón. Para el ejemplo, hemos creado una acción MOSTRAR asignandola a su correspondiente botón. El código completo quedará como sigue:

```javascript
METHOD onactionmostrar .

  DATA lo_el_context TYPE REF TO if_wd_context_element.
  DATA ls_context TYPE wd_this->element_context.
  DATA lv_limit TYPE wd_this->element_context-limit.

  DATA lo_nd_alv_table TYPE REF TO if_wd_context_node.
  DATA lt_alv_table TYPE wd_this->elements_alv_table.

  DATA so_matnr TYPE REF TO DATA.
  DATA so_matkl TYPE REF TO DATA.
  DATA so_mtart TYPE REF TO DATA.
*  DATA limit TYPE REF TO data.
  FIELD-SYMBOLS <so_matnr> TYPE ANY TABLE.
  FIELD-SYMBOLS <so_matkl> TYPE ANY TABLE.
  FIELD-SYMBOLS <so_mtart> TYPE ANY TABLE.

  DATA lr_select_options TYPE REF TO iwci_wdr_select_options.
  DATA lr_helper TYPE REF TO if_wd_select_options.
  DATA lr_comp_usage TYPE REF TO if_wd_component_usage.
  DATA lt_fields TYPE if_wd_select_options=>tt_selection_screen_item.
  FIELD-SYMBOLS <ls_field> TYPE if_wd_select_options=>t_selection_screen_item.
  DATA: lv_num_error_msgs TYPE i,
        lv_num_warning_msgs TYPE i,
        lv_num_info_msgs TYPE i.

* Get report table from context.
  lo_nd_alv_table = wd_context->get_child_node( NAME = wd_this->wdctx_alv_table ).

  lr_comp_usage = wd_this->wd_cpuse_select_options( ).
  IF lr_comp_usage->has_active_component( ) IS INITIAL.
    lr_comp_usage->create_component( ).
  ENDIF.

  lr_select_options = wd_this->wd_cpifc_select_options( ).

  lr_helper = lr_select_options->init_selection_screen( ).

* check correction of selection fields.
  CALL METHOD lr_helper->check_all_selection_fields
    IMPORTING
      e_num_error_msgs   = lv_num_error_msgs
*      e_num_warning_msgs = lv_num_warning_msgs
*      e_num_info_msgs    = lv_num_info_msgs
      .

  IF lv_num_error_msgs EQ 0
*     lv_num_warning_msgs eq 0
*     lv_num_info_msgs eq 0
  .
    lr_helper->get_selection_screen_items(
                  IMPORTING et_selection_screen_items = lt_fields ).

* Retrieve the data from the select option
    so_matnr = lr_helper->get_range_table_of_sel_field( i_id = 'SO_MATNR' ).
    ASSIGN so_matnr->* TO <so_matnr>.

    so_matkl = lr_helper->get_range_table_of_sel_field( i_id = 'SO_MATKL' ).
    ASSIGN so_matkl->* TO <so_matkl>.

    so_mtart = lr_helper->get_range_table_of_sel_field( i_id = 'SO_MTART' ).
    ASSIGN so_mtart->* TO <so_mtart>.

*    limit = lr_helper->get_value_of_parameter_field( i_id  = 'LIMIT' ).

    lo_el_context = wd_context->get_element( ).
    lo_el_context->get_attribute(
      EXPORTING
        NAME =  `LIMIT`
      IMPORTING
        VALUE = lv_limit ).

    IF lv_limit = abap_true.
      SELECT m~matnr d~maktx txtm~mtbez txtt~wgbez m~ernam
        INTO CORRESPONDING FIELDS OF TABLE lt_alv_table
        FROM  ( ( ( mara AS m
                LEFT OUTER JOIN makt AS d ON m~matnr = d~matnr AND d~spras = sy-langu  )
                LEFT OUTER JOIN t134t AS txtm ON m~mtart = txtm~mtart AND txtm~spras = sy-langu )
                LEFT OUTER JOIN t023t AS txtt ON m~matkl = txtt~matkl AND txtt~spras = sy-langu )
       UP TO 500 ROWS
       WHERE m~matnr IN <so_matnr>
         AND m~mtart IN <so_mtart>
         AND m~matkl IN <so_matkl>
       .
    ELSE.
      SELECT m~matnr d~maktx txtm~mtbez txtt~wgbez m~ernam
       INTO CORRESPONDING FIELDS OF TABLE lt_alv_table
       FROM  ( ( ( mara AS m
               LEFT OUTER JOIN makt AS d ON m~matnr = d~matnr AND d~spras = sy-langu  )
               LEFT OUTER JOIN t134t AS txtm ON m~mtart = txtm~mtart AND txtm~spras = sy-langu )
               LEFT OUTER JOIN t023t AS txtt ON m~matkl = txtt~matkl AND txtt~spras = sy-langu )
      WHERE m~matnr IN <so_matnr>
        AND m~mtart IN <so_mtart>
        AND m~matkl IN <so_matkl>
      .
    ENDIF.
    IF sy-dbcnt > 0.
      lo_nd_alv_table->bind_table( new_items = lt_alv_table set_initial_elements = abap_true ).
      wd_this->fire_to_alv_plg(
      ).
    ELSE.
      wd_this->fire_to_no_data_plg(
      ).
    ENDIF.
  ENDIF.
ENDMETHOD.
```

##Completando el ejemplo.

A partir de aqui, el resto del tutorial nos centramos en completar el ejemplo para poder mostrar el resultado de la consulta en un ALV. Si solo tienes interes en usar el componente para crear los SELECT_OPTIONS puedes terminar de leer aqui.

Para almacenar los datos que se mostrarán en el ALV, crearemos un nodo en el controlador del componente (Component Controller) que contendrá los campos que deseemos mostrar. Para este ejemplo, realizaremos un informe sobre la tabla de materiales en la que mostraremos el numero de material, la descripción el grupo y el tipo en el idioma de inicio de sesión:

- mara-matnr
- makt-maktx
- t134t-mtbez
- t023t-wgbez

En la vista del controlador ALV asociaremos el nodo creado en nuestro controlador con el nodo DATA que dispone el controlador del ALV. Esto hace que se muestren los datos en la tabla del ALV.

![Alt Mapeo datos ALV](/images/2010/03/alv.png "Mapeo datos ALV")

También deberemos crear los conectores de salida y los de entrada para las diferentes vistas y asociarlos. En la siguiente captura de pantalla se pueden apleciar los diferentes conectores creadoy y su conexión.

![Alt Conectores](/images/2010/03/conectores.png "Conectores")
