// Click Jogos Arcade - Main Engine
document.addEventListener('DOMContentLoaded', () => {
  // State
  let games = typeof GAMES_DATA !== 'undefined' ? [...GAMES_DATA] : [];
  let currentCategory = 'all';
  let searchQuery = '';
  let currentSort = 'popular';
  let activeGame = null;
  
  // LocalStorage keys
  const FAV_KEY = 'click_arcade_favorites';
  const PLAYS_KEY = 'click_arcade_plays';

  // Category Title Map
  const CATEGORY_TITLES = {
    all: 'Todos os Jogos',
    zombies: 'Jogos de Zumbis',
    fps: 'Tiro & FPS',
    acao: 'GTA & Ação',
    esportes: 'Futebol & Skate',
    classicos: 'Clássicos dos Anos 90 e 2000',
    diversao: 'Estratégia & Diversão',
    favorites: 'Meus Favoritos'
  };

  // Helper for favorites
  function getFavorites() {
    try {
      const stored = localStorage.getItem(FAV_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  function setFavorites(favs) {
    try {
      localStorage.setItem(FAV_KEY, JSON.stringify(favs));
    } catch (e) {}
  }

  function toggleFavorite(id) {
    let favs = getFavorites();
    const index = favs.indexOf(id);
    let isFav = false;
    if (index > -1) {
      favs.splice(index, 1);
      showToast('Removido dos favoritos', '🤍');
    } else {
      favs.push(id);
      isFav = true;
      showToast('Adicionado aos favoritos!', '⭐');
    }
    setFavorites(favs);
    updateFavCounts();
    renderGames();
    if (activeGame && activeGame.id === id) {
      updatePlayerFavBtn(isFav);
    }
  }

  function isFavorite(id) {
    return getFavorites().includes(id);
  }

  // Plays tracker
  function recordPlay(id) {
    try {
      let plays = JSON.parse(localStorage.getItem(PLAYS_KEY) || '{}');
      plays[id] = (plays[id] || 0) + 1;
      localStorage.setItem(PLAYS_KEY, JSON.stringify(plays));
      
      const g = games.find(item => item.id === id);
      if (g) {
        g.plays += 1;
      }
    } catch (e) {}
  }

  // Toast UI
  function showToast(message, icon = '✅') {
    const toast = document.getElementById('toastNotification');
    const toastMsg = document.getElementById('toastMessage');
    const toastIcon = document.getElementById('toastIcon');

    if (!toast) return;
    toastMsg.textContent = message;
    toastIcon.textContent = icon;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 2600);
  }

  // DOM Elements
  const gamesGrid = document.getElementById('gamesGrid');
  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const categoryTabs = document.getElementById('categoryTabs');
  const sortSelect = document.getElementById('sortSelect');
  const displayedCount = document.getElementById('displayedCount');
  const currentSectionTitle = document.getElementById('currentSectionTitle');
  const randomGameBtn = document.getElementById('randomGameBtn');
  const favFilterQuickBtn = document.getElementById('favFilterQuickBtn');
  const favCountHeader = document.getElementById('favCountHeader');
  const logoBtn = document.getElementById('logoBtn');

  // Player Elements
  const playerModal = document.getElementById('playerModal');
  const playerTitle = document.getElementById('playerTitle');
  const playerCategory = document.getElementById('playerCategory');
  const gameIframe = document.getElementById('gameIframe');
  const playerControlsText = document.getElementById('playerControlsText');
  const playerDescriptionText = document.getElementById('playerDescriptionText');
  const playerReloadBtn = document.getElementById('playerReloadBtn');
  const playerFullscreenBtn = document.getElementById('playerFullscreenBtn');
  const playerShareBtn = document.getElementById('playerShareBtn');
  const playerFavBtn = document.getElementById('playerFavBtn');
  const playerCloseBtn = document.getElementById('playerCloseBtn');
  const iframeContainer = document.getElementById('iframeContainer');
  const playerStatusBadge = document.getElementById('playerStatusBadge');

  // Hero elements
  const heroPlayBtn = document.getElementById('heroPlayBtn');
  const heroDetailsBtn = document.getElementById('heroDetailsBtn');

  // Donate Elements
  const donateModalOverlay = document.getElementById('donateModalOverlay');
  const closeDonateModalBtn = document.getElementById('closeDonateModalBtn');
  const donateHeaderBtn = document.getElementById('donateHeaderBtn');
  const playerDonateBtn = document.getElementById('playerDonateBtn');
  const playerQrTriggerBtn = document.getElementById('playerQrTriggerBtn');
  const bannerQrBtn = document.getElementById('bannerQrBtn');
  const bannerQrCard = document.getElementById('bannerQrCard');

  function openDonateModal() {
    if (donateModalOverlay) {
      donateModalOverlay.classList.add('active');
    }
  }

  function closeDonateModal() {
    if (donateModalOverlay) {
      donateModalOverlay.classList.remove('active');
    }
  }

  if (donateHeaderBtn) donateHeaderBtn.addEventListener('click', openDonateModal);
  if (playerDonateBtn) playerDonateBtn.addEventListener('click', openDonateModal);
  if (playerQrTriggerBtn) playerQrTriggerBtn.addEventListener('click', openDonateModal);
  if (bannerQrBtn) bannerQrBtn.addEventListener('click', openDonateModal);
  if (bannerQrCard) bannerQrCard.addEventListener('click', openDonateModal);
  if (closeDonateModalBtn) closeDonateModalBtn.addEventListener('click', closeDonateModal);

  if (donateModalOverlay) {
    donateModalOverlay.addEventListener('click', (e) => {
      if (e.target === donateModalOverlay) {
        closeDonateModal();
      }
    });
  }

  // Update counts on categories
  function updateFavCounts() {
    const favCount = getFavorites().length;
    const favBadge = document.getElementById('count-favorites');
    if (favBadge) favBadge.textContent = favCount;
    if (favCountHeader) favCountHeader.textContent = `Favoritos (${favCount})`;
  }

  function updateCategoryCounts() {
    const counts = {
      all: games.length,
      zombies: 0,
      fps: 0,
      acao: 0,
      esportes: 0,
      classicos: 0,
      diversao: 0
    };

    games.forEach(g => {
      if (counts[g.category] !== undefined) {
        counts[g.category]++;
      }
    });

    Object.keys(counts).forEach(cat => {
      const el = document.getElementById(`count-${cat}`);
      if (el) el.textContent = counts[cat];
    });

    updateFavCounts();
  }

  // Filter & Sort Logic
  function getFilteredGames() {
    let result = [...games];

    // Filter Category
    if (currentCategory === 'favorites') {
      const favs = getFavorites();
      result = result.filter(g => favs.includes(g.id));
    } else if (currentCategory !== 'all') {
      result = result.filter(g => g.category === currentCategory);
    }

    // Filter Search
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(g => {
        return (
          g.title.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q) ||
          g.categoryLabel.toLowerCase().includes(q) ||
          (g.tags && g.tags.some(tag => tag.toLowerCase().includes(q)))
        );
      });
    }

    // Sort
    if (currentSort === 'popular') {
      result.sort((a, b) => b.plays - a.plays);
    } else if (currentSort === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (currentSort === 'name') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }

  // Render Games Grid
  function renderGames() {
    const filtered = getFilteredGames();
    displayedCount.textContent = filtered.length;

    // Update section title
    if (currentSectionTitle) {
      if (searchQuery.trim() !== '') {
        currentSectionTitle.textContent = `Resultados para "${searchQuery}"`;
      } else {
        currentSectionTitle.textContent = CATEGORY_TITLES[currentCategory] || 'Todos os Jogos';
      }
    }

    if (filtered.length === 0) {
      gamesGrid.innerHTML = `
        <div class="empty-box">
          <div style="font-size: 2.8rem;">🕹️</div>
          <h3>Nenhum jogo encontrado</h3>
          <p>Tente buscar por outro termo ou selecione outra categoria.</p>
          <button class="btn-play-large" id="resetFiltersBtn" style="margin: 0 auto; padding: 10px 22px; font-size: 0.9rem;">Ver Todos os Jogos</button>
        </div>
      `;
      const resetBtn = document.getElementById('resetFiltersBtn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          currentCategory = 'all';
          searchQuery = '';
          searchInput.value = '';
          clearSearchBtn.style.display = 'none';
          document.querySelectorAll('.cat-pill').forEach(b => b.classList.remove('active'));
          const allBtn = document.querySelector('.cat-pill[data-cat="all"]');
          if (allBtn) allBtn.classList.add('active');
          renderGames();
        });
      }
      return;
    }

    gamesGrid.innerHTML = filtered.map(game => {
      const fav = isFavorite(game.id);
      const formattedPlays = game.plays >= 1000 ? `${(game.plays / 1000).toFixed(1)}k` : game.plays;

      return `
        <div class="game-item" data-id="${game.id}">
          <div class="game-thumbnail-box">
            <img src="${game.thumbnail}" alt="${game.title}" class="game-img" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600'">
            <span class="game-tag-badge">${game.badge}</span>
            <button class="game-fav-trigger ${fav ? 'active' : ''}" data-fav-id="${game.id}" title="${fav ? 'Remover dos favoritos' : 'Favoritar'}">
              ${fav ? '❤️' : '🤍'}
            </button>
            <div class="game-hover-play">
              <div class="play-circle">▶</div>
            </div>
          </div>
          <div class="game-info-box">
            <span class="game-cat-label">${game.categoryLabel}</span>
            <h3 class="game-name">${game.title}</h3>
            <div class="game-bottom-row">
              <span class="game-rating">★ ${game.rating.toFixed(1)}</span>
              <span class="game-plays">🔥 ${formattedPlays}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach card click handlers
    document.querySelectorAll('.game-item').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.game-fav-trigger')) return;
        const id = card.getAttribute('data-id');
        openGame(id);
      });
    });

    // Attach favorite toggle handlers
    document.querySelectorAll('.game-fav-trigger').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-fav-id');
        toggleFavorite(id);
      });
    });
  }

  // Open Game in Modal Player
  function openGame(gameId) {
    const game = games.find(g => g.id === gameId);
    if (!game) return;

    activeGame = game;
    recordPlay(game.id);

    playerTitle.textContent = game.title;
    playerCategory.textContent = game.categoryLabel;
    playerControlsText.textContent = game.controls;
    playerDescriptionText.textContent = game.description;

    // Load iframe
    playerStatusBadge.textContent = '⚡ Iniciando emulador...';
    gameIframe.src = game.url;

    // Update favorite icon in player
    updatePlayerFavBtn(isFavorite(game.id));

    // Show modal
    playerModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Update URL hash
    window.location.hash = game.id;
  }

  function updatePlayerFavBtn(fav) {
    playerFavBtn.innerHTML = fav ? '❤️' : '🤍';
    playerFavBtn.title = fav ? 'Remover dos favoritos' : 'Favoritar';
  }

  // Close Game Player
  function closeGame() {
    playerModal.classList.remove('active');
    document.body.style.overflow = '';
    gameIframe.src = '';
    activeGame = null;
    history.replaceState(null, null, ' ');
  }

  // Fullscreen support
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      if (iframeContainer.requestFullscreen) {
        iframeContainer.requestFullscreen();
      } else if (iframeContainer.webkitRequestFullscreen) {
        iframeContainer.webkitRequestFullscreen();
      } else if (iframeContainer.msRequestFullscreen) {
        iframeContainer.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  // Event Listeners
  playerCloseBtn.addEventListener('click', closeGame);

  // Close with ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (donateModalOverlay && donateModalOverlay.classList.contains('active')) {
        closeDonateModal();
        return;
      }
      if (playerModal && playerModal.classList.contains('active')) {
        closeGame();
      }
    }

    // Shortcut "/" to search
    if (e.key === '/' && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  playerFullscreenBtn.addEventListener('click', toggleFullscreen);

  if (playerReloadBtn) {
    playerReloadBtn.addEventListener('click', () => {
      if (activeGame) {
        showToast('Recarregando o jogo... 🔄', '🎮');
        playerStatusBadge.textContent = '🔄 Recarregando emulador...';
        const currentUrl = activeGame.url;
        gameIframe.src = '';
        setTimeout(() => {
          gameIframe.src = currentUrl;
          playerStatusBadge.textContent = '⚡ Emulador reiniciado!';
        }, 150);
      }
    });
  }

  playerFavBtn.addEventListener('click', () => {
    if (activeGame) {
      toggleFavorite(activeGame.id);
    }
  });

  playerShareBtn.addEventListener('click', () => {
    if (activeGame) {
      const shareUrl = `${window.location.origin}${window.location.pathname}#${activeGame.id}`;
      navigator.clipboard.writeText(shareUrl).then(() => {
        showToast('Link do jogo copiado! 📋');
      }).catch(() => {
        showToast(`Copie o link: ${shareUrl}`);
      });
    }
  });

  // Category Buttons
  categoryTabs.addEventListener('click', (e) => {
    const btn = e.target.closest('.cat-pill');
    if (!btn) return;

    document.querySelectorAll('.cat-pill').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    currentCategory = btn.getAttribute('data-cat');
    renderGames();
  });

  // Search input
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    clearSearchBtn.style.display = searchQuery ? 'block' : 'none';
    renderGames();
  });

  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    searchQuery = '';
    clearSearchBtn.style.display = 'none';
    searchInput.focus();
    renderGames();
  });

  // Sort select
  sortSelect.addEventListener('change', (e) => {
    currentSort = e.target.value;
    renderGames();
  });

  // Random Game Button
  randomGameBtn.addEventListener('click', () => {
    if (games.length === 0) return;
    const randomIndex = Math.floor(Math.random() * games.length);
    const chosen = games[randomIndex];
    showToast(`Iniciando ${chosen.title}... 🎲`, '🕹️');
    openGame(chosen.id);
  });

  // Quick Fav Filter
  favFilterQuickBtn.addEventListener('click', () => {
    document.querySelectorAll('.cat-pill').forEach(b => b.classList.remove('active'));
    const favTab = document.querySelector('.cat-pill[data-cat="favorites"]');
    if (favTab) favTab.classList.add('active');
    currentCategory = 'favorites';
    renderGames();
    window.scrollTo({ top: 380, behavior: 'smooth' });
  });

  // Logo button
  logoBtn.addEventListener('click', (e) => {
    e.preventDefault();
    currentCategory = 'all';
    searchQuery = '';
    searchInput.value = '';
    clearSearchBtn.style.display = 'none';
    document.querySelectorAll('.cat-pill').forEach(b => b.classList.remove('active'));
    const allTab = document.querySelector('.cat-pill[data-cat="all"]');
    if (allTab) allTab.classList.add('active');
    renderGames();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Hero Play Button
  if (heroPlayBtn) {
    heroPlayBtn.addEventListener('click', () => {
      const gid = heroPlayBtn.getAttribute('data-game-id') || 'kino-der-toten';
      openGame(gid);
    });
  }

  if (heroDetailsBtn) {
    heroDetailsBtn.addEventListener('click', () => {
      const gid = heroDetailsBtn.getAttribute('data-game-id') || 'kino-der-toten';
      openGame(gid);
    });
  }

  // Handle URL hash on initial load
  function checkHashRouting() {
    const hash = window.location.hash.replace('#', '').trim();
    if (hash) {
      const target = games.find(g => g.id === hash);
      if (target) {
        openGame(target.id);
      }
    }
  }

  // Initialize
  updateCategoryCounts();
  renderGames();
  checkHashRouting();
});
