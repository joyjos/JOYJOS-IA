const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://joyjos.eu';
const SITE_DIR = path.join(__dirname);
const MAIN_PAGE = 'index.html';

// Carpetas a ignorar
const IGNORED_DIRS = ['.agents', 'stitch', 'node_modules', '.git', 'dist', 'build'];

// Posibles nombres de imagen OG
const OG_CANDIDATES = ['og_image.png', 'og.png', 'cover.jpg'];

// Funciones de prioridad y frecuencia
const getPriority = (file) => {
  if (file === MAIN_PAGE) return 1.0;
  if (file.includes('privacidad') || file.includes('terminos')) return 0.5;
  if (file.includes('cookies') || file.includes('aviso-legal')) return 0.4;
  return 0.6;
};

const getChangeFreq = (file) => {
  if (file === MAIN_PAGE) return 'weekly';
  return 'monthly';
};

// Buscar imagen OG
const findOgImage = (relativeFilePath) => {
  const dir = path.dirname(relativeFilePath);

  // 1️⃣ Buscar en la misma carpeta
  for (let img of OG_CANDIDATES) {
    const localPath = path.join(SITE_DIR, dir, img);
    if (fs.existsSync(localPath)) {
      return path.join(dir, img).replace(/\\/g, '/');
    }
  }

  // 2️⃣ Buscar en raíz
  for (let img of OG_CANDIDATES) {
    const rootPath = path.join(SITE_DIR, img);
    if (fs.existsSync(rootPath)) {
      return img;
    }
  }

  // 3️⃣ Buscar en /assets
  for (let img of OG_CANDIDATES) {
    const assetsPath = path.join(SITE_DIR, 'assets', img);
    if (fs.existsSync(assetsPath)) {
      return `assets/${img}`;
    }
  }

  return null;
};

// Escanear todas las carpetas recursivamente
function getHtmlFiles(dir, parent = '') {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach(file => {
    if (IGNORED_DIRS.includes(file)) return;

    const fullPath = path.join(dir, file);
    const relativePath = parent ? `${parent}/${file}` : file;
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      results = results.concat(getHtmlFiles(fullPath, relativePath));
    } else if (file.endsWith('.html')) {
      results.push(relativePath);
    }
  });

  return results;
}

// Detectar páginas con <meta name="robots" content="noindex">
const isNoindex = (relativeFile) => {
  const html = fs.readFileSync(path.join(SITE_DIR, relativeFile), 'utf8');
  return (html.match(/<meta\b[^>]*>/gi) || []).some(
    tag => /name=["']robots["']/i.test(tag) && /noindex/i.test(tag)
  );
};

// Obtener todas las páginas HTML
const htmlFiles = getHtmlFiles(SITE_DIR);

// Fecha actual
const now = new Date().toISOString().split('T')[0];

// Construcción del XML
let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n\n`;

htmlFiles.forEach(file => {
  // ❌ Ignorar error404.html
  if (file.toLowerCase().includes('404')) return;

  // ❌ Ignorar páginas noindex (no deben figurar en el sitemap)
  if (isNoindex(file)) return;

  const urlPath = file === MAIN_PAGE ? '' : file.replace(/\\/g, '/');

  xml += `  <url>\n`;
  xml += `    <loc>${BASE_URL}/${urlPath}</loc>\n`;
  xml += `    <lastmod>${now}</lastmod>\n`;
  xml += `    <changefreq>${getChangeFreq(file)}</changefreq>\n`;
  xml += `    <priority>${getPriority(file)}</priority>\n`;

  // 🌟 Solo generar OG image en index.html
  if (file === MAIN_PAGE) {
    const ogImage = findOgImage(file);
    if (ogImage) {
      xml += `    <image:image>\n`;
      xml += `      <image:loc>${BASE_URL}/${ogImage}</image:loc>\n`;
      xml += `      <image:caption>JOYJOS - Software de gestión, webs y automatización para tu negocio</image:caption>\n`;
      xml += `      <image:title>JOYJOS</image:title>\n`;
      xml += `    </image:image>\n`;
    }
  }

  xml += `  </url>\n\n`;
});

xml += `</urlset>`;

// Guardar sitemap.xml
fs.writeFileSync(path.join(SITE_DIR, 'sitemap.xml'), xml);

console.log('🔥 sitemap.xml generado correctamente (ULTIMATE)');