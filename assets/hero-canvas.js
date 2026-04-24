/**
 * JOYJOS Hero Canvas — Neural Network / Data Flow Animation
 * 
 * Optimized Premium Version:
 * - Pre-rendered Glow: Nodes are drawn once and cached for speed.
 * - S-Curve Connections: Restored the organic wave movement.
 * - Intersection Observer: Zero CPU usage when out of view.
 */
;(function () {
  'use strict';

  // ── Configuration ──────────────────────────────────────────
  const CONFIG = {
    // Density & Count
    nodeDensity: 0.8,      
    maxNodes: 120,         
    minNodes: 30,

    // Node appearance
    nodeMinRadius: 1.5,
    nodeMaxRadius: 4.5,
    nodeGlowSize: 20,
    nodeBaseAlpha: 0.8,

    // Connections
    connectionDistance: 220,
    maxConnectionsPerNode: 4,
    connectionLineWidth: 0.7,

    // Particles
    particleCount: 60,
    particleMinRadius: 1,
    particleMaxRadius: 2.5,
    particleMinSpeed: 0.05,
    particleMaxSpeed: 0.2,

    // Movement
    nodeSpeed: 0.15,       // Slow but steady
    nodeDrift: 0.0001,
    nodeFriction: 0.98,   
    maxVelocity: 3.5,      

    // Mouse Interaction
    mouseRepelRadius: 200, 
    mouseForce: 0.1,       
    mouseConnectRadius: 350, 
    mouseAgitation: 0.25,   // Extra speed when mouse is near

    // Colors
    hueMin: 195,
    hueMax: 210,
    saturation: 90,
    lightnessNode: 75,
    lightnessParticle: 80,
    lightnessLine: 60,
  };

  // ── State ──────────────────────────────────────────────────
  let canvas, ctx;
  let width, height, dpr;
  let nodes = [];
  let particles = [];
  let animationId = null;
  let lastTime = 0;
  let elapsed = 0;
  let isVisible = true;
  let nodeCache = {}; // Cache for pre-rendered nodes

  let mouse = { x: -1000, y: -1000, active: false };

  // ── Utilities ──────────────────────────────────────────────
  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function hsl(h, s, l, a) {
    return 'hsla(' + Math.floor(h) + ',' + s + '%,' + l + '%,' + a.toFixed(2) + ')';
  }

  // ── Pre-rendering ──────────────────────────────────────────
  function preRenderNode(hue) {
    const size = (CONFIG.nodeMaxRadius + CONFIG.nodeGlowSize) * 2 * dpr;
    const cacheCanvas = document.createElement('canvas');
    cacheCanvas.width = size;
    cacheCanvas.height = size;
    const cctx = cacheCanvas.getContext('2d');
    
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = CONFIG.nodeMaxRadius * dpr;
    const glow = CONFIG.nodeGlowSize * dpr;

    // Glow
    const gradient = cctx.createRadialGradient(centerX, centerY, radius, centerX, centerY, radius + glow);
    gradient.addColorStop(0, hsl(hue, CONFIG.saturation, CONFIG.lightnessNode, 0.3));
    gradient.addColorStop(1, hsl(hue, CONFIG.saturation, CONFIG.lightnessNode, 0));
    
    cctx.fillStyle = gradient;
    cctx.beginPath();
    cctx.arc(centerX, centerY, radius + glow, 0, Math.PI * 2);
    cctx.fill();

    // Core
    cctx.fillStyle = hsl(hue, CONFIG.saturation, CONFIG.lightnessNode, 1);
    cctx.beginPath();
    cctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    cctx.fill();

    return cacheCanvas;
  }

  function getCachedNode(hue) {
    const h = Math.floor(hue);
    if (!nodeCache[h]) nodeCache[h] = preRenderNode(h);
    return nodeCache[h];
  }

  // ── Node & Particle ────────────────────────────────────────
  function createNode() {
    const r = rand(CONFIG.nodeMinRadius, CONFIG.nodeMaxRadius);
    const h = rand(CONFIG.hueMin, CONFIG.hueMax);
    return {
      x: rand(0, width),
      y: rand(0, height),
      radius: r,
      baseRadius: r,
      vx: 0, 
      vy: 0,
      speed: CONFIG.nodeSpeed,
      angle: rand(0, Math.PI * 2),
      hue: h,
      phase: rand(0, Math.PI * 2),
      pulseSpeed: rand(0.005, 0.015),
    };
  }

  function createParticle() {
    return {
      x: rand(0, width),
      y: rand(0, height),
      radius: rand(CONFIG.particleMinRadius, CONFIG.particleMaxRadius),
      speed: rand(CONFIG.particleMinSpeed, CONFIG.particleMaxSpeed),
      angle: rand(0, Math.PI * 2),
      hue: rand(190, 220),
      alpha: rand(0.3, 0.7),
      drift: rand(-0.004, 0.004),
      life: rand(0, 1),
      lifeSpeed: rand(0.002, 0.006),
    };
  }

  // ── Init ───────────────────────────────────────────────────
  function init() {
    canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    ctx = canvas.getContext('2d', { alpha: true });
    resize();

    populateNodes();
    populateParticles();

    setupInteractions();
    setupVisibility();

    lastTime = performance.now();
    startLoop();
  }

  function setupInteractions() {
    window.addEventListener('resize', debounce(onResize, 300));
    window.addEventListener('mousemove', (e) => {
      if (!isVisible) return;
      const rect = canvas.getBoundingClientRect();
      
      // Strict bounds check for both X and Y
      if (e.clientX >= rect.left && e.clientX <= rect.right &&
          e.clientY >= rect.top && e.clientY <= rect.bottom) {
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.active = true;
      } else {
        mouse.active = false;
      }
    });
    document.addEventListener('mouseleave', () => {
      mouse.active = false;
    });
  }

  function setupVisibility() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopLoop();
      else startLoop();
    });

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isVisible = entry.isIntersecting;
          if (isVisible) startLoop();
          else stopLoop();
        });
      }, { threshold: 0.01 });
      observer.observe(canvas);
    }
  }

  function populateNodes() {
    const area = width * height;
    let count = Math.floor(area / 100000 * CONFIG.nodeDensity);
    if (width < 768) count = Math.floor(count * 0.5);
    count = Math.max(CONFIG.minNodes, Math.min(CONFIG.maxNodes, count));
    nodes = Array.from({ length: count }, createNode);
    nodeCache = {}; // Clear cache on resize
  }

  function populateParticles() {
    let count = CONFIG.particleCount;
    if (width < 768) count = Math.floor(count * 0.5);
    particles = Array.from({ length: count }, createParticle);
  }

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);
  }

  function onResize() {
    resize();
    populateNodes();
    populateParticles();
  }

  function startLoop() {
    if (!animationId && !document.hidden && isVisible) {
      lastTime = performance.now();
      animationId = requestAnimationFrame(loop);
    }
  }

  function stopLoop() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }

  // ── Update ─────────────────────────────────────────────────
  function update(dt) {
    elapsed += dt;
    const repelRadiusSq = CONFIG.mouseRepelRadius * CONFIG.mouseRepelRadius;

    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      
      // Movement: Constant travel with slow rotation
      n.angle += (Math.sin(elapsed * CONFIG.nodeDrift + n.phase) * 0.002);
      
      // Base velocity from angle
      let targetVx = Math.cos(n.angle) * CONFIG.nodeSpeed;
      let targetVy = Math.sin(n.angle) * CONFIG.nodeSpeed;

      // Mouse Interaction: Repulsion + Agitation
      if (mouse.active) {
        const dx = n.x - mouse.x;
        const dy = n.y - mouse.y;
        const distSq = dx * dx + dy * dy;
        const agitationRadiusSq = CONFIG.mouseConnectRadius * CONFIG.mouseConnectRadius;

        if (distSq < agitationRadiusSq) {
          const dist = Math.sqrt(distSq);
          const forceFactor = (CONFIG.mouseConnectRadius - dist) / CONFIG.mouseConnectRadius;
          
          if (dist < CONFIG.mouseRepelRadius) {
            const repelForce = (CONFIG.mouseRepelRadius - dist) / CONFIG.mouseRepelRadius;
            n.vx += (dx / dist) * repelForce * CONFIG.mouseForce;
            n.vy += (dy / dist) * repelForce * CONFIG.mouseForce;
          }

          n.vx += Math.cos(n.angle) * forceFactor * CONFIG.mouseAgitation;
          n.vy += Math.sin(n.angle) * forceFactor * CONFIG.mouseAgitation;
        }
      }

      // Final displacement
      n.x += targetVx + n.vx;
      n.y += targetVy + n.vy;
      
      // Decay interaction velocity
      n.vx *= CONFIG.nodeFriction;
      n.vy *= CONFIG.nodeFriction;

      // Pulse
      n.phase += n.pulseSpeed;
      n.radius = n.baseRadius + Math.sin(n.phase) * n.baseRadius * 0.4;

      // Edge Wrap
      const buffer = 40; 
      if (n.x < -buffer) n.x = width + buffer;
      else if (n.x > width + buffer) n.x = -buffer;
      if (n.y < -buffer) n.y = height + buffer;
      else if (n.y > height + buffer) n.y = -buffer;
    }

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.angle += p.drift;
      p.x += Math.cos(p.angle) * p.speed;
      p.y += Math.sin(p.angle) * p.speed;
      p.life += p.lifeSpeed;
      if (p.life > 1) { p.life = 0; p.x = rand(0, width); p.y = rand(0, height); }
    }
  }

  // ── Draw ───────────────────────────────────────────────────
  function draw() {
    ctx.clearRect(0, 0, width, height);
    drawConnections();
    if (mouse.active) drawMouseConnections();
    drawNodes();
    drawParticles();
  }

  function drawConnections() {
    const maxDistSq = CONFIG.connectionDistance * CONFIG.connectionDistance;
    ctx.lineWidth = CONFIG.connectionLineWidth;

    for (let i = 0; i < nodes.length; i++) {
      let connections = 0;
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        if (connections >= CONFIG.maxConnectionsPerNode) break;
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dSq = dx * dx + dy * dy;

        if (dSq < maxDistSq) {
          const dist = Math.sqrt(dSq);
          const alpha = (1 - dist / CONFIG.connectionDistance) * 0.45;
          if (alpha < 0.02) continue;
          connections++;

          const perpAngle = Math.atan2(dy, dx) + Math.PI / 2;
          const wavePhase = elapsed * 0.0012 + i + j; 
          const amp = dist * 0.12;

          const cp1x = a.x - dx * 0.33 + Math.cos(perpAngle) * Math.sin(wavePhase) * amp;
          const cp1y = a.y - dy * 0.33 + Math.sin(perpAngle) * Math.sin(wavePhase) * amp;
          const cp2x = a.x - dx * 0.66 + Math.cos(perpAngle) * Math.sin(wavePhase + Math.PI) * amp;
          const cp2y = a.y - dy * 0.66 + Math.sin(perpAngle) * Math.sin(wavePhase + Math.PI) * amp;

          ctx.strokeStyle = hsl((a.hue + b.hue) / 2, CONFIG.saturation, CONFIG.lightnessLine, alpha);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, b.x, b.y);
          ctx.stroke();
        }
      }
    }
  }

  function drawMouseConnections() {
    const maxDistSq = CONFIG.mouseConnectRadius * CONFIG.mouseConnectRadius;
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      const dx = n.x - mouse.x;
      const dy = n.y - mouse.y;
      const dSq = dx * dx + dy * dy;
      if (dSq < maxDistSq) {
        const alpha = (1 - Math.sqrt(dSq) / CONFIG.mouseConnectRadius) * 0.9; // More visible
        ctx.strokeStyle = hsl(195, 100, 90, alpha); // Brighter (L90)
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(n.x, n.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }
  }

  function drawNodes() {
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      const alpha = CONFIG.nodeBaseAlpha + Math.sin(n.phase) * 0.15;
      const img = getCachedNode(n.hue);
      const size = img.width / dpr;
      
      ctx.globalAlpha = alpha;
      ctx.drawImage(img, n.x - size / 2, n.y - size / 2, size, size);
      ctx.globalAlpha = 1;
    }
  }

  function drawParticles() {
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const alpha = Math.sin(p.life * Math.PI) * p.alpha;
      if (alpha < 0.05) continue;
      ctx.fillStyle = hsl(p.hue, 90, CONFIG.lightnessParticle, alpha);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function loop(time) {
    if (!isVisible) return;
    animationId = requestAnimationFrame(loop);
    const dt = time - lastTime;
    lastTime = time;
    if (dt > 100) return;
    update(dt);
    draw();
  }

  function debounce(fn, ms) {
    let timer;
    return function () { clearTimeout(timer); timer = setTimeout(fn, ms); };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
