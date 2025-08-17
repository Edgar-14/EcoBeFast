# EcoBeFast - Estado actual y siguientes pasos

## Estado actual

- **Autenticación real** implementada para negocios y repartidores usando Firebase Auth.
- **Registro de negocios**: formulario conectado a Firebase Auth y Firestore, guarda datos completos del negocio.
- **Onboarding de repartidores**: formulario multistep con tipado fuerte, registro real en Auth, subida de documentos a Storage y datos a Firestore.
- **Dashboards protegidos**: rutas protegidas para admin, negocio y repartidor, solo accesibles si el usuario está autenticado.
- **Dashboard de admin**: estructura lista y protegida, pendiente de mostrar datos reales de Firestore.
- **Dashboard de repartidor**: estructura lista y protegida, pendiente de mostrar pedidos y estado real.
- **Dashboard de negocio**: pendiente de integración.
- **Scripts backend**: automatización y documentación para Firestore, onboarding y migraciones en `/scripts`.
- **Estilo visual**: UI/UX moderna, coherente, con glass blur, gradientes y componentes reutilizables.

## Qué sigue (próximos pasos sugeridos)

1. **Integrar Firestore en dashboards**
   - Mostrar solicitudes de repartidores pendientes en el dashboard de admin.
   - Mostrar pedidos y estado en dashboard de repartidor y negocio.
2. **Flujo de aprobación/rechazo de solicitudes**
   - Permitir a admin aprobar/rechazar repartidores y negocios desde el dashboard.
3. **Flujo de pedidos**
   - Permitir a negocios crear pedidos y asignarlos a repartidores.
   - Mostrar historial y estado de pedidos.
4. **Notificaciones y correos automáticos**
   - Enviar notificaciones/correos en eventos clave (aprobación, rechazo, nuevo pedido).
5. **Validaciones y feedback visual**
   - Mejorar mensajes de error, validaciones y UX en formularios.
6. **Documentación y pruebas**
   - Documentar flujos clave y agregar ejemplos de uso en el README.

---

**Última actualización:** 17 de agosto de 2025

> Siguiente acción recomendada: Integrar Firestore en los dashboards para mostrar datos en tiempo real y habilitar acciones administrativas.
