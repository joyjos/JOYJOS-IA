# 🤖 Guía para Agentes de IA (AGENTS.md)

Este documento contiene las especificaciones técnicas, convenciones de diseño y reglas de desarrollo que los agentes de IA deben seguir al realizar modificaciones en este repositorio.

---

## 1. Descripción del Proyecto y Propósito

**JOYJOS** es una plataforma de servicios/landing page premium orientada a la venta de servicios de automatización de procesos e Inteligencia Artificial para pymes y negocios digitales. 
- **Propósito**: Captar clientes interesados en automatizaciones, chatbots e integración de IA, transmitiendo una imagen premium, segura, profesional y transparente.
- **Enfoque**: Sitios ultra-rápidos, optimizados para SEO y con un estándar estricto de seguridad de la información.

---

## 2. Stack Tecnológico y Versiones

El proyecto es un sitio estático minimalista optimizado para evitar sobrecarga y dependencias innecesarias:
- **Core**: HTML5 semántico, Vanilla JavaScript (ES6+).
- **Styling**: [Tailwind CSS v3.4.19](https://tailwindcss.com/) (compilado localmente).
- **Servidor / Hosting**: Apache (`.htaccess`) y Vercel (`vercel.json`).
- **Automatización**: Node.js para tareas de compilación y generación de sitemaps.

---

## 3. Estructura de Directorios Explicada

```text
JOYJOS/
├── .agents/                        # Habilidades (skills) personalizadas para agentes de IA
├── assets/                         # Assets estáticos y código compilado
│   ├── favicon.ico / .png          # Iconografía oficial
│   ├── hero-canvas.js              # Animación interactiva de fondo del Hero
│   ├── main.js                     # Lógica principal (cookies, GA, scroll, menú, obfuscación)
│   ├── style.css                   # CSS compilado y minificado de Tailwind (NO EDITAR DIRECTAMENTE)
│   └── (imágenes/vectores)         # logotipos, isotipos y fotos optimizadas
├── stitch/                         # Referencias y capturas de diseño de la interfaz
├── index.html                      # Landing page principal
├── 404.html                        # Página de error 404 personalizada y con micro-interacciones
├── aviso-legal.html                # Página legal de aviso de responsabilidad
├── cookies.html                    # Página informativa de cookies
├── privacidad.html                 # Página informativa de privacidad de datos
├── terminos.html                   # Página de términos y condiciones de servicio
├── input.css                       # Archivo fuente de estilos (Tailwind directives + clases custom)
├── tailwind.config.js              # Configuración y extensión del tema de Tailwind
├── generate-sitemap-ultimate.js    # Script de Node.js para generación automática de sitemap.xml
├── sitemap.xml                     # Sitemap de producción para indexación en buscadores
├── robots.txt                      # Directivas de rastreo para bots de búsqueda
├── llms.txt                        # Información resumida del negocio optimizada para LLMs y asistentes
├── vercel.json                     # Configuración de headers de seguridad y enrutamiento en Vercel
├── .htaccess                       # Configuración de seguridad, caché y redirecciones para Apache
├── package.json                    # Dependencias de desarrollo y scripts de NPM
└── README.md                       # Documentación general del proyecto
```

---

## 4. Comandos de Instalación, Desarrollo y Build

Para trabajar localmente en el proyecto, utiliza los siguientes comandos:

*   **Instalación de dependencias (sólo para desarrollo):**
    ```bash
    npm install
    ```
*   **Compilar Tailwind CSS (Producción - Minificado):**
    ```bash
    npm run build
    ```
    *Nota: Esto lee [input.css](file:///c:/www/Antygravity/JOYJOS/input.css) y escribe el compilado en [assets/style.css](file:///c:/www/Antygravity/JOYJOS/assets/style.css).*
*   **Generar el Mapa del Sitio (Sitemap):**
    ```bash
    node generate-sitemap-ultimate.js
    ```
*   **Servidor de desarrollo local:**
    Al tratarse de una web estática, puedes abrir `index.html` usando extensiones como *Live Server* en VSCode o cualquier servidor HTTP estático simple (ej. `npx serve .`).

> [!WARNING]  
> Recuerda las directrices globales: **Nunca ejecutes una compilación (build) automáticamente después de tus cambios** a menos que el usuario lo solicite explícitamente.

---

## 5. Convenciones de Código y Estilo

### HTML / Estructura Semántica
- Todo nuevo elemento o sección debe hacer uso de etiquetas de **HTML5 semántico** (`<header>`, `<main>`, `<section>`, `<article>`, `<footer>`).
- Cada página debe contener un único encabezado principal `<h1>` estructurado correctamente.
- Todos los elementos interactivos o secciones principales deben contar con un `id` único y descriptivo para tests y analítica.

### CSS y Tailwind
- **NO modifiques** [assets/style.css](file:///c:/www/Antygravity/JOYJOS/assets/style.css) directamente. Es el archivo de salida compilado.
- Cualquier adición o modificación de estilos personalizados debe hacerse en [input.css](file:///c:/www/Antygravity/JOYJOS/input.css) o mediante clases utilitarias de Tailwind en el HTML.
- El diseño utiliza fuentes de Google Fonts (**Inter** para cuerpo y **Outfit** para títulos). Respeta las clases de familia de Tailwind correspondientes (`font-sans` y `font-display`).
- El modo oscuro está configurado mediante la estrategia de clase (`darkMode: 'class'`).

### JavaScript (Vanilla ES6)
- Todo script o manipulación del DOM se realiza desde [assets/main.js](file:///c:/www/Antygravity/JOYJOS/assets/main.js) (o archivos específicos como `hero-canvas.js` para el canvas interactivo).
- **Prohibido el uso de scripts inline** en los archivos `.html` para cumplir con las políticas CSP de seguridad. Todo JS debe ser externo y cargarse de manera asíncrona (`defer`).

---

## 6. Variables de Entorno

Este proyecto es una aplicación **estática del lado del cliente** (Client-side static website).
- **No requiere variables de entorno** en local ni en producción.
- Toda integración externa (Google Analytics, link de WhatsApp, emails) está parametrizada directamente en los scripts estáticos o configuraciones de servidor.

---

## 7. Notas de Arquitectura Importantes

- **Seguridad Rigurosa (Content Security Policy)**: El proyecto cuenta con un blindaje estricto contra ataques de inyección (XSS) y Clickjacking. Las directivas CSP están definidas tanto en [.htaccess](file:///c:/www/Antygravity/JOYJOS/.htaccess) (para Apache) como en [vercel.json](file:///c:/www/Antygravity/JOYJOS/vercel.json) (para Vercel).
- **Políticas de Seguridad Habilitadas**:
  - `Strict-Transport-Security` (HSTS)
  - `X-Frame-Options` (`SAMEORIGIN` / `none`)
  - `X-Content-Type-Options` (`nosniff`)
  - `Referrer-Policy` (`strict-origin-when-cross-origin`)
  - `Permissions-Policy` (deshabilita cámara, geolocalización, micrófono)
- **Ofuscación de Datos**: Para evitar el spam por bots que rastrean el código fuente, la dirección de correo electrónico de contacto (`hola@joyjos.eu`) no debe escribirse directamente en texto plano en el HTML de contacto. Debe cargarse dinámicamente mediante JS usando el atributo `data-email-link`.

---

## 8. Lo que NO se debe tocar o cambiar (Líneas Rojas)

- **Directivas CSP**: No rebajes las políticas de Content Security Policy en `vercel.json` o `.htaccess` sin un análisis exhaustivo y la aprobación expresa del arquitecto.
- **Scripts inline**: No agregues etiquetas `<script>...código...</script>` dentro de los HTML. De lo contrario, la página fallará al cargar debido a las restricciones de CSP.
- **Obfuscación del Email**: No elimines la lógica de JavaScript en `main.js` que reconstruye las direcciones de email dinámicamente.
- **assets/style.css**: Nunca edites este archivo a mano, ya que cualquier ejecución futura de `npm run build` sobrescribirá tus cambios por completo.
- **Directivas Apache / Vercel**: No quites ni modifiques las cabeceras de seguridad sin validar antes la integridad de la auditoría de seguridad del sitio.
