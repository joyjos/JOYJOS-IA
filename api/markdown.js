const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  try {
    const llmsPath = path.join(process.cwd(), 'llms.txt');
    const content = fs.readFileSync(llmsPath, 'utf8');

    res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
    res.setHeader('x-markdown-tokens', '1500');
    res.setHeader('Vary', 'Accept');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');

    res.status(200).send(content);
  } catch (error) {
    res.status(500).setHeader('Content-Type', 'text/markdown; charset=utf-8');
    res.send('# Error: Unable to serve markdown representation\n');
  }
};
