# Documentación Backend BeFast

## Colecciones principales Firestore

- **roles**: Roles del sistema (SUPER_ADMIN, ADMIN, CONTADORA, BUSINESS, DRIVER)
- **admins**: Administradores y contadoras
- **businesses**: Negocios afiliados
- **drivers**: Repartidores activos
- **driverApplications**: Solicitudes de repartidor
- **orders**: Pedidos de entrega
- **creditPurchaseRequests**: Solicitudes de compra de créditos
- **configuration**: Configuración global de la app
- **legalDocuments**: Términos, privacidad, acuerdos
- **auditLogs**: Registro de acciones críticas

## Índices recomendados
- Ver archivo `firestore.indexes.json`

## Reglas de seguridad
- Ver archivo `firestore.rules`

## Scripts útiles
- `seed.ts`: Inicializa roles, admins y datos base
- `setup-initial-data.ts`: Configuración global y parámetros
- `seed-legal-documents.ts`: Documentos legales
- `send-admin-welcome.ts`: Envío de correos automáticos
- `migrate-drivers.ts`: Migración de repartidores

## Automatización
- Usa estos scripts para poblar, migrar y mantener la base de datos y flujos automáticos.

---

> **Recuerda:** Personaliza los datos y credenciales antes de ejecutar en producción.
