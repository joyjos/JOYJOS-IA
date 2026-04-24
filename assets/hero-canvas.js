/**
 * JOYJOS Hero Canvas — Neural Network / Data Flow Animation
 * 
 * Updates:
 * - Real wave (S-curve) connections using bezier curves
 * - Mouse interaction (repulsion and connections)
 * - Higher node count & visibility
 * - Mobile reduction (performance)
 */
;(function () {
  'use strict';

  // ── Configuration ──────────────────────────────────────────
  const CONFIG = {
    // Density & Count
    nodeDensity: 0.8,      // Increased density
    maxNodes: 120,         // Increased max
    minNodes: 30,

    // Node appearance
    nodeMinRadius: 2,
    nodeMaxRadius: 6,
    nodeGlowMin: 8,
    nodeGlowMax: 25,
    nodeBaseAlpha: 0.8,    // Make nodes more visible

    // Connections
    connectionDistance: 220,
    maxConnectionsPerNode: 4,
    connectionLineWidth: 0.8,

    // Particles
    particleCount: 80,
    particleMinRadius: 1,
    particleMaxRadius: 2.5,
    particleMinSpeed: 0.2,
    particleMaxSpeed: 0.8,

    // Movement
    nodeSpeed: 0.4,
    nodeDrift: 0.0005,

    // Mouse Interaction
    mouseRepelRadius: 250, // Increased radius
    mouseForce: 0.8,       // Increased force
    mouseConnectRadius: 350, // Reach out further

    // Colors
    hueMin: 195,
    hueMax: 210,
    saturation: 90,
    lightnessNode: 70,
    lightnessParticle: 75,
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

  let mouse = { x: -1000, y: -1000, active: false };

  // ── Utilities ──────────────────────────────────────────────
  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function hsl(h, s, l, a) {
    return 'hsla(' + h + ',' + s + '%,' + l + '%,' + a + ')';
  }

  // ── Node & Particle ────────────────────────────────────────
  function createNode() {
    const r = rand(CONFIG.nodeMinRadius, CONFIG.nodeMaxRadius);
    return {
      x: rand(0, width),
      y: rand(0, height),
      radius: r,
      baseRadius: r,
      vx: rand(-CONFIG.nodeSpeed, CONFIG.nodeSpeed),
      vy: rand(-CONFIG.nodeSpeed, CONFIG.nodeSpeed),
      hue: rand(CONFIG.hueMin, CONFIG.hueMax),
      glowRadius: rand(CONFIG.nodeGlowMin, CONFIG.nodeGlowMax),
      phase: rand(0, Math.PI * 2),
      pulseSpeed: rand(0.005, 0.02),
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
      alpha: rand(0.3, 0.8),
      drift: rand(-0.005, 0.005),
      life: rand(0, 1),
      lifeSpeed: rand(0.002, 0.008),
    };
  }

  // ── Init ───────────────────────────────────────────────────
  function init() {
    canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    ctx = canvas.getContext('2d');
    resize();

    populateNodes();
    populateParticles();

    window.addEventListener('resize', debounce(onResize, 250));
    document.addEventListener('visibilitychange', onVisibility);

    // Mouse Tracking (Listen on window to bypass DOM overlays)
    window.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      // Only track if mouse is over the hero section (roughly)
      if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
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

    lastTime = performance.now();
    loop(lastTime);
  }

  function populateNodes() {
    const area = width * height;
    let count = Math.floor(area / 100000 * CONFIG.nodeDensity);
    
    // Mobile reduction: if width is small, reduce nodes by half
    if (width < 768) count = Math.floor(count * 0.5);
    
    count = Math.max(CONFIG.minNodes, Math.min(CONFIG.maxNodes, count));
    nodes = [];
    for (let i = 0; i < count; i++) {
      nodes.push(createNode());
    }
  }

  function populateParticles() {
    let count = CONFIG.particleCount;
    if (width < 768) count = Math.floor(count * 0.5); // Mobile reduction
    
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push(createParticle());
    }
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
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function onResize() {
    resize();
    populateNodes();
    populateParticles();
  }

  function onVisibility() {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
      animationId = null;
    } else {
      lastTime = performance.now();
      loop(lastTime);
    }
  }

  // ── Update ─────────────────────────────────────────────────
  function update(dt) {
    elapsed += dt;

    // Nodes
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];

      // Natural Drift
      n.vx += Math.sin(elapsed * CONFIG.nodeDrift + n.phase) * 0.01;
      n.vy += Math.cos(elapsed * CONFIG.nodeDrift + n.phase * 1.3) * 0.01;

      // Mouse Repulsion
      if (mouse.active) {
        const dx = n.x - mouse.x;
        const dy = n.y - mouse.y;
        const distSq = dx * dx + dy * dy;
        const repelRadiusSq = CONFIG.mouseRepelRadius * CONFIG.mouseRepelRadius;
        
        if (distSq < repelRadiusSq && distSq > 0) {
          const distance = Math.sqrt(distSq);
          const force = (CONFIG.mouseRepelRadius - distance) / CONFIG.mouseRepelRadius;
          n.vx += (dx / distance) * force * CONFIG.mouseForce;
          n.vy += (dy / distance) * force * CONFIG.mouseForce;
        }
      }

      // Clamp Velocity
      const maxV = CONFIG.nodeSpeed * 2.5;
      n.vx = Math.max(-maxV, Math.min(maxV, n.vx));
      n.vy = Math.max(-maxV, Math.min(maxV, n.vy));

      n.x += n.vx;
      n.y += n.vy;

      // Pulsing
      n.phase += n.pulseSpeed;
      n.radius = n.baseRadius + Math.sin(n.phase) * n.baseRadius * 0.4;

      // Edge Wrap
      const pad = 50;
      if (n.x < -pad) n.x = width + pad;
      if (n.x > width + pad) n.x = -pad;
      if (n.y < -pad) n.y = height + pad;
      if (n.y > height + pad) n.y = -pad;
    }

    // Particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.angle += p.drift;
      p.x += Math.cos(p.angle) * p.speed;
      p.y += Math.sin(p.angle) * p.speed;

      // Repel particles slightly too
      if (mouse.active) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < 10000) { // 100px radius
          p.x += (dx * 0.01);
          p.y += (dy * 0.01);
        }
      }

      p.life += p.lifeSpeed;
      if (p.life > 1) {
        p.life = 0;
        p.x = rand(0, width);
        p.y = Math.random() > 0.5 ? -10 : height + 10;
        p.angle = rand(0, Math.PI * 2);
      }

      if (p.x < -20) p.x = width + 20;
      if (p.x > width + 20) p.x = -20;
      if (p.y < -20) p.y = height + 20;
      if (p.y > height + 20) p.y = -20;
    }
  }

  // ── Draw ───────────────────────────────────────────────────
  function draw() {
    ctx.clearRect(0, 0, width, height);
    drawConnections();
    drawMouseConnections();
    drawNodes();
    drawParticles();
  }

  function drawConnections() {
    const maxDistSq = CONFIG.connectionDistance * CONFIG.connectionDistance;

    for (let i = 0; i < nodes.length; i++) {
      let connections = 0;
      const a = nodes[i];

      for (let j = i + 1; j < nodes.length; j++) {
        if (connections >= CONFIG.maxConnectionsPerNode) break;

        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dSq = dx * dx + dy * dy;

        if (dSq > maxDistSq) continue;

        const d = Math.sqrt(dSq);
        const alpha = (1 - d / CONFIG.connectionDistance) * 0.5; // Increased line visibility

        if (alpha < 0.02) continue;

        connections++;

        // Real Wave calculation (S-curve using bezierCurveTo)
        const perpAngle = Math.atan2(dy, dx) + Math.PI / 2;
        const wavePhase = elapsed * 0.0015 + i + j; 
        const amp = d * 0.15; // Wave amplitude relative to line length

        // Control point 1
        const cp1x = a.x - dx * 0.33 + Math.cos(perpAngle) * Math.sin(wavePhase) * amp;
        const cp1y = a.y - dy * 0.33 + Math.sin(perpAngle) * Math.sin(wavePhase) * amp;
        
        // Control point 2 (inverse wave phase)
        const cp2x = a.x - dx * 0.66 + Math.cos(perpAngle) * Math.sin(wavePhase + Math.PI) * amp;
        const cp2y = a.y - dy * 0.66 + Math.sin(perpAngle) * Math.sin(wavePhase + Math.PI) * amp;

        const avgHue = (a.hue + b.hue) / 2;

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, b.x, b.y);
        ctx.strokeStyle = hsl(avgHue, CONFIG.saturation, CONFIG.lightnessLine, alpha);
        ctx.lineWidth = CONFIG.connectionLineWidth;
        ctx.stroke();
      }
    }
  }

  function drawMouseConnections() {
    if (!mouse.active) return;
    
    const maxDistSq = CONFIG.mouseConnectRadius * CONFIG.mouseConnectRadius;
    
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      const dx = n.x - mouse.x;
      const dy = n.y - mouse.y;
      const dSq = dx * dx + dy * dy;

      if (dSq < maxDistSq) {
        const d = Math.sqrt(dSq);
        const alpha = (1 - d / CONFIG.mouseConnectRadius) * 0.8; // Increased brightness
        
        ctx.beginPath();
        ctx.moveTo(n.x, n.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = hsl(190, 100, 80, alpha); 
        ctx.lineWidth = 1.5; // Thicker line
        ctx.stroke();
      }
    }
  }

  function drawNodes() {
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      const pulseAlpha = CONFIG.nodeBaseAlpha + Math.sin(n.phase) * 0.2;
      const color = hsl(n.hue, CONFIG.saturation, CONFIG.lightnessNode, pulseAlpha);

      // Inner Core
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      // Outer Glow
      const glowAlpha = 0.2 + Math.sin(n.phase) * 0.1;
      const gradient = ctx.createRadialGradient(n.x, n.y, n.radius, n.x, n.y, n.radius + n.glowRadius);
      gradient.addColorStop(0, hsl(n.hue, CONFIG.saturation, CONFIG.lightnessNode, glowAlpha));
      gradient.addColorStop(1, hsl(n.hue, CONFIG.saturation, CONFIG.lightnessNode, 0));
      
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius + n.glowRadius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  }

  function drawParticles() {
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const fadeAlpha = Math.sin(p.life * Math.PI) * p.alpha;

      if (fadeAlpha < 0.02) continue;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = hsl(p.hue, 90, CONFIG.lightnessParticle, fadeAlpha);
      
      // Give particles a tiny glow
      ctx.shadowColor = hsl(p.hue, 90, CONFIG.lightnessParticle, fadeAlpha * 0.5);
      ctx.shadowBlur = 4;
      ctx.fill();
      ctx.shadowBlur = 0; // reset
    }
  }

  // ── Loop ───────────────────────────────────────────────────
  function loop(time) {
    animationId = requestAnimationFrame(loop);
    const dt = time - lastTime;
    lastTime = time;

    if (dt > 200) return;

    update(dt);
    draw();
  }

  // ── Helpers ────────────────────────────────────────────────
  function debounce(fn, ms) {
    let timer;
    return function () {
      clearTimeout(timer);
      timer = setTimeout(fn, ms);
    };
  }

  // ── Boot ───────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
