// Sakura (gilos guli) barglarining to'kilishi va sichqonchaga reaksiyasi
(function() {
  // Canvas elementini yaratish va sahifaga ulash
  let canvas = document.getElementById('sakura-canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'sakura-canvas';
    document.body.appendChild(canvas);
  }

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);
  let scrollY = window.scrollY;
  const getPageHeight = () => Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight,
    height
  );
  let pageHeight = getPageHeight();

  function updateDimensions() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    pageHeight = getPageHeight();
  }

  window.addEventListener('resize', updateDimensions);
  window.addEventListener('load', updateDimensions);

  // Sichqoncha pozitsiyasi va ta'sir doirasi
  const mouse = {
    x: -2000,
    y: -2000,
    radius: 140, // Sichqoncha ta'sir radiusi
    active: false
  };

  window.addEventListener('scroll', () => {
    const nextScrollY = window.scrollY;
    if (mouse.active) {
      mouse.y += nextScrollY - scrollY;
    }
    scrollY = nextScrollY;
    pageHeight = getPageHeight();
  }, { passive: true });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY + scrollY;
    mouse.active = true;

    // Fon sichqoncha harakatiga qarama-qarshi tarafga suriladi.
    const moveX = ((e.clientX / width) - 0.5) * -34;
    const moveY = ((e.clientY / height) - 0.5) * -24;
    document.documentElement.style.setProperty('--bg-x', moveX.toFixed(2) + 'px');
    document.documentElement.style.setProperty('--bg-y', moveY.toFixed(2) + 'px');
  });

  window.addEventListener('mouseleave', () => {
    mouse.active = false;
    mouse.x = -2000;
    mouse.y = -2000;
    document.documentElement.style.setProperty('--bg-x', '0px');
    document.documentElement.style.setProperty('--bg-y', '0px');
  });

  // Mobil qurilmalarda teginish (touch) uchun
  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches.length > 0) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY + scrollY;
      mouse.active = true;
      const moveX = ((e.touches[0].clientX / width) - 0.5) * -34;
      const moveY = ((e.touches[0].clientY / height) - 0.5) * -24;
      document.documentElement.style.setProperty('--bg-x', moveX.toFixed(2) + 'px');
      document.documentElement.style.setProperty('--bg-y', moveY.toFixed(2) + 'px');
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    mouse.active = false;
    mouse.x = -2000;
    mouse.y = -2000;
    document.documentElement.style.setProperty('--bg-x', '0px');
    document.documentElement.style.setProperty('--bg-y', '0px');
  });

  // Sakura gul bargi klassi
  class Petal {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial
        ? Math.random() * pageHeight
        : -30 - Math.random() * 60;
      this.size = Math.random() * 10 + 14;
      this.speedY = Math.random() * 1.2 + 0.8;
      this.speedX = Math.random() * 0.8 - 0.2; // Yengil shamol oqimi
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.03;
      this.flip = Math.random() * Math.PI;
      this.flipSpeed = Math.random() * 0.03 + 0.01;
      this.opacity = Math.random() * 0.15 + 0.85;
      this.settled = false;
      this.settleLife = 0;
      
      // Kunduzgi och fonlarda ham aniq ko'rinadigan sakura ranglari
      const colors = [
        'rgba(242, 105, 145, ',
        'rgba(247, 127, 159, ',
        'rgba(233, 92, 131, ',
        'rgba(250, 146, 173, ',
        'rgba(232, 70, 117, '
      ];
      this.baseColor = colors[Math.floor(Math.random() * colors.length)];
      
      // Sichqoncha ta'siridagi turtki tezliklari
      this.pushVx = 0;
      this.pushVy = 0;
    }

    update() {
      // Sichqoncha yaqinlashganda barglarning itarilishi (reaksiya)
      if (mouse.active) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius && dist > 0) {
          // Yaqinroq bo'lganda kuchliroq itarilish kuchi
          const force = (1 - dist / mouse.radius) * 6;
          const angle = Math.atan2(dy, dx);
          this.pushVx += Math.cos(angle) * force * 0.45;
          this.pushVy += Math.sin(angle) * force * 0.45;
          this.rotationSpeed += (Math.random() - 0.5) * 0.06;
        }
      }

      // Kuchning sekin-asta so'nishi (inersiya)
      this.pushVx *= 0.92;
      this.pushVy *= 0.92;

      if (this.settled) {
        this.settleLife--;
        this.x += this.pushVx + Math.sin(this.flip) * 0.08;
        this.flip += this.flipSpeed * 0.35;
        this.rotation += this.rotationSpeed * 0.25;
        if (this.settleLife <= 0) {
          this.settled = false;
          this.y = -30;
        }
      } else {
      // Pozitsiyani siljitish va tebranish berish
      this.x += this.speedX + Math.sin(this.flip) * 0.7 + this.pushVx;
      this.y += this.speedY + this.pushVy;
      this.rotation += this.rotationSpeed;
      this.flip += this.flipSpeed;

        // Ayrim barglar mahsulot kartalarining ustiga to'planadi.
        if (this.y > 220) {
          const cards = document.querySelectorAll('.product-card');
          for (let i = 0; i < cards.length; i++) {
            if (Math.random() > 0.018) continue;
            const rect = cards[i].getBoundingClientRect();
            const cardTop = rect.top + scrollY;
            const cardBottom = rect.bottom + scrollY;
            if (
              this.y >= cardTop - 12 &&
              this.y <= cardBottom &&
              this.x >= rect.left - 8 &&
              this.x <= rect.right + 8
            ) {
              this.settled = true;
              this.y = cardTop + Math.random() * Math.min(rect.height * 0.7, 180);
              this.speedY = 0;
              this.speedX = 0;
              this.settleLife = 900 + Math.random() * 600;
              break;
            }
          }
        }

        // Sahifa pastida to'planish.
        if (!this.settled && this.y > pageHeight - 105 - Math.random() * 90) {
          this.settled = true;
          this.speedY = 0;
          this.speedX = 0;
          this.settleLife = 700 + Math.random() * 700;
        }
      }

      // Sahifaning pastki chetiga yetgach barg yana yuqoridan tushadi.
      if (!this.settled && this.y > pageHeight + 40) {
        this.reset();
      } else if (this.x < -50) {
        this.x = width + 50;
      } else if (this.x > width + 50) {
        this.x = -50;
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y - scrollY);
      ctx.rotate(this.rotation);
      ctx.scale(Math.cos(this.flip), 1);

      ctx.beginPath();
      // Tabiiy sakura bargining chiroyli yuraksimon egri chizig'i
      ctx.moveTo(0, -this.size);
      ctx.bezierCurveTo(this.size * 0.85, -this.size * 0.85, this.size * 0.9, this.size * 0.4, 0, this.size);
      ctx.bezierCurveTo(-this.size * 0.9, this.size * 0.4, -this.size * 0.85, -this.size * 0.85, 0, -this.size);
      
      ctx.fillStyle = this.baseColor + this.opacity + ')';
      ctx.shadowColor = 'rgba(230, 90, 130, 0.4)';
      ctx.shadowBlur = 7;
      ctx.fill();

      ctx.strokeStyle = 'rgba(190, 55, 90, ' + (this.opacity * 0.45) + ')';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Barg markazidagi nafis chiziq (tomiri)
      ctx.beginPath();
      ctx.moveTo(0, -this.size * 0.7);
      ctx.lineTo(0, this.size * 0.6);
      ctx.strokeStyle = 'rgba(175, 50, 80, ' + (this.opacity * 0.6) + ')';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.restore();
    }
  }

  // Ekran kengligiga mos barglar soni
  const petalCount = Math.min(
    Math.ceil(width / 24) * Math.ceil(pageHeight / height),
    240
  );
  const petals = [];
  for (let i = 0; i < petalCount; i++) {
    petals.push(new Petal());
  }

  // Animatsiya sikli
  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < petals.length; i++) {
      petals[i].update();
      petals[i].draw();
    }
    requestAnimationFrame(animate);
  }

  animate();
})();
