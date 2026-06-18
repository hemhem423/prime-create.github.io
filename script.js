/* ============================================================
   script.js  –  Partners
   Interactions: header scroll, hamburger menu,
   scroll-reveal, smooth anchor, stagger cards,
   watermark slide-in, scroll indicator, carousel dots,
   dropdown menu（事業紹介）
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     1. HEADER – shadow on scroll
  ---------------------------------------------------------- */
  const header = document.getElementById('header');

  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('header--scrolled', window.scrollY > 20);
    }, { passive: true });

    const s = document.createElement('style');
    s.textContent = `.header--scrolled { box-shadow: 0 4px 32px rgba(0,0,0,0.10); }`;
    document.head.appendChild(s);
  }


  /* ----------------------------------------------------------
     2. HAMBURGER MENU
  ---------------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const nav = document.querySelector('.header__nav');

  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);

      const spans = hamburger.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans.forEach(sp => { sp.style.transform = ''; sp.style.opacity = ''; });
      }
    });

    // ナビリンク押下でメニューを閉じる（ドロップダウントリガー自身は除く）
    nav.querySelectorAll('a').forEach(link => {
      if (link.classList.contains('nav__dropdown-trigger')) return;
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        hamburger.querySelectorAll('span').forEach(sp => {
          sp.style.transform = '';
          sp.style.opacity   = '';
        });
        document.querySelectorAll('.nav__item--has-dropdown.open')
          .forEach(item => item.classList.remove('open'));
      });
    });
  }


  /* ----------------------------------------------------------
     3. DROPDOWN MENU（事業紹介）
     - デスクトップ：CSSのhoverで開閉
     - モバイル（ハンバーガー展開時）：タップで開閉するアコーディオン
  ---------------------------------------------------------- */
  document.querySelectorAll('.nav__item--has-dropdown').forEach(item => {
    const trigger = item.querySelector('.nav__dropdown-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', (e) => {
      // モバイルメニュー（ハンバーガー展開中）の場合はアコーディオンとして動作
      const isMobileMenuOpen = nav && nav.classList.contains('open');
      if (isMobileMenuOpen) {
        e.preventDefault();
        item.classList.toggle('open');
      }
      // デスクトップ時はリンクとして通常遷移（service.htmlへ）
    });
  });


  /* ----------------------------------------------------------
     4. SCROLL REVEAL（IntersectionObserver）
  ---------------------------------------------------------- */
  const revealTargets = [
    { selector: '.service__item',        delay: 0    },
    { selector: '.case-card',            delay: true },
    { selector: '.col-card',             delay: true },
    { selector: '.feature-card',         delay: true },
    { selector: '.voice-card',           delay: true },
    { selector: '.contact__inner',       delay: 0    },
    { selector: '.section__header-mask', delay: 0    },
  ];

  revealTargets.forEach(({ selector, delay }) => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('reveal');
      if (delay === true) {
        el.classList.add(`reveal-delay-${(i % 3) + 1}`);
      }
    });
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


  /* ----------------------------------------------------------
     5. SCROLL INDICATOR – スクロール後に非表示
  ---------------------------------------------------------- */
  const scrollIndicator = document.querySelector('.scroll-indicator');

  if (scrollIndicator) {
    window.addEventListener('scroll', () => {
      const hidden = window.scrollY > 80;
      scrollIndicator.style.opacity       = hidden ? '0' : '1';
      scrollIndicator.style.pointerEvents = hidden ? 'none' : '';
    }, { passive: true });
  }


  /* ----------------------------------------------------------
     6. SMOOTH ANCHOR SCROLL（固定ヘッダー分オフセット）
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();

      const headerH = header ? header.offsetHeight + 20 : 100;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* ----------------------------------------------------------
     7. ボタン hover – spring トランジション付与
  ---------------------------------------------------------- */
  document.querySelectorAll('.event-arrow, .pill-btn, .contact__icon-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      btn.style.transition =
        'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.2s';
    });
  });


  /* ----------------------------------------------------------
     8. カード スタガー（reveal 後に時差表示）
  ---------------------------------------------------------- */
  function staggerGrid(containerSelector, itemSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    container.querySelectorAll(itemSelector).forEach((item, i) => {
      item.style.transitionDelay = `${i * 0.1}s`;
    });
  }

  staggerGrid('.case__cards',    '.case-card');
  staggerGrid('.column__cards',  '.col-card');
  staggerGrid('.features__grid', '.feature-card');
  staggerGrid('.voice__cards',   '.voice-card');


  /* ----------------------------------------------------------
     9. ウォーターマーク スライドイン
  ---------------------------------------------------------- */
  const wObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity   = '0.55';
          entry.target.style.transform = 'translateX(0)';
          wObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.section__watermark').forEach(w => {
    w.style.opacity    = '0';
    w.style.transform  = 'translateX(-30px)';
    w.style.transition = 'opacity 1s ease, transform 1s ease';
    wObserver.observe(w);
  });


  /* ----------------------------------------------------------
     10. カルーセル ドット（Case Study 等）
  ---------------------------------------------------------- */
  const dots = document.querySelectorAll('.dot');

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      dots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
    });
  });

})();