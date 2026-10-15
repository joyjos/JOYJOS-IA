# JOYJOS | Software de Gestión, Webs y Automatización para Negocios

![JOYJOS Cover](assets/og_image.png)

**JOYJOS** es una plataforma de servicios especializada en el desarrollo de software de gestión a medida, webs para captación de leads y automatización de procesos para pymes y empresas. Esta landing page ha sido diseñada con un enfoque **premium**, priorizando el rendimiento y la seguridad.

## ✨ Características Principales

- **Diseño Ultra-Premium**: Interfaz moderna con efectos de glassmorphism, micro-animaciones y optimización UX/UI.
- **Rendimiento Optimizado**: Migración total del CDN de Tailwind CSS a estilos compilados localmente para minimizar el tiempo de carga (TTI).
- **SEO Ready**: Estructura semántica, metadatos optimizados y generación automática de sitemap.
- **Responsive Design**: Adaptabilidad total a dispositivos móviles y escritorio.
- **Preparada para agentes de IA**: Publica `llms.txt`, un endpoint Markdown (`/api/markdown`) y metadatos de descubrimiento en `.well-known/` para asistentes y agentes de IA.

## 🛡️ Auditoría de Seguridad y Optimización

Este proyecto ha pasado por una rigurosa auditoría de seguridad, implementando las siguientes mejoras:

- **CSP (Content Security Policy)**: Blindaje total contra ataques XSS mediante la eliminación de scripts inline y la implementación de una política de seguridad estricta.
- **Headers de Seguridad**: Configuración avanzada en `.htaccess` incluyendo HSTS, Referrer-Policy, y Permissions-Policy.
- **Transporte Seguro**: Redirección global forzosa a HTTPS y protección de directorios.
- **Ofuscación de Datos**: Protección de información sensible (como emails) mediante técnicas de renderizado dinámico por JS.

## 🛠️ Tecnologías Utilizadas

- **Frontend**: HTML5, Vanilla JavaScript (ES6+).
- **Styling**: Tailwind CSS 3.4 (Compilado).
- **Servidor**: Configuración Apache optimizada mediante `.htaccess`.
- **Herramientas**: Node.js para scripts de automatización (Sitemap generation).

## 🚀 Instalación y Desarrollo

Si deseas clonar este proyecto y trabajar en él localmente:

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Compilar CSS (Tailwind)**:
   ```bash
   npm run build
   ```

3. **Generar Sitemap**:
   ```bash
   node generate-sitemap-ultimate.js
   ```

## 🧠 Skills de IA

Skills (instrucciones especializadas para asistentes de IA) instaladas en [`.agents/skills/`](.agents/skills). El fichero [`skills-lock.json`](skills-lock.json) registra el origen y la huella de cada una.

| Skill | Qué hace | Origen | Licencia |
|-------|----------|--------|----------|
| `copywriting` | Escribir y mejorar textos de marketing: home, landings y páginas de servicio | [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) | MIT |
| `seo-audit` | Auditar el SEO técnico y on-page del sitio | [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) | MIT |
| `web-design-guidelines` | Revisar la interfaz según las Web Interface Guidelines (accesibilidad y UX) | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) | MIT (según su README) |
| `security-best-practices` | Buenas prácticas de seguridad web: HTTPS, cabeceras, CORS, XSS y CSRF | `supercent-io/skills-template` (repositorio ya no disponible) | No verificable |

Son contenidos de terceros y conservan su licencia original. De `security-best-practices` no se ha podido comprobar la licencia porque su repositorio de origen ya no existe.

<details>
<summary>Licencia MIT de <code>copywriting</code> y <code>seo-audit</code> (© 2025 Corey Haines)</summary>

```text
MIT License

Copyright (c) 2025 Corey Haines

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

</details>

## 📄 Licencia

Este proyecto es propiedad de **JOYJOS**. Todos los derechos reservados, salvo las skills de terceros de `.agents/skills/`, que conservan su licencia original (ver la sección «Skills de IA»).

---
*Desarrollado con ❤️ por JOYJOS.*
