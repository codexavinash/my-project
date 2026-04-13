// ===== PRELOADER =====
window.addEventListener('load', () => {
    setTimeout(() => document.getElementById('preloader').classList.add('hidden'), 800);
});

// ===== CUSTOM CURSOR =====
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

function animateCursor() {
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    if (dot) { dot.style.left = mx - 4 + 'px'; dot.style.top = my - 4 + 'px'; }
    if (ring) { ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; }
    requestAnimationFrame(animateCursor);
}
animateCursor();

// Scale cursor on interactive elements
document.querySelectorAll('a, button, input, textarea, .explore-card, .gallery-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
        if (dot) dot.style.transform = 'scale(2)';
        if (ring) ring.style.transform = 'translate(-50%,-50%) scale(1.6)';
    });
    el.addEventListener('mouseleave', () => {
        if (dot) dot.style.transform = 'scale(1)';
        if (ring) ring.style.transform = 'translate(-50%,-50%) scale(1)';
    });
});

// ===== HERO PARTICLES =====
(function createParticles() {
    const container = document.getElementById('hero-particles');
    if (!container) return;
    for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.classList.add('particle');
        p.style.left = Math.random() * 100 + '%';
        p.style.top = Math.random() * 100 + '%';
        p.style.animationDelay = Math.random() * 6 + 's';
        p.style.animationDuration = 4 + Math.random() * 4 + 's';
        p.style.width = p.style.height = 2 + Math.random() * 4 + 'px';
        container.appendChild(p);
    }
})();

// ===== NAVBAR =====
const nav = document.getElementById('main-nav');
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.querySelector('.nav-links');
const allNavLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
});

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.classList.toggle('active');
});

allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
    });
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 200;
    sections.forEach(sec => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        const id = sec.getAttribute('id');
        const link = document.querySelector('.nav-link[href="#' + id + '"]');
        if (link) {
            link.classList.toggle('active', scrollY >= top && scrollY < top + height);
        }
    });
});

// ===== SCROLL REVEAL =====
const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = getComputedStyle(entry.target).getPropertyValue('--delay') || '0s';
            entry.target.style.transitionDelay = delay;
            entry.target.classList.add('revealed');
        }
    });
}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

// ===== STAT COUNTER =====
function formatNumber(n) {
    if (n >= 1e12) return (n / 1e12).toFixed(1) + 'T';
    if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B';
    if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
    return n.toString();
}

const statNums = document.querySelectorAll('.stat-num');
let statsCounted = false;

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !statsCounted) {
            statsCounted = true;
            statNums.forEach(num => {
                const target = parseInt(num.dataset.target);
                const duration = 2000;
                const start = performance.now();
                function update(now) {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const current = Math.floor(eased * target);
                    num.textContent = formatNumber(current);
                    if (progress < 1) requestAnimationFrame(update);
                    else num.textContent = formatNumber(target);
                }
                requestAnimationFrame(update);
            });
        }
    });
}, { threshold: 0.3 });

const statsSection = document.getElementById('stats');
if (statsSection) statsObserver.observe(statsSection);

// ===== BACK TO TOP =====
const backBtn = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
    backBtn.classList.toggle('visible', window.scrollY > 600);
});
backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ===== MESSAGE INBOX SYSTEM =====
function getMessages() {
    return JSON.parse(localStorage.getItem('earthpulse_messages') || '[]');
}

function saveMessages(msgs) {
    localStorage.setItem('earthpulse_messages', JSON.stringify(msgs));
}

function toggleInbox(e) {
    if (e) e.preventDefault();
    const panel = document.getElementById('inbox-panel');
    const overlay = document.getElementById('inbox-overlay');
    const isOpen = panel.classList.contains('open');
    panel.classList.toggle('open');
    overlay.classList.toggle('open');
    if (!isOpen) renderInbox();
}

function renderInbox() {
    const msgs = getMessages();
    const container = document.getElementById('inbox-messages');
    const emptyState = document.getElementById('inbox-empty');
    const countEl = document.getElementById('msg-count');
    const badge = document.getElementById('inbox-badge');

    countEl.textContent = msgs.length;

    // Update badge
    if (msgs.length > 0) {
        badge.textContent = msgs.length;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }

    if (msgs.length === 0) {
        container.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');
    container.innerHTML = msgs.map((msg, i) => `
        <div class="msg-card" id="msg-${i}">
            <div class="msg-card-header">
                <div>
                    <div class="msg-sender">${escapeHtml(msg.name)}</div>
                    <div class="msg-email">${escapeHtml(msg.email)}</div>
                </div>
                <button class="msg-delete" onclick="deleteMessage(${i})" title="Delete message">✕</button>
            </div>
            <div class="msg-body">${escapeHtml(msg.message || 'No message body')}</div>
            <div class="msg-time">${msg.time}</div>
        </div>
    `).reverse().join('');
}

function deleteMessage(index) {
    const msgs = getMessages();
    msgs.splice(index, 1);
    saveMessages(msgs);
    renderInbox();
}

function clearInbox() {
    if (confirm('Delete all messages?')) {
        saveMessages([]);
        renderInbox();
    }
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Init badge on load
(function initBadge() {
    const msgs = getMessages();
    const badge = document.getElementById('inbox-badge');
    if (msgs.length > 0) {
        badge.textContent = msgs.length;
        badge.classList.remove('hidden');
    }
})();

// ===== CONTACT FORM =====
document.getElementById('contact-form').addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email) return;

    const msgs = getMessages();
    msgs.push({
        name,
        email,
        message,
        time: new Date().toLocaleString()
    });
    saveMessages(msgs);

    // Update badge
    const badge = document.getElementById('inbox-badge');
    badge.textContent = msgs.length;
    badge.classList.remove('hidden');

    const btn = document.getElementById('submit-btn');
    btn.innerHTML = '✓ Message Sent!';
    btn.style.background = 'linear-gradient(135deg, #059669, #047857)';
    setTimeout(() => {
        btn.innerHTML = 'Send Message <span class="btn-arrow">→</span>';
        btn.style.background = '';
        e.target.reset();
    }, 3000);
});

// ===== SMOOTH PARALLAX ON SCROLL =====
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const heroImg = document.querySelector('.hero-bg img');
    if (heroImg && scrolled < window.innerHeight) {
        heroImg.style.transform = `scale(1.1) translateY(${scrolled * 0.3}px)`;
    }
});
