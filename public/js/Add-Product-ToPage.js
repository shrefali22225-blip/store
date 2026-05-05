(function () {
  // ألوان دورانية للكروت (يستخدمها CSS عبر --c)
  const PALETTE = ['#5cc8ff', '#b388ff', '#ffb86b', '#5cffb8', '#ff7ad9', '#ff5c5c', '#fcd34d'];

  // ====== Card builder (نفس بيانات الـ API بدون أي تعديل) ======
  function cardHTML(p, idx) {
    const color    = PALETTE[idx % PALETTE.length];
    const outOfStk = Number(p.stock) <= 0;
    const stockTxt = outOfStk ? 'Out of stock' : `In stock: ${p.stock}`;

    return `
      <article class="ts-card" style="--c:${color}">
        <div class="ts-card__media">
          <div class="ts-card__bg"></div>
          <a href="${p.link}" class="ts-card__imgwrap">
            <img src="/img/${p.image}" alt="${p.alt || p.name}" />
          </a>

          <div class="ts-card__top">
            <span class="ts-badge ${outOfStk ? 'ts-badge--hot' : 'ts-badge--new'}">
              <i class="fa-solid ${outOfStk ? 'fa-ban' : 'fa-bolt'}"></i>
              ${outOfStk ? 'SOLD OUT' : 'IN STOCK'}
            </span>
            <button class="ts-fav" aria-label="favorite"><i class="fa-regular fa-heart"></i></button>
          </div>

          <div class="ts-card__cta">
            <button class="buy_btn"
                    data-id="${p.id}"
                    data-name="${p.name}"
                    data-price="${p.price}"
                    data-img="${p.image}"
                    data-stock="${p.stock}"
                    ${outOfStk ? 'disabled' : ''}>
              <i class="fa-solid fa-cart-shopping"></i>
              ${outOfStk ? 'Unavailable' : 'Add To Cart'}
            </button>
          </div>
        </div>

        <div class="ts-card__info">
          <div class="ts-card__row">
            <a class="ts-brand brandLink" href="${p.brandLink}">${p.brand}</a>
            <span class="ts-stock stock" data-stock="${p.stock}">
              <i class="fa-solid fa-box"></i> ${stockTxt}
            </span>
          </div>

          <h3 class="ts-name">
            <a href="${p.link}" class="proudct_name">${p.name}</a>
          </h3>

          <div class="ts-card__row ts-card__row--end">
            <div class="ts-price">
              <span class="ts-price__now">${p.price} EG</span>
            </div>
            <span class="ts-bar"></span>
          </div>
        </div>
      </article>
    `;
  }

  // ====== Slider behavior (per section) ======
  function initSlider(section) {
    const track = section.querySelector('.ts-track');
    const fill  = section.querySelector('.ts-progress__fill');
    const prev  = section.querySelector('.ts-nav[data-dir="-1"]');
    const next  = section.querySelector('.ts-nav[data-dir="1"]');

    function update() {
      const max = track.scrollWidth - track.clientWidth;
      const p   = max > 0 ? track.scrollLeft / max : 0;
      fill.style.width = Math.max(8, p * 100) + '%';
      prev.disabled = track.scrollLeft <= 4;
      next.disabled = track.scrollLeft >= max - 4;
    }

    section.querySelectorAll('.ts-nav').forEach(btn => {
      btn.addEventListener('click', () => {
        const dir = parseInt(btn.dataset.dir, 10);
        track.scrollBy({ left: dir * track.clientWidth * 0.8, behavior: 'smooth' });
      });
    });

    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();

    // Favorite toggle (للكروت اللي بتنزل من الـ fetch)
    track.addEventListener('click', (e) => {
      const fav = e.target.closest('.ts-fav');
      if (!fav) return;
      fav.classList.toggle('is-active');
      const i = fav.querySelector('i');
      i.classList.toggle('fa-regular');
      i.classList.toggle('fa-solid');
    });
  }

  // ====== Fetch + render for each section ======
  document.querySelectorAll('.ts-slider').forEach(section => {
    const url   = section.dataset.fetch;
    const track = section.querySelector('.ts-track');
    if (!url || !track) {
      initSlider(section);
      return;
    }

    fetch(url)
      .then(res => res.json())
      .then(data => {
        track.innerHTML = data.map((p, i) => cardHTML(p, i)).join('');
        initSlider(section);

        // نفس الهوك اللي عندك للستوك UI
        if (typeof updateStockUI === 'function') updateStockUI();
      })
      .catch(err => {
        console.error('Failed to load products from', url, err);
        initSlider(section);
      });
  });
})();