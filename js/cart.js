/* BakeMate cart: dùng chung cho products.html, product-detail.html, cart.html */
(() => {
  'use strict';

  const STORAGE_KEY = 'bakemate_cart';
  const MAX_QTY = 99;
  const money = amount => new Intl.NumberFormat('vi-VN').format(amount) + ' ₫';
  const priceToNumber = text => Number(String(text).replace(/[^\d]/g, '')) || 0;

  function getProduct(productId, optionIndex) {
    const product = window.productsData?.[productId];
    const option = product?.options?.[optionIndex];
    if (!product || !option) return null;
    const stock = Number(product.stock);
    return {
      productId,
      optionIndex,
      name: product.fullName,
      image: product.images?.[0] || '',
      packaging: option.label.replace(/\s+-\s+[\d.,]+\s*₫\s*$/, ''),
      price: priceToNumber(option.price),
      limit: Number.isFinite(stock) ? Math.max(0, Math.min(MAX_QTY, stock)) : MAX_QTY
    };
  }

  function getCart() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (!Array.isArray(parsed)) return [];
      const unique = new Map();
      for (const row of parsed) {
        if (!row || typeof row.productId !== 'string' ||
            !Number.isInteger(row.optionIndex) || !Number.isInteger(row.quantity) ||
            row.quantity < 1) continue;
        const p = getProduct(row.productId, row.optionIndex);
        if (!p || p.limit === 0) continue;
        const key = row.productId + ':' + row.optionIndex;
        const previous = unique.get(key)?.quantity || 0;
        unique.set(key, {
          productId: row.productId,
          optionIndex: row.optionIndex,
          quantity: Math.min(p.limit, previous + row.quantity)
        });
      }
      return [...unique.values()];
    } catch (error) {
      console.error('Lỗi đọc giỏ hàng:', error);
      return [];
    }
  }

  function saveCart(cart) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
      window.dispatchEvent(new Event('bakemate:cartChanged'));
      return true;
    } catch (error) {
      console.error('Lỗi lưu giỏ hàng:', error);
      alert('Không thể lưu giỏ hàng. Hãy bật quyền lưu dữ liệu trong trình duyệt.');
      return false;
    }
  }

  function addToCart(productId, quantity = 1, optionIndex = 0) {
    const product = getProduct(productId, optionIndex);
    quantity = Number(quantity);
    if (!product || !Number.isInteger(quantity) || quantity < 1) return false;
    const cart = getCart();
    const existing = cart.find(row => row.productId === productId && row.optionIndex === optionIndex);
    const current = existing?.quantity || 0;
    if (current + quantity > product.limit) {
      alert(`Chỉ có thể mua tối đa ${product.limit} đơn vị của quy cách này.`);
      return false;
    }
    if (existing) existing.quantity += quantity;
    else cart.push({ productId, optionIndex, quantity });
    return saveCart(cart);
  }

  function removeFromCart(productId, optionIndex) {
    const cart = getCart();
    const next = cart.filter(row => row.productId !== productId || row.optionIndex !== optionIndex);
    return next.length !== cart.length && saveCart(next);
  }

  function updateQuantity(productId, optionIndex, quantity) {
    if (!Number.isInteger(quantity)) return false;
    if (quantity === 0) return removeFromCart(productId, optionIndex);
    const product = getProduct(productId, optionIndex);
    if (!product || quantity < 1) return false;
    if (quantity > product.limit) {
      alert(`Chỉ có thể mua tối đa ${product.limit} đơn vị của quy cách này.`);
      return false;
    }
    const cart = getCart();
    const existing = cart.find(row => row.productId === productId && row.optionIndex === optionIndex);
    if (!existing) return false;
    existing.quantity = quantity;
    return saveCart(cart);
  }

  const getCartCount = () => getCart().reduce((sum, row) => sum + row.quantity, 0);
  const getCartTotal = () => getCart().reduce((sum, row) => {
    const product = getProduct(row.productId, row.optionIndex);
    return sum + (product?.price || 0) * row.quantity;
  }, 0);

  function updateCartBadge() {
    const count = getCartCount();
    document.querySelectorAll('.cart-count').forEach(badge => {
      badge.textContent = String(count);
      badge.hidden = count === 0;
    });
    document.querySelectorAll('.site-header__cart').forEach(link => {
      link.setAttribute('aria-label', `Giỏ hàng: ${count} sản phẩm`);
    });
  }

  // Dùng createElement và textContent để không đưa dữ liệu sản phẩm vào innerHTML.
  function el(tag, className, content) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (content !== undefined) node.textContent = content;
    return node;
  }

  function renderCart() {
    const container = document.getElementById('cart-items');
    if (!container) return;
    const cart = getCart();
    const empty = document.getElementById('cart-empty');
    const content = document.getElementById('cart-content');
    empty.hidden = cart.length !== 0;
    content.hidden = cart.length === 0;
    container.replaceChildren();

    cart.forEach(item => {
      const p = getProduct(item.productId, item.optionIndex);
      if (!p) return;
      const row = el('article', 'cart-item');
      const link = el('a', 'cart-item__image-link');
      link.href = 'product-detail.html#' + item.productId;
      const img = el('img', 'cart-item__image');
      img.src = p.image;
      img.alt = p.name;
      img.loading = 'lazy';
      link.append(img);

      const info = el('div', 'cart-item__info');
      const name = el('a', 'cart-item__name', p.name);
      name.href = link.href;
      info.append(name, el('p', 'cart-item__packaging', p.packaging),
        el('p', 'cart-item__price', `Đơn giá: ${money(p.price)}`));

      const actions = el('div', 'cart-item__actions');
      const stepper = el('div', 'cart-quantity');
      const minus = el('button', '', '−');
      minus.type = 'button';
      minus.setAttribute('aria-label', 'Giảm số lượng ' + p.name);
      minus.disabled = item.quantity <= 1;
      minus.addEventListener('click', () => updateQuantity(item.productId, item.optionIndex, item.quantity - 1));
      const quantity = el('span', '', String(item.quantity));
      const plus = el('button', '', '+');
      plus.type = 'button';
      plus.setAttribute('aria-label', 'Tăng số lượng ' + p.name);
      plus.disabled = item.quantity >= p.limit;
      plus.addEventListener('click', () => updateQuantity(item.productId, item.optionIndex, item.quantity + 1));
      stepper.append(minus, quantity, plus);

      const subtotal = el('strong', 'cart-item__subtotal', money(p.price * item.quantity));
      const remove = el('button', 'cart-item__remove', 'Xóa sản phẩm');
      remove.type = 'button';
      remove.addEventListener('click', () => removeFromCart(item.productId, item.optionIndex));
      actions.append(stepper, subtotal, remove);
      row.append(link, info, actions);
      container.append(row);
    });

    document.getElementById('cart-item-count').textContent = String(getCartCount());
    document.getElementById('cart-total').textContent = money(getCartTotal());
  }

  function notify(message) {
    let toast = document.getElementById('bakemate-toast');
    if (!toast) {
      toast = el('div', 'cart-toast');
      toast.id = 'bakemate-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.append(toast);
    }
    toast.textContent = message;
    toast.classList.add('cart-toast--show');
    clearTimeout(notify.timer);
    notify.timer = setTimeout(() => toast.classList.remove('cart-toast--show'), 2300);
  }

  // Gắn cùng một xử lý cho danh sách sản phẩm và trang chi tiết.
  document.addEventListener('click', event => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const listButton = target.closest('[data-add-to-cart]');
    if (listButton) {
      const id = listButton.dataset.addToCart;
      if (addToCart(id, 1, 0)) notify('Đã thêm sản phẩm vào giỏ hàng!');
      return;
    }

    const detailButton = target.closest('.detail-page .product-detail__actions .btn--cart');
    if (!detailButton) return;
    const hash = location.hash.slice(1).trim();
    const id = window.productsData?.[hash] ? hash : 'bot-mi';
    const quantity = Number(document.getElementById('product-qty')?.value);
    const checked = document.querySelector('#packaging-options input[name="packaging"]:checked');
    const choices = Array.from(document.querySelectorAll('#packaging-options input[name="packaging"]'));
    const optionIndex = choices.indexOf(checked);
    if (optionIndex < 0) {
      alert('Vui lòng chọn quy cách đóng gói.');
      return;
    }
    if (addToCart(id, quantity, optionIndex)) notify('Đã thêm sản phẩm vào giỏ hàng!');
  });

  window.BakeMateCart = {
    getCart, addToCart, removeFromCart, updateQuantity,
    getCartCount, getCartTotal, renderCart, updateCartBadge
  };

  window.addEventListener('bakemate:cartChanged', () => {
    updateCartBadge();
    renderCart();
  });
  window.addEventListener('storage', event => {
    if (event.key === STORAGE_KEY || event.key === null) {
      updateCartBadge();
      renderCart();
    }
  });
  function initialize() {
    updateCartBadge();
    renderCart();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize);
  else initialize();
})();
