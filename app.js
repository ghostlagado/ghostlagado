(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  console.log(reduced)

  // Matrix rain
  const canvas = document.getElementById('matrix');
  if (canvas && !reduced) {
    const ctx = canvas.getContext('2d');
    const glyphs = 'アイウエオカキクケコ01<>/{}[]$#*=+abcdefghijklmnprstuvwxyz';
    const fontSize = 15;
    let cols, drops, w, h;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      cols = Math.ceil(w / fontSize);
      drops = Array.from({ length: cols }, () => Math.floor(Math.random() * -40));
    };
    resize();
    window.addEventListener('resize', resize);

    let last = 0;
    const draw = (t) => {
      if (t - last > 60) {
        last = t;
        ctx.fillStyle = 'rgba(5, 9, 7, 0.14)';
        ctx.fillRect(0, 0, w, h);
        ctx.font = fontSize + 'px monospace';
        for (let i = 0; i < cols; i++) {
          const ch = glyphs[Math.floor(Math.random() * glyphs.length)];
          ctx.fillStyle = Math.random() > 0.975 ? '#b6ffdd' : '#1e8f55';
          ctx.fillText(ch, i * fontSize, drops[i] * fontSize);
          if (drops[i] * fontSize > h && Math.random() > 0.97) drops[i] = Math.floor(Math.random() * -20);
          drops[i]++;
        }
      }
      requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
  }

  // Typing effect
  const typed = document.getElementById('typed');
  if (typed) {
    const cmds = [
      'git push origin maestria',
      'nmap -sV --script=vuln alvo.local',
      'python3 automate_tudo.py --run 24/7',
      'docker compose up -d tecnobreve',
      'npm run build && npm run hack-the-planet'
    ];
    if (reduced) {
      typed.textContent = cmds[0];
    } else {
      let ci = 0, ch = 0, deleting = false;
      const tick = () => {
        const current = cmds[ci];
        if (!deleting) {
          ch++;
          typed.textContent = current.slice(0, ch);
          if (ch === current.length) { deleting = true; setTimeout(tick, 2200); return; }
          setTimeout(tick, 45 + Math.random() * 60);
        } else {
          ch--;
          typed.textContent = current.slice(0, ch);
          if (ch === 0) { deleting = false; ci = (ci + 1) % cmds.length; setTimeout(tick, 500); return; }
          setTimeout(tick, 22);
        }
      };
      setTimeout(tick, 900);
    }
  }

  // Counters
  const counters = document.querySelectorAll('[data-count]');
  const runCounter = (el) => {
    const target = +el.dataset.count;
    if (reduced) { el.textContent = target; return; }
    let n = 0;
    const step = () => {
      n++;
      el.textContent = n;
      if (n < target) setTimeout(step, 130);
    };
    step();
  };
  if (counters.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { runCounter(e.target); io.unobserve(e.target); }
      });
    }, { threshold: .6 });
    counters.forEach((el) => io.observe(el));
  }

  // Scroll reveal
  const reveals = document.querySelectorAll('.reveal');
  if (reduced) {
    reveals.forEach((el) => el.classList.add('in'));
  } else {
    const ro = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); }
      });
    }, { threshold: .12 });
    reveals.forEach((el) => ro.observe(el));
  }

  // Mobile nav
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? '[ fechar ]' : '[ menu ]';
    });
    links.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = '[ menu ]';
      }
    });
  }

  // Copy email
  const copyBtn = document.getElementById('copyEmail');
  if (copyBtn) {
    const state = document.getElementById('emailState');
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(copyBtn.dataset.email);
        state.textContent = '/ copiado!';
        copyBtn.classList.add('done');
      } catch {
        state.textContent = '/ ' + copyBtn.dataset.email;
      }
      setTimeout(() => {
        state.textContent = '/ via GitHub noreply';
        copyBtn.classList.remove('done');
      }, 2500);
    });
  }
})();
