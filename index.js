document.getElementById('year').textContent = new Date().getFullYear();

// mobile menu
const toggle = document.getElementById('menuToggle');
const menu = document.getElementById('mobileMenu');
toggle.setAttribute('aria-expanded', 'false');
toggle.setAttribute('aria-controls', 'mobileMenu');
toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
});
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
}));

// reveal on scroll
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));

// active nav link tracking
const navSections = ['home', 'about', 'impact', 'films', 'thinking', 'contact']
    .map(id => document.getElementById(id))
    .filter(Boolean);
const navLinks = document.querySelectorAll('nav.links a[href^="#"], .mobile-menu a[href^="#"]');
const setActiveLink = (id) => {
    navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + id);
    });
};
const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) setActiveLink(entry.target.id);
    });
}, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
navSections.forEach(sec => navObserver.observe(sec));
// contact form -> mailto
const note = document.getElementById('formNote');
note.style.display = 'none';
const form = document.getElementById('contactForm');
const btn_email = document.getElementById('btn-email');

form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Read the values once into your variables
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Prepare the payload for the EmailJS HTTP API
    const data = {
        service_id: 'service_my9ow9s',
        template_id: 'template_l2n54xk',
        user_id: '3YMWYOoTJjeQaKm4P',
        template_params: {
            'name': name,
            'email': email,
            'message': message
        }
    };

    // Send the HTTP POST request
    sendEmail(data);
});

async function sendEmail(data) {
    btn_email.disabled = true;
    btn_email.textContent = 'Sending...';

    try {
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            note.innerText = 'Email sent successfully!';
            note.style.display = 'block';
            form.reset();
        } else {
            note.innerText = 'Failed to send email. Please try again later.';
            note.style.display = 'block';
        }
    } catch (error) {
        console.error('Error:', error);
        note.innerText = 'An error occurred. Please check your connection.';
        note.style.display = 'block';
    } finally {
        btn_email.disabled = false;
        btn_email.textContent = 'Send Message';
        setTimeout(() => {
            note.style.display = 'none';
        }, 5000);
    }
}

// essay reader modal
const essayModal = document.getElementById('essayModal');
const essayModalBody = document.getElementById('essayModalBody');
const essayClose = document.getElementById('essayClose');
let lastFocused = null;

function openEssay(id) {
    const tpl = document.getElementById(id);
    if (!tpl) return;
    essayModalBody.innerHTML = '';
    essayModalBody.appendChild(tpl.content.cloneNode(true));
    lastFocused = document.activeElement;
    essayModal.classList.add('open');
    document.body.classList.add('modal-open');
    essayModal.scrollTop = 0;
    essayClose.focus();
}

function closeEssay() {
    essayModal.classList.remove('open');
    document.body.classList.remove('modal-open');
    if (lastFocused) lastFocused.focus();
}

document.querySelectorAll('.think-row[data-essay]').forEach(row => {
    row.addEventListener('click', () => openEssay(row.getAttribute('data-essay')));
});

essayClose.addEventListener('click', closeEssay);
essayModal.addEventListener('click', (e) => {
    if (e.target === essayModal) closeEssay();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && essayModal.classList.contains('open')) closeEssay();
});

