/* ================================
   缔智元科技 · 浅色版交互脚本
   * 保留原生鼠标光标
   * 鼠标光晕仅作为背景效果
   ================================ */

/* ============ 1. 鼠标光晕跟随（保留原生光标） ============ */
(function() {
  const aura = document.querySelector('.cursor-aura');
  if (!aura || window.innerWidth < 768) return;

  let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
  let curX = mouseX, curY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function follow() {
    curX += (mouseX - curX) * 0.1;
    curY += (mouseY - curY) * 0.1;
    aura.style.left = curX + 'px';
    aura.style.top = curY + 'px';
    requestAnimationFrame(follow);
  }
  follow();

  // 离开页面时降低透明度
  document.addEventListener('mouseleave', () => aura.style.opacity = '0');
  document.addEventListener('mouseenter', () => aura.style.opacity = '1');
})();

/* ============ 2. 导航栏滚动 ============ */
(function() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  });
})();

/* ============ 3. 滚动揭示 + 数字滚动 ============ */
(function() {
  const animateCounter = (counter) => {
    if (counter.dataset.animated) return;
    counter.dataset.animated = 'true';
    const target = parseInt(counter.dataset.target);
    const duration = 2000;
    const start = performance.now();
    const animate = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(animate);
      else counter.textContent = target;
    };
    requestAnimationFrame(animate);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        entry.target.querySelectorAll('[data-target]').forEach(animateCounter);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

/* ============ 4. 应用场景 Tabs ============ */
(function() {
  const tabs = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.scen-panel');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.querySelector(`[data-panel="${target}"]`);
      if (panel) panel.classList.add('active');
    });
  });
})();

/* ============ 5. 导航高亮 ============ */
(function() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
  });
})();

/* ============ 6. 卡片 3D 倾斜 ============ */
(function() {
  if (window.matchMedia('(hover: none)').matches) return;
  const cards = document.querySelectorAll('.cap-card, .show-card, .ach-item, .float-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rx = ((y - cy) / cy) * -3;
      const ry = ((x - cx) / cx) * 3;
      const baseTransform = card.classList.contains('float-card') ? card.style.transform.split('rotateX')[0] : '';
      card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ============ 7. Hero 视差 ============ */
(function() {
  const heroVisual = document.querySelector('.hero-visual');
  if (!heroVisual) return;
  if (window.innerWidth < 768) return;

  window.addEventListener('mousemove', (e) => {
    const rect = heroVisual.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    heroVisual.style.transform = `translate(${x}px, ${y}px)`;
  });
})();

/* ============ 8. 漂浮卡片轻微跟随鼠标 ============ */
(function() {
  if (window.innerWidth < 768) return;
  const cards = document.querySelectorAll('.float-card, .float-tag, .orbit-dot');
  cards.forEach((c, i) => {
    const speed = (i % 3 + 1) * 0.5;
    c.dataset.speed = speed;
  });
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5);
    const y = (e.clientY / window.innerHeight - 0.5);
    cards.forEach(c => {
      const s = parseFloat(c.dataset.speed) || 1;
      c.style.setProperty('--mx', `${x * s * 10}px`);
      c.style.setProperty('--my', `${y * s * 10}px`);
    });
  });
})();
