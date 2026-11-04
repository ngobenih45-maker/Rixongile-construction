(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const opened = nav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(opened));
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false');
    }));
  }

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealItems.forEach(item => observer.observe(item));
  } else revealItems.forEach(item => item.classList.add('visible'));

  // Subtle pointer-driven 3D card tilt on devices that support hover.
  if (window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('pointermove', event => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        card.style.transform = `perspective(950px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateY(-3px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }

  // Click-to-enlarge project gallery.
  const lightbox = document.querySelector('.lightbox');
  const lightboxImage = lightbox?.querySelector('img');
  const closeLightbox = () => { lightbox?.classList.remove('open'); lightbox?.setAttribute('aria-hidden', 'true'); };
  document.querySelectorAll('[data-lightbox]').forEach(tile => tile.addEventListener('click', event => {
    event.preventDefault(); if (!lightbox || !lightboxImage) return;
    lightboxImage.src = tile.getAttribute('href'); lightboxImage.alt = tile.querySelector('img')?.alt || 'Project photograph';
    lightbox.classList.add('open'); lightbox.setAttribute('aria-hidden', 'false');
  }));
  lightbox?.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeLightbox(); });

  // Quote form builds a tailored WhatsApp message from the visitor's selections.
  const form = document.getElementById('quoteForm');
  form?.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const phone = String(data.get('phone') || '').trim();
    const service = String(data.get('service') || '').trim();
    const email = String(data.get('email') || '').trim();
    const message = String(data.get('message') || '').trim();
    if (!name || !phone || !service) return;
    const lines = [
      'Hello Rixongile Construction (Pty) Ltd,', '',
      'I would like to request a quotation.',
      `Name: ${name}`, `Contact number: ${phone}`,
      email ? `Email: ${email}` : '', `Service: ${service}`,
      message ? `Project details: ${message}` : '', '',
      'Please contact me to discuss the next steps. Thank you.'
    ].filter(Boolean);
    window.open(`https://wa.me/27818842194?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener');
  });

  // Service-specific CTA links open WhatsApp with the service already selected.
  document.querySelectorAll('[data-service]').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    const service = link.dataset.service;
    const text = `Hello Rixongile Construction, I am interested in ${service}. Please send me more information and a quotation.`;
    window.open(`https://wa.me/27818842194?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  }));
})();
