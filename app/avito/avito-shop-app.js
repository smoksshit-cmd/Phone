/**
 * Shop App - Магазин/* Приложение */
 * ...mobile-phone.js...Магазин...
 */

// @ts-nocheck
if (typeof window.RuApp_avito_shop === 'undefined') {
  class RuApp_avito_shop {
    constructor() {
      this.currentView = 'productList'; // 'productList', 'cart', 'checkout'
      this.currentTab = 'productList'; // 'productList', 'cart'
      this.currentProductType = 'all'; // 'all', 'Электроника', 'Одежда', 'Дом', etc.
      this.showCategories = false; // ...
      this.products = [];
      this.cart = [];
      this.contextMonitor = null;
      this.lastProductCount = 0;
      this.isAutoRenderEnabled = true;
      this.lastRenderTime = 0;
      this.renderCooldown = 1000;
      this.eventListenersSetup = false;
      this.contextCheckInterval = null;

      this.init();
    }

    init() {
      console.log('[Авито] Магазин/* Приложение */... - ... 3.3 (...Обновить)');

      // Товар
      this.parseProductsFromContext();

      // ，
      setTimeout(() => {
        this.setupContextMonitor();
      }, 100);

      console.log('[Авито] Магазин/* Приложение */... - ... 3.3');
    }

    // Настройка мониторинга контекста
    setupContextMonitor() {
      console.log('[Авито] Настройки......');

      // ，
      // SillyTavern（MESSAGE_RECEIVED CHAT_CHANGED）
      this.setupSillyTavernEventListeners();
    }

    // ОбновитьТовар（）
    refreshProductsData() {
      console.log('[Авито] 🔄 ...ОбновитьТовар......');
      this.parseProductsFromContext();
    }

    // НастройкиSillyTavern
    setupSillyTavernEventListeners() {
      // Настройки
      if (this.eventListenersSetup) {
        return;
      }

      try {
        // SillyTavern
        const eventSource = window['eventSource'];
        const event_types = window['event_types'];

        if (eventSource && event_types) {
          this.eventListenersSetup = true;

          // Обновить（СообщенияОбновить）
          const handleMessageReceived = () => {
            console.log('[Авито] 📨 ... MESSAGE_RECEIVED ...，ОбновитьТовар......');
            setTimeout(() => {
              this.parseProductsFromContext();

              // Если/* Приложение */Статус，ОбновитьUI
              const appContent = document.getElementById('app-content');
              if (appContent && (appContent.querySelector('.shop-product-list') ||
                                 appContent.querySelector('.shop-cart') ||
                                 appContent.querySelector('.shop-checkout'))) {
                console.log('[Авито] 🔄 ...ОбновитьМагазин/* Приложение */UI...');
                appContent.innerHTML = this.getAppContent();
                this.bindEvents();
              }
            }, 500);
          };

          // Сообщения（AIОтветить）
          if (event_types.MESSAGE_RECEIVED) {
            eventSource.on(event_types.MESSAGE_RECEIVED, handleMessageReceived);
            console.log('[Авито] ✅ ... MESSAGE_RECEIVED ...');
          }

          // （）
          if (event_types.CHAT_CHANGED) {
            eventSource.on(event_types.CHAT_CHANGED, () => {
              console.log('[Авито] 📨 ...，ОбновитьТовар......');
              setTimeout(() => {
                this.parseProductsFromContext();
              }, 500);
            });
            console.log('[Авито] ✅ ... CHAT_CHANGED ...');
          }

          // Сохранить
          this.messageReceivedHandler = handleMessageReceived;
        } else {
          // ，25
          setTimeout(() => {
            this.setupSillyTavernEventListeners();
          }, 5000);
        }
      } catch (error) {
        console.warn('[Авито] НастройкиSillyTavernerror:', error);
      }
    }

    debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    }

    // Товар（Форум/* Приложение */）
    parseProductsFromContext() {
      try {
        // Товар
        const shopData = this.getCurrentShopData();

        // Товар/* Список */
        if (shopData.products.length !== this.products.length || this.hasProductsChanged(shopData.products)) {
          this.products = shopData.products;
          console.log('[Авито] 🛒 Товар...，Товар...:', this.products.length);

          // /* Приложение */Статус
          if (this.isCurrentlyActive()) {
            console.log('[Авито] 🎨 Магазин/* Приложение */...Статус，...UI...');
            this.updateProductList();
          } else {
            console.log('[Авито] 💤 Магазин/* Приложение */...，...UI...');
          }
        } else {
          console.log('[Авито] 📊 Товар...，...');
        }
      } catch (error) {
        console.error('[Авито] errorТоварerror:', error);
      }
    }

    // Магазин/* Приложение */
    isCurrentlyActive() {
      const appContent = document.getElementById('app-content');
      if (!appContent) {
        console.log('[Авито] ❌ app-content ...');
        return false;
      }

      // Магазин/* Приложение */
      const hasProductList = appContent.querySelector('.shop-product-list') !== null;
      const hasCart = appContent.querySelector('.shop-cart') !== null;
      const hasCheckout = appContent.querySelector('.shop-checkout') !== null;
      const isActive = hasProductList || hasCart || hasCheckout;

      console.log('[Авито] ...Статус...:', {
        hasProductList,
        hasCart,
        hasCheckout,
        isActive,
        appContentHTML: appContent.innerHTML.substring(0, 100) + '...'
      });

      return isActive;
    }

    /**
     * ...（... Mvu ... + ...）
     */
    getCurrentShopData() {
      try {
        // 1: Mvu （：）
        if (window.Mvu && typeof window.Mvu.getMvuData === 'function') {
          // СообщенияID（AIСообщения）
          let targetMessageId = 'latest';

          if (typeof window.getLastMessageId === 'function' && typeof window.getChatMessages === 'function') {
            let currentId = window.getLastMessageId();

            // AIСообщения（ПользовательСообщения）
            while (currentId >= 0) {
              const message = window.getChatMessages(currentId).at(-1);
              if (message && message.role !== 'user') {
                targetMessageId = currentId;
                if (currentId !== window.getLastMessageId()) {
                  console.log(`[Авито] 📝 ... ${currentId} ...AIСообщения`);
                }
                break;
              }
              currentId--;
            }

            if (currentId < 0) {
              targetMessageId = 'latest';
              console.warn('[Авито] ⚠️ errorAIСообщения，error');
            }
          }

          console.log('[Авито] ...СообщенияID:', targetMessageId);

          const mvuData = window.Mvu.getMvuData({ type: 'message', message_id: targetMessageId });
          console.log('[Авито] ... Mvu ...:', mvuData);
          console.log('[Авито] stat_data ...:', !!mvuData?.stat_data);
          if (mvuData?.stat_data) {
            console.log('[Авито] stat_data ...:', Object.keys(mvuData.stat_data));
            console.log('[Авито] Товар...:', !!mvuData.stat_data['Товар']);
            if (mvuData.stat_data['Товар']) {
              console.log('[Авито] Товар...:', mvuData.stat_data['Товар']);
            }
          }

          // stat_data
          if (mvuData && mvuData.stat_data && mvuData.stat_data['Товар']) {
            const productData = mvuData.stat_data['Товар'];
            console.log('[Авито] ✅ ... stat_data ...Товар...:', productData);
            return this.parseProductData(productData);
          }

          // （ stat_data ）
          if (mvuData && mvuData['Товар']) {
            const productData = mvuData['Товар'];
            console.log('[Авито] ✅ ...Товар...:', productData);
            return this.parseProductData(productData);
          }

          // Если stat_data variables ， variables
          if (mvuData && !mvuData.stat_data && window.SillyTavern) {
            const context = window.SillyTavern.getContext ? window.SillyTavern.getContext() : window.SillyTavern;
            if (context && context.chatMetadata && context.chatMetadata.variables) {
              const stat_data = context.chatMetadata.variables['stat_data'];
              if (stat_data && stat_data['Товар']) {
                console.log('[Авито] ✅ ... variables.stat_data ...Товар...');
                return this.parseProductData(stat_data['Товар']);
              }
            }
          }
        }

        // 2: SillyTavern （）
        if (window.SillyTavern) {
          const context = window.SillyTavern.getContext ? window.SillyTavern.getContext() : window.SillyTavern;
          if (context && context.chatMetadata && context.chatMetadata.variables) {
            // variables.stat_data
            const stat_data = context.chatMetadata.variables['stat_data'];
            if (stat_data && stat_data['Товар']) {
              console.log('[Авито] ... context.chatMetadata.variables.stat_data ...Товар...');
              return this.parseProductData(stat_data['Товар']);
            }

            // variables
            const productData = context.chatMetadata.variables['Товар'];
            if (productData && typeof productData === 'object') {
              console.log('[Авито] ... context.chatMetadata.variables ...Товар...');
              return this.parseProductData(productData);
            }
          }
        }

        console.log('[Авито] ...Товар...');
      } catch (error) {
        console.warn('[Авито] errorТоварerror:', error);
      }

      return { products: [] };
    }

    /**
     * ...Товар...
     * Товар/* Структура */：{ s001: {Товар...: [..., ''], Цена: [..., ''], Наличие: [..., ''], ...: [..., ''], ...: [..., ''], ...: [..., '']}, ... }
     */
    parseProductData(productData) {
      const products = [];

      try {
        // Товар
        Object.keys(productData).forEach(productKey => {
          if (productKey === '$meta') return;

          const product = productData[productKey];
          if (!product || typeof product !== 'object') return;

          // Товар（：[, ]）
          const getName = (field) => product[field] && Array.isArray(product[field]) ? product[field][0] : '';
          const getNumber = (field) => {
            const val = product[field] && Array.isArray(product[field]) ? product[field][0] : 0;
            return typeof val === 'number' ? val : parseFloat(val) || 0;
          };

          const name = getName('Товар...') || productKey;
          const price = getNumber('Цена');
          const stock = getNumber('Наличие');
          const category = getName('...') || '...';
          const description = getName('...') || '...';
          const quality = getName('...') || '...';

          // Товар（ЦенаНаличие0）
          if (!name || price <= 0 || stock <= 0) return;

          const newProduct = {
            id: productKey,
            name: name,
            type: category,
            description: description,
            price: price,
            image: this.getProductImage(category),
            stock: stock,
            quality: quality, // ...
            category: category,
            timestamp: new Date().toLocaleString(),
          };

          products.push(newProduct);
        });

        console.log('[Авито] ...Товар...，Товар...:', products.length);
      } catch (error) {
        console.error('[Авито] errorТоварerror:', error);
      }

      return { products };
    }

    /**
     * ...
     */
    parseSixDimensions(sixDimData) {
      if (!sixDimData || typeof sixDimData !== 'object') return null;

      const result = {};
      const dims = ['...', '...', '...', '...', '...', '...'];

      dims.forEach(dim => {
        if (sixDimData[dim] && Array.isArray(sixDimData[dim])) {
          const value = sixDimData[dim][0];
          if (typeof value === 'number' && value !== 0) {
            result[dim] = value;
          }
        }
      });

      return Object.keys(result).length > 0 ? result : null;
    }

    // Товар（）
    hasProductsChanged(newProducts) {
      if (newProducts.length !== this.products.length) {
        return true;
      }

      for (let i = 0; i < newProducts.length; i++) {
        const newProduct = newProducts[i];
        const oldProduct = this.products[i];

        if (
          !oldProduct ||
          newProduct.name !== oldProduct.name ||
          newProduct.type !== oldProduct.type ||
          newProduct.description !== oldProduct.description ||
          newProduct.price !== oldProduct.price
        ) {
          return true;
        }
      }

      return false;
    }

    // Товар
    getProductImage(type) {
      const imageMap = {
        // Товар
        ...: '💊',
        ...: '⚔️',
        ...: '📦',
        ...: '✨',
        Еда: '🍎',
        ...: '🍎',
        ...: '🥤',
        Одежда: '👔',
        Электроника: '📱',
        Дом: '🏠',
        Красота: '💄',
        Спорт: '⚽',
        Книги: '📚',
        ...: '🧸',
        ...: '🎵',
        ...: '🛒',
        ...: '🛒',
      };
      return imageMap[type] || imageMap['...'];
    }

    getChatData() {
      try {
        // mobileContextEditor
        const mobileContextEditor = window['mobileContextEditor'];
        if (mobileContextEditor) {
          const chatData = mobileContextEditor.getCurrentChatData();
          if (chatData && chatData.messages && chatData.messages.length > 0) {
            return chatData.messages;
          }
        }

        const chat = window['chat'];
        if (chat && Array.isArray(chat)) {
          return chat;
        }

        const SillyTavern = window['SillyTavern'];
        if (SillyTavern && SillyTavern.chat) {
          return SillyTavern.chat;
        }

        return [];
      } catch (error) {
        console.error('[Авито] error:', error);
        return [];
      }
    }

    // /* Приложение */
    getAppContent() {
      // Открыть/* Приложение */（Новое）
      const shopData = this.getCurrentShopData();
      if (shopData.products.length !== this.products.length || this.hasProductsChanged(shopData.products)) {
        this.products = shopData.products;
        console.log('[Авито] 🛒 Открыть/* Приложение */...Товар...，Товар...:', this.products.length);
      }

      switch (this.currentView) {
        case 'productList':
          return this.renderProductList();
        case 'cart':
          return this.renderCart();
        case 'checkout':
          return this.renderCheckout();
        default:
          return this.renderProductList();
      }
    }

    // Магазин
    renderShopTabs() {
      const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
      const productCount = this.products.length;

      return `
          <div class="shop-tabs">
              <button class="shop-tab ${this.currentTab === 'productList' ? 'active' : ''}"
                      data-tab="productList">
                  Товар/* Список */ (${productCount})
              </button>
              <button class="shop-tab ${this.currentTab === 'cart' ? 'active' : ''}"
                      data-tab="cart">
                  Корзина (${totalItems})
              </button>
          </div>
      `;
    }

    // Товар/* Список */
    renderProductList() {
      console.log('[Авито] ...Товар/* Список */...');

      const allTypes = ['all', ...new Set(this.products.map(p => p.type))];

      // Товар
      const filteredProducts =
        this.currentProductType === 'all'
          ? this.products
          : this.products.filter(p => p.type === this.currentProductType);

      if (!this.products.length) {
        return `
                <div class="shop-product-list">
                    ${this.renderShopTabs()}
                    <div class="shop-empty-state">
                        <div class="empty-icon">🛒</div>
                        <div class="empty-title">...Товар</div>
                    </div>
                </div>
            `;
      }

      // （）
      const typeTabsHtml = this.showCategories
        ? `
          <div class="product-type-tabs">
              ${allTypes
                .map(
                  type => `
                  <button class="product-type-tab ${this.currentProductType === type ? 'active' : ''}"
                          data-type="${type}">
                      ${type === 'all' ? 'Все' : type}
                  </button>
              `,
                )
                .join('')}
          </div>
      `
        : '';

      const productItems = filteredProducts
        .map(
          product => {
            // Товар
            const qualityText = product.quality ? `<span class="product-quality">...: ${product.quality}</span>` : '';
            const stockText = `<span class="product-stock">Наличие: ${product.stock}</span>`;

            return `
            <div class="product-item" data-product-id="${product.id}">
                <div class="product-info">
                    <div class="product-header">
                        <div class="product-name">${product.image} ${product.name}</div>
                        <div class="product-type-badge">${product.type}</div>
                    </div>
                    <div class="product-meta">
                        ${qualityText}
                        ${stockText}
                    </div>
                    <div class="product-description">${product.description}</div>
                    <div class="product-footer">
                        <div class="product-price">💰 ${product.price} ...</div>
                        <button class="add-to-cart-btn" data-product-id="${product.id}">
                            ...Корзина
                        </button>
                    </div>
                </div>
            </div>
            `;
          }
        )
        .join('');

      return `
            <div class="shop-product-list">
                ${this.renderShopTabs()}
                ${typeTabsHtml}
                <div class="product-grid">
                    ${productItems}
                </div>
            </div>
        `;
    }

    // Корзина
    renderCart() {
      console.log('[Авито] ...Корзина...');

      if (!this.cart.length) {
        return `
                <div class="shop-cart">
                    ${this.renderShopTabs()}
                    <div class="shop-empty-state">
                        <div class="empty-icon">🛒</div>
                        <div class="empty-title">Корзина...</div>
                        <div class="empty-subtitle">...Товар...</div>
                    </div>
                </div>
            `;
      }

      const cartItems = this.cart
        .map(
          item => {
            // Товар
            const qualityText = item.quality ? `<span class="cart-quality">...: ${item.quality}</span>` : '';

            return `
            <div class="cart-item" data-product-id="${item.id}">
                <div class="cart-item-info">
                    <div class="cart-item-header">
                        <div class="cart-item-name">${item.image} ${item.name}</div>
                        <div class="cart-item-type">${item.type}</div>
                    </div>
                    <div class="cart-item-meta">
                        ${qualityText}
                    </div>
                    <div class="cart-item-description">${item.description}</div>
                    <div class="cart-item-footer">
                        <div class="cart-item-price">💰 ${item.price} ...</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn minus" data-product-id="${item.id}">-</button>
                            <span class="quantity-value">${item.quantity}</span>
                            <button class="quantity-btn plus" data-product-id="${item.id}">+</button>
                        </div>
                        <button class="remove-item-btn" data-product-id="${item.id}">🗑️</button>
                    </div>
                </div>
            </div>
            `;
          }
        )
        .join('');

      const totalPrice = this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);

      return `
            <div class="shop-cart">
                ${this.renderShopTabs()}
                <div class="cart-items">
                    ${cartItems}
                </div>
                <div class="cart-footer">
                    <div class="cart-summary">
                        <div class="cart-count">...${totalItems}...Товар</div>
                        <div class="cart-total">
                            <span class="total-label">...：</span>
                            <span class="total-price">💰 ${totalPrice} ...</span>
                        </div>
                    </div>
                    <div class="cart-actions">
                        <button class="checkout-btn">...</button>
                    </div>
                </div>
            </div>
        `;
    }

    renderCheckout() {
      console.log('[Авито] ......');

      const totalPrice = this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);

      const orderItems = this.cart
        .map(
          item => `
            <div class="order-item">
                <span class="order-item-name">${item.image} ${item.name}</span>
                <span class="order-item-quantity">x${item.quantity}</span>
                <span class="order-item-price">💰 ${item.price * item.quantity} ...</span>
            </div>
        `,
        )
        .join('');

      return `
            <div class="shop-checkout">
                <div class="checkout-header">
                    <div class="checkout-title">ЗаказПодтвердить</div>
                </div>
                <div class="order-summary">
                    <div class="order-title">Заказ...</div>
                    ${orderItems}
                    <div class="order-total">
                        <div class="total-items">... ${totalItems} ...Товар</div>
                        <div class="total-price">...：💰 ${totalPrice} ...</div>
                    </div>
                </div>
                <div class="checkout-actions">
                    <button class="back-to-cart-btn">НазадКорзина</button>
                    <button class="confirm-order-btn">ПодтвердитьЗаказ</button>
                </div>
            </div>
        `;
    }

    // Товар/* Список */
    updateProductList() {
      if (this.currentView === 'productList') {
        this.updateAppContent();
      }
    }

    // /* Приложение */
    updateAppContent(preserveScrollPosition = false) {
      const appContent = document.getElementById('app-content');
      if (appContent) {
        // Сохранить
        let scrollTop = 0;
        if (preserveScrollPosition) {
          const scrollContainer = appContent.querySelector('.product-grid, .cart-items');
          if (scrollContainer) {
            scrollTop = scrollContainer.scrollTop;
          }
        }

        appContent.innerHTML = this.getAppContent();
        this.bindEvents();

        if (preserveScrollPosition && scrollTop > 0) {
          setTimeout(() => {
            const scrollContainer = appContent.querySelector('.product-grid, .cart-items');
            if (scrollContainer) {
              scrollContainer.scrollTop = scrollTop;
            }
          }, 0);
        }
      }
    }

    // /* Приложение */（）
    renderApp() {
      return this.getAppContent();
    }

    bindEvents() {
      console.log('[Авито] ......');

      // Корзина
      document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', e => {
          e.preventDefault();
          e.stopPropagation();
          const productId = e.target?.getAttribute('data-product-id');
          this.addToCart(productId);
        });
      });

      // Корзина
      document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', e => {
          e.preventDefault();
          e.stopPropagation();
          const target = e.target;
          const productId = target?.getAttribute('data-product-id');
          const isPlus = target?.classList?.contains('plus');
          this.updateCartQuantity(productId, isPlus);
        });
      });

      // УдалитьКорзина
      document.querySelectorAll('.remove-item-btn').forEach(btn => {
        btn.addEventListener('click', e => {
          e.preventDefault();
          e.stopPropagation();
          const productId = e.target?.getAttribute('data-product-id');
          this.removeFromCart(productId);
        });
      });

      document.querySelectorAll('.back-to-shop-btn').forEach(btn => {
        btn.addEventListener('click', e => {
          e.preventDefault();
          e.stopPropagation();
          this.showProductList();
        });
      });

      document.querySelectorAll('.checkout-btn').forEach(btn => {
        btn.addEventListener('click', e => {
          e.preventDefault();
          e.stopPropagation();
          this.showCheckout();
        });
      });

      document.querySelectorAll('.back-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', e => {
          e.preventDefault();
          e.stopPropagation();
          this.showCart();
        });
      });

      document.querySelectorAll('.confirm-order-btn').forEach(btn => {
        btn.addEventListener('click', e => {
          e.preventDefault();
          e.stopPropagation();
          this.confirmOrder();
        });
      });

      // Магазин
      document.querySelectorAll('.shop-tab').forEach(btn => {
        btn.addEventListener('click', e => {
          e.preventDefault();
          e.stopPropagation();
          const tab = e.target?.getAttribute('data-tab');
          this.switchTab(tab);
        });
      });

      document.querySelectorAll('.product-type-tab').forEach(btn => {
        btn.addEventListener('click', e => {
          e.preventDefault();
          e.stopPropagation();
          const type = e.target?.getAttribute('data-type');
          this.switchProductType(type);
        });
      });
    }

    // Магазин
    switchTab(tab) {
      console.log('[Авито] ...:', tab);
      this.currentTab = tab;
      this.currentView = tab;
      this.updateAppContent();
    }

    switchProductType(type) {
      console.log('[Авито] ...:', type);
      this.currentProductType = type;
      this.updateAppContent();
    }

    toggleCategories() {
      console.log('[Авито] ...:', !this.showCategories);
      this.showCategories = !this.showCategories;
      this.updateAppContent();
    }

    // Корзина
    addToCart(productId) {
      const product = this.products.find(p => p.id === productId);
      if (!product) return;

      const existingItem = this.cart.find(item => item.id === productId);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        this.cart.push({
          ...product,
          quantity: 1,
        });
      }

      this.showToast(`${product.name} ...Корзина`, 'success');
      this.updateCartBadge();
    }

    // Корзина
    updateCartQuantity(productId, isPlus) {
      const item = this.cart.find(item => item.id === productId);
      if (!item) return;

      if (isPlus) {
        item.quantity += 1;
      } else {
        item.quantity -= 1;
        if (item.quantity <= 0) {
          this.removeFromCart(productId);
          return;
        }
      }

      this.updateAppContent(true); // ...
      this.updateCartBadge();
    }

    // Корзина
    removeFromCart(productId) {
      this.cart = this.cart.filter(item => item.id !== productId);
      this.updateAppContent(true); // ...
      this.updateCartBadge();
    }

    // Корзина
    updateCartBadge() {
      const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);

      // Корзина，
      const cartTab = document.querySelector('.shop-tab[data-tab="cart"]');
      if (cartTab) {
        cartTab.textContent = `Корзина (${totalItems})`;
      }
    }

    // Товар/* Список */
    showProductList() {
      this.currentView = 'productList';
      this.currentTab = 'productList';
      this.updateAppContent();
      this.updateHeader();
    }

    // Корзина
    showCart() {
      this.currentView = 'cart';
      this.currentTab = 'cart';
      this.updateAppContent();
      this.updateHeader();
    }

    showCheckout() {
      if (this.cart.length === 0) {
        this.showToast('Корзина...', 'warning');
        return;
      }

      this.currentView = 'checkout';
      this.updateAppContent();
      this.updateHeader();
    }

    // ПодтвердитьЗаказ（，Сообщения）
    async confirmOrder() {
      if (this.cart.length === 0) {
        this.showToast('Корзина...', 'warning');
        return;
      }

      try {
        // Mvu
        await this.updateVariablesDirectly();

      // Корзина
      this.cart = [];
      this.updateCartBadge();

        // ОбновитьТовар/* Список */（）
        this.refreshProductsData();

        // УведомлениеРюкзакОбновить
        if (window.backpackApp && typeof window.backpackApp.refreshItemsData === 'function') {
          console.log('[Авито] УведомлениеРюкзак/* Приложение */Обновить...');
          setTimeout(() => {
            window.backpackApp.refreshItemsData();
          }, 500);
        }

        // Сообщения
        this.showToast('Заказ...Подтвердить！', 'success');

        // НазадТовар/* Список */
        setTimeout(() => {
          this.showProductList();
        }, 1500);
      } catch (error) {
        console.error('[Авито] ПодтвердитьЗаказerror:', error);
        this.showToast('ЗаказПодтвердить...: ' + error.message, 'error');
      }
    }

    // Заказ
    generateOrderSummary() {
      const totalPrice = this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);

      const itemsList = this.cart
        .map(item => `${item.name} x${item.quantity} = ${item.price * item.quantity} ...`)
        .join('\n');

      return `ЗаказПодтвердить：
${itemsList}
...：${totalItems}...Товар，${totalPrice} ...`;
    }

    // Mvu（Сообщения）
    async updateVariablesDirectly() {
      try {
        console.log('[Авито] ......');

        // СообщенияID
        let targetMessageId = 'latest';
        if (typeof window.getLastMessageId === 'function' && typeof window.getChatMessages === 'function') {
          let currentId = window.getLastMessageId();
          while (currentId >= 0) {
            const message = window.getChatMessages(currentId).at(-1);
            if (message && message.role !== 'user') {
              targetMessageId = currentId;
              break;
            }
            currentId--;
          }
        }

        // Mvu
        const mvuData = window.Mvu.getMvuData({ type: 'message', message_id: targetMessageId });
        if (!mvuData || !mvuData.stat_data) {
          throw new Error('errorMvuerror');
        }

        const totalPrice = this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        // 1.
        const currentMoney = mvuData.stat_data['Пользователь']?.['...']?.[0] || 0;
        if (currentMoney < totalPrice) {
          throw new Error(`error，error：${currentMoney}，error：${totalPrice}`);
        }

        await window.Mvu.setMvuVariable(mvuData, 'Пользователь....[0]', currentMoney - totalPrice, {
          reason: '...Товар...',
          is_recursive: false
        });
        console.log(`[Авито] ✅ ...: ${totalPrice}`);

        // 2. Товар
        for (const item of this.cart) {
          const itemKey = item.id; // ТоварID...
          console.log(`[Авито] ...Товар: ${item.name}, itemKey: ${itemKey}, category: ${item.category}`);

          // 2.1 ТоварНаличие
          const productPath = `Товар.${itemKey}`;
          const product = mvuData.stat_data['Товар']?.[itemKey];
          if (product) {
            const currentStock = product['Наличие']?.[0] || 0;
            const newStock = currentStock - item.quantity;

            if (newStock <= 0) {
              // Наличие0，УдалитьТовар
              await window.Mvu.setMvuVariable(mvuData, productPath, null, {
                reason: 'Товар...',
                is_recursive: false
              });
              console.log(`[Авито] ✅ Товар...Удалить: ${productPath}`);
            } else {
              // Наличие
              await window.Mvu.setMvuVariable(mvuData, `${productPath}.Наличие[0]`, newStock, {
                reason: '...ТоварНаличие',
                is_recursive: false
              });
              console.log(`[Авито] ✅ ...Наличие: ${productPath}.Наличие[0] = ${newStock}`);
            }
          }

          // 2.2 Рюкзак（：）
          const targetCategory = this.mapCategoryToBackpack(item.category);
          const backpackPath = `....${targetCategory}`;
          const backpackCategory = mvuData.stat_data['...']?.[targetCategory] || {};

          console.log(`[Авито] ...: ${backpackPath}.${item.name}`);
          console.log(`[Авито] ...:`, backpackCategory);

          // （）
          const newBackpackCategory = { ...backpackCategory };

          const existingItem = newBackpackCategory[item.name];
          if (existingItem) {
            // ，
            const currentCount = existingItem['...']?.[0] || 0;
            const newCount = currentCount + item.quantity;
            newBackpackCategory[item.name] = {
              ...existingItem,
              ...: [newCount, existingItem['...']?.[1] || '']
            };
            console.log(`[Авито] ✅ ...: ${item.name} ... = ${newCount}`);
          } else {
            // ，
            const itemData = this.buildBackpackItemData(item);
            console.log(`[Авито] ...:`, itemData);
            newBackpackCategory[item.name] = itemData;
            console.log(`[Авито] ✅ ...: ${item.name}`);
          }

          // Настройки（：）
          await window.Mvu.setMvuVariable(mvuData, backpackPath, newBackpackCategory, {
            reason: `...${item.name}...Рюкзак`,
            is_recursive: false
          });
          console.log(`[Авито] ✅ ...: ${backpackPath}`);
        }

        // 3. （AI）
        // AIОтветить

        // Сохранить
        await window.Mvu.replaceMvuData(mvuData, { type: 'message', message_id: targetMessageId });

        console.log('[Авито] ✅ ...');
      } catch (error) {
        console.error('[Авито] error:', error);
        throw error;
      }
    }

    generateUpdateCommands() {
      const commands = [];

      // 1.
      const totalPrice = this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      commands.push(`_.add('.......[0]', -${totalPrice});//...`);

      // 2. Товар
      this.cart.forEach(item => {
        // Товар
        const categoryPath = `....${item.category}`;
        const itemKey = this.getItemKeyFromId(item.id, item.category);
        if (itemKey) {
          commands.push(`_.add('${categoryPath}.${itemKey}....[0]', -${item.quantity});//...Товар...`);
        }

        // Рюкзак
        const targetCategory = this.mapCategoryToBackpack(item.category);
        const backpackPath = `....${targetCategory}`;

        const itemData = this.buildBackpackItemData(item);

        commands.push(`_.insert('${backpackPath}', '${item.name}', ${JSON.stringify(itemData)});//...Рюкзак`);
      });

      // 3.
      const itemsList = this.cart.map(item => `${item.name}x${item.quantity}`).join('、');
      const currentTime = this.getCurrentGameTime();
      commands.push(`_.assign('.......[0]', '${currentTime} - ...${itemsList}');//...`);

      return commands.join('\n');
    }

    // ТоварID
    getItemKeyFromId(id, category) {
      // ID: category_itemKey_timestamp
      const parts = id.split('_');
      if (parts.length >= 2 && parts[0] === category) {
        return parts[1];
      }
      return null;
    }

    // ТоварРюкзак
    mapCategoryToBackpack(productCategory) {
      const mapping = {
        '...': '...',
        '...': '...',
        '...': '...',
        '...': '...',
        'Еда': '...',
        '...': '...',
        '...': '...',
        'Одежда': '...',
        'Электроника': '...',
        'Дом': '...',
        '...': '...'
      };
      return mapping[productCategory] || '...';
    }

    // Рюкзак
    buildBackpackItemData(item) {
      const data = {
        ...: [item.name, ''],
        ...: [item.quantity, ''],
        ...: [item.description, ''],
        ...: [item.quality || '...', '']
      };

      return data;
    }

    // Время（AIСообщения）
    getCurrentGameTime() {
      try {
        // Mvu （AIСообщения）
        if (window.Mvu && typeof window.Mvu.getMvuData === 'function') {
          // СообщенияID（AIСообщения）
          let targetMessageId = 'latest';

          if (typeof window.getLastMessageId === 'function' && typeof window.getChatMessages === 'function') {
            let currentId = window.getLastMessageId();

            // AIСообщения（ПользовательСообщения）
            while (currentId >= 0) {
              const message = window.getChatMessages(currentId).at(-1);
              if (message && message.role !== 'user') {
                targetMessageId = currentId;
                break;
              }
              currentId--;
            }

            if (currentId < 0) {
              targetMessageId = 'latest';
            }
          }

          const mvuData = window.Mvu.getMvuData({ type: 'message', message_id: targetMessageId });
          if (mvuData && mvuData.stat_data && mvuData.stat_data['...']) {
            const familyInfo = mvuData.stat_data['...'];
            if (familyInfo....Время && Array.isArray(familyInfo....Время)) {
              const timeValue = familyInfo....Время[0];
              if (timeValue) return timeValue;
            }
          }
        }

        // ： SillyTavern context
        if (window.SillyTavern) {
          const context = window.SillyTavern.getContext ? window.SillyTavern.getContext() : window.SillyTavern;
          if (context && context.chatMetadata && context.chatMetadata.variables) {
            const familyInfo = context.chatMetadata.variables['...'];
            if (familyInfo && familyInfo....Время && Array.isArray(familyInfo....Время)) {
              const timeValue = familyInfo....Время[0];
              if (timeValue) return timeValue;
            }
          }
        }
      } catch (error) {
        console.warn('[Авито] errorВремяerror:', error);
      }
      return '...Время';
    }

    // ТоварСообщения
    sendViewProductsMessage() {
      try {
        console.log('[Авито] ...ТоварСообщения');

        const message = '<Request:Meta-instructions：...，...，...10...Товар,...,...Товар>...Товар';

        // Сообщенияapp
        this.sendToSillyTavern(message);
      } catch (error) {
        console.error('[Авито] errorТоварСообщенияerror:', error);
      }
    }

    // Сообщения（СообщенияappsendToChat）
    async sendToSillyTavern(message) {
      try {
        console.log('[Авито] 🔄 ... v2.0 - ...Сообщения...SillyTavern:', message);

        // 1: DOM（Сообщенияapp）
        const originalInput = document.getElementById('send_textarea');
        const sendButton = document.getElementById('send_but');

        if (!originalInput || !sendButton) {
          console.error('[Авито] error/* Поле ввода */error');
          return this.sendToSillyTavernBackup(message);
        }

        // /* Поле ввода */
        if (originalInput.disabled) {
          console.warn('[Авито] /* Поле ввода */error');
          return false;
        }

        if (sendButton.classList.contains('disabled')) {
          console.warn('[Авито] error');
          return false;
        }

        // Настройки
        originalInput.value = message;
        console.log('[Авито] ...Настройки/* Поле ввода */...:', originalInput.value);

        originalInput.dispatchEvent(new Event('input', { bubbles: true }));
        originalInput.dispatchEvent(new Event('change', { bubbles: true }));

        await new Promise(resolve => setTimeout(resolve, 300));
        sendButton.click();
        console.log('[Авито] ...');

        return true;
      } catch (error) {
        console.error('[Авито] errorСообщенияerror:', error);
        return this.sendToSillyTavernBackup(message);
      }
    }

    async sendToSillyTavernBackup(message) {
      try {
        console.log('[Авито] ...:', message);

        // /* Поле ввода */
        const textareas = document.querySelectorAll('textarea');
        const inputs = document.querySelectorAll('input[type="text"]');

        if (textareas.length > 0) {
          const textarea = textareas[0];
          textarea.value = message;
          textarea.focus();

          textarea.dispatchEvent(new Event('input', { bubbles: true }));
          textarea.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
          return true;
        }

        return false;
      } catch (error) {
        console.error('[Авито] error:', error);
        return false;
      }
    }

    // ОбновитьТовар/* Список */
    refreshProductList() {
      console.log('[Авито] ...ОбновитьТовар/* Список */');
      this.parseProductsFromContext();
      this.updateAppContent();
    }

    // /* Приложение */，
    destroy() {
      console.log('[Авито] .../* Приложение */，...');

      if (this.eventListenersSetup && this.messageReceivedHandler) {
        const eventSource = window['eventSource'];
        if (eventSource && eventSource.removeListener) {
          eventSource.removeListener('MESSAGE_RECEIVED', this.messageReceivedHandler);
          console.log('[Авито] 🗑️ ... MESSAGE_RECEIVED ...');
        }
      }

      // Статус
      this.eventListenersSetup = false;
      this.isAutoRenderEnabled = false;

      this.products = [];
      this.cart = [];
    }

    // header
    updateHeader() {
      // Уведомлениеmobile-phoneheader
      if (window.mobilePhone && window.mobilePhone.updateAppHeader) {
        const state = {
          app: 'shop',
          title: this.getViewTitle(),
          view: this.currentView,
        };
        window.mobilePhone.updateAppHeader(state);
      }
    }

    getViewTitle() {
      return 'Магазин';
    }

    // Сообщения
    showToast(message, type = 'info') {
      const toast = document.createElement('div');
      toast.className = `shop-toast ${type}`;
      toast.textContent = message;

      document.body.appendChild(toast);

      setTimeout(() => {
        toast.classList.add('show');
      }, 100);

      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
          toast.remove();
        }, 300);
      }, 3000);
    }
  }

  window.RuApp_avito_shop = ShopApp;
  window.shopApp = new RuApp_avito_shop();
} // ...

// mobile-phone.js
window.getShopAppContent = function () {
  console.log('[Авито] ...Магазин/* Приложение */...');

  if (!window.shopApp) {
    console.error('[Авито] shopApperror');
    return '<div class="error-message">Магазин/* Приложение */...</div>';
  }

  try {
    return window.shopApp.getAppContent();
  } catch (error) {
    console.error('[Авито] error/* Приложение */error:', error);
    return '<div class="error-message">...</div>';
  }
};

window.bindShopAppEvents = function () {
  console.log('[Авито] ...Магазин/* Приложение */...');

  if (!window.shopApp) {
    console.error('[Авито] shopApperror');
    return;
  }

  try {
    window.shopApp.bindEvents();
  } catch (error) {
    console.error('[Авито] error:', error);
  }
};

// mobile-phone.js
window.shopAppShowCart = function () {
  if (window.shopApp) {
    window.shopApp.showCart();
  }
};

window.shopAppSendViewMessage = function () {
  if (window.shopApp) {
    window.shopApp.sendViewProductsMessage();
  }
};

window.shopAppToggleCategories = function () {
  if (window.shopApp) {
    window.shopApp.toggleCategories();
  }
};

window.shopAppRefresh = function () {
  if (window.shopApp) {
    window.shopApp.refreshProductList();
  }
};

window.shopAppDebugInfo = function () {
  if (window.shopApp) {
    console.log('[Shop App Debug] ...Товар...:', window.shopApp.products.length);
    console.log('[Shop App Debug] Товар/* Список */:', window.shopApp.products);
    console.log('[Shop App Debug] Корзина:', window.shopApp.cart);
    console.log('[Shop App Debug] ...:', window.shopApp.currentView);
    console.log('[Shop App Debug] ...Настройки:', window.shopApp.eventListenersSetup);
    console.log('[Shop App Debug] ...:', window.shopApp.isAutoRenderEnabled);

    // （AIСообщения）
    console.log('[Shop App Debug] ===== ... =====');
    console.log('[Shop App Debug] Mvu ...:', !!window.Mvu);
    console.log('[Shop App Debug] Mvu.getMvuData ...:', typeof window.Mvu?.getMvuData === 'function');
    console.log('[Shop App Debug] getLastMessageId ...:', typeof window.getLastMessageId === 'function');
    console.log('[Shop App Debug] getChatMessages ...:', typeof window.getChatMessages === 'function');

    if (window.Mvu && typeof window.Mvu.getMvuData === 'function') {
      try {
        // СообщенияID（AIСообщения）
        let targetMessageId = 'latest';

        if (typeof window.getLastMessageId === 'function' && typeof window.getChatMessages === 'function') {
          let currentId = window.getLastMessageId();
          console.log('[Shop App Debug] НовоеСообщения...:', currentId);

          // AIСообщения
          let searchCount = 0;
          while (currentId >= 0 && searchCount < 20) {
            const message = window.getChatMessages(currentId).at(-1);
            console.log(`[Shop App Debug] ... ${currentId} ...:`, message ? `role=${message.role}` : '...Сообщения');

            if (message && message.role !== 'user') {
              targetMessageId = currentId;
              console.log(`[Shop App Debug] ✅ ...AIСообщения...: ${currentId} (... ${searchCount} ...)`);
              break;
            }

            currentId--;
            searchCount++;
          }

          if (currentId < 0) {
            console.warn('[Shop App Debug] ⚠️ errorПользовательСообщения，error latest');
          }
        }

        console.log('[Shop App Debug] ...СообщенияID:', targetMessageId);

        // Mvu
        const mvuData = window.Mvu.getMvuData({ type: 'message', message_id: targetMessageId });
        console.log('[Shop App Debug] Mvu ...:', mvuData);

        if (mvuData && mvuData.stat_data) {
          console.log('[Shop App Debug] stat_data .../* Список */:', Object.keys(mvuData.stat_data));

          if (mvuData.stat_data['...']) {
            const auctionData = mvuData.stat_data['...'];
            console.log('[Shop App Debug] ...:', auctionData);

            Object.keys(auctionData).forEach(category => {
              if (category !== '$meta') {
                const items = auctionData[category];
                if (items && typeof items === 'object') {
                  const itemKeys = Object.keys(items).filter(k => k !== '$meta');
                  console.log(`[Shop App Debug] - ... ${category}: ${itemKeys.length} ...`, itemKeys);
                }
              }
            });
          } else {
            console.warn('[Shop App Debug] error');
          }
        } else {
          console.error('[Shop App Debug] ❌ stat_data error');
        }
      } catch (error) {
        console.error('[Shop App Debug] error Mvu error:', error);
      }
    } else {
      console.warn('[Shop App Debug] Mvu error，error Mvu error');
      console.log('[Shop App Debug] ...：... Mvu ...，...');
    }

    // SillyTavern context（）
    if (window.SillyTavern) {
      const context = window.SillyTavern.getContext ? window.SillyTavern.getContext() : window.SillyTavern;
      console.log('[Shop App Debug] SillyTavern context ...:', !!context);
      if (context && context.chatMetadata) {
        console.log('[Shop App Debug] chatMetadata ...:', !!context.chatMetadata);
        console.log('[Shop App Debug] variables ...:', !!context.chatMetadata.variables);
        if (context.chatMetadata.variables) {
          console.log('[Shop App Debug] .../* Список */:', Object.keys(context.chatMetadata.variables));
        }
      }
    }
  }
};

// ：/* Приложение */
window.shopAppDestroy = function () {
  if (window.shopApp) {
    window.shopApp.destroy();
    console.log('[Авито] /* Приложение */...');
  }
};

// /* Приложение */（）
window.shopAppForceReload = function () {
  console.log('[Авито] 🔄 .../* Приложение */...');

  if (window.shopApp) {
    window.shopApp.destroy();
  }

  window.shopApp = new RuApp_avito_shop();
  console.log('[Авито] ✅ /* Приложение */... - ... 3.3');
};

window.shopAppCheckVersion = function () {
  console.log('[Авито] 📋 ...:');
  console.log('- sendToSillyTavern ...:', typeof window.shopApp?.sendToSillyTavern);
  console.log('- sendOrderToSillyTavern ...:', typeof window.shopApp?.sendOrderToSillyTavern);
  console.log('- sendViewProductsMessage ...:', typeof window.shopApp?.sendViewProductsMessage);

  if (window.shopApp?.sendToSillyTavern) {
    console.log('✅ ...');
  } else {
    console.log('❌ ...，...');
  }
};

console.log('[Авито] Магазин/* Приложение */... - ... 3.3 (...Обновить + ...)');
