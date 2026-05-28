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
  let firstMove = true;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (firstMove) {
      // 首次移动时让光晕立即出现在鼠标位置（避免从中央飘过来）
      curX = mouseX;
      curY = mouseY;
      aura.style.opacity = '1';
      firstMove = false;
    }
  });

  function follow() {
    curX += (mouseX - curX) * 0.1;
    curY += (mouseY - curY) * 0.1;
    aura.style.left = curX + 'px';
    aura.style.top = curY + 'px';
    requestAnimationFrame(follow);
  }
  follow();

  // 离开/进入页面时切换透明度
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

/* ============ 6. Hero 视差（节流 RAF，仅影响装饰元素） ============ */
(function() {
  if (window.innerWidth < 768) return;
  const decor = document.querySelector('.hero-decor');
  if (!decor) return;

  let targetX = 0, targetY = 0, curX = 0, curY = 0;
  let ticking = false;

  window.addEventListener('mousemove', (e) => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 30;
    targetY = (e.clientY / window.innerHeight - 0.5) * 30;
    if (!ticking) {
      requestAnimationFrame(updateDecor);
      ticking = true;
    }
  });

  function updateDecor() {
    curX += (targetX - curX) * 0.08;
    curY += (targetY - curY) * 0.08;
    decor.style.translate = `${curX}px ${curY}px`;
    if (Math.abs(targetX - curX) > 0.1 || Math.abs(targetY - curY) > 0.1) {
      requestAnimationFrame(updateDecor);
    } else {
      ticking = false;
    }
  }
})();

/* 漂浮卡片已有 CSS 浮动动画，无需额外鼠标跟随 */

/* ============ 7. 服务角色卡片：点击锁定 active + 键盘支持 ============ */
(function() {
  const track = document.querySelector('.roles-track');
  if (!track) return;
  const cards = track.querySelectorAll('.role-card');

  function activate(target) {
    cards.forEach(c => c.classList.remove('active'));
    target.classList.add('active');
  }

  cards.forEach(card => {
    // 点击：将该卡片设为默认展开项
    card.addEventListener('click', (e) => {
      // 忽略 CTA 链接点击导致的冒泡
      if (e.target.closest('.role-cta')) return;
      activate(card);
    });

    // 键盘：Enter / Space 激活
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (e.target.closest('.role-cta')) return;
        e.preventDefault();
        activate(card);
      }
    });
  });
})();
