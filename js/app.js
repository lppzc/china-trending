// ============================================
// China Trending Viewer - Main Application
// ============================================

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    DATA_PATH: 'data/trending.json',
    REFRESH_INTERVAL: 300000, // 5 minutes
    ANIMATION_DELAY: 50
  };

  // Platform icons (SVG paths)
  const PLATFORM_INFO = {
    weibo: { name: '微博', color: '#e6162d' },
    zhihu: { name: '知乎', color: '#0084ff' },
    bilibili: { name: 'B站', color: '#00a1d6' },
    douyin: { name: '抖音', color: '#fe2c55' },
    tieba: { name: '贴吧', color: '#0b88d9' }
  };

  // State
  let currentPlatform = 'weibo';
  let trendingData = null;

  // DOM Elements
  const elements = {
    trendingList: document.getElementById('trendingList'),
    refreshBtn: document.getElementById('refreshBtn'),
    themeBtn: document.getElementById('themeBtn'),
    lastUpdate: document.getElementById('lastUpdate'),
    tabs: document.querySelectorAll('.tab')
  };

  // ============================================
  // Utility Functions
  // ============================================

  /**
   * Format large numbers with K/W suffix
   */
  function formatHotNumber(num) {
    if (num >= 100000000) {
      return (num / 100000000).toFixed(1) + '亿';
    } else if (num >= 10000) {
      return (num / 10000).toFixed(1) + '万';
    }
    return num.toString();
  }

  /**
   * Format relative time
   */
  function formatRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    return `${days}天前`;
  }

  /**
   * Format full datetime
   */
  function formatDateTime(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hour}:${minute}`;
  }

  /**
   * Get rank badge class
   */
  function getRankClass(rank) {
    if (rank === 1) return 'rank-1';
    if (rank === 2) return 'rank-2';
    if (rank === 3) return 'rank-3';
    return 'rank-other';
  }

  // ============================================
  // Render Functions
  // ============================================

  /**
   * Render loading state
   */
  function renderLoading() {
    elements.trendingList.innerHTML = `
      <div class="loading">
        <div class="loading-spinner"></div>
        <p class="loading-text">加载中...</p>
      </div>
    `;
  }

  /**
   * Render empty state
   */
  function renderEmpty() {
    elements.trendingList.innerHTML = `
      <div class="empty-state">
        <p>暂无数据</p>
      </div>
    `;
  }

  /**
   * Render error state
   */
  function renderError(message) {
    elements.trendingList.innerHTML = `
      <div class="error-state">
        <svg viewBox="0 0 24 24" class="error-icon">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
        <p class="error-message">${escapeHtml(message)}</p>
        <button class="retry-btn" onclick="location.reload()">重新加载</button>
      </div>
    `;
  }

  /**
   * Render trending cards
   */
  function renderTrending(data) {
    const platform = data[currentPlatform];

    if (!platform || platform.length === 0) {
      renderEmpty();
      return;
    }

    elements.trendingList.innerHTML = platform.map((item, index) => `
      <div class="trending-card" style="animation-delay: ${index * CONFIG.ANIMATION_DELAY}ms">
        <span class="rank-badge ${getRankClass(item.rank)}">${item.rank}</span>
        <div class="card-content">
          <h3 class="card-title">
            <a href="${item.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.title)}</a>
          </h3>
          <div class="card-meta">
            <span class="card-hot">${formatHotNumber(item.hot)}</span>
            <span class="card-time">${formatRelativeTime(item.time)}</span>
          </div>
        </div>
      </div>
    `).join('');

    // Update last update time
    if (data.lastUpdate) {
      elements.lastUpdate.textContent = `最后更新: ${formatDateTime(data.lastUpdate)}`;
    }
  }

  /**
   * Escape HTML to prevent XSS
   */
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ============================================
  // Data Fetching
  // ============================================

  /**
   * Fetch trending data from JSON file
   */
  async function fetchTrendingData() {
    try {
      const response = await fetch(CONFIG.DATA_PATH);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      trendingData = data;
      renderTrending(data);
    } catch (error) {
      console.error('Failed to fetch trending data:', error);
      renderError('加载数据失败，请检查网络后重试');
    }
  }

  /**
   * Refresh data with loading animation
   */
  async function refreshData() {
    elements.refreshBtn.classList.add('loading');
    await fetchTrendingData();
    setTimeout(() => {
      elements.refreshBtn.classList.remove('loading');
    }, 500);
  }

  // ============================================
  // Event Handlers
  // ============================================

  /**
   * Handle platform tab click
   */
  function handleTabClick(event) {
    const tab = event.currentTarget;
    const platform = tab.dataset.platform;

    if (platform === currentPlatform) return;

    // Update active state
    elements.tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    // Update current platform
    currentPlatform = platform;

    // Re-render
    if (trendingData) {
      renderTrending(trendingData);
    }
  }

  /**
   * Handle refresh button click
   */
  function handleRefreshClick() {
    refreshData();
  }

  /**
   * Handle theme toggle
   */
  function handleThemeToggle() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  }

  /**
   * Load saved theme
   */
  function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  }

  // ============================================
  // Initialization
  // ============================================

  /**
   * Initialize the application
   */
  function init() {
    // Load saved theme
    loadTheme();

    // Bind events
    elements.tabs.forEach(tab => {
      tab.addEventListener('click', handleTabClick);
    });
    elements.refreshBtn.addEventListener('click', handleRefreshClick);
    elements.themeBtn.addEventListener('click', handleThemeToggle);

    // Load initial data
    renderLoading();
    fetchTrendingData();

    // Auto refresh
    setInterval(refreshData, CONFIG.REFRESH_INTERVAL);
  }

  // Start app when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
