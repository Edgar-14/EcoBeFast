# EcoBeFast Production Deployment Guide

Esta guía te ayudará a desplegar la aplicación EcoBeFast a producción de manera segura y eficiente.

## 📋 Pre-requisitos

### 1. Herramientas Necesarias
- Node.js 18+ 
- Firebase CLI (`npm install -g firebase-tools`)
- Git
- Acceso a todas las cuentas de servicios externos

### 2. Cuentas y Servicios Requeridos
- **Firebase**: Proyecto configurado con Authentication, Firestore, Functions, Hosting
- **Google Cloud Platform**: Para Firebase Functions y APIs
- **Stripe**: Cuenta de producción con claves API
- **Google Maps**: API key con límites de producción
- **Gmail**: Cuenta empresarial para envío de emails
- **Google Drive**: Para almacenamiento de reportes (opcional)

## 🚀 Proceso de Despliegue

### Paso 1: Configuración de Entorno

1. **Copia el archivo de configuración:**
   ```bash
   cp .env.production.example .env.production
   ```

2. **Configura todas las variables de entorno:**
   - Firebase: API keys, project ID, etc.
   - Stripe: Claves de producción (pk_live_ y sk_live_)
   - Google Maps: API key con restricciones apropiadas
   - Gmail: Credenciales de cuenta empresarial
   - Otros servicios según sea necesario

### Paso 2: Configuración de Firebase

1. **Instala Firebase CLI y autentícate:**
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. **Selecciona el proyecto de producción:**
   ```bash
   firebase use --add
   # Selecciona el proyecto de producción
   ```

3. **Configura las variables de entorno en Firebase Functions:**
   ```bash
   firebase functions:config:set \
     gmail.user="soporte@befastapp.com.mx" \
     gmail.password="tu_app_password" \
     stripe.secret_key="sk_live_..." \
     stripe.webhook_secret="whsec_..." \
     app.url="https://tu-dominio.com"
   ```

### Paso 3: Configuración de Seguridad

1. **Revisa las reglas de Firestore:**
   - Verifica que las reglas en `firestore.rules` sean apropiadas para producción
   - Las reglas deben denegar acceso por defecto y solo permitir operaciones autorizadas

2. **Configura CORS y restricciones de API:**
   - Google Maps API: Restringe por dominio
   - Firebase: Configura dominios autorizados
   - Stripe: Configura webhooks para tu dominio

### Paso 4: Despliegue

1. **Ejecuta las pruebas:**
   ```bash
   npm run lint
   npm run build
   ```

2. **Ejecuta el script de despliegue:**
   ```bash
   npm run deploy:production
   ```

   O manualmente:
   ```bash
   ./deploy.sh
   ```

### Paso 5: Verificación Post-Despliegue

1. **Ejecuta las pruebas de smoke:**
   ```bash
   npm run test:production
   ```

2. **Verifica manualmente:**
   - [ ] Página principal carga correctamente
   - [ ] Login de admin funciona
   - [ ] Login de negocios funciona
   - [ ] Login de repartidores funciona
   - [ ] Creación de órdenes con geolocalización
   - [ ] Procesamiento de pagos con Stripe
   - [ ] Envío de emails de notificación

## 🔧 Configuración Adicional

### Configuración de Dominio Personalizado

1. **En Firebase Console:**
   - Ve a Hosting
   - Agrega dominio personalizado
   - Sigue las instrucciones para verificar el dominio

2. **Configura SSL:**
   - Firebase automáticamente proveerá certificados SSL
   - Verifica que HTTPS esté funcionando

### Configuración de Monitoreo

1. **Firebase Performance Monitoring:**
   ```bash
   firebase deploy --only hosting,functions
   ```

2. **Error Tracking (opcional):**
   - Configura Sentry u otra herramienta de error tracking
   - Agrega la configuración a las variables de entorno

### Configuración de Backups

1. **Backup de Firestore:**
   - Configura backups automáticos en Google Cloud Console
   - Programa backups diarios

2. **Backup de configuración:**
   - Guarda todas las variables de entorno de forma segura
   - Documenta todas las configuraciones de servicios externos

## 📊 Monitoreo y Mantenimiento

### Métricas Importantes a Monitorear

1. **Firebase Functions:**
   - Tiempo de ejecución
   - Errores y excepciones
   - Uso de memoria

2. **Firestore:**
   - Lecturas/escrituras por día
   - Costos
   - Performance de queries

3. **Aplicación Web:**
   - Tiempo de carga
   - Errores JavaScript
   - Uso por parte de usuarios

### Logs y Debugging

1. **Ver logs de Functions:**
   ```bash
   firebase functions:log
   ```

2. **Ver logs específicos:**
   ```bash
   firebase functions:log --only createOrderWithCredits
   ```

### Actualizaciones

1. **Para actualizaciones menores:**
   ```bash
   git pull origin main
   npm run deploy:production
   ```

2. **Para actualizaciones mayores:**
   - Sigue el proceso completo de testing
   - Considera desplegar a staging primero
   - Ejecuta todas las pruebas antes del despliegue

## 🚨 Troubleshooting

### Problemas Comunes

1. **Error de autenticación:**
   - Verifica que `firebase login` esté activo
   - Confirma permisos en el proyecto de Firebase

2. **Error de variables de entorno:**
   - Verifica que todas las variables estén configuradas
   - Usa `firebase functions:config:get` para verificar

3. **Error de CORS:**
   - Verifica configuración de dominios en Firebase Console
   - Revisa configuración de Google Maps API

4. **Error de Stripe:**
   - Confirma que estés usando claves de producción
   - Verifica que los webhooks estén configurados correctamente

### Contactos de Emergencia

- **Administrador de Sistema**: [email]
- **Desarrollador Principal**: [email]
- **Soporte Firebase**: [enlace al soporte]
- **Soporte Stripe**: [enlace al soporte]

## 📝 Checklist de Despliegue

### Antes del Despliegue
- [ ] Todas las variables de entorno configuradas
- [ ] Tests pasando localmente
- [ ] Backup de configuración actual realizado
- [ ] Revisión de código completada
- [ ] Reglas de seguridad revisadas

### Durante el Despliegue
- [ ] Deploy script ejecutado sin errores
- [ ] Functions desplegadas correctamente
- [ ] Frontend desplegado correctamente
- [ ] Reglas de Firestore actualizadas

### Después del Despliegue
- [ ] Smoke tests pasando
- [ ] Verificación manual completada
- [ ] Monitoreo activado
- [ ] Documentación actualizada
- [ ] Equipo notificado del despliegue exitoso

## 🔗 Enlaces Útiles

- [Firebase Console](https://console.firebase.google.com)
- [Google Cloud Console](https://console.cloud.google.com)
- [Stripe Dashboard](https://dashboard.stripe.com)
- [Google Maps Console](https://console.developers.google.com)
- [Documentación de Firebase](https://firebase.google.com/docs)

---

**Nota**: Esta guía debe ser actualizada cuando se agreguen nuevas funcionalidades o cambien las configuraciones de producción.