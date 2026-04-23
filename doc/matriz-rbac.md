# Matriz RBAC — Sistema de Inventario

**Proyecto:** API de Gestión de Inventario — SENA  
**Guía:** Módulo de Autorización RBAC

---

## Roles del Sistema

| Rol | Descripción |
|:----|:------------|
| `admin` | Acceso completo. Puede crear, leer, actualizar y eliminar cualquier recurso. |
| `user` | Acceso de solo lectura. Solo puede consultar productos y categorías. |

---

## Matriz de Permisos

| Permiso Atómico | admin | user | Descripción |
|:----------------|:-----:|:----:|:------------|
| `products.read` | ✅ | ✅ | Ver lista de productos y detalle por ID |
| `products.create` | ✅ | ❌ | Crear un producto nuevo |
| `products.update` | ✅ | ❌ | Actualizar un producto existente |
| `products.delete` | ✅ | ❌ | Eliminar un producto permanentemente |
| `categories.read` | ✅ | ✅ | Ver lista de categorías y sus productos |
| `categories.create` | ✅ | ❌ | Crear una categoría nueva |
| `categories.update` | ✅ | ❌ | Actualizar una categoría existente |
| `categories.delete` | ✅ | ❌ | Eliminar una categoría (sin productos vinculados) |

---

## Decisiones de Arquitectura

### Por qué los permisos NO están en el token JWT
Si los permisos se guardaran en el token y se le revocan a un usuario,
el usuario seguiría teniendo acceso hasta que el token expire (hasta 1 hora después).
Al consultar la base de datos en tiempo real en cada petición,
el cambio de permisos es efectivo de forma inmediata.

### Por qué se usa `.some()` para validar
Un usuario puede tener múltiples roles simultáneamente.
El criterio correcto es: si **al menos uno** de sus roles tiene el permiso requerido,
se permite el acceso. `.some()` implementa exactamente esa lógica.

### Diferencia entre 401 y 403
- **401 Unauthorized**: el usuario no está autenticado (falta o es inválido el token).
- **403 Forbidden**: el usuario está autenticado pero no tiene los privilegios necesarios.