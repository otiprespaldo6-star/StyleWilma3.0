# Styled By Wilma v3.0 — PWA de Colorimetría Personal & Asesoría de Imagen

Aplicación web progresiva (PWA) de asesoría de imagen y colorimetría personal para mujeres de todas las edades (18 a 75+ años) con personalización por grupos etarios, sistema Style DNA de 7 dimensiones y panel Superadministrador avanzado de 15 secciones.

Desarrollada para el atelier digital de **Wilma Hernández** en Concepción, Región del Biobío, Chile.

---

## 🎯 Premisa Fundamental

> *"No creamos una app que solo analiza cómo te ves. Creamos una app que aprende quién eres para ayudarte a vestir."*

Styled By Wilma aprende las 7 dimensiones de tu estilo:
- **Color DNA:** Subtono, 12 estaciones, contrastes, metales ideales y neutros.
- **Body DNA:** Silueta, proporciones y caídas óptimas.
- **Style DNA:** Arquetipos de personalidad (Clásico, Elegante, Natural, Romántico, etc.).
- **Lifestyle DNA:** Actividad laboral, rutina social y clima oceánico templado (Biobío/Concepción).
- **Comfort DNA:** Tolerancia a tacones, tejidos hipoalergénicos y elasticidad.
- **Shopping DNA:** Hábitos de compra y presupuesto inteligente.
- **Wardrobe DNA:** Organización del clóset y armario cápsula.

---

## 👤 Personalización por 6 Grupos de Edad

1. **Joven (18-25 años):** Tendencias dinámicas, presupuestos accesibles y estilo para redes.
2. **Adulta Joven (26-35 años):** Modernidad, balance entre vida laboral y personal, looks híbridos.
3. **Adulta (36-45 años):** Liderazgo, presencia ejecutiva, calidad sobre cantidad y cortes nobles.
4. **Madura (46-55 años):** Elegancia natural, confort refinado y luz rejuvenecedora para la tez.
5. **Senior (56-65 años):** Estilo atemporal, fibras naturales suaves y distinción auténtica.
6. **Golden (66+ años):** Elegancia clásica, calidez, accesibilidad visual (fuentes y botones ampliados).

---

## 👑 Acceso Superadministradora (15 Módulos)

El panel superadmin dispone de 3 métodos de acceso:
1. **Ruta / Selector:** Botón Superadmin en el encabezado.
2. **Credenciales Máster:**
   - **Usuario:** `MASTER` o `wilma.hernandez@styledbywilma.com`
   - **Contraseña:** `xyz19881988`
3. **Gesto secreto:** Toca el logo de la aplicación 5 veces consecutivas para abrir el panel de control.

### Módulos del Superadmin:
1. **Dashboard:** KPIs en tiempo real (visitas, usuarios, ingresos, tokens Gemini AI, CPU/RAM).
2. **Visitas:** Registro con IP anonimizada, país, ciudad, hora, fecha, duración, página, navegador, SO, filtros avanzados y exportación a Excel / PDF.
3. **Guía y Manual:** 11 capítulos completos paso a paso, descargables en PDF (con portada y maquetación editorial) y Word (.doc).
4. **Apariencia:** Editor en vivo con split-screen para logos, header, colores pastel (--color-primary, etc.), tipografías y botones.
5. **Redes Sociales y WhatsApp:** 8 campos en blanco editables (Instagram, TikTok, etc.) y botón flotante de WhatsApp configurable (número, mensaje, horario, posición y color).
6. **Seguridad y Registro:** 30+ opciones configurables (Google, Facebook, Email, longitud de clave, bloqueo, periodo de gracia de 30 días, etc.).
7. **Gestión de Usuarios:** Listado con edad, grupos, roles, suspensión y cierre de cuenta tipo Facebook.
8. **Gestión de Planes:** CRUD de planes Free, VIP Mensual ($4.99) y VIP Anual ($39.99).
9. **Base de Datos D1:** Explorador de tablas Cloudflare D1 y consola interactiva de consultas SQL.
10. **Backup y Restauración:** Respaldos tipo WhatsApp cifrados descargables en JSON e importables en cualquier dispositivo.
11. **Monitoreo:** Telemetría de servidores, Cloudflare D1/R2, Gemini 2.5 Flash y Firebase Auth.
12. **API Keys:** Control de consumo de tokens y avisos de expiración preventiva.
13. **Roles y Permisos:** Matriz RBAC con permisos granulares (Master, Admin, Editor, Usuaria).
14. **Alertas:** Avisos de umbral de 15 días antes del vencimiento de suscripciones de pago.
15. **Descargas:** Centro de exportación de manuales (PDF/Word), schema.sql y reportes.

---

## 🛠️ Tecnologías Utilizadas

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide Icons.
- **Exportaciones:** jsPDF (PDFs editoriales), XLSX (planillas de Excel).
- **Backend & Almacenamiento:** Cloudflare D1 (SQL), Cloudflare R2 (fotos), Cloudflare KV (sesiones y caché).
- **Motor de IA:** Google Gemini 2.5 Flash Vision para clasificación cromática y generación de outfits.
- **PWA:** Vite PWA Plugin, Service Worker con auto-actualización y manifiesto para instalación nativa.

---

## 🚀 Despliegue en Cloudflare (D1 + R2 + Pages)

```bash
# 1. Login en Cloudflare
wrangler login

# 2. Crear base de datos D1
wrangler d1 create styled-by-wilma-db

# 3. Aplicar esquema SQL
wrangler d1 execute styled-by-wilma-db --file=./schema.sql

# 4. Crear bucket R2 para imágenes
wrangler r2 bucket create styled-by-wilma-storage

# 5. Compilar y desplegar
npm run build
wrangler pages deploy dist --project-name=styled-by-wilma
```

---

© 2026 Styled By Wilma Hernández. Concepción, Región del Biobío, Chile.
