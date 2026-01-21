// Admin Panel JavaScript

// DOM Elements
const loginScreen = document.getElementById('login-screen');
const adminDashboard = document.getElementById('admin-dashboard');
const loginForm = document.getElementById('login-form');
const loginAlert = document.getElementById('login-alert');
const logoutBtn = document.getElementById('logout-btn');
const partnersTableBody = document.getElementById('partners-table-body');
const partnersAlert = document.getElementById('partners-alert');
const addPartnerBtn = document.getElementById('add-partner-btn');
const partnerModal = document.getElementById('partner-modal');
const partnerForm = document.getElementById('partner-form');
const modalTitle = document.getElementById('modal-title');
const modalClose = document.getElementById('modal-close');
const modalCancel = document.getElementById('modal-cancel');
const modalSave = document.getElementById('modal-save');
const deleteModal = document.getElementById('delete-modal');
const deleteModalClose = document.getElementById('delete-modal-close');
const deleteCancel = document.getElementById('delete-cancel');
const deleteConfirm = document.getElementById('delete-confirm');
const changePasswordForm = document.getElementById('change-password-form');
const settingsAlert = document.getElementById('settings-alert');

// State
let currentPartnerId = null;
let isEditing = false;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  initEventListeners();
});

// Check authentication status
async function checkAuth() {
  try {
    const response = await fetch('/api/auth/status');
    const data = await response.json();
    
    if (data.isAuthenticated) {
      showDashboard();
      loadPartners();
    } else {
      showLogin();
    }
  } catch (error) {
    showLogin();
  }
}

function showLogin() {
  loginScreen.classList.remove('hidden');
  adminDashboard.classList.add('hidden');
}

function showDashboard() {
  loginScreen.classList.add('hidden');
  adminDashboard.classList.remove('hidden');
}

// Event Listeners
function initEventListeners() {
  // Login form
  loginForm.addEventListener('submit', handleLogin);
  
  // Logout
  logoutBtn.addEventListener('click', handleLogout);
  
  // Navigation
  document.querySelectorAll('.admin-nav a[data-section]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const section = link.dataset.section;
      showSection(section);
      
      // Update active state
      document.querySelectorAll('.admin-nav a').forEach(a => a.classList.remove('active'));
      link.classList.add('active');
    });
  });
  
  // Add partner button
  addPartnerBtn.addEventListener('click', () => openPartnerModal());
  
  // Modal controls
  modalClose.addEventListener('click', closePartnerModal);
  modalCancel.addEventListener('click', closePartnerModal);
  modalSave.addEventListener('click', savePartner);
  
  // Delete modal controls
  deleteModalClose.addEventListener('click', closeDeleteModal);
  deleteCancel.addEventListener('click', closeDeleteModal);
  deleteConfirm.addEventListener('click', confirmDelete);
  
  // Modal tabs
  document.querySelectorAll('.modal-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const lang = tab.dataset.lang;
      
      // Update active tab
      document.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // Show corresponding content
      document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.dataset.lang === lang);
      });
    });
  });
  
  // Change password form
  changePasswordForm.addEventListener('submit', handleChangePassword);
  
  // Close modals on overlay click
  partnerModal.addEventListener('click', (e) => {
    if (e.target === partnerModal) closePartnerModal();
  });
  deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) closeDeleteModal();
  });
  
  // Mobile sidebar toggle
  const mobileToggle = document.createElement('button');
  mobileToggle.className = 'mobile-menu-btn';
  mobileToggle.innerHTML = '<span></span><span></span><span></span>';
  mobileToggle.style.cssText = 'position: fixed; top: 1rem; left: 1rem; z-index: 1002; display: none;';
  document.body.appendChild(mobileToggle);
  
  mobileToggle.addEventListener('click', () => {
    document.getElementById('admin-sidebar').classList.toggle('open');
  });
  
  // Show mobile toggle on small screens
  if (window.innerWidth <= 768) {
    mobileToggle.style.display = 'flex';
  }
  
  window.addEventListener('resize', () => {
    mobileToggle.style.display = window.innerWidth <= 768 ? 'flex' : 'none';
  });
}

// Login handler
async function handleLogin(e) {
  e.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    const data = await response.json();
    
    if (data.success) {
      showDashboard();
      loadPartners();
      showAlert(loginAlert, 'Login successful!', 'success');
    } else {
      showAlert(loginAlert, data.message || 'Invalid credentials', 'error');
    }
  } catch (error) {
    showAlert(loginAlert, 'Login failed. Please try again.', 'error');
  }
}

// Logout handler
async function handleLogout(e) {
  e.preventDefault();
  
  try {
    await fetch('/api/logout', { method: 'POST' });
    showLogin();
  } catch (error) {
    console.error('Logout error:', error);
  }
}

// Section navigation
function showSection(sectionId) {
  document.querySelectorAll('[id^="section-"]').forEach(section => {
    section.classList.add('hidden');
  });
  document.getElementById(`section-${sectionId}`).classList.remove('hidden');
}

// Load partners
async function loadPartners() {
  try {
    const response = await fetch('/api/admin/partners');
    const partners = await response.json();
    renderPartnersTable(partners);
  } catch (error) {
    console.error('Error loading partners:', error);
    partnersTableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: red;">Error loading partners</td></tr>';
  }
}

// Render partners table
function renderPartnersTable(partners) {
  if (partners.length === 0) {
    partnersTableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No partners found. Click "Add Partner" to create one.</td></tr>';
    return;
  }
  
  partnersTableBody.innerHTML = partners.map(partner => `
    <tr>
      <td>
        <img src="${partner.image_url || 'https://via.placeholder.com/50x50?text=?'}" 
             alt="${partner.name_en}"
             onerror="this.src='https://via.placeholder.com/50x50?text=?'">
      </td>
      <td>
        <strong>${partner.name_en}</strong>
        ${partner.name_fa ? `<br><small style="color: var(--text-muted);">${partner.name_fa}</small>` : ''}
      </td>
      <td>
        <span style="text-transform: capitalize;">${partner.partner_type}</span>
      </td>
      <td>
        <span class="status-badge ${partner.is_active ? 'status-active' : 'status-inactive'}">
          ${partner.is_active ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td>${partner.display_order}</td>
      <td>
        <div class="action-btns">
          <button class="action-btn action-btn-edit" onclick="editPartner(${partner.id})" title="Edit">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button class="action-btn action-btn-toggle" onclick="togglePartner(${partner.id})" title="Toggle Status">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </button>
          <button class="action-btn action-btn-delete" onclick="deletePartner(${partner.id})" title="Delete">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              <line x1="10" y1="11" x2="10" y2="17"/>
              <line x1="14" y1="11" x2="14" y2="17"/>
            </svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

// Open partner modal
function openPartnerModal(partner = null) {
  isEditing = !!partner;
  currentPartnerId = partner ? partner.id : null;
  
  modalTitle.textContent = isEditing ? 'Edit Partner' : 'Add Partner';
  
  // Reset form
  partnerForm.reset();
  
  // Reset tabs to English
  document.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
  document.querySelector('.modal-tab[data-lang="en"]').classList.add('active');
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  document.querySelector('.tab-content[data-lang="en"]').classList.add('active');
  
  if (partner) {
    // Fill form with partner data
    document.getElementById('partner-id').value = partner.id;
    document.getElementById('partner-type').value = partner.partner_type || 'organization';
    document.getElementById('partner-order').value = partner.display_order || 0;
    document.getElementById('partner-website').value = partner.website_url || '';
    document.getElementById('partner-image-url').value = partner.image_url || '';
    document.getElementById('partner-active').checked = partner.is_active;
    
    // Fill language fields
    const langs = ['en', 'fa', 'tr', 'az', 'ar', 'zh', 'es'];
    langs.forEach(lang => {
      document.getElementById(`name-${lang}`).value = partner[`name_${lang}`] || '';
      document.getElementById(`desc-${lang}`).value = partner[`description_${lang}`] || '';
    });
  }
  
  partnerModal.classList.add('show');
}

// Close partner modal
function closePartnerModal() {
  partnerModal.classList.remove('show');
  currentPartnerId = null;
  isEditing = false;
}

// Save partner
async function savePartner() {
  const formData = new FormData();
  
  // Basic fields
  formData.append('partner_type', document.getElementById('partner-type').value);
  formData.append('display_order', document.getElementById('partner-order').value);
  formData.append('website_url', document.getElementById('partner-website').value);
  formData.append('image_url', document.getElementById('partner-image-url').value);
  formData.append('is_active', document.getElementById('partner-active').checked);
  
  // Image file
  const imageFile = document.getElementById('partner-image').files[0];
  if (imageFile) {
    formData.append('image', imageFile);
  }
  
  // Language fields
  const langs = ['en', 'fa', 'tr', 'az', 'ar', 'zh', 'es'];
  langs.forEach(lang => {
    formData.append(`name_${lang}`, document.getElementById(`name-${lang}`).value);
    formData.append(`description_${lang}`, document.getElementById(`desc-${lang}`).value);
  });
  
  try {
    const url = isEditing ? `/api/admin/partners/${currentPartnerId}` : '/api/admin/partners';
    const method = isEditing ? 'PUT' : 'POST';
    
    const response = await fetch(url, {
      method: method,
      body: formData
    });
    
    const data = await response.json();
    
    if (data.success) {
      closePartnerModal();
      loadPartners();
      showAlert(partnersAlert, `Partner ${isEditing ? 'updated' : 'created'} successfully!`, 'success');
    } else {
      showAlert(partnersAlert, data.message || 'Error saving partner', 'error');
    }
  } catch (error) {
    console.error('Error saving partner:', error);
    showAlert(partnersAlert, 'Error saving partner. Please try again.', 'error');
  }
}

// Edit partner
async function editPartner(id) {
  try {
    const response = await fetch(`/api/partners/${id}`);
    const partner = await response.json();
    openPartnerModal(partner);
  } catch (error) {
    console.error('Error loading partner:', error);
    showAlert(partnersAlert, 'Error loading partner data', 'error');
  }
}

// Toggle partner status
async function togglePartner(id) {
  try {
    const response = await fetch(`/api/admin/partners/${id}/toggle`, {
      method: 'PATCH'
    });
    
    const data = await response.json();
    
    if (data.success) {
      loadPartners();
      showAlert(partnersAlert, `Partner ${data.is_active ? 'activated' : 'deactivated'} successfully!`, 'success');
    }
  } catch (error) {
    console.error('Error toggling partner:', error);
    showAlert(partnersAlert, 'Error updating partner status', 'error');
  }
}

// Delete partner
function deletePartner(id) {
  document.getElementById('delete-partner-id').value = id;
  deleteModal.classList.add('show');
}

// Close delete modal
function closeDeleteModal() {
  deleteModal.classList.remove('show');
  document.getElementById('delete-partner-id').value = '';
}

// Confirm delete
async function confirmDelete() {
  const id = document.getElementById('delete-partner-id').value;
  
  try {
    const response = await fetch(`/api/admin/partners/${id}`, {
      method: 'DELETE'
    });
    
    const data = await response.json();
    
    if (data.success) {
      closeDeleteModal();
      loadPartners();
      showAlert(partnersAlert, 'Partner deleted successfully!', 'success');
    }
  } catch (error) {
    console.error('Error deleting partner:', error);
    showAlert(partnersAlert, 'Error deleting partner', 'error');
  }
}

// Change password handler
async function handleChangePassword(e) {
  e.preventDefault();
  
  const currentPassword = document.getElementById('current-password').value;
  const newPassword = document.getElementById('new-password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  
  if (newPassword !== confirmPassword) {
    showAlert(settingsAlert, 'New passwords do not match', 'error');
    return;
  }
  
  if (newPassword.length < 6) {
    showAlert(settingsAlert, 'Password must be at least 6 characters', 'error');
    return;
  }
  
  try {
    const response = await fetch('/api/admin/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword })
    });
    
    const data = await response.json();
    
    if (data.success) {
      showAlert(settingsAlert, 'Password changed successfully!', 'success');
      changePasswordForm.reset();
    } else {
      showAlert(settingsAlert, data.message || 'Error changing password', 'error');
    }
  } catch (error) {
    console.error('Error changing password:', error);
    showAlert(settingsAlert, 'Error changing password. Please try again.', 'error');
  }
}

// Show alert
function showAlert(container, message, type) {
  container.innerHTML = `
    <div class="alert alert-${type}">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        ${type === 'success' 
          ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>'
          : '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'}
      </svg>
      ${message}
    </div>
  `;
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    container.innerHTML = '';
  }, 5000);
}

// Make functions globally available
window.editPartner = editPartner;
window.togglePartner = togglePartner;
window.deletePartner = deletePartner;