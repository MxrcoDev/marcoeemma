/* ============================================================
   index.js — Marco & Emma · Homepage
   Gestisce: contatori in tempo reale + cuori animati canvas
   ============================================================ */

/* ────────────────────────────────────────────────────────────
   DATE — MODIFICA QUI
   Formato: new Date(anno, mese-1, giorno, ora, minuto, secondo)
   mese-1 perché JavaScript conta i mesi da 0 (0=Gennaio)
   ──────────────────────────────────────────────────────────── */
   const START_DATE = new Date(2025, 4, 1, 0, 0, 0);  // 1 Maggio 2025
   const ANNIV_DATE = new Date(2026, 4, 1, 0, 0, 0);  // 1 Maggio 2026 (anniversario)
   
   /* ────────────────────────────────────────────────────────────
      UTILITY
      ──────────────────────────────────────────────────────────── */
   const pad = (n, d = 2) => String(n).padStart(d, '0');
   const fmt = n => n.toLocaleString('it-IT');  // separatore migliaia italiano
   
   /* ────────────────────────────────────────────────────────────
      ANIMAZIONE TICK — piccolo rimbalzo al cambio numero
      ──────────────────────────────────────────────────────────── */
   function animateTick(el) {
     el.classList.remove('tick');
     void el.offsetWidth;   // force reflow
     el.classList.add('tick');
   }
   
   /* ────────────────────────────────────────────────────────────
      AGGIORNAMENTO CONTATORI — chiamato ogni secondo
      ──────────────────────────────────────────────────────────── */
   function update() {
     const now  = new Date();
     const diff = now - START_DATE;  // millisecondi totali trascorsi
   
     /* === CONTATORE PRINCIPALE: aa:mm:dd:hh:mm:ss === */
   
     // Anni e mesi "calendario" (conta i mesi reali, non i giorni / 30)
     let y  = now.getFullYear() - START_DATE.getFullYear();
     let mo = now.getMonth()    - START_DATE.getMonth();
     let d  = now.getDate()     - START_DATE.getDate();
   
     if (d < 0) {
       mo--;
       // Giorni nell'ultimo mese completo
       const prev = new Date(now.getFullYear(), now.getMonth(), 0);
       d += prev.getDate();
     }
     if (mo < 0) { y--; mo += 12; }
   
     // Ora corrente del giorno (hh:mm:ss)
     const h  = now.getHours();
     const mi = now.getMinutes();
     const s  = now.getSeconds();
   
     // Recupera elementi
     const elY  = document.getElementById('mc-years');
     const elMo = document.getElementById('mc-months');
     const elD  = document.getElementById('mc-days');
     const elH  = document.getElementById('mc-hours');
     const elMi = document.getElementById('mc-mins');
     const elS  = document.getElementById('mc-secs');
   
     // Anima solo i valori che cambiano
     if (elS.textContent  !== pad(s))  animateTick(elS);
     if (elMi.textContent !== pad(mi)) animateTick(elMi);
     if (elH.textContent  !== pad(h))  animateTick(elH);
   
     elY.textContent  = pad(y);
     elMo.textContent = pad(mo);
     elD.textContent  = pad(d);
     elH.textContent  = pad(h);
     elMi.textContent = pad(mi);
     elS.textContent  = pad(s);
   
     /* === CONTATORI SECONDARI: totali assoluti === */
     const totalSec  = Math.floor(diff / 1000);
     const totalMin  = Math.floor(totalSec / 60);
     const totalHrs  = Math.floor(totalMin / 60);
     const totalDays = Math.floor(totalHrs / 24);
   
     document.getElementById('sc-days').textContent  = fmt(totalDays);
     document.getElementById('sc-hours').textContent = fmt(totalHrs);
     document.getElementById('sc-mins').textContent  = fmt(totalMin);
     document.getElementById('sc-secs').textContent  = fmt(totalSec);
   
     /* === COUNTDOWN ANNIVERSARIO === */
     const diffA = ANNIV_DATE - now;
     if (diffA > 0) {
       const adSec  = Math.floor(diffA / 1000);
       const adMin  = Math.floor(adSec / 60);
       const adHrs  = Math.floor(adMin / 60);
       const adDays = Math.floor(adHrs / 24);
   
       document.getElementById('an-days').textContent  = pad(adDays, 3);
       document.getElementById('an-hours').textContent = pad(adHrs % 24);
       document.getElementById('an-mins').textContent  = pad(adMin % 60);
       document.getElementById('an-secs').textContent  = pad(adSec % 60);
     } else {
       // Anniversario raggiunto!
       ['an-days','an-hours','an-mins','an-secs'].forEach(id => {
         document.getElementById(id).textContent = '🎉';
       });
     }
   }
   
   // Avvia subito e poi ogni secondo
   update();
   setInterval(update, 1000);
   
   /* ────────────────────────────────────────────────────────────
      CUORI ANIMATI — canvas in background
      ──────────────────────────────────────────────────────────── */
   const canvas = document.getElementById('hearts-canvas');
   const ctx    = canvas.getContext('2d');
   
   let W, H;
   const HEARTS = [];
   
   /* MODIFICA: numero di cuori sullo schermo */
   const COUNT = 28;
   
   /* MODIFICA: colori dei cuori */
   const COLORS = [
     'rgba(249,168,201,',  // rose
     'rgba(224,92,133,',   // rose-dark
     'rgba(192,57,91,',    // red
     'rgba(247,215,164,',  // gold
     'rgba(255,200,220,',  // soft pink
   ];
   
   function resize() {
     W = canvas.width  = window.innerWidth;
     H = canvas.height = window.innerHeight;
   }
   window.addEventListener('resize', resize, { passive: true });
   resize();
   
   function drawHeart(x, y, size, alpha, color) {
     ctx.save();
     ctx.globalAlpha = alpha;
     ctx.fillStyle   = color + alpha + ')';
     ctx.translate(x, y);
     ctx.scale(size, size);
     ctx.beginPath();
     ctx.moveTo(0, -0.5);
     ctx.bezierCurveTo( 0.5, -1,  1,  0,  0,  0.7);
     ctx.bezierCurveTo(-1,   0, -0.5, -1,  0, -0.5);
     ctx.closePath();
     ctx.fill();
     ctx.restore();
   }
   
   function randomHeart() {
     return {
       x:     Math.random() * W,
       y:     H + 20 + Math.random() * 80,
       size:  6 + Math.random() * 18,
       speed: 0.4 + Math.random() * 0.9,
       drift: (Math.random() - 0.5) * 0.5,
       alpha: 0.12 + Math.random() * 0.28,
       color: COLORS[Math.floor(Math.random() * COLORS.length)],
       wobble: Math.random() * Math.PI * 2,
     };
   }
   
   // Popola lo schermo con cuori distribuiti casualmente all'avvio
   for (let i = 0; i < COUNT; i++) {
     const h = randomHeart();
     h.y = Math.random() * H;
     HEARTS.push(h);
   }
   
   function animate() {
     ctx.clearRect(0, 0, W, H);
     for (const h of HEARTS) {
       drawHeart(h.x, h.y, h.size, h.alpha, h.color);
       h.y      -= h.speed;
       h.wobble += 0.018;
       h.x      += Math.sin(h.wobble) * 0.3 + h.drift;
       if (h.y < -40) Object.assign(h, randomHeart());
     }
     requestAnimationFrame(animate);
   }
   animate();