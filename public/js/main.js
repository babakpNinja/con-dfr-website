// Main JavaScript for CON-DFR Website

// Current language
let currentLang = localStorage.getItem('lang') || 'en';

// DOM Elements
const header = document.getElementById('header');
const langBtn = document.getElementById('lang-btn');
const langDropdown = document.getElementById('lang-dropdown');
const currentLangSpan = document.getElementById('current-lang');
const partnersGrid = document.getElementById('partners-grid');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navLinks = document.getElementById('nav-links');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initLanguage();
  initScrollEffects();
  initNavigation();
  initLanguageSelector();
  loadPartners();
  loadStatements();
  initPartnerTabs();
  initSmoothScroll();
});

// Language Functions
function initLanguage() {
  setLanguage(currentLang);
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  
  // Set direction
  const isRTL = rtlLanguages.includes(lang);
  document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
  document.documentElement.setAttribute('lang', lang);
  
  // Update current language display
  currentLangSpan.textContent = languageNames[lang];
  
  // Update active state in dropdown
  document.querySelectorAll('.lang-dropdown a').forEach(a => {
    a.classList.toggle('active', a.dataset.lang === lang);
  });
  
  // Translate all elements
  translatePage();
  
  // Reload partners and statements with new language
  loadPartners();
  loadStatements();
  
  // Dispatch language changed event for other components
  document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
}

function translatePage() {
  const t = translations[currentLang];
  
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const value = getNestedValue(t, key);
    if (value) {
      el.textContent = value;
    }
  });
}

function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

function initLanguageSelector() {
  // Toggle dropdown
  langBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    langDropdown.classList.toggle('show');
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', () => {
    langDropdown.classList.remove('show');
  });
  
  // Language selection
  document.querySelectorAll('.lang-dropdown a').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const lang = a.dataset.lang;
      setLanguage(lang);
      langDropdown.classList.remove('show');
    });
  });
}

// Scroll Effects
function initScrollEffects() {
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Header background
    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Update active nav link
    updateActiveNavLink();
    
    lastScroll = currentScroll;
  });
}

function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPos = window.pageYOffset + 100;
  
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    
    if (scrollPos >= top && scrollPos < top + height) {
      document.querySelectorAll('.nav-links a').forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href') === `#${id}`) {
          a.classList.add('active');
        }
      });
    }
  });
}

// Navigation
function initNavigation() {
  // Mobile menu toggle
  mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('show');
    mobileMenuBtn.classList.toggle('active');
  });
  
  // Close mobile menu on link click
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('show');
      mobileMenuBtn.classList.remove('active');
    });
  });
}

// Smooth Scroll
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Statements
async function loadStatements() {
  try {
    const response = await fetch('/api/statements');
    const statements = await response.json();
    renderStatements(statements);
  } catch (error) {
    console.error('Error loading statements:', error);
    document.getElementById('statements-list').innerHTML = '<p>Error loading statements.</p>';
  }
}

function renderStatements(statements) {
  const container = document.getElementById('statements-list');
  if (!container) return;
  
  const lang = window.currentLanguage || 'en';
  
  if (!statements || statements.length === 0) {
    container.innerHTML = '<p>No statements available.</p>';
    return;
  }
  
  container.innerHTML = statements.map(statement => {
    const title = statement[`title_${lang}`] || statement.title_en || statement.title_fa || 'Untitled';
    const date = formatStatementDate(statement.date, lang);
    
    return `
      <a href="/statement.html?id=${statement.id}" class="statement-item">
        <div class="statement-info">
          <h4>${escapeHtml(title)}</h4>
          <span class="statement-date">${date}</span>
        </div>
        <svg class="statement-arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </a>
    `;
  }).join('');
}

function formatStatementDate(dateStr, lang) {
  const date = new Date(dateStr);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const locales = {
    en: 'en-US',
    fa: 'fa-IR',
    tr: 'tr-TR',
    az: 'az-AZ',
    ar: 'ar-SA',
    zh: 'zh-CN',
    es: 'es-ES'
  };
  return date.toLocaleDateString(locales[lang] || 'en-US', options);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Partners
async function loadPartners(type = 'all') {
  try {
    let url = '/api/partners';
    if (type !== 'all') {
      url = `/api/partners/type/${type}`;
    }
    
    const response = await fetch(url);
    const partners = await response.json();
    
    renderPartners(partners);
  } catch (error) {
    console.error('Error loading partners:', error);
    partnersGrid.innerHTML = `<p class="text-center">${translations[currentLang].common.loading}</p>`;
  }
}

function renderPartners(partners) {
  if (partners.length === 0) {
    partnersGrid.innerHTML = '<p class="text-center">No partners found.</p>';
    return;
  }
  
  const t = translations[currentLang];
  
  partnersGrid.innerHTML = partners.map(partner => {
    const name = partner[`name_${currentLang}`] || partner.name_en;
    const description = partner[`description_${currentLang}`] || partner.description_en;
    
    return `
      <div class="partner-card animate-slide-up" onclick="openPartnerLightbox(${partner.id})" data-partner-id="${partner.id}">
        <div class="partner-image">
          <img src="${partner.image_url || 'https://via.placeholder.com/200x200?text=Partner'}" 
               alt="${name}"
               onerror="this.src='https://via.placeholder.com/200x200?text=Partner'">
        </div>
        <div class="partner-content">
          <h4>${name}</h4>
          <p>${description || ''}</p>
        </div>
        <div class="click-hint">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
          </svg>
        </div>
      </div>
    `;
  }).join('');
}

// Partner Lightbox Functions
let currentPartnerData = null;

async function openPartnerLightbox(partnerId) {
  try {
    const response = await fetch(`/api/partners/${partnerId}`);
    if (!response.ok) throw new Error('Partner not found');
    
    const partner = await response.json();
    currentPartnerData = partner;
    
    displayPartnerInLightbox(partner);
    
    // Show lightbox
    const lightbox = document.getElementById('partner-lightbox');
    lightbox.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Close on escape key
    document.addEventListener('keydown', handleLightboxEscape);
  } catch (error) {
    console.error('Error loading partner details:', error);
  }
}

function displayPartnerInLightbox(partner) {
  const name = partner[`name_${currentLang}`] || partner.name_en;
  const description = partner[`description_${currentLang}`] || partner.description_en;
  const t = translations[currentLang];
  
  // Set image
  const imgEl = document.getElementById('lightbox-image');
  imgEl.src = partner.image_url || 'https://via.placeholder.com/200x200?text=Partner';
  imgEl.alt = name;
  imgEl.onerror = function() { this.src = 'https://via.placeholder.com/200x200?text=Partner'; };
  
  // Set type badge
  const typeEl = document.getElementById('lightbox-type');
  typeEl.textContent = partner.partner_type === 'organization' 
    ? (t.partners?.organization || 'Organization')
    : (t.partners?.individual || 'Individual');
  
  // Set name and description
  document.getElementById('lightbox-name').textContent = name;
  document.getElementById('lightbox-description').textContent = description || (t.partners?.noDescription || 'No description available.');
  
  // Set website link
  const websiteLink = document.getElementById('lightbox-website');
  const metaSection = document.getElementById('lightbox-meta');
  if (partner.website_url) {
    websiteLink.href = partner.website_url;
    metaSection.style.display = 'block';
  } else {
    metaSection.style.display = 'none';
  }
  
  // Build translation chips
  buildTranslationChips(partner);
}

function buildTranslationChips(partner) {
  const chipsContainer = document.getElementById('translation-chips');
  const translationsSection = document.getElementById('lightbox-translations');
  
  const languages = [
    { code: 'en', flag: '🇬🇧', name: 'English' },
    { code: 'fa', flag: '🇮🇷', name: 'فارسی' },
    { code: 'tr', flag: '🇹🇷', name: 'Türkçe' },
    { code: 'az', flag: '🇦🇿', name: 'Azərbaycan' },
    { code: 'ar', flag: '🇸🇦', name: 'العربية' },
    { code: 'zh', flag: '🇨🇳', name: '中文' },
    { code: 'es', flag: '🇪🇸', name: 'Español' }
  ];
  
  // Filter languages that have translations
  const availableLanguages = languages.filter(lang => 
    partner[`name_${lang.code}`] && partner[`name_${lang.code}`].trim() !== ''
  );
  
  if (availableLanguages.length <= 1) {
    translationsSection.style.display = 'none';
    return;
  }
  
  translationsSection.style.display = 'block';
  
  chipsContainer.innerHTML = availableLanguages.map(lang => `
    <div class="translation-chip ${lang.code === currentLang ? 'active' : ''}" 
         onclick="switchLightboxLanguage('${lang.code}')"
         data-lang="${lang.code}">
      <span class="flag">${lang.flag}</span>
      <span class="lang-name">${lang.name}</span>
    </div>
  `).join('');
}

function switchLightboxLanguage(langCode) {
  if (!currentPartnerData) return;
  
  // Update active chip
  document.querySelectorAll('.translation-chip').forEach(chip => {
    chip.classList.toggle('active', chip.dataset.lang === langCode);
  });
  
  // Update displayed content
  const name = currentPartnerData[`name_${langCode}`] || currentPartnerData.name_en;
  const description = currentPartnerData[`description_${langCode}`] || currentPartnerData.description_en;
  
  document.getElementById('lightbox-name').textContent = name;
  document.getElementById('lightbox-description').textContent = description || 'No description available.';
  
  // Update direction for RTL languages
  const isRTL = ['fa', 'ar'].includes(langCode);
  document.querySelector('.lightbox-info').style.direction = isRTL ? 'rtl' : 'ltr';
  document.querySelector('.lightbox-info').style.textAlign = isRTL ? 'right' : 'left';
}

function closePartnerLightbox() {
  const lightbox = document.getElementById('partner-lightbox');
  lightbox.classList.remove('show');
  document.body.style.overflow = '';
  document.removeEventListener('keydown', handleLightboxEscape);
  currentPartnerData = null;
}

function handleLightboxEscape(e) {
  if (e.key === 'Escape') {
    closePartnerLightbox();
  }
}

function initPartnerTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active tab
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Load partners by type
      const type = btn.dataset.tab;
      loadPartners(type);
    });
  });
}

// Animation on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-visible');
    }
  });
}, observerOptions);

document.querySelectorAll('.animate-slide-up, .animate-slide-in, .animate-fade-in').forEach(el => {
  observer.observe(el);
});

// Mobile menu styles (add to CSS dynamically for mobile)
const mobileStyles = document.createElement('style');
mobileStyles.textContent = `
  @media (max-width: 768px) {
    .nav-links {
      position: fixed;
      top: var(--header-height);
      left: 0;
      right: 0;
      background: white;
      flex-direction: column;
      padding: 1rem;
      box-shadow: var(--shadow-lg);
      transform: translateY(-100%);
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    }
    
    .nav-links.show {
      transform: translateY(0);
      opacity: 1;
      visibility: visible;
      display: flex;
    }
    
    .nav-links a {
      padding: 1rem;
      width: 100%;
      text-align: center;
    }
    
    .mobile-menu-btn.active span:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }
    
    .mobile-menu-btn.active span:nth-child(2) {
      opacity: 0;
    }
    
    .mobile-menu-btn.active span:nth-child(3) {
      transform: rotate(-45deg) translate(7px, -6px);
    }
  }
`;
document.head.appendChild(mobileStyles);