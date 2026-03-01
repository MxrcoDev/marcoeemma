/**
 * story.js — Marco & Emma · La nostra storia
 * (invariato — nessuna modifica richiesta)
 */

const progressBar = document.getElementById('scroll-progress');

function updateProgressBar() {
  const scrollTop    = window.scrollY;
  const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = scrollPercent + '%';
}

window.addEventListener('scroll', updateProgressBar, { passive: true });
updateProgressBar();


const REVEAL_THRESHOLD = 0.12;
const REVEAL_MARGIN    = '-60px';

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: REVEAL_THRESHOLD,
    rootMargin: `0px 0px ${REVEAL_MARGIN} 0px`,
  }
);

function initReveal() {
  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });
}


const heroCanvas = document.getElementById('hero-canvas');
const ctx        = heroCanvas ? heroCanvas.getContext('2d') : null;

const CFG = {
  count:      22,
  minSize:    5,
  maxSize:    22,
  minSpeed:   0.3,
  maxSpeed:   0.85,
  minOpacity: 0.06,
  maxOpacity: 0.22,
  colors: [
    'rgba(106,175,224,',
    'rgba(170,212,239,',
    'rgba(53,122,176,',
    'rgba(218,238,250,',
    'rgba(184,160,122,',
  ],
};

let particles = [];
let heroW, heroH;

function resizeHeroCanvas() {
  if (!heroCanvas) return;
  heroW = heroCanvas.width  = heroCanvas.parentElement.offsetWidth;
  heroH = heroCanvas.height = heroCanvas.parentElement.offsetHeight;
}

function randomParticle(fromBottom = false) {
  return {
    x:       Math.random() * heroW,
    y:       fromBottom ? heroH + 20 : Math.random() * heroH,
    size:    CFG.minSize + Math.random() * (CFG.maxSize - CFG.minSize),
    speed:   CFG.minSpeed + Math.random() * (CFG.maxSpeed - CFG.minSpeed),
    drift:   (Math.random() - 0.5) * 0.35,
    opacity: CFG.minOpacity + Math.random() * (CFG.maxOpacity - CFG.minOpacity),
    color:   CFG.colors[Math.floor(Math.random() * CFG.colors.length)],
    wobble:  Math.random() * Math.PI * 2,
  };
}

function drawHeart(x, y, size, opacity, color) {
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.fillStyle   = color + opacity + ')';
  ctx.translate(x, y);
  ctx.scale(size * 0.8, size * 0.8);
  ctx.beginPath();
  ctx.moveTo(0, -0.5);
  ctx.bezierCurveTo( 0.5, -1,   1,   0,  0,  0.7);
  ctx.bezierCurveTo(-1,   0,  -0.5, -1,  0, -0.5);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function animateHero() {
  if (!ctx) return;
  ctx.clearRect(0, 0, heroW, heroH);

  for (const p of particles) {
    p.wobble += 0.018;
    p.x += Math.sin(p.wobble) * 0.4 + p.drift;
    p.y -= p.speed;
    drawHeart(p.x, p.y, p.size, p.opacity, p.color);
    if (p.y < -30) Object.assign(p, randomParticle(true));
  }

  requestAnimationFrame(animateHero);
}

function initHeroCanvas() {
  if (!heroCanvas) return;
  resizeHeroCanvas();
  particles = Array.from({ length: CFG.count }, () => randomParticle(false));
  window.addEventListener('resize', resizeHeroCanvas, { passive: true });
  animateHero();
}


const heroInner = document.querySelector('.hero__inner');
const isTouch   = window.matchMedia('(hover: none)').matches;

function initParallax() {
  if (!heroInner || isTouch) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    heroInner.style.transform = `translateY(${y * 0.28}px)`;
    heroInner.style.opacity   = Math.max(0, 1 - y / (heroH * 0.6));
  }, { passive: true });
}


function initChapterHover() {
  document.querySelectorAll('.chapter__media').forEach(media => {
    media.addEventListener('mouseenter', () => spawnSparks(media));
  });
}

function spawnSparks(container) {
  for (let i = 0; i < 5; i++) {
    const spark = document.createElement('span');
    spark.style.cssText = `
      position: absolute;
      pointer-events: none;
      width: 6px; height: 6px;
      border-radius: 50%;
      background: rgba(106,175,224,0.8);
      top: ${20 + Math.random() * 60}%;
      left: ${10 + Math.random() * 80}%;
      animation: sparkFade 0.6s ease forwards;
      z-index: 10;
    `;
    container.style.position = 'relative';
    container.appendChild(spark);
    setTimeout(() => spark.remove(), 650);
  }
}

(function addSparkKeyframe() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes sparkFade {
      0%   { opacity: 1; transform: scale(0) translateY(0); }
      50%  { opacity: 0.8; transform: scale(1.4) translateY(-8px); }
      100% { opacity: 0; transform: scale(0.3) translateY(-18px); }
    }
  `;
  document.head.appendChild(style);
})();


document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initHeroCanvas();
  initParallax();
  initChapterHover();
});