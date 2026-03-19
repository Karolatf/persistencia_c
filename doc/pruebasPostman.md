# Pruebas de validacion 

-Aprendiz: Karol Torres

-Fecha: 19/03/2026

-Herramienta usada: Postman

-Servidor: Node.js corriendo en http://localhost:3000


## Fase 1 - Verificacion del servidor

Se inicio el servidor con npm run dev y se confirmo que respondia correctamente.

Peticion: GET http://localhost:3000/

Resultado: 200 OK

Respuesta recibida:
```
{
  "success": true,
  "message": "Saludo de la API",
  "data": [],
  "errors": []
}
```

El servidor estaba encendido y respondiendo antes de iniciar las pruebas del taller.


## Fase 2 - CRUD de Categorias

Se verifico que los cuatro archivos nuevos de la entidad Categorias funcionaban correctamente: categories.data.js, category.model.js, category.controller.js y category.routes.js.


### GET todas las categorias

Peticion: GET http://localhost:3000/categories

Resultado: 200 OK

Se recibieron las 5 categorias creadas en la capa de datos: Laptops, Perifericos, Componentes, Accesorios y Mobiliario. Cada una con su id y name correspondiente.


### GET categoria por ID

Peticion: GET http://localhost:3000/categories/1

Resultado: 200 OK

Respuesta recibida:
```
{
  "success": true,
  "message": "Categoria encontrada correctamente",
  "data": { "id": 1, "name": "Laptops" },
  "errors": []
}
```


### POST crear nueva categoria

Peticion: POST http://localhost:3000/categories

Body enviado:
```
{
  "name": "Redes"
}
```

Resultado: 201 Created

La categoria fue creada con id 6 de forma automatica. Se confirmo que la validacion funciona: cuando se envia el POST sin body, el servidor responde 400 Bad Request con el mensaje "El nombre de la categoria es obligatorio".


### PUT actualizar categoria

Peticion: PUT http://localhost:3000/categories/3

Body enviado:
```
{
  "name": "Componentes PC"
}
```

Resultado: 200 OK

La categoria con id 3 fue actualizada correctamente. El servidor retorno el objeto con el nombre modificado.


## Fase 3 - Vinculacion de Productos

Se verifico que los productos incluyen la propiedad category_id.

Peticion: GET http://localhost:3000/products

Resultado: 200 OK

Se recibieron los 20 productos. Cada uno tiene el campo category_id apuntando a una de las 5 categorias existentes. Por ejemplo el producto "Laptop Pro 15" tiene category_id 1 que corresponde a Laptops, y "Mouse Inalambrico" tiene category_id 2 que corresponde a Perifericos.


## Fase 4 - Regla de Integridad al Eliminar

Esta fue la prueba mas importante del taller. Se valido que no se puede eliminar una categoria que tiene productos vinculados.


### DELETE categoria CON productos vinculados

Peticion: DELETE http://localhost:3000/categories/1

Resultado: 409 Conflict

Respuesta recibida:
```
{
  "success": false,
  "message": "No se puede eliminar la categoria porque tiene recursos vinculados",
  "data": [],
  "errors": []
}
```

La categoria 1 (Laptops) no fue eliminada porque tiene el producto "Laptop Pro 15" vinculado. El servidor rechazo la operacion correctamente con codigo 409 Conflict tal como lo pide el instructor.


### DELETE categoria SIN productos vinculados

Peticion: DELETE http://localhost:3000/categories/6

Resultado: 200 OK

Respuesta recibida:
```
{
  "success": true,
  "message": "Categoria eliminada correctamente",
  "data": [],
  "errors": []
}
```

La categoria 6 (Redes) fue eliminada sin problema porque no tenia ningun producto vinculado. Se confirmo tambien que al intentar eliminarla de nuevo el servidor responde 404 Not Found porque ya no existe.


## Conclusion

Todas las fases del taller fueron completadas y probadas:

El CRUD de categorias funciona al 100% con los cinco endpoints respondiendo correctamente.

Los productos incluyen la propiedad category_id vinculada a las categorias creadas.

Todas las respuestas siguen el formato estandarizado con success, message, data y errors.

La regla de integridad funciona correctamente: el servidor impide borrar una categoria con productos vinculados respondiendo 409 Conflict, y permite borrar una categoria vacia respondiendo 200 OK.

El codigo esta organizado en las 4 capas: data, models, controllers y routes.