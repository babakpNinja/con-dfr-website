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

// Store page content from API
let pageContent = {};

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  // First load page content from API (must be done before language init)
  await loadPageContent();
  
  // Then initialize language (which will use the loaded content)
  initLanguage();
  
  // Initialize other components
  initScrollEffects();
  initNavigation();
  initLanguageSelector();
  loadPartners();
  loadStatements();
  loadEthnicGroups();
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
  if (currentLangSpan) {
    currentLangSpan.textContent = languageNames[lang];
  }
  
  // Update active state in dropdown
  document.querySelectorAll('.lang-dropdown a').forEach(a => {
    a.classList.toggle('active', a.dataset.lang === lang);
  });
  
  // Translate all elements
  translatePage();
  
  // Update hero content from API data
  updateHeroContent();
  
  // Reload partners, statements, and ethnic groups with new language
  loadPartners();
  loadStatements();
  loadEthnicGroups();
  
  // Dispatch language changed event for other components
  document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
}

function translatePage() {
  const t = translations[currentLang];
  
  // Elements that are loaded from API should be skipped
  const apiLoadedElements = ['hero-title', 'hero-subtitle'];
  
  document.querySelectorAll('[data-i18n]').forEach(el => {
    // Skip elements that are loaded from API (they have IDs in apiLoadedElements)
    if (el.id && apiLoadedElements.includes(el.id)) {
      return;
    }
    
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

// Load page content from API (admin-defined content)
async function loadPageContent() {
  try {
    const response = await fetch('/api/content');
    if (response.ok) {
      const contentArray = await response.json();
      // Convert array to object keyed by section_key
      contentArray.forEach(item => {
        pageContent[item.section_key] = item;
      });
      console.log('Page content loaded:', Object.keys(pageContent));
    }
  } catch (error) {
    console.log('Using default content:', error);
  }
}

// Update hero section with content from admin panel
function updateHeroContent() {
  console.log('updateHeroContent called, currentLang:', currentLang, 'pageContent keys:', Object.keys(pageContent));
  
  // Update hero main title
  const heroTitle = document.getElementById('hero-title');
  if (heroTitle && pageContent.hero_main_title) {
    const content = pageContent.hero_main_title;
    const title = content[`content_${currentLang}`] || content.content_en || content.content_fa;
    console.log('Setting hero title to:', title);
    if (title) {
      heroTitle.textContent = title;
    }
  } else {
    console.log('Hero title not updated - element:', !!heroTitle, 'content:', !!pageContent.hero_main_title);
  }
  
  // Update hero subtitle
  const heroSubtitle = document.getElementById('hero-subtitle');
  if (heroSubtitle && pageContent.hero_subtitle) {
    const content = pageContent.hero_subtitle;
    const subtitle = content[`content_${currentLang}`] || content.content_en || content.content_fa;
    console.log('Setting hero subtitle to:', subtitle);
    if (subtitle) {
      heroSubtitle.textContent = subtitle;
    }
  } else {
    console.log('Hero subtitle not updated - element:', !!heroSubtitle, 'content:', !!pageContent.hero_subtitle);
  }
  
  // Update about section title
  const aboutTitle = document.querySelector('[data-section="about_title"]');
  if (aboutTitle && pageContent.about_title) {
    const content = pageContent.about_title;
    const title = content[`content_${currentLang}`] || content.content_en;
    if (title) aboutTitle.textContent = title;
  }
  
  // Update about section content
  const aboutContent = document.querySelector('[data-section="about_content"]');
  if (aboutContent && pageContent.about_content) {
    const content = pageContent.about_content;
    const text = content[`content_${currentLang}`] || content.content_en;
    if (text) aboutContent.textContent = text;
  }
  
  // Update partners section title
  const partnersTitle = document.querySelector('[data-section="partners_title"]');
  if (partnersTitle && pageContent.partners_title) {
    const content = pageContent.partners_title;
    const title = content[`content_${currentLang}`] || content.content_en;
    if (title) partnersTitle.textContent = title;
  }
  
  // Update partners section subtitle
  const partnersSubtitle = document.querySelector('[data-section="partners_subtitle"]');
  if (partnersSubtitle && pageContent.partners_subtitle) {
    const content = pageContent.partners_subtitle;
    const subtitle = content[`content_${currentLang}`] || content.content_en;
    if (subtitle) partnersSubtitle.textContent = subtitle;
  }
  
  // Update membership section title
  const membershipTitle = document.querySelector('[data-section="membership_title"]');
  if (membershipTitle && pageContent.membership_title) {
    const content = pageContent.membership_title;
    const title = content[`content_${currentLang}`] || content.content_en;
    if (title) membershipTitle.textContent = title;
  }
  
  // Update membership section subtitle
  const membershipSubtitle = document.querySelector('[data-section="membership_subtitle"]');
  if (membershipSubtitle && pageContent.membership_subtitle) {
    const content = pageContent.membership_subtitle;
    const subtitle = content[`content_${currentLang}`] || content.content_en;
    if (subtitle) membershipSubtitle.textContent = subtitle;
  }
  
  // Update contact section title
  const contactTitle = document.querySelector('[data-section="contact_title"]');
  if (contactTitle && pageContent.contact_title) {
    const content = pageContent.contact_title;
    const title = content[`content_${currentLang}`] || content.content_en;
    if (title) contactTitle.textContent = title;
  }
  
  // Update contact section subtitle
  const contactSubtitle = document.querySelector('[data-section="contact_subtitle"]');
  if (contactSubtitle && pageContent.contact_subtitle) {
    const content = pageContent.contact_subtitle;
    const subtitle = content[`content_${currentLang}`] || content.content_en;
    if (subtitle) contactSubtitle.textContent = subtitle;
  }
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

// Ethnic Groups
async function loadEthnicGroups() {
  try {
    const response = await fetch('/api/ethnic-groups');
    const groups = await response.json();
    renderEthnicGroups(groups);
  } catch (error) {
    console.error('Error loading ethnic groups:', error);
    const container = document.getElementById('ethnic-groups-grid');
    if (container) {
      container.innerHTML = '<p>Error loading ethnic groups.</p>';
    }
  }
}

function renderEthnicGroups(groups) {
  const container = document.getElementById('ethnic-groups-grid');
  if (!container) return;
  
  const lang = currentLang || 'en';
  
  if (!groups || groups.length === 0) {
    container.innerHTML = '<p>No ethnic groups available.</p>';
    return;
  }
  
  container.innerHTML = groups.map(group => {
    const name = group[`name_${lang}`] || group.name_en || 'Unknown';
    const description = group[`description_${lang}`] || group.description_en || '';
    const region = group[`region_${lang}`] || group.region_en || '';
    const population = group.population || '';
    
    // Truncate description for card display
    const shortDesc = description.length > 150 ? description.substring(0, 150) + '...' : description;
    
    return `
      <div class="ethnic-group-card" onclick="openEthnicGroupModal('${group.slug}')">
        <div class="ethnic-group-image">
          <img src="${group.image_url}" alt="${escapeHtml(name)}" loading="lazy" onerror="this.src='/images/hero/hero1.png'">
        </div>
        <div class="ethnic-group-info">
          <h3>${escapeHtml(name)}</h3>
          <div class="ethnic-group-meta">
            <span class="ethnic-population">${escapeHtml(population)}</span>
            <span class="ethnic-region">${escapeHtml(region)}</span>
          </div>
          <p class="ethnic-group-desc">${escapeHtml(shortDesc)}</p>
        </div>
      </div>
    `;
  }).join('');
}

// Store current ethnic group data for modal
let currentEthnicGroupData = null;

async function openEthnicGroupModal(slug) {
  try {
    const response = await fetch(`/api/ethnic-groups/${slug}`);
    const group = await response.json();
    currentEthnicGroupData = group;
    showEthnicGroupLightbox(group);
  } catch (error) {
    console.error('Error loading ethnic group details:', error);
  }
}

function showEthnicGroupLightbox(group) {
  const lightbox = document.getElementById('ethnic-group-lightbox');
  if (!lightbox) return;
  
  const lang = currentLang || 'en';
  const name = group[`name_${lang}`] || group.name_en || 'Unknown';
  const description = group[`description_${lang}`] || group.description_en || '';
  const region = group[`region_${lang}`] || group.region_en || '';
  const population = group.population || '';
  
  document.getElementById('ethnic-lightbox-image').src = group.image_url;
  document.getElementById('ethnic-lightbox-image').alt = name;
  document.getElementById('ethnic-lightbox-name').textContent = name;
  document.getElementById('ethnic-lightbox-description').textContent = description;
  document.getElementById('ethnic-lightbox-population').textContent = population;
  document.getElementById('ethnic-lightbox-region').textContent = region;
  
  // Update direction for RTL languages
  const isRTL = ['fa', 'ar'].includes(lang);
  const infoSection = document.querySelector('.ethnic-lightbox-info');
  if (infoSection) {
    infoSection.style.direction = isRTL ? 'rtl' : 'ltr';
    infoSection.style.textAlign = isRTL ? 'right' : 'left';
  }
  
  lightbox.classList.add('show');
  document.body.style.overflow = 'hidden';
  document.addEventListener('keydown', handleEthnicLightboxEscape);
}

function closeEthnicGroupLightbox() {
  const lightbox = document.getElementById('ethnic-group-lightbox');
  if (lightbox) {
    lightbox.classList.remove('show');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleEthnicLightboxEscape);
    currentEthnicGroupData = null;
  }
}

function handleEthnicLightboxEscape(e) {
  if (e.key === 'Escape') {
    closeEthnicGroupLightbox();
  }
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